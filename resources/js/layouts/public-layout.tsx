import EditModeProvider from '@/components/cms/EditModeProvider';
import EditToggleButton from '@/components/cms/EditToggleButton';
import GlobalHeader from '@/components/GlobalHeader';
import { type ReactNode, useEffect } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Enforce "select mode" splash before allowing B2C pages to render.
        // Fix: direct entry from Google to /home (incognito) should go to "/" first.
        // IMPORTANT: Allow Googlebot, search engines, and visitors from Google to access pages directly
        try {
            if (typeof window === 'undefined') return;

            // Check if this is a search engine bot (Googlebot, Bingbot, etc.)
            const userAgent = navigator.userAgent.toLowerCase();
            const isSearchEngineBot = 
                userAgent.includes('googlebot') || 
                userAgent.includes('bingbot') || 
                userAgent.includes('slurp') || 
                userAgent.includes('duckduckbot') ||
                userAgent.includes('baiduspider') ||
                userAgent.includes('yandexbot') ||
                userAgent.includes('facebookexternalhit') ||
                userAgent.includes('twitterbot');

            // Check if visitor came from Google search (referrer check)
            const referrer = document.referrer.toLowerCase();
            const isFromGoogleSearch = referrer.includes('google.com/search') || 
                                      referrer.includes('google.co.id/search') ||
                                      referrer.includes('google.') && referrer.includes('/search');

            // Allow search engines and Google search visitors to access pages directly without redirect
            // This ensures Google search results work properly
            if (isSearchEngineBot || isFromGoogleSearch) {
                // Set session so they don't get redirected on subsequent navigation
                try {
                    window.sessionStorage.setItem('cahaya-anbiya-session', 'true');
                } catch {
                    // Ignore if storage not available
                }
                return;
            }

            const sessionVisited = window.sessionStorage.getItem('cahaya-anbiya-session');
            if (sessionVisited) return;

            const path = window.location.pathname || '/';
            const search = window.location.search || '';
            const next = `${path}${search}`;

            // Avoid redirect loop if somehow PublicLayout is used on "/"
            if (path === '/') return;

            // Delay redirect to allow page to render first (prevents blank page)
            // This gives time for content to load before redirect happens
            const redirectTimer = setTimeout(() => {
                try {
                    const target = `/?next=${encodeURIComponent(next)}`;
                    window.location.replace(target);
                } catch {
                    // If redirect fails, allow page to render
                }
            }, 500); // Delay to allow initial render and prevent blank page

            return () => clearTimeout(redirectTimer);
        } catch {
            // If storage access fails (privacy mode edge), allow page to render
            // Don't force redirect on error - let user see the page
        }
    }, []);

    return (
        <EditModeProvider>
            <div className="min-h-screen bg-white">
                <GlobalHeader variant="b2c" />
                <main className="w-full">{children}</main>
                <EditToggleButton />
            </div>
        </EditModeProvider>
    );
}
