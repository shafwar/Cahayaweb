import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, MapPin, Package, Users } from 'lucide-react';

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
    itinerary?: Array<{
        day: number;
        title: string;
        description: string;
        activities: string[];
    }>;
    inclusions?: string[];
    exclusions?: string[];
    created_at: string;
    updated_at: string;
}

interface PackageShowProps {
    user: {
        id: number;
        name: string;
        email: string;
        b2bVerification: {
            company_name: string;
            status: string;
        };
    };
    package: Package;
}

export default function PackageShow({ user, package: package_item }: PackageShowProps) {
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

    const getDiscountPercentage = (price: number, b2bPrice: number) => {
        if (!b2bPrice || b2bPrice >= price) return 0;
        return Math.round(((price - b2bPrice) / price) * 100);
    };

    const getDiscountAmount = (price: number, b2bPrice: number) => {
        if (!b2bPrice || b2bPrice >= price) return 0;
        return price - b2bPrice;
    };

    // Dynamic accent colors for consistent theming
    const accentColors = ['blue', 'emerald', 'purple'];
    const currentAccent = accentColors[package_item.id % accentColors.length];

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

    return (
        <B2BLayout user={user}>
            <Head title={`${package_item.name} - B2B Package`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Back Button */}
                    <Link href="/b2b/packages" className="inline-flex items-center text-blue-400 transition-colors duration-200 hover:text-blue-300">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Packages
                    </Link>

                    {/* Package Header */}
                    <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                        {package_item.image_path && (
                            <div className="aspect-video bg-gradient-to-br from-slate-700/50 to-slate-600/50 shadow-lg">
                                <img
                                    src={package_item.image_path}
                                    alt={package_item.name}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        )}
                        <div className="p-8">
                            <div className="flex flex-col gap-8 lg:flex-row">
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h1 className="mb-4 bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 bg-clip-text text-4xl font-bold text-transparent">
                                            {package_item.name}
                                        </h1>
                                        <p className="text-lg leading-relaxed text-slate-300">{package_item.description}</p>
                                    </div>

                                    {/* Package Details */}
                                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                                        <div className="text-center">
                                            <div
                                                className={`mx-auto mb-2 w-fit rounded-lg ${accentClasses.iconBg} border p-3 ${accentClasses.border}`}
                                            >
                                                <MapPin className={`h-6 w-6 ${accentClasses.iconText}`} />
                                            </div>
                                            <p className="text-sm text-slate-400">Destination</p>
                                            <p className="font-semibold text-slate-100">{package_item.destination}</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="mx-auto mb-2 w-fit rounded-lg border border-emerald-500/20 bg-emerald-600/20 p-3">
                                                <Clock className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <p className="text-sm text-slate-400">Duration</p>
                                            <p className="font-semibold text-slate-100">{package_item.duration_days} days</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="mx-auto mb-2 w-fit rounded-lg border border-purple-500/20 bg-purple-600/20 p-3">
                                                <Users className="h-6 w-6 text-purple-400" />
                                            </div>
                                            <p className="text-sm text-slate-400">Max Travelers</p>
                                            <p className="font-semibold text-slate-100">{package_item.max_travelers}</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="mx-auto mb-2 w-fit rounded-lg border border-amber-500/20 bg-amber-600/20 p-3">
                                                <Calendar className="h-6 w-6 text-amber-400" />
                                            </div>
                                            <p className="text-sm text-slate-400">Departure</p>
                                            <p className="font-semibold text-slate-100">{formatDate(package_item.departure_date)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Booking */}
                                <div className="lg:w-80">
                                    <div className="sticky top-6 rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                        <div className="p-6">
                                            <div className="mb-6 flex items-center space-x-2">
                                                <DollarSign className="h-5 w-5 text-blue-400" />
                                                <span className="text-xl font-bold text-slate-100">Pricing & Booking</span>
                                            </div>
                                            <div className="space-y-6">
                                                {/* Pricing */}
                                                <div className="space-y-3">
                                                    {package_item.b2b_price && package_item.b2b_price < package_item.price ? (
                                                        <div>
                                                            <div className="mb-2 flex items-center justify-between">
                                                                <span className="text-sm text-slate-400">Regular Price</span>
                                                                <span className="text-sm text-slate-500 line-through">
                                                                    {formatCurrency(package_item.price)}
                                                                </span>
                                                            </div>
                                                            <div className="mb-2 flex items-center justify-between">
                                                                <span className="text-sm text-slate-400">B2B Price</span>
                                                                <span className="text-2xl font-bold text-emerald-400">
                                                                    {formatCurrency(package_item.b2b_price)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-slate-400">You Save</span>
                                                                <span className="text-lg font-semibold text-emerald-400">
                                                                    {formatCurrency(getDiscountAmount(package_item.price, package_item.b2b_price))}
                                                                </span>
                                                            </div>
                                                            <Badge
                                                                className={`mt-2 w-full justify-center bg-gradient-to-r ${accentClasses.gradient} ${accentClasses.text} border ${accentClasses.border}`}
                                                            >
                                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                                {getDiscountPercentage(package_item.price, package_item.b2b_price)}% B2B Discount
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <p
                                                                className={`bg-gradient-to-r from-slate-100 text-3xl font-bold ${accentClasses.textGradient} bg-clip-text text-transparent`}
                                                            >
                                                                {formatCurrency(package_item.price)}
                                                            </p>
                                                            <p className="mt-1 text-sm text-slate-400">per person</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="border-t border-slate-700/50"></div>

                                                {/* Booking Button */}
                                                <Link href={`/b2b/booking/create/${package_item.id}`}>
                                                    <Button
                                                        className={`w-full bg-gradient-to-r ${accentClasses.button} text-white shadow-lg ${accentClasses.shadow} transition-all duration-200 hover:shadow-xl`}
                                                        size="lg"
                                                    >
                                                        <Package className="mr-2 h-5 w-5" />
                                                        Book Now
                                                    </Button>
                                                </Link>

                                                <div className="text-center">
                                                    <p className="text-xs text-slate-500">Secure booking with instant confirmation</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Itinerary */}
                    {package_item.itinerary && package_item.itinerary.length > 0 && (
                        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="mb-2 flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-blue-400" />
                                        <span className="text-2xl font-bold text-slate-100">Itinerary</span>
                                    </div>
                                    <p className="text-slate-400">Detailed day-by-day schedule for your journey</p>
                                </div>
                                <div className="space-y-6">
                                    {Array.isArray(package_item.itinerary) && package_item.itinerary.length > 0 ? (
                                        package_item.itinerary.map((day, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className={`flex h-12 w-12 items-center justify-center rounded-full ${accentClasses.iconBg} border ${accentClasses.border}`}
                                                    >
                                                        <span className={`font-bold ${accentClasses.iconText}`}>{day.day}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="mb-2 font-semibold text-slate-100">{day.title}</h4>
                                                    <p className="mb-3 text-slate-300">{day.description}</p>
                                                    {day.activities && day.activities.length > 0 && (
                                                        <div className="space-y-1">
                                                            {day.activities.map((activity, activityIndex) => (
                                                                <div
                                                                    key={activityIndex}
                                                                    className="flex items-center space-x-2 text-sm text-slate-400"
                                                                >
                                                                    <div className={`h-1.5 w-1.5 rounded-full ${accentClasses.bg}`}></div>
                                                                    <span>{activity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center">
                                            <div className="mb-2 text-slate-500">
                                                <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                                            </div>
                                            <p className="text-slate-400">Itinerary details will be provided after booking confirmation.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inclusions & Exclusions */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Inclusions */}
                        {Array.isArray(package_item.inclusions) && package_item.inclusions.length > 0 && (
                            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                <div className="p-6">
                                    <div className="mb-4">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                                            <span className="text-xl font-bold text-slate-100">What's Included</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {package_item.inclusions.map((inclusion, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                                                <span className="text-slate-300">{inclusion}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Exclusions */}
                        {Array.isArray(package_item.exclusions) && package_item.exclusions.length > 0 && (
                            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                <div className="p-6">
                                    <div className="mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Package className="h-5 w-5 text-red-400" />
                                            <span className="text-xl font-bold text-slate-100">What's Not Included</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {package_item.exclusions.map((exclusion, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10">
                                                    <div className="h-1 w-1 rounded-full bg-red-400"></div>
                                                </div>
                                                <span className="text-slate-300">{exclusion}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Important Notes */}
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                        <div className="p-6">
                            <h3 className="mb-4 text-xl font-bold text-slate-100">Important Notes</h3>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-start space-x-2">
                                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${accentClasses.bg}`}></div>
                                    <span>Prices are per person and subject to availability</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${accentClasses.bg}`}></div>
                                    <span>B2B rates are exclusive for verified business partners</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${accentClasses.bg}`}></div>
                                    <span>Booking confirmation will be sent via email within 24 hours</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${accentClasses.bg}`}></div>
                                    <span>Payment terms: 50% deposit, balance 30 days before departure</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${accentClasses.bg}`}></div>
                                    <span>Cancellation policy applies as per terms and conditions</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </B2BLayout>
    );
}
