import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Eye, Filter, Search, Send, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface B2BBooking {
    id: number;
    booking_reference: string;
    invoice_number: string;
    travelers_count: number;
    final_amount: number;
    status: string;
    created_at: string;
    partner: {
        id: number;
        name: string;
        email: string;
        b2b_verification?: {
            company_name: string;
            contact_person: string;
        };
    };
    package: {
        id: number;
        name: string;
        destination: string;
    };
    processed_by?: {
        name: string;
    };
}

interface Stats {
    total_bookings: number;
    pending_bookings: number;
    payment_pending: number;
    payment_received: number;
    confirmed_bookings: number;
    cancelled_bookings: number;
    total_revenue: number;
    pending_revenue: number;
}

interface B2BBookingsProps {
    bookings: {
        data: B2BBooking[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: Stats;
    filters: {
        status?: string;
        partner_id?: string;
        date_from?: string;
        date_to?: string;
        search?: string;
    };
}

export default function B2BBookingsIndex({ bookings, stats, filters }: B2BBookingsProps) {
    const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
    const [bulkAction, setBulkAction] = useState<string>('');
    const [bulkNotes, setBulkNotes] = useState<string>('');
    const [showBulkDialog, setShowBulkDialog] = useState(false);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<B2BBooking | null>(null);
    const [statusNotes, setStatusNotes] = useState<string>('');

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

    const handleSearch = (search: string) => {
        router.get(
            route('admin.b2b-bookings.index'),
            {
                ...filters,
                search: search || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(
            route('admin.b2b-bookings.index'),
            {
                ...filters,
                status: status || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleBulkAction = async () => {
        if (selectedBookings.length === 0 || !bulkAction) return;

        try {
            await router.post(route('admin.b2b-bookings.bulk-update'), {
                booking_ids: selectedBookings,
                status: bulkAction,
                notes: bulkNotes,
            });

            setSelectedBookings([]);
            setBulkAction('');
            setBulkNotes('');
            setShowBulkDialog(false);
        } catch (error) {
            console.error('Bulk update failed:', error);
        }
    };

    const handleStatusUpdate = async (booking: B2BBooking, status: string) => {
        try {
            await router.post(route('admin.b2b-bookings.update-status', booking.id), {
                status,
                notes: statusNotes,
            });

            setShowStatusDialog(false);
            setStatusNotes('');
        } catch (error) {
            console.error('Status update failed:', error);
        }
    };

    const handleSendPaymentDetails = async (booking: B2BBooking) => {
        try {
            await router.post(route('admin.b2b-bookings.send-payment-details', booking.id));
        } catch (error) {
            console.error('Send payment details failed:', error);
        }
    };

    const handleSendConfirmation = async (booking: B2BBooking) => {
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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AdminLayout>
            <Head title="B2B Bookings Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">B2B Bookings</h1>
                        <p className="text-muted-foreground">Manage B2B partner bookings and payments</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedBookings.length > 0 && (
                            <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Bulk Actions ({selectedBookings.length})</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Bulk Update Status</DialogTitle>
                                        <DialogDescription>Update status for {selectedBookings.length} selected bookings</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="bulk-status">Status</Label>
                                            <Select value={bulkAction} onValueChange={setBulkAction}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                                    <SelectItem value="rejected">Rejected</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="bulk-notes">Notes (Optional)</Label>
                                            <Textarea
                                                id="bulk-notes"
                                                value={bulkNotes}
                                                onChange={(e) => setBulkNotes(e.target.value)}
                                                placeholder="Add notes for this bulk update..."
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleBulkAction} disabled={!bulkAction}>
                                                Update {selectedBookings.length} Bookings
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_bookings}</div>
                                <p className="text-xs text-muted-foreground">All time bookings</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pending_bookings}</div>
                                <p className="text-xs text-muted-foreground">Awaiting payment</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.confirmed_bookings}</div>
                                <p className="text-xs text-muted-foreground">Active bookings</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
                                <p className="text-xs text-muted-foreground">From confirmed bookings</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search bookings..."
                                        defaultValue={filters.search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select value={filters.status || ''} onValueChange={handleStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Statuses</SelectItem>
                                        {Object.entries(statusLabels).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="date-from">Date From</Label>
                                <Input
                                    id="date-from"
                                    type="date"
                                    defaultValue={filters.date_from}
                                    onChange={(e) => {
                                        router.get(
                                            route('admin.b2b-bookings.index'),
                                            {
                                                ...filters,
                                                date_from: e.target.value || undefined,
                                            },
                                            { preserveState: true, replace: true },
                                        );
                                    }}
                                />
                            </div>
                            <div>
                                <Label htmlFor="date-to">Date To</Label>
                                <Input
                                    id="date-to"
                                    type="date"
                                    defaultValue={filters.date_to}
                                    onChange={(e) => {
                                        router.get(
                                            route('admin.b2b-bookings.index'),
                                            {
                                                ...filters,
                                                date_to: e.target.value || undefined,
                                            },
                                            { preserveState: true, replace: true },
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bookings ({bookings.total})</CardTitle>
                        <CardDescription>Manage B2B partner bookings and track payment status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedBookings.length === bookings.data.length && bookings.data.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedBookings(bookings.data.map((b) => b.id));
                                                    } else {
                                                        setSelectedBookings([]);
                                                    }
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead>Booking Reference</TableHead>
                                        <TableHead>Partner</TableHead>
                                        <TableHead>Package</TableHead>
                                        <TableHead>Travelers</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.data.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBookings.includes(booking.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedBookings([...selectedBookings, booking.id]);
                                                        } else {
                                                            setSelectedBookings(selectedBookings.filter((id) => id !== booking.id));
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{booking.booking_reference}</div>
                                                <div className="text-sm text-muted-foreground">{booking.invoice_number}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {booking.partner.b2b_verification?.company_name || booking.partner.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{booking.partner.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{booking.package.name}</div>
                                                <div className="text-sm text-muted-foreground">{booking.package.destination}</div>
                                            </TableCell>
                                            <TableCell>{booking.travelers_count}</TableCell>
                                            <TableCell className="font-medium">{formatCurrency(booking.final_amount)}</TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                                                    {statusLabels[booking.status as keyof typeof statusLabels]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(booking.created_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Link href={route('admin.b2b-bookings.show', booking.id)}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>

                                                    {booking.status === 'pending' && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleSendPaymentDetails(booking)}>
                                                            <Send className="h-4 w-4" />
                                                        </Button>
                                                    )}

                                                    <Dialog
                                                        open={showStatusDialog && selectedBooking?.id === booking.id}
                                                        onOpenChange={(open) => {
                                                            setShowStatusDialog(open);
                                                            if (open) {
                                                                setSelectedBooking(booking);
                                                            } else {
                                                                setSelectedBooking(null);
                                                            }
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Update Booking Status</DialogTitle>
                                                                <DialogDescription>
                                                                    Update status for booking {booking.booking_reference}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <Label htmlFor="status">New Status</Label>
                                                                    <Select value="" onValueChange={(value) => handleStatusUpdate(booking, value)}>
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
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {bookings.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {(bookings.current_page - 1) * bookings.per_page + 1} to{' '}
                                    {Math.min(bookings.current_page * bookings.per_page, bookings.total)} of {bookings.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    {bookings.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                router.get(
                                                    route('admin.b2b-bookings.index'),
                                                    {
                                                        ...filters,
                                                        page: bookings.current_page - 1,
                                                    },
                                                    { preserveState: true },
                                                );
                                            }}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {bookings.current_page < bookings.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                router.get(
                                                    route('admin.b2b-bookings.index'),
                                                    {
                                                        ...filters,
                                                        page: bookings.current_page + 1,
                                                    },
                                                    { preserveState: true },
                                                );
                                            }}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
