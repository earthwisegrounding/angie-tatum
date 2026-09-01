import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// DEPLOY_BASE lets the GitHub Pages build serve from /<repo>/ while local
// dev and other hosts keep the root path.
export default defineConfig({
  base: process.env.DEPLOY_BASE || '/',
  plugins: [react()],
  server: {
    port: 5180,
  },
});
