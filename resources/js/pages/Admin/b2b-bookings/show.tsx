import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Mail, MessageSquare, Phone, Send, User, Users } from 'lucide-react';
import { useState } from 'react';

interface B2BBooking {
    id: number;
    booking_reference: string;
    invoice_number: string;
    travelers_count: number;
    total_amount: number;
    b2b_discount: number;
    final_amount: number;
    currency: string;
    status: string;
    payment_due_date: string;
    payment_received_at: string;
    invoice_sent_at: string;
    confirmation_sent_at: string;
    created_at: string;
    updated_at: string;
    traveler_details: Array<{
        name: string;
        passport_number: string;
        date_of_birth: string;
        phone: string;
        email: string;
    }>;
    special_requests: string[];
    admin_notes: string;
    whatsapp_messages: Array<{
        type: string;
        message: string;
        sent: boolean;
        timestamp: string;
    }>;
    partner: {
        id: number;
        name: string;
        email: string;
        b2b_verification?: {
            company_name: string;
            contact_person: string;
            contact_phone: string;
            contact_email: string;
            company_address: string;
        };
    };
    package: {
        id: number;
        name: string;
        destination: string;
        duration_days: number;
        departure_date: string;
        return_date: string;
        description: string;
    };
    processed_by?: {
        name: string;
    };
}

interface B2BBookingShowProps {
    booking: B2BBooking;
}

export default function B2BBookingShow({ booking }: B2BBookingShowProps) {
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
        pending: 'Pending Payment',
        confirmed: 'Confirmed',
        rejected: 'Rejected',
    };

    const handleStatusUpdate = async () => {
        if (!newStatus) return;

        try {
            await router.post(route('admin.b2b-bookings.update-status', booking.id), {
                status: newStatus,
                notes: statusNotes,
            });

            setShowStatusDialog(false);
            setNewStatus('');
            setStatusNotes('');
        } catch (error) {
            console.error('Status update failed:', error);
        }
    };

    const handleSendPaymentDetails = async () => {
        try {
            await router.post(route('admin.b2b-bookings.send-payment-details', booking.id));
        } catch (error) {
            console.error('Send payment details failed:', error);
        }
    };

    const handleSendConfirmation = async () => {
        try {
            await router.post(route('admin.b2b-bookings.send-confirmation', booking.id));
        } catch (error) {
            console.error('Send confirmation failed:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateOnly = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AdminLayout>
            <Head title={`Booking ${booking.booking_reference}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.b2b-bookings.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Bookings
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{booking.booking_reference}</h1>
                            <p className="text-muted-foreground">Invoice: {booking.invoice_number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                            {statusLabels[booking.status as keyof typeof statusLabels]}
                        </Badge>
                        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                            <DialogTrigger asChild>
                                <Button>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Update Status
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update Booking Status</DialogTitle>
                                    <DialogDescription>Update status for booking {booking.booking_reference}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="status">New Status</Label>
                                        <Select value={newStatus} onValueChange={setNewStatus}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select new status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="notes"
                                            value={statusNotes}
                                            onChange={(e) => setStatusNotes(e.target.value)}
                                            placeholder="Add notes for this status update..."
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleStatusUpdate} disabled={!newStatus}>
                                            Update Status
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Booking Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Booking Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Booking Reference</Label>
                                        <p className="font-medium">{booking.booking_reference}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Invoice Number</Label>
                                        <p className="font-medium">{booking.invoice_number}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                                        <p>{formatDate(booking.created_at)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                        <p>{formatDate(booking.updated_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Package Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Package Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Package Name</Label>
                                    <p className="font-medium">{booking.package.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Destination</Label>
                                    <p>{booking.package.destination}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                                        <p>{booking.package.duration_days} Days</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Travelers</Label>
                                        <p>{booking.travelers_count} person(s)</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Departure Date</Label>
                                        <p>{formatDateOnly(booking.package.departure_date)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Return Date</Label>
                                        <p>{formatDateOnly(booking.package.return_date)}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                    <p className="text-sm">{booking.package.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Travelers */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Travelers ({booking.travelers_count})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Passport Number</TableHead>
                                                <TableHead>Date of Birth</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Email</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {booking.traveler_details.map((traveler, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{traveler.name}</TableCell>
                                                    <TableCell>{traveler.passport_number}</TableCell>
                                                    <TableCell>{formatDateOnly(traveler.date_of_birth)}</TableCell>
                                                    <TableCell>{traveler.phone}</TableCell>
                                                    <TableCell>{traveler.email}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Special Requests */}
                        {booking.special_requests && booking.special_requests.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Special Requests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-inside list-disc space-y-1">
                                        {booking.special_requests.map((request, index) => (
                                            <li key={index} className="text-sm">
                                                {request}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Status Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {booking.status_history && booking.status_history.length > 0 ? (
                                        booking.status_history.map((entry, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className={`h-3 w-3 rounded-full ${
                                                            entry.to_status === 'confirmed'
                                                                ? 'bg-green-500'
                                                                : entry.to_status === 'rejected'
                                                                  ? 'bg-red-500'
                                                                  : 'bg-yellow-500'
                                                        }`}
                                                    ></div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium">
                                                            {entry.to_status === 'pending'
                                                                ? 'Booking Created'
                                                                : entry.to_status === 'confirmed'
                                                                  ? 'Booking Confirmed'
                                                                  : entry.to_status === 'rejected'
                                                                    ? 'Booking Rejected'
                                                                    : entry.to_status}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</p>
                                                    </div>
                                                    {entry.notes && <p className="mt-1 text-sm text-muted-foreground">{entry.notes}</p>}
                                                    {entry.admin_id && <p className="mt-1 text-xs text-muted-foreground">Processed by Admin</p>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No status history available</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Notes */}
                        {booking.admin_notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admin Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm whitespace-pre-wrap">{booking.admin_notes}</div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Partner Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Partner Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
                                    <p className="font-medium">{booking.partner.b2b_verification?.company_name || booking.partner.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Contact Person</Label>
                                    <p>{booking.partner.b2b_verification?.contact_person || booking.partner.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                    <p className="flex items-center gap-2">
                                        {booking.partner.b2b_verification?.contact_email || booking.partner.email}
                                        <Mail className="h-4 w-4" />
                                    </p>
                                </div>
                                {booking.partner.b2b_verification?.contact_phone && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                                        <p className="flex items-center gap-2">
                                            {booking.partner.b2b_verification.contact_phone}
                                            <Phone className="h-4 w-4" />
                                        </p>
                                    </div>
                                )}
                                {booking.partner.b2b_verification?.company_address && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                                        <p className="text-sm">{booking.partner.b2b_verification.company_address}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Amount</span>
                                    <span className="font-medium">{formatCurrency(booking.total_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">B2B Discount</span>
                                    <span className="font-medium text-green-600">-{formatCurrency(booking.b2b_discount)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Final Amount</span>
                                        <span className="text-lg font-bold">{formatCurrency(booking.final_amount)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {booking.payment_due_date && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Payment Due Date</Label>
                                        <p>{formatDateOnly(booking.payment_due_date)}</p>
                                    </div>
                                )}
                                {booking.payment_received_at && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Payment Received</Label>
                                        <p>{formatDate(booking.payment_received_at)}</p>
                                    </div>
                                )}
                                {booking.processed_by && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Processed By</Label>
                                        <p>{booking.processed_by.name}</p>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    {booking.status === 'pending' && (
                                        <Button onClick={handleSendPaymentDetails} size="sm" className="flex-1">
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Payment Details
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* WhatsApp Messages */}
                        {booking.whatsapp_messages && booking.whatsapp_messages.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        WhatsApp Messages
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {booking.whatsapp_messages.map((message, index) => (
                                            <div key={index} className="rounded-lg border p-3">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-sm font-medium capitalize">{message.type.replace('_', ' ')}</span>
                                                    <Badge variant={message.sent ? 'default' : 'destructive'}>
                                                        {message.sent ? 'Sent' : 'Failed'}
                                                    </Badge>
                                                </div>
                                                <p className="mb-2 text-sm text-muted-foreground">{message.message}</p>
                                                <p className="text-xs text-muted-foreground">{formatDate(message.timestamp)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
