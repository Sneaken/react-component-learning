/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
      {
        find: '@tests',
        replacement: resolve(__dirname, 'tests'),
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
