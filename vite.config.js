// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
	  vue(),
	  VitePWA({
		registerType: 'autoUpdate', // This helps to automatically update the service worker
		manifest: {
			name: 'My PWA Vue App',
			short_name: 'VuePWA',
			theme_color: '#42b883',
			// Other manifest options...
			icons: [
				{
					src: 'pwa-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: 'pwa-512x512.png',
					sizes: '512x512',
					type: 'image/png',
				},
			],
	    },
	  }),

	  tailwindcss(),
	  vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  
  server: {    
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path // Simply pass through the path as is        
      }
    }
  }  
});

/*
export default defineConfig(({}) => {
  const config = {
    plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
    ],
  
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        '/api/v1/': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: path => path // Simply pass through the path as is        
        }      
      }    
    }  
  }
  
  console.log('Vite build target:--> ', config.server.path);

  return config;
});
*/
