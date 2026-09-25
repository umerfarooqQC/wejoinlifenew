import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_PROXY_TARGET || env.VITE_API_URL || 'http://localhost:8080';

  return {
    plugins: [react()],
    base: '/wjl/',
    server: {
      port: parseInt(env.VITE_DEV_PORT || '3000', 10),
      host: true,
      proxy: {
        '/wjlapi': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/login.html': {
          target: proxyTarget,
          changeOrigin: true,
        }
      }
    }
  };
});
