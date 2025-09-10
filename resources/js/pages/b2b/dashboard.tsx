import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    Bell,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    MapPin,
    MessageCircle,
    Package,
    Plus,
    Settings,
    ShoppingCart,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardProps {
    user: {
        id: number;
        name: string;
        email: string;
        b2bVerification: {
            company_name: string;
            status: string;
            contact_person: string;
            contact_email: string;
            contact_phone: string;
        };
    };
    stats: {
        total_packages: number;
        active_bookings: number;
        total_spent: number;
        upcoming_trips: number;
    };
    recent_packages: Array<{
        id: number;
        name: string;
        destination: string;
        price: number;
        duration_days: number;
        image_path?: string;
    }>;
    recent_activity: Array<{
        id: string;
        type: string;
        message: string;
        created_at: string;
    }>;
    notifications: Array<{
        id: number;
        message: string;
        time: string;
        type: string;
    }>;
}

export default function B2BDashboard({ user, stats, recent_packages, recent_activity, notifications }: DashboardProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-slate-700/50 text-slate-100 border-slate-600/50';
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'warning':
                return <Bell className="h-4 w-4 text-yellow-500" />;
            case 'info':
                return <Activity className="h-4 w-4 text-blue-500" />;
            default:
                return <Bell className="h-4 w-4 text-slate-400" />;
        }
    };

    const handleQuickAction = (action: string) => {
        console.log(`Quick action: ${action}`);
        // Add specific actions here
    };

    return (
        <B2BLayout>
            <Head title="B2B Dashboard" />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-700/30 blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-600/30 to-cyan-700/30 blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [360, 180, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </div>

                <motion.div
                    className="relative space-y-4 p-3 sm:space-y-6 sm:p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* Enhanced Header Section */}
                    <motion.div
                        className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-800/90 via-slate-800/90 to-slate-700/90 p-4 shadow-2xl backdrop-blur-sm sm:rounded-3xl sm:p-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400/10 to-cyan-600/10 blur-xl"></div>
                        <div className="relative flex flex-col justify-between space-y-4 sm:space-y-6 lg:flex-row lg:items-center lg:space-y-0">
                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                                        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg sm:rounded-2xl sm:p-4">
                                            <Building2 className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                                        </div>
                                        <motion.div
                                            className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 sm:h-4 sm:w-4"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>
                                    <div>
                                        <motion.h1
                                            className="bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 bg-clip-text text-2xl font-bold text-transparent sm:text-4xl"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                        >
                                            Welcome back, {user.name}!
                                        </motion.h1>
                                        <motion.p
                                            className="mt-1 text-base font-semibold text-slate-300 sm:text-lg"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.8, delay: 0.6 }}
                                        >
                                            {user.b2bVerification?.company_name || 'Business Account'}
                                        </motion.p>
                                    </div>
                                </div>
                                <motion.div
                                    className="flex flex-col space-y-2 text-sm sm:flex-row sm:space-y-0 sm:space-x-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                >
                                    <div className="flex items-center space-x-2 rounded-full bg-slate-700/50 px-3 py-2">
                                        <Calendar className="h-4 w-4 text-blue-400" />
                                        <span className="text-xs font-medium text-slate-300 sm:text-sm">
                                            {currentTime.toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-full bg-slate-700/50 px-3 py-2">
                                        <Clock className="h-4 w-4 text-emerald-400" />
                                        <span className="text-xs font-medium text-slate-300 sm:text-sm">
                                            {currentTime.toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuickAction('refresh')}
                                        className="flex items-center space-x-2 border-slate-200 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-blue-50"
                                    >
                                        <Activity className="h-4 w-4" />
                                        <span>Refresh</span>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href="/b2b/packages">
                                        <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl">
                                            <Plus className="h-4 w-4" />
                                            <span>New Booking</span>
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Enhanced Status Banner */}
                    <motion.div
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 shadow-2xl sm:rounded-3xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white/5 blur-xl"></div>
                        <div className="relative p-4 sm:p-8">
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                <motion.div
                                    className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                                        <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm sm:rounded-2xl sm:p-4">
                                            <Building2 className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                                        </div>
                                        <motion.div
                                            className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-white sm:h-4 sm:w-4"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <CheckCircle className="h-2 w-2 text-emerald-600 sm:h-3 sm:w-3" />
                                        </motion.div>
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-bold text-white sm:text-3xl">Business Account Active</h2>
                                        <p className="text-sm text-emerald-100 sm:text-xl">
                                            Access exclusive B2B rates and corporate travel solutions
                                        </p>
                                        <div className="flex items-center space-x-2 text-emerald-200">
                                            <motion.div
                                                className="h-2 w-2 rounded-full bg-white"
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            <span className="text-xs font-medium sm:text-sm">Real-time status monitoring</span>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="flex items-center space-x-3 rounded-xl border border-white/30 bg-white/20 px-4 py-3 backdrop-blur-sm sm:rounded-2xl sm:px-6"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <CheckCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-white sm:text-lg">{user.b2bVerification?.status || 'Approved'}</div>
                                        <div className="text-xs text-emerald-200 sm:text-sm">Verified Partner</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/50 hover:shadow-xl sm:rounded-2xl">
                            <div className="p-4 sm:p-6">
                                <div className="mb-3 flex items-center justify-between sm:mb-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-300 sm:text-sm">Available Packages</p>
                                        <p className="text-2xl font-bold text-slate-100 sm:text-4xl">{stats.total_packages}</p>
                                        <div className="flex items-center space-x-1">
                                            <TrendingUp className="h-3 w-3 text-slate-400" />
                                            <p className="text-xs text-slate-400">+2 this month</p>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-blue-600/20 p-3 sm:p-4">
                                        <Package className="h-5 w-5 text-blue-400 sm:h-7 sm:w-7" />
                                    </div>
                                </div>
                                <Link href="/b2b/packages">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-slate-300 transition-all duration-200 hover:bg-slate-700/50"
                                    >
                                        View All <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/50 hover:shadow-xl">
                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-300">Active Bookings</p>
                                        <p className="text-4xl font-bold text-slate-100">{stats.active_bookings}</p>
                                        <div className="flex items-center space-x-1">
                                            <CheckCircle className="h-3 w-3 text-slate-400" />
                                            <p className="text-xs text-slate-400">All confirmed</p>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-emerald-600/20 p-4">
                                        <ShoppingCart className="h-7 w-7 text-emerald-400" />
                                    </div>
                                </div>
                                <Link href="/b2b/bookings">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-slate-300 transition-all duration-200 hover:bg-slate-700/50"
                                    >
                                        Manage <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/50 hover:shadow-xl">
                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-300">Total Spent</p>
                                        <p className="text-3xl font-bold text-slate-100">{formatCurrency(stats.total_spent)}</p>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-3 w-3 text-slate-400" />
                                            <p className="text-xs text-slate-400">This year</p>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-amber-600/20 p-4">
                                        <DollarSign className="h-7 w-7 text-amber-400" />
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full text-slate-300 transition-all duration-200 hover:bg-slate-700/50">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    View Report
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/50 hover:shadow-xl">
                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-300">Upcoming Trips</p>
                                        <p className="text-4xl font-bold text-slate-100">{stats.upcoming_trips}</p>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-3 w-3 text-slate-400" />
                                            <p className="text-xs text-slate-400">Next 30 days</p>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-purple-600/20 p-4">
                                        <Calendar className="h-7 w-7 text-purple-400" />
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full text-slate-300 transition-all duration-200 hover:bg-slate-700/50">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    View Calendar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Company Information */}
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="border-b border-slate-700/50 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-full bg-slate-700/50 p-2">
                                            <Building2 className="h-5 w-5 text-slate-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-100">Company Profile</h3>
                                            <p className="text-sm text-slate-300">Business information</p>
                                        </div>
                                    </div>
                                    <Link href="/b2b/profile">
                                        <Button variant="ghost" size="sm" className="text-slate-300 transition-colors hover:bg-slate-700/50">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-6 p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4 rounded-xl border border-slate-700/50 bg-slate-700/30 p-3">
                                        <div className="rounded-full bg-blue-600/20 p-3">
                                            <Building2 className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-300">Company Name</p>
                                            <p className="font-semibold text-slate-100">{user.b2bVerification?.company_name || 'Not Set'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 rounded-xl border border-slate-700/50 bg-slate-700/30 p-3">
                                        <div className="rounded-full bg-emerald-600/20 p-3">
                                            <Users className="h-5 w-5 text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-300">Contact Person</p>
                                            <p className="font-semibold text-slate-100">{user.b2bVerification?.contact_person || 'Not Set'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 rounded-xl border border-slate-700/50 bg-slate-700/30 p-3">
                                        <div className="rounded-full bg-amber-600/20 p-3">
                                            <MessageCircle className="h-5 w-5 text-amber-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-300">Email</p>
                                            <p className="font-semibold text-slate-100">{user.b2bVerification?.contact_email || user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 rounded-xl border border-slate-700/50 bg-slate-700/30 p-3">
                                        <div className="rounded-full bg-purple-600/20 p-3">
                                            <Bell className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-300">Phone</p>
                                            <p className="font-semibold text-slate-100">{user.b2bVerification?.contact_phone || 'Not Set'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-700/50 pt-4">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-700/30 p-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-300">Verification Status</p>
                                            <p className="text-xs text-slate-400">Account verification</p>
                                        </div>
                                        <Badge
                                            className={`${getStatusColor(user.b2bVerification?.status || 'pending')} px-4 py-2 text-sm font-medium`}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            {user.b2bVerification?.status || 'Pending'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Featured Packages */}
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm lg:col-span-2">
                            <div className="border-b border-slate-700/50 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-full bg-slate-700/50 p-2">
                                            <Package className="h-5 w-5 text-slate-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-100">Featured Packages</h3>
                                            <p className="text-sm text-slate-300">Exclusive B2B travel packages</p>
                                        </div>
                                    </div>
                                    <Link href="/b2b/packages">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center space-x-2 border-slate-600 text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-700/50"
                                        >
                                            <span>View All</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {recent_packages.map((package_item, index) => {
                                        const cardVariants = [
                                            'bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 border-slate-600/50 hover:border-blue-500/50',
                                            'bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 border-slate-600/50 hover:border-emerald-500/50',
                                            'bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 border-slate-600/50 hover:border-purple-500/50',
                                        ];
                                        const accentColors = ['blue', 'emerald', 'purple'];
                                        const currentAccent = accentColors[index % accentColors.length];

                                        return (
                                            <div
                                                key={package_item.id}
                                                className={`group relative overflow-hidden rounded-xl border ${cardVariants[index % cardVariants.length]} p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-${currentAccent}-500/10`}
                                            >
                                                {package_item.image_path && (
                                                    <div
                                                        className={`mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-600/50 shadow-lg shadow-${currentAccent}-500/10`}
                                                    >
                                                        <img
                                                            src={package_item.image_path}
                                                            alt={package_item.name}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                )}

                                                <div className="space-y-4">
                                                    <div className="flex items-start justify-between">
                                                        <h4 className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-slate-200">
                                                            {package_item.name}
                                                        </h4>
                                                        <div
                                                            className={`flex items-center space-x-1 rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-600/20 to-orange-600/20 px-2 py-1`}
                                                        >
                                                            <Star className="h-4 w-4 fill-current text-amber-400" />
                                                            <span className="text-sm font-medium text-amber-300">4.8</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-4 text-sm text-slate-300">
                                                        <div className="flex items-center space-x-2">
                                                            <div
                                                                className={`rounded-full bg-gradient-to-r from-${currentAccent}-600/20 to-${currentAccent}-500/20 border p-1 border-${currentAccent}-500/20`}
                                                            >
                                                                <MapPin className={`h-3 w-3 text-${currentAccent}-400`} />
                                                            </div>
                                                            <span className="font-medium">{package_item.destination}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <div
                                                                className={`rounded-full border border-emerald-500/20 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-1`}
                                                            >
                                                                <Clock className="h-3 w-3 text-emerald-400" />
                                                            </div>
                                                            <span className="font-medium">{package_item.duration_days} days</span>
                                                        </div>
                                                    </div>

                                                    <div className={`flex items-center justify-between border-t border-${currentAccent}-500/20 pt-2`}>
                                                        <div>
                                                            <p
                                                                className={`bg-gradient-to-r from-slate-100 text-xl font-bold to-${currentAccent}-100 bg-clip-text text-transparent`}
                                                            >
                                                                {formatCurrency(package_item.price)}
                                                            </p>
                                                            <p className={`text-xs font-medium text-${currentAccent}-400`}>B2B Exclusive Rate</p>
                                                        </div>
                                                        <Link href={`/b2b/packages/${package_item.id}`}>
                                                            <Button
                                                                size="sm"
                                                                className={`bg-gradient-to-r from-${currentAccent}-600 to-${currentAccent}-700 text-white shadow-lg shadow-${currentAccent}-500/25 transition-all duration-200 hover:from-${currentAccent}-700 hover:to-${currentAccent}-800 hover:shadow-xl hover:shadow-${currentAccent}-500/30`}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {recent_packages.length === 0 && (
                                    <div className="py-16 text-center">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-700/50">
                                            <Package className="h-10 w-10 text-slate-400" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-slate-100">No packages available</h3>
                                        <p className="mb-6 text-slate-300">Check back later for new travel packages.</p>
                                        <Link href="/b2b/packages">
                                            <Button className="bg-blue-600 text-white hover:bg-blue-700">Browse All Packages</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notifications & Quick Actions */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Recent Notifications */}
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="border-b border-slate-700/50 p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-slate-700/50 p-2">
                                        <Bell className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-100">Recent Notifications</h3>
                                        <p className="text-sm text-slate-300">Stay updated with latest news</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="group flex items-start space-x-4 rounded-xl border border-slate-700/50 p-4 transition-all duration-200 hover:border-slate-600 hover:bg-slate-700/30"
                                        >
                                            <div className="mt-1 flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-slate-100 transition-colors group-hover:text-slate-200">
                                                    {notification.message}
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-slate-400">{notification.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 border-t border-slate-700/50 pt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-slate-600 text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-700/50"
                                    >
                                        View All Notifications
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="border-b border-slate-700/50 p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-slate-700/50 p-2">
                                        <Activity className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-100">Quick Actions</h3>
                                        <p className="text-sm text-slate-300">Common tasks and navigation shortcuts</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <Link href="/b2b/packages">
                                        <Button
                                            variant="outline"
                                            className="group flex h-18 w-full items-center justify-start space-x-4 border-slate-600 transition-all duration-200 hover:border-slate-500 hover:bg-slate-700/30"
                                        >
                                            <div className="rounded-full bg-blue-600/20 p-3 transition-colors group-hover:bg-blue-700/30">
                                                <Package className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-100">Browse Packages</p>
                                                <p className="text-xs text-slate-300">Explore available travel packages</p>
                                            </div>
                                            <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-300" />
                                        </Button>
                                    </Link>

                                    <Link href="/b2b/bookings">
                                        <Button
                                            variant="outline"
                                            className="group flex h-18 w-full items-center justify-start space-x-4 border-slate-600 transition-all duration-200 hover:border-slate-500 hover:bg-slate-700/30"
                                        >
                                            <div className="rounded-full bg-emerald-600/20 p-3 transition-colors group-hover:bg-emerald-700/30">
                                                <ShoppingCart className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-100">My Bookings</p>
                                                <p className="text-xs text-slate-300">Manage your bookings</p>
                                            </div>
                                            <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-300" />
                                        </Button>
                                    </Link>

                                    <Link href="/b2b/profile">
                                        <Button
                                            variant="outline"
                                            className="group flex h-18 w-full items-center justify-start space-x-4 border-slate-600 transition-all duration-200 hover:border-slate-500 hover:bg-slate-700/30"
                                        >
                                            <div className="rounded-full bg-purple-600/20 p-3 transition-colors group-hover:bg-purple-700/30">
                                                <Building2 className="h-6 w-6 text-purple-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-100">Company Profile</p>
                                                <p className="text-xs text-slate-300">Update company information</p>
                                            </div>
                                            <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-300" />
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="outline"
                                        className="group flex h-18 w-full items-center justify-start space-x-4 border-slate-600 transition-all duration-200 hover:border-slate-500 hover:bg-slate-700/30"
                                        onClick={() => window.open('https://wa.me/6281234567890?text=Hi, I need help with my B2B account', '_blank')}
                                    >
                                        <div className="rounded-full bg-amber-600/20 p-3 transition-colors group-hover:bg-amber-700/30">
                                            <MessageCircle className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-slate-100">Contact Support</p>
                                            <p className="text-xs text-slate-300">Get help via WhatsApp</p>
                                        </div>
                                        <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-300" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    {recent_activity && recent_activity.length > 0 && (
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="border-b border-slate-700/50 p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-slate-700/50 p-2">
                                        <Activity className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-100">Recent Activity</h3>
                                        <p className="text-sm text-slate-300">Your latest business activities</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {recent_activity.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="group flex items-center space-x-4 rounded-xl border border-slate-700/50 p-4 transition-all duration-200 hover:border-slate-600 hover:bg-slate-700/30"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="rounded-full bg-blue-600/20 p-3 transition-colors group-hover:bg-blue-700/30">
                                                    <Activity className="h-5 w-5 text-blue-400" />
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-slate-100 transition-colors group-hover:text-slate-200">
                                                    {activity.message}
                                                </p>
                                                <p className="mt-1 text-xs font-medium text-slate-400">{formatDate(activity.created_at)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </B2BLayout>
    );
}
