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
import { ArrowLeft, Sparkles, Users } from 'lucide-react';
import { FormEventHandler } from 'react';

type Pkg = {
    id: number;
    slug: string;
    package_code: string;
    name: string;
    departure_period: string;
    description: string;
    location: string | null;
    duration_label: string | null;
    package_type: string;
    price_display: string;
    pax_capacity: number;
    pax_booked: number;
    registration_deadline: string;
    terms_and_conditions: string;
    status: 'open' | 'closed';
    image_path: string | null;
    highlights_text: string;
    features_text: string;
    dates_text: string;
    hotels_text: string;
    sort_order: number;
};

export default function B2cPackagesEdit({ package: pkg }: { package: Pkg }) {
    const { data, setData, put, processing, errors } = useForm({
        package_code: pkg.package_code,
        name: pkg.name,
        departure_period: pkg.departure_period,
        description: pkg.description,
        location: pkg.location ?? '',
        duration_label: pkg.duration_label ?? '',
        package_type: pkg.package_type,
        price_display: pkg.price_display,
        pax_capacity: pkg.pax_capacity,
        pax_booked: pkg.pax_booked,
        registration_deadline: pkg.registration_deadline,
        terms_and_conditions: pkg.terms_and_conditions,
        status: pkg.status,
        image_path: pkg.image_path ?? '',
        highlights_text: pkg.highlights_text,
        features_text: pkg.features_text,
        dates_text: pkg.dates_text,
        hotels_text: pkg.hotels_text,
        sort_order: pkg.sort_order,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/b2c-packages/${pkg.slug}`);
    };

    return (
        <AdminPortalShell className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
            <Head title={`Edit — ${pkg.name}`} />

            <nav className="mb-6" aria-label="Breadcrumb">
                <Link href="/admin/b2c-packages" className={adminBackLink}>
                    <ArrowLeft className="h-4 w-4 shrink-0" />
                    Back to packages
                </Link>
            </nav>

            <header className="mb-10 border-b border-slate-200/90 pb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0 flex-1">
                        <div className={adminChip}>
                            <Sparkles className="h-3.5 w-3.5" />
                            Edit package
                        </div>
                        <h1 className={`mt-4 break-words ${adminPageTitle}`}>{pkg.name}</h1>
                        <p className={`mt-2 font-mono text-xs ${adminMuted}`}>Slug: {pkg.slug}</p>
                    </div>
                    <div className="shrink-0 sm:pt-1">
                        <Link
                            href={`/admin/b2c-packages/${pkg.slug}/registrations`}
                            className={`${adminGhostBtn} inline-flex items-center border-amber-200 text-amber-800 hover:bg-amber-50`}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Registrations
                        </Link>
                    </div>
                </div>
            </header>

            <form onSubmit={submit} className="space-y-8 pb-28">
                <B2cPackageAdminForm
                    data={data as B2cPackageFormShape}
                    setData={(key, value) => setData(key as keyof typeof data, value as never)}
                    errors={errors}
                    showPaxBooked
                />

                <div className={adminStickyBar}>
                    <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className={`text-xs sm:text-sm ${adminMuted}`}>Changes apply to the public page after you save.</p>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                            <Link href="/admin/b2c-packages">
                                <button type="button" className={adminGhostBtn}>
                                    Cancel
                                </button>
                            </Link>
                            <Button type="submit" disabled={processing} className={adminPrimaryBtn}>
                                {processing ? 'Saving…' : 'Save changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminPortalShell>
    );
}
