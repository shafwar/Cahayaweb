import AdminPortalShell from '@/components/admin/AdminPortalShell';
import B2cPackageAdminForm, { type B2cPackageFormShape } from '@/components/admin/B2cPackageAdminForm';
import B2cPackageFormPageLayout from '@/components/admin/B2cPackageFormPageLayout';
import { Button } from '@/components/ui/button';
import { adminChip, adminGhostBtn, adminPrimaryBtn } from '@/lib/admin-portal-theme';
import { Head, Link, useForm } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
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
        <AdminPortalShell className="w-full max-w-none px-0">
            <Head title="New B2C package" />

            <form onSubmit={submit} className="pb-6">
                <B2cPackageFormPageLayout
                    title="Create package"
                    description="Packages you save here power the public Packages page when database packages are enabled. On wide screens, use the list on the right to jump between sections."
                    chip={
                        <div className={adminChip}>
                            <Sparkles className="h-3.5 w-3.5" aria-hidden />
                            B2C registration
                        </div>
                    }
                    stickyNote="Draft is saved only after you click Create package."
                    stickyActions={
                        <>
                            <Link href="/admin/b2c-packages">
                                <button type="button" className={adminGhostBtn}>
                                    Cancel
                                </button>
                            </Link>
                            <Button type="submit" disabled={processing} className={`${adminPrimaryBtn} min-w-[11rem]`}>
                                {processing ? 'Saving…' : 'Create package'}
                            </Button>
                        </>
                    }
                >
                    <B2cPackageAdminForm
                        data={data as B2cPackageFormShape}
                        setData={(key, value) => setData(key as keyof typeof data, value as never)}
                        errors={errors}
                    />
                </B2cPackageFormPageLayout>
            </form>
        </AdminPortalShell>
    );
}
