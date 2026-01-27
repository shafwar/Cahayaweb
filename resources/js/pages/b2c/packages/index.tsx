import { EditableText } from '@/components/cms';
import PlaceholderImage from '@/components/media/placeholder-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Camera, CheckCircle2, Edit3, Save, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getR2Url } from '@/utils/imageHelper';

export default function Packages() {
    const [editMode, setEditModeUI] = useState<boolean>(false);
    useEffect(() => {
        const check = () => setEditModeUI(document.documentElement.classList.contains('cms-edit'));
        check();
        const handler = () => check();
        window.addEventListener('cms:mode', handler as EventListener);
        return () => window.removeEventListener('cms:mode', handler as EventListener);
    }, []);

    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedPrice, setSelectedPrice] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<string>('');
    const [selectedPax, setSelectedPax] = useState<string>('');
    const [editorOpen, setEditorOpen] = useState<null | { id: number; title: string; location: string; duration: string; price: string; pax: string; type: string; description: string; }>(null);
    const [saving, setSaving] = useState(false);
    const [imageTargetKey, setImageTargetKey] = useState<string | null>(null);
    const hiddenImageInputId = 'packages-image-replacer';
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const [dialogSaving, setDialogSaving] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const packages = [
        { id: 1, title: 'Konsorsium Mesir Aqsa Jordan', location: 'Jordan, Palestina & Mesir', duration: '9D8N', price: '$2,300', pax: 'Max 25 pax', type: 'Religious', image: '/packages1.png', highlights: ['Petra', 'Museum Mummy', 'Camel', 'Nile Cruise', 'Pyramid & Sphinx', 'Masjid Al Aqsa'], description: 'Tempat mana yang paling bikin hati bergetar? Disinilah tempatnya yaitu napak tilas tiga negara sekaligus. Di Mesir, Di Aqsa, Di Jordan. Perjalanan ini bukan sekadar wisata, kita napak tilas belajar sejarah kisah nabi sebelumnya hingga merasakan khidmat dalam perjalanan ini agar kita terus bersyukur dan mengambil Pelajaran dari setiap kisah dan perjalanan ini.', features: ['Dinner Nile Cruise', 'Camel di Mesir', 'Petra', 'Museum Mummy', 'Tips Guide $80 (tidak termasuk)'], dates: [{ date: 'Oktober 2025', status: 'Available' }], hotels: [{ name: 'Golden Tulip', location: 'Amman', stars: 4 }, { name: 'Holyland', location: 'Jerusalem', stars: 4 }, { name: 'Mega Club', location: 'Taba', stars: 4 }, { name: 'Azal Pyramid', location: 'Cairo', stars: 4 }] },
        { id: 2, title: '3 Negara dalam 1 Perjalanan', location: 'Jordan, Palestina & Mesir', duration: '10D9N', price: '$2,300', pax: 'Kuota Terbatas', type: 'Religious', image: '/packages2.png', highlights: ['Napak tilas Para Nabi', 'Wisata sejarah', 'Healing untuk hati', 'Momen tenang'], description: '⚠️ Breaking News! 🌏 Sekali Jalan Langsung 3 Negara Sekaligus! Yes! Kamu nggak salah baca. Jordan, Palestina, dan Mesir bisa kamu jelajahi hanya dalam 1 trip selama 10 hari!! Include menapak jejak Para Nabi, wisata sejarah, dan healing untuk hati yang rindu momen tenang ⭐️', features: ['Menapak jejak Para Nabi', 'Wisata sejarah', 'Healing untuk hati', 'Momen tenang', 'Kuota terbatas'], dates: [{ date: 'Oktober 2025', status: 'Limited' }] },
        { id: 3, title: '10 Hari Jordan Aqsa Mesir', location: 'Jordan, Aqsa & Mesir', duration: '10D9N', price: '$2,300', pax: 'Max 30 pax', type: 'Religious', image: '/packages3.png', highlights: ['Museum Mummy Firaun', 'Petra', 'Nile Cruise', 'Camel Ride', 'FREE WiFi', 'Waktu Shalat Terjaga'], description: 'Bayangkan jika… Kamu sedang berdiri di depan Al-Aqsa, merasakan damainya doa di tempat suci. Langkahmu menyusuri Petra yang megah, berlayar di Sungai Nil, dan menyaksikan matahari tenggelam di balik Piramida. Ini bukan sekadar wisata, tapi perjalanan spiritual, sejarah, dan makna semua dalam satu pengalaman selama 10 hari ke Jordan, Aqsa & Mesir.', features: ['Makanan halal', 'Waktu salat terjaga', 'Hotel bintang 4/setara', 'Wi-Fi gratis', 'Dipandu dengan nyaman dan aman', 'Free snack on the bus'], dates: [{ date: '21 Agustus 2025', status: 'Sold Out' }, { date: '23 September 2025', status: 'Sold Out' }, { date: '30 Oktober 2025', status: 'Limited' }, { date: '5 Desember 2025', status: 'Limited' }], hotels: [{ name: 'Golden Tulip', location: 'Amman', stars: 4 }, { name: 'Holyland', location: 'Jerusalem', stars: 4 }, { name: 'Mega Club', location: 'Taba', stars: 4 }, { name: 'Azal Pyramid', location: 'Cairo', stars: 4 }] },
    ];

    const typeOptions = ['All', 'Religious', 'Cultural', 'Adventure', 'Luxury'];
    const priceOptions = ['All', 'Under $2,000', '$2,000 - $2,500', '$2,500 - $3,000', 'Over $3,000'];
    const durationOptions = ['All', '4-6 Days', '7-9 Days', '10+ Days'];
    const paxOptions = ['All', 'Small Group (15-25)', 'Medium Group (25-35)', 'Large Group (35+)'];

    const filteredPackages = packages.filter((pkg) => {
        if (selectedType && selectedType !== 'All' && pkg.type !== selectedType) return false;
        if (selectedPrice && selectedPrice !== 'All') {
            const price = parseInt(pkg.price.replace('$', '').replace(',', ''));
            switch (selectedPrice) {
                case 'Under $2,000': if (price >= 2000) return false; break;
                case '$2,000 - $2,500': if (price < 2000 || price > 2500) return false; break;
                case '$2,500 - $3,000': if (price < 2500 || price > 3000) return false; break;
                case 'Over $3,000': if (price <= 3000) return false; break;
            }
        }
        if (selectedDuration && selectedDuration !== 'All') {
            const days = parseInt(pkg.duration.match(/\d+/)?.[0] || '0');
            switch (selectedDuration) {
                case '4-6 Days': if (days < 4 || days > 6) return false; break;
                case '7-9 Days': if (days < 7 || days > 9) return false; break;
                case '10+ Days': if (days < 10) return false; break;
            }
        }
        if (selectedPax && selectedPax !== 'All') {
            const maxPax = parseInt(pkg.pax.match(/\d+/)?.[0] || '0');
            switch (selectedPax) {
                case 'Small Group (15-25)': if (maxPax < 15 || maxPax > 25) return false; break;
                case 'Medium Group (25-35)': if (maxPax < 25 || maxPax > 35) return false; break;
                case 'Large Group (35+)': if (maxPax < 35) return false; break;
            }
        }
        return true;
    });

    return (
        <PublicLayout>
            <Head title="Travel Packages - Cahaya Anbiya Travel" />

            <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
                {/* Main Content Section */}
                <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 md:pt-20">
                    {/* Ambient Effects */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(254,201,1,0.1),transparent_70%)] blur-2xl" />
                        <div className="absolute bottom-0 right-1/4 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.1),transparent_70%)] blur-2xl" />
                    </div>

                    {/* Hero Section */}
                    <div className="relative mb-12 text-center md:mb-14">
                        {/* Badge */}
                        <div className="mb-4 inline-block">
                            <div className="group inline-flex items-center gap-2 rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-5 py-2 shadow-xl transition-all duration-300 hover:scale-105 hover:border-amber-400/70">
                                <Sparkles className="h-4 w-4 text-amber-300 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-amber-200 sm:text-sm">
                                    <EditableText sectionKey="packages.header.badge" value="Premium Travel Packages" tag="span" />
                                </span>
                            </div>
                        </div>

                        {/* Main Title */}
                        <h1 className="mb-4 bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-3xl font-bold leading-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                            Discover Your Perfect Journey
                        </h1>

                        {/* Subtitle */}
                        <h2 className="mx-auto mb-5 max-w-3xl text-xl font-semibold leading-snug text-white sm:text-2xl md:text-3xl">
                            <EditableText sectionKey="packages.header.descriptionTitle" value="Your Perfect Journey Awaits" tag="span" />
                        </h2>

                        {/* Description */}
                        <div className="mx-auto mb-8 max-w-2xl space-y-2">
                            <p className="text-sm leading-relaxed text-white/80 sm:text-base md:text-lg lg:text-xl">
                                Discover our curated collection of spiritual and cultural journeys. From Umrah & Hajj experiences to luxury adventures, find the perfect package for your next unforgettable journey.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/70 sm:gap-6 sm:text-sm">
                            {[
                                { label: 'Premium Experiences', color: 'from-amber-400 to-orange-400' },
                                { label: 'Expert Guidance', color: 'from-orange-400 to-red-400' },
                                { label: '24/7 Support', color: 'from-amber-500 to-yellow-400' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${item.color} shadow-md`} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="mt-8 mb-12">
                        <div className="mb-6 text-center">
                            <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl md:text-2xl">Find Your Perfect Package</h3>
                            <p className="text-sm text-white/70 sm:text-base">Use filters below to discover packages that match your preferences</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="h-10 w-full min-w-[140px] border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/90 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/20 sm:w-40">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent className="border border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                    {typeOptions.map((type) => <SelectItem key={type} value={type} className="text-sm text-white transition-colors hover:bg-amber-500/20 hover:text-amber-200">{type}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                                <SelectTrigger className="h-10 w-full min-w-[160px] border border-white/20 bg-gradient-to-br from-slate-900/90 to-slate-800/80 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/20 sm:w-48">
                                    <SelectValue placeholder="Price Range" />
                                </SelectTrigger>
                                <SelectContent className="border border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                    {priceOptions.map((price) => <SelectItem key={price} value={price} className="text-sm text-white transition-colors hover:bg-amber-500/20 hover:text-amber-200">{price}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                <SelectTrigger className="h-10 w-full min-w-[150px] border border-white/20 bg-gradient-to-br from-slate-900/90 to-slate-800/80 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/20 sm:w-44">
                                    <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent className="border border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                    {durationOptions.map((duration) => <SelectItem key={duration} value={duration} className="text-sm text-white transition-colors hover:bg-amber-500/20 hover:text-amber-200">{duration}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select value={selectedPax} onValueChange={setSelectedPax}>
                                <SelectTrigger className="h-10 w-full min-w-[170px] border border-white/20 bg-gradient-to-br from-slate-900/90 to-slate-800/80 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/20 sm:w-52">
                                    <SelectValue placeholder="Group Size" />
                                </SelectTrigger>
                                <SelectContent className="border border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                                    {paxOptions.map((pax) => <SelectItem key={pax} value={pax} className="text-sm text-white transition-colors hover:bg-amber-500/20 hover:text-amber-200">{pax}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Packages Grid - ✅ NO SCROLL ANIMATIONS */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPackages.map((pkg) => (
                            <Dialog key={pkg.id} onOpenChange={(open) => { if (open) { setOpenDialogId(pkg.id); setShowSuccessAlert(false); } else { if (editMode && openDialogId === pkg.id) window.dispatchEvent(new CustomEvent('cms:flush-save')); setOpenDialogId(null); setTimeout(() => setShowSuccessAlert(false), 100); } }}>
                                <DialogTrigger asChild>
                                    <article className="group cursor-pointer overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-900/80 shadow-2xl transition-all duration-300 hover:-translate-y-2.5 hover:scale-105">
                                        <div className="relative aspect-video overflow-hidden">
                                            <img src={getR2Url(pkg.image)} alt={pkg.title} data-package-id={pkg.id} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                                        const currentUrl = target.src;
                                                        if (currentUrl.includes('/public/')) {
                                                            target.src = currentUrl.replace('/public/', '/');
                                                        } else {
                                                            target.src = currentUrl.replace('assets.cahayaanbiya.com/', 'assets.cahayaanbiya.com/public/');
                                                        }
                                                    } else {
                                                        target.style.display = 'none';
                                                        const nextElement = target.nextElementSibling as HTMLElement;
                                                        if (nextElement) nextElement.style.display = 'block';
                                                    }
                                                }}
                                            />
                                            <PlaceholderImage className="hidden h-full w-full object-cover" />

                                            <div className="absolute top-4 left-4">
                                                <span className="rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white shadow-xl">{pkg.type}</span>
                                            </div>

                                            {editMode && (
                                                <div className="absolute top-4 left-4 z-10 flex flex-col gap-3">
                                                    <button onClick={(e) => { e.stopPropagation(); setImageTargetKey(`packages.${pkg.id}.image`); document.getElementById(hiddenImageInputId)?.click(); }} className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-gray-800 shadow-2xl ring-2 ring-white/50 transition-all hover:scale-110" title="Replace image">
                                                        <Camera className="h-6 w-6" strokeWidth={2.5} />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); setEditorOpen({ id: pkg.id, title: pkg.title, location: pkg.location, duration: pkg.duration, price: pkg.price, pax: pkg.pax, type: pkg.type, description: pkg.description }); }} className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl ring-2 ring-blue-400/50 transition-all hover:scale-110 hover:rotate-12" title="Edit details">
                                                        <Edit3 className="h-6 w-6" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>

                                        <div className="p-6">
                                            <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-amber-300 sm:text-2xl">
                                                <EditableText sectionKey={`packages.${pkg.id}.title`} value={pkg.title} tag="span" />
                                            </h3>
                                            <p className="mb-3 text-sm leading-relaxed text-white/80 sm:text-base">
                                                <EditableText sectionKey={`packages.${pkg.id}.location`} value={pkg.location} tag="span" /> • <EditableText sectionKey={`packages.${pkg.id}.duration`} value={pkg.duration} tag="span" />
                                            </p>

                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="text-xl font-bold text-amber-300 sm:text-2xl">
                                                    <EditableText sectionKey={`packages.${pkg.id}.price`} value={pkg.price} tag="span" />
                                                </div>
                                                <div className="text-xs font-medium text-white/70 sm:text-sm">
                                                    <EditableText sectionKey={`packages.${pkg.id}.pax`} value={pkg.pax} tag="span" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-semibold text-amber-300 transition-transform group-hover:scale-105 sm:text-base">View Details →</div>
                                                <div className="text-xs text-white/60 sm:text-sm">{pkg.highlights.length} highlights</div>
                                            </div>
                                        </div>

                                        <div className="h-1.5 origin-left scale-x-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-lg transition-transform duration-500 group-hover:scale-x-100" />
                                    </article>
                                </DialogTrigger>

                                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-white/20 bg-gradient-to-br from-black/98 to-slate-900/98 shadow-2xl sm:max-w-3xl">
                                    <DialogHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <DialogTitle className="text-2xl font-bold text-white sm:text-3xl">
                                                    <EditableText sectionKey={`packages.${pkg.id}.title`} value={pkg.title} tag="span" />
                                                </DialogTitle>
                                                <DialogDescription className="mt-2 text-base leading-relaxed text-white/80 sm:text-lg">
                                                    <EditableText sectionKey={`packages.${pkg.id}.description`} value={pkg.description} tag="span" />
                                                </DialogDescription>
                                            </div>
                                            {editMode && (
                                                <button onClick={() => { setDialogSaving(true); window.dispatchEvent(new CustomEvent('cms:flush-save')); setTimeout(() => { setDialogSaving(false); setShowSuccessAlert(true); setTimeout(() => setShowSuccessAlert(false), 3000); }, 500); }} className="ml-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-black shadow-2xl hover:bg-amber-400 disabled:opacity-50" disabled={dialogSaving}>
                                                    {dialogSaving ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Save className="h-6 w-6" /></motion.div> : <Save className="h-6 w-6" />}
                                                </button>
                                            )}
                                        </div>
                                    </DialogHeader>

                                    <AnimatePresence>
                                        {showSuccessAlert && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-2xl border-2 border-green-500/30 bg-green-500/25 p-6">
                                                <div className="flex items-center gap-4">
                                                    <CheckCircle2 className="h-7 w-7 text-green-400" />
                                                    <div>
                                                        <p className="text-base font-bold text-green-300">Changes saved successfully!</p>
                                                        <p className="text-sm text-green-400/80">All your edits have been saved.</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="mt-6 space-y-5">
                                        <div className="rounded-xl border border-white/20 bg-white/5 p-6 shadow-lg">
                                            <h4 className="mb-4 text-lg font-bold text-amber-300 sm:text-xl">Package Details</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm text-white/90 sm:text-base">
                                                <div><strong>Location:</strong> <EditableText sectionKey={`packages.${pkg.id}.location`} value={pkg.location} tag="span" /></div>
                                                <div><strong>Duration:</strong> <EditableText sectionKey={`packages.${pkg.id}.duration`} value={pkg.duration} tag="span" /></div>
                                                <div><strong>Price:</strong> <EditableText sectionKey={`packages.${pkg.id}.price`} value={pkg.price} tag="span" /> per person</div>
                                                <div><strong>Group Size:</strong> <EditableText sectionKey={`packages.${pkg.id}.pax`} value={pkg.pax} tag="span" /></div>
                                            </div>
                                        </div>

                                        {pkg.features && (
                                            <div className="rounded-xl border border-white/20 bg-white/5 p-6 shadow-lg">
                                                <h4 className="mb-4 text-lg font-bold text-amber-300 sm:text-xl">What's Included</h4>
                                                <ul className="space-y-2.5">
                                                    {pkg.features.map((feature, index) => (
                                                        <li key={index} className="flex items-center gap-3 text-sm text-white/90 sm:text-base">
                                                            <svg className="h-6 w-6 flex-shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span><EditableText sectionKey={`packages.${pkg.id}.features.${index}`} value={feature} tag="span" /></span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {pkg.dates && pkg.dates.length > 0 && (
                                            <div className="rounded-xl border border-white/20 bg-white/5 p-6 shadow-lg">
                                                <h4 className="mb-4 text-lg font-bold text-amber-300 sm:text-xl">Available Dates</h4>
                                                <div className="space-y-2.5">
                                                    {pkg.dates.map((date, index) => (
                                                        <div key={index} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                                                            <span className="text-sm font-semibold text-white/90 sm:text-base">
                                                                <EditableText sectionKey={`packages.${pkg.id}.dates.${index}.date`} value={date.date} tag="span" />
                                                            </span>
                                                            <span className={`rounded-full px-3 py-1.5 text-xs font-bold sm:px-4 sm:py-2 sm:text-sm ${date.status === 'Available' ? 'bg-green-500/20 text-green-300' : date.status === 'Sold Out' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                                                <EditableText sectionKey={`packages.${pkg.id}.dates.${index}.status`} value={date.status} tag="span" />
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {pkg.hotels && pkg.hotels.length > 0 && (
                                            <div className="rounded-xl border border-white/20 bg-white/5 p-6 shadow-lg">
                                                <h4 className="mb-4 text-lg font-bold text-amber-300 sm:text-xl">Accommodations</h4>
                                                <div className="space-y-2.5">
                                                    {pkg.hotels.map((hotel, index) => (
                                                        <div key={index} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                                                            <div>
                                                                <span className="text-sm font-bold text-white/90 sm:text-base">
                                                                    <EditableText sectionKey={`packages.${pkg.id}.hotels.${index}.name`} value={hotel.name} tag="span" />
                                                                </span>
                                                                <div className="mt-1 text-xs text-white/70 sm:text-sm">
                                                                    <EditableText sectionKey={`packages.${pkg.id}.hotels.${index}.location`} value={hotel.location} tag="span" />
                                                                </div>
                                                            </div>
                                                            <div className="text-amber-300">
                                                                {Array.from({ length: hotel.stars }, (_, i) => <span key={i} className="text-lg sm:text-xl">★</span>)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="rounded-xl border border-white/20 bg-white/5 p-6 shadow-lg">
                                            <h4 className="mb-4 text-lg font-bold text-amber-300 sm:text-xl">Highlights</h4>
                                            <p className="text-sm leading-relaxed text-white/90 sm:text-base">
                                                {pkg.highlights.map((highlight, index) => (
                                                    <span key={index}>
                                                        <EditableText sectionKey={`packages.${pkg.id}.highlights.${index}`} value={highlight} tag="span" />
                                                        {index < pkg.highlights.length - 1 && ' • '}
                                                    </span>
                                                ))}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 sm:gap-4">
                                            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-center text-sm font-bold text-white shadow-xl transition-all hover:from-amber-400 hover:to-orange-400 hover:scale-105 sm:px-8 sm:py-4 sm:text-base">Book Now</a>
                                            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex-1 rounded-xl border border-amber-500 px-6 py-3 text-center text-sm font-bold text-amber-300 transition-all hover:bg-amber-500 hover:text-white hover:scale-105 sm:px-8 sm:py-4 sm:text-base">Ask Questions</a>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredPackages.length === 0 && (
                        <div className="mt-16 text-center">
                            <div className="mx-auto max-w-md rounded-3xl border-2 border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-900/80 p-12 shadow-2xl">
                                <div className="mb-6 text-6xl">🔍</div>
                                <h3 className="mb-3 text-2xl font-bold text-white">No packages found</h3>
                                <p className="text-base text-white/70">Try adjusting your filters to discover the perfect package for your journey.</p>
                            </div>
                        </div>
                    )}

                    {/* Gallery Section */}
                    <div className="relative pt-12 md:pt-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="mb-10 text-center">
                            <div className="mb-3 inline-block">
                                <div className="rounded-full border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-6 py-3 shadow-xl">
                                    <span className="text-sm font-bold uppercase tracking-wider text-amber-200">
                                        <EditableText sectionKey="packages.gallery.badge" value="📸 Destination Gallery" tag="span" />
                                    </span>
                                </div>
                            </div>
                            <h2 className="mb-2 text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl">
                                <EditableText sectionKey="packages.gallery.title" value="Explore Our Destinations" tag="span" />
                            </h2>
                            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                                <EditableText sectionKey="packages.gallery.description" value="Discover the breathtaking beauty and rich history of the destinations featured in our travel packages" tag="span" />
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                { id: 1, title: 'Petra, Jordan', subtitle: 'The Rose City', image: '/TURKEY.jpeg', description: 'Ancient Nabataean city carved into red sandstone cliffs', category: 'Historical' },
                                { id: 2, title: 'Dome of the Rock', subtitle: 'Jerusalem, Palestine', image: '/umrah.jpeg', description: 'Sacred Islamic shrine with stunning golden dome', category: 'Religious' },
                                { id: 3, title: 'Pyramids of Giza', subtitle: 'Cairo, Egypt', image: '/egypt.jpeg', description: 'Ancient wonders of the world', category: 'Historical' },
                                { id: 4, title: 'Cappadocia', subtitle: 'Turkey', image: '/jordan.jpeg', description: 'Fairy chimneys and hot air balloon rides', category: 'Adventure' },
                                { id: 5, title: 'Dubai Desert', subtitle: 'UAE', image: '/dubai1.jpeg', description: 'Golden sand dunes and desert adventures', category: 'Adventure' },
                                { id: 6, title: 'Oman Desert', subtitle: 'Muscat, Oman', image: '/oman.jpg', description: 'Ancient forts and traditional markets', category: 'Cultural' },
                            ].map((destination) => (
                                <div key={destination.id} className="group relative overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-900/80 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img src={getR2Url(destination.image)} alt={destination.title} data-gallery-id={destination.id} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.currentTarget;
                                                if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                                    const currentUrl = target.src;
                                                    if (currentUrl.includes('/public/')) {
                                                        target.src = currentUrl.replace('/public/', '/');
                                                    } else {
                                                        target.src = currentUrl.replace('assets.cahayaanbiya.com/', 'assets.cahayaanbiya.com/public/');
                                                    }
                                                } else {
                                                    target.style.display = 'none';
                                                    const nextElement = target.nextElementSibling as HTMLElement;
                                                    if (nextElement) nextElement.style.display = 'block';
                                                }
                                            }}
                                        />
                                        <PlaceholderImage className="hidden h-full w-full object-cover" />

                                        <div className="absolute top-4 left-4">
                                            <span className="rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white shadow-xl">{destination.category}</span>
                                        </div>

                                        {editMode && (
                                            <button onClick={() => { setImageTargetKey(`packages.gallery.${destination.id}.image`); document.getElementById(hiddenImageInputId)?.click(); }} className="absolute top-4 left-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-gray-800 shadow-2xl ring-2 ring-white/50 transition-all hover:scale-110" title="Replace image">
                                                <Camera className="h-6 w-6" strokeWidth={2.5} />
                                            </button>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                                    </div>

                                    <div className="absolute right-0 bottom-0 left-0 p-5 text-white">
                                        <h3 className="mb-1.5 text-lg font-bold sm:text-xl">
                                            <EditableText sectionKey={`packages.gallery.${destination.id}.title`} value={destination.title} tag="span" />
                                        </h3>
                                        <p className="mb-1.5 text-sm font-semibold text-white/90 sm:text-base">
                                            <EditableText sectionKey={`packages.gallery.${destination.id}.subtitle`} value={destination.subtitle} tag="span" />
                                        </p>
                                        <p className="text-xs text-white/80 sm:text-sm">
                                            <EditableText sectionKey={`packages.gallery.${destination.id}.description`} value={destination.description} tag="span" />
                                        </p>
                                    </div>

                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-lg transition-all duration-500 group-hover:w-full" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                                <div className="inline-flex items-center rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 px-5 py-2.5 shadow-lg transition-all duration-300 hover:border-amber-400/70 hover:shadow-amber-500/20">
                                    <span className="text-xs font-semibold text-amber-200 sm:text-sm">✨ Ready to Experience These Amazing Destinations?</span>
                                </div>
                                <a href="/destinations" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/30 hover:scale-105 sm:px-8 sm:py-3 sm:text-base">
                                    View All Destinations
                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                </a>
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
                                <div className="mt-2 font-semibold">24/7 Customer Support</div>
                            </div>
                            <div className="flex items-center gap-8">
                                {['Instagram', 'TikTok', 'YouTube'].map((social) => (
                                    <a key={social} href={`https://${social.toLowerCase()}.com`} target="_blank" rel="noreferrer" className="text-base font-semibold text-white/70 transition-all hover:text-amber-400 hover:scale-110">{social}</a>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 border-t border-white/10 pt-8 text-center">
                            <p className="text-sm text-white/50">© 2024 Cahaya Anbiya Travel. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            <input id={hiddenImageInputId} type="file" accept="image/jpeg,image/png" className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f || !imageTargetKey) return;
                    const formData = new FormData();
                    formData.append('key', imageTargetKey);
                    formData.append('image', f);
                    setSaving(true);
                    axios.post('/admin/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then((r) => {
                            if (r.data.success && r.data.imageUrl) {
                                if (imageTargetKey.includes('gallery')) {
                                    const galleryId = imageTargetKey.split('.')[2];
                                    const img = document.querySelector(`img[data-gallery-id="${galleryId}"]`) as HTMLImageElement | null;
                                    if (img) img.src = r.data.imageUrl;
                                } else {
                                    const pkgId = imageTargetKey.split('.')[1];
                                    const img = document.querySelector(`img[data-package-id="${pkgId}"]`) as HTMLImageElement | null;
                                    if (img) img.src = r.data.imageUrl;
                                }
                                window.dispatchEvent(new CustomEvent('cms:flush-save'));
                            }
                        })
                        .finally(() => {
                            setSaving(false);
                            setImageTargetKey(null);
                            e.target.value = '';
                        });
                }}
            />

            {editorOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setEditorOpen(null)}>
                    <div className="w-full max-w-2xl rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white">✏️ Edit Package</h3>
                            <button onClick={() => setEditorOpen(null)} className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">Close</button>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-200">Title</label>
                                <input type="text" value={editorOpen.title} onChange={(e) => setEditorOpen({ ...editorOpen, title: e.target.value })} className="w-full rounded-xl border-2 border-white/20 bg-gray-900 px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-200">Location</label>
                                <input type="text" value={editorOpen.location} onChange={(e) => setEditorOpen({ ...editorOpen, location: e.target.value })} className="w-full rounded-xl border-2 border-white/20 bg-gray-900 px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-200">Duration</label>
                                    <input type="text" value={editorOpen.duration} onChange={(e) => setEditorOpen({ ...editorOpen, duration: e.target.value })} className="w-full rounded-xl border-2 border-white/20 bg-gray-900 px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-200">Price</label>
                                    <input type="text" value={editorOpen.price} onChange={(e) => setEditorOpen({ ...editorOpen, price: e.target.value })} className="w-full rounded-xl border-2 border-white/20 bg-gray-900 px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-200">Group Size</label>
                                    <input type="text" value={editorOpen.pax} onChange={(e) => setEditorOpen({ ...editorOpen, pax: e.target.value })} className="w-full rounded-xl border-2 border-white/20 bg-gray-900 px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-200">Type</label>
                                    <input type="text" value={editorOpen.type} onChange={(e) => setEditorOpen({ ...editorOpen, type: e.target.value })} className="w-full rounded-xl border-2 border-white/20 bg-gray-900 px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-200">Description</label>
                                <textarea value={editorOpen.description} onChange={(e) => setEditorOpen({ ...editorOpen, description: e.target.value })} rows={4} className="w-full rounded-xl border-2 border-white/20 bg-gray-900 px-4 py-3 text-white focus:border-amber-500 focus:outline-none" />
                            </div>
                            <button onClick={() => { const updates = [{ key: `packages.${editorOpen.id}.title`, content: editorOpen.title }, { key: `packages.${editorOpen.id}.location`, content: editorOpen.location }, { key: `packages.${editorOpen.id}.duration`, content: editorOpen.duration }, { key: `packages.${editorOpen.id}.price`, content: editorOpen.price }, { key: `packages.${editorOpen.id}.pax`, content: editorOpen.pax }, { key: `packages.${editorOpen.id}.type`, content: editorOpen.type }, { key: `packages.${editorOpen.id}.description`, content: editorOpen.description }]; Promise.all(updates.map((u) => axios.post('/admin/update-section', u))).then(() => { window.dispatchEvent(new CustomEvent('cms:flush-save')); setEditorOpen(null); }); }} disabled={saving} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-base font-bold text-white shadow-2xl transition-all hover:from-amber-400 hover:to-orange-400 hover:scale-105 disabled:opacity-50">
                                {saving ? 'Saving...' : '💾 Save All Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
