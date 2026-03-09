import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import B2BLayout from '@/layouts/b2b-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Briefcase, Building2, Check, FileText, Info, Mail, MapPin, Phone, RefreshCw, Upload, User, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface RejectedVerification {
    company_name: string;
    admin_notes?: string;
    rejected_at?: string;
}

interface Props {
    isGuest?: boolean;
    rejectedVerification?: RejectedVerification | null;
}

// Comprehensive list of countries with their country codes
const countries = [
    { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
    { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
    { name: 'Singapore', code: '+65', flag: '🇸🇬' },
    { name: 'Thailand', code: '+66', flag: '🇹🇭' },
    { name: 'Philippines', code: '+63', flag: '🇵🇭' },
    { name: 'Vietnam', code: '+84', flag: '🇻🇳' },
    { name: 'Brunei', code: '+673', flag: '🇧🇳' },
    { name: 'Cambodia', code: '+855', flag: '🇰🇭' },
    { name: 'Myanmar', code: '+95', flag: '🇲🇲' },
    { name: 'Laos', code: '+856', flag: '🇱🇦' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
    { name: 'China', code: '+86', flag: '🇨🇳' },
    { name: 'Japan', code: '+81', flag: '🇯🇵' },
    { name: 'South Korea', code: '+82', flag: '🇰🇷' },
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
    { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
    { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
    { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
    { name: 'Qatar', code: '+974', flag: '🇶🇦' },
    { name: 'Kuwait', code: '+965', flag: '🇰🇼' },
    { name: 'Oman', code: '+968', flag: '🇴🇲' },
    { name: 'Bahrain', code: '+973', flag: '🇧🇭' },
    { name: 'Turkey', code: '+90', flag: '🇹🇷' },
    { name: 'Egypt', code: '+20', flag: '🇪🇬' },
    { name: 'South Africa', code: '+27', flag: '🇿🇦' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'France', code: '+33', flag: '🇫🇷' },
    { name: 'Italy', code: '+39', flag: '🇮🇹' },
    { name: 'Spain', code: '+34', flag: '🇪🇸' },
    { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
    { name: 'Belgium', code: '+32', flag: '🇧🇪' },
    { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
    { name: 'Austria', code: '+43', flag: '🇦🇹' },
    { name: 'Sweden', code: '+46', flag: '🇸🇪' },
    { name: 'Norway', code: '+47', flag: '🇳🇴' },
    { name: 'Denmark', code: '+45', flag: '🇩🇰' },
    { name: 'Finland', code: '+358', flag: '🇫🇮' },
    { name: 'Poland', code: '+48', flag: '🇵🇱' },
    { name: 'Russia', code: '+7', flag: '🇷🇺' },
    { name: 'Brazil', code: '+55', flag: '🇧🇷' },
    { name: 'Argentina', code: '+54', flag: '🇦🇷' },
    { name: 'Mexico', code: '+52', flag: '🇲🇽' },
    { name: 'Chile', code: '+56', flag: '🇨🇱' },
    { name: 'Colombia', code: '+57', flag: '🇨🇴' },
    { name: 'Peru', code: '+51', flag: '🇵🇪' },
    { name: 'Venezuela', code: '+58', flag: '🇻🇪' },
    { name: 'Israel', code: '+972', flag: '🇮🇱' },
    { name: 'Jordan', code: '+962', flag: '🇯🇴' },
    { name: 'Lebanon', code: '+961', flag: '🇱🇧' },
    { name: 'Iraq', code: '+964', flag: '🇮🇶' },
    { name: 'Iran', code: '+98', flag: '🇮🇷' },
    { name: 'Afghanistan', code: '+93', flag: '🇦🇫' },
    { name: 'Nepal', code: '+977', flag: '🇳🇵' },
    { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
    { name: 'Maldives', code: '+960', flag: '🇲🇻' },
    { name: 'Mongolia', code: '+976', flag: '🇲🇳' },
    { name: 'Kazakhstan', code: '+7', flag: '🇰🇿' },
    { name: 'Uzbekistan', code: '+998', flag: '🇺🇿' },
    { name: 'Kyrgyzstan', code: '+996', flag: '🇰🇬' },
    { name: 'Tajikistan', code: '+992', flag: '🇹🇯' },
    { name: 'Turkmenistan', code: '+993', flag: '🇹🇲' },
    { name: 'Azerbaijan', code: '+994', flag: '🇦🇿' },
    { name: 'Georgia', code: '+995', flag: '🇬🇪' },
    { name: 'Armenia', code: '+374', flag: '🇦🇲' },
    { name: 'Ukraine', code: '+380', flag: '🇺🇦' },
    { name: 'Belarus', code: '+375', flag: '🇧🇾' },
    { name: 'Romania', code: '+40', flag: '🇷🇴' },
    { name: 'Bulgaria', code: '+359', flag: '🇧🇬' },
    { name: 'Greece', code: '+30', flag: '🇬🇷' },
    { name: 'Portugal', code: '+351', flag: '🇵🇹' },
    { name: 'Ireland', code: '+353', flag: '🇮🇪' },
    { name: 'Iceland', code: '+354', flag: '🇮🇸' },
    { name: 'Luxembourg', code: '+352', flag: '🇱🇺' },
    { name: 'Monaco', code: '+377', flag: '🇲🇨' },
    { name: 'Liechtenstein', code: '+423', flag: '🇱🇮' },
    { name: 'Malta', code: '+356', flag: '🇲🇹' },
    { name: 'Cyprus', code: '+357', flag: '🇨🇾' },
    { name: 'Croatia', code: '+385', flag: '🇭🇷' },
    { name: 'Serbia', code: '+381', flag: '🇷🇸' },
    { name: 'Slovenia', code: '+386', flag: '🇸🇮' },
    { name: 'Slovakia', code: '+421', flag: '🇸🇰' },
    { name: 'Czech Republic', code: '+420', flag: '🇨🇿' },
    { name: 'Hungary', code: '+36', flag: '🇭🇺' },
    { name: 'Estonia', code: '+372', flag: '🇪🇪' },
    { name: 'Latvia', code: '+371', flag: '🇱🇻' },
    { name: 'Lithuania', code: '+370', flag: '🇱🇹' },
    { name: 'Moldova', code: '+373', flag: '🇲🇩' },
    { name: 'Albania', code: '+355', flag: '🇦🇱' },
    { name: 'Macedonia', code: '+389', flag: '🇲🇰' },
    { name: 'Bosnia and Herzegovina', code: '+387', flag: '🇧🇦' },
    { name: 'Montenegro', code: '+382', flag: '🇲🇪' },
    { name: 'Kosovo', code: '+383', flag: '🇽🇰' },
].sort((a, b) => a.name.localeCompare(b.name));

// Extract country codes for phone dropdown
const countryCodes = countries
    .map((c) => c.code)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => {
        const numA = parseInt(a.replace('+', ''));
        const numB = parseInt(b.replace('+', ''));
        return numA - numB;
    });

const businessTypes = [
    { value: 'PT', label: 'PT - Limited Liability Company' },
    { value: 'CV', label: 'CV - Limited Partnership' },
    { value: 'UD', label: 'UD - Trading Company' },
    { value: 'Firma', label: 'Firma - General Partnership' },
    { value: 'Koperasi', label: 'Cooperative' },
    { value: 'Perusahaan Perorangan', label: 'Sole Proprietorship' },
    { value: 'Yayasan', label: 'Foundation (Nonprofit)' },
    { value: 'Perseroan Terbuka', label: 'Public Limited Company (Tbk/PLC)' },
    { value: 'Perusahaan Daerah', label: 'Regional-Owned Enterprise (BUMD)' },
    { value: 'PT PMA', label: 'Foreign Investment Company (PT PMA)' },
    { value: 'LLC', label: 'Limited Liability Company (LLC)' },
    { value: 'Corporation', label: 'Corporation (Corp)' },
    { value: 'Private Limited', label: 'Private Limited Company (Ltd)' },
    { value: 'Public Limited', label: 'Public Limited Company (PLC)' },
    { value: 'Limited Partnership', label: 'Limited Partnership (LP)' },
    { value: 'LLP', label: 'Limited Liability Partnership (LLP)' },
    { value: 'General Partnership', label: 'General Partnership' },
    { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
    { value: 'Holding Company', label: 'Holding Company' },
    { value: 'Subsidiary', label: 'Subsidiary Company' },
    { value: 'Joint Venture', label: 'Joint Venture (JV)' },
    { value: 'Branch Office', label: 'Branch Office' },
    { value: 'Representative Office', label: 'Representative Office' },
    { value: 'Franchise', label: 'Franchise' },
    { value: 'Nonprofit', label: 'Nonprofit Organization' },
    { value: 'Association', label: 'Association' },
    { value: 'Charity', label: 'Charity' },
    { value: 'Trust', label: 'Trust' },
    { value: 'Cooperative', label: 'Cooperative' },
    { value: 'Government', label: 'Government Agency' },
    { value: 'State-Owned', label: 'State-Owned Enterprise (SOE)' },
    { value: 'Educational', label: 'Educational Institution' },
    { value: 'Religious', label: 'Religious Organization' },
    { value: 'Professional Service', label: 'Professional Services Firm' },
    { value: 'Consulting', label: 'Consulting Firm' },
    { value: 'Travel Agency', label: 'Travel Agency' },
    { value: 'Tour Operator', label: 'Tour Operator' },
    { value: 'Other', label: 'Other - Please specify below' },
];

export default function RegisterAgent({ isGuest, rejectedVerification }: Props) {
    const pageProps = usePage().props as {
        auth: { user: { id: number; name: string; email: string } | null };
        errors?: Record<string, string>;
    };
    const { auth } = pageProps;
    const isUserGuest = !auth.user || isGuest;
    const [showRejectionNotice, setShowRejectionNotice] = useState(!!rejectedVerification);
    const { data, setData, post, processing, errors, reset } = useForm({
        company_name: '',
        company_email: '',
        company_phone: '',
        company_phone_country_code: '+62',
        company_address: '',
        company_city: '',
        company_province: '',
        company_postal_code: '',
        company_country: 'Indonesia',
        business_license_number: '',
        tax_id_number: '',
        business_type: '',
        business_type_other: '',
        years_in_business: '',
        business_description: '',
        contact_person_name: '',
        contact_person_position: '',
        contact_person_phone: '',
        contact_person_phone_country_code: '+62',
        contact_person_email: '',
        business_license_file: null as File | null,
        tax_certificate_file: null as File | null,
        company_profile_file: null as File | null,
    });

    const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
    const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleFileChange = (field: string, file: File | null) => {
        // Clear previous error
        setFileErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });

        if (file) {
            // Validate file size (5MB max)
            if (file.size > MAX_FILE_SIZE) {
                const errorMsg = `File size (${formatFileSize(file.size)}) exceeds the maximum allowed size of 5MB. Please compress or use a smaller file.`;
                setFileErrors((prev) => ({ ...prev, [field]: errorMsg }));
                return;
            }

            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                const errorMsg = 'Invalid file type. Please upload PDF, JPG, or PNG files only.';
                setFileErrors((prev) => ({ ...prev, [field]: errorMsg }));
                return;
            }

            setData(field as any, file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setFilePreviews((prev) => ({ ...prev, [field]: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        } else {
            setData(field as any, null);
            setFilePreviews((prev) => {
                const newPreviews = { ...prev };
                delete newPreviews[field];
                return newPreviews;
            });
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        // Validate file sizes before submission
        const fileFields = ['business_license_file', 'tax_certificate_file', 'company_profile_file'];
        let hasFileError = false;
        const newFileErrors: Record<string, string> = {};

        fileFields.forEach((field) => {
            const file = (data as any)[field];
            if (file && file.size > MAX_FILE_SIZE) {
                newFileErrors[field] =
                    `File size (${formatFileSize(file.size)}) exceeds the maximum allowed size of 5MB. Please compress or use a smaller file.`;
                hasFileError = true;
            }
        });

        if (hasFileError) {
            setFileErrors(newFileErrors);
            // Scroll to first error
            const firstErrorField = Object.keys(newFileErrors)[0];
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Refresh CSRF token before submission to prevent 419 errors
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        if (csrfToken) {
            // Update axios default header if available
            if (typeof window !== 'undefined' && (window as any).axios) {
                (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
            }
        }

        // Merge country code with phone number for submission (avoid async setState so payload is correct)
        const companyPhone = data.company_phone.trim();
        const contactPhone = data.contact_person_phone.trim();
        const companyPhoneWithCode = companyPhone ? `${data.company_phone_country_code} ${companyPhone}` : '';
        const contactPhoneWithCode = contactPhone ? `${data.contact_person_phone_country_code} ${contactPhone}` : '';

        // Build FormData explicitly so all 3 document fields and merged phones are always sent
        const formData = new FormData();
        formData.append('_token', csrfToken ?? '');

        const scalarKeys = [
            'company_name',
            'company_email',
            'company_address',
            'company_city',
            'company_province',
            'company_postal_code',
            'company_country',
            'business_license_number',
            'tax_id_number',
            'business_type',
            'business_type_other',
            'years_in_business',
            'business_description',
            'contact_person_name',
            'contact_person_position',
            'contact_person_email',
        ];
        scalarKeys.forEach((key) => {
            const v = (data as Record<string, unknown>)[key];
            if (v === undefined || v === null) return;
            if (typeof v === 'string') formData.append(key, v);
            else if (typeof v === 'number') formData.append(key, String(v));
        });
        formData.append('company_phone', companyPhoneWithCode);
        formData.append('contact_person_phone', contactPhoneWithCode);

        fileFields.forEach((field) => {
            const file = (data as Record<string, unknown>)[field];
            if (file instanceof File) {
                formData.append(field, file);
            }
        });

        const submitUrl = '/b2b/register';

        router.post(submitUrl, formData, {
            preserveState: false,
            preserveScroll: false,
            forceFormData: true,
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                const errorMessage = (errors?.message as string) || (typeof errors === 'string' ? errors : '') || '';
                const errorString = JSON.stringify(errors || {});

                if (
                    errorMessage.includes('413') ||
                    errorMessage.includes('Content Too Large') ||
                    errorMessage.includes('POST Content-Length') ||
                    errorString.includes('413') ||
                    errorString.includes('Content Too Large')
                ) {
                    const totalSize = fileFields.reduce((total, field) => {
                        const f = (data as Record<string, unknown>)[field];
                        return total + (f && f instanceof File ? f.size : 0);
                    }, 0);
                    alert(
                        `File Upload Size Limit Exceeded\n\n` +
                            `The total size of your uploaded files (${formatFileSize(totalSize)}) exceeds the server's maximum limit.\n\n` +
                            `Please ensure:\n` +
                            `• Each file is no larger than 5MB\n` +
                            `• Total combined size does not exceed 15MB\n\n` +
                            `Tip: Compress PDF files or convert images to a smaller format before uploading.`,
                    );
                    return;
                }
                if (errorMessage.includes('419') || errorMessage.includes('expired') || errorMessage.includes('PAGE EXPIRED')) {
                    alert('Your session has expired. Please refresh the page and try again.');
                    window.location.reload();
                }
            },
            onSuccess: () => {
                reset();
                setFilePreviews({});
                setFileErrors({});
            },
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <B2BLayout>
            <Head title="B2B Agent Registration - Cahaya Anbiya" />

            <div className="bg-section-photos-home min-h-screen px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                {/* Background Effects */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-20 right-1/4 h-[480px] w-[560px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(45,74,111,0.08),transparent_60%)] blur-3xl" />
                    <div className="absolute -bottom-20 left-1/4 h-[420px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.06),transparent_60%)] blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-5xl">
                    {/* Header Section - ENHANCED */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6 inline-block"
                        >
                            <div className="inline-flex items-center gap-3 rounded-full border border-[#ff5200]/20 bg-[#ff5200]/10 px-6 py-3">
                                <Building2 className="h-5 w-5 text-[#ff5200]" />
                                <span className="text-sm font-bold tracking-wider text-[#ff5200] uppercase">B2B Partnership</span>
                            </div>
                        </motion.div>

                        <h1
                            className="mb-4 text-4xl font-black tracking-tight text-[#1e3a5f] sm:text-5xl lg:text-6xl"
                            style={{
                                fontFamily: 'Playfair Display, serif',
                                letterSpacing: '-0.03em',
                                lineHeight: '1.05',
                                textShadow: '0 2px 12px rgba(30,58,95,0.08)',
                            }}
                        >
                            <span className="bg-gradient-to-r from-[#1e3a5f] via-[#2d4a6f] to-[#ff5200] bg-clip-text text-transparent">Agent</span>{' '}
                            <span className="text-[#1e3a5f]">Registration</span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#475569] sm:text-xl">
                            Join our network of trusted travel agents and unlock exclusive B2B portal features
                        </p>

                        {/* Guest Info */}
                        {isUserGuest && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="mx-auto mt-8 max-w-3xl"
                            >
                                <div className="rounded-xl border border-[#2d4a6f]/20 bg-[#eef6ff] p-6 shadow-md">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#2d4a6f]/15">
                                            <Info className="h-5 w-5 text-[#2d4a6f]" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="mb-2 text-base font-bold text-[#2d4a6f] sm:text-lg">No Account Required to Start</h3>
                                            <p className="text-sm leading-relaxed text-[#475569] sm:text-base">
                                                Fill out this form without logging in. After submission, you'll create an account to complete your
                                                registration and access the B2B portal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Rejection Notice - Show first if application was rejected */}
                        {showRejectionNotice && rejectedVerification && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mx-auto mt-8 max-w-3xl"
                            >
                                <div className="rounded-xl border-2 border-red-500/25 bg-red-50 p-6 shadow-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 ring-4 ring-red-100/50">
                                            <AlertCircle className="h-6 w-6 text-red-500" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="mb-3 text-xl font-bold text-red-700 sm:text-2xl">Application Rejected</h3>
                                            <p className="mb-4 text-sm text-[#475569] sm:text-base">
                                                Your previous application for{' '}
                                                <span className="font-semibold text-[#1e3a5f]">{rejectedVerification.company_name}</span> has been
                                                rejected.
                                                {rejectedVerification.rejected_at && (
                                                    <span className="ml-2 text-[#64748b]">({rejectedVerification.rejected_at})</span>
                                                )}
                                            </p>

                                            {rejectedVerification.admin_notes && (
                                                <div className="mb-4 max-h-[300px] overflow-y-auto rounded-lg border border-red-200 bg-red-50/50 p-4">
                                                    <p className="mb-3 text-sm font-semibold text-red-600">Reason for Rejection:</p>
                                                    <div className="break-words whitespace-pre-wrap">
                                                        <p className="text-base leading-relaxed text-[#334155]">{rejectedVerification.admin_notes}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-6">
                                                <Button
                                                    onClick={() => setShowRejectionNotice(false)}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ff5200] to-[#ff6b35] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
                                                >
                                                    <RefreshCw className="h-5 w-5" />
                                                    Continue to Application Form
                                                </Button>
                                            </div>
                                            <p className="mt-4 text-xs text-[#64748b]">
                                                Please review the feedback above and fill out the form below with the necessary corrections.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Logged In User Info - Only show if not showing rejection notice */}
                        {!isUserGuest && !showRejectionNotice && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="mx-auto mt-8 max-w-3xl"
                            >
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-md">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                                            <Check className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="mb-2 text-base font-bold text-emerald-700 sm:text-lg">You Are Logged In</h3>
                                            <p className="text-sm leading-relaxed text-[#475569] sm:text-base">
                                                You are already logged in. Please fill out the form below and submit your application to complete your
                                                B2B registration.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Only show form if rejection notice is dismissed or not present */}
                    {!showRejectionNotice && (
                        <motion.form onSubmit={submit} variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                            {/* Global error from redirect (e.g. save failure) or form submit */}
                            {(pageProps.errors?.message || (errors as any)?.message) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl border-2 border-amber-300/40 bg-amber-50 p-6 shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 ring-4 ring-amber-100/50">
                                            <AlertCircle className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-2 text-lg font-bold text-amber-700">Submission issue</h3>
                                            <p className="text-sm leading-relaxed text-[#475569]">
                                                {pageProps.errors?.message || (errors as any)?.message}
                                            </p>
                                            <p className="mt-2 text-xs text-[#64748b]">
                                                Please check your data and try again. If the problem persists, contact support.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {/* Global File Size Error Alert */}
                            {(errors as any)?.file_size && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl border-2 border-red-200 bg-red-50 p-6 shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 ring-4 ring-red-100/50">
                                            <AlertCircle className="h-6 w-6 text-red-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-2 text-lg font-bold text-red-700">File Upload Size Limit Exceeded</h3>
                                            <p className="text-sm leading-relaxed text-[#475569]">{(errors as any).file_size}</p>
                                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50/50 p-4">
                                                <p className="mb-2 text-sm font-semibold text-red-600">Recommended Actions:</p>
                                                <ul className="list-inside list-disc space-y-1 text-sm text-[#475569]">
                                                    <li>Compress PDF files using online tools or PDF compression software</li>
                                                    <li>Reduce image resolution or convert to a more efficient format (WebP)</li>
                                                    <li>Split large documents into smaller files if necessary</li>
                                                    <li>Ensure each file is no larger than 5MB</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {/* Company Information Section */}
                            <motion.div variants={cardVariants}>
                                <Card className="overflow-hidden border border-[#d4af37]/25 bg-white shadow-xl">
                                    <CardHeader className="relative border-b border-[#ff5200]/15 bg-gradient-to-r from-[#ff5200]/5 via-[#ff5200]/8 to-[#ff5200]/3 px-6 py-5 sm:px-8 sm:py-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff5200]/3 to-transparent opacity-50" />
                                        <div className="relative flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff5200]/10 ring-2 ring-[#ff5200]/20">
                                                <Building2 className="h-6 w-6 text-[#ff5200]" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">Company Information</CardTitle>
                                                <CardDescription className="mt-0.5 text-sm text-[#475569] sm:text-base">
                                                    Tell us about your company
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6 sm:p-8">
                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label htmlFor="company_name" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Company Name <span className="text-[#ff5200]">*</span>
                                                </Label>
                                                <Input
                                                    id="company_name"
                                                    type="text"
                                                    value={data.company_name}
                                                    onChange={(e) => setData('company_name', e.target.value)}
                                                    className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20"
                                                    placeholder="PT Cahaya Anbiya Wisata Indonesia"
                                                    required
                                                />
                                                <p className="text-xs text-[#64748b]">
                                                    Enter your registered company name as it appears on official documents
                                                </p>
                                                <InputError message={errors.company_name} />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="business_type" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Business Type <span className="text-[#ff5200]">*</span>
                                                </Label>
                                                <Select
                                                    value={data.business_type}
                                                    onValueChange={(value) => {
                                                        setData('business_type', value);
                                                        if (value !== 'Other') {
                                                            setData('business_type_other', '');
                                                        }
                                                    }}
                                                    required
                                                >
                                                    <SelectTrigger className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20">
                                                        <SelectValue placeholder="Select your business type" />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        side="bottom"
                                                        sideOffset={4}
                                                        avoidCollisions={false}
                                                        collisionPadding={0}
                                                        position="popper"
                                                        className="border border-[#c7ddff] bg-white shadow-lg"
                                                    >
                                                        {businessTypes.map((type) => (
                                                            <SelectItem
                                                                key={type.value}
                                                                value={type.value}
                                                                className="text-[#1e3a5f] hover:bg-[#ff5200]/10"
                                                            >
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-[#64748b]">
                                                    Select the legal entity type that matches your company registration. If your business type is not
                                                    listed, choose "Other" and specify it below.
                                                </p>
                                                <InputError message={errors.business_type} />

                                                {/* Custom Business Type Input - Show when "Other" is selected */}
                                                {data.business_type === 'Other' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="mt-3 space-y-2 rounded-lg border border-[#ff5200]/20 bg-[#ff5200]/5 p-4"
                                                    >
                                                        <Label
                                                            htmlFor="business_type_other"
                                                            className="mb-2 block text-sm font-semibold text-[#ff5200]"
                                                        >
                                                            Specify Your Business Type <span className="text-[#ff5200]">*</span>
                                                        </Label>
                                                        <Input
                                                            id="business_type_other"
                                                            type="text"
                                                            value={data.business_type_other}
                                                            onChange={(e) => setData('business_type_other', e.target.value)}
                                                            className="h-12 border border-[#ff5200]/30 bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20"
                                                            placeholder="e.g., Perseroan Terbuka, Perusahaan Daerah, etc."
                                                            required={data.business_type === 'Other'}
                                                        />
                                                        <p className="text-xs text-[#64748b]">
                                                            Please provide the specific legal entity type or business structure of your company
                                                        </p>
                                                        <InputError message={errors.business_type_other} />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="company_country" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                Country <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <Select
                                                value={data.company_country}
                                                onValueChange={(value) => {
                                                    setData('company_country', value);
                                                    // Auto-update phone country code based on selected country
                                                    const selectedCountry = countries.find((c) => c.name === value);
                                                    if (selectedCountry) {
                                                        setData('company_phone_country_code', selectedCountry.code);
                                                        setData('contact_person_phone_country_code', selectedCountry.code);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20">
                                                    <SelectValue placeholder="Select country" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto border border-[#c7ddff] bg-white shadow-lg">
                                                    {countries.map((country) => (
                                                        <SelectItem
                                                            key={country.name}
                                                            value={country.name}
                                                            className="text-[#1e3a5f] hover:bg-[#ff5200]/10"
                                                        >
                                                            {country.flag} {country.name} ({country.code})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-[#64748b]">
                                                Country where your company is registered. Phone country code will be automatically set based on your
                                                selection.
                                            </p>
                                            <InputError message={errors.company_country} />
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label htmlFor="company_email" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Company Email <span className="text-[#ff5200]">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
                                                    <Input
                                                        id="company_email"
                                                        type="email"
                                                        value={data.company_email}
                                                        onChange={(e) => setData('company_email', e.target.value)}
                                                        className="h-12 border border-[#c7ddff] bg-white pl-11 text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20"
                                                        placeholder="info@cahayaanbiya.com"
                                                        required
                                                    />
                                                </div>
                                                <p className="text-xs text-[#64748b]">Official company email address for business communications</p>
                                                <InputError message={errors.company_email} />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="company_phone" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Company Phone <span className="text-[#ff5200]">*</span>
                                                </Label>
                                                <div className="flex gap-2">
                                                    <Select
                                                        value={data.company_phone_country_code}
                                                        onValueChange={(value) => setData('company_phone_country_code', value)}
                                                    >
                                                        <SelectTrigger className="h-12 w-[100px] border border-[#c7ddff] bg-white text-base text-[#1e3a5f] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[300px] overflow-y-auto border border-[#c7ddff] bg-white shadow-lg">
                                                            {countryCodes.map((code) => (
                                                                <SelectItem key={code} value={code} className="text-[#1e3a5f] hover:bg-[#ff5200]/10">
                                                                    {code}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="relative flex-1">
                                                        <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
                                                        <Input
                                                            id="company_phone"
                                                            type="tel"
                                                            value={data.company_phone}
                                                            onChange={(e) => {
                                                                let value = e.target.value.replace(/[^\d\s-]/g, '');
                                                                // For Indonesia (+62), remove leading 0 if user types it
                                                                if (data.company_phone_country_code === '+62' && value.startsWith('0')) {
                                                                    value = value.substring(1);
                                                                }
                                                                setData('company_phone', value);
                                                            }}
                                                            className="h-12 border border-[#c7ddff] bg-white pl-11 text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20"
                                                            placeholder="822 9986 2211"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-[#64748b]">
                                                    Enter phone number without country code. For Indonesia: enter without leading 0 (e.g., 822 9986
                                                    2211 instead of 0822 9986 2211)
                                                </p>
                                                <InputError message={errors.company_phone} />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="company_address" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                Company Address <span className="text-[#ff5200]">*</span>
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute top-4 left-3 h-5 w-5 text-[#64748b]" />
                                                <Input
                                                    id="company_address"
                                                    type="text"
                                                    value={data.company_address}
                                                    onChange={(e) => setData('company_address', e.target.value)}
                                                    className="h-12 border border-[#c7ddff] bg-white pl-11 text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20"
                                                    placeholder="Jl. Sudirman No. 123, Gedung Plaza Indonesia"
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs text-[#64748b]">Complete street address including building name or number</p>
                                            <InputError message={errors.company_address} />
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            <div className="space-y-3">
                                                <Label htmlFor="company_city" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    City <span className="text-[#ff5200]">*</span>
                                                </Label>
                                                <Input
                                                    id="company_city"
                                                    type="text"
                                                    value={data.company_city}
                                                    onChange={(e) => setData('company_city', e.target.value)}
                                                    className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20"
                                                    placeholder="Jakarta"
                                                    required
                                                />
                                                <p className="text-xs text-[#64748b]">City where your company is located</p>
                                                <InputError message={errors.company_city} />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="company_province" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Province <span className="text-[#ff5200]">*</span>
                                                </Label>
                                                <Input
                                                    id="company_province"
                                                    type="text"
                                                    value={data.company_province}
                                                    onChange={(e) => setData('company_province', e.target.value)}
                                                    className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20"
                                                    placeholder="DKI Jakarta"
                                                    required
                                                />
                                                <p className="text-xs text-[#64748b]">Province or state name</p>
                                                <InputError message={errors.company_province} />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="company_postal_code" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Postal Code <span className="text-[#ff5200]">*</span>
                                                </Label>
                                                <Input
                                                    id="company_postal_code"
                                                    type="text"
                                                    value={data.company_postal_code}
                                                    onChange={(e) => setData('company_postal_code', e.target.value)}
                                                    className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#ff5200] focus:ring-1 focus:ring-[#ff5200]/20"
                                                    placeholder="10220"
                                                    required
                                                />
                                                <p className="text-xs text-[#64748b]">5-digit postal code (e.g., 10220)</p>
                                                <InputError message={errors.company_postal_code} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Business Information Section */}
                            <motion.div variants={cardVariants}>
                                <Card className="overflow-hidden border border-[#d4af37]/25 bg-white shadow-xl">
                                    <CardHeader className="relative border-b border-[#2d4a6f]/15 bg-gradient-to-r from-[#2d4a6f]/5 via-[#2d4a6f]/8 to-[#2d4a6f]/3 px-6 py-5 sm:px-8 sm:py-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2d4a6f]/3 to-transparent opacity-50" />
                                        <div className="relative flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2d4a6f]/10 ring-2 ring-[#2d4a6f]/20">
                                                <Briefcase className="h-6 w-6 text-[#2d4a6f]" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">Business Information</CardTitle>
                                                <CardDescription className="mt-0.5 text-sm text-[#475569] sm:text-base">
                                                    Legal and business details
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6 sm:p-8">
                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label htmlFor="business_license_number" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Business License Number
                                                </Label>
                                                <Input
                                                    id="business_license_number"
                                                    type="text"
                                                    value={data.business_license_number}
                                                    onChange={(e) => setData('business_license_number', e.target.value)}
                                                    className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#2d4a6f] focus:ring-1 focus:ring-[#2d4a6f]/20"
                                                    placeholder="SIUP-123456789-X"
                                                />
                                                <p className="text-xs text-[#64748b]">SIUP, NIB, or other business license number (if applicable)</p>
                                                <InputError message={errors.business_license_number} />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="tax_id_number" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Tax ID Number (NPWP)
                                                </Label>
                                                <Input
                                                    id="tax_id_number"
                                                    type="text"
                                                    value={data.tax_id_number}
                                                    onChange={(e) => setData('tax_id_number', e.target.value)}
                                                    className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#2d4a6f] focus:ring-1 focus:ring-[#2d4a6f]/20"
                                                    placeholder="12.345.678.9-012.345"
                                                />
                                                <p className="text-xs text-[#64748b]">Format: XX.XXX.XXX.X-XXX.XXX (15 digits with dots and dash)</p>
                                                <InputError message={errors.tax_id_number} />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="years_in_business" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                Years in Business
                                            </Label>
                                            <Input
                                                id="years_in_business"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={data.years_in_business}
                                                onChange={(e) => setData('years_in_business', e.target.value)}
                                                className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#2d4a6f] focus:ring-1 focus:ring-[#2d4a6f]/20"
                                                placeholder="5"
                                            />
                                            <p className="text-xs text-[#64748b]">Number of years your company has been operating</p>
                                            <InputError message={errors.years_in_business} />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="business_description" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                Business Description
                                            </Label>
                                            <textarea
                                                id="business_description"
                                                value={data.business_description}
                                                onChange={(e) => setData('business_description', e.target.value)}
                                                rows={5}
                                                className="w-full rounded-lg border border-[#c7ddff] bg-white px-4 py-3 text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#2d4a6f] focus:ring-1 focus:ring-[#2d4a6f]/20 focus:outline-none"
                                                placeholder="Describe your travel business, services offered, target markets, specialties, and any unique value propositions..."
                                            />
                                            <p className="text-xs text-[#64748b]">
                                                Provide a brief overview of your business operations, services, and market focus
                                            </p>
                                            <InputError message={errors.business_description} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Contact Person Section */}
                            <motion.div variants={cardVariants}>
                                <Card className="overflow-hidden border border-[#d4af37]/25 bg-white shadow-xl">
                                    <CardHeader className="relative border-b border-[#d4af37]/15 bg-gradient-to-r from-[#d4af37]/5 via-[#d4af37]/8 to-[#d4af37]/3 px-6 py-5 sm:px-8 sm:py-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/3 to-transparent opacity-50" />
                                        <div className="relative flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d4af37]/10 ring-2 ring-[#d4af37]/20">
                                                <User className="h-6 w-6 text-[#b8860b]" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">Contact Person</CardTitle>
                                                <CardDescription className="mt-0.5 text-sm text-[#475569] sm:text-base">
                                                    Primary contact information
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6 sm:p-8">
                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label htmlFor="contact_person_name" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Full Name <span className="text-[#d4af37]">*</span>
                                                </Label>
                                                <Input
                                                    id="contact_person_name"
                                                    type="text"
                                                    value={data.contact_person_name}
                                                    onChange={(e) => setData('contact_person_name', e.target.value)}
                                                    className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
                                                    placeholder="Ahmad Rizki"
                                                    required
                                                />
                                                <p className="text-xs text-[#64748b]">Full name of the primary contact person</p>
                                                <InputError message={errors.contact_person_name} />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="contact_person_position" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Position <span className="text-[#d4af37]">*</span>
                                                </Label>
                                                <Input
                                                    id="contact_person_position"
                                                    type="text"
                                                    value={data.contact_person_position}
                                                    onChange={(e) => setData('contact_person_position', e.target.value)}
                                                    className="h-12 border border-[#c7ddff] bg-white text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
                                                    placeholder="Director / Manager / Owner"
                                                    required
                                                />
                                                <p className="text-xs text-[#64748b]">Job title or position in the company</p>
                                                <InputError message={errors.contact_person_position} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label htmlFor="contact_person_email" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Email <span className="text-[#d4af37]">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
                                                    <Input
                                                        id="contact_person_email"
                                                        type="email"
                                                        value={data.contact_person_email}
                                                        onChange={(e) => setData('contact_person_email', e.target.value)}
                                                        className="h-12 border border-[#c7ddff] bg-white pl-11 text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
                                                        placeholder="ahmad.rizki@company.com"
                                                        required
                                                    />
                                                </div>
                                                <p className="text-xs text-[#64748b]">Personal or business email for direct communication</p>
                                                <InputError message={errors.contact_person_email} />
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="contact_person_phone" className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    Phone <span className="text-[#d4af37]">*</span>
                                                </Label>
                                                <div className="flex gap-2">
                                                    <Select
                                                        value={data.contact_person_phone_country_code}
                                                        onValueChange={(value) => setData('contact_person_phone_country_code', value)}
                                                    >
                                                        <SelectTrigger className="h-12 w-[100px] border border-[#c7ddff] bg-white text-base text-[#1e3a5f] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-[300px] overflow-y-auto border border-[#c7ddff] bg-white shadow-lg">
                                                            {countryCodes.map((code) => (
                                                                <SelectItem key={code} value={code} className="text-[#1e3a5f] hover:bg-[#d4af37]/10">
                                                                    {code}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="relative flex-1">
                                                        <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
                                                        <Input
                                                            id="contact_person_phone"
                                                            type="tel"
                                                            value={data.contact_person_phone}
                                                            onChange={(e) => {
                                                                let value = e.target.value.replace(/[^\d\s-]/g, '');
                                                                // For Indonesia (+62), remove leading 0 if user types it
                                                                if (data.contact_person_phone_country_code === '+62' && value.startsWith('0')) {
                                                                    value = value.substring(1);
                                                                }
                                                                setData('contact_person_phone', value);
                                                            }}
                                                            className="h-12 border border-[#c7ddff] bg-white pl-11 text-base text-[#1e3a5f] placeholder:text-[#94a3b8] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
                                                            placeholder="822 9986 2211"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-[#64748b]">
                                                    Enter phone number without country code. For Indonesia: enter without leading 0 (e.g., 822 9986
                                                    2211 instead of 0822 9986 2211)
                                                </p>
                                                <InputError message={errors.contact_person_phone} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Documents Section */}
                            <motion.div variants={cardVariants}>
                                <Card className="overflow-hidden border border-[#d4af37]/25 bg-white shadow-xl">
                                    <CardHeader className="relative border-b border-[#1e3a5f]/15 bg-gradient-to-r from-[#1e3a5f]/5 via-[#1e3a5f]/8 to-[#1e3a5f]/3 px-6 py-5 sm:px-8 sm:py-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1e3a5f]/3 to-transparent opacity-50" />
                                        <div className="relative flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1e3a5f]/10 ring-2 ring-[#1e3a5f]/20">
                                                <FileText className="h-6 w-6 text-[#1e3a5f]" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-xl font-bold text-[#1e3a5f] sm:text-2xl">Supporting Documents</CardTitle>
                                                <CardDescription className="mt-0.5 text-sm text-[#475569] sm:text-base">
                                                    Upload business documents (PDF, JPG, PNG - Max 5MB per file, 15MB total)
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6 sm:p-8">
                                        {[
                                            {
                                                field: 'business_license_file',
                                                label: 'Business License Document',
                                                guidance:
                                                    'Upload SIUP, NIB, or other official business license document. Ensure document is clear and readable.',
                                            },
                                            {
                                                field: 'tax_certificate_file',
                                                label: 'Tax Certificate (NPWP)',
                                                guidance:
                                                    "Upload your company's NPWP certificate. Document should show the complete 15-digit tax ID number.",
                                            },
                                            {
                                                field: 'company_profile_file',
                                                label: 'Company Profile',
                                                guidance:
                                                    'Upload company profile, brochure, or business overview document (optional but recommended).',
                                            },
                                        ].map(({ field, label, guidance }) => (
                                            <div key={field} className="space-y-3">
                                                <Label htmlFor={field} className="mb-2 block text-base font-semibold text-[#1e3a5f]">
                                                    {label}
                                                </Label>
                                                <div className="relative">
                                                    <input
                                                        id={field}
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor={field}
                                                        className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#c7ddff] bg-[#f8fafc] px-6 py-8 transition-all hover:border-[#2d4a6f] hover:bg-[#eef6ff]"
                                                    >
                                                        {filePreviews[field] ? (
                                                            <div className="flex w-full items-center gap-4">
                                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                                                                    <Check className="h-6 w-6 text-emerald-600" />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-sm font-medium text-[#1e3a5f]">
                                                                        {(data as any)[field]?.name}
                                                                    </p>
                                                                    <p className="text-xs text-[#64748b]">File uploaded successfully</p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleFileChange(field, null);
                                                                    }}
                                                                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 hover:bg-red-200"
                                                                >
                                                                    <X className="h-4 w-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2d4a6f]/10">
                                                                    <Upload className="h-6 w-6 text-[#2d4a6f]" />
                                                                </div>
                                                                <p className="mb-1 text-sm font-medium text-[#475569]">
                                                                    Click to upload or drag and drop
                                                                </p>
                                                                <p className="text-xs text-[#94a3b8]">PDF, JPG, PNG (Max 5MB)</p>
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                                <p className="text-xs text-[#64748b]">{guidance}</p>
                                                {fileErrors[field] && (
                                                    <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                                                            <p className="text-sm text-red-600">{fileErrors[field]}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <InputError message={(errors as any)[field]} />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Submit Section */}
                            <motion.div
                                variants={cardVariants}
                                className="flex flex-col items-center gap-6 rounded-xl border border-[#d4af37]/25 bg-white p-8 shadow-xl sm:flex-row sm:justify-between"
                            >
                                {isUserGuest && (
                                    <div className="flex items-start gap-3">
                                        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2d4a6f]" />
                                        <p className="text-sm leading-relaxed text-[#64748b]">
                                            After submitting, you'll be redirected to create an account to access the B2B portal
                                        </p>
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-14 w-full bg-gradient-to-r from-[#ff5200] to-[#ff6b35] px-10 text-lg font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl disabled:opacity-50 sm:w-auto"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-3">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                                            />
                                            Submitting...
                                        </span>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </Button>
                            </motion.div>
                        </motion.form>
                    )}
                </div>
            </div>
        </B2BLayout>
    );
}
