import EditModeProvider from '@/components/cms/EditModeProvider';
import EditToggleButton from '@/components/cms/EditToggleButton';
import GlobalHeader from '@/components/GlobalHeader';
import { type ReactNode } from 'react';

type PublicLayoutProps = {
    children: ReactNode;
    /** Hides floating edit toggle and header CMS edit/save controls (e.g. B2C registration). */
    hideCmsChrome?: boolean;
};

export default function PublicLayout({ children, hideCmsChrome = false }: PublicLayoutProps) {
    return (
        <EditModeProvider>
            <div className="min-h-screen bg-background">
                <GlobalHeader variant="b2c" hideEditControls={hideCmsChrome} />
                <main className="w-full">{children}</main>
                {!hideCmsChrome ? <EditToggleButton /> : null}
            </div>
        </EditModeProvider>
    );
}
