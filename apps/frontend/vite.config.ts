import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@zeronotes/shared': path.resolve(__dirname, '../../packages/shared'),
    },
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'zeronotesfrontend-production.up.railway.app',
      'localhost'
    ]
  }
});
