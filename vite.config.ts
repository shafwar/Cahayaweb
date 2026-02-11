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
        // Optimize chunk size - more aggressive splitting
        chunkSizeWarningLimit: 300,
        minify: 'esbuild', // Use esbuild for faster builds
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Core React - loaded first
                    if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                        return 'vendor';
                    }
                    // Inertia - separate chunk
                    if (id.includes('node_modules/@inertiajs')) {
                        return 'inertia';
                    }
                    // Framer Motion - lazy loaded, separate chunk
                    if (id.includes('node_modules/framer-motion')) {
                        return 'framer-motion';
                    }
                    // UI Libraries - separate chunk
                    if (id.includes('node_modules/@radix-ui')) {
                        return 'radix-ui';
                    }
                    // Lucide icons - separate chunk
                    if (id.includes('node_modules/lucide-react')) {
                        return 'lucide';
                    }
                    // Axios - separate chunk
                    if (id.includes('node_modules/axios')) {
                        return 'axios';
                    }
                    // Other large node_modules
                    if (id.includes('node_modules')) {
                        return 'vendor-other';
                    }
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
