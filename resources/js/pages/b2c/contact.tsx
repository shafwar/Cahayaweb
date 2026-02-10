import { EditableText } from '@/components/cms';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { getR2Url } from '@/utils/imageHelper';
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Contact() {
    const [editMode, setEditModeUI] = useState<boolean>(false);
    useEffect(() => {
        const check = () => setEditModeUI(document.documentElement.classList.contains('cms-edit'));
        check();
        const handler = () => check();
        window.addEventListener('cms:mode', handler as EventListener);
        return () => window.removeEventListener('cms:mode', handler as EventListener);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const whatsappMessage = `Halo! Saya ${formData.name}%0A%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0A%0AMessage:%0A${formData.message}`;
        window.open(`https://wa.me/6281234567890?text=${whatsappMessage}`, '_blank');
    };

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
                description="Hubungi PT. Cahaya Anbiya Wisata Indonesia - Telepon: 0812-1237-9190. Lokasi: Jakarta Selatan. Jam operasional: Senin-Sabtu 08:00-17:00 WIB. Konsultasi paket Umrah, Haji, dan wisata halal."
                keywords="kontak cahaya anbiya, alamat cahaya anbiya, telepon cahaya anbiya, customer service cahaya anbiya, jakarta selatan"
            />

            <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black relative">
                {/* Professional Background Image */}
                <div 
                    className="fixed inset-0 z-0"
                    style={{
                        backgroundImage: `url(${getR2Url('Destination Cahaya 2.jpeg')})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                </div>
                
                {/* Hero Section */}
                <section className="relative z-10 overflow-hidden pt-12 pb-8 md:pt-16 md:pb-10">
                    {/* Ambient Background - Reduced opacity to work with image background */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.03),transparent_70%)] blur-3xl" />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.03),transparent_70%)] blur-3xl" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                        {/* Header */}
                        <div className="mb-8 text-center md:mb-10">
                            <div className="mb-4 inline-block">
                                <div className="rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-4 py-1.5 shadow-xl">
                                    <span className="text-xs font-semibold tracking-wider text-amber-200 uppercase sm:text-sm">
                                        <EditableText sectionKey="contact.header.badge" value="✨ Get In Touch" tag="span" />
                                    </span>
                                </div>
                            </div>

                            <h1 className="mb-4 text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                                <EditableText sectionKey="contact.header.title" value="Contact Us" tag="span" />
                            </h1>

                            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white sm:text-base md:text-lg lg:text-xl">
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
                                        className={`group relative overflow-hidden rounded-xl border ${info.borderColor} bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:p-6`}
                                    >
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                                        />
                                        <div className="relative text-center">
                                            <div
                                                className={`mb-3 inline-flex items-center justify-center rounded-lg bg-gradient-to-br ${info.color} p-3 shadow-md ring-1 ring-white/10`}
                                            >
                                                <IconComponent className={`h-6 w-6 ${info.iconColor}`} />
                                            </div>
                                            <h3 className="mb-2 text-lg font-bold text-white">
                                                <EditableText sectionKey={`contact.info.${info.id}.title`} value={info.title} tag="span" />
                                            </h3>
                                            <p className="text-sm text-white">
                                                <EditableText sectionKey={`contact.info.${info.id}.detail1`} value={info.detail1} tag="span" />
                                            </p>
                                            <p className="text-sm text-white">
                                                <EditableText sectionKey={`contact.info.${info.id}.detail2`} value={info.detail2} tag="span" />
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Contact Form */}
                        <div className="mx-auto max-w-3xl">
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-6 shadow-2xl sm:p-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />

                                <div className="relative">
                                    <div className="mb-6 text-center">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2">
                                            <MessageSquare className="h-5 w-5 text-amber-400" />
                                            <span className="text-sm font-bold text-amber-300">
                                                <EditableText sectionKey="contact.form.badge" value="Send us a message" tag="span" />
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                            <EditableText sectionKey="contact.form.title" value="Quick Contact Form" tag="span" />
                                        </h2>
                                        <p className="mt-2 text-sm text-white">
                                            <EditableText sectionKey="contact.form.subtitle" value="We'll respond within 24 hours" tag="span" />
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-white">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-white">Email *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                                    placeholder="your@email.com"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-white">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                                    placeholder="+62 812-xxxx-xxxx"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-white">Message *</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full resize-none rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-white transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                                placeholder="Tell us about your travel plans..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-105 hover:from-amber-400 hover:to-orange-400 hover:shadow-2xl"
                                        >
                                            <span>Send Message via WhatsApp</span>
                                            <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </form>

                                    <p className="mt-5 text-center text-xs text-white/60">
                                        By submitting this form, you'll be redirected to WhatsApp to send your message
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="mt-12 text-center">
                            <h3 className="mb-5 text-xl font-bold text-white sm:text-2xl">
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
                                        className="group flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/50 px-5 py-3 shadow-lg transition-all hover:scale-105 hover:border-amber-500/50 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10"
                                    >
                                        <span className="text-2xl">{social.icon}</span>
                                        <span className="text-sm font-semibold text-white">{social.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative border-t border-white/10 bg-black/70">
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
                            <p className="text-sm text-white/50">© 2024 Cahaya Anbiya Travel. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </PublicLayout>
    );
}
