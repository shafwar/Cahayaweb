import { EditableText } from '@/components/cms';
import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Award, Globe, Heart, Shield, Star, TrendingUp, Users } from 'lucide-react';

export default function About() {
    const coreValues = [
        {
            id: 1,
            icon: Shield,
            title: 'Integrity',
            description: 'Transparency and honesty in every service we provide',
            color: 'from-blue-500/20 to-indigo-500/20',
            borderColor: 'border-blue-500/30',
            iconColor: 'text-blue-400',
            accentGradient: 'from-blue-400 to-indigo-400',
        },
        {
            id: 2,
            icon: Heart,
            title: 'Hospitality',
            description: 'Genuine warmth and care in every journey',
            color: 'from-rose-500/20 to-pink-500/20',
            borderColor: 'border-rose-500/30',
            iconColor: 'text-rose-400',
            accentGradient: 'from-rose-400 to-pink-400',
        },
        {
            id: 3,
            icon: Star,
            title: 'Excellence',
            description: 'Uncompromising quality in every travel detail',
            color: 'from-amber-500/20 to-orange-500/20',
            borderColor: 'border-amber-500/30',
            iconColor: 'text-amber-400',
            accentGradient: 'from-amber-400 to-orange-400',
        },
    ];

    const stats = [
        { id: 1, number: '100+', label: 'Happy Travelers', icon: Users },
        { id: 2, number: '15+', label: 'Destinations', icon: Globe },
        { id: 3, number: '2025', label: 'Established', icon: Award },
        { id: 4, number: '95%', label: 'Satisfaction Rate', icon: TrendingUp },
    ];

    return (
        <PublicLayout>
            <SeoHead
                title="About Us - Cahaya Anbiya Travel"
                description="Cahaya Anbiya Travel menghadirkan perjalanan halal yang aman, nyaman, dan berkesan dengan pelayanan profesional dan pengalaman spiritual terbaik."
            />

            <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-10">
                    {/* Ambient Background */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.06),transparent_70%)] blur-3xl" />
                        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.06),transparent_70%)] blur-3xl" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                        {/* Header */}
                        <div className="mb-8 text-center md:mb-10">
                            <div className="mb-4 inline-block">
                                <div className="rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-4 py-1.5 shadow-xl">
                                    <span className="text-xs font-semibold tracking-wider text-amber-200 uppercase sm:text-sm">
                                        <EditableText sectionKey="about.header.badge" value="✨ Cahaya Anbiya Travel" tag="span" />
                                    </span>
                                </div>
                            </div>

                            <h1 className="mb-4 text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                                <EditableText sectionKey="about.header.title" value="About Us" tag="span" />
                            </h1>

                            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white sm:text-base md:text-lg lg:text-xl">
                                <EditableText
                                    sectionKey="about.header.description"
                                    value="Creating unforgettable travel experiences with exceptional service, cultural authenticity, and unwavering commitment to excellence"
                                    tag="span"
                                />
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                            {stats.map((stat) => {
                                const IconComponent = stat.icon;
                                return (
                                    <div
                                        key={stat.id}
                                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-4 text-center shadow-lg transition-transform duration-300 hover:-translate-y-1.5 sm:p-5 md:p-6"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 transition-all duration-500 group-hover:from-amber-500/15 group-hover:to-orange-500/15" />

                                        <div className="relative">
                                            <div className="mb-3 flex justify-center">
                                                <div className="rounded-lg bg-gradient-to-br from-amber-500/25 to-orange-500/25 p-2 shadow-md ring-1 ring-amber-500/50 sm:p-2.5">
                                                    <IconComponent className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
                                                </div>
                                            </div>
                                            <div className="mb-1.5 text-2xl font-bold text-amber-200 sm:text-3xl md:text-4xl lg:text-5xl">
                                                <EditableText sectionKey={`about.stats.${stat.id}.number`} value={stat.number} tag="span" />
                                            </div>
                                            <div className="text-xs font-semibold text-white sm:text-sm">
                                                <EditableText sectionKey={`about.stats.${stat.id}.label`} value={stat.label} tag="span" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-md transition-all duration-500 group-hover:w-full" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="relative py-12 md:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div>
                                        <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                                            <EditableText sectionKey="about.profile.title" value="Company Profile" tag="span" />
                                        </h2>
                                        <p className="text-sm leading-relaxed text-white sm:text-base md:text-lg">
                                            <EditableText
                                                sectionKey="about.profile.description"
                                                value="PT Cahaya Anbiya Travel is a premier travel company committed to providing memorable and comfortable halal travel experiences. We prioritize service quality with a friendly and professional approach, ensuring every journey is both spiritually fulfilling and culturally enriching."
                                                tag="span"
                                            />
                                        </p>
                                    </div>
                                </div>

                                {/* Vision Card */}
                                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-5 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 transition-all duration-500 group-hover:from-blue-500/10 group-hover:to-indigo-500/10" />
                                    <div className="relative">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-3 py-1.5">
                                            <div className="h-2 w-2 rounded-full bg-blue-400 shadow-md shadow-blue-400/50" />
                                            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">
                                                <EditableText sectionKey="about.vision.label" value="Vision" tag="span" />
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-white sm:text-base">
                                            <EditableText
                                                sectionKey="about.vision.description"
                                                value="To become a leading travel company in inspiring halal travel packages that connect people with their faith and culture, creating transformative experiences that last a lifetime."
                                                tag="span"
                                            />
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-indigo-400 shadow-md transition-all duration-500 group-hover:w-full" />
                                </div>

                                {/* Mission Card */}
                                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-5 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 transition-all duration-500 group-hover:from-purple-500/10 group-hover:to-pink-500/10" />
                                    <div className="relative">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1.5">
                                            <div className="h-2 w-2 rounded-full bg-purple-400 shadow-md shadow-purple-400/50" />
                                            <span className="text-xs font-bold tracking-wider text-purple-300 uppercase">
                                                <EditableText sectionKey="about.mission.label" value="Mission" tag="span" />
                                            </span>
                                        </div>
                                        <ul className="space-y-2.5 text-sm text-white sm:text-base">
                                            <li className="flex items-start gap-2.5">
                                                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-md" />
                                                <span>
                                                    <EditableText
                                                        sectionKey="about.mission.item1"
                                                        value="Provide inspiring halal travel experiences that enrich spiritual journeys"
                                                        tag="span"
                                                    />
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2.5">
                                                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-md" />
                                                <span>
                                                    <EditableText
                                                        sectionKey="about.mission.item2"
                                                        value="Prioritize safety, comfort, and authenticity in every service"
                                                        tag="span"
                                                    />
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2.5">
                                                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-md" />
                                                <span>
                                                    <EditableText
                                                        sectionKey="about.mission.item3"
                                                        value="Deliver exceptional customer service with cultural sensitivity"
                                                        tag="span"
                                                    />
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-400 to-pink-400 shadow-md transition-all duration-500 group-hover:w-full" />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="mb-5 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                                        <EditableText sectionKey="about.values.title" value="Our Core Values" tag="span" />
                                    </h2>
                                    <div className="space-y-4">
                                        {coreValues.map((value) => {
                                            const IconComponent = value.icon;
                                            return (
                                                <div
                                                    key={value.id}
                                                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-5 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 sm:p-6"
                                                >
                                                    <div
                                                        className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 transition-all duration-500 group-hover:opacity-100`}
                                                    />
                                                    <div className="relative flex items-start gap-3.5">
                                                        <div
                                                            className={`flex-shrink-0 rounded-lg border ${value.borderColor} bg-gradient-to-br ${value.color} p-2.5 shadow-md transition-all duration-300 group-hover:scale-105 sm:p-3`}
                                                        >
                                                            <IconComponent className={`h-5 w-5 ${value.iconColor} sm:h-6 sm:w-6`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="mb-1.5 text-base font-bold text-white transition-colors sm:text-lg lg:text-xl">
                                                                <EditableText
                                                                    sectionKey={`about.values.${value.id}.title`}
                                                                    value={value.title}
                                                                    tag="span"
                                                                />
                                                            </h3>
                                                            <p className="text-xs leading-relaxed text-white transition-colors group-hover:text-white sm:text-sm">
                                                                <EditableText
                                                                    sectionKey={`about.values.${value.id}.description`}
                                                                    value={value.description}
                                                                    tag="span"
                                                                />
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${value.accentGradient} shadow-md transition-all duration-500 group-hover:w-full`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CTA Card */}
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 shadow-xl sm:p-8">
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10" />
                                    <div className="relative text-center">
                                        <h3 className="mb-2.5 text-xl font-bold text-white sm:text-2xl">
                                            <EditableText sectionKey="about.cta.title" value="Ready to Start Your Journey?" tag="span" />
                                        </h3>
                                        <p className="mb-5 text-sm text-white/95 sm:text-base">
                                            <EditableText
                                                sectionKey="about.cta.description"
                                                value="Contact us today for a free consultation and let us help you plan your perfect travel experience"
                                                tag="span"
                                            />
                                        </p>
                                        <a
                                            href="https://wa.me/6281234567890"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black shadow-xl transition-all hover:scale-105 hover:bg-white/95 hover:shadow-2xl sm:px-8 sm:py-4 sm:text-base"
                                        >
                                            <span>
                                                <EditableText sectionKey="about.cta.button" value="Free Consultation" tag="span" />
                                            </span>
                                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
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
                            </div>
                            <div className="flex items-center gap-8">
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
                                        className="text-base font-semibold text-white/70 transition-all hover:scale-110 hover:text-amber-400"
                                    >
                                        {social.name}
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
