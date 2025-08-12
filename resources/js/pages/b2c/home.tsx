import PlaceholderImage from '@/components/media/placeholder-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
}

const slidesSeed: Slide[] = [
    { id: 1, title: 'Umrah Premium', subtitle: 'Comfort-first journeys', image: '/images/hero-1.jpg' },
    { id: 2, title: 'Turkey Highlights', subtitle: 'Istanbul to Cappadocia', image: '/images/hero-2.jpg' },
    { id: 3, title: 'Bali Serenity', subtitle: 'Island escapes', image: '/images/hero-3.jpg' },
    { id: 4, title: 'Jordan Discovery', subtitle: 'Wadi Rum & Petra', image: '/images/hero-4.jpg' },
    { id: 5, title: 'Halal Culinary', subtitle: 'Taste the world', image: '/images/hero-5.jpg' },
];

export default function Home() {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % slidesSeed.length), 5000);
        return () => clearInterval(t);
    }, []);

    const slide = slidesSeed[index];

    return (
        <PublicLayout>
            <Head title="Home" />
            <section className="relative">
                <div className="aspect-[16/7] w-full overflow-hidden bg-muted [perspective:1000px]">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={slide.id}
                            src={slide.image}
                            alt={slide.title}
                            loading="lazy"
                            className="size-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                            initial={{ opacity: 0, scale: 1.05, rotateX: 2 }}
                            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 0.98, rotateX: -2 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                    <motion.div
                        className="absolute inset-0 flex items-end p-6 md:p-10"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="max-w-3xl text-white">
                            <h1 className="text-3xl font-semibold md:text-5xl">{slide.title}</h1>
                            <p className="mt-2 opacity-90 md:text-lg">{slide.subtitle}</p>
                            <Link
                                href="#packages"
                                className="mt-6 inline-block rounded-md bg-accent px-5 py-2 text-sm font-medium text-accent-foreground shadow-lg hover:brightness-110"
                            >
                                Explore packages
                            </Link>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute right-0 bottom-4 left-0 flex items-center justify-center gap-2">
                    {slidesSeed.map((s, i) => (
                        <button
                            aria-label={`Slide ${i + 1}`}
                            key={s.id}
                            className={`size-2 rounded-full transition ${i === index ? 'bg-accent' : 'bg-white/60'}`}
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>
            </section>

            <section id="packages" className="mx-auto max-w-6xl p-6 md:p-10">
                <h2 className="text-2xl font-semibold">Best Sellers</h2>
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Dialog key={i}>
                            <DialogTrigger asChild>
                                <motion.article
                                    className="cursor-pointer overflow-hidden rounded-xl border"
                                    whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <PlaceholderImage className="aspect-video" />
                                    <div className="p-4">
                                        <h3 className="font-medium">Itinerary {i}</h3>
                                        <p className="text-sm text-muted-foreground">Short description here.</p>
                                    </div>
                                </motion.article>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Itinerary {i}</DialogTitle>
                                    <DialogDescription>
                                        Explore a curated journey with beautiful stays and halal-friendly experiences. Perfect for families and small
                                        groups.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-2 grid gap-3 text-sm">
                                    <div className="rounded-md border p-3">Location: Multi-city · Duration: 6D5N</div>
                                    <div className="rounded-md border p-3">Highlights: Scenic spots, culinary, culture</div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl p-6 md:p-10">
                <h2 className="text-2xl font-semibold">New Destinations</h2>
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Dialog key={i}>
                            <DialogTrigger asChild>
                                <motion.article
                                    className="cursor-pointer overflow-hidden rounded-xl border"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <PlaceholderImage className="aspect-video" />
                                    <div className="p-4">
                                        <h3 className="font-medium">Blog Article {i}</h3>
                                        <p className="text-sm text-muted-foreground">Recently added insights.</p>
                                    </div>
                                </motion.article>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Blog Article {i}</DialogTitle>
                                    <DialogDescription>Short preview of the article. Click read more to continue on the blog page.</DialogDescription>
                                </DialogHeader>
                                <div className="text-sm">This article covers travel tips, culture, and food highlights from our latest journeys.</div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl p-6 md:p-10">
                <h2 className="text-2xl font-semibold">Highlights</h2>
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Dialog key={i}>
                            <DialogTrigger asChild>
                                <motion.article
                                    className="cursor-pointer overflow-hidden rounded-xl border"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    transition={{ duration: 0.35 }}
                                >
                                    <PlaceholderImage className="aspect-video" />
                                    <div className="p-4">
                                        <h3 className="font-medium">Highlight {i}</h3>
                                        <p className="text-sm text-muted-foreground">Why travelers love this.</p>
                                    </div>
                                </motion.article>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Highlight {i}</DialogTitle>
                                    <DialogDescription>A quick spotlight on what makes this special.</DialogDescription>
                                </DialogHeader>
                                <div className="text-sm">
                                    From stunning landscapes to unique local experiences, this highlight captures the essence of the destination.
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </section>

            <footer className="border-t">
                <div className="mx-auto grid max-w-6xl gap-3 p-6 md:flex md:items-center md:justify-between md:p-10">
                    <div className="text-sm text-muted-foreground">
                        <div>Email: hello@cahaya-anbiya.com</div>
                        <div>WhatsApp: +62 812-3456-7890</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-accent">
                            Instagram
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-accent">
                            TikTok
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-accent">
                            YouTube
                        </a>
                    </div>
                </div>
            </footer>
        </PublicLayout>
    );
}
