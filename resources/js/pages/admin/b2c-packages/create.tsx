import { Button } from '@/components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler, type ReactNode } from 'react';

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

    const field = (label: string, child: ReactNode, err?: string) => (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">{label}</label>
            {child}
            {err ? <p className="mt-1 text-xs text-red-400">{err}</p> : null}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <Head title="New B2C package" />
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <Link href="/admin/b2c-packages" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    Back to packages
                </Link>
                <h1 className="text-2xl font-bold">Create package</h1>
                <p className="mt-1 text-sm text-slate-400">Packages created here replace the static list on the public Packages page.</p>

                <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                    {field(
                        'Package code (unique)',
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
                        'Departure period (shown to participants)',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.departure_period}
                            onChange={(e) => setData('departure_period', e.target.value)}
                            placeholder="e.g. 14–24 April 2026"
                        />,
                        errors.departure_period,
                    )}
                    {field(
                        'Duration label (optional, for filters)',
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.duration_label}
                            onChange={(e) => setData('duration_label', e.target.value)}
                            placeholder="e.g. 10 Days"
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
                            placeholder="$2,350"
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
                            placeholder="/images/packages/..."
                        />,
                        errors.image_path,
                    )}
                    {field(
                        'Description',
                        <textarea
                            rows={5}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />,
                        errors.description,
                    )}
                    {field(
                        'Terms & conditions (required for registration)',
                        <textarea
                            rows={6}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.terms_and_conditions}
                            onChange={(e) => setData('terms_and_conditions', e.target.value)}
                        />,
                        errors.terms_and_conditions,
                    )}
                    {field(
                        'Highlights (one per line)',
                        <textarea
                            rows={4}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm font-mono text-xs"
                            value={data.highlights_text}
                            onChange={(e) => setData('highlights_text', e.target.value)}
                        />,
                    )}
                    {field(
                        'Features (one per line)',
                        <textarea
                            rows={4}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm font-mono text-xs"
                            value={data.features_text}
                            onChange={(e) => setData('features_text', e.target.value)}
                        />,
                    )}
                    {field(
                        'Departure dates (one per line: Date|Status)',
                        <textarea
                            rows={3}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm font-mono text-xs"
                            value={data.dates_text}
                            onChange={(e) => setData('dates_text', e.target.value)}
                            placeholder={'14 April 2026|Available'}
                        />,
                    )}
                    {field(
                        'Hotels (one per line: Name|Location|Stars)',
                        <textarea
                            rows={3}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm font-mono text-xs"
                            value={data.hotels_text}
                            onChange={(e) => setData('hotels_text', e.target.value)}
                            placeholder={'Golden Tulip|Amman|4'}
                        />,
                    )}
                    {field(
                        'Sort order',
                        <input
                            type="number"
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={data.sort_order}
                            onChange={(e) => setData('sort_order', parseInt(e.target.value || '0', 10))}
                        />,
                        errors.sort_order,
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-500">
                            {processing ? 'Saving…' : 'Create package'}
                        </Button>
                        <Link href="/admin/b2c-packages">
                            <Button type="button" variant="outline" className="border-white/20 text-slate-200">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
