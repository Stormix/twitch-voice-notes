import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import App from './app';

reloadOnUpdate('pages/background');

const main = () => {
  try {
    const app = new App();
    app.init();
    app.listenForChromeMessages();
  } catch (error) {
    // log.error("Failed to run 'main' in background script");
    // console.error(error);
    // IGNORE FOR NOW
  }
};

main();
