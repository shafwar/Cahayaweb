// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { adminMuted } from '@/lib/admin-portal-theme';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50/90 py-2 text-center text-sm font-medium text-emerald-900">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <form method="POST" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button
                            type="submit"
                            className="relative min-h-[44px] w-full border-0 bg-gradient-to-r from-[#ff5200] to-[#e64a00] font-semibold text-white shadow-lg shadow-orange-200/60 hover:from-[#ff6b35] hover:to-[#ff5200] disabled:opacity-70"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Sending…
                                </span>
                            ) : (
                                'Email password reset link'
                            )}
                        </Button>
                    </div>
                </form>

                <div className={`space-x-1 text-center text-sm ${adminMuted}`}>
                    <span>Or, return to</span>
                    <TextLink
                        href={route('login')}
                        className="font-medium text-[#c2410c] underline decoration-orange-300 underline-offset-4 hover:text-[#ea580c] hover:decoration-orange-400"
                    >
                        log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
