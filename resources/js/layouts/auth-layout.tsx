import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    children,
    title,
    description,
    variant = 'default',
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    variant?: 'default' | 'admin';
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} variant={variant} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
