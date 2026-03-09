import '../css/app.css';

import { createInertiaApp, type PageProps } from '@inertiajs/react';
import axios from 'axios';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Cahaya Anbiya';

import B2CHomePage from './pages/b2c/home';
import SelectModePage from './pages/landing/select-mode';
const criticalPages: Record<string, React.ComponentType<PageProps>> = {
    'landing/select-mode': SelectModePage,
    'b2c/home': B2CHomePage,
};

if (typeof window !== 'undefined') {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }
    axios.defaults.withCredentials = true;

    if (window.location.protocol === 'https:') {
        const origFetch = window.fetch;
        window.fetch = function (url, opts) {
            if (typeof url === 'string' && url.startsWith('http://')) url = url.replace('http://', 'https://');
            else if (url instanceof Request && url.url.startsWith('http://')) url = new Request(url.url.replace('http://', 'https://'), url);
            return origFetch(url as RequestInfo | URL, opts);
        };

        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method: string, url: string | URL, ...args: any[]) {
            if (typeof url === 'string' && url.startsWith('http://')) url = url.replace('http://', 'https://');
            else if (url instanceof URL && url.protocol === 'http:') url.protocol = 'https:';
            return origOpen.call(this, method, url, ...args);
        };

        const fixZiggy = () => {
            const z = (window as any).Ziggy;
            if (z?.url?.startsWith('http://')) z.url = z.url.replace('http://', 'https://');
        };
        fixZiggy();
        setTimeout(fixZiggy, 100);
    }
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const critical = criticalPages[name];
        if (critical) return Promise.resolve(critical);

        const pages = import.meta.glob('./pages/**/*.tsx', { eager: false });
        return resolvePageComponent(`./pages/${name}.tsx`, pages);
    },
    setup({ el, App, props }) {
        if (!el) {
            el = document.getElementById('app') || document.querySelector('[data-page]') as HTMLElement;
        }
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#BC8E2E',
    },
});

initializeTheme();
