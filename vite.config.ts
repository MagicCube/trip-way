import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/trip-way',
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    host: '0.0.0.0',
    https: true,
    open: 'https://localhost:3000/trip-way',
  },
});
