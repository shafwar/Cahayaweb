import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function BlogIndex() {
    return (
        <PublicLayout>
            <Head title="Blog" />
            <section className="mx-auto max-w-6xl p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Blog</h1>
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
                                <h3 className="font-medium">Article {i + 1}</h3>
                                <p className="text-sm text-muted-foreground">Latest news, activities, and food stories.</p>
                                <Link href="#" className="mt-3 inline-block text-sm text-accent hover:underline">
                                    Read more
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
