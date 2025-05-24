/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class', // or 'media' — we use 'class' for manual toggle
  theme: {
    extend: {
      colors: {
        primary: '#00ff88',
        error: '#ff4d4f',
        success: '#10b981',
        warning: '#facc15',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
