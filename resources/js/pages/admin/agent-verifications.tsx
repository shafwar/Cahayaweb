import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Clock, CheckCircle2, XCircle, Eye, ArrowLeft, LogOut, Trash2, CheckSquare, Square } from 'lucide-react';
import { useState } from 'react';
import { useLogout } from '@/hooks/useLogout';

interface Verification {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    company_name: string;
    company_email: string;
    company_phone: string;
    contact_person_name: string;
    contact_person_email: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string;
    reviewed_by?: string;
    reviewed_at?: string;
    created_at: string;
    created_at_human: string;
}

interface Props {
    verifications: {
        data: Verification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function AgentVerifications({ verifications, pagination }: Props) {
    const { logout, isLoggingOut } = useLogout();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
    const [deleteType, setDeleteType] = useState<'selected' | 'all' | null>(null);

    const filteredVerifications = verifications.data.filter(v =>
        filter === 'all' ? true : v.status === filter
    );

    const filteredIds = filteredVerifications.map(v => v.id);
    const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.includes(id));
    const someFilteredSelected = filteredIds.some(id => selectedIds.includes(id));

    const handleSelectAll = () => {
        if (allFilteredSelected) {
            // Deselect all filtered items
            setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
        } else {
            // Select all filtered items
            setSelectedIds(prev => [...new Set([...prev, ...filteredIds])]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        setDeleteType('selected');
        setDeleteDialogOpen(true);
    };

    const handleDeleteAll = () => {
        setDeleteType('all');
        setDeleteAllDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deleteType === 'selected' && selectedIds.length > 0) {
            router.delete(route('admin.agent-verifications.destroy-multiple'), {
                data: { ids: selectedIds },
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setDeleteDialogOpen(false);
                },
            });
        } else if (deleteType === 'all') {
            router.delete(route('admin.agent-verifications.destroy-all'), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setDeleteAllDialogOpen(false);
                },
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <Head title="Agent Verifications - Admin" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    {/* Navigation Buttons */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-gray-600 hover:bg-gray-800 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <button
                            onClick={logout}
                            disabled={isLoggingOut}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Agent Verifications</h1>
                            <p className="text-gray-400">Manage B2B agent access applications</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            onClick={() => setFilter('all')}
                            className={filter === 'all' ? 'bg-amber-500 text-white' : 'border-gray-600 text-gray-300'}
                        >
                            All ({pagination.total})
                        </Button>
                        <Button
                            variant={filter === 'pending' ? 'default' : 'outline'}
                            onClick={() => setFilter('pending')}
                            className={filter === 'pending' ? 'bg-amber-500 text-white' : 'border-gray-600 text-gray-300'}
                        >
                            Pending ({verifications.data.filter(v => v.status === 'pending').length})
                        </Button>
                        <Button
                            variant={filter === 'approved' ? 'default' : 'outline'}
                            onClick={() => setFilter('approved')}
                            className={filter === 'approved' ? 'bg-green-500 text-white' : 'border-gray-600 text-gray-300'}
                        >
                            Approved ({verifications.data.filter(v => v.status === 'approved').length})
                        </Button>
                        <Button
                            variant={filter === 'rejected' ? 'default' : 'outline'}
                            onClick={() => setFilter('rejected')}
                            className={filter === 'rejected' ? 'bg-red-500 text-white' : 'border-gray-600 text-gray-300'}
                        >
                            Rejected ({verifications.data.filter(v => v.status === 'rejected').length})
                        </Button>
                    </div>

                    {/* Selection and Delete Actions */}
                    {filteredVerifications.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border border-gray-700 bg-gray-800/50">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSelectAll}
                                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    {allFilteredSelected ? (
                                        <CheckSquare className="h-5 w-5 text-orange-400" />
                                    ) : (
                                        <Square className="h-5 w-5 text-gray-400" />
                                    )}
                                    <span>{allFilteredSelected ? 'Deselect All' : 'Select All'}</span>
                                </button>
                                {selectedIds.length > 0 && (
                                    <span className="text-sm text-gray-400">
                                        {selectedIds.length} selected
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {selectedIds.length > 0 && (
                                    <Button
                                        onClick={handleDeleteSelected}
                                        variant="outline"
                                        className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Selected ({selectedIds.length})
                                    </Button>
                                )}
                                <Button
                                    onClick={handleDeleteAll}
                                    variant="outline"
                                    className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/50"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete All
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Verifications List */}
                <div className="space-y-4">
                    {filteredVerifications.length === 0 ? (
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardContent className="py-12 text-center">
                                <p className="text-gray-400">No verifications found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredVerifications.map((verification) => (
                            <Card key={verification.id} className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <button
                                                onClick={() => handleSelectOne(verification.id)}
                                                className="mt-1 flex-shrink-0"
                                            >
                                                {selectedIds.includes(verification.id) ? (
                                                    <CheckSquare className="h-5 w-5 text-orange-400" />
                                                ) : (
                                                    <Square className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                                )}
                                            </button>
                                            <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-semibold text-white">
                                                    {verification.company_name}
                                                </h3>
                                                {getStatusBadge(verification.status)}
                                            </div>

                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-400">Contact Person</p>
                                                    <p className="text-white">{verification.contact_person_name}</p>
                                                    <p className="text-sm text-gray-500">{verification.contact_person_email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Company Email</p>
                                                    <p className="text-white">{verification.company_email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Company Phone</p>
                                                    <p className="text-white">{verification.company_phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">User Account</p>
                                                    <p className="text-white">{verification.user_name}</p>
                                                    <p className="text-sm text-gray-500">{verification.user_email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Submitted</p>
                                                    <p className="text-white">{verification.created_at_human}</p>
                                                </div>
                                                {verification.reviewed_at && (
                                                    <div>
                                                        <p className="text-sm text-gray-400">Reviewed</p>
                                                        <p className="text-white">{verification.reviewed_at}</p>
                                                        {verification.reviewed_by && (
                                                            <p className="text-sm text-gray-500">by {verification.reviewed_by}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {verification.admin_notes && (
                                                <div className="mt-4 rounded-lg border border-gray-700 bg-gray-900/50 p-3">
                                                    <p className="text-sm font-medium text-gray-400 mb-1">Admin Notes:</p>
                                                    <p className="text-sm text-gray-300">{verification.admin_notes}</p>
                                                </div>
                                            )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 flex-shrink-0">
                                            <Link
                                                href={route('admin.agent-verification.show', verification.id)}
                                                className="inline-flex items-center gap-2 rounded-md bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/30 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        <Button
                            variant="outline"
                            disabled={pagination.current_page === 1}
                            onClick={() => router.get(route('admin.agent-verifications'), { page: pagination.current_page - 1 })}
                            className="border-gray-600 text-gray-300"
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 text-gray-300">
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <Button
                            variant="outline"
                            disabled={pagination.current_page === pagination.last_page}
                            onClick={() => router.get(route('admin.agent-verifications'), { page: pagination.current_page + 1 })}
                            className="border-gray-600 text-gray-300"
                        >
                            Next
                        </Button>
                    </div>
                )}

                {/* Delete Selected Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-red-400">Confirm Delete</DialogTitle>
                            <DialogDescription className="text-gray-300">
                                Are you sure you want to delete {selectedIds.length} selected verification(s)? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white hover:bg-red-600"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete All Confirmation Dialog */}
                <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-red-400">Confirm Delete All</DialogTitle>
                            <DialogDescription className="text-gray-300">
                                Are you sure you want to delete ALL {pagination.total} verification(s)? This action cannot be undone and will delete all applications regardless of their status.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteAllDialogOpen(false)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white hover:bg-red-600"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete All
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
