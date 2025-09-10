import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, MapPin, Package, Users } from 'lucide-react';
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

interface BookingCreateProps {
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

export default function BookingCreate({ user, package: package_item }: BookingCreateProps) {
    const [travelers, setTravelers] = useState([{ name: '', email: '', phone: '', passport: '', date_of_birth: '' }]);

    const { data, setData, post, processing, errors } = useForm({
        package_id: package_item.id,
        travelers_count: 1,
        traveler_details: [] as Array<{
            name: string;
            email: string;
            phone: string;
            passport_number?: string;
            date_of_birth?: string;
        }>,
        special_requests: '',
    });

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

    const getDiscountAmount = (price: number, b2bPrice: number) => {
        if (!b2bPrice || b2bPrice >= price) return 0;
        return price - b2bPrice;
    };

    const getDiscountPercentage = (price: number, b2bPrice: number) => {
        if (!b2bPrice || b2bPrice >= price) return 0;
        return Math.round(((price - b2bPrice) / price) * 100);
    };

    const addTraveler = () => {
        if (travelers.length < package_item.max_travelers) {
            setTravelers([...travelers, { name: '', email: '', phone: '', passport: '' }]);
        }
    };

    const removeTraveler = (index: number) => {
        if (travelers.length > 1) {
            setTravelers(travelers.filter((_, i) => i !== index));
        }
    };

    const updateTraveler = (index: number, field: string, value: string) => {
        const updated = travelers.map((traveler, i) => (i === index ? { ...traveler, [field]: value } : traveler));
        setTravelers(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Debug logging
        console.log('Form data before processing:', data);
        console.log('Travelers state:', travelers);

        // Validate travelers
        const validTravelers = travelers.filter((t) => t.name && t.email && t.phone);
        if (validTravelers.length === 0) {
            alert('Please fill in at least one traveler information');
            return;
        }

        // Prepare traveler details with proper structure
        const travelerDetails = validTravelers.map((traveler) => ({
            name: traveler.name,
            email: traveler.email,
            phone: traveler.phone,
            passport_number: traveler.passport || '',
            date_of_birth: traveler.date_of_birth || '1990-01-01',
        }));

        // Prepare special requests as array (split by newlines if multiple requests)
        console.log('Special requests type:', typeof data.special_requests);
        console.log('Special requests value:', data.special_requests);

        const specialRequestsArray = (() => {
            if (!data.special_requests) return [];
            if (typeof data.special_requests === 'string') {
                return data.special_requests.split('\n').filter((request) => request.trim() !== '');
            }
            if (Array.isArray(data.special_requests)) {
                return data.special_requests;
            }
            return [];
        })();

        console.log('Processed special requests array:', specialRequestsArray);

        // Update form data and submit
        const finalData = {
            package_id: package_item.id,
            travelers_count: validTravelers.length,
            traveler_details: travelerDetails,
            special_requests: specialRequestsArray,
        };

        console.log('Final data to submit:', finalData);

        // Submit directly with processed data using router.post
        router.post(route('b2b.bookings.store'), finalData, {
            onSuccess: () => {
                console.log('Booking created successfully!');
            },
            onError: (errors) => {
                console.error('Booking creation failed:', errors);
            },
        });
    };

    const totalAmount = package_item.b2b_price ? package_item.b2b_price * travelers.length : package_item.price * travelers.length;
    const discountAmount = package_item.b2b_price ? getDiscountAmount(package_item.price, package_item.b2b_price) * travelers.length : 0;

    return (
        <B2BLayout user={user}>
            <Head title={`Book ${package_item.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Back Button */}
                    <Link
                        href={`/b2b/packages/${package_item.id}`}
                        className="inline-flex items-center text-blue-400 transition-colors duration-200 hover:text-blue-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Package Details
                    </Link>

                    {/* Package Summary */}
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                        <div className="p-6">
                            <div className="flex flex-col gap-6 lg:flex-row">
                                {package_item.image_path && (
                                    <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-600/50 shadow-lg shadow-blue-500/10 lg:w-64">
                                        <img
                                            src={package_item.image_path}
                                            alt={package_item.name}
                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                )}

                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h1 className="mb-2 bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 bg-clip-text text-3xl font-bold text-transparent">
                                            {package_item.name}
                                        </h1>
                                        <p className="text-lg text-slate-300">{package_item.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                                            <div className="rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-600/20 to-blue-500/20 p-1">
                                                <MapPin className="h-3 w-3 text-blue-400" />
                                            </div>
                                            <span>{package_item.destination}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                                            <div className="rounded-full border border-emerald-500/20 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-1">
                                                <Clock className="h-3 w-3 text-emerald-400" />
                                            </div>
                                            <span>{package_item.duration_days} days</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                                            <div className="rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-600/20 to-orange-600/20 p-1">
                                                <Calendar className="h-3 w-3 text-amber-400" />
                                            </div>
                                            <span>{formatDate(package_item.departure_date)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-slate-300">
                                            <div className="rounded-full border border-purple-500/20 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-1">
                                                <Users className="h-3 w-3 text-purple-400" />
                                            </div>
                                            <span>Max {package_item.max_travelers}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Traveler Information */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                <div className="border-b border-slate-700/50 p-6">
                                    <h2 className="flex items-center space-x-2 text-xl font-semibold text-slate-100">
                                        <Users className="h-5 w-5 text-blue-400" />
                                        <span>Traveler Information</span>
                                    </h2>
                                    <p className="mt-1 text-slate-300">Fill in the details for all travelers</p>
                                </div>
                                <div className="space-y-6 p-6">
                                    {travelers.map((traveler, index) => (
                                        <div key={index} className="rounded-xl border border-slate-700/50 bg-slate-700/30 p-6">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-100">Traveler {index + 1}</h4>
                                                {travelers.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeTraveler(index)}
                                                        className="border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50"
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label htmlFor={`name-${index}`} className="text-slate-300">
                                                        Full Name *
                                                    </Label>
                                                    <Input
                                                        id={`name-${index}`}
                                                        value={traveler.name}
                                                        onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                                                        placeholder="Enter full name"
                                                        required
                                                        className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`email-${index}`} className="text-slate-300">
                                                        Email *
                                                    </Label>
                                                    <Input
                                                        id={`email-${index}`}
                                                        type="email"
                                                        value={traveler.email}
                                                        onChange={(e) => updateTraveler(index, 'email', e.target.value)}
                                                        placeholder="Enter email address"
                                                        required
                                                        className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`phone-${index}`} className="text-slate-300">
                                                        Phone Number *
                                                    </Label>
                                                    <Input
                                                        id={`phone-${index}`}
                                                        value={traveler.phone}
                                                        onChange={(e) => updateTraveler(index, 'phone', e.target.value)}
                                                        placeholder="Enter phone number"
                                                        required
                                                        className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`passport-${index}`} className="text-slate-300">
                                                        Passport Number
                                                    </Label>
                                                    <Input
                                                        id={`passport-${index}`}
                                                        value={traveler.passport}
                                                        onChange={(e) => updateTraveler(index, 'passport', e.target.value)}
                                                        placeholder="Enter passport number (optional)"
                                                        className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`date_of_birth-${index}`} className="text-slate-300">
                                                        Date of Birth
                                                    </Label>
                                                    <Input
                                                        id={`date_of_birth-${index}`}
                                                        type="date"
                                                        value={traveler.date_of_birth}
                                                        onChange={(e) => updateTraveler(index, 'date_of_birth', e.target.value)}
                                                        required
                                                        className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {travelers.length < package_item.max_travelers && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addTraveler}
                                            className="w-full border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50"
                                        >
                                            <Users className="mr-2 h-4 w-4" />
                                            Add Another Traveler
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                <div className="border-b border-slate-700/50 p-6">
                                    <h2 className="text-xl font-semibold text-slate-100">Special Requests</h2>
                                    <p className="mt-1 text-slate-300">Any special requirements or requests for your booking</p>
                                </div>
                                <div className="p-6">
                                    <Textarea
                                        value={data.special_requests}
                                        onChange={(e) => setData('special_requests', e.target.value)}
                                        placeholder="Enter any special requests or requirements..."
                                        rows={4}
                                        className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Booking Summary */}
                        <div className="space-y-6">
                            <div className="sticky top-6 rounded-2xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm">
                                <div className="border-b border-slate-700/50 p-6">
                                    <h2 className="flex items-center space-x-2 text-xl font-semibold text-slate-100">
                                        <DollarSign className="h-5 w-5 text-emerald-400" />
                                        <span>Booking Summary</span>
                                    </h2>
                                </div>
                                <div className="space-y-4 p-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-300">Travelers</span>
                                            <span className="font-medium text-slate-100">{travelers.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-300">Base Price</span>
                                            <span className="font-medium text-slate-100">
                                                {formatCurrency(package_item.price * travelers.length)}
                                            </span>
                                        </div>
                                        {package_item.b2b_price && package_item.b2b_price < package_item.price && (
                                            <>
                                                <div className="flex justify-between text-emerald-400">
                                                    <span>B2B Discount</span>
                                                    <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                                                </div>
                                                <Badge className="w-full justify-center border border-emerald-500/20 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-400">
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    {getDiscountPercentage(package_item.price, package_item.b2b_price)}% B2B Discount
                                                </Badge>
                                            </>
                                        )}
                                        <div className="border-t border-slate-700/50 pt-2"></div>
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-slate-100">Total Amount</span>
                                            <span className="text-emerald-400">{formatCurrency(totalAmount)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30"
                                        size="lg"
                                    >
                                        {processing ? 'Creating Booking...' : 'Create Booking'}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-xs text-slate-400">You will receive an invoice via email after booking</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </B2BLayout>
    );
}
