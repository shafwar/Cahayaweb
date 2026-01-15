import { createInertiaApp, type PageProps } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { type RouteName, route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Cahaya Anbiya';

// Explicit imports for critical pages to ensure they're always available in production
const criticalPages: Record<string, () => Promise<{ default: React.ComponentType<PageProps> }>> = {
    'admin/dashboard': () => import('./pages/admin/dashboard'),
    'admin/agent-verifications': () => import('./pages/admin/agent-verifications'),
    'admin/agent-verification-detail': () => import('./pages/admin/agent-verification-detail'),
};

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => {
            // Try critical pages first (explicit imports for production reliability)
            if (criticalPages[name]) {
                return criticalPages[name]();
            }
            // Fallback to dynamic glob for other pages
            return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx', { eager: false }));
        },
        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    // @ts-expect-error
                    ...page.props.ziggy,
                    // @ts-expect-error
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return <App {...props} />;
        },
    }),
);
