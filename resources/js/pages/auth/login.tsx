import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

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
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
        mode: typeof mode === 'string' ? mode : undefined,
        redirect: redirect ?? undefined,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
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
                        {errors.email && errors.email.includes('Admin accounts cannot login') && (
                            <div className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                                <p className="text-sm text-red-300">
                                    {errors.email} Please use the admin login page directly at <code className="text-xs bg-red-500/20 px-1 py-0.5 rounded">/admin</code>
                                </p>
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
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
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

                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
