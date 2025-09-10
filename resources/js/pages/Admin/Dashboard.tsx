import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Building2, CheckCircle, Clock, DollarSign, Eye, Package, ShoppingCart, Users, Zap } from 'lucide-react';

interface Stats {
    total_users: number;
    b2b_users: number;
    b2c_users: number;
    pending_verifications: number;
    total_packages: number;
    active_packages: number;
    total_purchases: number;
    pending_purchases: number;
    unread_messages: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    user_type: {
        name: string;
        display_name: string;
    };
    created_at: string;
}

interface PendingVerification {
    id: number;
    company_name: string;
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
}

interface RecentPurchase {
    id: number;
    customer_name: string;
    total_amount: number;
    status: string;
    package: {
        name: string;
    };
    user?: {
        name: string;
    };
    created_at: string;
}

interface AdminDashboardProps {
    stats: Stats;
    recentUsers: RecentUser[];
    pendingVerifications: PendingVerification[];
    recentPurchases: RecentPurchase[];
}

export default function AdminDashboard({ stats, recentUsers, pendingVerifications, recentPurchases }: AdminDashboardProps) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.total_users,
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-400',
            change: stats.total_users > 0 ? `+${Math.round((stats.total_users / 10) * 100)}%` : '0%',
            changeType: 'positive',
            description: 'Registered users',
        },
        {
            title: 'B2B Users',
            value: stats.b2b_users,
            icon: Building2,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/10',
            textColor: 'text-purple-400',
            change: stats.b2b_users > 0 ? `+${Math.round((stats.b2b_users / 5) * 100)}%` : '0%',
            changeType: 'positive',
            description: 'Business accounts',
        },
        {
            title: 'Active Packages',
            value: stats.active_packages,
            icon: Package,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500/10',
            textColor: 'text-green-400',
            change: stats.active_packages > 0 ? `+${Math.round((stats.active_packages / 20) * 100)}%` : '0%',
            changeType: 'positive',
            description: 'Available tours',
        },
        {
            title: 'Total Revenue',
            value: stats.total_purchases > 0 ? `Rp ${(stats.total_purchases * 2500000).toLocaleString('id-ID')}` : 'Rp 0',
            icon: DollarSign,
            color: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-500/10',
            textColor: 'text-yellow-400',
            change: stats.total_purchases > 0 ? `+${Math.round((stats.total_purchases / 50) * 100)}%` : '0%',
            changeType: 'positive',
            description: 'Total earnings',
        },
    ];

    const quickActions = [
        {
            title: 'Review Verifications',
            description: 'Approve B2B accounts',
            icon: CheckCircle,
            color: 'from-blue-500 to-blue-600',
            count: pendingVerifications.length,
            href: route('admin.verifications'),
        },
        {
            title: 'Manage Orders',
            description: 'Process purchases',
            icon: ShoppingCart,
            color: 'from-green-500 to-green-600',
            count: pendingVerifications.length,
            href: route('admin.purchases'),
        },
        {
            title: 'View Users',
            description: 'Manage accounts',
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            count: stats.total_users,
            href: route('admin.users'),
        },
        {
            title: 'Manage Packages',
            description: 'Edit tours',
            icon: Package,
            color: 'from-orange-500 to-orange-600',
            count: stats.active_packages,
            href: route('admin.packages'),
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                            Welcome back, Admin! 👋
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Here's what's happening with Cahaya Anbiya today
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-400">
                        <span>Today {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="text-orange-400 font-semibold">{stats.unread_messages}</span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6 hover:border-gray-600 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                                <p className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">{card.value}</p>
                                <p className="text-xs sm:text-sm text-gray-500 mb-2">{card.description}</p>
                                <div className="flex items-center gap-1">
                                    <span className={`text-xs sm:text-sm font-medium ${card.textColor}`}>
                                        {card.change} from last month
                                    </span>
                                </div>
                            </div>
                            <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                                <card.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 sm:mb-8"
            >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Fast access to key features</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            <Link
                                href={action.href}
                                className="group block rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6 hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-r ${action.color} shadow-lg`}>
                                        <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">{action.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-400 mb-2">{action.description}</p>
                                <span className="text-xs sm:text-sm font-medium text-gray-500">{action.count} pending</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Recent Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl border border-gray-700 bg-gray-800"
                >
                    <div className="border-b border-gray-700 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg sm:text-xl font-semibold text-white">Recent Users</h3>
                            <Link
                                href={route('admin.users')}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                View All →
                            </Link>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                            {recentUsers.map((user, index) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                        <span className="text-sm sm:text-base font-bold text-white">
                                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white text-sm sm:text-base truncate">{user.name || 'Unknown User'}</p>
                                        <p className="text-xs sm:text-sm text-gray-400 truncate">{user.email || 'No email'}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400 border border-blue-500/30">
                                            {user.user_type?.display_name || 'Unknown'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Pending Verifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl border border-gray-700 bg-gray-800"
                >
                    <div className="border-b border-gray-700 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg sm:text-xl font-semibold text-white">Pending Verifications</h3>
                            <Link
                                href={route('admin.verifications')}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                View All →
                            </Link>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        {pendingVerifications.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">
                                {pendingVerifications.slice(0, 3).map((verification, index) => (
                                    <motion.div
                                        key={verification.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                                            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white text-sm sm:text-base truncate">{verification.company_name}</p>
                                            <p className="text-xs sm:text-sm text-gray-400 truncate">{verification.user?.name || 'Unknown'}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/30">
                                                Pending
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {verification.created_at ? new Date(verification.created_at).toLocaleDateString() : 'Unknown'}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <CheckCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-400 mb-4" />
                                <p className="text-gray-400 text-sm sm:text-base">All verifications processed</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Recent Purchases */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 sm:mt-8 rounded-xl border border-gray-700 bg-gray-800"
            >
                <div className="border-b border-gray-700 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg sm:text-xl font-semibold text-white">Recent Purchases</h3>
                        <Link
                            href={route('admin.purchases')}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            View All →
                        </Link>
                    </div>
                </div>
                <div className="p-4 sm:p-6">
                    {recentPurchases.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                            {recentPurchases.slice(0, 5).map((purchase, index) => (
                                <motion.div
                                    key={purchase.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                                        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white text-sm sm:text-base truncate">{purchase.customer_name}</p>
                                        <p className="text-xs sm:text-sm text-gray-400 truncate">{purchase.package?.name || 'Unknown Package'}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-sm sm:text-base font-semibold text-white">
                                            Rp {purchase.total_amount?.toLocaleString('id-ID') || '0'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {purchase.created_at ? new Date(purchase.created_at).toLocaleDateString() : 'Unknown'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 sm:py-12">
                            <ShoppingCart className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                            <p className="text-gray-400 text-sm sm:text-base">No purchases found</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </AdminLayout>
    );
}
