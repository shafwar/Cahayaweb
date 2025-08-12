import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function PackagesIndex() {
    return (
        <PublicLayout>
            <Head title="Packages" />
            <section className="mx-auto max-w-6xl p-6 md:p-10">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-3xl font-semibold">Packages</h1>
                        <p className="text-muted-foreground">Filter by type, price, duration, pax.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        <select className="rounded-md border bg-background p-2 text-sm">
                            <option>Type</option>
                        </select>
                        <select className="rounded-md border bg-background p-2 text-sm">
                            <option>Price</option>
                        </select>
                        <select className="rounded-md border bg-background p-2 text-sm">
                            <option>Duration</option>
                        </select>
                        <select className="rounded-md border bg-background p-2 text-sm">
                            <option>Pax</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(9)].map((_, i) => (
                        <motion.article
                            key={i}
                            className="overflow-hidden rounded-xl border"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="aspect-video bg-muted" />
                            <div className="p-4">
                                <h3 className="font-medium">Itinerary {i + 1}</h3>
                                <p className="text-sm text-muted-foreground">Location · 6D5N · Start from $1,299</p>
                                <Link
                                    href={route('b2c.packages.show', 'itinerary-' + (i + 1))}
                                    className="mt-3 inline-block text-sm text-accent hover:underline"
                                >
                                    View details
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
