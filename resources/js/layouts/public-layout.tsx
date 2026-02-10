import EditModeProvider from '@/components/cms/EditModeProvider';
import EditToggleButton from '@/components/cms/EditToggleButton';
import GlobalHeader from '@/components/GlobalHeader';
import { type ReactNode, useEffect } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Enforce "select mode" splash before allowing B2C pages to render.
        // Fix: direct entry from Google to /home (incognito) should go to "/" first.
        try {
            if (typeof window === 'undefined') return;

            const sessionVisited = window.sessionStorage.getItem('cahaya-anbiya-session');
            if (sessionVisited) return;

            const path = window.location.pathname || '/';
            const search = window.location.search || '';
            const next = `${path}${search}`;

            // Avoid redirect loop if somehow PublicLayout is used on "/"
            if (path === '/') return;

            const target = `/?next=${encodeURIComponent(next)}`;
            window.location.replace(target);
        } catch {
            // If storage access fails (privacy mode edge), fall back to splash.
            try {
                if (typeof window !== 'undefined') window.location.replace('/');
            } catch {
                // ignore
            }
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
