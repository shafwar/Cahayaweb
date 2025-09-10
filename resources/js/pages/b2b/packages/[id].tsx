import { Head, Link, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Building2, Calendar, CheckCircle, Clock, MapPin, ShoppingCart, Users } from 'lucide-react';
import { useState } from 'react';

interface B2BPackageDetailsProps {
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
    package: {
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
        inclusions: string[];
        exclusions: string[];
        itinerary: Array<{
            day: number;
            title: string;
            description: string;
        }>;
    };
}

export default function B2BPackageDetails({ user, package: pkg }: B2BPackageDetailsProps) {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedTab, setSelectedTab] = useState('overview');

    const { data, setData, post, processing, errors } = useForm({
        travelers: 1,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        special_requests: '',
    });

    const getB2BPrice = () => {
        return pkg.b2b_price || pkg.price;
    };

    const getPriceDisplay = () => {
        const b2bPrice = getB2BPrice();
        const savings = pkg.price - b2bPrice;
        const savingsPercentage = Math.round((savings / pkg.price) * 100);

        return {
            b2bPrice,
            savings,
            savingsPercentage,
            hasDiscount: b2bPrice < pkg.price,
        };
    };

    const priceInfo = getPriceDisplay();
    const totalPrice = priceInfo.b2bPrice * data.travelers;

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('packages.purchase', pkg.id), {
            onSuccess: () => {
                setShowBookingForm(false);
            },
        });
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: MapPin },
        { id: 'itinerary', label: 'Itinerary', icon: Calendar },
        { id: 'inclusions', label: 'Inclusions', icon: CheckCircle },
        { id: 'booking', label: 'Book Now', icon: ShoppingCart },
    ];

    return (
        <>
            <Head title={`${pkg.name} - B2B Package Details`} />

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
                                    <p className="text-sm text-gray-400">Package Details</p>
                                </div>
                            </div>
                            {/* Navigation & User Info */}
                            <div className="flex items-center gap-6">
                                {/* Navigation */}
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('b2b.packages')}
                                        className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Packages
                                    </Link>

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
                    {/* Package Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50">
                            {/* Hero Image */}
                            <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-500 md:h-96">
                                {pkg.image_path ? (
                                    <img src={pkg.image_path} alt={pkg.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <MapPin className="h-32 w-32 text-white/50" />
                                    </div>
                                )}

                                {/* B2B Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-bold text-black">B2B EXCLUSIVE</span>
                                </div>

                                {/* Savings Badge */}
                                {priceInfo.hasDiscount && (
                                    <div className="absolute top-4 right-4">
                                        <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-white">
                                            SAVE {priceInfo.savingsPercentage}%
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Package Info */}
                            <div className="p-6">
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1">
                                        <h1 className="mb-2 text-3xl font-bold text-white">{pkg.name}</h1>
                                        <div className="mb-4 flex items-center gap-2 text-gray-400">
                                            <MapPin className="h-5 w-5" />
                                            <span className="text-lg">{pkg.destination}</span>
                                        </div>
                                        <p className="text-lg leading-relaxed text-gray-300">{pkg.description}</p>
                                    </div>

                                    {/* Pricing Card */}
                                    <div className="lg:w-80">
                                        <div className="rounded-xl border border-gray-600 bg-gray-700/50 p-6">
                                            <h3 className="mb-4 text-lg font-semibold text-white">B2B Pricing</h3>

                                            {priceInfo.hasDiscount ? (
                                                <div className="mb-4">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="text-3xl font-bold text-yellow-400">
                                                            Rp {priceInfo.b2bPrice.toLocaleString()}
                                                        </span>
                                                        <span className="text-lg text-gray-400 line-through">Rp {pkg.price.toLocaleString()}</span>
                                                    </div>
                                                    <div className="font-medium text-green-400">
                                                        Save Rp {priceInfo.savings.toLocaleString()} per person
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mb-4">
                                                    <span className="text-3xl font-bold text-yellow-400">
                                                        Rp {priceInfo.b2bPrice.toLocaleString()}
                                                    </span>
                                                    <div className="text-gray-400">per person</div>
                                                </div>
                                            )}

                                            <div className="mb-6 space-y-2">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{pkg.duration_days} days</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Users className="h-4 w-4" />
                                                    <span>Max {pkg.max_travelers} travelers</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Departure: {new Date(pkg.departure_date).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <Link href={route('b2b.booking.create', pkg.id)}>
                                                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-yellow-600 hover:to-orange-600">
                                                    <ShoppingCart className="h-5 w-5" />
                                                    Book Now
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-2">
                            <div className="flex flex-wrap gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedTab(tab.id)}
                                        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                                            selectedTab === tab.id ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tab Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-gray-700 bg-gray-800/50 p-6"
                    >
                        {selectedTab === 'overview' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">Package Overview</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-white">Highlights</h3>
                                        <ul className="space-y-2">
                                            {pkg.inclusions.slice(0, 5).map((inclusion, index) => (
                                                <li key={index} className="flex items-center gap-2 text-gray-300">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                    {inclusion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-white">Important Notes</h3>
                                        <ul className="space-y-2">
                                            {pkg.exclusions.slice(0, 5).map((exclusion, index) => (
                                                <li key={index} className="flex items-center gap-2 text-gray-300">
                                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                                    {exclusion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedTab === 'itinerary' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">Travel Itinerary</h2>
                                <div className="space-y-4">
                                    {pkg.itinerary.map((day, index) => (
                                        <div key={index} className="rounded-lg border border-gray-600 p-4">
                                            <div className="mb-2 flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-black">
                                                    {day.day}
                                                </div>
                                                <h3 className="text-lg font-semibold text-white">{day.title}</h3>
                                            </div>
                                            <p className="ml-11 text-gray-300">{day.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedTab === 'inclusions' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">What's Included</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-green-400 text-white">✓ Included</h3>
                                        <ul className="space-y-2">
                                            {pkg.inclusions.map((inclusion, index) => (
                                                <li key={index} className="flex items-center gap-2 text-gray-300">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                    {inclusion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-red-400 text-white">✗ Not Included</h3>
                                        <ul className="space-y-2">
                                            {pkg.exclusions.map((exclusion, index) => (
                                                <li key={index} className="flex items-center gap-2 text-gray-300">
                                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                                    {exclusion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedTab === 'booking' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">Book This Package</h2>
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                    <div>
                                        <h3 className="mb-4 text-lg font-semibold text-white">Booking Information</h3>
                                        <form onSubmit={handleBooking} className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-300">Number of Travelers</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={pkg.max_travelers}
                                                    value={data.travelers}
                                                    onChange={(e) => setData('travelers', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                                                />
                                                {errors.travelers && <p className="mt-1 text-sm text-red-400">{errors.travelers}</p>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-300">Customer Name</label>
                                                <input
                                                    type="text"
                                                    value={data.customer_name}
                                                    onChange={(e) => setData('customer_name', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                                                    placeholder="Enter customer name"
                                                />
                                                {errors.customer_name && <p className="mt-1 text-sm text-red-400">{errors.customer_name}</p>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-300">Customer Email</label>
                                                <input
                                                    type="email"
                                                    value={data.customer_email}
                                                    onChange={(e) => setData('customer_email', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                                                    placeholder="Enter customer email"
                                                />
                                                {errors.customer_email && <p className="mt-1 text-sm text-red-400">{errors.customer_email}</p>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-300">Customer Phone</label>
                                                <input
                                                    type="tel"
                                                    value={data.customer_phone}
                                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                                                    placeholder="Enter customer phone"
                                                />
                                                {errors.customer_phone && <p className="mt-1 text-sm text-red-400">{errors.customer_phone}</p>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-300">Special Requests</label>
                                                <textarea
                                                    value={data.special_requests}
                                                    onChange={(e) => setData('special_requests', e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                                                    placeholder="Any special requests or requirements"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="h-5 w-5" />
                                                        Book Package
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>

                                    <div>
                                        <h3 className="mb-4 text-lg font-semibold text-white">Booking Summary</h3>
                                        <div className="space-y-4 rounded-xl border border-gray-600 bg-gray-700/50 p-6">
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Package:</span>
                                                <span className="font-medium text-white">{pkg.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Travelers:</span>
                                                <span className="font-medium text-white">{data.travelers}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Price per person:</span>
                                                <span className="font-medium text-white">Rp {priceInfo.b2bPrice.toLocaleString()}</span>
                                            </div>
                                            <hr className="border-gray-600" />
                                            <div className="flex justify-between">
                                                <span className="text-lg font-semibold text-white">Total:</span>
                                                <span className="text-2xl font-bold text-yellow-400">Rp {totalPrice.toLocaleString()}</span>
                                            </div>
                                            {priceInfo.hasDiscount && (
                                                <div className="text-center text-sm text-green-400">
                                                    You save Rp {(priceInfo.savings * data.travelers).toLocaleString()} with B2B pricing!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
}
