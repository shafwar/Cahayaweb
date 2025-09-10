import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Mail,
    MapPin,
    Package,
    Phone,
    Shield,
    ShoppingCart,
    User,
    UserCheck,
    UserX,
} from 'lucide-react';

interface UserDetailProps {
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        created_at: string;
        user_type: {
            name: string;
            display_name: string;
        };
        b2b_verification?: {
            id: number;
            company_name: string;
            contact_person: string;
            contact_email: string;
            contact_phone: string;
            business_address: string;
            status: string;
            created_at: string;
            approved_at?: string;
            rejected_at?: string;
            approved_by?: {
                name: string;
            };
            rejected_by?: {
                name: string;
            };
        };
        purchases: Array<{
            id: number;
            package: {
                name: string;
                destination: string;
            };
            total_amount: number;
            status: string;
            created_at: string;
        }>;
    };
    userStats: {
        total_purchases: number;
        total_spent: number;
        pending_purchases: number;
    };
}

export default function UserDetail({ user, userStats }: UserDetailProps) {
    const getUserTypeIcon = (type: string) => {
        switch (type) {
            case 'b2b':
                return <Building2 className="h-5 w-5" />;
            case 'b2c':
                return <User className="h-5 w-5" />;
            case 'admin':
                return <Shield className="h-5 w-5" />;
            default:
                return <User className="h-5 w-5" />;
        }
    };

    const getUserTypeColor = (type: string) => {
        switch (type) {
            case 'b2b':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'b2c':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'admin':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getVerificationStatus = () => {
        if (!user.b2b_verification) {
            return { text: 'Not Applied', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: UserX };
        }

        switch (user.b2b_verification.status) {
            case 'pending':
                return { text: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock };
            case 'approved':
                return { text: 'Approved', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle };
            case 'rejected':
                return { text: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: UserX };
            default:
                return { text: 'Unknown', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: UserX };
        }
    };

    const getPurchaseStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'confirmed':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'paid':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const verificationStatus = getVerificationStatus();
    const IconComponent = verificationStatus.icon;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.users')}
                        className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Users
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white sm:text-3xl">User Details</h1>
                        <p className="mt-1 text-sm text-gray-400 sm:text-base">View and manage user information</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* User Information */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Basic Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-gray-700 bg-gray-800 p-6"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Basic Information</h2>
                            <Link
                                href={route('admin.users.edit', user.id)}
                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Edit User
                            </Link>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-400">Name</p>
                                    <p className="font-medium text-white">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <p className="font-medium text-white">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-400">Joined</p>
                                    <p className="font-medium text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-400">Email Verified</p>
                                    <p className="font-medium text-white">{user.email_verified_at ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${getUserTypeColor(user.user_type.name)}`}
                            >
                                {getUserTypeIcon(user.user_type.name)}
                                {user.user_type.display_name}
                            </span>
                            {user.b2b_verification && (
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${verificationStatus.color}`}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    {verificationStatus.text}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    {/* B2B Verification Details */}
                    {user.b2b_verification && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-xl border border-gray-700 bg-gray-800 p-6"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Business Information</h2>
                                {user.b2b_verification.status === 'pending' && (
                                    <Link
                                        href={route('admin.verifications.show', user.b2b_verification.id)}
                                        className="rounded-lg bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
                                    >
                                        Review Verification
                                    </Link>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-400">Company</p>
                                        <p className="font-medium text-white">{user.b2b_verification.company_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-400">Contact Person</p>
                                        <p className="font-medium text-white">{user.b2b_verification.contact_person}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-400">Contact Email</p>
                                        <p className="font-medium text-white">{user.b2b_verification.contact_email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-400">Contact Phone</p>
                                        <p className="font-medium text-white">{user.b2b_verification.contact_phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 sm:col-span-2">
                                    <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-400">Business Address</p>
                                        <p className="font-medium text-white">{user.b2b_verification.business_address}</p>
                                    </div>
                                </div>
                            </div>

                            {user.b2b_verification.approved_at && (
                                <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
                                    <p className="text-sm text-green-400">
                                        Approved by {user.b2b_verification.approved_by?.name} on{' '}
                                        {new Date(user.b2b_verification.approved_at).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            {user.b2b_verification.rejected_at && (
                                <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                                    <p className="text-sm text-red-400">
                                        Rejected by {user.b2b_verification.rejected_by?.name} on{' '}
                                        {new Date(user.b2b_verification.rejected_at).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Purchase History */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-gray-700 bg-gray-800 p-6"
                    >
                        <h2 className="mb-4 text-lg font-semibold text-white">Purchase History</h2>

                        {user.purchases.length > 0 ? (
                            <div className="space-y-3">
                                {user.purchases.map((purchase) => (
                                    <div
                                        key={purchase.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-700 p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-white">{purchase.package.name}</p>
                                                <p className="text-sm text-gray-400">{purchase.package.destination}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-white">${purchase.total_amount}</p>
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getPurchaseStatusColor(purchase.status)}`}
                                            >
                                                {purchase.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-gray-400">No purchases yet</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* User Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl border border-gray-700 bg-gray-800 p-6"
                    >
                        <h3 className="mb-4 text-lg font-semibold text-white">User Statistics</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-300">Total Purchases</span>
                                </div>
                                <span className="font-semibold text-white">{userStats.total_purchases}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-300">Total Spent</span>
                                </div>
                                <span className="font-semibold text-white">${userStats.total_spent}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-300">Pending Orders</span>
                                </div>
                                <span className="font-semibold text-white">{userStats.pending_purchases}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-gray-700 bg-gray-800 p-6"
                    >
                        <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>

                        <div className="space-y-3">
                            <Link
                                href={route('admin.messages.create', { user_id: user.id })}
                                className="flex w-full items-center gap-3 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                            >
                                <Mail className="h-4 w-4" />
                                Send Message
                            </Link>

                            {!user.email_verified_at && (
                                <button className="flex w-full items-center gap-3 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white">
                                    <Mail className="h-4 w-4" />
                                    Resend Verification
                                </button>
                            )}

                            {user.user_type.name !== 'admin' ? (
                                <button className="flex w-full items-center gap-3 rounded-lg border border-blue-600 bg-blue-600/20 px-3 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-600/30">
                                    <UserCheck className="h-4 w-4" />
                                    Make Admin
                                </button>
                            ) : (
                                <button className="flex w-full items-center gap-3 rounded-lg border border-red-600 bg-red-600/20 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-600/30">
                                    <UserX className="h-4 w-4" />
                                    Remove Admin
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
}
