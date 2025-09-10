import UserActionMenu from '@/components/UserActionMenu';
import AdminLayout from '@/layouts/admin-layout';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, Clock, Eye, Filter, Search, User, UserX, Users as UsersIcon, XCircle } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    user_type?: {
        name: string;
        display_name: string;
    };
    created_at: string;
    b2b_verification?: {
        company_name: string;
        status: string;
    };
    is_active?: boolean;
    is_suspended?: boolean;
}

interface UsersProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        user_type?: string;
        verification_status?: string;
    };
}

export default function Users({ users, filters }: UsersProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedUserType, setSelectedUserType] = useState(filters.user_type || 'all');
    const [selectedVerificationStatus, setSelectedVerificationStatus] = useState(filters.verification_status || 'all');

    const { post: submitVerificationAction, processing } = useForm();

    const getUserTypeIcon = (type: string) => {
        switch (type) {
            case 'b2b':
                return <Building2 className="h-3 w-3" />;
            case 'b2c':
                return <User className="h-3 w-3" />;
            case 'admin':
                return <UsersIcon className="h-3 w-3" />;
            default:
                return <UserX className="h-3 w-3" />;
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

    const getVerificationStatus = (user: User) => {
        // Handle null user_type
        if (!user.user_type) {
            return { text: 'Unknown', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: UserX };
        }

        if (user.user_type.name === 'b2b') {
            if (user.b2b_verification) {
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
            } else {
                return { text: 'Not Applied', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: UserX };
            }
        } else {
            return { text: 'N/A', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: UserX };
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedUserType !== 'all') params.append('user_type', selectedUserType);
        if (selectedVerificationStatus !== 'all') params.append('verification_status', selectedVerificationStatus);

        window.location.href = `${route('admin.users')}?${params.toString()}`;
    };

    const clearFilters = () => {
        window.location.href = route('admin.users');
    };

    const handleQuickApprove = (user: User) => {
        if (!user.b2b_verification) return;

        if (confirm(`Are you sure you want to approve ${user.name}?`)) {
            submitVerificationAction(route('admin.verifications.approve', user.b2b_verification.id), {
                data: {
                    admin_notes: 'Quick approval from user management',
                },
                onSuccess: () => {
                    alert('User approved successfully!');
                    window.location.reload();
                },
                onError: (errors) => {
                    alert('Failed to approve user: ' + Object.values(errors).join(', '));
                },
            });
        }
    };

    const handleQuickReject = (user: User) => {
        if (!user.b2b_verification) return;

        const notes = prompt('Please provide a reason for rejection:');
        if (notes !== null && notes.trim() !== '') {
            submitVerificationAction(route('admin.verifications.reject', user.b2b_verification.id), {
                data: {
                    admin_notes: notes,
                },
                onSuccess: () => {
                    alert('User rejected successfully!');
                    window.location.reload();
                },
                onError: (errors) => {
                    alert('Failed to reject user: ' + Object.values(errors).join(', '));
                },
            });
        }
    };

    return (
        <AdminLayout>
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white sm:text-3xl">User Management</h1>
                        <p className="mt-1 text-sm text-gray-400 sm:text-base">Manage all users and their verification status</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400 sm:text-base">
                            Total Users: <span className="font-semibold text-white">{users.total}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="mb-6 rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-300">Search Users</label>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-10 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-300">User Type</label>
                        <select
                            value={selectedUserType}
                            onChange={(e) => setSelectedUserType(e.target.value)}
                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">All Types</option>
                            <option value="b2b">Business (B2B)</option>
                            <option value="b2c">Consumer (B2C)</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-300">Verification Status</label>
                        <select
                            value={selectedVerificationStatus}
                            onChange={(e) => setSelectedVerificationStatus(e.target.value)}
                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="not_applied">Not Applied</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSearch}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            <Search className="h-4 w-4" />
                            Search
                        </button>
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                        >
                            <Filter className="h-4 w-4" />
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden">
                <div className="space-y-4">
                    {users.data.map((user) => {
                        const verificationStatus = getVerificationStatus(user);
                        const IconComponent = verificationStatus.icon;

                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl border border-gray-700 bg-gray-800 p-4"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                            <span className="text-lg font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-white sm:text-base">{user.name}</p>
                                            <p className="truncate text-xs text-gray-400 sm:text-sm">{user.email}</p>
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
                                                        user.user_type?.name === 'admin'
                                                            ? 'border-red-500/30 bg-red-500/20 text-red-400'
                                                            : user.user_type?.name === 'B2B'
                                                              ? 'border-purple-500/30 bg-purple-500/20 text-purple-400'
                                                              : 'border-blue-500/30 bg-blue-500/20 text-blue-400'
                                                    }`}
                                                >
                                                    {user.user_type?.name || 'Unknown'}
                                                </span>
                                                {user.is_active === false && (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">
                                                        Inactive
                                                    </span>
                                                )}
                                                {user.is_suspended && (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                                                        Suspended
                                                    </span>
                                                )}
                                                {user.b2b_verification && (
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
                                                            user.b2b_verification.status === 'approved'
                                                                ? 'border-green-500/30 bg-green-500/20 text-green-400'
                                                                : user.b2b_verification.status === 'rejected'
                                                                  ? 'border-red-500/30 bg-red-500/20 text-red-400'
                                                                  : 'border-yellow-500/30 bg-yellow-500/20 text-yellow-400'
                                                        }`}
                                                    >
                                                        {user.b2b_verification.status.charAt(0).toUpperCase() + user.b2b_verification.status.slice(1)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <UserActionMenu user={user} onActionComplete={() => window.location.reload()} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
                    <table className="w-full">
                        <thead className="border-b border-gray-700 bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Company</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.data.map((user) => {
                                const verificationStatus = getVerificationStatus(user);
                                const IconComponent = verificationStatus.icon;

                                return (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="transition-colors hover:bg-gray-700/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{user.name || 'Unknown User'}</p>
                                                    <p className="text-sm text-gray-400">{user.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getUserTypeColor(user.user_type?.name || 'unknown')}`}
                                            >
                                                {getUserTypeIcon(user.user_type?.name || 'unknown')}
                                                {user.user_type?.display_name || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${verificationStatus.color}`}
                                            >
                                                <IconComponent className="h-3 w-3" />
                                                {verificationStatus.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300">{user.b2b_verification?.company_name || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300">{new Date(user.created_at || '').toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.users.show', user.id)}
                                                    className="rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-400 transition-colors hover:bg-gray-600 hover:text-white"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                {user.user_type?.name === 'b2b' && user.b2b_verification?.status === 'pending' && (
                                                    <>
                                                        <Link
                                                            href={route('admin.verifications.show', user.b2b_verification.id)}
                                                            className="rounded-lg border border-yellow-600 bg-yellow-600/20 p-2 text-yellow-400 transition-colors hover:bg-yellow-600/30"
                                                            title="Review Verification"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleQuickApprove(user)}
                                                            disabled={processing}
                                                            className="rounded-lg border border-green-600 bg-green-600/20 p-2 text-green-400 transition-colors hover:bg-green-600/30 disabled:opacity-50"
                                                            title="Quick Approve"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleQuickReject(user)}
                                                            disabled={processing}
                                                            className="rounded-lg border border-red-600 bg-red-600/20 p-2 text-red-400 transition-colors hover:bg-red-600/30 disabled:opacity-50"
                                                            title="Quick Reject"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {/* Quick Actions for B2B Pending Users */}
                                                {user.user_type?.name === 'B2B' && user.b2b_verification?.status === 'pending' && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => handleQuickApprove(user)}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-green-600/20 px-2 py-1 text-xs font-medium text-green-400 transition-colors hover:bg-green-600/30 disabled:opacity-50"
                                                        >
                                                            <CheckCircle className="h-3 w-3" />
                                                            Quick Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleQuickReject(user)}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-red-600/20 px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-600/30 disabled:opacity-50"
                                                        >
                                                            <XCircle className="h-3 w-3" />
                                                            Quick Reject
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Quick Actions for B2B Rejected Users */}
                                                {user.user_type?.name === 'B2B' && user.b2b_verification?.status === 'rejected' && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Change ${user.name} status to approved?`)) {
                                                                    submitVerificationAction(route('admin.verifications.approve', user.b2b_verification?.id), {
                                                                        data: { admin_notes: 'Status changed to approved by admin' },
                                                                        onSuccess: () => {
                                                                            alert('User status changed to approved successfully!');
                                                                            window.location.reload();
                                                                        },
                                                                        onError: (errors) => {
                                                                            alert('Failed to change user status: ' + Object.values(errors).join(', '));
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-green-600/20 px-2 py-1 text-xs font-medium text-green-400 transition-colors hover:bg-green-600/30 disabled:opacity-50"
                                                        >
                                                            <CheckCircle className="h-3 w-3" />
                                                            Change to Approved
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const notes = prompt('Please provide a reason for setting to pending (optional):');
                                                                if (notes !== null) {
                                                                    submitVerificationAction(route('admin.verifications.pending', user.b2b_verification?.id), {
                                                                        data: { admin_notes: notes || 'Status changed to pending by admin' },
                                                                        onSuccess: () => {
                                                                            alert('User status changed to pending successfully!');
                                                                            window.location.reload();
                                                                        },
                                                                        onError: (errors) => {
                                                                            alert('Failed to change user status: ' + Object.values(errors).join(', '));
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-yellow-600/20 px-2 py-1 text-xs font-medium text-yellow-400 transition-colors hover:bg-yellow-600/30 disabled:opacity-50"
                                                        >
                                                            <Clock className="h-3 w-3" />
                                                            Change to Pending
                                                        </button>
                                                    </div>
                                                )}
                                                <UserActionMenu user={user} />
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {users.last_page > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                        Showing {(users.current_page - 1) * users.per_page + 1} to {Math.min(users.current_page * users.per_page, users.total)} of{' '}
                        {users.total} users
                    </div>
                    <div className="flex gap-2">
                        {users.current_page > 1 && (
                            <Link
                                href={`${route('admin.users')}?page=${users.current_page - 1}`}
                                className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                            >
                                Previous
                            </Link>
                        )}
                        {users.current_page < users.last_page && (
                            <Link
                                href={`${route('admin.users')}?page=${users.current_page + 1}`}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
