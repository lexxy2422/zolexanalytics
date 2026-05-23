import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Development server
  server: {
    port: 3000,
    strictPort: true,
    host: true, // expose to network (needed for Docker)
    open: false,
    proxy: {
      // Proxy Anthropic API calls through the dev server to avoid CORS.
      // In production the client sends directly with the dangerous-direct-browser-calls header.
      '/api/claude': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, ''),
      },
    },
  },

  // Production build
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'oxc',
    target: 'es2020',
    rollupOptions: {
      output: {
        // Split large vendor chunks for better caching
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom')) return 'react';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Warn if any chunk exceeds 800 KB
    chunkSizeWarningLimit: 800,
  },

  // Preview server (after build)
  preview: {
    port: 3000,
    strictPort: true,
  },

  // Resolve aliases
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
