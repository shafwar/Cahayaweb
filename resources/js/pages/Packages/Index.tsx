import PackageCard from '@/components/PackageCard';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Filter, MapPin, Search, X } from 'lucide-react';
import { useState } from 'react';

interface Package {
    id: number;
    name: string;
    description: string;
    destination: string;
    duration_days: number;
    price: number;
    b2b_price?: number;
    image_path?: string;
    highlights?: string[];
    type: string;
    is_active: boolean;
    departure_date?: string;
    price_for_user?: number;
}

interface PackagesIndexProps {
    packages: {
        data: Package[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        type?: string;
        destination?: string;
        min_price?: number;
        max_price?: number;
    };
    user?: any;
}

export default function PackagesIndex({ packages, filters, user }: PackagesIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.destination || '');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [priceRange, setPriceRange] = useState({
        min: filters.min_price || '',
        max: filters.max_price || '',
    });
    const [showFilters, setShowFilters] = useState(false);

    const packageTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'umrah', label: 'Umrah' },
        { value: 'hajj', label: 'Hajj' },
        { value: 'vacation', label: 'Vacation' },
        { value: 'business', label: 'Business' },
    ];

    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('destination', searchTerm);
        if (selectedType !== 'all') params.append('type', selectedType);
        if (priceRange.min) params.append('min_price', priceRange.min.toString());
        if (priceRange.max) params.append('max_price', priceRange.max.toString());
        return params.toString();
    };

    const handleSearch = () => {
        const query = buildQueryString();
        window.location.href = `${route('packages.index')}?${query}`;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('all');
        setPriceRange({ min: '', max: '' });
        window.location.href = route('packages.index');
    };

    return (
        <>
            <Head title="Travel Packages - Cahaya Anbiya" />

            <div className="bg-gray-50 min-h-screen">
                {/* Hero Section */}
                <div className="from-blue-600 to-yellow-500 text-white bg-gradient-to-r">
                    <div className="px-4 py-16 container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Discover Amazing Travel Packages</h1>
                            <p className="mb-8 text-xl text-blue-100">From Umrah & Hajj to luxury vacations, find your perfect journey</p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto">
                                <div className="gap-2 flex">
                                    <div className="relative flex-1">
                                        <Search className="left-3 h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 transform" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search destinations..."
                                            className="rounded-lg py-3 pl-10 pr-4 text-gray-900 focus:ring-yellow-400 w-full focus:border-transparent focus:ring-2"
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="gap-2 rounded-lg bg-white/20 px-4 py-3 hover:bg-white/30 flex items-center transition-colors"
                                    >
                                        <Filter className="h-5 w-5" />
                                        Filters
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold hover:bg-yellow-600 transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Filters Section */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-gray-200 bg-white border-b"
                    >
                        <div className="px-4 py-6 container mx-auto">
                            <div className="gap-6 md:grid-cols-3 grid grid-cols-1">
                                {/* Package Type Filter */}
                                <div>
                                    <label className="mb-2 text-sm font-medium text-gray-700 block">Package Type</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="rounded-lg border-gray-300 px-3 py-2 focus:ring-yellow-400 w-full border focus:border-transparent focus:ring-2"
                                    >
                                        {packageTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div>
                                    <label className="mb-2 text-sm font-medium text-gray-700 block">Price Range (IDR)</label>
                                    <div className="gap-2 flex">
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            placeholder="Min"
                                            className="rounded-lg border-gray-300 px-3 py-2 focus:ring-yellow-400 flex-1 border focus:border-transparent focus:ring-2"
                                        />
                                        <span className="text-gray-500 flex items-center">-</span>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            placeholder="Max"
                                            className="rounded-lg border-gray-300 px-3 py-2 focus:ring-yellow-400 flex-1 border focus:border-transparent focus:ring-2"
                                        />
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="gap-2 rounded-lg border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 flex w-full items-center justify-center border transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Packages Grid */}
                <div className="px-4 py-8 container mx-auto">
                    {/* Results Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{packages.total} Packages Found</h2>
                            {Object.values(filters).some(Boolean) && <p className="mt-1 text-gray-600">Showing filtered results</p>}
                        </div>

                        {/* Sort Options */}
                        <div className="gap-4 flex items-center">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select className="rounded-lg border-gray-300 px-3 py-2 focus:ring-yellow-400 border focus:border-transparent focus:ring-2">
                                <option value="newest">Newest</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="duration">Duration</option>
                            </select>
                        </div>
                    </div>

                    {/* Packages Grid */}
                    {packages.data.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="gap-6 md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1"
                        >
                            {packages.data.map((pkg, index) => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <PackageCard package={pkg} user={user} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                            <div className="max-w-md mx-auto">
                                <MapPin className="mb-4 h-16 w-16 text-gray-400 mx-auto" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">No packages found</h3>
                                <p className="mb-6 text-gray-600">Try adjusting your search criteria or browse all available packages.</p>
                                <button onClick={clearFilters} className="cahaya-button-primary">
                                    View All Packages
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {packages.last_page > 1 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="gap-2 flex items-center">
                                {Array.from({ length: packages.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`${route('packages.index')}?page=${page}&${buildQueryString()}`}
                                        className={`rounded-lg px-4 py-2 transition-colors ${
                                            page === packages.current_page
                                                ? 'bg-yellow-500 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 border'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
