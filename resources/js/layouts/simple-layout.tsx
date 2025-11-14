import { type ReactNode } from 'react';

interface SimpleLayoutProps {
    children: ReactNode;
    breadcrumbs?: any[];
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <main className="flex-1 overflow-x-hidden p-4">{children}</main>
        </div>
    );
}
