import { EXTENSION_ID, TWITCH_CLIENT_ID } from '@root/src/shared/config';
import { Logger } from '@root/src/shared/logger';
import { TwitchOAuthValidResponse } from './type';

const CLIENT_ID = encodeURIComponent(TWITCH_CLIENT_ID);
const REDIRECT_URI = encodeURIComponent(`https://${EXTENSION_ID}.chromiumapp.org/`);
const RESPONSE_TYPE = encodeURIComponent('token id_token');
const SCOPE = encodeURIComponent('openid user:read:email');
const CLAIMS = encodeURIComponent(
  JSON.stringify({
    id_token: { email: null, email_verified: null },
  }),
);
const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));

const twitchEndpoint = () => {
  const nonce = encodeURIComponent(
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  );
  return `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&claims=${CLAIMS}&state=${STATE}&nonce=${nonce}`;
};
const logger = new Logger('Auth');

const getUserColor = async (user_id: string, access_token: string) => {
  try {
    const response = await fetch(`https://api.twitch.tv/helix/chat/color?user_id=${user_id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    const color = (await response.json()) as { data: Array<{ color: string }> };

    return color.data[0].color;
  } catch (error) {
    logger.warn('Failed to fetch user color', error);
    return '#FF69B4';
  }
};

const fetchUser = async (access_token: string) => {
  try {
    const response = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    const user = (await response.json()) as TwitchOAuthValidResponse;
    const color = await getUserColor(user.user_id, access_token);
    logger.info('Logged in as: ', user.login, color);

    return { ...user, color };
  } catch (error) {
    logger.error('Failed to fetch user', error);
    return null;
  }
};

export const auth = () => {
  return new Promise<{
    access_token: string;
    user: TwitchOAuthValidResponse;
  }>((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: twitchEndpoint(),
        interactive: true,
      },
      async redirect_url => {
        console.error(chrome.runtime.lastError);
        if (chrome.runtime.lastError || redirect_url.includes('error=access_denied')) {
          reject(chrome.runtime.lastError);
        } else {
          logger.info('User signed in.');
          const url = new URL(redirect_url);
          const searchParams = new URLSearchParams(url.hash.substring(1));
          const access_token = searchParams.get('access_token');
          if (!access_token) {
            reject('No access token found');
            return;
          }
          resolve({
            access_token,
            user: await fetchUser(access_token),
          });
        }
      },
    );
  });
};
