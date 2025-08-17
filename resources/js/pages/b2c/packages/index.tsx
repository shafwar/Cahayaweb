import PlaceholderImage from '@/components/media/placeholder-image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Packages() {
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedPrice, setSelectedPrice] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<string>('');
    const [selectedPax, setSelectedPax] = useState<string>('');

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    // Sample packages data
    const packages = [
        {
            id: 1,
            title: 'Konsorsium Mesir Aqsa Jordan',
            location: 'Jordan, Palestina & Mesir',
            duration: '9D8N',
            price: '$2,300',
            pax: 'Max 25 pax',
            type: 'Religious',
            image: '/packages1.png',
            highlights: ['Petra', 'Museum Mummy', 'Camel', 'Nile Cruise', 'Pyramid & Sphinx', 'Masjid Al Aqsa'],
            description:
                'Tempat mana yang paling bikin hati bergetar? Disinilah tempatnya yaitu napak tilas tiga negara sekaligus. Di Mesir, Di Aqsa, Di Jordan. Perjalanan ini bukan sekadar wisata, kita napak tilas belajar sejarah kisah nabi sebelumnya hingga merasakan khidmat dalam perjalanan ini agar kita terus bersyukur dan mengambil Pelajaran dari setiap kisah dan perjalanan ini.',
            features: ['Dinner Nile Cruise', 'Camel di Mesir', 'Petra', 'Museum Mummy', 'Tips Guide $80 (tidak termasuk)'],
            dates: [{ date: 'Oktober 2025', status: 'Available' }],
            hotels: [
                { name: 'Golden Tulip', location: 'Amman', stars: 4 },
                { name: 'Holyland', location: 'Jerusalem', stars: 4 },
                { name: 'Mega Club', location: 'Taba', stars: 4 },
                { name: 'Azal Pyramid', location: 'Cairo', stars: 4 },
            ],
        },
        {
            id: 2,
            title: '3 Negara dalam 1 Perjalanan',
            location: 'Jordan, Palestina & Mesir',
            duration: '10D9N',
            price: '$2,300',
            pax: 'Kuota Terbatas',
            type: 'Religious',
            image: '/packages2.png',
            highlights: ['Napak tilas Para Nabi', 'Wisata sejarah', 'Healing untuk hati', 'Momen tenang'],
            description:
                '⚠️ Breaking News! 🌏 Sekali Jalan Langsung 3 Negara Sekaligus! Yes! Kamu nggak salah baca. Jordan, Palestina, dan Mesir bisa kamu jelajahi hanya dalam 1 trip selama 10 hari!! Include menapak jejak Para Nabi, wisata sejarah, dan healing untuk hati yang rindu momen tenang ⭐️',
            features: ['Menapak jejak Para Nabi', 'Wisata sejarah', 'Healing untuk hati', 'Momen tenang', 'Kuota terbatas'],
            dates: [{ date: 'Oktober 2025', status: 'Limited' }],
        },
        {
            id: 3,
            title: '10 Hari Jordan Aqsa Mesir',
            location: 'Jordan, Aqsa & Mesir',
            duration: '10D9N',
            price: '$2,300',
            pax: 'Max 30 pax',
            type: 'Religious',
            image: '/packages3.png',
            highlights: ['Museum Mummy Firaun', 'Petra', 'Nile Cruise', 'Camel Ride', 'FREE WiFi', 'Waktu Shalat Terjaga'],
            description:
                'Bayangkan jika… Kamu sedang berdiri di depan Al-Aqsa, merasakan damainya doa di tempat suci. Langkahmu menyusuri Petra yang megah, berlayar di Sungai Nil, dan menyaksikan matahari tenggelam di balik Piramida. Ini bukan sekadar wisata, tapi perjalanan spiritual, sejarah, dan makna semua dalam satu pengalaman selama 10 hari ke Jordan, Aqsa & Mesir.',
            features: [
                'Makanan halal',
                'Waktu salat terjaga',
                'Hotel bintang 4/setara',
                'Wi-Fi gratis',
                'Dipandu dengan nyaman dan aman',
                'Free snack on the bus',
            ],
            dates: [
                { date: '21 Agustus 2025', status: 'Sold Out' },
                { date: '23 September 2025', status: 'Sold Out' },
                { date: '30 Oktober 2025', status: 'Limited' },
                { date: '5 Desember 2025', status: 'Limited' },
            ],
            hotels: [
                { name: 'Golden Tulip', location: 'Amman', stars: 4 },
                { name: 'Holyland', location: 'Jerusalem', stars: 4 },
                { name: 'Mega Club', location: 'Taba', stars: 4 },
                { name: 'Azal Pyramid', location: 'Cairo', stars: 4 },
            ],
        },
    ];

    // Filter options
    const typeOptions = ['All', 'Religious', 'Cultural', 'Adventure', 'Luxury'];
    const priceOptions = ['All', 'Under $2,000', '$2,000 - $2,500', '$2,500 - $3,000', 'Over $3,000'];
    const durationOptions = ['All', '4-6 Days', '7-9 Days', '10+ Days'];
    const paxOptions = ['All', 'Small Group (15-25)', 'Medium Group (25-35)', 'Large Group (35+)'];

    // Filter packages based on selected filters
    const filteredPackages = packages.filter((pkg) => {
        if (selectedType && selectedType !== 'All' && pkg.type !== selectedType) return false;
        if (selectedPrice && selectedPrice !== 'All') {
            const price = parseInt(pkg.price.replace('$', '').replace(',', ''));
            switch (selectedPrice) {
                case 'Under $2,000':
                    if (price >= 2000) return false;
                    break;
                case '$2,000 - $2,500':
                    if (price < 2000 || price > 2500) return false;
                    break;
                case '$2,500 - $3,000':
                    if (price < 2500 || price > 3000) return false;
                    break;
                case 'Over $3,000':
                    if (price <= 3000) return false;
                    break;
            }
        }
        if (selectedDuration && selectedDuration !== 'All') {
            const days = parseInt(pkg.duration.match(/\d+/)?.[0] || '0');
            switch (selectedDuration) {
                case '4-6 Days':
                    if (days < 4 || days > 6) return false;
                    break;
                case '7-9 Days':
                    if (days < 7 || days > 9) return false;
                    break;
                case '10+ Days':
                    if (days < 10) return false;
                    break;
            }
        }
        if (selectedPax && selectedPax !== 'All') {
            const maxPax = parseInt(pkg.pax.match(/\d+/)?.[0] || '0');
            switch (selectedPax) {
                case 'Small Group (15-25)':
                    if (maxPax < 15 || maxPax > 25) return false;
                    break;
                case 'Medium Group (25-35)':
                    if (maxPax < 25 || maxPax > 35) return false;
                    break;
                case 'Large Group (35+)':
                    if (maxPax < 35) return false;
                    break;
            }
        }
        return true;
    });

    return (
        <PublicLayout>
            <Head title="Packages" />

            <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-12"
                >
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground md:text-5xl">Travel Packages</h1>
                            <p className="mt-2 text-lg text-muted-foreground">Discover our curated collection of spiritual and cultural journeys.</p>
                        </div>

                        {/* Filter Section */}
                        <div className="flex flex-wrap gap-3">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-32 border-white/20 bg-card/60 backdrop-blur-sm">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {typeOptions.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                                <SelectTrigger className="w-40 border-white/20 bg-card/60 backdrop-blur-sm">
                                    <SelectValue placeholder="Price" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priceOptions.map((price) => (
                                        <SelectItem key={price} value={price}>
                                            {price}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                <SelectTrigger className="w-36 border-white/20 bg-card/60 backdrop-blur-sm">
                                    <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durationOptions.map((duration) => (
                                        <SelectItem key={duration} value={duration}>
                                            {duration}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedPax} onValueChange={setSelectedPax}>
                                <SelectTrigger className="w-44 border-white/20 bg-card/60 backdrop-blur-sm">
                                    <SelectValue placeholder="Pax" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paxOptions.map((pax) => (
                                        <SelectItem key={pax} value={pax}>
                                            {pax}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </motion.div>

                {/* Packages Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
                >
                    {filteredPackages.map((pkg) => (
                        <Dialog key={pkg.id}>
                            <DialogTrigger asChild>
                                <motion.article
                                    variants={cardVariants}
                                    whileHover={{
                                        scale: 1.03,
                                        y: -8,
                                        transition: {
                                            duration: 0.3,
                                            ease: 'easeOut',
                                        },
                                    }}
                                    className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-500 ease-in-out hover:shadow-xl"
                                >
                                    {/* Image/Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={pkg.image}
                                            alt={pkg.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (nextElement) {
                                                    nextElement.style.display = 'block';
                                                }
                                            }}
                                        />
                                        <PlaceholderImage className="hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                                        {/* Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-full bg-primary/90 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                                                {pkg.type}
                                            </span>
                                        </div>

                                        {/* Hover Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5 md:p-6">
                                        <h3 className="mb-2 text-lg font-medium text-card-foreground transition-colors duration-300 group-hover:text-primary md:text-xl">
                                            {pkg.title}
                                        </h3>
                                        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                                            {pkg.location} · {pkg.duration} · Start from {pkg.price}
                                        </p>
                                        <p className="mb-4 text-xs text-muted-foreground">{pkg.pax}</p>

                                        {/* Additional Info */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <span>{pkg.duration}</span>
                                            </div>
                                            <div className="text-xs font-medium text-primary transition-transform duration-300 group-hover:scale-105">
                                                View details
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Accent Line */}
                                    <div className="h-1 origin-left scale-x-0 transform bg-gradient-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100" />
                                </motion.article>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl border-white/20 bg-card/90 backdrop-blur-xl sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">{pkg.title}</DialogTitle>
                                    <DialogDescription className="leading-relaxed">{pkg.description}</DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 space-y-4">
                                    <div className="rounded-lg border border-white/20 bg-card/60 p-3 backdrop-blur-sm">
                                        <strong>Location:</strong> {pkg.location} · <strong>Duration:</strong> {pkg.duration}
                                    </div>
                                    <div className="rounded-lg border border-white/20 bg-card/60 p-3 backdrop-blur-sm">
                                        <strong>Price:</strong> {pkg.price} per person · <strong>Group Size:</strong> {pkg.pax}
                                    </div>

                                    {pkg.features && (
                                        <div className="rounded-lg border border-white/20 bg-card/60 p-3 backdrop-blur-sm">
                                            <strong>Features:</strong>
                                            <ul className="mt-2 list-inside list-disc space-y-1">
                                                {pkg.features.map((feature, index) => (
                                                    <li key={index} className="text-sm">
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {pkg.dates && pkg.dates.length > 0 && (
                                        <div className="rounded-lg border border-white/20 bg-card/60 p-3 backdrop-blur-sm">
                                            <strong>Available Dates:</strong>
                                            <div className="mt-2 space-y-1">
                                                {pkg.dates.map((date, index) => (
                                                    <div key={index} className="flex items-center justify-between text-sm">
                                                        <span>{date.date}</span>
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                                date.status === 'Available'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : date.status === 'Sold Out'
                                                                      ? 'bg-red-100 text-red-700'
                                                                      : 'bg-amber-100 text-amber-700'
                                                            } `}
                                                        >
                                                            {date.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {pkg.hotels && pkg.hotels.length > 0 && (
                                        <div className="rounded-lg border border-white/20 bg-card/60 p-3 backdrop-blur-sm">
                                            <strong>Hotels:</strong>
                                            <div className="mt-2 space-y-1">
                                                {pkg.hotels.map((hotel, index) => (
                                                    <div key={index} className="flex items-center justify-between text-sm">
                                                        <span>{hotel.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {hotel.location} · {'★'.repeat(hotel.stars)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-lg border border-white/20 bg-card/60 p-3 backdrop-blur-sm">
                                        <strong>Highlights:</strong>
                                        <ul className="mt-2 list-inside list-disc space-y-1">
                                            {pkg.highlights.map((highlight, index) => (
                                                <li key={index} className="text-sm">
                                                    {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </motion.div>

                {/* No Results Message */}
                {filteredPackages.length === 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
                        <div className="mx-auto max-w-md">
                            <div className="mb-4 text-6xl">🔍</div>
                            <h3 className="mb-2 text-xl font-semibold text-foreground">No packages found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters to find the perfect package for your journey.</p>
                        </div>
                    </motion.div>
                )}
            </section>

            {/* Destination Photos Section */}
            <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 text-center"
                >
                    <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-6 py-3">
                        <span className="text-sm font-medium text-primary">📸 Destination Gallery</span>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Explore Our Destinations</h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Discover the breathtaking beauty and rich history of the destinations featured in our travel packages
                    </p>
                </motion.div>

                {/* Destination Photos Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
                >
                    {[
                        {
                            id: 1,
                            title: 'Petra, Jordan',
                            subtitle: 'The Rose City',
                            image: '/TURKEY.jpeg',
                            description: 'Ancient Nabataean city carved into red sandstone cliffs',
                            category: 'Historical',
                        },
                        {
                            id: 2,
                            title: 'Dome of the Rock',
                            subtitle: 'Jerusalem, Palestine',
                            image: '/umrah.jpeg',
                            description: 'Sacred Islamic shrine with stunning golden dome',
                            category: 'Religious',
                        },
                        {
                            id: 3,
                            title: 'Pyramids of Giza',
                            subtitle: 'Cairo, Egypt',
                            image: '/egypt.jpeg',
                            description: 'Ancient wonders of the world',
                            category: 'Historical',
                        },
                        {
                            id: 4,
                            title: 'Cappadocia',
                            subtitle: 'Turkey',
                            image: '/jordan.jpeg',
                            description: 'Fairy chimneys and hot air balloon rides',
                            category: 'Adventure',
                        },
                        {
                            id: 5,
                            title: 'Dubai Desert',
                            subtitle: 'UAE',
                            image: '/dubai1.jpeg',
                            description: 'Golden sand dunes and desert adventures',
                            category: 'Adventure',
                        },
                        {
                            id: 6,
                            title: 'Oman Desert',
                            subtitle: 'Muscat, Oman',
                            image: '/oman.jpg',
                            description: 'Ancient forts and traditional markets',
                            category: 'Cultural',
                        },
                    ].map((destination) => (
                        <motion.div
                            key={destination.id}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.03,
                                y: -8,
                                transition: { duration: 0.3, ease: 'easeOut' },
                            }}
                            className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-500"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={destination.image}
                                    alt={destination.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (nextElement) {
                                            nextElement.style.display = 'block';
                                        }
                                    }}
                                />
                                <PlaceholderImage className="hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />

                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="rounded-full bg-primary/90 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                                        {destination.category}
                                    </span>
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>

                            {/* Content */}
                            <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
                                <h3 className="mb-1 text-lg font-semibold">{destination.title}</h3>
                                <p className="mb-2 text-sm text-white/80">{destination.subtitle}</p>
                                <p className="text-xs text-white/70">{destination.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Gallery CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-12 text-center"
                >
                    <p className="mb-4 text-muted-foreground">Ready to experience these amazing destinations?</p>
                    <motion.a
                        href="/destinations"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-300 hover:shadow-lg"
                    >
                        View All Destinations
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.a>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/20 bg-card/60 backdrop-blur-xl">
                <motion.div
                    className="xs:px-4 xs:py-10 mx-auto max-w-7xl px-3 py-8 sm:px-5 sm:py-12 md:flex md:items-center md:justify-between md:px-6 md:py-12 lg:px-8 xl:px-10"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Contact Info */}
                    <div className="xs:text-sm text-center text-xs leading-relaxed text-muted-foreground sm:text-left md:text-sm">
                        <div className="font-medium">Email: hello@cahaya-anbiya.com</div>
                        <div className="xs:mt-1 mt-0.5 font-medium">WhatsApp: +62 812-3456-7890</div>
                    </div>

                    {/* Social Links */}
                    <div className="xs:gap-5 xs:text-sm mt-4 flex items-center justify-center gap-4 text-xs sm:mt-6 sm:gap-6 md:mt-0 md:text-sm">
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
                                className="font-medium transition-colors duration-200 hover:text-accent"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {social.name}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </footer>
        </PublicLayout>
    );
}
