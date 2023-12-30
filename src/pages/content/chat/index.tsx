import ChatMessage from '@pages/content/chat/message';
import { Logger } from '@root/src/shared/logger';
import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import { Payload, VoiceNote } from '../../background/type';
import injectedStyle from './injected.css?inline';

refreshOnUpdate('pages/content');

const logger = new Logger('VoiceMessage');
const createContainer = () => {
  const root = document.createElement('div');
  const shadowRoot = root.attachShadow({ mode: 'open' });
  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';
  shadowRoot.appendChild(rootIntoShadow);
  const styleElement = document.createElement('style');
  styleElement.innerHTML = injectedStyle;
  shadowRoot.appendChild(styleElement);
  return { root, rootIntoShadow };
};

const injectMessage = (voiceNote: VoiceNote) => {
  logger.info(`Received a voice note from ${voiceNote.author}, injecting...`);

  const normalContainer = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"]');
  const seventTvContainer = document.querySelector('main[class=seventv-chat-list]');
  const chatContainer = normalContainer || seventTvContainer;

  if (!chatContainer) logger.error('Chat container not found', 'error');
  const { root, rootIntoShadow } = createContainer();

  if (normalContainer) {
    chatContainer.appendChild(root);
  } else if (seventTvContainer) {
    chatContainer.insertBefore(root, chatContainer.lastChild);
  }

  createRoot(rootIntoShadow).render(<ChatMessage voiceNote={voiceNote} />);
};

chrome.runtime.onMessage.addListener(message => {
  const { type, payload } = message as Payload<unknown>;
  switch (type) {
    case 'voice-note':
      injectMessage(payload as VoiceNote);
      break;
  }

  return true;
});

/**
 * https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/pull/174
 *
 * In the firefox environment, the adoptedStyleSheets bug may prevent contentStyle from being applied properly.
 * Please refer to the PR link above and go back to the contentStyle.css implementation, or raise a PR if you have a better way to improve it.
 */

// createRoot(root).render(<ChatMessage />);
