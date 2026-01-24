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
        // Optimize chunk size
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React - loaded first
                    vendor: ['react', 'react-dom'],
                    // Inertia - separate chunk
                    inertia: ['@inertiajs/react'],
                    // Framer Motion - lazy loaded, separate chunk
                    'framer-motion': ['framer-motion'],
                    // UI Libraries - separate chunk
                    'radix-ui': [
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-select',
                        '@radix-ui/react-tooltip',
                    ],
                    // Lucide icons - separate chunk
                    'lucide': ['lucide-react'],
                },
            },
        },
        // Ensure all dynamic imports are included in production build
        commonjsOptions: {
            include: [/node_modules/],
        },
    },
    esbuild: {
        jsx: 'automatic',
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
