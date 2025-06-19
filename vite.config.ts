/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  test: { // Vitest configuration
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // Path to setup file
    css: true, // If you need to process CSS in tests (e.g. for component styling)
    // Optional: configure coverage
    // coverage: {
    //   reporter: ['text', 'json', 'html'],
    //   provider: 'v8', // or 'istanbul'
    // },
  },
});
