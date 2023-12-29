import packageJson from './package.json' assert { type: 'json' };

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  name: 'Dwi - Twitch voice notes',
  version: packageJson.version,
  description: packageJson.description,
  permissions: ['storage'],
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png',
  },
  chrome_url_overrides: {},
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['*://*.twitch.tv/*'],
      js: ['src/pages/content/index.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq2xgpYHmbbKLljk83Fh9Qjeq44zTz2flrmUQlJgul8ZlzjKCzCoTJzoKipYydiVglSW00jadGV8bEIgvW4OuNX1GyAlnZzPOS1qECwEdjylacvs/mLOJ4xhV568OC69OUEY5rF59ypdo1CwL0wwcz7C4rUZF/wSncutN84nxJNUOtepRE3Agrj0Gv8j3bOFC6gRh0MjL3tc4Ii90wIRTN6+VSghBvRKJI5CfKBxPeZZNvgQB80t8+tk5043I3GiyLWveokiaM7PrlDUeRXzou1nX1ZXI1ZWoEzx2CmL8Lf/2Ovkn7JHTOHh4vKx2hFcydtjh0aHgDryjFqjuaYhjfQIDAQAB',
};

export default manifest;
