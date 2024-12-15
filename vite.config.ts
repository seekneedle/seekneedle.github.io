import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/askRag/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      }
    }
  },
  server: {
    proxy: {
      '/user/login': {
        target: 'http://8.152.213.191:8989',
        changeOrigin: true,
        rewrite: (path) => {
          return path;
          //console.log('Proxy rewriting path:', path);
          //return path.replace(/^\/user/, '');
        },
        // Add these for more debugging
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', {
              method: req.method,
              url: req.url,
              headers: req.headers
            });
          });
        }
      },
      '/vector_store/query': {
        target: 'http://8.152.213.191:8471',
        changeOrigin: true
      },

      '/vector_store/stream_query': {
        target: 'http://8.152.213.191:8471',
        changeOrigin: true
      },
      '/api/v1/tts': {
        target: 'https://openspeech.bytedance.com',
        changeOrigin: true
      }
    },
    headers: {
      'Referrer-Policy': 'no-referrer-when-downgrade'
    }
  }
})