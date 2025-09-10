import { Link, useForm } from '@inertiajs/react';
import { BarChart3, CheckCircle, FileText, Home, LogOut, MessageSquare, Package, Settings, ShoppingCart, TrendingUp, Users } from 'lucide-react';

interface AdminSidebarProps {
    currentPath: string;
}

export default function AdminSidebar({ currentPath }: AdminSidebarProps) {
    const { post } = useForm();

    const handleLogout = () => {
        post(route('logout'));
    };

    const navigation = [
        {
            name: 'Dashboard',
            href: route('admin.dashboard'),
            icon: Home,
            badge: null,
            active: currentPath === '/admin' || currentPath === '/admin/',
            description: 'Overview & analytics',
        },
        {
            name: 'Users',
            href: route('admin.users'),
            icon: Users,
            badge: null,
            active: currentPath.includes('/admin/users'),
            description: 'Manage user accounts',
        },
        {
            name: 'Verifications',
            href: route('admin.verifications'),
            icon: CheckCircle,
            badge: 3, // Dynamic count
            active: currentPath.includes('/admin/verifications'),
            description: 'B2B account approvals',
        },
        {
            name: 'Packages',
            href: route('admin.packages'),
            icon: Package,
            badge: null,
            active: currentPath.includes('/admin/packages'),
            description: 'Tour packages',
        },
        {
            name: 'Purchases',
            href: route('admin.purchases'),
            icon: ShoppingCart,
            badge: 5, // Dynamic count
            active: currentPath.includes('/admin/purchases'),
            description: 'Order management',
        },
        {
            name: 'Analytics',
            href: route('admin.analytics'),
            icon: BarChart3,
            badge: null,
            active: currentPath.includes('/admin/analytics'),
            description: 'Reports & insights',
        },
        {
            name: 'Settings',
            href: route('admin.settings'),
            icon: Settings,
            badge: null,
            active: currentPath.includes('/admin/settings'),
            description: 'System configuration',
        },
    ];

    const quickActions = [
        {
            name: 'New Package',
            icon: Package,
            href: '#',
            color: 'from-blue-500 to-blue-600',
        },
        {
            name: 'Send Message',
            icon: MessageSquare,
            href: '#',
            color: 'from-green-500 to-green-600',
        },
        {
            name: 'View Reports',
            icon: FileText,
            href: '#',
            color: 'from-purple-500 to-purple-600',
        },
    ];

    return (
        <div className="flex h-full flex-col bg-gray-800 shadow-2xl">
            {/* Sidebar header - Fixed */}
            <div className="flex h-20 shrink-0 items-center gap-4 border-b border-gray-700 bg-gray-800 px-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                    <span className="text-xl font-bold text-white">CA</span>
                </div>
                <div className="space-y-0.5">
                    <span className="text-lg font-bold text-white">Admin Panel</span>
                    <p className="text-xs text-gray-400">Cahaya Anbiya</p>
                </div>
            </div>

            {/* Sidebar navigation - Scrollable */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <div className="mb-6">
                    <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">Main Navigation</h3>
                    <ul className="space-y-1">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                        item.active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                                            item.active ? 'bg-white/20' : 'bg-gray-700 group-hover:bg-gray-600'
                                        }`}
                                    >
                                        <item.icon
                                            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                                                item.active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                            }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span>{item.name}</span>
                                            {item.badge !== null && (
                                                <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">{item.badge}</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 group-hover:text-gray-300">{item.description}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="mb-6">
                    <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {quickActions.map((action) => (
                            <button
                                key={action.name}
                                className="group flex items-center gap-3 rounded-xl bg-gray-700 px-3 py-2 text-sm text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white"
                            >
                                <div className={`rounded-lg bg-gradient-to-r ${action.color} p-2`}>
                                    <action.icon className="h-4 w-4 text-white" />
                                </div>
                                <span>{action.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Preview */}
                <div className="rounded-xl bg-gray-700 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-xs font-semibold text-gray-300">Today's Stats</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">New Users</span>
                            <span className="font-medium text-green-400">+12</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Orders</span>
                            <span className="font-medium text-blue-400">+8</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Revenue</span>
                            <span className="font-medium text-yellow-400">+24%</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar footer - Fixed at bottom */}
            <div className="shrink-0 border-t border-gray-700 bg-gray-800 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
