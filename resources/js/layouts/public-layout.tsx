import OptimizedHeader from '@/components/OptimizedHeader';
import { type ReactNode } from 'react';

// Google Fonts import untuk Playfair Display
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
            {/* Optimized Header Component */}
            <OptimizedHeader />
            
            {/* Spacer for fixed header - height matches header h-16 sm:h-20 */}
            <div className="h-16 sm:h-20" />

            {/* Main Content with proper padding - Adjusted for consistent header */}
            <main className="flex-1">{children}</main>
        </div>
    );
}
