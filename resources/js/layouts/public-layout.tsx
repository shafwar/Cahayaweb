import { B2CHeader } from '@/components/header/B2CHeader';
import { type ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-white">
            <B2CHeader />
            <main className="w-full">{children}</main>
        </div>
    );
}
