import AdminLayout from '@/layouts/admin-layout';
import { motion } from 'framer-motion';
import { BarChart3, DollarSign, Package, TrendingUp, Users } from 'lucide-react';

interface AnalyticsProps {
    stats: {
        total_revenue: number;
        monthly_growth: number;
        top_packages: Array<{
            name: string;
            revenue: number;
            bookings: number;
        }>;
        recent_activity: Array<{
            type: string;
            description: string;
            amount?: number;
            timestamp: string;
        }>;
    };
}

export default function Analytics({ stats }: AnalyticsProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const metricCards = [
        {
            title: 'Total Revenue',
            value: formatPrice(stats.total_revenue),
            change: `${stats.monthly_growth}%`,
            changeType: stats.monthly_growth >= 0 ? 'positive' : 'negative',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-500/10',
        },
        {
            title: 'Active Users',
            value: '1,234',
            change: '+12%',
            changeType: 'positive',
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/10',
        },
        {
            title: 'Total Packages',
            value: '45',
            change: '+5%',
            changeType: 'positive',
            icon: Package,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/10',
        },
        {
            title: 'Conversion Rate',
            value: '8.2%',
            change: '+2.1%',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-500/10',
        },
    ];

    return (
        <AdminLayout title="Analytics">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                            Analytics & Reports
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Track performance metrics and business insights
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-400">
                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
                {metricCards.map((card, index) => (
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
                                <div className="flex items-center gap-1">
                                    <span className={`text-xs sm:text-sm font-medium ${
                                        card.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                                    }`}>
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

            {/* Charts and Data Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6"
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-white">Revenue Overview</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Last 30 days</span>
                        </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="h-64 sm:h-80 bg-gray-700/50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                            <p className="text-gray-400 text-sm sm:text-base">Revenue chart will be displayed here</p>
                            <p className="text-gray-500 text-xs sm:text-sm">Interactive charts coming soon</p>
                        </div>
                    </div>
                </motion.div>

                {/* Top Packages */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6"
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-white">Top Performing Packages</h3>
                        <span className="text-sm text-gray-400">This month</span>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {stats.top_packages.length > 0 ? (
                            stats.top_packages.map((pkg, index) => (
                                <motion.div
                                    key={pkg.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                            <span className="text-xs sm:text-sm font-bold text-white">{index + 1}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-white text-sm sm:text-base truncate">{pkg.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-400">{pkg.bookings} bookings</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-400 text-sm sm:text-base">{formatPrice(pkg.revenue)}</p>
                                        <p className="text-xs text-gray-400">Revenue</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <Package className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                                <p className="text-gray-400 text-sm sm:text-base">No package data available</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 sm:mt-8 rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6"
            >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Recent Activity</h3>
                    <span className="text-sm text-gray-400">Last 24 hours</span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    {stats.recent_activity.length > 0 ? (
                        stats.recent_activity.map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white text-sm sm:text-base">{activity.description}</p>
                                    <p className="text-xs sm:text-sm text-gray-400">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                {activity.amount && (
                                    <div className="text-right">
                                        <p className="font-semibold text-green-400 text-sm sm:text-base">
                                            {formatPrice(activity.amount)}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-8 sm:py-12">
                            <TrendingUp className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                            <p className="text-gray-400 text-sm sm:text-base">No recent activity</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </AdminLayout>
    );
}
