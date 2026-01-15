import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { url, props } = usePage();
    const mode = new URLSearchParams(url.split('?')[1] || '').get('mode');
    const redirect = new URLSearchParams(url.split('?')[1] || '').get('redirect');
    const status = (props as any)?.status;
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Get CSRF token from meta tag (most reliable)
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        
        // Fallback to XSRF-TOKEN cookie if meta tag token is missing
        let token = csrfToken;
        if (!token && typeof document !== 'undefined') {
            const xsrfCookie = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
            if (xsrfCookie) {
                token = decodeURIComponent(xsrfCookie.split('=')[1]);
            }
        }

        // Set CSRF token for axios if available
        if (token && typeof window !== 'undefined' && (window as any).axios) {
            (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        }

        // Preserve mode and redirect parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        const redirectParam = urlParams.get('redirect');

        // Build registration URL (use relative to avoid HTTPS issues)
        let registerUrl = route('register');

        // Add mode and redirect as both URL params and data (to ensure they're available)
        const params = new URLSearchParams();
        if (modeParam) params.set('mode', modeParam);
        if (redirectParam) params.set('redirect', redirectParam);

        // Build full URL with parameters
        if (params.toString()) {
            registerUrl += '?' + params.toString();
        }

        // Ensure HTTPS if current page is HTTPS
        if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
            const absoluteUrl = new URL(registerUrl, window.location.origin);
            if (absoluteUrl.protocol === 'http:') {
                absoluteUrl.protocol = 'https:';
                registerUrl = absoluteUrl.toString();
            }
        }

        // Include mode and redirect in data as well (for POST data)
        const postData: any = {
            ...data,
        };
        
        // Add mode and redirect to POST data if they exist
        if (modeParam) {
            (postData as any).mode = modeParam;
        }
        if (redirectParam) {
            (postData as any).redirect = redirectParam;
        }

        post(registerUrl, {
            data: postData,
            preserveState: false,
            preserveScroll: false,
            only: [],
            onError: (errors) => {
                console.error('Registration errors:', errors);
                // If 419 error, reload page to refresh CSRF token
                const errorMessage = errors?.message || (typeof errors === 'string' ? errors : '');
                if (errorMessage.includes('419') || errorMessage.includes('expired') || errorMessage.includes('PAGE EXPIRED')) {
                    alert('Your session has expired. Please refresh the page and try again.');
                    window.location.reload();
                    return;
                }
                // Errors will be automatically displayed via InputError components
                // Scroll to first error
                const firstErrorField = Object.keys(errors)[0];
                if (firstErrorField) {
                    const errorElement = document.getElementById(firstErrorField) || document.querySelector(`[name="${firstErrorField}"]`);
                    if (errorElement) {
                        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        (errorElement as HTMLElement).focus();
                    }
                }
            },
            onSuccess: () => {
                // Success - user will be redirected automatically by backend
            },
            onFinish: () => {
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />

            {/* Display status messages */}
            {status && (
                <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                    <p className="text-sm text-green-300">{status}</p>
                </div>
            )}

            <form method="POST" className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                            className={
                                errors.email && errors.email.includes('already registered')
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : ''
                            }
                        />
                        <InputError message={errors.email} />
                        {errors.email &&
                            (errors.email.includes('already registered') ||
                                errors.email.includes('already been taken') ||
                                errors.email.includes('unique')) && (
                                <div className="mt-2 rounded-lg border-2 border-amber-500/50 bg-amber-500/20 p-4 shadow-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="mb-1 text-sm font-semibold text-amber-300">Email Already Registered</h4>
                                            <p className="text-sm leading-relaxed text-amber-200/90">
                                                The email address <strong className="font-semibold text-amber-100">{data.email}</strong> is already
                                                registered in our system.
                                            </p>
                                            <p className="mt-2 text-sm text-amber-200/90">
                                                If this is your account, please{' '}
                                                <TextLink
                                                    href={route('login', mode === 'b2b' ? { mode: 'b2b', redirect } : {})}
                                                    className="font-semibold text-amber-100 underline hover:text-amber-50"
                                                >
                                                    log in here
                                                </TextLink>{' '}
                                                instead. If you forgot your password, you can reset it from the login page.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password (minimum 8 characters)"
                            minLength={8}
                        />
                        <div className="flex items-start gap-2">
                            <InputError message={errors.password} />
                            {!errors.password && (
                                <p className="text-xs text-muted-foreground">
                                    Password must be at least 8 characters long.
                                </p>
                            )}
                        </div>
                        {data.password && data.password.length > 0 && data.password.length < 8 && (
                            <div className="mt-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2">
                                <p className="text-xs text-amber-300">
                                    <strong>Password too short:</strong> Your password must be at least 8 characters. Currently: {data.password.length} character{data.password.length !== 1 ? 's' : ''}.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                        {data.password && data.password_confirmation && data.password !== data.password_confirmation && (
                            <div className="mt-1 rounded-lg border border-red-500/30 bg-red-500/10 p-2">
                                <p className="text-xs text-red-300">
                                    <strong>Passwords do not match.</strong> Please make sure both password fields contain the same password.
                                </p>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Create account'
                        )}
                    </Button>
                </div>

                {/* Display general errors if any */}
                {errors && Object.keys(errors).length > 0 && !errors.name && !errors.email && !errors.password && !errors.password_confirmation && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                        <p className="text-sm text-red-300">Please check the form for errors and try again.</p>
                    </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login', mode === 'b2b' ? { mode: 'b2b', redirect } : {})} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
