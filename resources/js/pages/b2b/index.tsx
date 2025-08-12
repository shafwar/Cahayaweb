import PlaceholderImage from '@/components/media/placeholder-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RippleButton } from '@/components/ui/ripple-button';
import B2BLayout from '@/layouts/b2b-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function B2BIndex() {
    return (
        <B2BLayout>
            <Head title="B2B" />
            <main className="mx-auto grid max-w-7xl gap-8 p-6">
                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-2xl border bg-card/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur supports-[backdrop-filter]:bg-card/70"
                >
                    <h2 className="text-xl font-semibold">Agency Information</h2>
                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                        <div>
                            <div>License: Tour &amp; Travel</div>
                            <div>Email: hello@cahaya-anbiya.com</div>
                        </div>
                        <div>
                            <div>Phone/WA: +62 812-3456-7890</div>
                            <div>Address: Jakarta, Indonesia</div>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="rounded-2xl border bg-card/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur supports-[backdrop-filter]:bg-card/70"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Exclusive Packages</h2>
                        <a href="#" className="text-sm text-accent hover:underline">
                            See all
                        </a>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Dialog key={i}>
                                <DialogTrigger asChild>
                                    <motion.article whileHover={{ y: -3 }} className="cursor-pointer overflow-hidden rounded-xl border">
                                        <PlaceholderImage className="aspect-video" />
                                        <div className="p-4">
                                            <h3 className="font-medium">Corporate Package {i}</h3>
                                            <p className="text-sm text-muted-foreground">Short description for agencies.</p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <RippleButton className="bg-primary px-3 py-1.5 text-sm">Request Quote</RippleButton>
                                                <span className="text-sm text-accent underline">Details</span>
                                            </div>
                                        </div>
                                    </motion.article>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Corporate Package {i}</DialogTitle>
                                        <DialogDescription>
                                            Premium itinerary crafted for agency partners. Includes flexible dates, competitive rates, and dedicated
                                            support.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-2 grid gap-3 text-sm">
                                        <div className="rounded-md border p-3">Highlights: Hotel 4*, halal meals, tour leader</div>
                                        <div className="rounded-md border p-3">Duration: 6D5N · Price: On request</div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </motion.section>
            </main>
        </B2BLayout>
    );
}
