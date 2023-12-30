import { BACKEND_WS } from '@root/src/shared/config';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import App from './app';

reloadOnUpdate('pages/background');

const main = () => {
  const app = new App();
  let interval: NodeJS.Timeout;
  try {
    interval = setInterval(() => {
      if (app.open) clearInterval(interval);
      else {
        app.logger.info('Reconnecting WebSocket');
        app.ws = new WebSocket(BACKEND_WS);
        app.init();
      }
    }, 5_000);
    app.listenForChromeMessages();
  } catch (error) {
    app.logger.error("Failed to run 'main' in background script");
    console.error(error);
  }
};

main();
