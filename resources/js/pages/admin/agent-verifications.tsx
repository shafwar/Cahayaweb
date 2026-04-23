import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { adminBackLink, adminGhostBtn, adminMuted, adminPageTitle, adminPrimaryBtn } from '@/lib/admin-portal-theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Building2, Clock, CheckCircle2, XCircle, Eye, ArrowLeft, LogOut, Trash2, CheckSquare, Square, RefreshCw } from 'lucide-react';
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
    resubmission_count?: number;
    last_resubmitted_at?: string | null;
    last_resubmitted_at_human?: string | null;
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

const filterBtnBase = 'rounded-xl border px-4 py-2 text-sm font-medium transition-colors';
const filterInactive = `${filterBtnBase} border-slate-200 bg-white text-slate-600 hover:bg-slate-50`;

export default function AgentVerifications({ verifications, pagination }: Props) {
    const pageErrors = usePage().props.errors as Record<string, string> | undefined;
    const { logout, isLoggingOut } = useLogout();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
    const [deleteType, setDeleteType] = useState<'selected' | 'all' | null>(null);

    const filteredVerifications = verifications.data.filter((v) => (filter === 'all' ? true : v.status === filter));

    const filteredIds = filteredVerifications.map((v) => v.id);
    const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));

    const handleSelectAll = () => {
        if (allFilteredSelected) {
            setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
        } else {
            setSelectedIds((prev) => [...new Set([...prev, ...filteredIds])]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
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
                    <Badge className="border border-orange-200 bg-orange-50 text-amber-900">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-800">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="border border-red-200 bg-red-50 text-red-800">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <AdminPortalShell className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title="Agent Verifications - Admin" />

            <div>
                <div className="mb-8">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <Link href="/admin" className={adminBackLink}>
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <button
                            onClick={logout}
                            disabled={isLoggingOut}
                            className={`${adminGhostBtn} border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>

                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5200] to-[#e64a00] shadow-md shadow-orange-200/60">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className={adminPageTitle}>Agent Verifications</h1>
                            <p className={adminMuted}>Manage B2B agent access applications</p>
                        </div>
                    </div>

                    {pageErrors?.message && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert">
                            {pageErrors.message}
                        </div>
                    )}

                    <div className="mb-4 flex flex-wrap gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            onClick={() => setFilter('all')}
                            className={
                                filter === 'all'
                                    ? `${filterBtnBase} border-slate-800 bg-slate-800 text-white hover:bg-slate-900`
                                    : filterInactive
                            }
                        >
                            All ({pagination.total})
                        </Button>
                        <Button
                            variant={filter === 'pending' ? 'default' : 'outline'}
                            onClick={() => setFilter('pending')}
                            className={filter === 'pending' ? `${filterBtnBase} ${adminPrimaryBtn} border-0` : filterInactive}
                        >
                            Pending ({verifications.data.filter((v) => v.status === 'pending').length})
                        </Button>
                        <Button
                            variant={filter === 'approved' ? 'default' : 'outline'}
                            onClick={() => setFilter('approved')}
                            className={
                                filter === 'approved'
                                    ? `${filterBtnBase} border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700`
                                    : filterInactive
                            }
                        >
                            Approved ({verifications.data.filter((v) => v.status === 'approved').length})
                        </Button>
                        <Button
                            variant={filter === 'rejected' ? 'default' : 'outline'}
                            onClick={() => setFilter('rejected')}
                            className={
                                filter === 'rejected'
                                    ? `${filterBtnBase} border-red-600 bg-red-600 text-white hover:bg-red-700`
                                    : filterInactive
                            }
                        >
                            Rejected ({verifications.data.filter((v) => v.status === 'rejected').length})
                        </Button>
                    </div>

                    {filteredVerifications.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <button onClick={handleSelectAll} className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-[#1e3a5f]">
                                    {allFilteredSelected ? (
                                        <CheckSquare className="h-5 w-5 text-amber-600" />
                                    ) : (
                                        <Square className="h-5 w-5 text-slate-400" />
                                    )}
                                    <span>{allFilteredSelected ? 'Deselect All' : 'Select All'}</span>
                                </button>
                                {selectedIds.length > 0 && <span className="text-sm text-slate-500">{selectedIds.length} selected</span>}
                            </div>
                            <div className="flex gap-2">
                                {selectedIds.length > 0 && (
                                    <Button
                                        onClick={handleDeleteSelected}
                                        variant="outline"
                                        className="border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Selected ({selectedIds.length})
                                    </Button>
                                )}
                                <Button onClick={handleDeleteAll} variant="outline" className="border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete All
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {filteredVerifications.length === 0 ? (
                        <Card className="border-slate-200/90 bg-white shadow-sm">
                            <CardContent className="py-12 text-center">
                                <p className={adminMuted}>No verifications found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredVerifications.map((verification) => (
                            <Card key={verification.id} className="border-slate-200/90 bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex flex-1 items-start gap-3">
                                            <button type="button" onClick={() => handleSelectOne(verification.id)} className="mt-1 shrink-0">
                                                {selectedIds.includes(verification.id) ? (
                                                    <CheckSquare className="h-5 w-5 text-amber-600" />
                                                ) : (
                                                    <Square className="h-5 w-5 text-slate-400 hover:text-slate-500" />
                                                )}
                                            </button>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-3 flex flex-wrap items-center gap-3">
                                                    <h3 className="text-xl font-semibold text-[#1e3a5f]">{verification.company_name}</h3>
                                                    {getStatusBadge(verification.status)}
                                                    {(verification.resubmission_count ?? 0) > 0 && verification.status === 'pending' && (
                                                        <Badge className="border border-violet-200 bg-violet-50 text-violet-900" title={verification.last_resubmitted_at ?? undefined}>
                                                            <RefreshCw className="mr-1 h-3 w-3" />
                                                            Renewed
                                                            {(verification.resubmission_count ?? 0) > 1
                                                                ? ` (${verification.resubmission_count}×)`
                                                                : ''}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                                    <div>
                                                        <p className="text-sm text-slate-500">Contact Person</p>
                                                        <p className="text-slate-900">{verification.contact_person_name}</p>
                                                        <p className="text-sm text-slate-500">{verification.contact_person_email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500">Company Email</p>
                                                        <p className="text-slate-900">{verification.company_email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500">Company Phone</p>
                                                        <p className="text-slate-900">{verification.company_phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500">User Account</p>
                                                        <p className="text-slate-900">{verification.user_name}</p>
                                                        <p className="text-sm text-slate-500">{verification.user_email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500">Submitted</p>
                                                        <p className="text-slate-900">{verification.created_at_human}</p>
                                                        {(verification.resubmission_count ?? 0) > 0 && verification.last_resubmitted_at_human && (
                                                            <p className="mt-1 text-xs text-violet-700">
                                                                Last resubmitted {verification.last_resubmitted_at_human}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {verification.reviewed_at && (
                                                        <div>
                                                            <p className="text-sm text-slate-500">Reviewed</p>
                                                            <p className="text-slate-900">{verification.reviewed_at}</p>
                                                            {verification.reviewed_by && <p className="text-sm text-slate-500">by {verification.reviewed_by}</p>}
                                                        </div>
                                                    )}
                                                </div>

                                                {verification.admin_notes && (
                                                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                                        <p className="mb-1 text-sm font-medium text-slate-500">Admin Notes:</p>
                                                        <p className="text-sm text-slate-800">{verification.admin_notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-col gap-2">
                                            <Link
                                                href={route('admin.agent-verification.show', verification.id)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800 transition-colors hover:bg-orange-100"
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

                {pagination.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        <Button
                            variant="outline"
                            disabled={pagination.current_page === 1}
                            onClick={() => router.get(route('admin.agent-verifications'), { page: pagination.current_page - 1 })}
                            className={adminGhostBtn}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 text-sm text-slate-500">
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <Button
                            variant="outline"
                            disabled={pagination.current_page === pagination.last_page}
                            onClick={() => router.get(route('admin.agent-verifications'), { page: pagination.current_page + 1 })}
                            className={adminGhostBtn}
                        >
                            Next
                        </Button>
                    </div>
                )}

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="border-slate-200 bg-white text-slate-900">
                        <DialogHeader>
                            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
                            <DialogDescription className="text-slate-600">
                                Are you sure you want to delete {selectedIds.length} selected verification(s)? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className={adminGhostBtn}>
                                Cancel
                            </Button>
                            <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
                    <DialogContent className="border-slate-200 bg-white text-slate-900">
                        <DialogHeader>
                            <DialogTitle className="text-red-600">Confirm Delete All</DialogTitle>
                            <DialogDescription className="text-slate-600">
                                Are you sure you want to delete ALL {pagination.total} verification(s)? This action cannot be undone and will delete all applications
                                regardless of their status.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteAllDialogOpen(false)} className={adminGhostBtn}>
                                Cancel
                            </Button>
                            <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete All
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminPortalShell>
    );
}
