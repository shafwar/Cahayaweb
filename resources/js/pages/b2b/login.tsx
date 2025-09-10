import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RippleButton } from '@/components/ui/ripple-button';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

export default function B2BLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('b2b.login.post'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
            <Head title="B2B Login - Cahaya Anbiya" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                        <Building2 className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">B2B Portal</h1>
                    <p className="mt-2 text-muted-foreground">Sign in to your business account</p>
                </div>

                {/* Login Form */}
                <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                Business Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                                    placeholder="Enter your business email"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="border-border bg-background pr-10 pl-10 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-border text-primary focus:ring-ring"
                                />
                                <span className="text-sm text-muted-foreground">Remember me</span>
                            </label>
                            <Link href={route('password.request')} className="text-sm text-primary transition-colors hover:text-primary/80">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <RippleButton
                            type="submit"
                            disabled={processing}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring"
                        >
                            {processing ? 'Signing in...' : 'Sign In to B2B Portal'}
                        </RippleButton>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Need Help?</span>
                        </div>
                    </div>

                    {/* Support Contact */}
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full border-border text-foreground hover:bg-muted"
                            onClick={() => window.open('https://wa.me/6281234567890?text=Hi, I need help with B2B login', '_blank')}
                        >
                            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                            </svg>
                            Contact B2B Support
                        </Button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have a B2B account?{' '}
                            <Link href={route('b2b.register')} className="font-medium text-primary transition-colors hover:text-primary/80">
                                Apply for B2B Access
                            </Link>
                        </p>
                    </div>

                    {/* Back to B2C */}
                    <div className="mt-4 text-center">
                        <Link href={route('home')} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            ← Back to B2C Site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
