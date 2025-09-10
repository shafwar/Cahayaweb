import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    FileText,
    Mail,
    Package,
    Phone,
    Upload,
    Users,
    XCircle,
} from 'lucide-react';

interface Booking {
    id: number;
    booking_reference: string;
    invoice_number: string;
    package: {
        id: number;
        name: string;
        description: string;
        destination: string;
        image_path?: string;
        duration_days: number;
        max_travelers: number;
        departure_date: string;
        return_date: string;
    };
    travelers_count: number;
    total_amount: number;
    b2b_discount: number;
    final_amount: number;
    status: 'pending' | 'confirmed' | 'rejected';
    status_history: Array<{
        status: string;
        timestamp: string;
        note?: string;
        updated_by?: string;
    }>;
    payment_proof?: string;
    traveler_details?: Array<{
        name: string;
        email: string;
        phone: string;
        passport?: string;
    }>;
    special_requests?: string;
    admin_notes?: string;
    created_at: string;
    updated_at: string;
}

interface BookingShowProps {
    user: {
        id: number;
        name: string;
        email: string;
        b2bVerification: {
            company_name: string;
            status: string;
        };
    };
    booking: Booking;
}

export default function BookingShow({ user, booking }: BookingShowProps) {
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

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Dynamic accent colors for consistent theming
    const accentColors = ['blue', 'emerald', 'purple'];
    const currentAccent = accentColors[booking.id % accentColors.length];

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

    const accentClasses = getAccentClasses(currentAccent);

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

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmed';
            case 'pending':
                return 'Pending Payment';
            case 'rejected':
                return 'Rejected';
            default:
                return status;
        }
    };

    return (
        <B2BLayout user={user}>
            <Head title={`Booking ${booking.booking_reference}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Back Button */}
                    <Link href="/b2b/bookings" className="inline-flex items-center text-blue-400 transition-colors duration-200 hover:text-blue-300">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Bookings
                    </Link>

                    {/* Booking Header */}
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                        <div className="p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1">
                                    <div className="mb-4 flex items-center space-x-4">
                                        <h1 className="bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 bg-clip-text text-3xl font-bold text-transparent">
                                            {booking.booking_reference}
                                        </h1>
                                        <Badge className={`${getStatusColor(booking.status)} border`}>
                                            {getStatusIcon(booking.status)}
                                            <span className="ml-1">{getStatusDisplay(booking.status)}</span>
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                        <div>
                                            <p className="text-slate-400">Invoice Number</p>
                                            <p className="font-medium text-slate-100">{booking.invoice_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400">Created</p>
                                            <p className="font-medium text-slate-100">{formatDateTime(booking.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400">Last Updated</p>
                                            <p className="font-medium text-slate-100">{formatDateTime(booking.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {booking.payment_proof && (
                                        <Button
                                            variant="outline"
                                            className="border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Proof
                                        </Button>
                                    )}
                                    {booking.status === 'pending' && (
                                        <Button
                                            className={`bg-gradient-to-r ${accentClasses.button} text-white shadow-lg ${accentClasses.shadow} transition-all duration-200 hover:shadow-xl`}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Payment
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Package Details */}
                            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center space-x-2">
                                        <Package className="h-5 w-5 text-blue-400" />
                                        <span className="text-xl font-bold text-slate-100">Package Details</span>
                                    </div>
                                    <div className="flex flex-col gap-6 md:flex-row">
                                        {booking.package.image_path && (
                                            <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-600/50 shadow-lg md:w-48">
                                                <img
                                                    src={booking.package.image_path}
                                                    alt={booking.package.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="mb-2 text-xl font-bold text-slate-100">{booking.package.name}</h3>
                                                <p className="text-slate-300">{booking.package.description}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                                <div>
                                                    <p className="text-sm text-slate-400">Destination</p>
                                                    <p className="font-medium text-slate-100">{booking.package.destination}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-400">Duration</p>
                                                    <p className="font-medium text-slate-100">{booking.package.duration_days} days</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-400">Departure</p>
                                                    <p className="font-medium text-slate-100">{formatDate(booking.package.departure_date)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-400">Return</p>
                                                    <p className="font-medium text-slate-100">{formatDate(booking.package.return_date)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Traveler Details */}
                            {booking.traveler_details && booking.traveler_details.length > 0 && (
                                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                    <div className="p-6">
                                        <div className="mb-6 flex items-center space-x-2">
                                            <Users className="h-5 w-5 text-blue-400" />
                                            <span className="text-xl font-bold text-slate-100">Traveler Details</span>
                                        </div>
                                        <div className="space-y-4">
                                            {booking.traveler_details.map((traveler, index) => (
                                                <div key={index} className="rounded-lg border border-slate-700/50 bg-slate-700/30 p-4">
                                                    <h4 className="mb-3 font-medium text-slate-100">Traveler {index + 1}</h4>
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <div>
                                                            <p className="text-sm text-slate-400">Name</p>
                                                            <p className="font-medium text-slate-100">{traveler.name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-400">Email</p>
                                                            <p className="font-medium text-slate-100">{traveler.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-400">Phone</p>
                                                            <p className="font-medium text-slate-100">{traveler.phone}</p>
                                                        </div>
                                                        {traveler.passport && (
                                                            <div>
                                                                <p className="text-sm text-slate-400">Passport</p>
                                                                <p className="font-medium text-slate-100">{traveler.passport}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Special Requests */}
                            {booking.special_requests && (
                                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                    <div className="p-6">
                                        <div className="mb-4 flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-blue-400" />
                                            <span className="text-xl font-bold text-slate-100">Special Requests</span>
                                        </div>
                                        <p className="text-slate-300">{booking.special_requests}</p>
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes */}
                            {booking.admin_notes && (
                                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                    <div className="p-6">
                                        <div className="mb-4 flex items-center space-x-2">
                                            <Building2 className="h-5 w-5 text-blue-400" />
                                            <span className="text-xl font-bold text-slate-100">Admin Notes</span>
                                        </div>
                                        <p className="text-slate-300">{booking.admin_notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Pricing Summary */}
                            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center space-x-2">
                                        <DollarSign className="h-5 w-5 text-blue-400" />
                                        <span className="text-xl font-bold text-slate-100">Pricing Summary</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Travelers</span>
                                                <span className="font-medium text-slate-100">{booking.travelers_count}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Base Price</span>
                                                <span className="font-medium text-slate-100">{formatCurrency(booking.total_amount)}</span>
                                            </div>
                                            {booking.b2b_discount > 0 && (
                                                <div className="flex justify-between text-emerald-400">
                                                    <span>B2B Discount</span>
                                                    <span className="font-medium">-{formatCurrency(booking.b2b_discount)}</span>
                                                </div>
                                            )}
                                            <div className="border-t border-slate-700/50"></div>
                                            <div className="flex justify-between text-lg font-bold">
                                                <span className="text-slate-100">Total Amount</span>
                                                <span className="text-emerald-400">{formatCurrency(booking.final_amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center space-x-2">
                                        <Clock className="h-5 w-5 text-blue-400" />
                                        <span className="text-xl font-bold text-slate-100">Status Timeline</span>
                                    </div>
                                    <div className="space-y-4">
                                        {booking.status_history && booking.status_history.length > 0 ? (
                                            booking.status_history.map((status, index) => (
                                                <div key={index} className="flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                                status.status === 'confirmed'
                                                                    ? 'border border-emerald-500/20 bg-emerald-600/20'
                                                                    : status.status === 'rejected'
                                                                      ? 'border border-red-500/20 bg-red-600/20'
                                                                      : 'border border-amber-500/20 bg-amber-600/20'
                                                            }`}
                                                        >
                                                            {getStatusIcon(status.status)}
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-slate-100 capitalize">
                                                            {getStatusDisplay(status.status)}
                                                        </p>
                                                        <p className="text-xs text-slate-400">{formatDateTime(status.timestamp)}</p>
                                                        {status.note && <p className="mt-1 text-sm text-slate-300">{status.note}</p>}
                                                        {status.updated_by && <p className="mt-1 text-xs text-slate-400">by {status.updated_by}</p>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-4 text-center">
                                                <p className="text-sm text-slate-400">No status history available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                <div className="p-6">
                                    <div className="mb-4 flex items-center space-x-2">
                                        <Phone className="h-5 w-5 text-blue-400" />
                                        <span className="text-xl font-bold text-slate-100">Need Help?</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm text-slate-300">support@cahaya-anbiya.com</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm text-slate-300">+62 812 3456 7890</span>
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-xs text-slate-400">
                                                Our support team is available 24/7 to assist you with your booking.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </B2BLayout>
    );
}
