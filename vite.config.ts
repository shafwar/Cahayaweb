import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        manifest: true,
        outDir: 'public/build',
        emptyOutDir: true,
        chunkSizeWarningLimit: 500,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (!id.includes('node_modules')) return;
                    if (id.includes('framer-motion')) return 'framer';
                    if (id.includes('@inertiajs')) return 'inertia';
                    if (id.includes('lucide-react')) return 'icons';
                    if (id.includes('react-dom') || id.includes('/node_modules/react/')) return 'react-vendor';
                    return 'vendor';
                },
            },
        },
        commonjsOptions: {
            include: [/node_modules/],
        },
    },
    esbuild: {
        jsx: 'automatic',
        drop: ['console', 'debugger'], // Remove console.log and debugger in production
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    server: {
        hmr: {
            host: 'localhost',
        },
    },
    base: '/build/',
});
