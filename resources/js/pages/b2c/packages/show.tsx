import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';

export default function PackageShow({ slug }: { slug: string }) {
    return (
        <PublicLayout>
            <Head title="Package Detail" />
            <section className="mx-auto max-w-6xl p-6 md:p-10">
                <nav className="text-sm text-muted-foreground">
                    <Link href={route('b2c.packages')} className="hover:text-accent">
                        Packages
                    </Link>{' '}
                    / <span>{slug}</span>
                </nav>
                <div className="mt-4 grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                        <div className="aspect-video rounded-xl bg-muted" />
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[4/3] rounded-md bg-muted" />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold">Itinerary Name</h1>
                        <p className="text-muted-foreground">Location · 6D5N · Max 30 pax</p>
                        <div className="mt-4 rounded-xl border p-4">
                            <h2 className="font-medium">Highlights</h2>
                            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                                <li>Comfort hotel</li>
                                <li>Halal meals</li>
                                <li>Expert guide</li>
                            </ul>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <span className="text-2xl font-semibold text-accent">$1,299</span>
                            <a href="#booking" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
                                Book now
                            </a>
                            <a href="#custom" className="rounded-md border px-4 py-2">
                                Custom request
                            </a>
                        </div>
                    </div>
                </div>
                <div id="booking" className="mt-10 grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border p-6">
                        <h3 className="font-medium">Booking</h3>
                        <p className="text-sm text-muted-foreground">Online deposit option and printable invoice (coming next phase).</p>
                    </div>
                    <div id="custom" className="rounded-xl border p-6">
                        <h3 className="font-medium">Custom Request</h3>
                        <p className="text-sm text-muted-foreground">Time, destination, guests, budget, notes.</p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
