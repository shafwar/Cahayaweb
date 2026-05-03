import AdminFloatingToast, { type AdminToastPayload } from '@/components/admin/AdminFloatingToast';
import AdminPortalShell from '@/components/admin/AdminPortalShell';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    adminBackLink,
    adminCardLight,
    adminFieldLabel,
    adminGhostBtn,
    adminGlassPanel,
    adminMuted,
    adminPageTitle,
    adminPrimaryBtn,
    adminSectionDesc,
    adminSectionHeader,
    adminSectionTitle,
    adminSelectTriggerLight,
    adminTextarea,
} from '@/lib/admin-portal-theme';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, ClipboardList, CreditCard, ExternalLink, FileText, Globe, Loader2, Plane, Save, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type Participant = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    passport_number: string;
    address: string;
    date_of_birth: string | null;
    gender: string;
    departure_period_snapshot: string;
    pax: number;
    registration_status: 'pending' | 'approved' | 'rejected';
    payment_status: 'unpaid' | 'waiting_confirmation' | 'paid';
    visa_status: 'not_processed' | 'in_progress' | 'completed';
    ticket_status: 'not_booked' | 'booked';
    hotel_status: 'not_assigned' | 'assigned';
    notes: string | null;
    reviewed_at: string | null;
    created_at: string | null;
    /** Bumps on every save — used to re-sync the form from server (no stale state after Save). */
    updated_at: string | null;
    user: { id: number | null; name: string | null; email: string | null };
    package: { id: number | null; name: string; slug: string | null; package_code: string | null; price_display: string | null; departure_period: string | null };
};

function regBadgeClass(status: Participant['registration_status']): string {
    if (status === 'approved') return 'border-emerald-300 bg-emerald-50 text-emerald-900';
    if (status === 'rejected') return 'border-red-300 bg-red-50 text-red-900';
    return 'border-amber-300 bg-amber-50 text-amber-950';
}

function payBadgeClass(status: Participant['payment_status']): string {
    if (status === 'paid') return 'border-emerald-300 bg-emerald-50 text-emerald-900';
    if (status === 'waiting_confirmation') return 'border-sky-300 bg-sky-50 text-sky-900';
    return 'border-slate-300 bg-white text-slate-700';
}

function formatTs(iso: string | null): string {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
        return iso;
    }
}

function DefItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="grid gap-0.5 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
            <dt className={`text-xs font-medium tracking-wide text-slate-500 uppercase ${adminMuted}`}>{label}</dt>
            <dd className={cn('text-sm text-slate-900', mono && 'font-mono text-xs')}>{value || '—'}</dd>
        </div>
    );
}

export default function ParticipantShow({
    participant,
    package_registrations_url,
    flash,
}: {
    participant: Participant;
    package_registrations_url: string | null;
    flash?: { type: string; message: string } | null;
}) {
    const [toast, setToast] = useState<AdminToastPayload | null>(null);

    useEffect(() => {
        if (flash?.message) {
            setToast({
                type: flash.type === 'error' ? 'error' : 'success',
                message: flash.message,
            });
        }
    }, [flash?.message, flash?.type]);

    const { data, setData, put, processing, errors, reset } = useForm({
        registration_status: participant.registration_status,
        payment_status: participant.payment_status,
        visa_status: participant.visa_status,
        ticket_status: participant.ticket_status,
        hotel_status: participant.hotel_status,
        notes: participant.notes ?? '',
    });

    /** After PUT (or navigating between participants), re-sync form from server so nothing looks “reverted”. */
    useEffect(() => {
        reset({
            registration_status: participant.registration_status,
            payment_status: participant.payment_status,
            visa_status: participant.visa_status,
            ticket_status: participant.ticket_status,
            hotel_status: participant.hotel_status,
            notes: participant.notes ?? '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only when server row version changes
    }, [participant.id, participant.updated_at, reset]);

    const paymentPresetClass = (value: Participant['payment_status']) =>
        cn(
            'rounded-xl border px-3 py-2 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-orange-400/50 focus-visible:outline-none',
            data.payment_status === value
                ? 'border-orange-400 bg-gradient-to-r from-[#ff5200] to-[#e64a00] text-white shadow-md shadow-orange-200/50'
                : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/50',
        );

    return (
        <AdminPortalShell className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title={`${participant.full_name} — Participant`} />
            <AdminFloatingToast toast={toast} onDismiss={() => setToast(null)} />

            <div className="mb-6 flex flex-wrap items-center gap-3">
                <Link href="/admin/participants" className={adminBackLink}>
                    <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                    All participants
                </Link>
                {package_registrations_url ? (
                    <Link href={package_registrations_url} className={cn(adminBackLink, 'gap-2')}>
                        <ClipboardList className="h-4 w-4 shrink-0 text-orange-600" aria-hidden />
                        Package registrations
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
                    </Link>
                ) : null}
            </div>

            <div className={cn(adminGlassPanel, 'overflow-hidden')}>
                <div className={adminSectionHeader}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <UserCircle className="h-8 w-8 shrink-0 text-orange-500" aria-hidden />
                                <h1 className={`break-words ${adminPageTitle}`}>{participant.full_name}</h1>
                            </div>
                            <p className={`mt-2 ${adminMuted}`}>Participant #{participant.id}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Badge variant="outline" className={cn('border px-3 py-1 text-[11px] font-bold uppercase', regBadgeClass(data.registration_status))}>
                                    Registration: {data.registration_status}
                                </Badge>
                                <Badge variant="outline" className={cn('border px-3 py-1 text-[11px] font-semibold capitalize', payBadgeClass(data.payment_status))}>
                                    Payment: {data.payment_status.replace(/_/g, ' ')}
                                </Badge>
                                <Badge variant="outline" className="border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase text-violet-900">
                                    Visa: {data.visa_status.replace(/_/g, ' ')}
                                </Badge>
                                <Badge variant="outline" className="border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase text-indigo-900">
                                    Ticket: {data.ticket_status.replace(/_/g, ' ')}
                                </Badge>
                                <Badge variant="outline" className="border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase text-amber-900">
                                    Hotel: {data.hotel_status.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                            <p className={`mt-2 text-xs ${adminMuted}`}>Badges reflect the form below until you save — then they match the database.</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
                    <Card className={cn(adminCardLight, 'gap-0 py-0 shadow-md')}>
                        <CardHeader className="border-b border-slate-100 pb-4 pt-6">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#1e3a5f]">
                                <UserCircle className="h-5 w-5 text-orange-500" aria-hidden />
                                Participant (read-only)
                            </CardTitle>
                            <p className={adminSectionDesc}>Data from the package registration form.</p>
                        </CardHeader>
                        <CardContent className="pb-6 pt-2">
                            <dl>
                                <DefItem label="Full name" value={participant.full_name} />
                                <DefItem label="Email" value={participant.email} />
                                <DefItem label="Phone" value={participant.phone} />
                                <DefItem label="Passport" value={participant.passport_number} mono />
                                <DefItem label="Date of birth" value={participant.date_of_birth ?? ''} />
                                <DefItem label="Gender" value={participant.gender} />
                                <DefItem label="Address" value={participant.address} />
                                <DefItem label="Pax" value={String(participant.pax)} />
                                <DefItem label="Departure (snapshot)" value={participant.departure_period_snapshot} />
                            </dl>
                        </CardContent>
                    </Card>

                    <Card className={cn(adminCardLight, 'gap-0 py-0 shadow-md')}>
                        <CardHeader className="border-b border-slate-100 pb-4 pt-6">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#1e3a5f]">
                                <ClipboardList className="h-5 w-5 text-orange-500" aria-hidden />
                                Package & account
                            </CardTitle>
                            <p className={adminSectionDesc}>Linked catalog package and login account (if any).</p>
                        </CardHeader>
                        <CardContent className="pb-6 pt-2">
                            <dl>
                                <DefItem label="Package" value={participant.package.name} />
                                <DefItem label="Package code" value={participant.package.package_code ?? ''} mono />
                                <DefItem label="Catalog departure" value={participant.package.departure_period ?? ''} />
                                <DefItem label="Price" value={participant.package.price_display ?? ''} />
                                <DefItem label="Account ID" value={participant.user.id != null ? String(participant.user.id) : ''} mono />
                                <DefItem label="Account name" value={participant.user.name ?? ''} />
                                <DefItem label="Account email" value={participant.user.email ?? ''} />
                                <DefItem label="Registration date" value={formatTs(participant.created_at)} />
                                <DefItem label="Last updated" value={formatTs(participant.updated_at)} />
                                <DefItem label="Registration reviewed at" value={formatTs(participant.reviewed_at)} />
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                <div className="border-t border-slate-100 px-5 pb-8 sm:px-6">
                    <div className="mb-6 flex items-start gap-3 pt-6">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-[#ff5200] ring-1 ring-orange-500/25">
                            <FileText className="h-5 w-5" aria-hidden />
                        </div>
                        <div>
                            <h2 className={adminSectionTitle}>Status management (lifecycle)</h2>
                            <p className={adminSectionDesc}>
                                Typical flow: <strong>Pending</strong> → approve → <strong>Unpaid</strong> / waiting payment → <strong>Paid</strong> → visa <strong>In progress</strong> →{' '}
                                <strong>Completed</strong> → ticket <strong>Booked</strong> → hotel <strong>Assigned</strong>. Use notes for anything the team must remember (no more spreadsheets).
                                Saving emails the participant only when registration becomes <strong>Approved</strong> or <strong>Rejected</strong> (same as quick actions on the package list).
                            </p>
                        </div>
                    </div>

                    <form
                        className={cn(adminGlassPanel, 'p-5 sm:p-6')}
                        onSubmit={(e) => {
                            e.preventDefault();
                            put(`/admin/participants/${participant.id}`);
                        }}
                    >
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className={adminFieldLabel}>Registration status</Label>
                                    <Select value={data.registration_status} onValueChange={(v) => setData('registration_status', v as Participant['registration_status'])}>
                                        <SelectTrigger className={cn(adminSelectTriggerLight)}>
                                            <SelectValue placeholder="Choose status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.registration_status} />
                                </div>

                                <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1e3a5f]">
                                        <CreditCard className="h-4 w-4 text-orange-600" aria-hidden />
                                        Payment — quick presets
                                    </div>
                                    <p className={`mb-3 text-xs ${adminMuted}`}>One tap sets the dropdown below; click Save changes to persist.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button type="button" className={paymentPresetClass('unpaid')} onClick={() => setData('payment_status', 'unpaid')}>
                                            Unpaid
                                        </button>
                                        <button type="button" className={paymentPresetClass('waiting_confirmation')} onClick={() => setData('payment_status', 'waiting_confirmation')}>
                                            Waiting confirmation
                                        </button>
                                        <button type="button" className={paymentPresetClass('paid')} onClick={() => setData('payment_status', 'paid')}>
                                            Mark paid
                                        </button>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <Label className={adminFieldLabel}>Payment status</Label>
                                        <Select value={data.payment_status} onValueChange={(v) => setData('payment_status', v as Participant['payment_status'])}>
                                            <SelectTrigger className={cn(adminSelectTriggerLight)}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                                <SelectItem value="waiting_confirmation">Waiting confirmation</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.payment_status} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid gap-5 sm:grid-cols-1">
                                    <div className="space-y-2">
                                        <Label className={cn(adminFieldLabel, 'flex items-center gap-2')}>
                                            <Globe className="h-4 w-4 text-violet-600" aria-hidden />
                                            Visa status
                                        </Label>
                                        <Select value={data.visa_status} onValueChange={(v) => setData('visa_status', v as Participant['visa_status'])}>
                                            <SelectTrigger className={cn(adminSelectTriggerLight)}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="not_processed">Not processed</SelectItem>
                                                <SelectItem value="in_progress">In progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.visa_status} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={cn(adminFieldLabel, 'flex items-center gap-2')}>
                                            <Plane className="h-4 w-4 text-indigo-600" aria-hidden />
                                            Ticket status
                                        </Label>
                                        <Select value={data.ticket_status} onValueChange={(v) => setData('ticket_status', v as Participant['ticket_status'])}>
                                            <SelectTrigger className={cn(adminSelectTriggerLight)}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="not_booked">Not booked</SelectItem>
                                                <SelectItem value="booked">Booked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.ticket_status} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={cn(adminFieldLabel, 'flex items-center gap-2')}>
                                            <Building2 className="h-4 w-4 text-amber-700" aria-hidden />
                                            Hotel status
                                        </Label>
                                        <Select value={data.hotel_status} onValueChange={(v) => setData('hotel_status', v as Participant['hotel_status'])}>
                                            <SelectTrigger className={cn(adminSelectTriggerLight)}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="not_assigned">Not assigned</SelectItem>
                                                <SelectItem value="assigned">Assigned</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.hotel_status} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-2 border-t border-slate-100 pt-8">
                            <Label className={adminFieldLabel}>Internal notes</Label>
                            <p className={`text-xs ${adminMuted}`}>Visible only to admins — e.g. visa handling, pelunasan, follow-ups.</p>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={5}
                                placeholder="Catatan internal tim operasional…"
                                className={adminTextarea}
                            />
                            <InputError message={errors.notes} />
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <button type="submit" disabled={processing} className={cn(adminPrimaryBtn, 'inline-flex min-h-[44px] items-center justify-center gap-2 px-8')}>
                                {processing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
                                Save changes
                            </button>
                            <Button type="button" variant="outline" className={cn(adminGhostBtn, 'rounded-xl')} asChild>
                                <Link href={package_registrations_url ?? '/admin/b2c-packages'}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPortalShell>
    );
}
