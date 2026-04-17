// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { useLogout } from '@/hooks/useLogout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { logout, isLoggingOut } = useLogout();
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50/90 py-2 text-center text-sm font-medium text-emerald-900">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button
                    disabled={processing}
                    className="min-h-[44px] w-full border-0 bg-gradient-to-r from-[#ff5200] to-[#e64a00] font-semibold text-white shadow-lg shadow-orange-200/60 hover:from-[#ff6b35] hover:to-[#ff5200] disabled:opacity-70"
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Sending…
                        </span>
                    ) : (
                        'Resend verification email'
                    )}
                </Button>

                <button
                    type="button"
                    onClick={logout}
                    disabled={isLoggingOut}
                    className="mx-auto block text-sm font-medium text-[#c2410c] underline decoration-orange-300 underline-offset-4 hover:text-[#ea580c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                </button>
            </form>
        </AuthLayout>
    );
}
