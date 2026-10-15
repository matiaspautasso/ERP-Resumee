import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The API base the dev server and preview proxy forward `/api/*` to.
// Overridable via VITE_API_URL (used by the E2E suite and CI).
const API_TARGET = process.env.VITE_API_URL ?? 'http://localhost:3000';

const proxy = {
  '/api': {
    target: API_TARGET,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy },
  preview: { port: 4173, proxy },
});
