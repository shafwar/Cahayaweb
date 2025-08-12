import { RippleButton } from '@/components/ui/ripple-button';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function SelectMode() {
    return (
        <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-6 text-foreground">
            <Head title="Welcome" />
            {/* subtle background glow */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(188,142,46,0.18),transparent_60%)]" />
            <div className="pointer-events-none absolute -bottom-40 left-10 h-[400px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(130,26,101,0.15),transparent_60%)]" />

            <motion.div
                className="z-10 grid w-full max-w-5xl gap-10"
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <div className="text-center">
                    <motion.h1
                        className="bg-gradient-to-br from-accent via-primary to-secondary bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        Cahaya Anbiya Wisata
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                        className="mt-3 text-muted-foreground"
                    >
                        Choose your experience
                    </motion.p>
                </div>

                <motion.div
                    className="grid grid-cols-1 gap-6 md:grid-cols-2"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                >
                    <motion.div
                        whileHover={{ y: -3 }}
                        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                        className="rounded-2xl border bg-card/90 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur supports-[backdrop-filter]:bg-card/70"
                    >
                        <h2 className="text-2xl font-semibold">Business to Business</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Tailored solutions for travel agencies and corporate partners.</p>
                        <div className="mt-6 flex items-center gap-3">
                            <Link href={route('b2b.index')}>
                                <RippleButton className="bg-primary text-primary-foreground">Enter B2B</RippleButton>
                            </Link>
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-sm text-accent underline">
                                WhatsApp Corporate
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -3 }}
                        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                        className="rounded-2xl border bg-card/90 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur supports-[backdrop-filter]:bg-card/70"
                    >
                        <h2 className="text-2xl font-semibold">Business to Consumer</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Explore destinations, packages, blogs, and more.</p>
                        <div className="mt-6">
                            <Link href={route('b2c.home')}>
                                <RippleButton className="bg-secondary text-secondary-foreground">Enter Website</RippleButton>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>

                <footer className="text-center text-xs text-muted-foreground">© {new Date().getFullYear()} PT Cahaya Anbiya Wisata</footer>
            </motion.div>
        </div>
    );
}
