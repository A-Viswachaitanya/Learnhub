/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- THIS LINE FIXES THE DARK MODE TOGGLE
  theme: {
    extend: {},
  },
  plugins: [],
}