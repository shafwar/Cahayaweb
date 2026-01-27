import { Head, useForm } from '@inertiajs/react';
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
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
        mode: typeof mode === 'string' ? mode : undefined,
        redirect: redirect ?? undefined,
    });

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

        // CRITICAL: Use RELATIVE URL to let browser resolve HTTPS automatically
        // Absolute URLs can cause Mixed Content if Inertia caches HTTP URL
        // Relative URLs are always resolved relative to current page (which is HTTPS)
        const loginUrl = '/login';
        
        console.log('[Login] Using relative URL (browser will resolve to HTTPS):', loginUrl);
        console.log('[Login] Current page protocol:', window.location.protocol);
        console.log('[Login] Current page origin:', window.location.origin);
        
        // Submit login form with error handling
        // Using relative URL ensures browser resolves it to HTTPS automatically
        post(loginUrl, {
            preserveState: false,
            preserveScroll: false,
            onFinish: () => reset('password'),
            onSuccess: (page) => {
                // Log successful login for debugging
                console.log('[Login] Success - redirecting...', {
                    url: page.url,
                    component: page.component,
                });
            },
            onError: (errors) => {
                // Log errors for debugging
                console.error('[Login] Error occurred:', errors);
                
                // CRITICAL: On ANY error (including validation errors), refresh CSRF token
                // This ensures fresh token for next attempt, preventing stale token issues
                const errorMessage = errors?.message || (typeof errors === 'string' ? errors : '') || '';
                const errorString = JSON.stringify(errors || {});
                
                // Check if this is a CSRF/419 error
                const isCsrfError = 
                    errorMessage.includes('419') || 
                    errorMessage.includes('expired') || 
                    errorMessage.includes('PAGE EXPIRED') ||
                    errorString.includes('419') ||
                    errorString.includes('expired') ||
                    errorString.includes('csrf') ||
                    errorString.includes('token');
                
                if (isCsrfError) {
                    // CSRF error - reload page immediately to refresh token
                    console.warn('[Login] CSRF token expired, reloading page to refresh...');
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                    return;
                }
                
                // For validation errors (email/password wrong), just update CSRF token from meta tag
                // Server already regenerates token on each request, so meta tag should have fresh token
                if (errors.email || errors.password) {
                    console.log('[Login] Validation errors - updating CSRF token from meta tag...');
                    
                    // Update from meta tag (server already regenerated token)
                    const metaToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
                    if (metaToken && metaToken.content) {
                        if (typeof window !== 'undefined' && (window as any).axios) {
                            (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = metaToken.content;
                        }
                        console.log('[Login] CSRF token updated from meta tag after validation error');
                    }
                    
                    // Still display validation errors to user
                    return;
                }
                
                // For any other errors, just update from meta tag
                // Don't reload - server handles token regeneration
                console.warn('[Login] Unknown error - updating CSRF token from meta tag...');
                const metaToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
                if (metaToken && metaToken.content) {
                    if (typeof window !== 'undefined' && (window as any).axios) {
                        (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = metaToken.content;
                    }
                }
            },
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

            <form method="POST" className="flex flex-col gap-6" onSubmit={submit}>
                {data.mode && <input type="hidden" name="mode" value={data.mode} />}
                {data.redirect && <input type="hidden" name="redirect" value={data.redirect} />}
                <div className="grid gap-6">
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
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
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
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
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
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
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
