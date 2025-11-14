import EditModeProvider from '@/components/cms/EditModeProvider';
import EditToggleButton from '@/components/cms/EditToggleButton';
import GlobalHeader from '@/components/GlobalHeader';
import { type ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
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
