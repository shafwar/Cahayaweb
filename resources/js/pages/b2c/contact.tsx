import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Contact() {
    return (
        <PublicLayout>
            <Head title="Contact" />
            <div className="min-h-screen w-full bg-black">
                <section className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl font-bold text-white md:text-4xl">
                            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent">Contact Us</span>
                        </h1>
                        <p className="mt-2 text-gray-300">We'd love to hear from you. Send us a message and we'll get back to you soon.</p>
                    </motion.div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <motion.form
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid gap-4 rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm"
                        >
                            <div className="grid gap-1">
                                <label className="text-sm text-gray-300">Name</label>
                                <input
                                    className="rounded-md border border-white/15 bg-black/60 p-3 text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm text-gray-300">Nationality</label>
                                <input
                                    className="rounded-md border border-white/15 bg-black/60 p-3 text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                                    placeholder="Indonesia"
                                />
                            </div>
                            <div className="grid gap-1 md:grid-cols-2 md:items-center md:gap-3">
                                <div>
                                    <label className="text-sm text-gray-300">Group Size</label>
                                    <input
                                        className="mt-1 w-full rounded-md border border-white/15 bg-black/60 p-3 text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                                        placeholder="4"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300">WhatsApp</label>
                                    <input
                                        className="mt-1 w-full rounded-md border border-white/15 bg-black/60 p-3 text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                                        placeholder="+62"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-1 md:grid-cols-2 md:items-center md:gap-3">
                                <div>
                                    <label className="text-sm text-gray-300">Email</label>
                                    <input
                                        className="mt-1 w-full rounded-md border border-white/15 bg-black/60 p-3 text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                                        placeholder="you@mail.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300">Notes</label>
                                    <input
                                        className="mt-1 w-full rounded-md border border-white/15 bg-black/60 p-3 text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                                        placeholder="Trip preferences"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="mt-2 rounded-md bg-amber-400 px-4 py-3 font-semibold text-black shadow-lg transition-colors duration-300 hover:bg-amber-300"
                            >
                                Send Message
                            </button>
                        </motion.form>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="grid content-start gap-4"
                        >
                            <div className="rounded-xl border border-white/15 bg-white/5 p-6 text-white">
                                <h3 className="font-semibold">Alternative Contacts</h3>
                                <p className="text-sm text-gray-300">Email: hello@cahaya-anbiya.com</p>
                                <p className="text-sm text-gray-300">WhatsApp: +62 812-3456-7890</p>
                            </div>
                            <div className="rounded-xl border border-white/15 bg-white/5 p-6 text-white">
                                <h3 className="font-semibold">Social Media</h3>
                                <div className="mt-2 flex gap-4 text-sm">
                                    <a href="#" className="hover:text-amber-300">
                                        Instagram
                                    </a>
                                    <a href="#" className="hover:text-amber-300">
                                        TikTok
                                    </a>
                                    <a href="#" className="hover:text-amber-300">
                                        YouTube
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 bg-black">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:flex md:items-center md:justify-between md:px-6 md:py-12 lg:px-8 xl:px-10"
                    >
                        <div className="text-center text-xs leading-relaxed text-gray-400 sm:text-left md:text-sm">
                            <div className="font-medium text-white">Email: hello@cahaya-anbiya.com</div>
                            <div className="mt-0.5 font-medium text-white">WhatsApp: +62 812-3456-7890</div>
                            <div className="mt-0.5">24/7 Customer Support</div>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-4 text-xs sm:mt-6 sm:gap-6 md:mt-0 md:text-sm">
                            {[
                                { name: 'Instagram', url: 'https://instagram.com' },
                                { name: 'TikTok', url: 'https://tiktok.com' },
                                { name: 'YouTube', url: 'https://youtube.com' },
                            ].map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-gray-300 transition-colors duration-200 hover:text-amber-300"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {social.name}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </footer>
            </div>
        </PublicLayout>
    );
}
