/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Signal Acid — the one accent. A signal, never a rainbow.
        acid: {
          DEFAULT: '#C7FF2E',
          light: '#D9FF73', // hover text on dark
          dark: '#9FCC25',  // pressed / hover fill
          deep: '#3F5410',  // hairlines and dividers on Carbon
        },
      },
      fontFamily: {
        // Identity System V03.1 — two voices.
        // DISPLAY / Arial Bold 700 — headlines, modes, chapters, statements.
        'display': ['Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
        // TEXT / Arial Regular + Bold — quotes, body copy, cases, interfaces.
        'text': ['Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
        // META / SF Mono — labels, status, numbering. Falls back per platform.
        'meta': ['SF Mono', 'SFMono-Regular', 'ui-monospace', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
        // Display face of the VISUAL STORYTELLER lettering — kept as set.
        'rubik': ['Rubik80sFade', 'Arial', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
