import OptimizedHeader from '@/components/OptimizedHeader';
import { type ReactNode } from 'react';

// Google Fonts import untuk Playfair Display
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
            {/* Optimized Header Component */}
            <OptimizedHeader />

            {/* Main Content with proper padding */}
            <main className="flex-1 pt-16 lg:pt-20">{children}</main>
        </div>
    );
}
