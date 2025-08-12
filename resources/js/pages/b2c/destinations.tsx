import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Destinations() {
    return (
        <PublicLayout>
            <Head title="Destinations" />
            <section className="mx-auto max-w-6xl p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Destinations</h1>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(9)].map((_, i) => (
                        <motion.article
                            key={i}
                            className="overflow-hidden rounded-xl border"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-120px' }}
                        >
                            <div className="aspect-video bg-muted" />
                            <div className="p-4">
                                <h3 className="font-medium">Destination {i + 1}</h3>
                                <p className="text-sm text-muted-foreground">Short description and highlights.</p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
