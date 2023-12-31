import { BACKEND_WS } from '@root/src/shared/config';
import { Logger } from '@root/src/shared/logger';
import userStorage from '@root/src/shared/storages/userStorage';
import * as Sentry from '@sentry/browser';
import { auth } from './auth';
import { Payload } from './type';

const parseIfNotParsed = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
};

class App {
  readonly logger = new Logger('Background');
  ws = new WebSocket(BACKEND_WS);
  open = false;

  init() {
    this.logger.info('App init');

    this.ws.onopen = () => {
      this.logger.info('WebSocket connected');
      this.open = true;
    };

    this.ws.onmessage = event => {
      try {
        this.logger.info('WebSocket message received', event.data);
        const message = parseIfNotParsed(parseIfNotParsed(event.data)) as Payload<unknown>;
        switch (message.type) {
          case 'voice-note':
            chrome.tabs.query({ active: true }, tabs => {
              try {
                tabs.forEach(tab => {
                  chrome.tabs.sendMessage(tab.id!, message);
                });
              } catch (error) {
                console.log('error', error);
                this.logger.warn('Error sending message to tab', error);
              }
            });
            break;
          default:
            this.logger.warn('Unknown message received', JSON.stringify(message));
        }
      } catch (error) {
        console.error('Failed to process ws: ', error);
        Sentry.captureException(error);
      }
    };

    this.ws.onclose = () => {
      this.logger.info('WebSocket closed');

      setTimeout(() => {
        this.logger.info('Reconnecting WebSocket');
        this.ws = new WebSocket(BACKEND_WS);
        this.init();
      }, 5_000);
    };
  }

  listenForChromeMessages() {
    chrome.runtime.onMessage.addListener(async message => {
      try {
        const { type } = message as Payload<unknown>;
        switch (type) {
          case 'login': {
            const { access_token, user } = await auth();
            userStorage.set({
              access_token,
              user,
            });
            break;
          }
          default:
            this.logger.warn('Unknown message received', JSON.stringify(message));
        }
      } catch (error) {
        console.error('Failed to listen for chrome messages:', error);
        Sentry.captureException(error);
      }
    });
  }
}

export default App;
