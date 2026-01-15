import { createInertiaApp, type PageProps } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { route, type RouteName } from 'ziggy-js';

// Pre-import critical admin pages for SSR
import AdminAgentVerificationDetail from './pages/admin/agent-verification-detail';
import AdminAgentVerifications from './pages/admin/agent-verifications';
import AdminDashboard from './pages/admin/dashboard';

const appName = import.meta.env.VITE_APP_NAME || 'Cahaya Anbiya';

// Map of critical pages with their pre-imported components
const criticalPages: Record<string, React.ComponentType<PageProps>> = {
    'admin/dashboard': AdminDashboard,
    'admin/agent-verifications': AdminAgentVerifications,
    'admin/agent-verification-detail': AdminAgentVerificationDetail,
};

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => {
            // Try critical pages first (pre-imported for production reliability)
            if (criticalPages[name]) {
                return Promise.resolve(criticalPages[name]);
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
