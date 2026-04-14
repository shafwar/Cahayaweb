import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type PackageInfo = {
    id: number;
    slug: string;
    name: string;
    departure_period: string;
    price_display: string;
    terms_and_conditions: string;
    registration_deadline: string;
    pax_capacity: number;
    pax_booked: number;
    available_pax: number;
};

export default function PackageRegister({ package: pkg }: { package: PackageInfo }) {
    const deadlineLabel = new Date(pkg.registration_deadline).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        email: '',
        phone: '',
        passport_number: '',
        address: '',
        date_of_birth: '',
        gender: 'male' as 'male' | 'female' | 'other',
        pax: 1,
        terms_accepted: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/packages/register/${pkg.slug}`, { preserveScroll: true });
    };

    const maxPax = Math.max(1, Math.min(50, pkg.available_pax));

    return (
        <PublicLayout>
            <Head title={`Register — ${pkg.name}`} />
            <SeoHead
                title={`Register — ${pkg.name}`}
                description={`Register for ${pkg.name} — Cahaya Anbiya Travel.`}
            />
            <div className="bg-section-photos-home min-h-screen border-t border-[#d4af37]/20">
                <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
                    <nav className="text-sm text-muted-foreground">
                        <Link href="/packages" className="hover:text-accent">
                            Packages
                        </Link>{' '}
                        / <span className="text-foreground">Register</span>
                    </nav>

                    <h1 className="mt-4 text-2xl font-bold text-[#1e3a5f] sm:text-3xl">Package registration</h1>
                    <p className="mt-2 text-sm text-[#475569] sm:text-base">{pkg.name}</p>
                    <div className="mt-4 space-y-1 rounded-xl border border-[#d4af37]/25 bg-white/80 p-4 text-sm text-[#334155] shadow-sm backdrop-blur-sm dark:bg-gray-900/60">
                        <p>
                            <span className="font-semibold text-[#1e3a5f]">Departure period:</span> {pkg.departure_period}
                        </p>
                        <p>
                            <span className="font-semibold text-[#1e3a5f]">Price:</span> {pkg.price_display}
                        </p>
                        <p>
                            <span className="font-semibold text-[#1e3a5f]">Seats available:</span> {pkg.available_pax} / {pkg.pax_capacity}
                        </p>
                        <p>
                            <span className="font-semibold text-[#1e3a5f]">Registration deadline:</span> {deadlineLabel}
                        </p>
                    </div>

                    <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-[#d4af37]/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:bg-gray-900/70">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Full name</label>
                            <input
                                type="text"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-950"
                                required
                            />
                            {errors.full_name ? <p className="mt-1 text-xs text-red-600">{errors.full_name}</p> : null}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-950"
                                required
                            />
                            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Phone number</label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-950"
                                required
                            />
                            {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Passport number</label>
                            <input
                                type="text"
                                value={data.passport_number}
                                onChange={(e) => setData('passport_number', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-950"
                                required
                            />
                            {errors.passport_number ? <p className="mt-1 text-xs text-red-600">{errors.passport_number}</p> : null}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Address</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-950"
                                required
                            />
                            {errors.address ? <p className="mt-1 text-xs text-red-600">{errors.address}</p> : null}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Date of birth</label>
                            <input
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-950"
                                required
                            />
                            {errors.date_of_birth ? <p className="mt-1 text-xs text-red-600">{errors.date_of_birth}</p> : null}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Gender</label>
                            <select
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value as 'male' | 'female' | 'other')}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-950"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender ? <p className="mt-1 text-xs text-red-600">{errors.gender}</p> : null}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1e3a5f]">Number of travelers (pax)</label>
                            <input
                                type="number"
                                min={1}
                                max={maxPax}
                                value={data.pax}
                                onChange={(e) => setData('pax', Math.min(maxPax, Math.max(1, parseInt(e.target.value || '1', 10))))}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-950"
                                required
                            />
                            {errors.pax ? <p className="mt-1 text-xs text-red-600">{errors.pax}</p> : null}
                            {errors.package ? <p className="mt-1 text-xs text-red-600">{errors.package}</p> : null}
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 text-xs leading-relaxed text-[#475569] dark:border-gray-700 dark:bg-gray-950/50">
                            <p className="mb-2 font-semibold text-[#1e3a5f]">Terms &amp; conditions</p>
                            <div className="max-h-40 overflow-y-auto whitespace-pre-wrap">{pkg.terms_and_conditions}</div>
                        </div>

                        <label className="flex items-start gap-2 text-sm text-[#334155]">
                            <input
                                type="checkbox"
                                checked={Boolean(data.terms_accepted)}
                                onChange={(e) => setData('terms_accepted', e.target.checked)}
                                className="mt-1"
                            />
                            <span>I have read and agree to the terms and conditions above.</span>
                        </label>
                        {errors.terms_accepted ? <p className="text-xs text-red-600">{errors.terms_accepted}</p> : null}

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity disabled:opacity-60"
                            >
                                {processing ? 'Submitting…' : 'Submit registration'}
                            </button>
                            <Link
                                href="/packages"
                                className="rounded-xl border border-primary px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </section>
            </div>
        </PublicLayout>
    );
}
