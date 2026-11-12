import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // AKKOMMODATION replaced Gefängnisplanet as the work document. It ships as
  // plain files in public/akkommodation/ rather than through the microsite
  // plugin: at 13 MB — film, GLB, fonts, material maps — it cannot be inlined
  // into one document the way the old page was.
  //
  // scripts/microsites.mjs and microsite/gefaengnisplanet/ stay in the repo
  // untouched, but are no longer wired in, so the build stops writing
  // /gefängnisplanet/, /gefaengnisplanet/ and /prisonplanet/. Those three
  // addresses are answered by 301s in vercel.json now.
  plugins: [react()],
})
