import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { microsites } from './scripts/microsites.mjs'

// https://vite.dev/config/
export default defineConfig({
  // Gefängnisplanet is its own document, not a view inside the portfolio
  // shell — see scripts/microsites.mjs.
  plugins: [react(), microsites()],
})
