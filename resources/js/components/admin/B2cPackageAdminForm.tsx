import B2cPackageImageUpload from '@/components/admin/B2cPackageImageUpload';
import {
    adminInput,
    adminSelect,
    adminTextarea,
    adminTextareaMono,
} from '@/lib/admin-portal-theme';
import { AdminField, AdminFormSection } from '@/components/admin/AdminFormSection';
import { CalendarRange, FileText, ImageIcon, ListOrdered, Package, Tag } from 'lucide-react';

export type B2cPackageFormShape = {
    package_code: string;
    name: string;
    departure_period: string;
    description: string;
    location: string;
    duration_label: string;
    package_type: string;
    price_display: string;
    pax_capacity: number;
    pax_booked?: number;
    registration_deadline: string;
    terms_and_conditions: string;
    status: 'open' | 'closed';
    image_path: string;
    highlights_text: string;
    features_text: string;
    dates_text: string;
    hotels_text: string;
    sort_order: number;
};

type Errors = Record<string, string | undefined>;

type SetDataFn = (key: keyof B2cPackageFormShape, value: unknown) => void;

type Props = {
    data: B2cPackageFormShape;
    setData: SetDataFn;
    errors: Errors;
    showPaxBooked?: boolean;
};

const fieldGroup =
    'rounded-xl border border-slate-100 bg-slate-50/40 p-4 shadow-inner shadow-slate-100/80 sm:p-5';

const fieldGroupLabel = 'mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400';

export default function B2cPackageAdminForm({ data, setData, errors, showPaxBooked }: Props) {
    return (
        <div className="space-y-8">
            <AdminFormSection
                id="b2c-pkg-identity"
                step={1}
                title="Identity & naming"
                description="Unique code and display name appear on the public packages list."
                icon={<Package className="h-5 w-5" />}
            >
                <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-8">
                    <AdminField label="Package code (unique)" error={errors.package_code}>
                        <input
                            className={adminInput}
                            value={data.package_code}
                            onChange={(e) => setData('package_code', e.target.value)}
                            autoComplete="off"
                        />
                    </AdminField>
                    <AdminField label="Package name" error={errors.name}>
                        <input className={adminInput} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    </AdminField>
                </div>
            </AdminFormSection>

            <AdminFormSection
                id="b2c-pkg-schedule"
                step={2}
                title="Schedule & capacity"
                description="Shown to visitors; deadline controls when registration closes."
                icon={<CalendarRange className="h-5 w-5" />}
            >
                <div className="space-y-6">
                    <div className={fieldGroup}>
                        <p className={fieldGroupLabel}>Period & label</p>
                        <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-8">
                            <AdminField
                                label="Departure period"
                                hint='Example: "14–24 April 2026"'
                                error={errors.departure_period}
                            >
                                <input
                                    className={adminInput}
                                    value={data.departure_period}
                                    onChange={(e) => setData('departure_period', e.target.value)}
                                    placeholder="14–24 April 2026"
                                />
                            </AdminField>
                            <AdminField label="Duration label (optional)" hint='For filters, e.g. "10 Days"' error={errors.duration_label}>
                                <input
                                    className={adminInput}
                                    value={data.duration_label}
                                    onChange={(e) => setData('duration_label', e.target.value)}
                                    placeholder="10 Days"
                                />
                            </AdminField>
                        </div>
                    </div>

                    <div className={fieldGroup}>
                        <p className={fieldGroupLabel}>Registration</p>
                        <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-8">
                            <AdminField
                                label="Registration deadline"
                                hint="Waktu ini memakai zona aplikasi (default WIB). Harus lebih dari sekarang agar tombol Register di situs publik aktif. Status “Open” saja tidak cukup jika deadline sudah lewat."
                                error={errors.registration_deadline}
                            >
                                <input
                                    type="datetime-local"
                                    className={adminInput}
                                    value={data.registration_deadline}
                                    onChange={(e) => setData('registration_deadline', e.target.value)}
                                />
                            </AdminField>
                            <AdminField label="Status" error={errors.status}>
                                <select
                                    className={adminSelect}
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'open' | 'closed')}
                                >
                                    <option value="open">Open — accepting registrations</option>
                                    <option value="closed">Closed — no new registrations</option>
                                </select>
                            </AdminField>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <AdminField label="Pax capacity" error={errors.pax_capacity}>
                            <input
                                type="number"
                                min={1}
                                className={adminInput}
                                value={data.pax_capacity}
                                onChange={(e) => setData('pax_capacity', parseInt(e.target.value || '1', 10))}
                            />
                        </AdminField>
                    </div>

                    {showPaxBooked ? (
                        <div className="max-w-md">
                            <AdminField
                                label="Pax booked"
                                hint="Usually increases automatically when participants register."
                                error={errors.pax_booked}
                            >
                                <input
                                    type="number"
                                    min={0}
                                    className={adminInput}
                                    value={data.pax_booked ?? 0}
                                    onChange={(e) => setData('pax_booked', parseInt(e.target.value || '0', 10))}
                                />
                            </AdminField>
                        </div>
                    ) : null}
                </div>
            </AdminFormSection>

            <AdminFormSection
                id="b2c-pkg-offer"
                step={3}
                title="Offer details"
                description="Location, category, and how price is shown on the card."
                icon={<Tag className="h-5 w-5" />}
            >
                <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-8">
                    <AdminField label="Location" error={errors.location}>
                        <input className={adminInput} value={data.location} onChange={(e) => setData('location', e.target.value)} />
                    </AdminField>
                    <AdminField label="Package type" hint="Pick a preset or type your own label." error={errors.package_type}>
                        <input
                            className={adminInput}
                            list="b2c-package-type-suggestions"
                            value={data.package_type}
                            onChange={(e) => setData('package_type', e.target.value)}
                        />
                        <datalist id="b2c-package-type-suggestions">
                            <option value="Religious" />
                            <option value="Umrah" />
                            <option value="Hajj" />
                            <option value="Leisure" />
                            <option value="Educational" />
                            <option value="Corporate" />
                        </datalist>
                    </AdminField>
                    <AdminField label="Price (display only)" hint='Free text, e.g. "From Rp 45jt"' error={errors.price_display}>
                        <input
                            className={adminInput}
                            value={data.price_display}
                            onChange={(e) => setData('price_display', e.target.value)}
                            placeholder="From Rp 45.000.000"
                        />
                    </AdminField>
                    <AdminField label="Sort order" hint="Lower numbers appear first." error={errors.sort_order}>
                        <input
                            type="number"
                            className={adminInput}
                            value={data.sort_order}
                            onChange={(e) => setData('sort_order', parseInt(e.target.value || '0', 10))}
                        />
                    </AdminField>
                </div>
            </AdminFormSection>

            <AdminFormSection
                id="b2c-pkg-media"
                step={4}
                title="Media"
                description="Poster paket (portrait didukung): unggah langsung ke R2 dengan kompresi di server. Path disimpan di database dan dipakai halaman publik /packages."
                icon={<ImageIcon className="h-5 w-5" />}
            >
                <B2cPackageImageUpload
                    imagePath={data.image_path}
                    onImagePathChange={(path) => setData('image_path', path)}
                    error={errors.image_path}
                />
            </AdminFormSection>

            <AdminFormSection
                id="b2c-pkg-copy"
                step={5}
                title="Copy for the public page"
                description="Description and terms are shown (or required) on the registration flow."
                icon={<FileText className="h-5 w-5" />}
            >
                <div className="space-y-6">
                    <AdminField label="Short description" error={errors.description}>
                        <textarea
                            rows={5}
                            className={adminTextarea}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </AdminField>
                    <AdminField label="Terms & conditions" hint="Required for online registration." error={errors.terms_and_conditions}>
                        <textarea
                            rows={6}
                            className={adminTextarea}
                            value={data.terms_and_conditions}
                            onChange={(e) => setData('terms_and_conditions', e.target.value)}
                        />
                    </AdminField>
                </div>
            </AdminFormSection>

            <AdminFormSection
                id="b2c-pkg-lists"
                step={6}
                title="Structured lists"
                description="One entry per line. Use the pipe formats shown so the B2C page can parse rows."
                icon={<ListOrdered className="h-5 w-5" />}
            >
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-8">
                    <AdminField label="Highlights" hint="One bullet per line.">
                        <textarea
                            rows={5}
                            className={adminTextareaMono}
                            value={data.highlights_text}
                            onChange={(e) => setData('highlights_text', e.target.value)}
                        />
                    </AdminField>
                    <AdminField label="Features" hint="One feature per line.">
                        <textarea
                            rows={5}
                            className={adminTextareaMono}
                            value={data.features_text}
                            onChange={(e) => setData('features_text', e.target.value)}
                        />
                    </AdminField>
                    <AdminField label="Departure dates" hint='Format per line: Date|Status — e.g. 14 April 2026|Available'>
                        <textarea
                            rows={4}
                            className={adminTextareaMono}
                            value={data.dates_text}
                            onChange={(e) => setData('dates_text', e.target.value)}
                            placeholder={'14 April 2026|Available'}
                        />
                    </AdminField>
                    <AdminField label="Hotels" hint="Format per line: Name|Location|Stars">
                        <textarea
                            rows={4}
                            className={adminTextareaMono}
                            value={data.hotels_text}
                            onChange={(e) => setData('hotels_text', e.target.value)}
                            placeholder={'Golden Tulip|Amman|4'}
                        />
                    </AdminField>
                </div>
            </AdminFormSection>
        </div>
    );
}
