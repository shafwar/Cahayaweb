import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
    title: string;
    onMenuClick: () => void;
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const { post } = useForm();

    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="flex h-20 shrink-0 items-center justify-between border-b border-gray-700 bg-gray-800 px-4 sm:px-6 lg:px-8"
        >
            {/* Left side */}
            <div className="flex items-center gap-3 sm:gap-4">
                <button onClick={onMenuClick} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white lg:hidden">
                    <Menu className="h-5 w-5" />
                </button>

                <div className="hidden sm:block">
                    <h1 className="text-lg font-semibold text-white sm:text-xl">{title}</h1>
                    <p className="text-sm text-gray-400">Cahaya Anbiya Admin</p>
                </div>

                {/* Mobile title */}
                <div className="sm:hidden">
                    <h1 className="text-base font-semibold text-white">{title}</h1>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                {/* Search - Hidden on mobile, visible on tablet+ */}
                <div className="hidden md:relative md:block">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-48 rounded-lg border border-gray-600 bg-gray-700 py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none lg:w-64"
                    />
                </div>

                {/* Notifications */}
                <button className="relative rounded-lg p-2.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </button>

                {/* Dark mode toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="rounded-lg p-2.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                {/* User dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center gap-3 rounded-lg p-2.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg sm:h-9 sm:w-9">
                            <span className="text-sm font-bold text-white">A</span>
                        </div>
                        <div className="hidden text-left lg:block">
                            <p className="text-sm font-medium text-white">Admin</p>
                            <p className="text-xs text-gray-400">admin@cahayaanbiya.com</p>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User dropdown menu */}
                    {userDropdownOpen && (
                        <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-gray-700 bg-gray-800 shadow-xl sm:w-64">
                            <div className="p-3 sm:p-4">
                                <div className="flex items-center gap-3 border-b border-gray-700 pb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 sm:h-10 sm:w-10">
                                        <span className="text-xs font-bold text-white sm:text-sm">A</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-white sm:text-base">Admin Cahaya Anbiya</p>
                                        <p className="truncate text-xs text-gray-400 sm:text-sm">Super Administrator</p>
                                    </div>
                                </div>

                                <div className="space-y-1 pt-3">
                                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white">
                                        <User className="h-4 w-4" />
                                        Profile Settings
                                    </button>
                                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white">
                                        <Settings className="h-4 w-4" />
                                        Account Settings
                                    </button>
                                    <div className="border-t border-gray-700 pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-600 hover:text-white"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.header>
    );
}
