import AdminPortalShell from '@/components/admin/AdminPortalShell';
import B2cPackageAdminForm, { type B2cPackageFormShape } from '@/components/admin/B2cPackageAdminForm';
import { Button } from '@/components/ui/button';
import {
    adminBackLink,
    adminChip,
    adminGhostBtn,
    adminMuted,
    adminPageTitle,
    adminPrimaryBtn,
    adminStickyBar,
} from '@/lib/admin-portal-theme';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function B2cPackagesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        package_code: '',
        name: '',
        departure_period: '',
        description: '',
        location: '',
        duration_label: '',
        package_type: 'Religious',
        price_display: '',
        pax_capacity: 25,
        registration_deadline: '',
        terms_and_conditions: '',
        status: 'open' as 'open' | 'closed',
        image_path: '/images/packages/packages1.png',
        highlights_text: '',
        features_text: '',
        dates_text: '',
        hotels_text: '',
        sort_order: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/b2c-packages');
    };

    return (
        <AdminPortalShell className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
            <Head title="New B2C package" />

            {/* Baris navigasi terpisah agar tidak bentrok dengan judul */}
            <nav className="mb-6" aria-label="Breadcrumb">
                <Link href="/admin/b2c-packages" className={adminBackLink}>
                    <ArrowLeft className="h-4 w-4 shrink-0" />
                    Back to packages
                </Link>
            </nav>

            <header className="mb-10 border-b border-slate-200/90 pb-8">
                <div className={adminChip}>
                    <Sparkles className="h-3.5 w-3.5" />
                    B2C registration
                </div>
                <h1 className={`mt-4 ${adminPageTitle}`}>Create package</h1>
                <p className={`mt-3 max-w-2xl text-sm leading-relaxed sm:text-base ${adminMuted}`}>
                    Packages you save here power the public Packages page. Fields are grouped in sections so you can fill them in order.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-8 pb-28">
                <B2cPackageAdminForm
                    data={data as B2cPackageFormShape}
                    setData={(key, value) => setData(key as keyof typeof data, value as never)}
                    errors={errors}
                />

                <div className={adminStickyBar}>
                    <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className={`text-xs sm:text-sm ${adminMuted}`}>Draft is saved only after you click Create package.</p>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                            <Link href="/admin/b2c-packages">
                                <button type="button" className={adminGhostBtn}>
                                    Cancel
                                </button>
                            </Link>
                            <Button type="submit" disabled={processing} className={adminPrimaryBtn}>
                                {processing ? 'Saving…' : 'Create package'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminPortalShell>
    );
}
