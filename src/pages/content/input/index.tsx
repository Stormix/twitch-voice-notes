import VoiceInput from '@pages/content/input/voice-input';
import { Logger } from '@root/src/shared/logger';
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectedStyle from './injected.css?inline';

refreshOnUpdate('pages/content');

let interval = undefined;
const logger = new Logger('VoiceInput');

const injectVoiceInput = () => {
  if (document.querySelector('#voice-input')) return;

  // Get nth parent
  const nthParent = (element: HTMLElement, n: number) => {
    if (n === 0) return element;
    return nthParent(element.parentElement!, n - 1);
  };

  const chatInputContainer = nthParent(document.querySelector('.chat-input__textarea'), 2) as HTMLDivElement;

  chatInputContainer.style.setProperty('display', 'flex', 'important');
  chatInputContainer.style.flexDirection = 'row';
  chatInputContainer.style.gap = '1rem';
  chatInputContainer.style.alignItems = 'center';

  const chatInput = nthParent(document.querySelector('.chat-input__textarea'), 1) as HTMLDivElement;
  chatInput.style.flexGrow = '1';

  const root = document.createElement('div');
  root.id = 'voice-input';

  chatInputContainer.prepend(root);

  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';

  const shadowRoot = root.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(rootIntoShadow);

  /** Inject styles into shadow dom */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = injectedStyle;
  shadowRoot.appendChild(styleElement);

  createRoot(rootIntoShadow).render(<VoiceInput />);
};

const registerInjector = () => {
  logger.info('Registering injector');

  injectVoiceInput();

  interval = setInterval(() => {
    logger.info('Checking for voice input: ', document.querySelector('#voice-input') ? 'found' : 'not found');
    if (interval && document.querySelector('#voice-input')) clearInterval(interval);
    injectVoiceInput();
  }, 5_000);
};

const currentUrl = new URL(window.location.href);

// Watch for url changes
const observer = new MutationObserver(() => {
  const newUrl = new URL(window.location.href);
  if (currentUrl.pathname !== newUrl.pathname) {
    logger.info('Url changed, re-registering injector');
    currentUrl.pathname = newUrl.pathname;
    registerInjector();
  }
});

observer.observe(document.querySelector('body')!, { childList: true, subtree: true });

registerInjector();
