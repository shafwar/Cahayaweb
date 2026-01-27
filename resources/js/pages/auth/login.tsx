import { Head, router, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
    mode?: 'b2b' | 'b2c';
    redirect?: string;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    mode?: 'b2b' | 'b2c' | 'admin';
    redirect?: string;
    error?: string;
}

export default function Login({ status, canResetPassword, mode, redirect, error }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [csrfTokenRefreshed, setCsrfTokenRefreshed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state for better control
    const [hasPreviousError, setHasPreviousError] = useState(false); // Track if there was a previous error
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
        mode: typeof mode === 'string' ? mode : undefined,
        redirect: redirect ?? undefined,
    });
    
    // Sync local loading state with Inertia processing state
    useEffect(() => {
        setIsSubmitting(processing);
    }, [processing]);

    // Check for pending resubmit after page refresh
    useEffect(() => {
        // Check if we have pending form data to resubmit after refresh
        const pendingData = sessionStorage.getItem('login_pending_resubmit');
        if (pendingData) {
            try {
                const formData = JSON.parse(pendingData);
                console.log('[Login] Found pending resubmit data, auto-submitting...', formData);
                
                // Set flag to show "Validating" message (not "Refreshing")
                setHasPreviousError(false);
                
                // Restore form data
                setData({
                    email: formData.email || '',
                    password: formData.password || '',
                    remember: formData.remember || false,
                    mode: formData.mode,
                    redirect: formData.redirect,
                });

                // Small delay to ensure form is ready, then auto-submit
                setTimeout(() => {
                    setIsSubmitting(true);
                    const loginUrl = '/login';
                    const submitData = { email: formData.email || '', password: formData.password || '', remember: formData.remember || false, mode: formData.mode, redirect: formData.redirect };

                    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
                    if (csrfToken && typeof window !== 'undefined' && (window as any).axios) {
                        (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
                    }

                    router.post(loginUrl, submitData, {
                        preserveState: true,
                        preserveScroll: false,
                        onStart: () => setIsSubmitting(true),
                        onProgress: () => setIsSubmitting(true),
                        onFinish: () => {
                            setIsSubmitting(false);
                            reset('password');
                            setHasPreviousError(false);
                            sessionStorage.removeItem('login_pending_resubmit');
                            console.log('[Login] Auto-resubmit finished');
                        },
                        onSuccess: () => {
                            sessionStorage.removeItem('login_pending_resubmit');
                            setHasPreviousError(false);
                        },
                        onError: () => {
                            setTimeout(() => setIsSubmitting(false), 150);
                            setHasPreviousError(true);
                            sessionStorage.removeItem('login_pending_resubmit');
                        },
                    }).catch(() => {
                        setHasPreviousError(true);
                        setTimeout(() => setIsSubmitting(false), 400);
                        sessionStorage.removeItem('login_pending_resubmit');
                    });
                }, 300);
            } catch (e) {
                console.error('[Login] Failed to parse pending resubmit data:', e);
                sessionStorage.removeItem('login_pending_resubmit');
            }
        }
    }, []); // Run once on mount

    // Track when errors occur
    useEffect(() => {
        if (errors.email || errors.password) {
            setHasPreviousError(true);
        }
    }, [errors.email, errors.password]);

    // Keep error flag even when user changes credentials
    // This ensures refresh happens on next submit regardless of whether credentials changed
    // User might be correcting their input, so we still need refresh for fresh CSRF token
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('email', e.target.value);
        // Don't reset hasPreviousError - we still want refresh on next submit
        // This ensures fresh CSRF token even if user corrected their credentials
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('password', e.target.value);
        // Don't reset hasPreviousError - we still want refresh on next submit
        // This ensures fresh CSRF token even if user corrected their credentials
    };

    // CRITICAL: Refresh CSRF token when login page loads (without causing reload loop)
    // Server already regenerates token on page load, so we just need to update axios header
    useEffect(() => {
        // Check if we already have a CSRF token in meta tag (server always provides fresh token)
        const metaToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
        if (metaToken && metaToken.content) {
            // Update axios default header with fresh token from meta tag
            if (typeof window !== 'undefined' && (window as any).axios) {
                (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = metaToken.content;
            }
            setCsrfTokenRefreshed(true);
            console.log('[Login] CSRF token loaded from meta tag');
        } else {
            // Only fetch CSRF cookie if meta tag is missing (shouldn't happen normally)
            // But don't reload page - just fetch cookie silently
            console.warn('[Login] CSRF meta tag not found, fetching CSRF cookie...');
            fetch('/sanctum/csrf-cookie', {
                method: 'HEAD',
                credentials: 'include',
                cache: 'no-store',
            }).then(() => {
                // After fetching, check meta tag again
                setTimeout(() => {
                    const updatedMetaToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
                    if (updatedMetaToken && updatedMetaToken.content) {
                        if (typeof window !== 'undefined' && (window as any).axios) {
                            (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = updatedMetaToken.content;
                        }
                        setCsrfTokenRefreshed(true);
                        console.log('[Login] CSRF token updated after cookie fetch');
                    }
                }, 100);
            }).catch((error) => {
                console.error('[Login] Failed to fetch CSRF cookie:', error);
                // Don't reload - just log error. Server-side token regeneration should be enough.
            });
        }
    }, []); // Empty dependency array = run once on mount

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // CRITICAL: Prevent multiple submissions
        if (processing || isSubmitting) {
            console.warn('[Login] Form is already submitting, ignoring duplicate submission');
            return;
        }

        // CRITICAL: If there was a previous error, refresh page first then auto-resubmit
        // This ensures fresh CSRF token and clean state
        if (hasPreviousError) {
            console.log('[Login] Previous error detected - refreshing page before resubmit...');
            
            // Save current form data to sessionStorage for auto-resubmit after refresh
            const formDataToSave = {
                email: data.email,
                password: data.password,
                remember: data.remember,
                mode: data.mode,
                redirect: data.redirect,
            };
            sessionStorage.setItem('login_pending_resubmit', JSON.stringify(formDataToSave));
            
            // Show loading immediately
            setIsSubmitting(true);
            
            // Refresh page - after refresh, useEffect will detect pending data and auto-submit
            setTimeout(() => {
                window.location.reload();
            }, 100);
            return;
        }

        // Get CSRF token from meta tag (guaranteed fresh from server-side regeneration)
        // Server always regenerates token on page load, so token is always fresh
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        
        // Validate token exists before submitting
        if (!csrfToken) {
            console.error('CSRF token not found in meta tag');
            // Don't reload automatically - let server handle it
            // Server will regenerate token on next request anyway
            // Just show error to user
            return;
        }
        
        // Set CSRF token for axios if available
        if (csrfToken && typeof window !== 'undefined' && (window as any).axios) {
            (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        }

        // CRITICAL: Set loading state IMMEDIATELY before any async operations
        setIsSubmitting(true);

        // CRITICAL: Use RELATIVE URL to let browser resolve HTTPS automatically
        const loginUrl = '/login';
        console.log('[Login] Form submission started - validating credentials...');

        // Use router.post so we can .catch() network/request failures (ERR_NETWORK, AxiosError)
        // useForm().post() doesn't expose promise rejection for network errors
        router.post(loginUrl, data, {
            preserveState: true,
            preserveScroll: false,
            forceFormData: false,
            onStart: () => {
                setIsSubmitting(true);
            },
            onProgress: () => {
                setIsSubmitting(true);
            },
            onFinish: () => {
                setIsSubmitting(false);
                reset('password');
                console.log('[Login] Form submission finished');
            },
            onSuccess: (page) => {
                console.log('[Login] Success - redirecting...', { url: page.url, component: page.component });
                sessionStorage.removeItem('login_pending_resubmit');
                setHasPreviousError(false);
            },
            onError: (errs: Record<string, string>) => {
                console.error('[Login] Error occurred:', errs);
                setTimeout(() => setIsSubmitting(false), 150);
                setHasPreviousError(true);

                const errMsg = errs?.message || (typeof errs === 'string' ? errs : '') || '';
                const errStr = JSON.stringify(errs || {});
                const isCsrfError =
                    /419|expired|PAGE EXPIRED|csrf|token/i.test(errMsg) || /419|expired|csrf|token/i.test(errStr);

                if (isCsrfError) {
                    console.warn('[Login] CSRF token expired, reloading page...');
                    setTimeout(() => window.location.reload(), 400);
                    return;
                }

                const metaToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
                if (metaToken && typeof window !== 'undefined' && (window as any).axios) {
                    (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = metaToken.content;
                }
            },
        }).catch((err: unknown) => {
            // Network error (ERR_NETWORK, AxiosError) or request failed before response
            console.error('[Login] Request failed (network or other):', err);
            setHasPreviousError(true);
            setTimeout(() => setIsSubmitting(false), 400);
        });
    };

    return (
        <AuthLayout
            title={mode === 'admin' ? "Admin Login" : "Log in to your account"}
            description={mode === 'admin' ? "Enter your admin credentials to access the admin dashboard" : "Enter your email and password below to log in"}
        >
            <Head title={mode === 'admin' ? "Admin Login" : "Log in"} />

            {/* Display error message if provided */}
            {error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-sm text-red-300">{error}</p>
                </div>
            )}

            <form method="POST" className="flex flex-col gap-6 relative" onSubmit={submit}>
                {/* Loading overlay - shows when form is submitting */}
                {/* Use both processing and isSubmitting for maximum reliability */}
                {(processing || isSubmitting) && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4 rounded-xl bg-gray-900/98 px-8 py-6 shadow-2xl border border-amber-500/20">
                            <LoaderCircle className="h-10 w-10 animate-spin text-amber-500" />
                            <div className="text-center">
                                <p className="text-base font-semibold text-white">
                                    {hasPreviousError ? 'Refreshing page...' : 'Validating credentials...'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {hasPreviousError 
                                        ? 'Please wait while we refresh and validate your credentials'
                                        : 'Please wait while we verify your information'}
                                </p>
                            </div>
                            <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                
                {data.mode && <input type="hidden" name="mode" value={data.mode} />}
                {data.redirect && <input type="hidden" name="redirect" value={data.redirect} />}
                <div className={`grid gap-6 transition-opacity duration-200 ${(processing || isSubmitting) ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={handleEmailChange}
                            placeholder="email@example.com"
                            disabled={processing || isSubmitting}
                            className={(processing || isSubmitting) ? 'opacity-60 cursor-not-allowed' : ''}
                        />
                        <InputError message={errors.email} />
                        {errors.email && (
                            <div className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                                <div className="flex items-start gap-2">
                                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-300">{errors.email}</p>
                                        {errors.email.includes('Admin accounts cannot login') && (
                                            <p className="mt-1 text-xs text-red-200">
                                                Please use the admin login page directly at <code className="text-xs bg-red-500/20 px-1 py-0.5 rounded">/admin</code>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={handlePasswordChange}
                                placeholder="Password"
                                className={`pr-10 ${(processing || isSubmitting) ? 'opacity-60 cursor-not-allowed' : ''}`}
                                disabled={processing || isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={processing || isSubmitting}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors ${(processing || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                        {errors.password && (
                            <div className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                                <div className="flex items-start gap-2">
                                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm font-medium text-red-300">{errors.password}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            disabled={processing || isSubmitting}
                            className={(processing || isSubmitting) ? 'opacity-60 cursor-not-allowed' : ''}
                        />
                        <Label htmlFor="remember" className={(processing || isSubmitting) ? 'opacity-60 cursor-not-allowed' : ''}>Remember me</Label>
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-4 w-full relative min-h-[44px]" 
                        tabIndex={4} 
                        disabled={processing || isSubmitting}
                    >
                        {(processing || isSubmitting) ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                <span>Validating credentials...</span>
                            </span>
                        ) : (
                            'Log in'
                        )}
                    </Button>
                </div>

                {/* Hide sign up link for admin mode */}
                {mode !== 'admin' && (
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <TextLink href={route('register')} tabIndex={5}>
                            Sign up
                        </TextLink>
                    </div>
                )}
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
