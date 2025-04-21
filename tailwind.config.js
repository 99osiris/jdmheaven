/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'racing-red': '#FF0000',
        'midnight': '#121212',
      },
      fontFamily: {
        'zen': ['Zen Dots', 'cursive'],
      },
    },
  },
  plugins: [],
};