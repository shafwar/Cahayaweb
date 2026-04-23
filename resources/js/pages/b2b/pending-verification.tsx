import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Clock, FileText, RefreshCw, XCircle } from 'lucide-react';

interface Verification {
    id: number;
    company_name: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string;
    created_at: string;
    created_at_human: string;
    resubmission_count?: number;
    last_resubmitted_at?: string | null;
    last_resubmitted_at_human?: string | null;
}

interface Props {
    verification: Verification;
    flash?: {
        success?: string | null;
        error?: string | null;
        info?: string | null;
    };
}

export default function PendingVerification({ verification, flash }: Props) {
    const isRejected = verification.status === 'rejected';

    return (
        <B2BLayout>
            <Head title={isRejected ? 'Application Rejected - Cahaya Anbiya' : 'Verification Pending - Cahaya Anbiya'} />

            <div className="bg-section-photos-home min-h-screen px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <Card className="border border-[#d4af37]/25 bg-white shadow-xl">
                        <CardHeader className="text-center">
                            {isRejected ? (
                                <>
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                                        <XCircle className="h-10 w-10 text-red-500" />
                                    </div>
                                    <CardTitle className="text-3xl text-[#1e3a5f]">Application Rejected</CardTitle>
                                    <CardDescription className="mt-2 text-lg text-[#475569]">
                                        Your B2B access application has been rejected
                                    </CardDescription>
                                </>
                            ) : (
                                <>
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff5200]/10">
                                        <Clock className="h-10 w-10 text-[#ff5200]" />
                                    </div>
                                    <CardTitle className="text-3xl text-[#1e3a5f]">Verification Pending</CardTitle>
                                    <CardDescription className="mt-2 text-lg text-[#475569]">
                                        Your B2B access application is under review
                                    </CardDescription>
                                </>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {flash?.success && (
                                <div
                                    className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-900"
                                    role="status"
                                >
                                    {flash.success}
                                </div>
                            )}
                            {flash?.info && !flash?.success && (
                                <div className="rounded-lg border border-[#c7ddff] bg-[#eef6ff] p-4 text-center text-sm text-[#1e3a5f]" role="status">
                                    {flash.info}
                                </div>
                            )}
                            {flash?.error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-900" role="alert">
                                    {flash.error}
                                </div>
                            )}
                            {/* Status Info - Only show if not rejected */}
                            {!isRejected && (
                                <>
                                    <div className="rounded-lg border border-[#ff5200]/15 bg-[#ff5200]/5 p-4">
                                        <div className="flex items-start gap-3">
                                            <FileText className="mt-0.5 h-5 w-5 text-[#ff5200]" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-[#ff5200]">Application Submitted</h3>
                                                <p className="mt-1 text-sm text-[#475569]">
                                                    Company: <span className="font-medium text-[#1e3a5f]">{verification.company_name}</span>
                                                </p>
                                                <p className="mt-1 text-sm text-[#64748b]">Submitted: {verification.created_at_human}</p>
                                                {(verification.resubmission_count ?? 0) > 0 && verification.last_resubmitted_at_human && (
                                                    <p className="mt-1 text-sm font-medium text-[#1e3a5f]">
                                                        Renewed: {verification.last_resubmitted_at_human}
                                                        {(verification.resubmission_count ?? 0) > 1
                                                            ? ` · Resubmission #${verification.resubmission_count}`
                                                            : null}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* What's Next */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-[#1e3a5f]">What happens next?</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 rounded-lg border border-[#c7ddff] bg-[#f8fafc] p-4">
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2d4a6f]/10">
                                                    <span className="text-sm font-bold text-[#2d4a6f]">1</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#1e3a5f]">Admin Review</p>
                                                    <p className="mt-1 text-sm text-[#64748b]">Our team is reviewing your application and documents</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-lg border border-[#c7ddff] bg-[#f8fafc] p-4">
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2d4a6f]/10">
                                                    <span className="text-sm font-bold text-[#2d4a6f]">2</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#1e3a5f]">Verification</p>
                                                    <p className="mt-1 text-sm text-[#64748b]">We verify your business credentials and documents</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-lg border border-[#c7ddff] bg-[#f8fafc] p-4">
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                                    <span className="text-sm font-bold text-emerald-600">3</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#1e3a5f]">Approval</p>
                                                    <p className="mt-1 text-sm text-[#64748b]">
                                                        Once approved, you'll receive access to the B2B portal
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Box - Only show if not rejected */}
                                    {!isRejected && (
                                        <div className="rounded-lg border border-[#c7ddff] bg-[#eef6ff] p-4">
                                            <p className="text-sm text-[#64748b]">
                                                <strong className="text-[#1e3a5f]">Note:</strong> The review process typically takes 1-3 business days.
                                                You will be notified via email once your application has been reviewed.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Rejection Notice with Admin Notes */}
                            {isRejected && (
                                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 ring-4 ring-red-100/50">
                                            <AlertCircle className="h-6 w-6 text-red-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-3 text-xl font-bold text-red-700">Application Rejected</h3>
                                            {verification.admin_notes ? (
                                                <div className="mb-4 max-h-[300px] overflow-y-auto rounded-lg border border-red-200 bg-red-50/50 p-4">
                                                    <p className="mb-3 text-sm font-semibold text-red-600">Reason for Rejection:</p>
                                                    <div className="break-words whitespace-pre-wrap">
                                                        <p className="text-base leading-relaxed text-[#334155]">{verification.admin_notes}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mb-4 text-sm text-[#475569]">
                                                    Your application has been reviewed and unfortunately cannot be approved at this time.
                                                </p>
                                            )}
                                            <div className="mt-6">
                                                <Link
                                                    href="/b2b/register"
                                                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ff5200] to-[#ff6b35] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
                                                >
                                                    <RefreshCw className="h-5 w-5" />
                                                    Submit New Application
                                                </Link>
                                            </div>
                                            <p className="mt-4 text-xs text-[#64748b]">
                                                Please review the feedback above and submit a new application with the necessary corrections.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </B2BLayout>
    );
}
