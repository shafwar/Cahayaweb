import AdminLayout from '@/layouts/admin-layout';
import { motion } from 'framer-motion';
import { Bell, Database, Globe, Lock, Mail, Save, Shield, Smartphone, Users } from 'lucide-react';
import { useState } from 'react';

interface SettingsProps {
    settings: {
        site_name: string;
        contact_email: string;
        maintenance_mode: boolean;
    };
}

export default function Settings({ settings }: SettingsProps) {
    const [formData, setFormData] = useState({
        site_name: settings.site_name,
        contact_email: settings.contact_email,
        maintenance_mode: settings.maintenance_mode,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        // Here you would typically make an API call to save settings
        console.log('Saving settings:', formData);
    };

    const settingSections = [
        {
            title: 'General Settings',
            icon: Globe,
            color: 'from-blue-500 to-blue-600',
            settings: [
                {
                    label: 'Site Name',
                    name: 'site_name',
                    type: 'text',
                    value: formData.site_name,
                    placeholder: 'Enter site name',
                    description: 'The name of your travel agency website',
                },
                {
                    label: 'Contact Email',
                    name: 'contact_email',
                    type: 'email',
                    value: formData.contact_email,
                    placeholder: 'admin@cahayaanbiya.com',
                    description: 'Primary contact email for customer inquiries',
                },
            ]
        },
        {
            title: 'System Settings',
            icon: Database,
            color: 'from-purple-500 to-purple-600',
            settings: [
                {
                    label: 'Maintenance Mode',
                    name: 'maintenance_mode',
                    type: 'toggle',
                    value: formData.maintenance_mode,
                    description: 'Enable maintenance mode to temporarily disable the website',
                },
            ]
        },
        {
            title: 'Security Settings',
            icon: Shield,
            color: 'from-red-500 to-red-600',
            settings: [
                {
                    label: 'Two-Factor Authentication',
                    name: '2fa_enabled',
                    type: 'toggle',
                    value: false,
                    description: 'Require 2FA for admin accounts',
                },
                {
                    label: 'Session Timeout',
                    name: 'session_timeout',
                    type: 'select',
                    value: '30',
                    options: [
                        { value: '15', label: '15 minutes' },
                        { value: '30', label: '30 minutes' },
                        { value: '60', label: '1 hour' },
                        { value: '120', label: '2 hours' },
                    ],
                    description: 'Auto-logout inactive sessions',
                },
            ]
        },
        {
            title: 'Notification Settings',
            icon: Bell,
            color: 'from-green-500 to-green-600',
            settings: [
                {
                    label: 'Email Notifications',
                    name: 'email_notifications',
                    type: 'toggle',
                    value: true,
                    description: 'Receive email notifications for new orders',
                },
                {
                    label: 'SMS Notifications',
                    name: 'sms_notifications',
                    type: 'toggle',
                    value: false,
                    description: 'Receive SMS notifications for urgent matters',
                },
            ]
        },
    ];

    return (
        <AdminLayout title="Settings">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                            System Settings
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Configure your travel agency website settings
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="h-4 w-4" />
                        <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </motion.div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {settingSections.map((section, sectionIndex) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + sectionIndex * 0.1 }}
                        className="rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6"
                    >
                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-r ${section.color} shadow-lg`}>
                                <section.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-white">{section.title}</h3>
                                <p className="text-sm text-gray-400">Configure {section.title.toLowerCase()}</p>
                            </div>
                        </div>

                        {/* Settings List */}
                        <div className="space-y-4 sm:space-y-6">
                            {section.settings.map((setting, settingIndex) => (
                                <motion.div
                                    key={setting.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + sectionIndex * 0.1 + settingIndex * 0.05 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm sm:text-base font-medium text-white">
                                            {setting.label}
                                        </label>
                                        {setting.type === 'toggle' && (
                                            <button
                                                onClick={() => handleInputChange(setting.name, !setting.value)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    setting.value ? 'bg-blue-600' : 'bg-gray-600'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        setting.value ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {setting.type === 'text' || setting.type === 'email' ? (
                                        <input
                                            type={setting.type}
                                            value={setting.value as string}
                                            onChange={(e) => handleInputChange(setting.name, e.target.value)}
                                            placeholder={setting.placeholder}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                        />
                                    ) : setting.type === 'select' ? (
                                        <select
                                            value={setting.value as string}
                                            onChange={(e) => handleInputChange(setting.name, e.target.value)}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        >
                                            {setting.options?.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : null}

                                    <p className="text-xs sm:text-sm text-gray-400">{setting.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Additional Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 sm:mt-8 rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6"
            >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                        <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white">Advanced Settings</h3>
                        <p className="text-sm text-gray-400">System configuration and security</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Database Backup</label>
                        <button className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600 hover:text-white">
                            Create Backup
                        </button>
                        <p className="text-xs text-gray-400">Last backup: 2 days ago</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Cache Management</label>
                        <button className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600 hover:text-white">
                            Clear Cache
                        </button>
                        <p className="text-xs text-gray-400">Cache size: 45.2 MB</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">System Logs</label>
                        <button className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600 hover:text-white">
                            View Logs
                        </button>
                        <p className="text-xs text-gray-400">Log level: Info</p>
                    </div>
                </div>
            </motion.div>

            {/* Save Button - Mobile */}
            <div className="lg:hidden mt-6 sm:mt-8">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving Changes...' : 'Save All Changes'}
                </button>
            </div>
        </AdminLayout>
    );
}
