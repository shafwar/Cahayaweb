import SimpleLayout from '@/layouts/simple-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, Layout, ArrowRight, Sparkles, LogOut } from 'lucide-react';
import { logout } from '@/utils/logout';

export default function AdminDashboard() {
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
            gradient: 'from-amber-500/10 via-orange-500/10 to-amber-500/10',
            borderColor: 'border-amber-500/30 hover:border-amber-500/60',
            iconBg: 'bg-amber-500/20',
            iconColor: 'text-amber-400',
            hoverShadow: 'hover:shadow-amber-500/20',
        },
        {
            href: '/',
            icon: Layout,
            title: 'Admin CMS',
            description: 'Customize and manage content for B2B and B2C portals. Edit sections, upload images, and personalize your website.',
            gradient: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10',
            borderColor: 'border-blue-500/30 hover:border-blue-500/60',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400',
            hoverShadow: 'hover:shadow-blue-500/20',
        },
    ];

    return (
        <SimpleLayout>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                    {/* Logout Button */}
                    <div className="mb-6 flex justify-end">
                        <button
                            onClick={logout}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-200"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>

                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-12 text-center sm:mb-16"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 backdrop-blur-sm">
                            <Sparkles className="h-4 w-4 text-orange-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">Admin Portal</span>
                        </div>
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                            Admin Dashboard
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
                            Manage your CMS content and review B2B agent verification applications
                        </p>
                    </motion.div>

                    {/* Cards Grid */}
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:gap-8">
                        {cards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={card.href}
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    variants={cardVariants}
                                >
                                    <Link
                                        href={card.href}
                                        className={`group relative block h-full overflow-hidden rounded-2xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-300 dark:bg-gray-800/50 ${card.borderColor} ${card.hoverShadow}`}
                                    >
                                        {/* Gradient Background */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                                        />

                                        {/* Content */}
                                        <div className="relative p-8 sm:p-10">
                                            {/* Icon */}
                                            <div className="mb-6">
                                                <div
                                                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${card.iconBg} ring-4 ring-white/50 transition-all duration-300 group-hover:scale-110 group-hover:ring-8 dark:ring-gray-800/50`}
                                                >
                                                    <Icon className={`h-8 w-8 ${card.iconColor} transition-transform duration-300 group-hover:rotate-6`} />
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-gray-900 dark:text-white dark:group-hover:text-white sm:text-3xl">
                                                {card.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
                                                {card.description}
                                            </p>

                                            {/* CTA */}
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors duration-300 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white sm:text-base">
                                                <span>Get Started</span>
                                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
                                            </div>
                                        </div>

                                        {/* Hover Effect Overlay */}
                                        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Stats or Additional Info Section (Optional) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-12 text-center sm:mt-16"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Need help? Contact your system administrator
                        </p>
                    </motion.div>
                </div>
            </div>
        </SimpleLayout>
    );
}
