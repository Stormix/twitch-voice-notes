import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import App from './app';

reloadOnUpdate('pages/background');

const main = () => {
  const app = new App();
  try {
    app.init();
    app.listenForChromeMessages();
  } catch (error) {
    app.logger.error("Failed to run 'main' in background script");
    console.error(error);
  }
};

main();
