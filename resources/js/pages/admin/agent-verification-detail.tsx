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
                    <Badge className="border-amber-500/30 bg-amber-500/20 text-amber-300">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge className="border-green-500/30 bg-green-500/20 text-green-300">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="border-red-500/30 bg-red-500/20 text-red-300">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                    </Badge>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <Head title={`Verification: ${verification.company_name} - Admin`} />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Flash messages (e.g. download error) */}
                {flash?.error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300">{flash.error}</div>}
                {flash?.success && (
                    <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-green-300">{flash.success}</div>
                )}
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-gray-600 hover:bg-gray-800 hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                            <Link
                                href={route('admin.agent-verifications')}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-gray-600 hover:bg-gray-800 hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to List
                            </Link>
                        </div>
                        <button
                            onClick={logout}
                            disabled={isLoggingOut}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{verification.company_name}</h1>
                                <p className="text-gray-400">Agent Verification Details</p>
                            </div>
                        </div>
                        {getStatusBadge()}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Company Information */}
                        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white">Company Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-gray-400">Company Name</Label>
                                        <p className="mt-1 text-white">{verification.company_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Business Type</Label>
                                        <p className="mt-1 text-white">{verification.business_type}</p>
                                        {verification.business_type === 'Other' && verification.business_type_other && (
                                            <div className="mt-2 rounded-lg border border-orange-500/20 bg-orange-500/10 p-3">
                                                <Label className="text-xs text-orange-300">Specified Business Type:</Label>
                                                <p className="mt-1 text-sm font-medium text-white">{verification.business_type_other}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Company Email</Label>
                                        <p className="mt-1 text-white">{verification.company_email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Company Phone</Label>
                                        <p className="mt-1 text-white">{verification.company_phone}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label className="text-gray-400">Address</Label>
                                        <p className="mt-1 text-white">
                                            {verification.company_address}, {verification.company_city}, {verification.company_province}{' '}
                                            {verification.company_postal_code}
                                        </p>
                                        <div className="mt-2 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                                            <Label className="text-xs font-semibold text-blue-300">Country of Origin:</Label>
                                            <p className="mt-1 text-base font-bold text-white">{verification.company_country}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Information */}
                        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white">Business Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {verification.business_license_number && (
                                        <div>
                                            <Label className="text-gray-400">Business License Number</Label>
                                            <p className="mt-1 text-white">{verification.business_license_number}</p>
                                        </div>
                                    )}
                                    {verification.tax_id_number && (
                                        <div>
                                            <Label className="text-gray-400">Tax ID Number (NPWP)</Label>
                                            <p className="mt-1 text-white">{verification.tax_id_number}</p>
                                        </div>
                                    )}
                                    {verification.years_in_business && (
                                        <div>
                                            <Label className="text-gray-400">Years in Business</Label>
                                            <p className="mt-1 text-white">{verification.years_in_business} years</p>
                                        </div>
                                    )}
                                </div>
                                {verification.business_description && (
                                    <div>
                                        <Label className="text-gray-400">Business Description</Label>
                                        <p className="mt-1 text-white">{verification.business_description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Person */}
                        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white">Contact Person</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-gray-400">Name</Label>
                                        <p className="mt-1 text-white">{verification.contact_person_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Position</Label>
                                        <p className="mt-1 text-white">{verification.contact_person_position}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Email</Label>
                                        <p className="mt-1 text-white">{verification.contact_person_email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Phone</Label>
                                        <p className="mt-1 text-white">{verification.contact_person_phone}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        {(verification.business_license_file || verification.tax_certificate_file || verification.company_profile_file) && (
                            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-white">Supporting Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {verification.business_license_file && (
                                        <a
                                            href={verification.business_license_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-3 transition-colors hover:bg-gray-900"
                                        >
                                            <FileText className="h-5 w-5 text-blue-400" />
                                            <div className="flex-1">
                                                <p className="text-white">Business License</p>
                                                <p className="text-sm text-gray-400">Click to view/download</p>
                                            </div>
                                            <Download className="h-4 w-4 text-gray-400" />
                                        </a>
                                    )}
                                    {verification.tax_certificate_file && (
                                        <a
                                            href={verification.tax_certificate_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-3 transition-colors hover:bg-gray-900"
                                        >
                                            <FileText className="h-5 w-5 text-green-400" />
                                            <div className="flex-1">
                                                <p className="text-white">Tax Certificate</p>
                                                <p className="text-sm text-gray-400">Click to view/download</p>
                                            </div>
                                            <Download className="h-4 w-4 text-gray-400" />
                                        </a>
                                    )}
                                    {verification.company_profile_file && (
                                        <a
                                            href={verification.company_profile_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-3 transition-colors hover:bg-gray-900"
                                        >
                                            <FileText className="h-5 w-5 text-purple-400" />
                                            <div className="flex-1">
                                                <p className="text-white">Company Profile</p>
                                                <p className="text-sm text-gray-400">Click to view/download</p>
                                            </div>
                                            <Download className="h-4 w-4 text-gray-400" />
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* User Account Info */}
                        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white">User Account</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-gray-400">Name</Label>
                                        <p className="mt-1 text-white">{verification.user_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Email</Label>
                                        <p className="mt-1 text-white">{verification.user_email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">User ID</Label>
                                        <p className="mt-1 text-white">{verification.user_id}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Application Submitted</Label>
                                        <p className="mt-1 text-white">{verification.created_at_human}</p>
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
                                <Card className="border-green-700 bg-green-900/10 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-green-300">Approve Application</CardTitle>
                                        <CardDescription className="text-gray-400">Grant B2B access to this agent</CardDescription>
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
                                <Card className="border-red-700 bg-red-900/10 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-red-300">Reject Application</CardTitle>
                                        <CardDescription className="text-gray-400">Reject this application (reason required)</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleReject} className="space-y-4">
                                            <div>
                                                <Label htmlFor="reject_notes" className="text-gray-300">
                                                    Rejection Reason <span className="text-red-400">*</span>
                                                </Label>
                                                <textarea
                                                    id="reject_notes"
                                                    value={rejectForm.data.admin_notes}
                                                    onChange={(e) => rejectForm.setData('admin_notes', e.target.value)}
                                                    rows={4}
                                                    className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900/50 px-3 py-2 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
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
                            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white">Review Information</CardTitle>
                                        {!isEditing && (
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                variant="outline"
                                                size="sm"
                                                className="border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
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
                                            <Label className="text-gray-400">Reviewed By</Label>
                                            <p className="mt-1 text-white">{verification.reviewed_by}</p>
                                        </div>
                                    )}
                                    {verification.reviewed_at && (
                                        <div>
                                            <Label className="text-gray-400">Reviewed At</Label>
                                            <p className="mt-1 text-white">{verification.reviewed_at}</p>
                                        </div>
                                    )}

                                    {isEditing ? (
                                        <form onSubmit={handleUpdate} className="space-y-4">
                                            <div>
                                                <Label htmlFor="update_status" className="text-gray-300">
                                                    Status <span className="text-red-400">*</span>
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
                                                    <SelectTrigger className="mt-1 border-gray-600 bg-gray-900/50 text-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-gray-700 bg-gray-800">
                                                        <SelectItem value="pending" className="text-white hover:bg-amber-500/20">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-amber-400" />
                                                                Pending
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="approved" className="text-white hover:bg-green-500/20">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                                                Approved
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="rejected" className="text-white hover:bg-red-500/20">
                                                            <div className="flex items-center gap-2">
                                                                <XCircle className="h-4 w-4 text-red-400" />
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
                                                    <Label htmlFor="update_notes" className="text-gray-300">
                                                        Admin Notes <span className="text-red-400">*</span>
                                                    </Label>
                                                    <textarea
                                                        id="update_notes"
                                                        value={updateForm.data.admin_notes}
                                                        onChange={(e) => updateForm.setData('admin_notes', e.target.value)}
                                                        rows={6}
                                                        className="mt-1 w-full rounded-md border border-gray-600 bg-gray-900/50 px-3 py-2 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                                                        placeholder="Please provide a reason for rejection..."
                                                        required
                                                    />
                                                    <InputError message={updateForm.errors.admin_notes} />
                                                    <p className="mt-1 text-xs text-gray-400">Rejection reason is required</p>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <Button
                                                    type="submit"
                                                    disabled={updateForm.processing}
                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                                                >
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {updateForm.processing ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    variant="outline"
                                                    disabled={updateForm.processing}
                                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
                                                    <Label className="text-gray-400">Admin Notes</Label>
                                                    <div className="mt-1 max-h-[200px] overflow-y-auto rounded-lg border border-gray-700 bg-gray-900/50 p-3">
                                                        <p className="break-words whitespace-pre-wrap text-white">{verification.admin_notes}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Label className="text-gray-400">Admin Notes</Label>
                                                    <p className="mt-1 text-gray-500 italic">No notes provided</p>
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
        </div>
    );
}
