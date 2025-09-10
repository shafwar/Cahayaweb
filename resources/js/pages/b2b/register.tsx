import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Building2, CheckCircle, Eye, EyeOff, FileText, Lock, Mail, Phone, Upload, User } from 'lucide-react';
import { useState } from 'react';

export default function B2BRegister() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        company_name: '',
        company_address: '',
        business_license_number: '',
        tax_id_number: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        license_file: null as File | null,
        user_type: 'b2b',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setData('license_file', file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await post(route('b2b.register'), {
                onSuccess: () => {
                    // Success handling will be done by Inertia
                },
                onError: () => {
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            });
        } catch (error) {
            setIsLoading(false);
        }
    };

    const isFormValid =
        data.name &&
        data.email &&
        data.password &&
        data.password_confirmation &&
        data.company_name &&
        data.contact_person &&
        data.contact_phone &&
        data.business_license_number &&
        selectedFile;

    return (
        <>
            <Head title="B2B Registration - Cahaya Anbiya" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid w-full max-w-4xl grid-cols-1 items-center gap-8 lg:grid-cols-2"
                >
                    {/* Left Side - Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="space-y-6 text-white">
                            {/* Logo */}
                            <div className="mb-8 flex items-center gap-3">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Cahaya Anbiya</h1>
                                    <p className="text-gray-400">Travel & Tourism</p>
                                </div>
                            </div>

                            {/* Hero Content */}
                            <div className="space-y-6">
                                <h2 className="text-4xl leading-tight font-bold">
                                    Join Our <span className="text-yellow-400">B2B Network</span>
                                </h2>
                                <p className="text-xl leading-relaxed text-gray-300">
                                    Register your travel agency or business to access exclusive corporate rates, manage bookings, and grow your
                                    business with our premium travel packages.
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="space-y-4 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Exclusive Business Rates</h3>
                                        <p className="text-sm text-gray-400">Special pricing for verified business partners</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                                        <FileText className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Easy Booking Management</h3>
                                        <p className="text-sm text-gray-400">Manage multiple client bookings efficiently</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                                        <User className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Dedicated Support</h3>
                                        <p className="text-sm text-gray-400">Priority support for business partners</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Registration Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto w-full max-w-md"
                    >
                        {/* Mobile Logo */}
                        <div className="mb-8 text-center lg:hidden">
                            <div className="mb-4 flex items-center justify-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">Cahaya Anbiya</h1>
                                    <p className="text-sm text-gray-400">B2B Registration</p>
                                </div>
                            </div>
                        </div>

                        {/* Registration Form Card */}
                        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-2xl font-bold text-white">Business Registration</h2>
                                <p className="text-gray-400">Create your B2B account</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Account Information */}
                                <div className="space-y-4">
                                    <h3 className="border-b border-gray-600 pb-2 text-lg font-semibold text-white">Account Information</h3>

                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full rounded-xl border bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                    errors.name ? 'border-red-500' : 'border-gray-600'
                                                }`}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                        {errors.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-2 text-sm text-red-400"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.name}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                            Business Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full rounded-xl border bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                    errors.email ? 'border-red-500' : 'border-gray-600'
                                                }`}
                                                placeholder="Enter your business email"
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-2 text-sm text-red-400"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.email}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className={`w-full rounded-xl border bg-gray-700/50 py-3 pr-12 pl-10 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                        errors.password ? 'border-red-500' : 'border-gray-600'
                                                    }`}
                                                    placeholder="Create password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 text-sm text-red-400"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.password}
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className={`w-full rounded-xl border bg-gray-700/50 py-3 pr-12 pl-10 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                        errors.password_confirmation ? 'border-red-500' : 'border-gray-600'
                                                    }`}
                                                    placeholder="Confirm password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.password_confirmation && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 text-sm text-red-400"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.password_confirmation}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Company Information */}
                                <div className="space-y-4">
                                    <h3 className="border-b border-gray-600 pb-2 text-lg font-semibold text-white">Company Information</h3>

                                    <div className="space-y-2">
                                        <label htmlFor="company_name" className="block text-sm font-medium text-gray-300">
                                            Company Name
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                id="company_name"
                                                type="text"
                                                value={data.company_name}
                                                onChange={(e) => setData('company_name', e.target.value)}
                                                className={`w-full rounded-xl border bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                    errors.company_name ? 'border-red-500' : 'border-gray-600'
                                                }`}
                                                placeholder="Enter company name"
                                                required
                                            />
                                        </div>
                                        {errors.company_name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-2 text-sm text-red-400"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.company_name}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="company_address" className="block text-sm font-medium text-gray-300">
                                            Company Address
                                        </label>
                                        <textarea
                                            id="company_address"
                                            value={data.company_address}
                                            onChange={(e) => setData('company_address', e.target.value)}
                                            className={`w-full rounded-xl border bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                errors.company_address ? 'border-red-500' : 'border-gray-600'
                                            }`}
                                            placeholder="Enter complete company address"
                                            rows={3}
                                        />
                                        {errors.company_address && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-2 text-sm text-red-400"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.company_address}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="business_license_number" className="block text-sm font-medium text-gray-300">
                                                Business License Number
                                            </label>
                                            <input
                                                id="business_license_number"
                                                type="text"
                                                value={data.business_license_number}
                                                onChange={(e) => setData('business_license_number', e.target.value)}
                                                className={`w-full rounded-xl border bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                    errors.business_license_number ? 'border-red-500' : 'border-gray-600'
                                                }`}
                                                placeholder="SIUP/BPOM Number"
                                                required
                                            />
                                            {errors.business_license_number && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 text-sm text-red-400"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.business_license_number}
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="tax_id_number" className="block text-sm font-medium text-gray-300">
                                                Tax ID Number (NPWP)
                                            </label>
                                            <input
                                                id="tax_id_number"
                                                type="text"
                                                value={data.tax_id_number}
                                                onChange={(e) => setData('tax_id_number', e.target.value)}
                                                className={`w-full rounded-xl border bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                    errors.tax_id_number ? 'border-red-500' : 'border-gray-600'
                                                }`}
                                                placeholder="NPWP Number"
                                            />
                                            {errors.tax_id_number && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 text-sm text-red-400"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.tax_id_number}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h3 className="border-b border-gray-600 pb-2 text-lg font-semibold text-white">Contact Information</h3>

                                    <div className="space-y-2">
                                        <label htmlFor="contact_person" className="block text-sm font-medium text-gray-300">
                                            Contact Person
                                        </label>
                                        <div className="relative">
                                            <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                id="contact_person"
                                                type="text"
                                                value={data.contact_person}
                                                onChange={(e) => setData('contact_person', e.target.value)}
                                                className={`w-full rounded-xl border bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                    errors.contact_person ? 'border-red-500' : 'border-gray-600'
                                                }`}
                                                placeholder="Primary contact person"
                                                required
                                            />
                                        </div>
                                        {errors.contact_person && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-2 text-sm text-red-400"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.contact_person}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-300">
                                                Contact Phone
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    id="contact_phone"
                                                    type="tel"
                                                    value={data.contact_phone}
                                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                                    className={`w-full rounded-xl border bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                        errors.contact_phone ? 'border-red-500' : 'border-gray-600'
                                                    }`}
                                                    placeholder="+62-812-3456-7890"
                                                    required
                                                />
                                            </div>
                                            {errors.contact_phone && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 text-sm text-red-400"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.contact_phone}
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-300">
                                                Contact Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    id="contact_email"
                                                    type="email"
                                                    value={data.contact_email}
                                                    onChange={(e) => setData('contact_email', e.target.value)}
                                                    className={`w-full rounded-xl border bg-gray-700/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none ${
                                                        errors.contact_email ? 'border-red-500' : 'border-gray-600'
                                                    }`}
                                                    placeholder="contact@company.com"
                                                    required
                                                />
                                            </div>
                                            {errors.contact_email && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 text-sm text-red-400"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.contact_email}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* License Upload */}
                                <div className="space-y-4">
                                    <h3 className="border-b border-gray-600 pb-2 text-lg font-semibold text-white">Business License</h3>

                                    <div className="space-y-2">
                                        <label htmlFor="license_file" className="block text-sm font-medium text-gray-300">
                                            Upload Business License
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="license_file"
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                required
                                            />
                                            <label
                                                htmlFor="license_file"
                                                className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-all duration-200 hover:bg-gray-700/50 ${
                                                    selectedFile ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-yellow-500'
                                                }`}
                                            >
                                                <Upload className={`h-8 w-8 ${selectedFile ? 'text-green-400' : 'text-gray-400'}`} />
                                                <div className="text-center">
                                                    {selectedFile ? (
                                                        <div>
                                                            <p className="font-medium text-green-400">{selectedFile.name}</p>
                                                            <p className="text-sm text-gray-400">File selected successfully</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="font-medium text-gray-300">Click to upload license</p>
                                                            <p className="text-sm text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                        {errors.license_file && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-2 text-sm text-red-400"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.license_file}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={processing || isLoading || !isFormValid}
                                    whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                                    whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 ${
                                        isFormValid
                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl'
                                            : 'cursor-not-allowed bg-gray-600 text-gray-400'
                                    } ${processing || isLoading ? 'opacity-75' : ''}`}
                                >
                                    {processing || isLoading ? (
                                        <>
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create B2B Account
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Links */}
                            <div className="mt-8 space-y-4 text-center">
                                <p className="text-sm text-gray-400">
                                    Already have a B2B account?{' '}
                                    <Link href={route('b2b.login')} className="font-medium text-yellow-400 transition-colors hover:text-yellow-300">
                                        Sign in here
                                    </Link>
                                </p>
                                <p className="text-sm text-gray-400">
                                    <Link
                                        href={route('b2b.index')}
                                        className="flex items-center justify-center gap-1 text-yellow-400 transition-colors hover:text-yellow-300"
                                    >
                                        <ArrowRight className="h-4 w-4 rotate-180" />
                                        Back to B2B Portal
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500">© 2024 Cahaya Anbiya Travel. All rights reserved.</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
