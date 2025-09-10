import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Section */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h1 className="mb-2 text-2xl font-bold text-foreground">Welcome to Cahaya Anbiya</h1>
                    <p className="text-muted-foreground">Your travel dashboard is ready. Explore our services and manage your bookings.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <span className="text-lg text-primary">✈️</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                                <p className="text-2xl font-bold text-foreground">3</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                                <span className="text-lg text-secondary">🏨</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Upcoming Trips</p>
                                <p className="text-2xl font-bold text-foreground">2</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                                <span className="text-lg text-accent">💳</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                                <p className="text-2xl font-bold text-foreground">Rp 45M</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm text-primary">📅</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">Umrah booking confirmed</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                                <span className="text-sm text-secondary">💳</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">Payment completed</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                                <span className="text-sm text-accent">📧</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">Travel documents received</p>
                                <p className="text-xs text-muted-foreground">3 days ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        <button className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                            <span className="text-lg">🔍</span>
                            <div className="text-left">
                                <p className="font-medium text-foreground">Browse Packages</p>
                                <p className="text-sm text-muted-foreground">Find your next adventure</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                            <span className="text-lg">📞</span>
                            <div className="text-left">
                                <p className="font-medium text-foreground">Contact Support</p>
                                <p className="text-sm text-muted-foreground">Get help anytime</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                            <span className="text-lg">📋</span>
                            <div className="text-left">
                                <p className="font-medium text-foreground">View Bookings</p>
                                <p className="text-sm text-muted-foreground">Manage your trips</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                            <span className="text-lg">⚙️</span>
                            <div className="text-left">
                                <p className="font-medium text-foreground">Account Settings</p>
                                <p className="text-sm text-muted-foreground">Update your profile</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
