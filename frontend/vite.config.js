import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/wjl/',
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/wjlapi': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/login.html': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
});
