import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    root: './',
    publicDir: 'public',
    build: {
        outDir: 'dist/client',
        emptyOutDir: true
    },
    server: {
        host: true,
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
});
