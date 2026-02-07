import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    plugins: [react()],
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      },
    },
    define: {
      // 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY), // REMOVED FOR SECURITY
      // 'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) // REMOVED FOR SECURITY
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['framer-motion', 'lucide-react'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
