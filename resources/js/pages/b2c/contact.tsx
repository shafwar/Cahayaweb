import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

export default function Contact() {
    return (
        <PublicLayout>
            <Head title="Contact" />
            {/* Dark theme wrapper - full width */}
            <div className="min-h-screen w-full bg-black">
                <section className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
                    <h1 className="text-3xl font-bold text-white md:text-4xl">
                        <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent">Contact Us</span>
                    </h1>
                    <p className="mt-2 text-gray-300">We'd love to hear from you. Send us a message and we'll get back to you soon.</p>
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <form className="grid gap-4 rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
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
                        </form>
                        <div className="grid content-start gap-4">
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
                        </div>
                    </div>
                </section>

                {/* Footer - consistent dark footer */}
                <footer className="border-t border-white/10 bg-black">
                    <div className="xs:px-4 xs:py-10 mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:flex md:items-center md:justify-between md:px-6 md:py-12 lg:px-8 xl:px-10">
                        {/* Contact Info */}
                        <div className="xs:text-sm text-center text-xs leading-relaxed text-gray-400 sm:text-left md:text-sm">
                            <div className="font-medium text-white">Email: hello@cahaya-anbiya.com</div>
                            <div className="xs:mt-1 mt-0.5 font-medium text-white">WhatsApp: +62 812-3456-7890</div>
                            <div className="xs:mt-1 mt-0.5">24/7 Customer Support</div>
                        </div>

                        {/* Social Links */}
                        <div className="xs:gap-5 xs:text-sm mt-4 flex items-center justify-center gap-4 text-xs sm:mt-6 sm:gap-6 md:mt-0 md:text-sm">
                            {[
                                { name: 'Instagram', url: 'https://instagram.com' },
                                { name: 'TikTok', url: 'https://tiktok.com' },
                                { name: 'YouTube', url: 'https://youtube.com' },
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-gray-300 transition-colors duration-200 hover:text-amber-300"
                                    style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>
        </PublicLayout>
    );
}
