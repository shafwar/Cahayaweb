import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, Filter, Grid, List, MapPin, Package, Search, Users } from 'lucide-react';
import { useState } from 'react';

interface Package {
    id: number;
    name: string;
    description: string;
    destination: string;
    price: number;
    b2b_price?: number;
    duration_days: number;
    max_travelers: number;
    departure_date: string;
    return_date: string;
    image_path?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface PackagesProps {
    user: {
        id: number;
        name: string;
        email: string;
        b2bVerification: {
            company_name: string;
            status: string;
        };
    };
    packages: {
        data: Package[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function B2BPackages({ user, packages }: PackagesProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
            month: 'long',
            day: 'numeric',
        });
    };

    const filteredPackages = packages.data.filter(
        (pkg) => pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getDiscountPercentage = (price: number, b2bPrice: number) => {
        if (!b2bPrice || b2bPrice >= price) return 0;
        return Math.round(((price - b2bPrice) / price) * 100);
    };

    const getAccentClasses = (accent: string) => {
        switch (accent) {
            case 'blue':
                return {
                    border: 'border-blue-500/20',
                    gradient: 'from-blue-600/20 to-blue-500/20',
                    text: 'text-blue-400',
                    button: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
                    shadow: 'shadow-blue-500/25 hover:shadow-blue-500/30',
                    textGradient: 'to-blue-100',
                };
            case 'emerald':
                return {
                    border: 'border-emerald-500/20',
                    gradient: 'from-emerald-600/20 to-emerald-500/20',
                    text: 'text-emerald-400',
                    button: 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
                    shadow: 'shadow-emerald-500/25 hover:shadow-emerald-500/30',
                    textGradient: 'to-emerald-100',
                };
            case 'purple':
                return {
                    border: 'border-purple-500/20',
                    gradient: 'from-purple-600/20 to-purple-500/20',
                    text: 'text-purple-400',
                    button: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
                    shadow: 'shadow-purple-500/25 hover:shadow-purple-500/30',
                    textGradient: 'to-purple-100',
                };
            default:
                return {
                    border: 'border-blue-500/20',
                    gradient: 'from-blue-600/20 to-blue-500/20',
                    text: 'text-blue-400',
                    button: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
                    shadow: 'shadow-blue-500/25 hover:shadow-blue-500/30',
                    textGradient: 'to-blue-100',
                };
        }
    };

    return (
        <B2BLayout user={user}>
            <Head title="B2B Packages" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-4 sm:space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div>
                            <h1 className="bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 bg-clip-text text-2xl font-bold text-transparent sm:text-4xl">
                                B2B Packages
                            </h1>
                            <p className="mt-1 text-sm text-slate-300 sm:mt-2 sm:text-lg">Exclusive business rates and corporate travel packages</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className={
                                    viewMode === 'grid'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                                }
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={
                                    viewMode === 'list'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                                }
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm sm:rounded-2xl">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                        <Input
                                            placeholder="Search packages..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-slate-600 bg-slate-700/50 pl-10 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-base"
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex w-full items-center space-x-2 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50 sm:w-auto"
                                >
                                    <Filter className="h-4 w-4" />
                                    <span className="text-sm">Filters</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Packages Grid/List */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                            {filteredPackages.map((package_item, index) => {
                                const cardVariants = [
                                    'bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 border-slate-600/50 hover:border-blue-500/50',
                                    'bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 border-slate-600/50 hover:border-emerald-500/50',
                                    'bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 border-slate-600/50 hover:border-purple-500/50',
                                ];
                                const accentColors = ['blue', 'emerald', 'purple'];
                                const currentAccent = accentColors[index % accentColors.length];
                                const accentClasses = getAccentClasses(currentAccent);

                                return (
                                    <div
                                        key={package_item.id}
                                        className={`rounded-xl border ${cardVariants[index % cardVariants.length]} overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${accentClasses.shadow} sm:rounded-2xl`}
                                    >
                                        {package_item.image_path && (
                                            <div
                                                className={`aspect-video bg-gradient-to-br from-slate-700/50 to-slate-600/50 shadow-lg ${accentClasses.shadow}`}
                                            >
                                                <img
                                                    src={package_item.image_path}
                                                    alt={package_item.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4 sm:p-6">
                                            <div className="space-y-3 sm:space-y-4">
                                                <div>
                                                    <h3 className="mb-1 text-base font-bold text-slate-100 sm:mb-2 sm:text-lg">
                                                        {package_item.name}
                                                    </h3>
                                                    <p className="line-clamp-2 text-xs text-slate-300 sm:text-sm">{package_item.description}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2 text-xs text-slate-300 sm:text-sm">
                                                        <div
                                                            className={`rounded-full bg-gradient-to-r ${accentClasses.gradient} border p-1 ${accentClasses.border}`}
                                                        >
                                                            <MapPin className={`h-3 w-3 ${accentClasses.text}`} />
                                                        </div>
                                                        <span className="truncate">{package_item.destination}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-xs text-slate-300 sm:text-sm">
                                                        <div className="rounded-full border border-emerald-500/20 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-1">
                                                            <Clock className="h-3 w-3 text-emerald-400" />
                                                        </div>
                                                        <span>{package_item.duration_days} days</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-xs text-slate-300 sm:text-sm">
                                                        <div className="rounded-full border border-purple-500/20 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-1">
                                                            <Users className="h-3 w-3 text-purple-400" />
                                                        </div>
                                                        <span>Max {package_item.max_travelers} travelers</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-xs text-slate-300 sm:text-sm">
                                                        <div className="rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-600/20 to-orange-600/20 p-1">
                                                            <Calendar className="h-3 w-3 text-amber-400" />
                                                        </div>
                                                        <span className="truncate">{formatDate(package_item.departure_date)}</span>
                                                    </div>
                                                </div>

                                                <div className={`border-t pt-3 sm:pt-4 ${accentClasses.border}`}>
                                                    <div className="mb-2 flex items-center justify-between sm:mb-3">
                                                        <div>
                                                            {package_item.b2b_price && package_item.b2b_price < package_item.price ? (
                                                                <div>
                                                                    <p className="text-xs text-slate-400 line-through sm:text-sm">
                                                                        {formatCurrency(package_item.price)}
                                                                    </p>
                                                                    <p
                                                                        className={`bg-gradient-to-r from-slate-100 text-lg font-bold ${accentClasses.textGradient} bg-clip-text text-transparent sm:text-xl`}
                                                                    >
                                                                        {formatCurrency(package_item.b2b_price)}
                                                                    </p>
                                                                    <Badge
                                                                        className={`bg-gradient-to-r text-xs ${accentClasses.gradient} ${accentClasses.text} border ${accentClasses.border}`}
                                                                    >
                                                                        {getDiscountPercentage(package_item.price, package_item.b2b_price)}% B2B
                                                                        Discount
                                                                    </Badge>
                                                                </div>
                                                            ) : (
                                                                <p
                                                                    className={`bg-gradient-to-r from-slate-100 text-lg font-bold ${accentClasses.textGradient} bg-clip-text text-transparent sm:text-xl`}
                                                                >
                                                                    {formatCurrency(package_item.price)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Link href={`/b2b/packages/${package_item.id}`}>
                                                        <Button
                                                            size="sm"
                                                            className={`w-full bg-gradient-to-r ${accentClasses.button} text-white shadow-lg ${accentClasses.shadow} text-sm transition-all duration-200 hover:shadow-xl sm:text-base`}
                                                        >
                                                            <Package className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                                            <span className="hidden sm:inline">View Details & Book</span>
                                                            <span className="sm:hidden">View & Book</span>
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {filteredPackages.map((package_item, index) => {
                                const accentColors = ['blue', 'emerald', 'purple'];
                                const currentAccent = accentColors[index % accentColors.length];
                                const accentClasses = getAccentClasses(currentAccent);

                                return (
                                    <div
                                        key={package_item.id}
                                        className={`rounded-xl border border-slate-700/50 bg-slate-800/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${accentClasses.shadow} sm:rounded-2xl`}
                                    >
                                        <div className="p-4 sm:p-6">
                                            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row">
                                                {package_item.image_path && (
                                                    <div
                                                        className={`aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-600/50 shadow-lg ${accentClasses.shadow} lg:w-64`}
                                                    >
                                                        <img
                                                            src={package_item.image_path}
                                                            alt={package_item.name}
                                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex-1 space-y-3 sm:space-y-4">
                                                    <div>
                                                        <h3 className="mb-1 text-lg font-bold text-slate-100 sm:mb-2 sm:text-xl">
                                                            {package_item.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-300 sm:text-base">{package_item.description}</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 sm:gap-4 sm:text-sm md:grid-cols-4">
                                                        <div className="flex items-center space-x-2 text-slate-300">
                                                            <div
                                                                className={`rounded-full bg-gradient-to-r ${accentClasses.gradient} border p-1 ${accentClasses.border}`}
                                                            >
                                                                <MapPin className={`h-3 w-3 ${accentClasses.text}`} />
                                                            </div>
                                                            <span>{package_item.destination}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-slate-300">
                                                            <div className="rounded-full border border-emerald-500/20 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-1">
                                                                <Clock className="h-3 w-3 text-emerald-400" />
                                                            </div>
                                                            <span>{package_item.duration_days} days</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-slate-300">
                                                            <div className="rounded-full border border-purple-500/20 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-1">
                                                                <Users className="h-3 w-3 text-purple-400" />
                                                            </div>
                                                            <span>Max {package_item.max_travelers}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-slate-300">
                                                            <div className="rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-600/20 to-orange-600/20 p-1">
                                                                <Calendar className="h-3 w-3 text-amber-400" />
                                                            </div>
                                                            <span>{formatDate(package_item.departure_date)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            {package_item.b2b_price && package_item.b2b_price < package_item.price ? (
                                                                <div>
                                                                    <p className="text-xs text-slate-400 line-through sm:text-sm">
                                                                        {formatCurrency(package_item.price)}
                                                                    </p>
                                                                    <p
                                                                        className={`bg-gradient-to-r from-slate-100 text-lg font-bold ${accentClasses.textGradient} bg-clip-text text-transparent sm:text-2xl`}
                                                                    >
                                                                        {formatCurrency(package_item.b2b_price)}
                                                                    </p>
                                                                    <Badge
                                                                        className={`bg-gradient-to-r text-xs ${accentClasses.gradient} ${accentClasses.text} border ${accentClasses.border}`}
                                                                    >
                                                                        {getDiscountPercentage(package_item.price, package_item.b2b_price)}% B2B
                                                                        Discount
                                                                    </Badge>
                                                                </div>
                                                            ) : (
                                                                <p
                                                                    className={`bg-gradient-to-r from-slate-100 text-lg font-bold ${accentClasses.textGradient} bg-clip-text text-transparent sm:text-2xl`}
                                                                >
                                                                    {formatCurrency(package_item.price)}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <Link href={`/b2b/packages/${package_item.id}`}>
                                                            <Button
                                                                size="sm"
                                                                className={`w-full bg-gradient-to-r ${accentClasses.button} text-white shadow-lg ${accentClasses.shadow} text-sm transition-all duration-200 hover:shadow-xl sm:w-auto sm:text-base`}
                                                            >
                                                                <Package className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                                                <span className="hidden sm:inline">View Details & Book</span>
                                                                <span className="sm:hidden">View & Book</span>
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {packages.last_page > 1 && (
                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm sm:rounded-2xl">
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-slate-300 sm:text-sm">
                                        Showing {(packages.current_page - 1) * packages.per_page + 1} to{' '}
                                        {Math.min(packages.current_page * packages.per_page, packages.total)} of {packages.total} packages
                                    </p>
                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                        {packages.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded-md px-2 py-1 text-xs transition-all duration-200 sm:px-3 sm:py-2 sm:text-sm ${link.active ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100'} ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Link>
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
