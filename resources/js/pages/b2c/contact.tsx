import { EditableText } from '@/components/cms';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { useEffect } from 'react';

type ContactFlash = { type: string; message: string } | null;

export default function Contact({ flash }: { flash?: ContactFlash }) {
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    useEffect(() => {
        if (flash?.type === 'success' && flash.message) {
            form.reset();
            form.clearErrors();
        }
    }, [flash?.type, flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.clearErrors();
        form.post(route('b2c.contact.submit'), {
            preserveScroll: false,
            onSuccess: () => {
                form.reset();
                form.clearErrors();
            },
        });
    };

    const whatsappHref =
        typeof window !== 'undefined'
            ? `https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo! Saya ${form.data.name}\n\nEmail: ${form.data.email}\nTelepon: ${form.data.phone}\n\nPesan:\n${form.data.message}`,
              )}`
            : '#';

    const contactInfo = [
        {
            id: 1,
            icon: Phone,
            title: 'Phone',
            detail1: '+62 812-3456-7890',
            detail2: '24/7 Customer Support',
            color: 'from-blue-500/20 to-indigo-500/20',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500/30',
        },
        {
            id: 2,
            icon: Mail,
            title: 'Email',
            detail1: 'hello@cahaya-anbiya.com',
            detail2: 'info@cahaya-anbiya.com',
            color: 'from-purple-500/20 to-pink-500/20',
            iconColor: 'text-purple-400',
            borderColor: 'border-purple-500/30',
        },
        {
            id: 3,
            icon: MapPin,
            title: 'Office',
            detail1: 'Jakarta, Indonesia',
            detail2: 'Mon-Sat, 9AM-6PM',
            color: 'from-amber-500/20 to-orange-500/20',
            iconColor: 'text-amber-400',
            borderColor: 'border-amber-500/30',
        },
    ];

    return (
        <PublicLayout>
            <SeoHead
                title="Contact Us - Cahaya Anbiya Travel"
                description="Contact PT. Cahaya Anbiya Wisata Indonesia - Phone: 0812-1237-9190. Location: South Jakarta. Hours: Mon-Sat 08:00-17:00 WIB. Consult on Umrah, Hajj, and halal travel packages."
                keywords="kontak cahaya anbiya, alamat cahaya anbiya, telepon cahaya anbiya, customer service cahaya anbiya, jakarta selatan"
            />

            <div className="relative min-h-screen border-t border-[#d4af37]/20 bg-section-photos-home">
                {/* Sentuhan biru & oranye halus */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 h-[420px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(45,74,111,0.07),transparent_65%)] blur-3xl" />
                    <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.06),transparent_65%)] blur-3xl" />
                </div>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-10">
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                        {/* Header */}
                        <div className="mb-8 text-center md:mb-10">
                            <div className="mb-4 inline-block">
                                <div className="rounded-full border-2 border-[#ff5200] bg-[#ff5200]/15 px-4 py-1.5 shadow-md">
                                    <span className="text-xs font-bold tracking-wider text-[#e64a00] uppercase sm:text-sm">
                                        <EditableText sectionKey="contact.header.badge" value="✨ Get In Touch" tag="span" />
                                    </span>
                                </div>
                            </div>

                            <h1 className="mb-4 text-3xl leading-tight font-bold text-[#1e3a5f] sm:text-4xl md:text-5xl lg:text-6xl">
                                <EditableText sectionKey="contact.header.title" value="Contact Us" tag="span" />
                            </h1>

                            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base md:text-lg lg:text-xl">
                                <EditableText
                                    sectionKey="contact.header.description"
                                    value="Have questions about our travel packages? We're here to help you plan your perfect journey"
                                    tag="span"
                                />
                            </p>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
                            {contactInfo.map((info) => {
                                const IconComponent = info.icon;
                                return (
                                    <div
                                        key={info.id}
                                        className="group relative overflow-hidden rounded-xl border-2 border-[#d4af37]/25 bg-white p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:p-6"
                                    >
                                        <div className="relative text-center">
                                            <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-[#e8ecf4] p-3 shadow-md ring-1 ring-[#2d4a6f]/20">
                                                <IconComponent className="h-6 w-6 text-[#1e3a5f]" />
                                            </div>
                                            <h3 className="mb-2 text-lg font-bold text-[#1e3a5f]">
                                                <EditableText sectionKey={`contact.info.${info.id}.title`} value={info.title} tag="span" />
                                            </h3>
                                            <p className="text-sm text-[#475569]">
                                                <EditableText sectionKey={`contact.info.${info.id}.detail1`} value={info.detail1} tag="span" />
                                            </p>
                                            <p className="text-sm text-[#475569]">
                                                <EditableText sectionKey={`contact.info.${info.id}.detail2`} value={info.detail2} tag="span" />
                                            </p>
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#2d4a6f] via-[#ff5200] to-[#d4af37] transition-all duration-500 group-hover:w-full" />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Contact Form */}
                        <div className="mx-auto max-w-3xl">
                            <div className="relative overflow-hidden rounded-2xl border-2 border-[#d4af37]/25 bg-white p-6 shadow-2xl sm:p-8">
                                <div className="relative">
                                    <div className="mb-6 text-center">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-[#ff5200]/40 bg-[#fff4ee] px-4 py-2">
                                            <MessageSquare className="h-5 w-5 text-[#e64a00]" />
                                            <span className="text-sm font-bold text-[#e64a00]">
                                                <EditableText sectionKey="contact.form.badge" value="Send us a message" tag="span" />
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
                                            <EditableText sectionKey="contact.form.title" value="Quick Contact Form" tag="span" />
                                        </h2>
                                        <p className="mt-2 text-sm text-[#475569]">
                                            <EditableText sectionKey="contact.form.subtitle" value="We'll respond within 24 hours" tag="span" />
                                        </p>
                                    </div>

                                    {flash?.message ? (
                                        <div
                                            className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                                                flash.type === 'success'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                                                    : flash.type === 'error'
                                                      ? 'border-red-200 bg-red-50 text-red-900'
                                                      : 'border-slate-200 bg-slate-50 text-slate-800'
                                            }`}
                                            role="status"
                                        >
                                            {flash.message}
                                        </div>
                                    ) : null}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-[#1e3a5f]">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.data.name}
                                                onChange={(e) => form.setData('name', e.target.value)}
                                                className="w-full rounded-lg border border-[#d4af37]/30 bg-white px-4 py-3 text-[#1e3a5f] transition-all outline-none focus:border-[#ff5200] focus:ring-2 focus:ring-[#ff5200]/20"
                                                placeholder="Enter your name"
                                            />
                                            {form.errors.name ? (
                                                <p className="mt-1 text-xs font-medium text-red-600">{form.errors.name}</p>
                                            ) : null}
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-[#1e3a5f]">Email *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={form.data.email}
                                                    onChange={(e) => form.setData('email', e.target.value)}
                                                    className="w-full rounded-lg border border-[#d4af37]/30 bg-white px-4 py-3 text-[#1e3a5f] transition-all outline-none focus:border-[#ff5200] focus:ring-2 focus:ring-[#ff5200]/20"
                                                    placeholder="your@email.com"
                                                />
                                                {form.errors.email ? (
                                                    <p className="mt-1 text-xs font-medium text-red-600">{form.errors.email}</p>
                                                ) : null}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-[#1e3a5f]">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={form.data.phone}
                                                    onChange={(e) => form.setData('phone', e.target.value)}
                                                    className="w-full rounded-lg border border-[#d4af37]/30 bg-white px-4 py-3 text-[#1e3a5f] transition-all outline-none focus:border-[#ff5200] focus:ring-2 focus:ring-[#ff5200]/20"
                                                    placeholder="+62 812-xxxx-xxxx"
                                                />
                                                {form.errors.phone ? (
                                                    <p className="mt-1 text-xs font-medium text-red-600">{form.errors.phone}</p>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-[#1e3a5f]">Message *</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={form.data.message}
                                                onChange={(e) => form.setData('message', e.target.value)}
                                                className="w-full resize-none rounded-lg border border-[#d4af37]/30 bg-white px-4 py-3 text-[#1e3a5f] transition-all outline-none focus:border-[#ff5200] focus:ring-2 focus:ring-[#ff5200]/20"
                                                placeholder="Tell us about your travel plans..."
                                            />
                                            {form.errors.message ? (
                                                <p className="mt-1 text-xs font-medium text-red-600">{form.errors.message}</p>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                                            <button
                                                type="submit"
                                                disabled={form.processing}
                                                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff5200] to-[#ff6b35] px-6 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl disabled:pointer-events-none disabled:opacity-70"
                                            >
                                                {form.processing ? (
                                                    <>
                                                        <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
                                                        Mengirim…
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
                                                        Kirim ke tim kami (email)
                                                    </>
                                                )}
                                            </button>
                                            <a
                                                href={whatsappHref}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#25D366] bg-[#25D366]/10 px-6 py-4 text-base font-bold text-[#128C7E] shadow-md transition-all hover:bg-[#25D366]/20"
                                            >
                                                Chat WhatsApp
                                            </a>
                                        </div>
                                    </form>

                                    <p className="mt-5 text-center text-xs leading-relaxed text-[#64748b]">
                                        Setelah Anda mengirim formulir, tim kami menerima pesan melalui email resmi dan dapat membalas dari situ.
                                        Alternatif cepat: tombol WhatsApp membuka chat dengan nomor layanan pelanggan di atas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="mt-12 text-center">
                            <h3 className="mb-5 text-xl font-bold text-[#1e3a5f] sm:text-2xl">
                                <EditableText sectionKey="contact.social.title" value="Connect With Us" tag="span" />
                            </h3>
                            <div className="flex items-center justify-center gap-4">
                                {[
                                    { name: 'Instagram', url: 'https://instagram.com', icon: '📸' },
                                    { name: 'TikTok', url: 'https://tiktok.com', icon: '🎵' },
                                    { name: 'YouTube', url: 'https://youtube.com', icon: '📺' },
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex items-center gap-2 rounded-lg border-2 border-[#d4af37]/25 bg-white px-5 py-3 shadow-lg transition-all hover:scale-105 hover:border-[#ff5200]/40 hover:shadow-xl"
                                    >
                                        <span className="text-2xl">{social.icon}</span>
                                        <span className="text-sm font-semibold text-[#1e3a5f]">{social.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative border-t-2 border-[#d4af37]/30 bg-gradient-to-b from-[#1e3a5f] to-[#2d4a6f] py-16">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            <div className="text-center text-base text-white/70 md:text-left">
                                <div className="font-semibold">Email: hello@cahaya-anbiya.com</div>
                                <div className="mt-2 font-semibold">WhatsApp: +62 812-3456-7890</div>
                                <div className="mt-2 font-semibold">24/7 Customer Support</div>
                            </div>
                            <div className="flex items-center gap-8">
                                {['Instagram', 'TikTok', 'YouTube'].map((social) => (
                                    <a
                                        key={social}
                                        href={`https://${social.toLowerCase()}.com`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-base font-semibold text-white/70 transition-all hover:scale-110 hover:text-amber-400"
                                    >
                                        {social}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 border-t border-white/10 pt-8 text-center">
                            <div className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                                <a href="/privacy-policy" className="font-medium text-white/70 underline-offset-4 hover:text-amber-400 hover:underline">
                                    Privacy Policy
                                </a>
                                <a href="/terms-of-service" className="font-medium text-white/70 underline-offset-4 hover:text-amber-400 hover:underline">
                                    Terms of Service
                                </a>
                            </div>
                            <p className="text-sm text-white/50">© 2024 Cahaya Anbiya Travel. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </PublicLayout>
    );
}
