import { EditableText } from '@/components/cms';
import EditModeProvider from '@/components/cms/EditModeProvider';
import EditToggleButton from '@/components/cms/EditToggleButton';
import GlobalHeader from '@/components/GlobalHeader';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RippleButton } from '@/components/ui/ripple-button';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

// Google Fonts import
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

export default function B2BLayout({ children }: { children: ReactNode }) {
    const [showPackagesDialog, setShowPackagesDialog] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

    useEffect(() => {
        const handler = () => setShowPackagesDialog(true);
        window.addEventListener('open-b2b-packages', handler as EventListener);
        return () => window.removeEventListener('open-b2b-packages', handler as EventListener);
    }, []);

    const packages = [
        {
            id: 1,
            name: 'Premium Umrah Package',
            duration: '9 Days 8 Nights',
            price: 'Rp 28,500,000',
            badge: 'Most Popular',
            badgeColor: 'from-amber-500 to-orange-500',
            icon: '⭐',
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
            price: 'Rp 87,500,000',
            badge: 'Premium',
            badgeColor: 'from-purple-500 to-pink-500',
            icon: '💎',
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
            highlights: 'Ultimate spiritual journey with maximum comfort and personalized service',
        },
        {
            id: 3,
            name: 'Economy Umrah Package',
            duration: '7 Days 6 Nights',
            price: 'Rp 18,500,000',
            badge: 'Best Value',
            badgeColor: 'from-blue-500 to-cyan-500',
            icon: '🎯',
            features: [
                '4-star hotel accommodation',
                'Shared transportation',
                'Experienced group leader',
                'Daily breakfast included',
                'Basic travel insurance',
                'Group guidance sessions',
                'Essential amenities provided',
            ],
            highlights: 'Perfect for budget-conscious pilgrims without compromising essentials',
        },
    ];

    return (
        <EditModeProvider>
            <div className="flex min-h-dvh flex-col bg-background text-foreground">
                <GlobalHeader variant="b2b" />
                <B2BBreadcrumbBar />
                <main className="flex-1 overflow-x-hidden">{children}</main>
                <EditToggleButton />

                {/* Enhanced Packages Dialog */}
                <Dialog open={showPackagesDialog} onOpenChange={setShowPackagesDialog}>
                    <DialogContent className="max-h-[85vh] w-[min(560px,calc(100vw-1.5rem))] overflow-y-auto border border-white/10 bg-black/95">
                        <DialogHeader className="border-b border-white/10 pb-4">
                            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
                                <span className="text-xl">✨</span>
                                <EditableText sectionKey="b2b.packages_dialog.title" value="Premium Packages" tag="span" />
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm text-gray-400">
                                <EditableText
                                    sectionKey="b2b.packages_dialog.description"
                                    value="Choose from our carefully curated packages for your spiritual journey"
                                    tag="span"
                                />
                            </DialogDescription>
                        </DialogHeader>

                        <div className="max-h-[calc(85vh-10rem)] space-y-3 overflow-y-auto p-4">
                            {packages.map((pkg, index) => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                    className={`rounded-xl border transition-all duration-200 ${
                                        selectedPackage === pkg.id
                                            ? 'border-amber-500/40 bg-white/5 shadow-lg shadow-amber-500/10'
                                            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                    }`}
                                >
                                    <div className="p-4">
                                        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                                                <h3 className="text-sm font-bold text-white sm:text-base">
                                                    <EditableText
                                                        sectionKey={`b2b.packages.${pkg.id}.name`}
                                                        value={pkg.name}
                                                        tag="span"
                                                    />
                                                </h3>
                                                <span className={`rounded-full bg-gradient-to-r ${pkg.badgeColor} px-2 py-0.5 text-[10px] font-medium text-white`}>
                                                    {pkg.badge}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    <EditableText
                                                        sectionKey={`b2b.packages.${pkg.id}.duration`}
                                                        value={pkg.duration}
                                                        tag="span"
                                                    />
                                                </span>
                                            </div>
                                            <div className="flex-shrink-0 rounded-md border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-right">
                                                <p className="text-xs font-bold text-amber-200">
                                                    <EditableText
                                                        sectionKey={`b2b.packages.${pkg.id}.price`}
                                                        value={pkg.price}
                                                        tag="span"
                                                    />
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mb-2.5 line-clamp-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-amber-100/90">
                                            <EditableText
                                                sectionKey={`b2b.packages.${pkg.id}.highlights`}
                                                value={pkg.highlights}
                                                tag="span"
                                            />
                                        </p>

                                        <button
                                            onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
                                            className="mb-2.5 flex w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:border-white/20 hover:bg-white/10"
                                        >
                                            <span className="text-xs font-medium text-gray-300">What's Included</span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">{pkg.features.length}</span>
                                                <motion.svg
                                                    animate={{ rotate: selectedPackage === pkg.id ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="h-3.5 w-3.5 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </motion.svg>
                                            </span>
                                        </button>

                                        {selectedPackage === pkg.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                transition={{ duration: 0.2 }}
                                                className="mb-2.5 overflow-hidden"
                                            >
                                                <div className="grid grid-cols-1 gap-1.5 rounded-md border border-white/10 bg-white/5 p-2.5 sm:grid-cols-2">
                                                    {pkg.features.map((feature, fIndex) => (
                                                        <div key={fIndex} className="flex items-start gap-1.5 rounded bg-black/30 px-2.5 py-1.5">
                                                            <div className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-400" />
                                                            <span className="text-[11px] leading-snug text-gray-300">
                                                                <EditableText
                                                                    sectionKey={`b2b.packages.${pkg.id}.features.${fIndex}`}
                                                                    value={feature}
                                                                    tag="span"
                                                                />
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        <RippleButton
                                            onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                            className="w-full rounded-lg py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg"
                                            style={{ background: 'linear-gradient(to right, rgb(34 197 94), rgb(5 150 105))' }}
                                        >
                                            Get Quote via WhatsApp
                                        </RippleButton>
                                    </div>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4"
                            >
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-lg">
                                    🎯
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-bold text-white">Need a Custom Package?</h3>
                                    <p className="line-clamp-2 text-xs text-gray-400">Tailored experiences for your unique spiritual journey</p>
                                </div>
                                <RippleButton
                                    onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                    className="flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                                >
                                    Request Quote
                                </RippleButton>
                            </motion.div>
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
