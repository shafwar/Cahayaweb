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
                    <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-6xl overflow-y-auto border border-gray-700/50 bg-gradient-to-br from-gray-950 via-gray-900 to-black backdrop-blur-xl sm:w-[calc(100vw-4rem)]">
                        <DialogHeader className="border-b border-gray-700/50 pb-6">
                            <DialogTitle className="flex items-center gap-3 text-3xl font-bold text-white sm:text-4xl">
                                <span className="text-4xl">✨</span>
                                <EditableText sectionKey="b2b.packages_dialog.title" value="Premium Packages" tag="span" />
                            </DialogTitle>
                            <DialogDescription className="mt-2 text-base text-gray-300 sm:text-lg">
                                <EditableText
                                    sectionKey="b2b.packages_dialog.description"
                                    value="Choose from our carefully curated packages for your spiritual journey"
                                    tag="span"
                                />
                            </DialogDescription>
                        </DialogHeader>

                        {/* Packages Grid */}
                        <div className="mt-6 space-y-5">
                            {packages.map((pkg, index) => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                    className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                                        selectedPackage === pkg.id
                                            ? 'border-amber-500/60 bg-gradient-to-br from-amber-950/50 via-amber-900/40 to-orange-950/50 shadow-2xl shadow-amber-500/25'
                                            : 'border-gray-700/50 bg-gray-900/40 hover:border-gray-600 hover:bg-gray-900/60 hover:shadow-xl'
                                    }`}
                                >
                                    {/* Badge */}
                                    <div className="absolute top-5 right-5 z-10">
                                        <div
                                            className={`rounded-full bg-gradient-to-r ${pkg.badgeColor} px-5 py-2 text-sm font-bold text-white shadow-xl`}
                                        >
                                            {pkg.badge}
                                        </div>
                                    </div>

                                    {/* Package Content */}
                                    <div className="p-6 sm:p-8">
                                        {/* Header Section */}
                                        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                            {/* Left: Info */}
                                            <div className="flex-1">
                                                <div className="mb-4 flex items-start gap-4">
                                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-3xl shadow-xl">
                                                        {pkg.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                                                            <EditableText
                                                                sectionKey={`b2b.packages.${pkg.id}.name`}
                                                                value={pkg.name}
                                                                tag="span"
                                                            />
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-base text-gray-300 sm:text-lg">
                                                            <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            <EditableText
                                                                sectionKey={`b2b.packages.${pkg.id}.duration`}
                                                                value={pkg.duration}
                                                                tag="span"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Highlights Box */}
                                                <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 backdrop-blur-sm">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-xl">
                                                            💡
                                                        </div>
                                                        <p className="text-sm leading-relaxed text-amber-100 sm:text-base">
                                                            <EditableText
                                                                sectionKey={`b2b.packages.${pkg.id}.highlights`}
                                                                value={pkg.highlights}
                                                                tag="span"
                                                            />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Price Card */}
                                            <div className="w-full lg:w-auto">
                                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-6 shadow-2xl shadow-amber-500/30">
                                                    <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-2xl"></div>
                                                    <div className="relative">
                                                        <p className="mb-2 text-sm font-medium text-white/90">Starting from</p>
                                                        <p className="mb-1 text-3xl font-bold text-white sm:text-4xl">
                                                            <EditableText
                                                                sectionKey={`b2b.packages.${pkg.id}.price`}
                                                                value={pkg.price}
                                                                tag="span"
                                                            />
                                                        </p>
                                                        <p className="text-sm text-white/90">per person</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features Section - Collapsible */}
                                        <div className="border-t border-gray-700/50 pt-6">
                                            {/* Toggle Button */}
                                            <button
                                                onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
                                                className="mb-4 flex w-full items-center justify-between rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 transition-all hover:border-gray-600 hover:bg-gray-800/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-xl">
                                                        ✅
                                                    </div>
                                                    <span className="text-lg font-bold text-white">What's Included</span>
                                                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm font-semibold text-amber-300">
                                                        {pkg.features.length} Features
                                                    </span>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: selectedPackage === pkg.id ? 180 : 0 }}
                                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                                    className="text-amber-400"
                                                >
                                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </motion.div>
                                            </button>

                                            {/* Features Grid - Animated */}
                                            {selectedPackage === pkg.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                                    className="space-y-3"
                                                >
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                        {pkg.features.map((feature, fIndex) => (
                                                            <motion.div
                                                                key={fIndex}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{
                                                                    delay: fIndex * 0.05,
                                                                    ease: [0.22, 1, 0.36, 1],
                                                                }}
                                                                className="flex items-start gap-3 rounded-xl border border-gray-700/50 bg-gray-800/50 p-4 backdrop-blur-sm transition-all hover:border-gray-600 hover:bg-gray-800/70"
                                                            >
                                                                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                                                                <span className="text-sm text-gray-200 sm:text-base">
                                                                    <EditableText
                                                                        sectionKey={`b2b.packages.${pkg.id}.features.${fIndex}`}
                                                                        value={feature}
                                                                        tag="span"
                                                                    />
                                                                </span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                                            <RippleButton
                                                onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                                                className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 font-bold text-white shadow-xl shadow-green-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/30"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                                <div className="relative flex items-center justify-center gap-2">
                                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487" />
                                                    </svg>
                                                    <span>Get Quote via WhatsApp</span>
                                                </div>
                                            </RippleButton>

                                            <button className="rounded-xl border-2 border-gray-700 bg-gray-800/50 px-6 py-4 font-semibold text-white transition-all hover:border-gray-600 hover:bg-gray-800/70">
                                                Learn More
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Custom Package CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-indigo-900/30 to-purple-950/40 p-6 backdrop-blur-sm sm:p-8"
                            >
                                <div className="mb-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 text-4xl shadow-2xl">
                                        🎯
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Need a Custom Package?</h3>
                                        <p className="text-base leading-relaxed text-gray-300 sm:text-lg">
                                            We create personalized spiritual journeys tailored to your specific needs, budget, and travel schedule.
                                            Our team will work with you to design the perfect pilgrimage experience.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    {[
                                        { icon: '📋', title: 'Free Consultation', desc: 'Expert advice at no cost' },
                                        { icon: '💰', title: 'Flexible Pricing', desc: 'Budget-friendly options' },
                                        { icon: '⚡', title: 'Quick Process', desc: 'Fast documentation' },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 backdrop-blur-sm transition-all hover:bg-blue-500/20"
                                        >
                                            <div className="mb-2 text-2xl">{item.icon}</div>
                                            <h4 className="mb-1 font-bold text-blue-200">{item.title}</h4>
                                            <p className="text-sm text-blue-300/80">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <RippleButton className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 text-lg font-bold text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30">
                                    💬 Request Custom Quote
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
