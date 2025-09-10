import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Building2, Upload } from 'lucide-react';
import { useState } from 'react';

interface UpdateApplicationProps {
    verification: {
        id: number;
        company_name: string;
        company_address: string;
        business_license_number: string;
        tax_id_number: string;
        contact_person: string;
        contact_phone: string;
        contact_email: string;
        admin_notes?: string;
    };
}

export default function UpdateApplication({ verification }: UpdateApplicationProps) {
    const [licenseFile, setLicenseFile] = useState<File | null>(null);
    const [licensePreview, setLicensePreview] = useState<string>('');

    const { data, setData, post, processing, errors } = useForm({
        company_name: verification.company_name,
        company_address: verification.company_address,
        business_license_number: verification.business_license_number,
        tax_id_number: verification.tax_id_number,
        contact_person: verification.contact_person,
        contact_phone: verification.contact_phone,
        contact_email: verification.contact_email,
        license_file: null as File | null,
    });

    const handleLicenseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLicenseFile(file);
            setData('license_file', file);

            // Create preview for image files
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setLicensePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('b2b.verification.update'));
    };

    return (
        <>
            <Head title="Update Application - Cahaya Anbiya" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Header */}
                <div className="border-b border-gray-600/50 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700/50 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 via-orange-500 to-orange-600 shadow-lg">
                                        <Building2 className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-white sm:text-xl">Update B2B Application</h1>
                                        <p className="text-sm text-gray-400">Update your rejected application</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Rejection Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                                <AlertCircle className="h-6 w-6 text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="mb-2 text-lg font-semibold text-white">Application Rejected</h3>
                                <p className="mb-3 text-gray-300">
                                    Your previous application was rejected. Please review the feedback below and update your information accordingly.
                                </p>
                                {verification.admin_notes && (
                                    <div className="rounded-lg bg-gray-700/50 p-4">
                                        <p className="mb-2 text-sm font-medium text-gray-300">Admin Feedback:</p>
                                        <p className="text-sm text-gray-400">{verification.admin_notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Update Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 sm:p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Company Information */}
                            <div className="space-y-4">
                                <h3 className="border-b border-gray-700 pb-2 text-lg font-semibold text-white">Company Information</h3>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-300">Company Name *</label>
                                        <input
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Enter company name"
                                        />
                                        {errors.company_name && <p className="mt-1 text-sm text-red-400">{errors.company_name}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-300">Business License Number *</label>
                                        <input
                                            type="text"
                                            value={data.business_license_number}
                                            onChange={(e) => setData('business_license_number', e.target.value)}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Enter license number"
                                        />
                                        {errors.business_license_number && (
                                            <p className="mt-1 text-sm text-red-400">{errors.business_license_number}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">Company Address *</label>
                                    <textarea
                                        value={data.company_address}
                                        onChange={(e) => setData('company_address', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                                        placeholder="Enter complete company address"
                                    />
                                    {errors.company_address && <p className="mt-1 text-sm text-red-400">{errors.company_address}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-300">Tax ID Number</label>
                                        <input
                                            type="text"
                                            value={data.tax_id_number}
                                            onChange={(e) => setData('tax_id_number', e.target.value)}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Enter tax ID number"
                                        />
                                        {errors.tax_id_number && <p className="mt-1 text-sm text-red-400">{errors.tax_id_number}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="border-b border-gray-700 pb-2 text-lg font-semibold text-white">Contact Information</h3>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-300">Contact Person *</label>
                                        <input
                                            type="text"
                                            value={data.contact_person}
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Enter contact person name"
                                        />
                                        {errors.contact_person && <p className="mt-1 text-sm text-red-400">{errors.contact_person}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-300">Contact Phone *</label>
                                        <input
                                            type="tel"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                                            placeholder="Enter contact phone"
                                        />
                                        {errors.contact_phone && <p className="mt-1 text-sm text-red-400">{errors.contact_phone}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">Contact Email *</label>
                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none"
                                        placeholder="Enter contact email"
                                    />
                                    {errors.contact_email && <p className="mt-1 text-sm text-red-400">{errors.contact_email}</p>}
                                </div>
                            </div>

                            {/* Document Upload */}
                            <div className="space-y-4">
                                <h3 className="border-b border-gray-700 pb-2 text-lg font-semibold text-white">Document Upload</h3>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">Business License Document *</label>
                                    <div className="rounded-lg border-2 border-dashed border-gray-600 bg-gray-700/50 p-6 text-center transition-colors hover:border-blue-500/50">
                                        <input
                                            type="file"
                                            onChange={handleLicenseFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            id="license-file"
                                        />
                                        <label htmlFor="license-file" className="flex cursor-pointer flex-col items-center gap-3">
                                            <Upload className="h-8 w-8 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-300">
                                                    <span className="font-medium text-blue-400 hover:text-blue-300">Click to upload</span> or drag and
                                                    drop
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG up to 2MB</p>
                                            </div>
                                        </label>
                                    </div>

                                    {licenseFile && (
                                        <div className="mt-3 rounded-lg bg-gray-700/50 p-3">
                                            <p className="text-sm text-gray-300">
                                                Selected file: <span className="font-medium text-white">{licenseFile.name}</span>
                                            </p>
                                            {licensePreview && (
                                                <img src={licensePreview} alt="Preview" className="mt-2 max-w-xs rounded border border-gray-600" />
                                            )}
                                        </div>
                                    )}

                                    {errors.license_file && <p className="mt-1 text-sm text-red-400">{errors.license_file}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-4 border-t border-gray-700 pt-6">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="rounded-lg border border-gray-600 bg-gray-700 px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Application'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
