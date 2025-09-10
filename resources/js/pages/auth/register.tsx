import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RippleButton } from '@/components/ui/ripple-button';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userType, setUserType] = useState<'b2c' | 'b2b'>('b2c');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type: 'b2c',
        company_name: '',
        company_license: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('user_type', userType);
        post(route('register'));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('company_license', file);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
            <Head title="Register" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/cahayanbiyalogo.png"
                        alt="Cahaya Anbiya"
                        className="h-16 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
                    <p className="text-muted-foreground mt-2">Join Cahaya Anbiya today</p>
                </div>

                {/* Register Form */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* User Type Selection */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Account Type</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setUserType('b2c')}
                                    className={`p-3 rounded-lg border transition-colors ${
                                        userType === 'b2c'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border text-muted-foreground hover:border-primary/50'
                                    }`}
                                >
                                    <User className="h-5 w-5 mx-auto mb-1" />
                                    <span className="text-sm font-medium">Personal</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType('b2b')}
                                    className={`p-3 rounded-lg border transition-colors ${
                                        userType === 'b2b'
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border text-muted-foreground hover:border-primary/50'
                                    }`}
                                >
                                    <Building className="h-5 w-5 mx-auto mb-1" />
                                    <span className="text-sm font-medium">Business</span>
                                </button>
                            </div>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                {userType === 'b2b' ? 'Company Name' : 'Full Name'}
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                                    placeholder={userType === 'b2b' ? 'Enter company name' : 'Enter your full name'}
                                    required
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="pl-10 pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                                    placeholder="Create a password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="pl-10 pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* B2B Specific Fields */}
                        {userType === 'b2b' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="company_license" className="text-sm font-medium text-foreground">
                                        Business License
                                    </Label>
                                    <Input
                                        id="company_license"
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="bg-background border-border text-foreground focus:border-ring focus:ring-ring"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Upload your business license (PDF, JPG, PNG)
                                    </p>
                                </div>

                                <div className="p-3 bg-muted/50 border border-border rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        <strong>Note:</strong> B2B accounts require verification before accessing packages.
                                        Our team will review your application within 24-48 hours.
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <RippleButton
                            type="submit"
                            disabled={processing}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring"
                        >
                            {processing ? 'Creating account...' : 'Create Account'}
                        </RippleButton>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Register */}
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full border-border text-foreground hover:bg-muted"
                            onClick={() => window.open('https://wa.me/6281234567890?text=Hi, I need help with registration', '_blank')}
                        >
                            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                            </svg>
                            Contact Support
                        </Button>
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
