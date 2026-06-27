/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rose-gold': '#C9956C',
        'soft-pink': '#F2D1C9',
        'deep-plum': '#4A1942',
        'cream': '#FDF6F0',
        'dark-text': '#1A1A1A',
      },
      fontFamily: {
        arabic: ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
