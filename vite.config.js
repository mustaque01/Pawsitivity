import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Using Vite's built-in .env handling

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add proxy configuration for backend API
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      },
      '/create-order': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/verify-payment': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    },
    fs: {
      strict: false
    },
    hmr: {
      overlay: false
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion', 'gsap'],
          icons: ['react-icons', 'lucide-react']
        }
      }
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: false
  },
  // Asset optimization
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp'],
  define: {
    global: 'globalThis',
  },
  // Only allow environment variables with VITE_ prefix
  envPrefix: 'VITE_'
})
