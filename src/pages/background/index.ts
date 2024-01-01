import { BACKEND_WS } from '@root/src/shared/config';
import * as Sentry from '@sentry/browser';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import App from './app';
import './sentry';

reloadOnUpdate('pages/background');

const main = () => {
  const app = new App();
  let interval = null;
  try {
    app.init();
    app.listenForChromeMessages();

    interval = setInterval(() => {
      if (app.ws.readyState === WebSocket.OPEN) return;
      app.logger.info('Reconnecting WebSocket');
      app.ws = new WebSocket(BACKEND_WS);
      app.init();
    }, 25_000);
  } catch (error) {
    app.logger.error("Failed to run 'main' in background script");
    console.error(error);
    clearInterval(interval);
    Sentry.captureException(error);
  }
};

main();
