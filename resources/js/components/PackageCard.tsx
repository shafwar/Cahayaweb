import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Star } from 'lucide-react';

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

interface PackageCardProps {
    package: Package;
    user?: any;
    className?: string;
}

export default function PackageCard({ package: pkg, user, className = '' }: PackageCardProps) {
    const price = pkg.price_for_user || pkg.price;
    const isB2B = user?.userType?.name === 'b2b' && user?.is_verified;
    const showB2BPrice = isB2B && pkg.b2b_price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`cahaya-card group overflow-hidden ${className}`}
        >
            {/* Package Image */}
            <div className="h-48 relative overflow-hidden">
                <img
                    src={pkg.image_path || `/packages${pkg.type}.jpeg`}
                    alt={pkg.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="inset-0 from-black/60 absolute bg-gradient-to-t to-transparent" />

                {/* Package Type Badge */}
                <div className="top-4 left-4 absolute">
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold tracking-wide rounded-full uppercase">{pkg.type}</span>
                </div>

                {/* Price Badge */}
                <div className="top-4 right-4 absolute">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-gray-900">Rp {price.toLocaleString('id-ID')}</div>
                        {showB2BPrice && <div className="text-xs text-green-600 font-medium">B2B Price</div>}
                    </div>
                </div>
            </div>

            {/* Package Content */}
            <div className="p-6">
                {/* Package Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">{pkg.name}</h3>

                {/* Package Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                {/* Package Details */}
                <div className="space-y-2 mb-4">
                    <div className="gap-2 text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 text-yellow-500" />
                        <span>{pkg.destination}</span>
                    </div>
                    <div className="gap-2 text-sm text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 text-yellow-500" />
                        <span>{pkg.duration_days} days</span>
                        {pkg.departure_date && (
                            <span className="text-yellow-600 font-medium">
                                •{' '}
                                {new Date(pkg.departure_date).toLocaleDateString('id-ID', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                        )}
                    </div>
                </div>

                {/* Highlights */}
                {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="mb-4">
                        <div className="gap-2 mb-2 flex items-center">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">Highlights</span>
                        </div>
                        <div className="gap-1 flex flex-wrap">
                            {pkg.highlights.slice(0, 3).map((highlight, index) => (
                                <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                    {highlight}
                                </span>
                            ))}
                            {pkg.highlights.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{pkg.highlights.length - 3} more</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Price Comparison */}
                {showB2BPrice && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm flex items-center justify-between">
                            <span className="text-gray-600">Regular Price:</span>
                            <span className="text-gray-500 line-through">Rp {pkg.price.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="text-sm flex items-center justify-between">
                            <span className="text-blue-700 font-medium">B2B Price:</span>
                            <span className="text-blue-700 font-bold">Rp {pkg.b2b_price!.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-1">Save Rp {(pkg.price - pkg.b2b_price!).toLocaleString('id-ID')}</div>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    href={route('packages.show', pkg.id)}
                    className="cahaya-button-primary gap-2 group-hover:gap-3 flex w-full items-center justify-center transition-all duration-300"
                >
                    View Details
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
