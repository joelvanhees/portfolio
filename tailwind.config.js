/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
