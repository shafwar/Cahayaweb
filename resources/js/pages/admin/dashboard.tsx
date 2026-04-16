import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { adminChip, adminDashboardCard, adminGhostBtn, adminPageTitle } from '@/lib/admin-portal-theme';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, Layout, ArrowRight, Sparkles, LogOut, ClipboardList } from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';

export default function AdminDashboard() {
    const { logout, isLoggingOut } = useLogout();
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
    };

    const cards = [
        {
            href: '/admin/agent-verifications',
            icon: Building2,
            title: 'Agent Verifications',
            description: 'Review and approve B2B agent registration applications. Manage pending, approved, and rejected verifications.',
            border: 'border-orange-200/90 hover:border-orange-300',
            iconBg: 'bg-orange-50 text-orange-600 ring-orange-100',
            glow: 'from-orange-50/80 via-transparent to-amber-50/40',
        },
        {
            href: '/select-mode',
            icon: Layout,
            title: 'Admin CMS',
            description: 'Choose B2C or B2B portal to edit content, sections, and images for the public site.',
            border: 'border-amber-200/90 hover:border-amber-300',
            iconBg: 'bg-amber-50 text-amber-700 ring-amber-100',
            glow: 'from-amber-50/80 via-transparent to-orange-50/30',
        },
        {
            href: '/admin/b2c-packages',
            icon: ClipboardList,
            title: 'B2C registration',
            description: 'Manage bookable travel packages, capacity, deadlines, and participant registrations.',
            border: 'border-slate-200 hover:border-orange-200/90',
            iconBg: 'bg-slate-100 text-slate-700 ring-slate-200/80',
            glow: 'from-slate-50 via-transparent to-orange-50/30',
        },
    ];

    return (
        <AdminPortalShell className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Head title="Admin Dashboard" />

            {/* Satu baris: spacer + hero terpusat + logout — hindari bar penuh hanya untuk tombol yang mendorong konten ke bawah */}
            <div className="mb-8 grid w-full grid-cols-[1fr_minmax(0,min(100%,42rem))_1fr] items-start gap-x-2 sm:mb-10 sm:gap-x-4">
                <div aria-hidden className="min-w-0" />
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="col-start-2 row-start-1 w-full text-center"
                >
                    <div className={`${adminChip} mb-4 sm:mb-5`}>
                        <Sparkles className="h-3.5 w-3.5" />
                        Admin portal
                    </div>
                    <h1 className={`mb-3 sm:mb-4 ${adminPageTitle} sm:text-5xl lg:text-6xl`}>Admin Dashboard</h1>
                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                        Manage CMS content, B2B agent verifications, and B2C package registrations — in one place.
                    </p>
                </motion.div>
                <div className="col-start-3 row-start-1 flex justify-end self-start pt-0.5">
                    <button
                        onClick={logout}
                        disabled={isLoggingOut}
                        type="button"
                        className={`${adminGhostBtn} shrink-0 border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50`}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        {isLoggingOut ? 'Logging out…' : 'Logout'}
                    </button>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div key={card.href} custom={index} initial="hidden" animate="visible" variants={cardVariants}>
                            <Link href={card.href} className={`${adminDashboardCard} ${card.border}`}>
                                <div
                                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                                />
                                <div className="relative p-8 sm:p-10">
                                    <div className="mb-6">
                                        <div
                                            className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ring-1 transition-all duration-300 group-hover:scale-105 ${card.iconBg}`}
                                        >
                                            <Icon className="h-8 w-8 transition-transform duration-300 group-hover:rotate-6" />
                                        </div>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-semibold text-[#1e3a5f] sm:text-3xl">{card.title}</h3>
                                    <p className="mb-6 text-base leading-relaxed text-slate-600 sm:text-lg">{card.description}</p>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors group-hover:text-orange-700 sm:text-base">
                                        <span>Open</span>
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-10 text-center text-sm text-slate-500 sm:mt-12"
            >
                Need help? Contact your system administrator.
            </motion.p>
        </AdminPortalShell>
    );
}
