import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { adminBackLink, adminGhostBtn, adminMuted, adminPageTitle, adminPrimaryBtn, adminTextarea } from '@/lib/admin-portal-theme';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLogout } from '@/hooks/useLogout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, CheckCircle2, Clock, Download, Edit2, FileText, LogOut, Save, X, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Verification {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    company_name: string;
    company_email: string;
    company_phone: string;
    company_address: string;
    company_city: string;
    company_province: string;
    company_postal_code: string;
    company_country: string;
    business_license_number?: string;
    tax_id_number?: string;
    business_type: string;
    business_type_other?: string;
    years_in_business?: number;
    business_description?: string;
    contact_person_name: string;
    contact_person_position: string;
    contact_person_phone: string;
    contact_person_email: string;
    business_license_file?: string;
    tax_certificate_file?: string;
    company_profile_file?: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string;
    reviewed_by?: string;
    reviewed_at?: string;
    created_at: string;
    created_at_human: string;
}

interface Props {
    verification: Verification;
    flash?: { error?: string; success?: string };
}

export default function AgentVerificationDetail({ verification, flash }: Props) {
    const { logout, isLoggingOut } = useLogout();
    const [isEditing, setIsEditing] = useState(false);

    const approveForm = useForm({});

    const rejectForm = useForm({
        admin_notes: '',
    });

    const updateForm = useForm({
        status: verification.status,
        admin_notes: verification.admin_notes || '',
    });

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(route('admin.agent-verification.approve', verification.id), {
            onSuccess: () => {
                router.reload();
            },
        });
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        rejectForm.post(route('admin.agent-verification.reject', verification.id), {
            onSuccess: () => {
                router.reload();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateForm.post(route('admin.agent-verification.update', verification.id), {
            onSuccess: () => {
                setIsEditing(false);
                router.reload();
            },
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        updateForm.reset();
        updateForm.setData('status', verification.status);
        updateForm.setData('admin_notes', verification.admin_notes || '');
    };

    const getStatusBadge = () => {
        switch (verification.status) {
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
        }
    };

    return (
        <AdminPortalShell className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title={`Verification: ${verification.company_name} - Admin`} />

            <div>
                {/* Flash messages (e.g. download error) */}
                {flash?.error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{flash.error}</div>}
                {flash?.success && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">{flash.success}</div>}
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/admin" className={adminBackLink}>
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                            <Link
                                href={route('admin.agent-verifications')}
                                className={adminBackLink}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to List
                            </Link>
                        </div>
                        <button
                            onClick={logout}
                            disabled={isLoggingOut}
                            className={`${adminGhostBtn} border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5200] to-[#e64a00] shadow-md shadow-orange-200/60">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className={adminPageTitle}>{verification.company_name}</h1>
                                <p className={adminMuted}>Agent Verification Details</p>
                            </div>
                        </div>
                        {getStatusBadge()}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Company Information */}
                        <Card className="border border-slate-200/90 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-[#1e3a5f]">Company Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-slate-500">Company Name</Label>
                                        <p className="mt-1 text-slate-900">{verification.company_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Business Type</Label>
                                        <p className="mt-1 text-slate-900">{verification.business_type}</p>
                                        {verification.business_type === 'Other' && verification.business_type_other && (
                                            <div className="mt-2 rounded-lg border border-orange-100 bg-orange-50/80 p-3">
                                                <Label className="text-xs text-orange-800">Specified Business Type:</Label>
                                                <p className="mt-1 text-sm font-medium text-slate-900">{verification.business_type_other}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Company Email</Label>
                                        <p className="mt-1 text-slate-900">{verification.company_email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Company Phone</Label>
                                        <p className="mt-1 text-slate-900">{verification.company_phone}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label className="text-slate-500">Address</Label>
                                        <p className="mt-1 text-slate-900">
                                            {verification.company_address}, {verification.company_city}, {verification.company_province}{' '}
                                            {verification.company_postal_code}
                                        </p>
                                        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                            <Label className="text-xs font-semibold text-amber-900">Country of Origin:</Label>
                                            <p className="mt-1 text-base font-bold text-[#1e3a5f]">{verification.company_country}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Information */}
                        <Card className="border border-slate-200/90 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-[#1e3a5f]">Business Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {verification.business_license_number && (
                                        <div>
                                            <Label className="text-slate-500">Business License Number</Label>
                                            <p className="mt-1 text-slate-900">{verification.business_license_number}</p>
                                        </div>
                                    )}
                                    {verification.tax_id_number && (
                                        <div>
                                            <Label className="text-slate-500">Tax ID Number (NPWP)</Label>
                                            <p className="mt-1 text-slate-900">{verification.tax_id_number}</p>
                                        </div>
                                    )}
                                    {verification.years_in_business && (
                                        <div>
                                            <Label className="text-slate-500">Years in Business</Label>
                                            <p className="mt-1 text-slate-900">{verification.years_in_business} years</p>
                                        </div>
                                    )}
                                </div>
                                {verification.business_description && (
                                    <div>
                                        <Label className="text-slate-500">Business Description</Label>
                                        <p className="mt-1 text-slate-900">{verification.business_description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Person */}
                        <Card className="border border-slate-200/90 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-[#1e3a5f]">Contact Person</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-slate-500">Name</Label>
                                        <p className="mt-1 text-slate-900">{verification.contact_person_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Position</Label>
                                        <p className="mt-1 text-slate-900">{verification.contact_person_position}</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Email</Label>
                                        <p className="mt-1 text-slate-900">{verification.contact_person_email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Phone</Label>
                                        <p className="mt-1 text-slate-900">{verification.contact_person_phone}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        {(verification.business_license_file || verification.tax_certificate_file || verification.company_profile_file) && (
                            <Card className="border border-slate-200/90 bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-[#1e3a5f]">Supporting Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {verification.business_license_file && (
                                        <a
                                            href={verification.business_license_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-orange-50/80"
                                        >
                                            <FileText className="h-5 w-5 text-amber-600" />
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">Business License</p>
                                                <p className="text-sm text-slate-500">Click to view/download</p>
                                            </div>
                                            <Download className="h-4 w-4 text-orange-600" />
                                        </a>
                                    )}
                                    {verification.tax_certificate_file && (
                                        <a
                                            href={verification.tax_certificate_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-orange-50/80"
                                        >
                                            <FileText className="h-5 w-5 text-emerald-600" />
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">Tax Certificate</p>
                                                <p className="text-sm text-slate-500">Click to view/download</p>
                                            </div>
                                            <Download className="h-4 w-4 text-orange-600" />
                                        </a>
                                    )}
                                    {verification.company_profile_file && (
                                        <a
                                            href={verification.company_profile_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-orange-50/80"
                                        >
                                            <FileText className="h-5 w-5 text-violet-600" />
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">Company Profile</p>
                                                <p className="text-sm text-slate-500">Click to view/download</p>
                                            </div>
                                            <Download className="h-4 w-4 text-orange-600" />
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* User Account Info */}
                        <Card className="border border-slate-200/90 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-[#1e3a5f]">User Account</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-slate-500">Name</Label>
                                        <p className="mt-1 text-slate-900">{verification.user_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Email</Label>
                                        <p className="mt-1 text-slate-900">{verification.user_email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">User ID</Label>
                                        <p className="mt-1 text-slate-900">{verification.user_id}</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Application Submitted</Label>
                                        <p className="mt-1 text-slate-900">{verification.created_at_human}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Actions */}
                    <div className="space-y-6">
                        {verification.status === 'pending' && (
                            <>
                                {/* Approve Form */}
                                <Card className="border border-emerald-200 bg-emerald-50/90 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-emerald-900">Approve Application</CardTitle>
                                        <CardDescription className="text-slate-600">Grant B2B access to this agent</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleApprove}>
                                            <Button
                                                type="submit"
                                                disabled={approveForm.processing}
                                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                                            >
                                                {approveForm.processing ? 'Approving...' : 'Approve Application'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Reject Form */}
                                <Card className="border border-red-200 bg-red-50/90 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-red-800">Reject Application</CardTitle>
                                        <CardDescription className="text-slate-600">Reject this application (reason required)</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleReject} className="space-y-4">
                                            <div>
                                                <Label htmlFor="reject_notes" className="text-slate-700">
                                                    Rejection Reason <span className="text-red-500">*</span>
                                                </Label>
                                                <textarea
                                                    id="reject_notes"
                                                    value={rejectForm.data.admin_notes}
                                                    onChange={(e) => rejectForm.setData('admin_notes', e.target.value)}
                                                    rows={4}
                                                    className={`mt-1 ${adminTextarea}`}
                                                    placeholder="Please provide a reason for rejection..."
                                                    required
                                                />
                                                <InputError message={rejectForm.errors.admin_notes} />
                                            </div>
                                            <Button type="submit" variant="destructive" disabled={rejectForm.processing} className="w-full">
                                                {rejectForm.processing ? 'Rejecting...' : 'Reject Application'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Review Info */}
                        {verification.status !== 'pending' && (
                            <Card className="border border-slate-200/90 bg-white shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-[#1e3a5f]">Review Information</CardTitle>
                                        {!isEditing && (
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                variant="outline"
                                                size="sm"
                                                className="border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                                            >
                                                <Edit2 className="mr-2 h-4 w-4" />
                                                Update
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {verification.reviewed_by && (
                                        <div>
                                            <Label className="text-slate-500">Reviewed By</Label>
                                            <p className="mt-1 text-slate-900">{verification.reviewed_by}</p>
                                        </div>
                                    )}
                                    {verification.reviewed_at && (
                                        <div>
                                            <Label className="text-slate-500">Reviewed At</Label>
                                            <p className="mt-1 text-slate-900">{verification.reviewed_at}</p>
                                        </div>
                                    )}

                                    {isEditing ? (
                                        <form onSubmit={handleUpdate} className="space-y-4">
                                            <div>
                                                <Label htmlFor="update_status" className="text-slate-700">
                                                    Status <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={updateForm.data.status}
                                                    onValueChange={(value) => {
                                                        const newStatus = value as 'pending' | 'approved' | 'rejected';
                                                        updateForm.setData('status', newStatus);
                                                        // Clear admin_notes if changing to approved or pending
                                                        if (newStatus !== 'rejected') {
                                                            updateForm.setData('admin_notes', '');
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="mt-1 border-slate-200 bg-white text-slate-900">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-slate-200 bg-white">
                                                        <SelectItem value="pending" className="text-slate-900 focus:bg-orange-50">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-orange-600" />
                                                                Pending
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="approved" className="text-slate-900 focus:bg-emerald-50">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                                Approved
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="rejected" className="text-slate-900 focus:bg-red-50">
                                                            <div className="flex items-center gap-2">
                                                                <XCircle className="h-4 w-4 text-red-500" />
                                                                Rejected
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={updateForm.errors.status} />
                                            </div>

                                            {/* Admin Notes - Only show if status is rejected */}
                                            {updateForm.data.status === 'rejected' && (
                                                <div>
                                                    <Label htmlFor="update_notes" className="text-slate-700">
                                                        Admin Notes <span className="text-red-500">*</span>
                                                    </Label>
                                                    <textarea
                                                        id="update_notes"
                                                        value={updateForm.data.admin_notes}
                                                        onChange={(e) => updateForm.setData('admin_notes', e.target.value)}
                                                        rows={6}
                                                        className={`mt-1 ${adminTextarea}`}
                                                        placeholder="Please provide a reason for rejection..."
                                                        required
                                                    />
                                                    <InputError message={updateForm.errors.admin_notes} />
                                                    <p className={`mt-1 text-xs ${adminMuted}`}>Rejection reason is required</p>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <Button
                                                    type="submit"
                                                    disabled={updateForm.processing}
                                                    className={`flex-1 ${adminPrimaryBtn}`}
                                                >
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {updateForm.processing ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    variant="outline"
                                                    disabled={updateForm.processing}
                                                    className={adminGhostBtn}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            {verification.admin_notes ? (
                                                <div>
                                                    <Label className="text-slate-500">Admin Notes</Label>
                                                    <div className="mt-1 max-h-[200px] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                                                        <p className="break-words whitespace-pre-wrap text-slate-800">{verification.admin_notes}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Label className="text-slate-500">Admin Notes</Label>
                                                    <p className={`mt-1 italic ${adminMuted}`}>No notes provided</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminPortalShell>
    );
}
