import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  const config = {
    plugins: [
      vue(),
      tailwindcss(),
      vueDevTools()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem'))
      },
      port: 5173,
      host: true, // Listen on all addresses
      proxy: {
        '/api/v1': {
          target: 'https://localhost:8080',
          changeOrigin: true,
          secure: false, // Accept self-signed certificates
          rewrite: path => path
        }
      }
    }
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Vite dev server running on HTTPS');
    console.log('🔗 Proxy configured:', config.server.proxy);
  }

  return config;
});