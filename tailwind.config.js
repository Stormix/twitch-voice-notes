const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        muted: '#939393',
        twitch: {
          black: '#18181B',
          grey: '#636363',
          light: '#EEE2FF',
          dark: '#451093',
          DEFAULT: '#9147ff',
          background: '#2C2C31',
        },
      },
    },
  },
  plugins: [],
};
