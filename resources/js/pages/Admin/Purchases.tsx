import AdminLayout from '@/layouts/admin-layout';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check, Clock, DollarSign, Eye, Filter, MoreHorizontal, Search, ShoppingCart, TrendingUp, User, X } from 'lucide-react';
import { useState } from 'react';

interface Order {
    id: string;
    type: 'purchase' | 'b2b_booking';
    customer_name: string;
    customer_email: string;
    package_name: string;
    amount: number;
    status: string;
    payment_status: string;
    created_at: string;
    original: any;
}

interface PurchasesProps {
    purchases: Order[];
    purchaseStats: {
        total: number;
        total_revenue: number;
        pending: number;
        confirmed: number;
        paid: number;
        completed: number;
        cancelled: number;
        monthly_revenue: number;
    };
    filters: {
        search?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export default function Purchases({ purchases, purchaseStats, filters, pagination }: PurchasesProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedStatus !== 'all') params.append('status', selectedStatus);

        window.location.href = `${route('admin.purchases')}?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        window.location.href = route('admin.purchases');
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleApproveOrder = (order: Order) => {
        setSelectedOrder(order);
        setActionType('approve');
        setShowConfirmModal(true);
    };

    const handleRejectOrder = (order: Order) => {
        setSelectedOrder(order);
        setActionType('reject');
        setShowConfirmModal(true);
    };

    const confirmAction = () => {
        if (!selectedOrder || !actionType) return;

        setLoading(true);

        const routeName = selectedOrder.type === 'b2b_booking' ? 'admin.b2b-bookings.update-status' : 'admin.purchases.status';

        const status = actionType === 'approve' ? 'confirmed' : 'rejected';

        const orderId = selectedOrder.id.replace(/^(purchase_|b2b_)/, '');

        if (selectedOrder.type === 'b2b_booking') {
            // B2B bookings use PATCH method
            router.patch(
                route(routeName, orderId),
                {
                    status: status,
                    admin_notes: actionType === 'approve' ? 'Order approved by admin' : 'Order rejected by admin',
                },
                {
                    onSuccess: () => {
                        setShowConfirmModal(false);
                        setSelectedOrder(null);
                        setActionType(null);
                        setLoading(false);
                        // Refresh the page to show updated data
                        window.location.reload();
                    },
                    onError: () => {
                        setLoading(false);
                        alert('Failed to update order status. Please try again.');
                    },
                },
            );
        } else {
            // Regular purchases use POST method
            router.post(
                route(routeName, orderId),
                {
                    status: status,
                    admin_notes: actionType === 'approve' ? 'Order approved by admin' : 'Order rejected by admin',
                },
                {
                    onSuccess: () => {
                        setShowConfirmModal(false);
                        setSelectedOrder(null);
                        setActionType(null);
                        setLoading(false);
                        // Refresh the page to show updated data
                        window.location.reload();
                    },
                    onError: () => {
                        setLoading(false);
                        alert('Failed to update order status. Please try again.');
                    },
                },
            );
        }
    };

    const closeModals = () => {
        setShowOrderModal(false);
        setShowConfirmModal(false);
        setSelectedOrder(null);
        setActionType(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'confirmed':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'paid':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'completed':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-3 w-3" />;
            case 'confirmed':
                return <ShoppingCart className="h-3 w-3" />;
            case 'paid':
                return <DollarSign className="h-3 w-3" />;
            case 'completed':
                return <TrendingUp className="h-3 w-3" />;
            case 'cancelled':
                return <User className="h-3 w-3" />;
            default:
                return <Clock className="h-3 w-3" />;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AdminLayout title="Purchases">
            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">Order Management</h1>
                        <p className="text-sm text-gray-400 sm:text-base">Track and manage customer purchases and orders</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400 sm:text-base">
                            <span>Total: {purchaseStats.total}</span>
                            <span className="text-green-400">•</span>
                            <span className="text-green-400">{purchaseStats.paid} Paid</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-yellow-400 sm:text-base">
                            <span>•</span>
                            <span>{purchaseStats.pending} Pending</span>
                        </div>
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
                                placeholder="Search by customer name or email..."
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
                            <option value="confirmed">Confirmed</option>
                            <option value="paid">Paid</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
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

            {/* Purchases Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800"
            >
                {/* Mobile Cards View */}
                <div className="xl:hidden">
                    <div className="p-3 sm:p-4">
                        <div className="space-y-3">
                            {purchases.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                    className="rounded-lg border border-gray-700 bg-gray-700/50 p-3 transition-colors hover:bg-gray-700"
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                    order.type === 'b2b_booking'
                                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                                        : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                }`}
                                            >
                                                <ShoppingCart className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-medium text-white">{order.customer_name}</p>
                                                    <span
                                                        className={`rounded-full px-1.5 py-0.5 text-xs ${
                                                            order.type === 'b2b_booking'
                                                                ? 'bg-blue-500/20 text-blue-400'
                                                                : 'bg-green-500/20 text-green-400'
                                                        }`}
                                                    >
                                                        {order.type === 'b2b_booking' ? 'B2B' : 'B2C'}
                                                    </span>
                                                </div>
                                                <p className="truncate text-xs text-gray-400">{order.customer_email}</p>
                                            </div>
                                        </div>
                                        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-600 hover:text-white">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mb-2 grid grid-cols-1 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-400">Package:</span>
                                            <p className="truncate font-medium text-white">{order.package_name}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Status:</span>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                                            >
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Amount:</span>
                                            <span className="text-sm font-bold text-green-400">{formatPrice(order.amount)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>Payment: {order.original?.payment_method || order.payment_status || 'N/A'}</span>
                                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewOrder(order)}
                                            className="flex-1 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                                        >
                                            View
                                        </button>
                                        {order.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApproveOrder(order)}
                                                    className="flex-1 rounded-lg bg-green-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectOrder(order)}
                                                    className="flex-1 rounded-lg bg-red-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden xl:block">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-700 bg-gray-700/50">
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-300">Customer</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-300">Package</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-300">Amount</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-300">Status</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-300">Payment</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-300">Date</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((order, index) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.05 }}
                                        className="border-b border-gray-700/50 transition-colors hover:bg-gray-700/30"
                                    >
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                                                    <ShoppingCart className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-white">{order.customer_name}</p>
                                                    <p className="truncate text-xs text-gray-400">{order.customer_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">{order.package_name}</p>
                                                <p className="truncate text-xs text-gray-400">{order.original?.package?.destination || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="text-sm font-bold text-green-400">{formatPrice(order.amount)}</span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                                            >
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="text-xs text-gray-300">
                                                {order.original?.payment_method || order.payment_status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewOrder(order)}
                                                    className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveOrder(order)}
                                                            className="rounded-lg bg-green-600 p-2 text-white transition-colors hover:bg-green-700"
                                                            title="Approve Order"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectOrder(order)}
                                                            className="rounded-lg bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                                                            title="Reject Order"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="border-t border-gray-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
                                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} results
                            </div>
                            <div className="flex items-center gap-2">
                                {pagination.current_page > 1 && (
                                    <Link
                                        href={`${route('admin.purchases')}?page=${pagination.current_page - 1}`}
                                        className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                                    >
                                        Previous
                                    </Link>
                                )}
                                <span className="text-sm text-gray-400">
                                    Page {purchases.current_page} of {purchases.last_page}
                                </span>
                                {purchases.current_page < purchases.last_page && (
                                    <Link
                                        href={`${route('admin.purchases')}?page=${purchases.current_page + 1}`}
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

            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-2xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Order Details</h2>
                            <button onClick={closeModals} className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Order ID</label>
                                    <p className="text-white">{selectedOrder.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Type</label>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                            selectedOrder.type === 'b2b_booking' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                        }`}
                                    >
                                        {selectedOrder.type === 'b2b_booking' ? 'B2B Booking' : 'B2C Purchase'}
                                    </span>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <label className="text-sm text-gray-400">Customer</label>
                                <div className="mt-1">
                                    <p className="font-medium text-white">{selectedOrder.customer_name}</p>
                                    <p className="text-sm text-gray-400">{selectedOrder.customer_email}</p>
                                </div>
                            </div>

                            {/* Package Info */}
                            <div>
                                <label className="text-sm text-gray-400">Package</label>
                                <p className="text-white">{selectedOrder.package_name}</p>
                                <p className="text-sm text-gray-400">{selectedOrder.original?.package?.destination || 'N/A'}</p>
                            </div>

                            {/* Amount & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400">Amount</label>
                                    <p className="text-lg font-bold text-green-400">{formatPrice(selectedOrder.amount)}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Status</label>
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
                                    >
                                        {getStatusIcon(selectedOrder.status)}
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <label className="text-sm text-gray-400">Payment Method</label>
                                <p className="text-white">{selectedOrder.original?.payment_method || selectedOrder.payment_status || 'N/A'}</p>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="text-sm text-gray-400">Order Date</label>
                                <p className="text-white">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {selectedOrder.status === 'pending' && (
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowOrderModal(false);
                                        handleApproveOrder(selectedOrder);
                                    }}
                                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
                                >
                                    <Check className="mr-2 inline h-4 w-4" />
                                    Approve Order
                                </button>
                                <button
                                    onClick={() => {
                                        setShowOrderModal(false);
                                        handleRejectOrder(selectedOrder);
                                    }}
                                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
                                >
                                    <X className="mr-2 inline h-4 w-4" />
                                    Reject Order
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Confirm Action Modal */}
            {showConfirmModal && selectedOrder && actionType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-2xl"
                    >
                        <div className="mb-6 text-center">
                            <div
                                className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                                    actionType === 'approve' ? 'bg-green-500/20' : 'bg-red-500/20'
                                }`}
                            >
                                {actionType === 'approve' ? <Check className="h-6 w-6 text-green-400" /> : <X className="h-6 w-6 text-red-400" />}
                            </div>
                            <h2 className="text-xl font-bold text-white">{actionType === 'approve' ? 'Approve Order' : 'Reject Order'}</h2>
                            <p className="mt-2 text-gray-400">Are you sure you want to {actionType} this order?</p>
                        </div>

                        <div className="mb-6 rounded-lg bg-gray-700/50 p-4">
                            <p className="text-sm text-gray-400">Order ID: {selectedOrder.id}</p>
                            <p className="font-medium text-white">{selectedOrder.customer_name}</p>
                            <p className="text-sm text-gray-400">{selectedOrder.package_name}</p>
                            <p className="font-medium text-green-400">{formatPrice(selectedOrder.amount)}</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={closeModals}
                                disabled={loading}
                                className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                disabled={loading}
                                className={`flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors disabled:opacity-50 ${
                                    actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {loading ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
}
