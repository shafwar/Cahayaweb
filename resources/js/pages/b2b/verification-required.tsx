import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, Clock, Mail, Phone } from 'lucide-react';

export default function B2BVerificationRequired() {
    return (
        <>
            <Head title="Verification Required - B2B Portal" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 flex items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">Verification Required</h1>
                        <p className="text-lg text-gray-400">Your B2B account is pending verification</p>
                    </div>

                    {/* Main Content */}
                    <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 sm:p-8">
                        {/* Status Card */}
                        <div className="mb-6 flex items-center gap-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
                                <Clock className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Verification in Progress</h3>
                                <p className="text-sm text-yellow-400">Our admin team is reviewing your business credentials</p>
                            </div>
                        </div>

                        {/* What's Happening */}
                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-white">What's happening now?</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                                        <span className="text-sm font-bold text-blue-400">1</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Document Review</p>
                                        <p className="text-sm text-gray-400">Our team is reviewing your business license and company documents</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                                        <span className="text-sm font-bold text-blue-400">2</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Background Check</p>
                                        <p className="text-sm text-gray-400">Verifying your business legitimacy and compliance</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/20">
                                        <span className="text-sm font-bold text-gray-400">3</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-400">Account Activation</p>
                                        <p className="text-sm text-gray-500">Once approved, you'll have full access to B2B features</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expected Timeline */}
                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-white">Expected Timeline</h3>
                            <div className="rounded-xl bg-gray-700/50 p-4">
                                <div className="mb-2 flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-blue-400" />
                                    <span className="font-medium text-white">1-3 Business Days</span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Most verifications are completed within 1-3 business days. We'll notify you via email once your account is
                                    approved.
                                </p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-white">Need Help?</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-xl bg-gray-700/50 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                                        <Mail className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Email Support</p>
                                        <p className="text-sm text-gray-400">support@cahayaanbiya.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl bg-gray-700/50 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
                                        <Phone className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">Phone Support</p>
                                        <p className="text-sm text-gray-400">+62-812-3456-7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
                                <Mail className="h-4 w-4" />
                                Contact Support
                            </button>
                            <button
                                onClick={() => (window.location.href = '/b2b')}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-600 bg-gray-700 px-6 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Check Status
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">© 2024 Cahaya Anbiya Travel. All rights reserved.</p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
