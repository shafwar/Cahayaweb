import { RippleButton } from '@/components/ui/ripple-button';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function SelectMode() {
    // Container animation variants untuk staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    // Card animation variants dengan enhanced hover effects
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: 'blur(10px)'
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.7,
                ease: [0.25, 0.25, 0, 1] // Custom cubic bezier untuk smooth easing
            }
        }
    };

    // Button hover animation variants
    const buttonVariants = {
        rest: { scale: 1, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" },
        hover: {
            scale: 1.02,
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.25)",
            transition: { duration: 0.2, ease: "easeOut" }
        },
        tap: { scale: 0.98, transition: { duration: 0.1 } }
    };

    return (
        <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-6 text-foreground">
            <Head title="Welcome" />

            {/* Enhanced background glow effects dengan lebih banyak lapisan */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(188,142,46,0.18),transparent_60%)] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-10 h-[400px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(130,26,101,0.15),transparent_60%)] blur-2xl" />
            {/* Tambahan subtle glow untuk depth */}
            <div className="pointer-events-none absolute right-10 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(188,142,46,0.08),transparent_70%)] blur-xl" />

            <motion.div
                className="z-10 grid w-full max-w-6xl gap-12"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Header Section dengan improved typography */}
                <motion.div
                    className="text-center"
                    variants={cardVariants}
                >
                    <motion.h1
                        className="bg-gradient-to-br from-accent via-primary to-secondary bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl"
                        style={{
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em' // Tighter letter spacing untuk font besar
                        }}
                    >
                        Cahaya Anbiya Wisata
                    </motion.h1>
                    <motion.p
                        className="mt-6 text-lg text-muted-foreground md:text-xl"
                        style={{
                            lineHeight: '1.6',
                            letterSpacing: '0.01em'
                        }}
                        variants={cardVariants}
                    >
                        Choose your experience
                    </motion.p>
                </motion.div>

                {/* Cards Grid dengan enhanced glassmorphism */}
                <motion.div
                    className="grid grid-cols-1 gap-8 md:grid-cols-2"
                    variants={containerVariants}
                >
                    {/* B2B Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
                            transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        className="group relative overflow-hidden rounded-3xl border border-white/20 bg-card/60 p-10 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/40"
                        style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                        }}
                    >
                        {/* Subtle inner glow pada hover */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Content */}
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold leading-tight tracking-tight">
                                Business to Business
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                                Tailored solutions for travel agencies and corporate partners.
                            </p>

                            {/* Button container dengan improved spacing */}
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                                <Link href={route('b2b.index')}>
                                    <motion.div
                                        variants={buttonVariants}
                                        initial="rest"
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <RippleButton className="w-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-primary/25 sm:w-auto">
                                            Enter B2B
                                        </RippleButton>
                                    </motion.div>
                                </Link>
                                <motion.a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-medium text-accent underline-offset-4 transition-all duration-200 hover:text-accent/80 hover:underline"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    WhatsApp Corporate
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>

                    {/* B2C Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
                            transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        className="group relative overflow-hidden rounded-3xl border border-white/20 bg-card/60 p-10 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/40"
                        style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                        }}
                    >
                        {/* Subtle inner glow pada hover */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Content */}
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold leading-tight tracking-tight">
                                Business to Consumer
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                                Explore destinations, packages, blogs, and more.
                            </p>

                            {/* Button container dengan layout yang seimbang */}
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                                <Link href={route('b2c.home')}>
                                    <motion.div
                                        variants={buttonVariants}
                                        initial="rest"
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <RippleButton className="w-full bg-secondary px-8 py-4 text-lg font-semibold text-secondary-foreground shadow-lg transition-all duration-300 hover:shadow-secondary/25 sm:w-auto">
                                            Enter Website
                                        </RippleButton>
                                    </motion.div>
                                </Link>
                                <motion.a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-medium text-accent underline-offset-4 transition-all duration-200 hover:text-accent/80 hover:underline"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    WhatsApp Personal
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer dengan improved spacing dan typography */}
                <motion.footer
                    className="text-center text-sm text-muted-foreground"
                    variants={cardVariants}
                    style={{ letterSpacing: '0.02em' }}
                >
                    © {new Date().getFullYear()} PT Cahaya Anbiya Wisata
                </motion.footer>
            </motion.div>
        </div>
    );
}
