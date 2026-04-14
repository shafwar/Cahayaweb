import { Button } from '@/components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler, type ReactNode } from 'react';

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

    const field = (label: string, child: ReactNode, err?: string) => (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">{label}</label>
            {child}
            {err ? <p className="mt-1 text-xs text-red-400">{err}</p> : null}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <Head title={`Edit — ${pkg.name}`} />
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <Link href="/admin/b2c-packages" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    Back to packages
                </Link>
                <h1 className="text-2xl font-bold">Edit package</h1>
                <p className="mt-1 text-sm text-slate-400">
                    Slug: <span className="font-mono text-slate-300">{pkg.slug}</span>
                </p>

                <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                    {field(
                        'Package code',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.package_code}
                            onChange={(e) => setData('package_code', e.target.value)}
                        />,
                        errors.package_code,
                    )}
                    {field(
                        'Package name',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />,
                        errors.name,
                    )}
                    {field(
                        'Departure period',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.departure_period}
                            onChange={(e) => setData('departure_period', e.target.value)}
                        />,
                        errors.departure_period,
                    )}
                    {field(
                        'Duration label',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.duration_label}
                            onChange={(e) => setData('duration_label', e.target.value)}
                        />,
                        errors.duration_label,
                    )}
                    {field(
                        'Location',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                        />,
                        errors.location,
                    )}
                    {field(
                        'Type',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.package_type}
                            onChange={(e) => setData('package_type', e.target.value)}
                        />,
                        errors.package_type,
                    )}
                    {field(
                        'Price (display)',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.price_display}
                            onChange={(e) => setData('price_display', e.target.value)}
                        />,
                        errors.price_display,
                    )}
                    {field(
                        'Pax capacity',
                        <input
                            type="number"
                            min={1}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.pax_capacity}
                            onChange={(e) => setData('pax_capacity', parseInt(e.target.value || '1', 10))}
                        />,
                        errors.pax_capacity,
                    )}
                    {field(
                        'Pax booked (read-only advisory — increases automatically on registration)',
                        <input
                            type="number"
                            min={0}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.pax_booked}
                            onChange={(e) => setData('pax_booked', parseInt(e.target.value || '0', 10))}
                        />,
                        errors.pax_booked,
                    )}
                    {field(
                        'Registration deadline',
                        <input
                            type="datetime-local"
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.registration_deadline}
                            onChange={(e) => setData('registration_deadline', e.target.value)}
                        />,
                        errors.registration_deadline,
                    )}
                    {field(
                        'Status',
                        <select
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value as 'open' | 'closed')}
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>,
                        errors.status,
                    )}
                    {field(
                        'Image path',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.image_path}
                            onChange={(e) => setData('image_path', e.target.value)}
                        />,
                        errors.image_path,
                    )}
                    {field(
                        'Description',
                        <textarea rows={5} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" value={data.description} onChange={(e) => setData('description', e.target.value)} />,
                        errors.description,
                    )}
                    {field(
                        'Terms & conditions',
                        <textarea rows={6} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" value={data.terms_and_conditions} onChange={(e) => setData('terms_and_conditions', e.target.value)} />,
                        errors.terms_and_conditions,
                    )}
                    {field(
                        'Highlights (one per line)',
                        <textarea
                            rows={4}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs"
                            value={data.highlights_text}
                            onChange={(e) => setData('highlights_text', e.target.value)}
                        />,
                    )}
                    {field(
                        'Features (one per line)',
                        <textarea
                            rows={4}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs"
                            value={data.features_text}
                            onChange={(e) => setData('features_text', e.target.value)}
                        />,
                    )}
                    {field(
                        'Departure dates (Date|Status per line)',
                        <textarea
                            rows={3}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs"
                            value={data.dates_text}
                            onChange={(e) => setData('dates_text', e.target.value)}
                        />,
                    )}
                    {field(
                        'Hotels (Name|Location|Stars per line)',
                        <textarea
                            rows={3}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs"
                            value={data.hotels_text}
                            onChange={(e) => setData('hotels_text', e.target.value)}
                        />,
                    )}
                    {field(
                        'Sort order',
                        <input type="number" className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value || '0', 10))} />,
                        errors.sort_order,
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-500">
                            {processing ? 'Saving…' : 'Save changes'}
                        </Button>
                        <Link href="/admin/b2c-packages">
                            <Button type="button" variant="outline" className="border-white/20 text-slate-200">
                                Cancel
                            </Button>
                        </Link>
                        <Link href={`/admin/b2c-packages/${pkg.slug}/registrations`}>
                            <Button type="button" variant="secondary" className="bg-white/10 text-white hover:bg-white/15">
                                View registrations
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
