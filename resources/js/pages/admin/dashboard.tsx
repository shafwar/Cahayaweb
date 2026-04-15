import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { adminChip, adminGhostBtn } from '@/lib/admin-portal-theme';
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
            border: 'border-[#ff5200]/25 hover:border-[#ff5200]/50',
            iconBg: 'bg-[#ff5200]/15 text-[#fec901]',
            glow: 'from-[#ff5200]/10 via-transparent to-[#fec901]/5',
        },
        {
            href: '/select-mode',
            icon: Layout,
            title: 'Admin CMS',
            description: 'Choose B2C or B2B portal to edit content, sections, and images for the public site.',
            border: 'border-[#fec901]/25 hover:border-[#fec901]/45',
            iconBg: 'bg-[#fec901]/15 text-[#fec901]',
            glow: 'from-[#fec901]/10 via-transparent to-[#ff5200]/5',
        },
        {
            href: '/admin/b2c-packages',
            icon: ClipboardList,
            title: 'B2C registration',
            description: 'Manage bookable travel packages, capacity, deadlines, and participant registrations.',
            border: 'border-[#2d4a6f]/40 hover:border-[#ff5200]/35',
            iconBg: 'bg-[#2d4a6f]/50 text-[#e8ecf4]',
            glow: 'from-[#2d4a6f]/20 via-transparent to-[#ff5200]/10',
        },
    ];

    return (
        <AdminPortalShell className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <Head title="Admin Dashboard" />

            <div className="mb-6 flex justify-end">
                <button
                    onClick={logout}
                    disabled={isLoggingOut}
                    type="button"
                    className={`${adminGhostBtn} border-red-400/35 text-red-200 hover:border-red-400/50 hover:bg-red-500/10`}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? 'Logging out…' : 'Logout'}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12 text-center sm:mb-16"
            >
                <div className={`${adminChip} mb-5`}>
                    <Sparkles className="h-3.5 w-3.5" />
                    Admin portal
                </div>
                <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">Admin Dashboard</h1>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#94a3b8] sm:text-lg">
                    Manage CMS content, B2B agent verifications, and B2C package registrations — in one place.
                </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div key={card.href} custom={index} initial="hidden" animate="visible" variants={cardVariants}>
                            <Link
                                href={card.href}
                                className={`group relative block h-full overflow-hidden rounded-2xl border-2 bg-[#0d1422]/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-orange-900/20 ${card.border}`}
                            >
                                <div
                                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                                />
                                <div className="relative p-8 sm:p-10">
                                    <div className="mb-6">
                                        <div
                                            className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ring-white/10 transition-all duration-300 group-hover:scale-105 ${card.iconBg}`}
                                        >
                                            <Icon className="h-8 w-8 transition-transform duration-300 group-hover:rotate-6" />
                                        </div>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-semibold text-white sm:text-3xl">{card.title}</h3>
                                    <p className="mb-6 text-base leading-relaxed text-[#94a3b8] sm:text-lg">{card.description}</p>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-[#fec901] transition-colors group-hover:text-[#ffd454] sm:text-base">
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
                className="mt-14 text-center text-sm text-[#64748b]"
            >
                Need help? Contact your system administrator.
            </motion.p>
        </AdminPortalShell>
    );
}
