import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <PublicLayout>
            <Head title="About" />
            <section className="mx-auto max-w-6xl p-6 md:p-10">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-semibold"
                >
                    About Us
                </motion.h1>
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-3">
                        <h2 className="text-xl font-semibold">Company Profile</h2>
                        <p className="text-muted-foreground">
                            PT Cahaya Anbiya Wisata is a travel company committed to memorable and comfortable journeys.
                        </p>
                        <h2 className="pt-4 text-xl font-semibold">Vision & Mission</h2>
                        <ul className="list-disc pl-5 text-muted-foreground">
                            <li>Deliver inspiring halal-friendly travel experiences.</li>
                            <li>Prioritize safety, comfort, and authenticity.</li>
                        </ul>
                        <h2 className="pt-4 text-xl font-semibold">Core Values</h2>
                        <ul className="list-disc pl-5 text-muted-foreground">
                            <li>Integrity</li>
                            <li>Hospitality</li>
                            <li>Excellence</li>
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[4/3] rounded-xl bg-muted" />
                        ))}
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
