import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, DollarSign, Download, Eye, Package, Plus, Search, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Booking {
    id: number;
    booking_reference: string;
    invoice_number: string;
    package: {
        id: number;
        name: string;
        destination: string;
        image_path?: string;
    };
    travelers_count: number;
    total_amount: number;
    final_amount: number;
    status: 'pending' | 'confirmed' | 'rejected';
    status_history: Array<{
        status: string;
        timestamp: string;
        note?: string;
    }>;
    payment_proof?: string;
    created_at: string;
    updated_at: string;
}

interface BookingsProps {
    user: {
        id: number;
        name: string;
        email: string;
        b2bVerification: {
            company_name: string;
            status: string;
        };
    };
    bookings: {
        data: Booking[];
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

export default function B2BBookings({ user, bookings }: BookingsProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Dynamic accent colors for consistent theming
    const accentColors = ['blue', 'emerald', 'purple', 'amber'];

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
                    bg: 'bg-blue-600/10',
                    iconBg: 'bg-blue-600/20',
                    iconText: 'text-blue-400',
                };
            case 'emerald':
                return {
                    border: 'border-emerald-500/20',
                    gradient: 'from-emerald-600/20 to-emerald-500/20',
                    text: 'text-emerald-400',
                    button: 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
                    shadow: 'shadow-emerald-500/25 hover:shadow-emerald-500/30',
                    textGradient: 'to-emerald-100',
                    bg: 'bg-emerald-600/10',
                    iconBg: 'bg-emerald-600/20',
                    iconText: 'text-emerald-400',
                };
            case 'purple':
                return {
                    border: 'border-purple-500/20',
                    gradient: 'from-purple-600/20 to-purple-500/20',
                    text: 'text-purple-400',
                    button: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
                    shadow: 'shadow-purple-500/25 hover:shadow-purple-500/30',
                    textGradient: 'to-purple-100',
                    bg: 'bg-purple-600/10',
                    iconBg: 'bg-purple-600/20',
                    iconText: 'text-purple-400',
                };
            case 'amber':
                return {
                    border: 'border-amber-500/20',
                    gradient: 'from-amber-600/20 to-amber-500/20',
                    text: 'text-amber-400',
                    button: 'from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800',
                    shadow: 'shadow-amber-500/25 hover:shadow-amber-500/30',
                    textGradient: 'to-amber-100',
                    bg: 'bg-amber-600/10',
                    iconBg: 'bg-amber-600/20',
                    iconText: 'text-amber-400',
                };
            default:
                return {
                    border: 'border-blue-500/20',
                    gradient: 'from-blue-600/20 to-blue-500/20',
                    text: 'text-blue-400',
                    button: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
                    shadow: 'shadow-blue-500/25 hover:shadow-blue-500/30',
                    textGradient: 'to-blue-100',
                    bg: 'bg-blue-600/10',
                    iconBg: 'bg-blue-600/20',
                    iconText: 'text-blue-400',
                };
        }
    };

    const formatCurrency = (amount: number) => {
        // Handle invalid amounts
        if (!amount || isNaN(amount) || !isFinite(amount)) {
            return 'Rp 0';
        }

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
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20';
            case 'pending':
                return 'bg-amber-600/20 text-amber-400 border-amber-500/20';
            case 'rejected':
                return 'bg-red-600/20 text-red-400 border-red-500/20';
            default:
                return 'bg-slate-600/20 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const filteredBookings = bookings.data.filter(
        (booking) =>
            booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.package.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.package.destination.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getStats = () => {
        const total = bookings.data.length;
        const pending = bookings.data.filter((b) => b.status === 'pending').length;
        const confirmed = bookings.data.filter((b) => b.status === 'confirmed').length;
        const rejected = bookings.data.filter((b) => b.status === 'rejected').length;
        const totalValue = bookings.data.reduce((sum, b) => {
            const amount = b.final_amount || b.total_amount || 0;
            return sum + (typeof amount === 'number' ? amount : 0);
        }, 0);

        return { total, pending, confirmed, rejected, totalValue };
    };

    const stats = getStats();

    return (
        <B2BLayout user={user}>
            <Head title="My Bookings" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 bg-clip-text text-4xl font-bold text-transparent">
                                My Bookings
                            </h1>
                            <p className="mt-2 text-lg text-slate-300">Track and manage your corporate travel bookings</p>
                        </div>
                        <Link href="/b2b/packages">
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/30">
                                <Plus className="mr-2 h-4 w-4" />
                                New Booking
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                        {/* Total Bookings */}
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Total Bookings</p>
                                        <p className="text-3xl font-bold text-slate-100">{stats.total}</p>
                                    </div>
                                    <div className="rounded-lg border border-blue-500/20 bg-blue-600/20 p-3">
                                        <Package className="h-8 w-8 text-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending */}
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Pending</p>
                                        <p className="text-3xl font-bold text-amber-400">{stats.pending}</p>
                                    </div>
                                    <div className="rounded-lg border border-amber-500/20 bg-amber-600/20 p-3">
                                        <Clock className="h-8 w-8 text-amber-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirmed */}
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Confirmed</p>
                                        <p className="text-3xl font-bold text-emerald-400">{stats.confirmed}</p>
                                    </div>
                                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-600/20 p-3">
                                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rejected */}
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Rejected</p>
                                        <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
                                    </div>
                                    <div className="rounded-lg border border-red-500/20 bg-red-600/20 p-3">
                                        <XCircle className="h-8 w-8 text-red-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Value */}
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Total Value</p>
                                        <p className="text-3xl font-bold text-emerald-400">{formatCurrency(stats.totalValue)}</p>
                                    </div>
                                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-600/20 p-3">
                                        <DollarSign className="h-8 w-8 text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                        <div className="p-6">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
                                <Input
                                    placeholder="Search bookings by reference, package name, or destination..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-12 border-slate-600/50 bg-slate-700/50 pl-12 text-slate-100 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-100">Booking History</h2>
                                <p className="mt-1 text-slate-300">All your corporate travel bookings and their current status</p>
                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-4 w-fit rounded-full bg-slate-700/50 p-4">
                                        <Package className="h-12 w-12 text-slate-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-slate-100">No bookings found</h3>
                                    <p className="mb-4 text-slate-300">
                                        {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating your first booking.'}
                                    </p>
                                    {!searchTerm && (
                                        <Link href="/b2b/packages">
                                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/30">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Browse Packages
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-slate-700/50">
                                                <TableHead className="text-slate-300">Booking Reference</TableHead>
                                                <TableHead className="text-slate-300">Package</TableHead>
                                                <TableHead className="text-slate-300">Travelers</TableHead>
                                                <TableHead className="text-slate-300">Amount</TableHead>
                                                <TableHead className="text-slate-300">Status</TableHead>
                                                <TableHead className="text-slate-300">Created</TableHead>
                                                <TableHead className="text-slate-300">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredBookings.map((booking, index) => {
                                                const currentAccent = accentColors[index % accentColors.length];
                                                const accentClasses = getAccentClasses(currentAccent);

                                                return (
                                                    <TableRow key={booking.id} className="border-slate-700/50 hover:bg-slate-700/30">
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium text-slate-100">{booking.booking_reference}</p>
                                                                <p className="text-sm text-slate-400">{booking.invoice_number}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-3">
                                                                {booking.package.image_path ? (
                                                                    <img
                                                                        src={booking.package.image_path}
                                                                        alt={booking.package.name}
                                                                        className="h-12 w-12 rounded-lg border border-slate-600/50 object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-600/50 bg-gradient-to-br from-slate-700/50 to-slate-600/50">
                                                                        <Package className="h-6 w-6 text-slate-400" />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="font-medium text-slate-100">{booking.package.name}</p>
                                                                    <p className="text-sm text-slate-400">{booking.package.destination}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-center">
                                                                <p className="font-medium text-slate-100">{booking.travelers_count}</p>
                                                                <p className="text-sm text-slate-400">travelers</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium text-slate-100">
                                                                    {formatCurrency(booking.final_amount || booking.total_amount || 0)}
                                                                </p>
                                                                {(booking.final_amount || 0) < (booking.total_amount || 0) && (
                                                                    <p className="text-sm text-emerald-400">
                                                                        Save{' '}
                                                                        {formatCurrency((booking.total_amount || 0) - (booking.final_amount || 0))}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={`${getStatusColor(booking.status)} border`}>
                                                                {getStatusIcon(booking.status)}
                                                                <span className="ml-1 capitalize">{booking.status}</span>
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <p className="text-sm text-slate-100">{formatDate(booking.created_at)}</p>
                                                                <p className="text-xs text-slate-400">
                                                                    {new Date(booking.created_at).toLocaleTimeString('id-ID', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-2">
                                                                <Link href={`/b2b/bookings/${booking.id}`}>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                {booking.payment_proof && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50"
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {bookings.last_page > 1 && (
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-400">
                                        Showing {(bookings.current_page - 1) * bookings.per_page + 1} to{' '}
                                        {Math.min(bookings.current_page * bookings.per_page, bookings.total)} of {bookings.total} bookings
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        {bookings.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded-md px-3 py-2 text-sm transition-all duration-200 ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
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
