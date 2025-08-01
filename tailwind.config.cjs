/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#003366',
        secondary: '#006699',
        accent: '#00ccff'
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
