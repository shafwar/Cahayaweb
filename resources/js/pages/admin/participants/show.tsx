import AdminPortalShell from '@/components/admin/AdminPortalShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminBackLink, adminMuted, adminPageTitle } from '@/lib/admin-portal-theme';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

type Participant = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    passport_number: string;
    address: string;
    date_of_birth: string | null;
    gender: string;
    pax: number;
    registration_status: 'pending' | 'approved' | 'rejected';
    payment_status: 'unpaid' | 'waiting_confirmation' | 'paid';
    visa_status: 'not_processed' | 'in_progress' | 'completed';
    ticket_status: 'not_booked' | 'booked';
    hotel_status: 'not_assigned' | 'assigned';
    notes: string | null;
    user: { id: number | null; name: string | null; email: string | null };
    package: { id: number | null; name: string; slug: string | null; package_code: string | null; price_display: string | null; departure_period: string | null };
};

export default function ParticipantShow({ participant }: { participant: Participant }) {
    const { data, setData, put, processing } = useForm({
        registration_status: participant.registration_status,
        payment_status: participant.payment_status,
        visa_status: participant.visa_status,
        ticket_status: participant.ticket_status,
        hotel_status: participant.hotel_status,
        notes: participant.notes ?? '',
    });

    return (
        <AdminPortalShell className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Head title={`Participant #${participant.id}`} />
            <Link href="/admin/participants" className={`${adminBackLink} mb-6`}>
                <ArrowLeft className="h-4 w-4" />
                All participants
            </Link>

            <h1 className={adminPageTitle}>Participant Detail</h1>
            <p className={`mt-1 ${adminMuted}`}>Kelola status registrasi, payment, dan operasional peserta.</p>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle className="text-[#1e3a5f]">Participant Data</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {participant.full_name}</p>
                        <p><strong>Email:</strong> {participant.email}</p>
                        <p><strong>Phone:</strong> {participant.phone}</p>
                        <p><strong>Passport:</strong> {participant.passport_number}</p>
                        <p><strong>DOB:</strong> {participant.date_of_birth ?? '-'}</p>
                        <p><strong>Gender:</strong> {participant.gender}</p>
                        <p><strong>Address:</strong> {participant.address}</p>
                        <p><strong>Pax:</strong> {participant.pax}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-[#1e3a5f]">Package & Account</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Package:</strong> {participant.package.name}</p>
                        <p><strong>Package Code:</strong> {participant.package.package_code ?? '-'}</p>
                        <p><strong>Departure:</strong> {participant.package.departure_period ?? '-'}</p>
                        <p><strong>Price:</strong> {participant.package.price_display ?? '-'}</p>
                        <p><strong>User ID:</strong> {participant.user.id ?? '-'}</p>
                        <p><strong>Account Name:</strong> {participant.user.name ?? '-'}</p>
                        <p><strong>Account Email:</strong> {participant.user.email ?? '-'}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader><CardTitle className="text-[#1e3a5f]">Update Status</CardTitle></CardHeader>
                <CardContent>
                    <form
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            put(`/admin/participants/${participant.id}`);
                        }}
                    >
                        <div className="space-y-2">
                            <Label>Registration Status</Label>
                            <Select value={data.registration_status} onValueChange={(v) => setData('registration_status', v as never)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Payment Status</Label>
                            <Select value={data.payment_status} onValueChange={(v) => setData('payment_status', v as never)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unpaid">Unpaid</SelectItem>
                                    <SelectItem value="waiting_confirmation">Waiting Confirmation</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Visa Status</Label>
                            <Select value={data.visa_status} onValueChange={(v) => setData('visa_status', v as never)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not_processed">Not Processed</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Ticket Status</Label>
                            <Select value={data.ticket_status} onValueChange={(v) => setData('ticket_status', v as never)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not_booked">Not Booked</SelectItem>
                                    <SelectItem value="booked">Booked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Hotel Status</Label>
                            <Select value={data.hotel_status} onValueChange={(v) => setData('hotel_status', v as never)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not_assigned">Not Assigned</SelectItem>
                                    <SelectItem value="assigned">Assigned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Notes</Label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={4}
                                className="w-full rounded-md border border-[#c7ddff] bg-white px-3 py-2 text-sm text-[#1e3a5f] focus:border-[#ff5200] focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" disabled={processing}>Save changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminPortalShell>
    );
}

