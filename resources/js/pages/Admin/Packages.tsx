import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Filter, MoreHorizontal, Package, Plus, Search, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: string;
    destination: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface PackagesProps {
    packages: {
        data: Package[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        is_active?: string;
    };
}

export default function Packages({ packages, filters }: PackagesProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.is_active || 'all');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedStatus !== 'all') params.append('is_active', selectedStatus);

        window.location.href = `${route('admin.packages')}?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        window.location.href = route('admin.packages');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AdminLayout title="Packages">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                            Tour Packages
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Manage and organize travel packages for your customers
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-400">
                            <span>Total: {packages.total}</span>
                            <span className="text-green-400">•</span>
                            <span className="text-green-400">
                                {packages.data.filter(p => p.is_active).length} Active
                            </span>
                        </div>
                        <Link
                            href="#"
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Add Package</span>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Filters Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 sm:mb-8 rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6"
            >
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search packages by name or destination..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={handleSearch}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            <Search className="h-4 w-4" />
                            <span className="hidden sm:inline">Search</span>
                        </button>
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                        >
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">Clear</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Packages Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
                {packages.data.map((pkg, index) => (
                    <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 hover:border-gray-600 transition-all duration-300"
                    >
                        {/* Package Image Placeholder */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Package className="h-16 w-16 text-white/80" />
                            </div>
                            <div className="absolute top-3 right-3">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                    pkg.is_active
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                    {pkg.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* Package Content */}
                        <div className="p-4 sm:p-6">
                            <div className="mb-3">
                                <h3 className="font-semibold text-white text-sm sm:text-base mb-1 line-clamp-2">
                                    {pkg.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                                    {pkg.description}
                                </p>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <span className="text-gray-400">Destination:</span>
                                    <span className="text-white font-medium">{pkg.destination}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white font-medium">{pkg.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <span className="text-gray-400">Price:</span>
                                    <span className="text-green-400 font-bold">{formatPrice(pkg.price)}</span>
                                </div>
                            </div>

                            {/* Package Stats */}
                            <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-400" />
                                    <span>4.8 (120 reviews)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-green-400" />
                                    <span>+15% this month</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700">
                                    Edit Package
                                </button>
                                <button className="rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {packages.data.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center py-12 sm:py-16"
                >
                    <div className="mx-auto max-w-md">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 mb-4">
                            <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No packages found</h3>
                        <p className="text-gray-400 text-sm sm:text-base mb-6">
                            {searchTerm || selectedStatus !== 'all'
                                ? 'Try adjusting your search criteria or filters.'
                                : 'Get started by creating your first tour package.'
                            }
                        </p>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create Package
                        </Link>
                    </div>
                </motion.div>
            )}

            {/* Pagination */}
            {packages.last_page > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 rounded-xl border border-gray-700 bg-gray-800 px-6 py-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            Showing {((packages.current_page - 1) * packages.per_page) + 1} to {Math.min(packages.current_page * packages.per_page, packages.total)} of {packages.total} results
                        </div>
                        <div className="flex items-center gap-2">
                            {packages.current_page > 1 && (
                                <Link
                                    href={`${route('admin.packages')}?page=${packages.current_page - 1}`}
                                    className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                                >
                                    Previous
                                </Link>
                            )}
                            <span className="text-sm text-gray-400">
                                Page {packages.current_page} of {packages.last_page}
                            </span>
                            {packages.current_page < packages.last_page && (
                                <Link
                                    href={`${route('admin.packages')}?page=${packages.current_page + 1}`}
                                    className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AdminLayout>
    );
}
