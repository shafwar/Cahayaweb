import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, Calendar, CheckCircle, Edit3, Eye, EyeOff, Lock, Mail, MapPin, Phone, Save, Shield, User, X } from 'lucide-react';
import { useState } from 'react';

interface B2BVerification {
    id: number;
    company_name: string;
    status: string;
    contact_person: string;
    contact_email: string;
    contact_phone: string;
    business_license?: string;
    tax_id?: string;
    address?: string;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    b2bVerification?: B2BVerification;
}

interface ProfileProps {
    user: User;
}

export default function B2BProfile({ user }: ProfileProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'company'>('profile');

    // Profile form
    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Company form
    const companyForm = useForm({
        company_name: user.b2bVerification?.company_name || '',
        contact_person: user.b2bVerification?.contact_person || '',
        contact_email: user.b2bVerification?.contact_email || '',
        contact_phone: user.b2bVerification?.contact_phone || '',
        business_license: user.b2bVerification?.business_license || '',
        tax_id: user.b2bVerification?.tax_id || '',
        address: user.b2bVerification?.address || '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(route('b2b.profile.update'), {
            onSuccess: () => {
                // Show success message
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post(route('b2b.password.update'), {
            onSuccess: () => {
                passwordForm.reset();
                setShowPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);
            },
        });
    };

    const handleCompanySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        companyForm.post(route('b2b.company.update'), {
            onSuccess: () => {
                // Show success message
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30';
            case 'pending':
                return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
            case 'rejected':
                return 'bg-red-600/20 text-red-400 border-red-500/30';
            default:
                return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <Calendar className="h-4 w-4" />;
            case 'rejected':
                return <X className="h-4 w-4" />;
            default:
                return <Shield className="h-4 w-4" />;
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'company', label: 'Company', icon: Building2 },
    ];

    return (
        <B2BLayout>
            <Head title="B2B Profile" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-6">
                <div className="mx-auto max-w-6xl space-y-4 sm:space-y-8">
                    {/* Header */}
                    <motion.div
                        className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-r from-slate-800/90 via-slate-800/90 to-slate-700/90 p-4 shadow-2xl backdrop-blur-sm sm:rounded-2xl sm:p-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400/10 to-cyan-600/10 blur-xl"></div>

                        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg sm:rounded-2xl sm:p-4">
                                    <User className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                                </div>
                                <motion.div
                                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 sm:h-4 sm:w-4"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>

                            <div className="flex-1">
                                <motion.h1
                                    className="bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 bg-clip-text text-2xl font-bold text-transparent sm:text-4xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Profile Settings
                                </motion.h1>
                                <motion.p
                                    className="mt-1 text-sm text-slate-300 sm:mt-2 sm:text-lg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    Manage your account information and preferences
                                </motion.p>
                            </div>

                            {/* B2B Status Badge */}
                            {user.b2bVerification && (
                                <motion.div
                                    className={`flex items-center space-x-2 rounded-xl border px-4 py-3 backdrop-blur-sm sm:rounded-2xl ${getStatusColor(user.b2bVerification.status)}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    {getStatusIcon(user.b2bVerification.status)}
                                    <div className="text-right">
                                        <div className="text-sm font-bold sm:text-base">{user.b2bVerification.status || 'Unknown'}</div>
                                        <div className="text-xs opacity-75 sm:text-sm">B2B Status</div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Tabs Navigation */}
                    <motion.div
                        className="rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm sm:rounded-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex items-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 sm:px-6 sm:py-4 sm:text-base ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                                            }`}
                                        >
                                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tab Content */}
                    <motion.div
                        className="rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-2xl backdrop-blur-sm sm:rounded-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="p-4 sm:p-8">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-slate-100 sm:text-2xl">Personal Information</h2>
                                        <p className="mt-1 text-sm text-slate-300 sm:text-base">Update your personal details</p>
                                    </div>

                                    <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-6">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    Full Name
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={profileForm.data.name}
                                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                                        className="border-slate-600 bg-slate-700/50 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                                {profileForm.errors.name && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{profileForm.errors.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    Email Address
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={profileForm.data.email}
                                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                                        className="border-slate-600 bg-slate-700/50 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                                {profileForm.errors.email && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{profileForm.errors.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4">
                                            <Button
                                                type="submit"
                                                disabled={profileForm.processing}
                                                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                                            >
                                                <Save className="h-4 w-4" />
                                                <span>{profileForm.processing ? 'Saving...' : 'Save Changes'}</span>
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-slate-100 sm:text-2xl">Security Settings</h2>
                                        <p className="mt-1 text-sm text-slate-300 sm:text-base">Update your password and security preferences</p>
                                    </div>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="current_password" className="text-sm font-medium text-slate-300 sm:text-base">
                                                Current Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                                <Input
                                                    id="current_password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={passwordForm.data.current_password}
                                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                    className="border-slate-600 bg-slate-700/50 pr-10 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 hover:text-slate-300"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {passwordForm.errors.current_password && (
                                                <p className="text-xs text-red-400 sm:text-sm">{passwordForm.errors.current_password}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    New Password
                                                </Label>
                                                <div className="relative">
                                                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                                    <Input
                                                        id="password"
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        value={passwordForm.data.password}
                                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                        className="border-slate-600 bg-slate-700/50 pr-10 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                        placeholder="Enter new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 hover:text-slate-300"
                                                    >
                                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                {passwordForm.errors.password && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{passwordForm.errors.password}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    Confirm New Password
                                                </Label>
                                                <div className="relative">
                                                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                                    <Input
                                                        id="password_confirmation"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        value={passwordForm.data.password_confirmation}
                                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                        className="border-slate-600 bg-slate-700/50 pr-10 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 hover:text-slate-300"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                {passwordForm.errors.password_confirmation && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{passwordForm.errors.password_confirmation}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4">
                                            <Button
                                                type="submit"
                                                disabled={passwordForm.processing}
                                                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
                                            >
                                                <Lock className="h-4 w-4" />
                                                <span>{passwordForm.processing ? 'Updating...' : 'Update Password'}</span>
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Company Tab */}
                            {activeTab === 'company' && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-slate-100 sm:text-2xl">Company Information</h2>
                                        <p className="mt-1 text-sm text-slate-300 sm:text-base">
                                            Manage your business details and verification status
                                        </p>
                                    </div>

                                    <form onSubmit={handleCompanySubmit} className="space-y-4 sm:space-y-6">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="company_name" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    Company Name
                                                </Label>
                                                <div className="relative">
                                                    <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                                    <Input
                                                        id="company_name"
                                                        type="text"
                                                        value={companyForm.data.company_name}
                                                        onChange={(e) => companyForm.setData('company_name', e.target.value)}
                                                        className="border-slate-600 bg-slate-700/50 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                        placeholder="Enter company name"
                                                    />
                                                </div>
                                                {companyForm.errors.company_name && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{companyForm.errors.company_name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="contact_person" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    Contact Person
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                                    <Input
                                                        id="contact_person"
                                                        type="text"
                                                        value={companyForm.data.contact_person}
                                                        onChange={(e) => companyForm.setData('contact_person', e.target.value)}
                                                        className="border-slate-600 bg-slate-700/50 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                        placeholder="Enter contact person name"
                                                    />
                                                </div>
                                                {companyForm.errors.contact_person && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{companyForm.errors.contact_person}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="contact_email" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    Contact Email
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                                    <Input
                                                        id="contact_email"
                                                        type="email"
                                                        value={companyForm.data.contact_email}
                                                        onChange={(e) => companyForm.setData('contact_email', e.target.value)}
                                                        className="border-slate-600 bg-slate-700/50 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                        placeholder="Enter contact email"
                                                    />
                                                </div>
                                                {companyForm.errors.contact_email && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{companyForm.errors.contact_email}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="contact_phone" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    Contact Phone
                                                </Label>
                                                <div className="relative">
                                                    <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                                    <Input
                                                        id="contact_phone"
                                                        type="tel"
                                                        value={companyForm.data.contact_phone}
                                                        onChange={(e) => companyForm.setData('contact_phone', e.target.value)}
                                                        className="border-slate-600 bg-slate-700/50 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                        placeholder="Enter contact phone"
                                                    />
                                                </div>
                                                {companyForm.errors.contact_phone && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{companyForm.errors.contact_phone}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="business_license" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    Business License
                                                </Label>
                                                <Input
                                                    id="business_license"
                                                    type="text"
                                                    value={companyForm.data.business_license}
                                                    onChange={(e) => companyForm.setData('business_license', e.target.value)}
                                                    className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                    placeholder="Enter business license number"
                                                />
                                                {companyForm.errors.business_license && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{companyForm.errors.business_license}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="tax_id" className="text-sm font-medium text-slate-300 sm:text-base">
                                                    Tax ID
                                                </Label>
                                                <Input
                                                    id="tax_id"
                                                    type="text"
                                                    value={companyForm.data.tax_id}
                                                    onChange={(e) => companyForm.setData('tax_id', e.target.value)}
                                                    className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                    placeholder="Enter tax ID"
                                                />
                                                {companyForm.errors.tax_id && (
                                                    <p className="text-xs text-red-400 sm:text-sm">{companyForm.errors.tax_id}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-sm font-medium text-slate-300 sm:text-base">
                                                Company Address
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                                <Textarea
                                                    id="address"
                                                    value={companyForm.data.address}
                                                    onChange={(e) => companyForm.setData('address', e.target.value)}
                                                    className="border-slate-600 bg-slate-700/50 pl-10 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                                                    placeholder="Enter company address"
                                                    rows={3}
                                                />
                                            </div>
                                            {companyForm.errors.address && (
                                                <p className="text-xs text-red-400 sm:text-sm">{companyForm.errors.address}</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4">
                                            <Button
                                                type="submit"
                                                disabled={companyForm.processing}
                                                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                                <span>{companyForm.processing ? 'Updating...' : 'Update Company Info'}</span>
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </B2BLayout>
    );
}
