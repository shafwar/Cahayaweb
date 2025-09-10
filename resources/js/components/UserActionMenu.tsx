import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    MoreHorizontal,
    Eye,
    Edit,
    UserCheck,
    UserX,
    AlertTriangle,
    Shield,
    Mail,
    RefreshCw,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    X
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    user_type?: {
        name: string;
    };
    b2b_verification?: {
        id: number;
        status: string;
        company_name?: string;
        contact_person?: string;
        contact_email?: string;
        contact_phone?: string;
        business_address?: string;
        created_at?: string;
        approved_at?: string;
        rejected_at?: string;
        admin_notes?: string;
    };
    created_at: string;
    is_active?: boolean;
    is_suspended?: boolean;
}

interface UserActionMenuProps {
    user: User;
    onActionComplete?: () => void;
}

export default function UserActionMenu({ user, onActionComplete }: UserActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        company_name: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        business_address: '',
        admin_notes: ''
    });
    const [processing, setProcessing] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const isB2B = user.user_type?.name === 'B2B';
    const isPending = isB2B && user.b2b_verification?.status === 'pending';
    const isRejected = isB2B && user.b2b_verification?.status === 'rejected';
    const isApproved = isB2B && user.b2b_verification?.status === 'approved';

    const handleViewDetails = () => {
        router.get(route('admin.users.show', user.id));
        setIsOpen(false);
    };

    const handleEditUser = () => {
        setEditForm({
            name: user.name,
            email: user.email,
            company_name: user.b2b_verification?.company_name || '',
            contact_person: user.b2b_verification?.contact_person || '',
            contact_email: user.b2b_verification?.contact_email || '',
            contact_phone: user.b2b_verification?.contact_phone || '',
            business_address: user.b2b_verification?.business_address || '',
            admin_notes: user.b2b_verification?.admin_notes || ''
        });
        setShowEditModal(true);
        setIsOpen(false);
    };

    const handleEditSubmit = () => {
        setProcessing(true);

        // Update user basic info
        router.put(route('admin.users.update', user.id), {
            name: editForm.name,
            email: editForm.email
        }, {
            onSuccess: () => {
                // Update B2B verification if exists
                if (user.b2b_verification?.id) {
                    router.put(route('admin.verifications.update', user.b2b_verification.id), {
                        company_name: editForm.company_name,
                        contact_person: editForm.contact_person,
                        contact_email: editForm.contact_email,
                        contact_phone: editForm.contact_phone,
                        business_address: editForm.business_address,
                        admin_notes: editForm.admin_notes
                    }, {
                        onSuccess: () => {
                            setShowEditModal(false);
                            setProcessing(false);
                            onActionComplete?.();
                            alert('User updated successfully!');
                        },
                        onError: (errors) => {
                            setProcessing(false);
                            alert('Failed to update B2B verification: ' + Object.values(errors).join(', '));
                        }
                    });
                } else {
                    setShowEditModal(false);
                    setProcessing(false);
                    onActionComplete?.();
                    alert('User updated successfully!');
                }
            },
            onError: (errors) => {
                setProcessing(false);
                alert('Failed to update user: ' + Object.values(errors).join(', '));
            }
        });
    };

    const handleStatusChange = (newStatus: string, notes: string = '') => {
        if (!user.b2b_verification?.id) return;

        setProcessing(true);
        let routeName = '';
        let data: any = { admin_notes: notes };

        switch (newStatus) {
            case 'approved':
                routeName = 'admin.verifications.approve';
                break;
            case 'rejected':
                routeName = 'admin.verifications.reject';
                break;
            case 'pending':
                routeName = 'admin.verifications.pending';
                break;
            default:
                return;
        }

        router.post(route(routeName, user.b2b_verification.id), data, {
            onSuccess: () => {
                setShowEditModal(false);
                setProcessing(false);
                onActionComplete?.();
                alert(`User status changed to ${newStatus} successfully!`);
            },
            onError: (errors) => {
                setProcessing(false);
                alert(`Failed to change user status: ${Object.values(errors).join(', ')}`);
            }
        });
    };

    const handleSendMessage = () => {
        router.get(route('admin.messages.create'), {
            data: { user_id: user.id }
        });
        setIsOpen(false);
    };

    const handleResendVerification = () => {
        router.post(route('admin.users.resend-verification', user.id), {}, {
            onSuccess: () => {
                setIsOpen(false);
                onActionComplete?.();
                alert('Verification email sent successfully!');
            },
            onError: (errors) => {
                alert('Failed to send verification email: ' + Object.values(errors).join(', '));
            }
        });
    };

    const handleToggleStatus = (action: string) => {
        const actionNames = {
            activate: 'activate',
            deactivate: 'deactivate',
            suspend: 'suspend',
            unsuspend: 'unsuspend'
        };

        const actionName = actionNames[action as keyof typeof actionNames];
        const reason = prompt(`Please provide a reason for ${actionName} (optional):`);

        router.post(route('admin.users.toggle-status', user.id), {
            data: {
                action: actionName,
                reason: reason || ''
            },
            onSuccess: () => {
                setIsOpen(false);
                onActionComplete?.();
                alert(`User ${actionName} successfully!`);
            },
            onError: (errors) => {
                alert('Failed to update user status: ' + Object.values(errors).join(', '));
            }
        });
    };

    const handleChangeType = (newType: string) => {
        const reason = prompt(`Please provide a reason for changing user type to ${newType} (optional):`);

        router.post(route('admin.users.change-type', user.id), {
            data: {
                user_type: newType,
                reason: reason || ''
            },
            onSuccess: () => {
                setIsOpen(false);
                onActionComplete?.();
                alert(`User type changed to ${newType} successfully!`);
            },
            onError: (errors) => {
                alert('Failed to change user type: ' + Object.values(errors).join(', '));
            }
        });
    };

    const handleDeleteUser = () => {
        setProcessing(true);
        router.delete(route('admin.users.destroy', user.id), {
            onSuccess: () => {
                setShowDeleteConfirm(false);
                setIsOpen(false);
                setProcessing(false);
                onActionComplete?.();
                alert('User deleted successfully!');
            },
            onError: (errors) => {
                setProcessing(false);
                alert('Failed to delete user: ' + Object.values(errors).join(', '));
            }
        });
    };

    return (
        <>
            <div className="relative">
                <button
                    onClick={toggleMenu}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-xl">
                        {/* User Info Header */}
                        <div className="mb-3 rounded-lg bg-gray-700/50 p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                                    {user.user_type?.name && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                                            {user.user_type.name.toLowerCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Status Badges */}
                            {!user.is_active && (
                                <div className="mt-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600/20 px-2 py-0.5 text-xs font-medium text-red-400">
                                        Inactive
                                    </span>
                                </div>
                            )}
                            {user.is_suspended && (
                                <div className="mt-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-600/20 px-2 py-0.5 text-xs font-medium text-orange-400">
                                        Suspended
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-1">
                            <button
                                onClick={handleViewDetails}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            >
                                <Eye className="h-4 w-4" />
                                View Details
                            </button>

                            <button
                                onClick={handleEditUser}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            >
                                <Edit className="h-4 w-4" />
                                Edit User
                            </button>
                        </div>

                        {/* Status Control */}
                        <div className="mt-3 border-t border-gray-700 pt-3">
                            <p className="px-3 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">Status Control</p>

                            {user.is_active ? (
                                <button
                                    onClick={() => handleToggleStatus('deactivate')}
                                    disabled={processing}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-yellow-300 transition-colors hover:bg-yellow-500/20 hover:text-yellow-200 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <UserX className="h-4 w-4" />
                                    Deactivate User
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleToggleStatus('activate')}
                                    disabled={processing}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-green-300 transition-colors hover:bg-green-500/20 hover:text-green-200 focus:ring-2 focus:ring-green-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <UserCheck className="h-4 w-4" />
                                    Activate User
                                </button>
                            )}

                            {!user.is_suspended ? (
                                <button
                                    onClick={() => handleToggleStatus('suspend')}
                                    disabled={processing}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-orange-300 transition-colors hover:bg-orange-500/20 hover:text-orange-200 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <AlertTriangle className="h-4 w-4" />
                                    Suspend User
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleToggleStatus('unsuspend')}
                                    disabled={processing}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-blue-300 transition-colors hover:bg-blue-500/20 hover:text-blue-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Shield className="h-4 w-4" />
                                    Unsuspend User
                                </button>
                            )}
                        </div>

                        {/* User Type */}
                        <div className="mt-3 border-t border-gray-700 pt-3">
                            <p className="px-3 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">User Type</p>

                            <button
                                onClick={() => handleChangeType('B2B')}
                                disabled={processing}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-blue-300 transition-colors hover:bg-blue-500/20 hover:text-blue-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Shield className="h-4 w-4" />
                                Make B2B
                            </button>

                            <button
                                onClick={() => handleChangeType('B2C')}
                                disabled={processing}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-green-300 transition-colors hover:bg-green-500/20 hover:text-green-200 focus:ring-2 focus:ring-green-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <UserCheck className="h-4 w-4" />
                                Make B2C
                            </button>
                        </div>

                        {/* Communication */}
                        <div className="mt-3 border-t border-gray-700 pt-3">
                            <p className="px-3 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">Communication</p>

                            <button
                                onClick={handleSendMessage}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            >
                                <Mail className="h-4 w-4" />
                                Send Message
                            </button>

                            <button
                                onClick={handleResendVerification}
                                disabled={processing}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Resend Verification
                            </button>
                        </div>

                        {/* Quick Actions for B2B Pending */}
                        {isPending && (
                            <div className="mt-3 border-t border-gray-700 pt-3">
                                <p className="px-3 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">Quick Actions</p>

                                {/* Quick Approve */}
                                <button
                                    onClick={() => {
                                        if (confirm(`Quick approve ${user.name}?`)) {
                                            router.post(route('admin.verifications.approve', user.b2b_verification?.id), {
                                                data: { admin_notes: 'Quick approval by admin' },
                                                onSuccess: () => {
                                                    setIsOpen(false);
                                                    onActionComplete?.();
                                                    alert('User approved successfully!');
                                                },
                                                onError: (errors) => {
                                                    alert('Failed to approve user: ' + Object.values(errors).join(', '));
                                                }
                                            });
                                        }
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-green-300 transition-colors hover:bg-green-500/20 hover:text-green-200 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                                >
                                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                    Quick Approve
                                </button>

                                {/* Quick Reject */}
                                <button
                                    onClick={() => {
                                        const notes = prompt('Please provide a reason for rejection:');
                                        if (notes && notes.trim()) {
                                            router.post(route('admin.verifications.reject', user.b2b_verification?.id), {
                                                data: { admin_notes: notes },
                                                onSuccess: () => {
                                                    setIsOpen(false);
                                                    onActionComplete?.();
                                                    alert('User rejected successfully!');
                                                },
                                                onError: (errors) => {
                                                    alert('Failed to reject user: ' + Object.values(errors).join(', '));
                                                }
                                            });
                                        }
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                                >
                                    <span className="h-2 w-2 rounded-full bg-red-400"></span>
                                    Quick Reject
                                </button>
                            </div>
                        )}

                        {/* Status Control for B2B Rejected Users */}
                        {isB2B && user.b2b_verification?.status === 'rejected' && (
                            <div className="mt-3 border-t border-gray-700 pt-3">
                                <p className="px-3 py-1 text-xs font-medium tracking-wider text-gray-500 uppercase">B2B Status Control</p>

                                {/* Change to Approved */}
                                <button
                                    onClick={() => {
                                        if (confirm(`Change ${user.name} status to approved?`)) {
                                            router.post(route('admin.verifications.approve', user.b2b_verification?.id), {
                                                data: { admin_notes: 'Status changed to approved by admin' },
                                                onSuccess: () => {
                                                    setIsOpen(false);
                                                    onActionComplete?.();
                                                    alert('User status changed to approved successfully!');
                                                },
                                                onError: (errors) => {
                                                    alert('Failed to change user status: ' + Object.values(errors).join(', '));
                                                }
                                            });
                                        }
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-green-300 transition-colors hover:bg-green-500/20 hover:text-green-200 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                                >
                                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                    Change to Approved
                                </button>

                                {/* Change to Pending */}
                                <button
                                    onClick={() => {
                                        const notes = prompt('Please provide a reason for setting to pending (optional):');
                                        if (notes !== null) {
                                            router.post(route('admin.verifications.pending', user.b2b_verification?.id), {
                                                data: { admin_notes: notes || 'Status changed to pending by admin' },
                                                onSuccess: () => {
                                                    setIsOpen(false);
                                                    onActionComplete?.();
                                                    alert('User status changed to pending successfully!');
                                                },
                                                onError: (errors) => {
                                                    alert('Failed to change user status: ' + Object.values(errors).join(', '));
                                                }
                                            });
                                        }
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-yellow-300 transition-colors hover:bg-yellow-500/20 hover:text-yellow-200 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none"
                                >
                                    <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                                    Change to Pending
                                </button>
                            </div>
                        )}

                        {/* Delete User */}
                        <div className="mt-3 border-t border-gray-700 pt-3">
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete User
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-gray-800 p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Edit User: {user.name}</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">Basic Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                        className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* B2B Information */}
                            {isB2B && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">Business Information</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                                        <input
                                            type="text"
                                            value={editForm.company_name}
                                            onChange={(e) => setEditForm({...editForm, company_name: e.target.value})}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Contact Person</label>
                                        <input
                                            type="text"
                                            value={editForm.contact_person}
                                            onChange={(e) => setEditForm({...editForm, contact_person: e.target.value})}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                                        <input
                                            type="email"
                                            value={editForm.contact_email}
                                            onChange={(e) => setEditForm({...editForm, contact_email: e.target.value})}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                                        <input
                                            type="text"
                                            value={editForm.contact_phone}
                                            onChange={(e) => setEditForm({...editForm, contact_phone: e.target.value})}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Business Address</label>
                                        <textarea
                                            value={editForm.business_address}
                                            onChange={(e) => setEditForm({...editForm, business_address: e.target.value})}
                                            rows={3}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notes</label>
                                        <textarea
                                            value={editForm.admin_notes}
                                            onChange={(e) => setEditForm({...editForm, admin_notes: e.target.value})}
                                            rows={3}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Add admin notes or reason for status change..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* B2B Status Control Section */}
                        {isB2B && (
                            <div className="mt-6 border-t border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-white mb-4">B2B Status Control</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Current Status Display */}
                                    <div className="rounded-lg bg-gray-700/50 p-4">
                                        <h4 className="text-sm font-medium text-gray-300 mb-2">Current Status</h4>
                                        <div className="flex items-center gap-2">
                                            {isApproved && (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-green-600/20 px-3 py-1 text-sm font-medium text-green-400">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Approved
                                                </span>
                                            )}
                                            {isPending && (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-600/20 px-3 py-1 text-sm font-medium text-yellow-400">
                                                    <Clock className="h-4 w-4" />
                                                    Pending
                                                </span>
                                            )}
                                            {isRejected && (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-red-600/20 px-3 py-1 text-sm font-medium text-red-400">
                                                    <XCircle className="h-4 w-4" />
                                                    Rejected
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Change Actions */}
                                    <div className="rounded-lg bg-gray-700/50 p-4">
                                        <h4 className="text-sm font-medium text-gray-300 mb-2">Change Status</h4>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleStatusChange('approved', editForm.admin_notes)}
                                                disabled={processing || isApproved}
                                                className="w-full rounded-lg bg-green-600/20 px-3 py-2 text-sm font-medium text-green-400 transition-colors hover:bg-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <CheckCircle className="h-4 w-4 inline mr-2" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange('pending', editForm.admin_notes)}
                                                disabled={processing || isPending}
                                                className="w-full rounded-lg bg-yellow-600/20 px-3 py-2 text-sm font-medium text-yellow-400 transition-colors hover:bg-yellow-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Clock className="h-4 w-4 inline mr-2" />
                                                Set Pending
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange('rejected', editForm.admin_notes)}
                                                disabled={processing || isRejected}
                                                className="w-full rounded-lg bg-red-600/20 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <XCircle className="h-4 w-4 inline mr-2" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status History */}
                                    <div className="rounded-lg bg-gray-700/50 p-4">
                                        <h4 className="text-sm font-medium text-gray-300 mb-2">Status History</h4>
                                        <div className="space-y-2 text-xs text-gray-400">
                                            {user.b2b_verification?.created_at && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Created: {new Date(user.b2b_verification.created_at).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {user.b2b_verification?.approved_at && (
                                                <div className="flex items-center gap-2 text-green-400">
                                                    <CheckCircle className="h-3 w-3" />
                                                    <span>Approved: {new Date(user.b2b_verification.approved_at).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {user.b2b_verification?.rejected_at && (
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <XCircle className="h-3 w-3" />
                                                    <span>Rejected: {new Date(user.b2b_verification.rejected_at).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-semibold text-white">Delete User</h3>
                        <p className="mb-6 text-gray-300">
                            Are you sure you want to delete <span className="font-semibold text-white">{user.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                disabled={processing}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
