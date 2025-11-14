import { EditableText } from '@/components/cms';
import EditModeProvider from '@/components/cms/EditModeProvider';
import EditToggleButton from '@/components/cms/EditToggleButton';
import GlobalHeader from '@/components/GlobalHeader';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link, usePage } from '@inertiajs/react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

// Google Fonts import untuk Playfair Display
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

export default function B2BLayout({ children }: { children: ReactNode }) {
    const [showPackagesDialog, setShowPackagesDialog] = useState(false);
    const { sections = {} } = usePage().props as { sections?: Record<string, { content?: string; image?: string }> };

    useEffect(() => {
        const handler = () => setShowPackagesDialog(true);
        window.addEventListener('open-b2b-packages', handler as EventListener);
        return () => window.removeEventListener('open-b2b-packages', handler as EventListener);
    }, []);

    return (
        <EditModeProvider>
            <div className="flex min-h-dvh flex-col bg-background text-foreground">
                <GlobalHeader variant="b2b" />
                <B2BBreadcrumbBar />
                <main className="flex-1 overflow-x-hidden">{children}</main>
                <EditToggleButton />

                {/* Packages Dialog */}
                <Dialog open={showPackagesDialog} onOpenChange={setShowPackagesDialog}>
                    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border border-amber-500/30 bg-gradient-to-br from-amber-950 via-orange-950 to-amber-900 shadow-2xl">
                        <DialogHeader className="border-b border-amber-500/30 pb-4">
                            <DialogTitle className="bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-2xl font-bold text-transparent">
                                ✨ <EditableText sectionKey="b2b.packages_dialog.title" value="Premium Hajj & Umrah Packages" tag="span" />
                            </DialogTitle>
                            <DialogDescription className="text-gray-300">
                                <EditableText
                                    sectionKey="b2b.packages_dialog.description"
                                    value="Choose from our carefully curated packages designed to meet your spiritual journey needs"
                                    tag="span"
                                />
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                            {[
                                {
                                    id: 1,
                                    name: 'Premium Umrah Package',
                                    duration: '9 Days 8 Nights',
                                    price: 'Starting from Rp 28,500,000',
                                    features: [
                                        '5-star hotel accommodation (Makkah & Madinah)',
                                        'Direct flights with premium airlines',
                                        'Private transportation throughout',
                                        'Professional multilingual guide',
                                        'All meals included (Halal certified)',
                                        'Zam-zam water supply',
                                        '24/7 customer support',
                                        'Comprehensive travel insurance',
                                    ],
                                    highlights: 'Best for first-time pilgrims seeking comfort and guidance',
                                },
                                {
                                    id: 2,
                                    name: 'Luxury Hajj Package',
                                    duration: '14 Days 13 Nights',
                                    price: 'Starting from Rp 87,500,000',
                                    features: [
                                        'Luxury 5-star hotels (closest to Haram)',
                                        'VIP airport transfers',
                                        'Premium tent accommodation in Mina',
                                        'Dedicated scholar for spiritual guidance',
                                        'All rituals assistance included',
                                        'Premium meal arrangements',
                                        'Health monitoring service',
                                        'Exclusive group sizes (max 20 people)',
                                    ],
                                    highlights: 'Ultimate luxury experience for the sacred journey',
                                },
                            ].map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-900/50 to-orange-900/50 p-6"
                                >
                                    <h3 className="mb-2 text-xl font-bold text-amber-300">
                                        <EditableText sectionKey={`b2b.packages.${pkg.id}.name`} value={pkg.name} tag="span" />
                                    </h3>
                                    <p className="mb-2 text-sm text-gray-300">
                                        <EditableText sectionKey={`b2b.packages.${pkg.id}.duration`} value={pkg.duration} tag="span" />
                                    </p>
                                    <p className="mb-4 text-lg font-semibold text-amber-200">
                                        <EditableText sectionKey={`b2b.packages.${pkg.id}.price`} value={pkg.price} tag="span" />
                                    </p>
                                    <p className="mb-4 text-sm text-gray-300">
                                        <EditableText sectionKey={`b2b.packages.${pkg.id}.highlights`} value={pkg.highlights} tag="span" />
                                    </p>
                                    <ul className="mb-6 space-y-2">
                                        {pkg.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400"></span>
                                                <EditableText sectionKey={`b2b.packages.${pkg.id}.features.${index}`} value={feature} tag="span" />
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                        className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg"
                                    >
                                        Get Quote
                                    </button>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </EditModeProvider>
    );
}

function B2BBreadcrumbBar() {
    const page = usePage();
    const location =
        (page.props as { ziggy?: { location?: string } })?.ziggy?.location || (typeof window !== 'undefined' ? window.location.href : '');
    const path = useMemo(() => {
        try {
            const url = new URL(location);
            return url.pathname;
        } catch {
            return '/';
        }
    }, [location]);

    if (path === '/b2b') return null;

    const parts = path.split('/').filter(Boolean);
    const crumbs = parts.map((p, i) => ({
        href: '/' + parts.slice(0, i + 1).join('/'),
        title: p.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
    }));

    return (
        <div className="border-b/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <div className="mx-auto flex h-10 max-w-7xl items-center gap-2 px-4 text-xs text-muted-foreground md:text-sm">
                <Link href={route('home')} className="hover:text-accent">
                    B2B
                </Link>
                {crumbs.map((c, i) => (
                    <div key={c.href} className="inline-flex items-center gap-2">
                        <span>›</span>
                        {i < crumbs.length - 1 ? (
                            <Link href={c.href} className="hover:text-accent">
                                {c.title}
                            </Link>
                        ) : (
                            <span className="text-foreground">{c.title}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
