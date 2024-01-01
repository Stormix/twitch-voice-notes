import '@pages/popup/index.css';
import Popup from '@pages/popup/Popup';
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/popup');

const init = () => {
  const appContainer = document.querySelector('body');
  const root = createRoot(appContainer);
  root.render(<Popup />);
};

init();
