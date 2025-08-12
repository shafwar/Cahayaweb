import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Highlights() {
    return (
        <PublicLayout>
            <Head title="Highlights" />
            <section className="mx-auto max-w-6xl p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Highlights</h1>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <motion.article
                            key={i}
                            className="overflow-hidden rounded-xl border"
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="aspect-video bg-muted" />
                            <div className="p-4">
                                <h3 className="font-medium">Highlight {i + 1}</h3>
                                <p className="text-sm text-muted-foreground">Explanation and key moments.</p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
