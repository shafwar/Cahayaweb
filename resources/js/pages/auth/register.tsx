import { Head, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import axios from 'axios';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { fetchFreshCsrfToken } from '@/lib/csrf';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

/**
 * B2B flow: mode & redirect must be in form state so they are sent with POST.
 * Inertia useForm().post() only sends form state; options.data is ignored.
 * See docs/B2B_REGISTRATION_FLOW.md for full flow and safeguards.
 */
type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    mode?: string;
    redirect?: string;
};

export default function Register() {
    const { url, props } = usePage();
    const status = (props as any)?.status;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        mode: '',
        redirect: '',
    });

    // Sync mode and redirect from URL into form state so they are sent with POST (Inertia useForm sends form state only)
    useEffect(() => {
        const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : url.split('?')[1] || '');
        const modeParam = params.get('mode');
        const redirectParam = params.get('redirect');
        if (modeParam || redirectParam) {
            setData((prev) => ({
                ...prev,
                ...(modeParam ? { mode: modeParam } : {}),
                ...(redirectParam ? { redirect: redirectParam } : {}),
            }));
        }
    }, [url]);

    const mode = new URLSearchParams(url.split('?')[1] || '').get('mode');
    const redirect = new URLSearchParams(url.split('?')[1] || '').get('redirect');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (processing || isSubmitting) return;

        setIsSubmitting(true);

        void (async () => {
            try {
                await fetchFreshCsrfToken();

                let token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
                if (!token && typeof document !== 'undefined') {
                    const xsrfCookie = document.cookie.split('; ').find((row) => row.startsWith('XSRF-TOKEN='));
                    if (xsrfCookie) {
                        token = decodeURIComponent(xsrfCookie.split('=')[1]);
                    }
                }
                if (token) {
                    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
                }

                // Build URL: use form state first, fallback to current URL params (backend also reads from query)
                const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
                const modeFromUrl = urlParams.get('mode');
                const redirectFromUrl = urlParams.get('redirect');
                const modeToSend = data.mode || modeFromUrl;
                const redirectToSend = data.redirect || redirectFromUrl;

                let registerUrl = route('register');
                const params = new URLSearchParams();
                if (modeToSend) params.set('mode', modeToSend);
                if (redirectToSend) params.set('redirect', redirectToSend);
                if (params.toString()) registerUrl += '?' + params.toString();

                if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
                    const absoluteUrl = new URL(registerUrl, window.location.origin);
                    if (absoluteUrl.protocol === 'http:') {
                        absoluteUrl.protocol = 'https:';
                        registerUrl = absoluteUrl.toString();
                    }
                }

                // Always inject mode/redirect from current URL into payload so backend receives them (avoids race with useEffect)
                post(registerUrl, {
                    preserveState: false,
                    preserveScroll: false,
                    only: [],
                    onSuccess: (page) => {
                        if (import.meta.env.DEV) {
                            console.info('[Register] Inertia success', { url: page.url });
                        }
                    },
                    transform: (payload) => {
                        const q = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
                        const modeFromUrlInner = q.get('mode');
                        const redirectFromUrlInner = q.get('redirect');
                        return {
                            ...payload,
                            ...(modeFromUrlInner ? { mode: modeFromUrlInner } : {}),
                            ...(redirectFromUrlInner ? { redirect: redirectFromUrlInner } : {}),
                        };
                    },
                    onError: (errors) => {
                        console.error('[Register] submission errors', errors);
                        const errorMessage =
                            (errors as { message?: string })?.message ||
                            (typeof errors === 'string' ? errors : '') ||
                            (errors as Record<string, string>)?.email ||
                            '';
                        if (errorMessage.includes('419') || errorMessage.includes('expired') || errorMessage.includes('PAGE EXPIRED')) {
                            alert('Your session has expired. Please refresh the page and try again.');
                            window.location.reload();
                            return;
                        }
                        const firstErrorField = Object.keys(errors)[0];
                        if (firstErrorField) {
                            const errorElement =
                                document.getElementById(firstErrorField) || document.querySelector(`[name="${firstErrorField}"]`);
                            if (errorElement) {
                                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                (errorElement as HTMLElement).focus();
                            }
                        }
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                        reset('password', 'password_confirmation');
                    },
                });
            } catch {
                setIsSubmitting(false);
            }
        })();
    };

    const showLoading = isSubmitting || processing;

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />

            {/* Display status messages */}
            {status && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50/90 p-3">
                    <p className="text-sm font-medium text-emerald-900">{status}</p>
                </div>
            )}

            {/* B2B flow: set expectation for redirect to verification */}
            {mode === 'b2b' && (
                <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50/90 p-3">
                    <p className="text-sm text-amber-950">
                        After creating your account you will be redirected to the verification page to complete your B2B application.
                    </p>
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
                            disabled={showLoading}
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
                            disabled={showLoading}
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
                                <div className="mt-2 rounded-lg border border-amber-300/80 bg-amber-50 p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="mb-1 text-sm font-semibold text-amber-900">Email Already Registered</h4>
                                            <p className="text-sm leading-relaxed text-amber-950/90">
                                                The email address <strong className="font-semibold text-[#1e3a5f]">{data.email}</strong> is already
                                                registered in our system.
                                            </p>
                                            <p className="mt-2 text-sm text-amber-950/90">
                                                If this is your account, please{' '}
                                                <TextLink
                                                    href={route('login', mode === 'b2b' ? { mode: 'b2b', redirect } : {})}
                                                    className="font-semibold text-[#c2410c] underline decoration-orange-300 hover:text-[#ea580c]"
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
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={showLoading}
                                placeholder="Password (minimum 8 characters)"
                                minLength={8}
                                className="pr-11"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword((v) => !v)}
                                disabled={showLoading}
                                className="absolute top-1/2 right-2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 outline-none transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:opacity-50"
                                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                            </button>
                        </div>
                        <div className="flex items-start gap-2">
                            <InputError message={errors.password} />
                            {!errors.password && <p className="text-xs text-slate-600">Password must be at least 8 characters long.</p>}
                        </div>
                        {data.password && data.password.length > 0 && data.password.length < 8 && (
                            <div className="mt-1 rounded-lg border border-amber-200 bg-amber-50 p-2">
                                <p className="text-xs text-amber-900">
                                    <strong>Password too short:</strong> Your password must be at least 8 characters. Currently:{' '}
                                    {data.password.length} character{data.password.length !== 1 ? 's' : ''}.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={showLoading}
                                placeholder="Confirm password"
                                className="pr-11"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPasswordConfirmation((v) => !v)}
                                disabled={showLoading}
                                className="absolute top-1/2 right-2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 outline-none transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:opacity-50"
                                aria-label={showPasswordConfirmation ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                            >
                                {showPasswordConfirmation ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                        {data.password && data.password_confirmation && data.password !== data.password_confirmation && (
                            <div className="mt-1 rounded-lg border border-red-200 bg-red-50 p-2">
                                <p className="text-xs text-red-800">
                                    <strong>Passwords do not match.</strong> Please make sure both password fields contain the same password.
                                </p>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="relative mt-2 min-h-[44px] w-full border-0 bg-gradient-to-r from-[#ff5200] to-[#e64a00] font-semibold text-white shadow-lg shadow-orange-200/60 hover:from-[#ff6b35] hover:to-[#ff5200] disabled:opacity-70"
                        tabIndex={5}
                        disabled={showLoading}
                        aria-busy={showLoading}
                    >
                        {showLoading ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 shrink-0 animate-spin" aria-hidden />
                                Creating account...
                            </>
                        ) : (
                            'Create account'
                        )}
                    </Button>
                </div>

                {/* Display general errors if any */}
                {errors && Object.keys(errors).length > 0 && !errors.name && !errors.email && !errors.password && !errors.password_confirmation && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-800">Please check the form for errors and try again.</p>
                    </div>
                )}

                <div className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <TextLink
                        href={route('login', mode === 'b2b' ? { mode: 'b2b', redirect } : {})}
                        tabIndex={6}
                        className="font-medium text-[#c2410c] underline decoration-orange-300 underline-offset-4 hover:text-[#ea580c]"
                    >
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
