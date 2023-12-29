import Popup from '@pages/popup/Popup';
import '@pages/popup/index.css';
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/popup');

function init() {
  const appContainer = document.querySelector('body');
  const root = createRoot(appContainer);
  root.render(<Popup />);
}

init();
