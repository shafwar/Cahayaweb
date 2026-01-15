import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock, CheckCircle2, XCircle, FileText, AlertCircle, RefreshCw } from 'lucide-react';

interface Verification {
    id: number;
    company_name: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string;
    created_at: string;
    created_at_human: string;
}

interface Props {
    verification: Verification;
}

export default function PendingVerification({ verification }: Props) {
    const isRejected = verification.status === 'rejected';

    return (
        <B2BLayout>
            <Head title={isRejected ? "Application Rejected - Cahaya Anbiya" : "Verification Pending - Cahaya Anbiya"} />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            {isRejected ? (
                                <>
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20">
                                        <XCircle className="h-10 w-10 text-red-400" />
                                    </div>
                                    <CardTitle className="text-3xl text-white">Application Rejected</CardTitle>
                                    <CardDescription className="mt-2 text-lg text-gray-300">
                                        Your B2B access application has been rejected
                                    </CardDescription>
                                </>
                            ) : (
                                <>
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20">
                                        <Clock className="h-10 w-10 text-amber-400" />
                                    </div>
                                    <CardTitle className="text-3xl text-white">Verification Pending</CardTitle>
                                    <CardDescription className="mt-2 text-lg text-gray-300">
                                        Your B2B access application is under review
                                    </CardDescription>
                                </>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Status Info - Only show if not rejected */}
                            {!isRejected && (
                                <>
                                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
                                        <div className="flex items-start gap-3">
                                            <FileText className="mt-0.5 h-5 w-5 text-amber-400" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-amber-300">Application Submitted</h3>
                                                <p className="mt-1 text-sm text-gray-300">
                                                    Company: <span className="font-medium text-white">{verification.company_name}</span>
                                                </p>
                                                <p className="mt-1 text-sm text-gray-400">
                                                    Submitted: {verification.created_at_human}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* What's Next */}
                                    <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">What happens next?</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                                            <span className="text-sm font-bold text-blue-400">1</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Admin Review</p>
                                            <p className="mt-1 text-sm text-gray-400">
                                                Our team is reviewing your application and documents
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                                            <span className="text-sm font-bold text-blue-400">2</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Verification</p>
                                            <p className="mt-1 text-sm text-gray-400">
                                                We verify your business credentials and documents
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20">
                                            <span className="text-sm font-bold text-green-400">3</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Approval</p>
                                            <p className="mt-1 text-sm text-gray-400">
                                                Once approved, you'll receive access to the B2B portal
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box - Only show if not rejected */}
                            {!isRejected && (
                                <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                                    <p className="text-sm text-gray-400">
                                        <strong className="text-white">Note:</strong> The review process typically takes 1-3 business days.
                                        You will be notified via email once your application has been reviewed.
                                    </p>
                                </div>
                            )}
                                </>
                            )}

                            {/* Rejection Notice with Admin Notes */}
                            {isRejected && (
                                <div className="rounded-xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 via-red-500/5 to-red-500/10 p-6 backdrop-blur-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20 ring-4 ring-red-500/10">
                                            <AlertCircle className="h-6 w-6 text-red-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-3 text-xl font-bold text-red-300">Application Rejected</h3>
                                            {verification.admin_notes ? (
                                                <div className="mb-4 max-h-[300px] overflow-y-auto rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                                                    <p className="mb-3 text-sm font-semibold text-red-200">Reason for Rejection:</p>
                                                    <div className="whitespace-pre-wrap break-words">
                                                        <p className="text-base leading-relaxed text-gray-200">{verification.admin_notes}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mb-4 text-sm text-gray-300">
                                                    Your application has been reviewed and unfortunately cannot be approved at this time.
                                                </p>
                                            )}
                                            <div className="mt-6">
                                                <Link
                                                    href="/b2b/register"
                                                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-base font-semibold text-white transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-500/20"
                                                >
                                                    <RefreshCw className="h-5 w-5" />
                                                    Submit New Application
                                                </Link>
                                            </div>
                                            <p className="mt-4 text-xs text-gray-400">
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
