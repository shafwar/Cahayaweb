import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
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

        // Get CSRF token from meta tag (most reliable)
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        let token = csrfToken;
        if (!token && typeof document !== 'undefined') {
            const xsrfCookie = document.cookie.split('; ').find((row) => row.startsWith('XSRF-TOKEN='));
            if (xsrfCookie) {
                token = decodeURIComponent(xsrfCookie.split('=')[1]);
            }
        }
        if (token && typeof window !== 'undefined' && (window as any).axios) {
            (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
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
            transform: (payload) => {
                const q = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
                const modeFromUrl = q.get('mode');
                const redirectFromUrl = q.get('redirect');
                return {
                    ...payload,
                    ...(modeFromUrl ? { mode: modeFromUrl } : {}),
                    ...(redirectFromUrl ? { redirect: redirectFromUrl } : {}),
                };
            },
            onError: (errors) => {
                console.error('Registration errors:', errors);
                const errorMessage = errors?.message || (typeof errors === 'string' ? errors : '');
                if (errorMessage.includes('419') || errorMessage.includes('expired') || errorMessage.includes('PAGE EXPIRED')) {
                    alert('Your session has expired. Please refresh the page and try again.');
                    window.location.reload();
                    return;
                }
                const firstErrorField = Object.keys(errors)[0];
                if (firstErrorField) {
                    const errorElement = document.getElementById(firstErrorField) || document.querySelector(`[name="${firstErrorField}"]`);
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
    };

    const showLoading = isSubmitting || processing;

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />

            {/* Display status messages */}
            {status && (
                <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                    <p className="text-sm text-green-300">{status}</p>
                </div>
            )}

            {/* B2B flow: set expectation for redirect to verification */}
            {mode === 'b2b' && (
                <div className="mb-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                    <p className="text-sm text-blue-200">
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
                            disabled={showLoading}
                            placeholder="Password (minimum 8 characters)"
                            minLength={8}
                        />
                        <div className="flex items-start gap-2">
                            <InputError message={errors.password} />
                            {!errors.password && <p className="text-xs text-muted-foreground">Password must be at least 8 characters long.</p>}
                        </div>
                        {data.password && data.password.length > 0 && data.password.length < 8 && (
                            <div className="mt-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2">
                                <p className="text-xs text-amber-300">
                                    <strong>Password too short:</strong> Your password must be at least 8 characters. Currently:{' '}
                                    {data.password.length} character{data.password.length !== 1 ? 's' : ''}.
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
                            disabled={showLoading}
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

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={showLoading} aria-busy={showLoading}>
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
