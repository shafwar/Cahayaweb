import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, Calendar, Eye, MapPin, Package, Search, ShoppingCart, Users } from 'lucide-react';
import { useState } from 'react';

interface B2BPackagesProps {
    user: {
        id: number;
        name: string;
        email: string;
        user_type: {
            name: string;
            display_name: string;
        };
        b2b_verification?: {
            company_name: string;
            status: string;
        };
    };
    packages: {
        data: Array<{
            id: number;
            name: string;
            destination: string;
            description: string;
            price: number;
            b2b_price?: number;
            duration_days: number;
            max_travelers: number;
            departure_date: string;
            return_date: string;
            image_path?: string;
            is_active: boolean;
            purchases?: Array<{
                id: number;
                status: string;
            }>;
        }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function B2BPackages({ user, packages }: B2BPackagesProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('all');
    const [sortBy, setSortBy] = useState('latest');

    // Filter and sort packages
    const filteredPackages = packages.data.filter((pkg) => {
        const matchesSearch =
            pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDestination = selectedDestination === 'all' || pkg.destination === selectedDestination;
        return matchesSearch && matchesDestination;
    });

    // Get unique destinations for filter
    const destinations = Array.from(new Set(packages.data.map((pkg) => pkg.destination)));

    const getB2BPrice = (pkg: any) => {
        return pkg.b2b_price || pkg.price;
    };

    const getPriceDisplay = (pkg: any) => {
        const b2bPrice = getB2BPrice(pkg);
        const savings = pkg.price - b2bPrice;
        const savingsPercentage = Math.round((savings / pkg.price) * 100);

        return {
            b2bPrice,
            savings,
            savingsPercentage,
            hasDiscount: b2bPrice < pkg.price,
        };
    };

    return (
        <>
            <Head title="B2B Packages - Cahaya Anbiya" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Header */}
                <div className="border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                                    <Building2 className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">B2B Portal</h1>
                                    <p className="text-sm text-gray-400">Business Packages</p>
                                </div>
                            </div>

                            {/* Navigation & User Info */}
                            <div className="flex items-center gap-6">
                                {/* Navigation */}
                                <div className="flex items-center gap-4">
                                    <Link href={route('b2b.dashboard')} className="text-gray-400 transition-colors hover:text-white">
                                        Dashboard
                                    </Link>

                                    {/* Company Info */}
                                    {user.b2b_verification && (
                                        <div className="hidden text-right md:block">
                                            <p className="text-sm text-gray-400">Company</p>
                                            <p className="font-semibold text-white">{user.b2b_verification.company_name}</p>
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Welcome back,</p>
                                        <p className="text-lg font-bold text-white">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>

                                    {/* User Avatar & Status */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                                                <span className="text-lg font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            {/* Online Status Indicator */}
                                            <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-gray-900 bg-green-500"></div>
                                        </div>

                                        {/* Logout Button */}
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to logout?')) {
                                                    router.post(route('logout'));
                                                }
                                            }}
                                            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                                        >
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500">
                                    <Package className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="mb-2 text-2xl font-bold text-white">Exclusive B2B Travel Packages</h2>
                                    <p className="text-gray-300">
                                        Access special corporate rates and bulk booking options for your business travel needs.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">Total Packages</div>
                                    <div className="text-2xl font-bold text-white">{packages.total}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Filters and Search */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search packages..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-lg border border-gray-600 bg-gray-700/50 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                                    />
                                </div>

                                {/* Destination Filter */}
                                <div>
                                    <select
                                        value={selectedDestination}
                                        onChange={(e) => setSelectedDestination(e.target.value)}
                                        className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                                    >
                                        <option value="all">All Destinations</option>
                                        {destinations.map((dest) => (
                                            <option key={dest} value={dest}>
                                                {dest}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="duration">Duration</option>
                                    </select>
                                </div>

                                {/* Results Count */}
                                <div className="flex items-center justify-end">
                                    <span className="text-gray-400">
                                        {filteredPackages.length} of {packages.total} packages
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Packages Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredPackages.map((pkg, index) => {
                            const priceInfo = getPriceDisplay(pkg);

                            return (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="group overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 transition-all duration-200 hover:border-yellow-500/50"
                                >
                                    {/* Package Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500">
                                        {pkg.image_path ? (
                                            <img src={pkg.image_path} alt={pkg.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <MapPin className="h-16 w-16 text-white/50" />
                                            </div>
                                        )}

                                        {/* B2B Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-black">B2B RATE</span>
                                        </div>

                                        {/* Savings Badge */}
                                        {priceInfo.hasDiscount && (
                                            <div className="absolute top-3 right-3">
                                                <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                                                    SAVE {priceInfo.savingsPercentage}%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Package Content */}
                                    <div className="p-6">
                                        <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-yellow-400">
                                            {pkg.name}
                                        </h3>

                                        <div className="mb-3 flex items-center gap-2 text-gray-400">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">{pkg.destination}</span>
                                        </div>

                                        <p className="mb-4 line-clamp-2 text-sm text-gray-300">{pkg.description}</p>

                                        {/* Package Details */}
                                        <div className="mb-4 grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-300">{pkg.duration_days} days</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-300">Max {pkg.max_travelers}</span>
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        <div className="mb-4">
                                            {priceInfo.hasDiscount ? (
                                                <div>
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="text-2xl font-bold text-yellow-400">
                                                            Rp {priceInfo.b2bPrice.toLocaleString()}
                                                        </span>
                                                        <span className="text-sm text-gray-400 line-through">Rp {pkg.price.toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-sm text-green-400">
                                                        Save Rp {priceInfo.savings.toLocaleString()} per person
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-2xl font-bold text-yellow-400">Rp {priceInfo.b2bPrice.toLocaleString()}</div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('b2b.packages.show', pkg.id)}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 font-semibold text-white transition-all duration-200 hover:from-yellow-600 hover:to-orange-600"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </Link>
                                            <button className="rounded-lg bg-gray-700 p-2 text-white transition-colors hover:bg-gray-600">
                                                <ShoppingCart className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Pagination */}
                    {packages.last_page > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 flex justify-center"
                        >
                            <div className="flex items-center gap-2">
                                {Array.from({ length: packages.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`?page=${page}`}
                                        className={`rounded-lg border px-4 py-2 transition-colors ${
                                            page === packages.current_page
                                                ? 'border-yellow-500 bg-yellow-500 text-black'
                                                : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-yellow-500'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
