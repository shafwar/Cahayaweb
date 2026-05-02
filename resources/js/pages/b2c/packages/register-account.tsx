import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { getB2cRegistrationAccountTestFill } from '@/lib/b2cPackageFillTemplates';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type PackageSummary = {
    id: number;
    slug: string;
    name: string;
    price_display: string;
    departure_period: string;
};

type ParticipantSummary = {
    full_name: string;
    email: string;
    phone: string;
    pax: number;
};

export default function PackageRegisterAccount({
    package: pkg,
    participant,
    login_url,
    register_form_url,
}: {
    package: PackageSummary;
    participant: ParticipantSummary;
    login_url: string;
    register_form_url: string;
}) {
    const showDevTestFill = import.meta.env.DEV;
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        account_mode: 'create' as 'create' | 'login',
        account_password: '',
        account_password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/packages/register/${pkg.slug}/account`, { preserveScroll: true });
    };

    const isCreate = data.account_mode === 'create';
    const layoutTitle = isCreate ? 'Create an account' : 'Sign in';
    const layoutDescription = isCreate
        ? 'Enter your details below to finish your package registration.'
        : 'Enter your password to submit this registration with your existing account.';

    const emailErr = typeof errors.email === 'string' ? errors.email : '';

    return (
        <AuthLayout title={layoutTitle} description={layoutDescription}>
            <Head title={isCreate ? 'Account — package registration' : 'Sign in — package registration'} />

            <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50/90 p-3">
                <p className="text-sm text-amber-950">
                    {isCreate ? (
                        <>
                            After creating your account your registration for <strong className="font-semibold">{pkg.name}</strong> will be sent for admin
                            review (same account can be used for B2B and B2C; approvals stay separate).
                        </>
                    ) : (
                        <>
                            Signing in submits your registration for <strong className="font-semibold">{pkg.name}</strong> under your existing account.
                        </>
                    )}
                </p>
            </div>

            <p className="mb-4 text-center text-xs text-slate-600">
                <TextLink href={register_form_url} className="font-medium text-[#c2410c] underline decoration-orange-300 underline-offset-4 hover:text-[#ea580c]">
                    Edit participant details
                </TextLink>
                {' · '}
                <TextLink href="/packages" className="font-medium text-[#0369a1] underline decoration-sky-300 underline-offset-4 hover:text-[#075985]">
                    Back to packages
                </TextLink>
            </p>

            {showDevTestFill ? (
                <details className="mb-4 rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-2 text-xs">
                    <summary className="cursor-pointer font-semibold text-amber-950">Local dev — fill test passwords</summary>
                    <button
                        type="button"
                        className="mt-2 rounded-md border border-amber-300 bg-white px-2 py-1 text-xs font-medium text-amber-950"
                        onClick={() => setData(getB2cRegistrationAccountTestFill())}
                    >
                        Apply dummy passwords
                    </button>
                </details>
            ) : null}

            {(errors as Record<string, string | undefined>).package ? (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-800">{(errors as Record<string, string>).package}</p>
                </div>
            ) : null}

            <form method="POST" className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="b2c-acc-name">Name</Label>
                        <Input id="b2c-acc-name" type="text" value={participant.full_name} disabled tabIndex={-1} placeholder="Full name" className="bg-slate-50 text-slate-700" />
                        <p className="text-xs text-slate-500">From your registration step (read-only).</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="b2c-acc-email">Email address</Label>
                        <Input id="b2c-acc-email" type="email" value={participant.email} disabled tabIndex={-1} placeholder="email@example.com" className="bg-slate-50 text-slate-700" />
                        <InputError message={errors.email} />
                        {emailErr &&
                            (emailErr.includes('terdaftar') ||
                                emailErr.includes('already') ||
                                emailErr.includes('registered') ||
                                emailErr.includes('taken')) && (
                                <div className="mt-2 rounded-lg border border-amber-300/80 bg-amber-50 p-4 shadow-sm">
                                    <p className="text-sm text-amber-950/90">
                                        This email is already registered.{' '}
                                        <button
                                            type="button"
                                            className="font-semibold text-[#c2410c] underline decoration-orange-300 hover:text-[#ea580c]"
                                            onClick={() => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    account_mode: 'login',
                                                    account_password: '',
                                                    account_password_confirmation: '',
                                                }));
                                            }}
                                        >
                                            Sign in with this email instead
                                        </button>
                                    </p>
                                </div>
                            )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="acc-password">Password</Label>
                        <div className="relative">
                            <Input
                                id="acc-password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={1}
                                autoComplete={isCreate ? 'new-password' : 'current-password'}
                                value={data.account_password}
                                onChange={(e) => setData('account_password', e.target.value)}
                                disabled={processing}
                                placeholder={isCreate ? 'Password (minimum 8 characters)' : 'Your password'}
                                minLength={8}
                                className={`pr-11 ${errors.account_password ? 'border-red-500' : ''}`}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword((v) => !v)}
                                disabled={processing}
                                className="absolute top-1/2 right-2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 outline-none transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:opacity-50"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                            </button>
                        </div>
                        <div className="flex items-start gap-2">
                            <InputError message={errors.account_password} />
                            {isCreate && !errors.account_password ? (
                                <p className="text-xs text-slate-600">Password must be at least 8 characters long.</p>
                            ) : null}
                        </div>
                    </div>

                    {isCreate ? (
                        <div className="grid gap-2">
                            <Label htmlFor="acc-password2">Confirm password</Label>
                            <div className="relative">
                                <Input
                                    id="acc-password2"
                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                    required
                                    tabIndex={2}
                                    autoComplete="new-password"
                                    value={data.account_password_confirmation}
                                    onChange={(e) => setData('account_password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirm password"
                                    className="pr-11"
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowPasswordConfirmation((v) => !v)}
                                    disabled={processing}
                                    className="absolute top-1/2 right-2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 outline-none transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:opacity-50"
                                    aria-label={showPasswordConfirmation ? 'Hide confirm password' : 'Show confirm password'}
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff className="h-4 w-4" aria-hidden />
                                    ) : (
                                        <Eye className="h-4 w-4" aria-hidden />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.account_password_confirmation} />
                        </div>
                    ) : null}

                    <Button
                        type="submit"
                        className="relative mt-2 min-h-[44px] w-full border-0 bg-gradient-to-r from-[#ff5200] to-[#e64a00] font-semibold text-white shadow-lg shadow-orange-200/60 hover:from-[#ff6b35] hover:to-[#ff5200] disabled:opacity-70"
                        tabIndex={3}
                        disabled={processing}
                        aria-busy={processing}
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 shrink-0 animate-spin" aria-hidden />
                                {isCreate ? 'Creating account…' : 'Signing in…'}
                            </>
                        ) : isCreate ? (
                            'Create account'
                        ) : (
                            'Sign in & submit registration'
                        )}
                    </Button>
                </div>

                <div className="text-center text-sm text-slate-600">
                    {isCreate ? (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="font-medium text-[#c2410c] underline decoration-orange-300 underline-offset-4 hover:text-[#ea580c]"
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        account_mode: 'login',
                                        account_password: '',
                                        account_password_confirmation: '',
                                    }))
                                }
                            >
                                Log in
                            </button>
                        </>
                    ) : (
                        <>
                            Need an account?{' '}
                            <button
                                type="button"
                                className="font-medium text-[#c2410c] underline decoration-orange-300 underline-offset-4 hover:text-[#ea580c]"
                                onClick={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        account_mode: 'create',
                                        account_password: '',
                                        account_password_confirmation: '',
                                    }))
                                }
                            >
                                Create account
                            </button>
                        </>
                    )}
                </div>

                <p className="text-center text-xs text-slate-500">
                    Prefer the full login page?{' '}
                    <Link href={login_url} className="font-medium text-[#0369a1] underline underline-offset-4 hover:text-[#075985]">
                        Open login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
