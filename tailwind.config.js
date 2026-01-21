/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'syne': ['Syne', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
        // Hier ist dein neuer Font:
        'rubik': ['Rubik80sFade', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}