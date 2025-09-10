import AdminLayout from '@/layouts/admin-layout';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, Clock, Eye, Filter, MoreHorizontal, Search, UserX, X } from 'lucide-react';
import { useState } from 'react';

interface Verification {
    id: number;
    company_name: string;
    company_license: string;
    contact_person: string;
    contact_email: string;
    contact_phone: string;
    status: string;
    admin_notes?: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
}

interface VerificationsProps {
    verifications: {
        data: Verification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Verifications({ verifications, filters }: VerificationsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');

    const { post: submitApproval, processing } = useForm();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'approved':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'rejected':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-3 w-3" />;
            case 'approved':
                return <CheckCircle className="h-3 w-3" />;
            case 'rejected':
                return <UserX className="h-3 w-3" />;
            default:
                return <Clock className="h-3 w-3" />;
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedStatus !== 'all') params.append('status', selectedStatus);

        window.location.href = `${route('admin.verifications')}?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        window.location.href = route('admin.verifications');
    };

    const openModal = (verification: Verification) => {
        setSelectedVerification(verification);
        setAdminNotes(verification.admin_notes || '');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedVerification(null);
        setAdminNotes('');
    };

    const handleApproval = (action: 'approve' | 'reject') => {
        if (!selectedVerification) return;

        const routeName = action === 'approve' ? 'admin.verifications.approve' : 'admin.verifications.reject';

        submitApproval(route(routeName, selectedVerification.id), {
            data: {
                admin_notes: adminNotes,
            },
            onSuccess: () => {
                closeModal();
            },
        });
    };

    const handleQuickApprove = (verification: Verification) => {
        if (confirm(`Are you sure you want to approve ${verification.company_name}?`)) {
            submitApproval(route('admin.verifications.approve', verification.id), {
                data: {
                    admin_notes: 'Quick approval by admin',
                },
            });
        }
    };

    const handleQuickReject = (verification: Verification) => {
        const notes = prompt('Please provide a reason for rejection:');
        if (notes !== null) {
            submitApproval(route('admin.verifications.reject', verification.id), {
                data: {
                    admin_notes: notes,
                },
            });
        }
    };

    const handleSetPending = (verification: Verification) => {
        if (confirm(`Are you sure you want to set ${verification.company_name} to pending?`)) {
            submitApproval(route('admin.verifications.pending', verification.id), {
                data: {
                    admin_notes: 'Set to pending by admin',
                },
            });
        }
    };

    return (
        <AdminLayout title="Verifications">
            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">B2B Verifications</h1>
                        <p className="text-sm text-gray-400 sm:text-base">Review and approve business account verifications</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 sm:text-base">
                        <span>Total: {verifications.total}</span>
                        <span className="text-yellow-400">•</span>
                        <span className="text-yellow-400">{verifications.data.filter((v) => v.status === 'pending').length} Pending</span>
                    </div>
                </div>
            </motion.div>

            {/* Filters Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 rounded-xl border border-gray-700 bg-gray-800 p-4 sm:mb-8 sm:p-6"
            >
                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by company name or contact person..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pr-4 pl-10 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={handleSearch}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            <Search className="h-4 w-4" />
                            <span className="hidden sm:inline">Search</span>
                        </button>
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                        >
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">Clear</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Verifications Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800"
            >
                {/* Mobile Cards View */}
                <div className="lg:hidden">
                    <div className="p-4 sm:p-6">
                        <div className="space-y-4">
                            {verifications.data.map((verification, index) => (
                                <motion.div
                                    key={verification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                    className="rounded-xl border border-gray-700 bg-gray-700/50 p-4 transition-colors hover:bg-gray-700"
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                                                <Building2 className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-white sm:text-base">{verification.company_name}</p>
                                                <p className="truncate text-xs text-gray-400 sm:text-sm">{verification.contact_person}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => openModal(verification)}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-600 hover:text-white"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mb-3 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                                        <div>
                                            <span className="text-gray-400">Contact:</span>
                                            <p className="truncate text-white">{verification.contact_email}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Phone:</span>
                                            <p className="truncate text-white">{verification.contact_phone}</p>
                                        </div>
                                    </div>

                                    <div className="mb-3 flex items-center justify-between">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(verification.status)}`}
                                        >
                                            {getStatusIcon(verification.status)}
                                            {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                                        </span>
                                        <span className="text-xs text-gray-400">{new Date(verification.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(verification)}
                                            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                                        >
                                            Review Details
                                        </button>
                                        {verification.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleQuickApprove(verification)}
                                                    disabled={processing}
                                                    className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {processing ? 'Processing...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleQuickReject(verification)}
                                                    disabled={processing}
                                                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {processing ? 'Processing...' : 'Reject'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700 bg-gray-700/50">
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Company</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Submitted</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verifications.data.map((verification, index) => (
                                    <motion.tr
                                        key={verification.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.05 }}
                                        className="border-b border-gray-700/50 transition-colors hover:bg-gray-700/30"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                                                    <Building2 className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-white">{verification.company_name}</p>
                                                    <p className="truncate text-sm text-gray-400">{verification.contact_person}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="min-w-0">
                                                <p className="truncate text-white">{verification.contact_email}</p>
                                                <p className="truncate text-sm text-gray-400">{verification.contact_phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(verification.status)}`}
                                            >
                                                {getStatusIcon(verification.status)}
                                                {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-400">{new Date(verification.created_at).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openModal(verification)}
                                                    className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {verification.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleQuickApprove(verification)}
                                                            disabled={processing}
                                                            className="rounded-lg bg-green-600 p-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleQuickReject(verification)}
                                                            disabled={processing}
                                                            className="rounded-lg bg-red-600 p-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                                            title="Reject"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {verifications.last_page > 1 && (
                    <div className="border-t border-gray-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {(verifications.current_page - 1) * verifications.per_page + 1} to{' '}
                                {Math.min(verifications.current_page * verifications.per_page, verifications.total)} of {verifications.total} results
                            </div>
                            <div className="flex items-center gap-2">
                                {verifications.current_page > 1 && (
                                    <Link
                                        href={`${route('admin.verifications')}?page=${verifications.current_page - 1}`}
                                        className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                                    >
                                        Previous
                                    </Link>
                                )}
                                <span className="text-sm text-gray-400">
                                    Page {verifications.current_page} of {verifications.last_page}
                                </span>
                                {verifications.current_page < verifications.last_page && (
                                    <Link
                                        href={`${route('admin.verifications')}?page=${verifications.current_page + 1}`}
                                        className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Approval Modal */}
            {showModal && selectedVerification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-800 p-6"
                    >
                        <div className="mb-6">
                            <h3 className="mb-2 text-xl font-bold text-white">Review Verification</h3>
                            <p className="text-gray-400">Review and approve/reject this B2B verification request</p>
                        </div>

                        <div className="mb-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-300">Company Name</label>
                                    <p className="text-white">{selectedVerification.company_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300">Contact Person</label>
                                    <p className="text-white">{selectedVerification.contact_person}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300">Email</label>
                                    <p className="text-white">{selectedVerification.contact_email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300">Phone</label>
                                    <p className="text-white">{selectedVerification.contact_phone}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-300">License Document</label>
                                <p className="cursor-pointer text-blue-400 hover:text-blue-300">{selectedVerification.company_license}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-300">Admin Notes</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes about this verification..."
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                            >
                                Cancel
                            </button>
                            {selectedVerification.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleApproval('reject')}
                                        disabled={processing}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Reject'}
                                    </button>
                                    <button
                                        onClick={() => handleApproval('approve')}
                                        disabled={processing}
                                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Approve'}
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
}
