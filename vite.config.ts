/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: resolve(__dirname, 'src/'),
      },
      {
        find: '@tests',
        replacement: resolve(__dirname, 'tests'),
      },
    ],
  },

  plugins: [react()],
});
