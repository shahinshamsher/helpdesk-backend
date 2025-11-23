/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: false
  }
})*/
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // optional: default is 5173
    open: true, // auto open in browser when running `npm run dev`
  },
  define: {
    'process.env': {}, // Fix for some packages expecting process.env
  },
});

