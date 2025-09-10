import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link } from '@inertiajs/react';
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
}

export default function B2BDashboard({ user, stats, recent_packages, recent_activity }: DashboardProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'New package available: Dubai Business Trip', time: '2 hours ago', type: 'info' },
        { id: 2, message: 'Your booking #CA-B2B-20241215-0001 has been confirmed', time: '1 day ago', type: 'success' },
        { id: 3, message: 'Payment reminder for booking #CA-B2B-20241214-0002', time: '2 days ago', type: 'warning' },
    ]);

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
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-emerald-500" />;
            case 'warning':
                return <Bell className="h-4 w-4 text-amber-500" />;
            case 'info':
                return <Activity className="h-4 w-4 text-blue-500" />;
            default:
                return <Bell className="h-4 w-4 text-slate-500" />;
        }
    };

    const handleQuickAction = (action: string) => {
        console.log(`Quick action: ${action}`);
        // Add specific actions here
    };

    return (
        <B2BLayout user={user}>
            <Head title="B2B Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236B7280' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                ></div>

                <div className="relative space-y-8 p-6">
                    {/* Enhanced Header Section */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white p-8 shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/30 to-slate-50/30"></div>
                        <div className="relative flex flex-col justify-between space-y-6 lg:flex-row lg:items-center lg:space-y-0">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-gray-100 p-3">
                                        <Building2 className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            Welcome back, {user.name}!
                                        </h1>
                                        <p className="font-medium text-gray-600">{user.b2bVerification?.company_name || 'Business Account'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {currentTime.toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {currentTime.toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickAction('refresh')}
                                    className="flex items-center space-x-2 border-gray-300 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
                                >
                                    <Activity className="h-4 w-4" />
                                    <span>Refresh</span>
                                </Button>
                                <Link href="/b2b/packages">
                                    <Button className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all duration-200">
                                        <Plus className="h-4 w-4" />
                                        <span>New Booking</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Status Banner */}
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-slate-50/50"></div>
                        <div className="relative p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        <div className="rounded-full bg-green-100 p-4">
                                            <Building2 className="h-8 w-8 text-green-600" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                                            <CheckCircle className="h-3 w-3 text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-gray-900">Business Account Active</h2>
                                        <p className="text-lg text-gray-600">Access exclusive B2B rates and corporate travel solutions</p>
                                        <div className="flex items-center space-x-2 text-gray-500">
                                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                                            <span className="text-sm">Real-time status monitoring</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 rounded-2xl border border-green-200 bg-green-50 px-6 py-3">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">{user.b2bVerification?.status || 'Approved'}</div>
                                        <div className="text-sm text-gray-600">Verified Partner</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10"></div>
                            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5"></div>
                            <div className="relative p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-blue-100">Available Packages</p>
                                        <p className="text-4xl font-bold text-white">{stats.total_packages}</p>
                                        <div className="flex items-center space-x-1">
                                            <TrendingUp className="h-3 w-3 text-blue-200" />
                                            <p className="text-xs text-blue-200">+2 this month</p>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-white/20 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                                        <Package className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <Link href="/b2b/packages">
                                    <Button variant="ghost" size="sm" className="w-full text-white transition-all duration-200 hover:bg-white/20">
                                        View All <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10"></div>
                            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5"></div>
                            <div className="relative p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-emerald-100">Active Bookings</p>
                                        <p className="text-4xl font-bold text-white">{stats.active_bookings}</p>
                                        <div className="flex items-center space-x-1">
                                            <CheckCircle className="h-3 w-3 text-emerald-200" />
                                            <p className="text-xs text-emerald-200">All confirmed</p>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-white/20 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                                        <ShoppingCart className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <Link href="/b2b/bookings">
                                    <Button variant="ghost" size="sm" className="w-full text-white transition-all duration-200 hover:bg-white/20">
                                        Manage <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10"></div>
                            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5"></div>
                            <div className="relative p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-amber-100">Total Spent</p>
                                        <p className="text-3xl font-bold text-white">{formatCurrency(stats.total_spent)}</p>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-3 w-3 text-amber-200" />
                                            <p className="text-xs text-amber-200">This year</p>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-white/20 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                                        <DollarSign className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full text-white transition-all duration-200 hover:bg-white/20">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    View Report
                                </Button>
                            </div>
                        </div>

                        <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10"></div>
                            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5"></div>
                            <div className="relative p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-purple-100">Upcoming Trips</p>
                                        <p className="text-4xl font-bold text-white">{stats.upcoming_trips}</p>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-3 w-3 text-purple-200" />
                                            <p className="text-xs text-purple-200">Next 30 days</p>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-white/20 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                                        <Calendar className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full text-white transition-all duration-200 hover:bg-white/20">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    View Calendar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Enhanced Company Information */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white"></div>
                            <div className="relative">
                                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/50 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-2">
                                                <Building2 className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">Company Profile</h3>
                                                <p className="text-sm text-slate-600">Business information</p>
                                            </div>
                                        </div>
                                        <Link href="/b2b/profile">
                                            <Button variant="ghost" size="sm" className="transition-colors hover:bg-slate-100">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="space-y-6 p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                                            <div className="rounded-full bg-blue-100 p-3">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-600">Company Name</p>
                                                <p className="font-semibold text-slate-900">{user.b2bVerification?.company_name || 'Not Set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                                            <div className="rounded-full bg-emerald-100 p-3">
                                                <Users className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-600">Contact Person</p>
                                                <p className="font-semibold text-slate-900">{user.b2bVerification?.contact_person || 'Not Set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                                            <div className="rounded-full bg-amber-100 p-3">
                                                <MessageCircle className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-600">Email</p>
                                                <p className="font-semibold text-slate-900">{user.b2bVerification?.contact_email || user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 rounded-xl border border-purple-100 bg-purple-50/50 p-3">
                                            <div className="rounded-full bg-purple-100 p-3">
                                                <Bell className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-600">Phone</p>
                                                <p className="font-semibold text-slate-900">{user.b2bVerification?.contact_phone || 'Not Set'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4">
                                        <div className="flex items-center justify-between rounded-xl bg-slate-50/50 p-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Verification Status</p>
                                                <p className="text-xs text-slate-500">Account verification</p>
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
                        </div>

                        {/* Enhanced Featured Packages */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl lg:col-span-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30"></div>
                            <div className="relative">
                                <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-2">
                                                <Package className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">Featured Packages</h3>
                                                <p className="text-sm text-slate-600">Exclusive B2B travel packages</p>
                                            </div>
                                        </div>
                                        <Link href="/b2b/packages">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center space-x-2 border-blue-200 text-blue-600 transition-all hover:border-blue-300 hover:bg-blue-50"
                                            >
                                                <span>View All</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {recent_packages.map((package_item) => (
                                            <div
                                                key={package_item.id}
                                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                <div className="relative">
                                                    {package_item.image_path && (
                                                        <div className="mb-4 aspect-video overflow-hidden rounded-xl bg-slate-100 shadow-sm">
                                                            <img
                                                                src={package_item.image_path}
                                                                alt={package_item.name}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="space-y-4">
                                                        <div className="flex items-start justify-between">
                                                            <h4 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                                                                {package_item.name}
                                                            </h4>
                                                            <div className="flex items-center space-x-1 rounded-full bg-amber-50 px-2 py-1">
                                                                <Star className="h-4 w-4 fill-current text-amber-400" />
                                                                <span className="text-sm font-medium text-amber-700">4.8</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="rounded-full bg-blue-100 p-1">
                                                                    <MapPin className="h-3 w-3 text-blue-600" />
                                                                </div>
                                                                <span className="font-medium">{package_item.destination}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="rounded-full bg-emerald-100 p-1">
                                                                    <Clock className="h-3 w-3 text-emerald-600" />
                                                                </div>
                                                                <span className="font-medium">{package_item.duration_days} days</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                                                            <div>
                                                                <p className="text-xl font-bold text-slate-900">
                                                                    {formatCurrency(package_item.price)}
                                                                </p>
                                                                <p className="text-xs font-medium text-slate-500">B2B Exclusive Rate</p>
                                                            </div>
                                                            <Link href={`/b2b/packages/${package_item.id}`}>
                                                                <Button
                                                                    size="sm"
                                                                    className="transform bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {recent_packages.length === 0 && (
                                        <div className="py-16 text-center">
                                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                                                <Package className="h-10 w-10 text-slate-400" />
                                            </div>
                                            <h3 className="mb-2 text-xl font-semibold text-slate-900">No packages available</h3>
                                            <p className="mb-6 text-slate-600">Check back later for new travel packages.</p>
                                            <Link href="/b2b/packages">
                                                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                                    Browse All Packages
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Notifications & Quick Actions */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Enhanced Recent Notifications */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/30"></div>
                            <div className="relative">
                                <div className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50/50 p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-2">
                                            <Bell className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">Recent Notifications</h3>
                                            <p className="text-sm text-slate-600">Stay updated with latest news</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className="group flex items-start space-x-4 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                                            >
                                                <div className="mt-1 flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-900 transition-colors group-hover:text-slate-700">
                                                        {notification.message}
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-slate-500">{notification.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 border-t border-slate-200 pt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-slate-200 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                                        >
                                            View All Notifications
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Quick Actions */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30"></div>
                            <div className="relative">
                                <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50/50 p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-2">
                                            <Activity className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                                            <p className="text-sm text-slate-600">Common tasks and navigation shortcuts</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <Link href="/b2b/packages">
                                            <Button
                                                variant="outline"
                                                className="group flex h-18 w-full items-center justify-start space-x-4 border-slate-200 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                                            >
                                                <div className="rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200">
                                                    <Package className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-slate-900">Browse Packages</p>
                                                    <p className="text-xs text-slate-600">Explore available travel packages</p>
                                                </div>
                                                <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-600" />
                                            </Button>
                                        </Link>

                                        <Link href="/b2b/bookings">
                                            <Button
                                                variant="outline"
                                                className="group flex h-18 w-full items-center justify-start space-x-4 border-slate-200 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
                                            >
                                                <div className="rounded-full bg-emerald-100 p-3 transition-colors group-hover:bg-emerald-200">
                                                    <ShoppingCart className="h-6 w-6 text-emerald-600" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-slate-900">My Bookings</p>
                                                    <p className="text-xs text-slate-600">Manage your bookings</p>
                                                </div>
                                                <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-colors group-hover:text-emerald-600" />
                                            </Button>
                                        </Link>

                                        <Link href="/b2b/profile">
                                            <Button
                                                variant="outline"
                                                className="group flex h-18 w-full items-center justify-start space-x-4 border-slate-200 transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                                            >
                                                <div className="rounded-full bg-purple-100 p-3 transition-colors group-hover:bg-purple-200">
                                                    <Building2 className="h-6 w-6 text-purple-600" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-slate-900">Company Profile</p>
                                                    <p className="text-xs text-slate-600">Update company information</p>
                                                </div>
                                                <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-colors group-hover:text-purple-600" />
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="outline"
                                            className="group flex h-18 w-full items-center justify-start space-x-4 border-slate-200 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md"
                                            onClick={() =>
                                                window.open('https://wa.me/6281234567890?text=Hi, I need help with my B2B account', '_blank')
                                            }
                                        >
                                            <div className="rounded-full bg-amber-100 p-3 transition-colors group-hover:bg-amber-200">
                                                <MessageCircle className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900">Contact Support</p>
                                                <p className="text-xs text-slate-600">Get help via WhatsApp</p>
                                            </div>
                                            <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-colors group-hover:text-amber-600" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Recent Activity */}
                    {recent_activity && recent_activity.length > 0 && (
                        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-slate-100/30"></div>
                            <div className="relative">
                                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/50 p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-full bg-gradient-to-r from-slate-500 to-slate-600 p-2">
                                            <Activity className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                                            <p className="text-sm text-slate-600">Your latest business activities</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {recent_activity.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="group flex items-center space-x-4 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200">
                                                        <Activity className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-900 transition-colors group-hover:text-slate-700">
                                                        {activity.message}
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-slate-500">{formatDate(activity.created_at)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </B2BLayout>
    );
}
