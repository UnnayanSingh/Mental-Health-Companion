/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Watch all React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
