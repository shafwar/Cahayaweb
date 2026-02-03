import GlobalHeader from '@/components/GlobalHeader';
import SeoHead from '@/components/SeoHead';
import { getR2Url } from '@/utils/imageHelper';
import { searchItems, SearchResult } from '@/utils/search';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FileText, MapPin, Package, Search as SearchIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Import destinations and packages data
const destinations = [
    {
        id: 1,
        title: 'Arab Saudi',
        subtitle: 'Spiritual Journey to the Holy Land',
        image: '/arabsaudi.jpg',
        duration: '9D8N',
        price: 'Rp 28.5M',
        location: 'Makkah & Madinah',
        highlights: '5-star hotels, direct flights, professional guide, spiritual guidance',
        description:
            'Embark on a profound spiritual journey to the holiest sites in Islam. Experience the sacred atmosphere of Makkah and Madinah with our premium Umrah packages.',
        category: 'Spiritual',
    },
    {
        id: 2,
        title: 'Turkey Heritage',
        subtitle: 'Istanbul to Cappadocia Adventure',
        image: '/TURKEY.jpeg',
        duration: '8D7N',
        price: 'Rp 15.8M',
        location: 'Istanbul, Cappadocia, Pamukkale',
        highlights: 'Historical sites, hot air balloon, cultural experience, thermal springs',
        description:
            'Discover the perfect blend of East and West in Turkey. Explore magnificent Hagia Sophia and Blue Mosque, soar above fairy chimneys in a hot air balloon.',
        category: 'Cultural',
    },
    {
        id: 3,
        title: 'Egypt Wonders',
        subtitle: 'Pyramids & Nile River Expedition',
        image: '/egypt.jpeg',
        duration: '8D7N',
        price: 'Rp 16.5M',
        location: 'Cairo, Luxor, Aswan, Abu Simbel',
        highlights: 'Pyramids of Giza, Nile cruise, ancient temples, Valley of the Kings',
        description:
            'Journey through the cradle of civilization and explore the mysteries of ancient Egypt. Marvel at the Great Pyramids of Giza and cruise the majestic Nile River.',
        category: 'Historical',
    },
    {
        id: 4,
        title: 'Dubai Luxury',
        subtitle: 'Modern Wonders & Desert Adventures',
        image: '/dubai1.jpeg',
        duration: '5D4N',
        price: 'Rp 14.2M',
        location: 'Dubai, Abu Dhabi, Desert Safari',
        highlights: 'Burj Khalifa, desert safari, luxury shopping, Ferrari World',
        description:
            'Experience the epitome of luxury and innovation in Dubai. Ascend the iconic Burj Khalifa, shop in world-class malls, and enjoy thrilling desert safaris.',
        category: 'Modern',
    },
    {
        id: 5,
        title: 'Oman Adventure',
        subtitle: 'Muscat + Nizwa + Wahiba Sands',
        image: '/oman.jpg',
        duration: '6D5N',
        price: 'Rp 18.9M',
        location: 'Muscat, Nizwa, Wahiba Sands, Salalah',
        highlights: 'Desert camping, ancient forts, wadis, traditional souks',
        description:
            'Explore the hidden gem of the Arabian Peninsula. Discover stunning fjords of Musandam, explore ancient forts in Nizwa, and camp under the stars in Wahiba Sands.',
        category: 'Adventure',
    },
    {
        id: 6,
        title: 'Qatar Luxury',
        subtitle: 'Doha + The Pearl + Desert Safari',
        image: '/qatar.jpg',
        duration: '5D4N',
        price: 'Rp 16.2M',
        location: 'Doha, The Pearl, Inland Sea, Al Wakrah',
        highlights: 'Museum of Islamic Art, Souq Waqif, desert safari, luxury resorts',
        description:
            'Experience the perfect blend of tradition and modernity in Qatar. Visit the stunning Museum of Islamic Art and explore the vibrant Souq Waqif.',
        category: 'Luxury',
    },
    {
        id: 7,
        title: 'Kuwait Heritage',
        subtitle: 'Kuwait City + Failaka Island',
        image: '/kuwait.jpg',
        duration: '4D3N',
        price: 'Rp 12.8M',
        location: 'Kuwait City, Failaka Island, Al Jahra',
        highlights: 'Kuwait Towers, Grand Mosque, island visit, cultural heritage',
        description:
            'Discover the rich heritage and modern charm of Kuwait. Visit the iconic Kuwait Towers and explore the magnificent Grand Mosque.',
        category: 'Cultural',
    },
    {
        id: 8,
        title: 'Bahrain Pearl',
        subtitle: "Manama + Qal'at al-Bahrain",
        image: '/bahrain.jpg',
        duration: '4D3N',
        price: 'Rp 11.5M',
        location: "Manama, Qal'at al-Bahrain, Al Muharraq",
        highlights: 'Pearl diving, ancient forts, Formula 1 circuit, traditional culture',
        description:
            'Experience the pearl of the Gulf with its rich history and modern attractions. Explore ancient forts and learn about traditional pearl diving.',
        category: 'Heritage',
    },
    {
        id: 9,
        title: 'Jordan Discovery',
        subtitle: 'Wadi Rum & Petra Adventure',
        image: '/jordan.jpeg',
        duration: '7D6N',
        price: 'Rp 17.2M',
        location: 'Amman, Petra, Wadi Rum, Dead Sea',
        highlights: 'Petra ancient city, desert camping, Dead Sea, biblical sites',
        description:
            'Journey through the ancient wonders of Jordan. Explore the magnificent rock-cut city of Petra and camp under the stars in Wadi Rum desert.',
        category: 'Historical',
    },
];

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
    },
];

// Navigation pages for search
const pages = [
    {
        id: 'home',
        title: 'Home',
        subtitle: 'Halaman Utama',
        description: 'Beranda Cahaya Anbiya Travel - Temukan paket wisata terbaik untuk perjalanan spiritual dan budaya Anda',
        href: '/home',
        keywords: ['beranda', 'halaman utama', 'utama', 'homepage', 'home'],
    },
    {
        id: 'about',
        title: 'About Us',
        subtitle: 'Tentang Kami',
        description: 'Pelajari lebih lanjut tentang Cahaya Anbiya Travel, agen perjalanan terpercaya untuk wisata spiritual dan budaya',
        href: '/about',
        keywords: ['tentang', 'tentang kami', 'about us', 'profil', 'sejarah', 'about'],
    },
    {
        id: 'destinations',
        title: 'Destinations',
        subtitle: 'Destinasi Wisata',
        description: 'Jelajahi berbagai destinasi wisata menarik di seluruh dunia dengan Cahaya Anbiya Travel',
        href: '/destinations',
        keywords: ['destinasi', 'tempat wisata', 'lokasi', 'wisata', 'travel', 'destinations'],
    },
    {
        id: 'packages',
        title: 'Packages',
        subtitle: 'Paket Wisata',
        description: 'Pilih paket wisata terbaik yang sesuai dengan kebutuhan dan budget Anda',
        href: '/packages',
        keywords: ['paket', 'paket wisata', 'tour', 'perjalanan', 'trip', 'packages'],
    },
    {
        id: 'highlights',
        title: 'Highlights',
        subtitle: 'Unggulan',
        description: 'Lihat highlight dan paket wisata unggulan dari Cahaya Anbiya Travel',
        href: '/highlights',
        keywords: ['highlight', 'unggulan', 'favorit', 'populer', 'terbaik', 'highlights'],
    },
    {
        id: 'contact',
        title: 'Contact',
        subtitle: 'Kontak Kami',
        description: 'Hubungi kami untuk informasi lebih lanjut tentang paket wisata dan layanan kami',
        href: '/contact',
        keywords: ['kontak', 'hubungi', 'customer service', 'cs', 'bantuan', 'contact'],
    },
    {
        id: 'blog',
        title: 'Blog',
        subtitle: 'Artikel & Berita',
        description: 'Baca artikel dan berita terbaru tentang wisata, tips perjalanan, dan informasi destinasi',
        href: '/blog',
        keywords: ['artikel', 'berita', 'news', 'informasi', 'blog'],
    },
];

export default function SearchPage() {
    const page = usePage();
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const searchResults = searchItems(searchQuery, destinations, packages, pages);
            setResults(searchResults);
        } else {
            setResults([]);
        }
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const searchResults = searchItems(searchQuery, destinations, packages, pages);
            setResults(searchResults);
            // Update URL without reload
            window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const groupedResults = {
        pages: results.filter((r) => r.type === 'page'),
        destinations: results.filter((r) => r.type === 'destination'),
        packages: results.filter((r) => r.type === 'package'),
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
            <SeoHead title="Search - Cahaya Anbiya Travel" description="Cari paket perjalanan dan destinasi terbaik dari Cahaya Anbiya Travel." />
            <GlobalHeader variant="b2c" />

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
                {/* Search Bar */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
                    <form
                        onSubmit={handleSearch}
                        className="group relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-black/80 to-slate-900/60 shadow-lg shadow-amber-500/10 transition-all duration-300 focus-within:border-amber-500/70 focus-within:ring-2 focus-within:shadow-amber-500/20 focus-within:ring-amber-500/20"
                    >
                        <div className="flex items-stretch">
                            <div className="flex items-center justify-center pr-4 pl-6">
                                <SearchIcon className="h-6 w-6 text-amber-500/70 transition-colors duration-300 group-focus-within:text-amber-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari destinasi, paket, atau lokasi..."
                                className="flex-1 border-none bg-transparent py-5 text-base font-medium text-white placeholder:text-white/40 focus:outline-none focus:placeholder:text-white/30 lg:text-lg"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setResults([]);
                                        window.history.pushState({}, '', '/search');
                                    }}
                                    className="flex items-center justify-center px-4 text-white/40 transition-colors hover:text-white/70"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={!searchQuery.trim()}
                                className="flex items-center justify-center bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 px-8 py-5 text-base font-bold text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:from-amber-400 hover:via-amber-400 hover:to-orange-400 hover:shadow-amber-400/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-amber-500 disabled:hover:via-amber-500 disabled:hover:to-orange-500"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Results */}
                {searchQuery.trim() ? (
                    <div className="space-y-8">
                        {results.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                                <SearchIcon className="mx-auto mb-4 h-16 w-16 text-white/20" />
                                <h3 className="mb-2 text-xl font-semibold text-white/70">Tidak ada hasil ditemukan</h3>
                                <p className="text-white/50">Coba gunakan kata kunci lain atau periksa ejaan Anda</p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Summary */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white/60">
                                    Ditemukan <span className="font-semibold text-amber-400">{results.length}</span> hasil untuk &quot;
                                    <span className="font-semibold text-white">{searchQuery}</span>&quot;
                                </motion.div>

                                {/* Pages */}
                                {groupedResults.pages.length > 0 && (
                                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                                            <FileText className="h-5 w-5 text-amber-500" />
                                            Halaman ({groupedResults.pages.length})
                                        </h2>
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {groupedResults.pages.map((result, index) => (
                                                <motion.div
                                                    key={result.item.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.05 + index * 0.03 }}
                                                >
                                                    <Link
                                                        href={result.item.href || '#'}
                                                        className="group flex items-start gap-4 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 p-4 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20"
                                                    >
                                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 transition-all group-hover:from-amber-500/30 group-hover:to-orange-500/30">
                                                            <FileText className="h-6 w-6" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="mb-1 text-base font-bold text-white transition-colors group-hover:text-amber-400">
                                                                {result.item.title}
                                                            </h3>
                                                            {result.item.subtitle && (
                                                                <p className="mb-2 text-sm text-white/70">{result.item.subtitle}</p>
                                                            )}
                                                            {result.item.description && (
                                                                <p className="line-clamp-2 text-xs text-white/50">{result.item.description}</p>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.section>
                                )}

                                {/* Destinations */}
                                {groupedResults.destinations.length > 0 && (
                                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                                            <MapPin className="h-5 w-5 text-amber-500" />
                                            Destinasi ({groupedResults.destinations.length})
                                        </h2>
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {groupedResults.destinations.map((result, index) => (
                                                <motion.div
                                                    key={result.item.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 + index * 0.05 }}
                                                >
                                                    <Link
                                                        href="/destinations"
                                                        className="group block overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20"
                                                    >
                                                        <div className="relative aspect-video overflow-hidden">
                                                            <img
                                                                src={getR2Url(result.item.image)}
                                                                alt={result.item.title}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                onError={(e) => {
                                                                    const target = e.currentTarget;
                                                                    if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                                                        const currentUrl = target.src;
                                                                        let altPath = currentUrl;
                                                                        if (currentUrl.includes('/public/images/')) {
                                                                            altPath = currentUrl.replace('/public/images/', '/images/');
                                                                        } else if (currentUrl.includes('/public/')) {
                                                                            altPath = currentUrl.replace('/public/', '/');
                                                                        } else if (currentUrl.includes('/images/')) {
                                                                            altPath = currentUrl.replace('/images/', '/public/images/');
                                                                        } else {
                                                                            const fileName = currentUrl.split('/').pop() || result.item.image;
                                                                            altPath = `https://assets.cahayaanbiya.com/public/images/${fileName}`;
                                                                        }
                                                                        console.log('[Search Image] Trying alternative R2 path:', altPath);
                                                                        target.src = altPath;
                                                                    }
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                            <div className="absolute right-4 bottom-4 left-4">
                                                                <h3 className="mb-1 text-lg font-bold text-white">{result.item.title}</h3>
                                                                {result.item.subtitle && (
                                                                    <p className="text-sm text-white/80">{result.item.subtitle}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <div className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                                                {result.item.location && (
                                                                    <>
                                                                        <MapPin className="h-4 w-4" />
                                                                        <span>{result.item.location}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-amber-400">{result.item.price}</span>
                                                                <span className="text-xs text-white/50">{result.item.duration}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.section>
                                )}

                                {/* Packages */}
                                {groupedResults.packages.length > 0 && (
                                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                                            <Package className="h-5 w-5 text-amber-500" />
                                            Paket ({groupedResults.packages.length})
                                        </h2>
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {groupedResults.packages.map((result, index) => (
                                                <motion.div
                                                    key={result.item.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + index * 0.05 }}
                                                >
                                                    <Link
                                                        href="/packages"
                                                        className="group block overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20"
                                                    >
                                                        <div className="relative aspect-video overflow-hidden">
                                                            <img
                                                                src={getR2Url(result.item.image)}
                                                                alt={result.item.title}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                onError={(e) => {
                                                                    const target = e.currentTarget;
                                                                    if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                                                        const currentUrl = target.src;
                                                                        let altPath = currentUrl;
                                                                        if (currentUrl.includes('/public/images/')) {
                                                                            altPath = currentUrl.replace('/public/images/', '/images/');
                                                                        } else if (currentUrl.includes('/public/')) {
                                                                            altPath = currentUrl.replace('/public/', '/');
                                                                        } else if (currentUrl.includes('/images/')) {
                                                                            altPath = currentUrl.replace('/images/', '/public/images/');
                                                                        } else {
                                                                            const fileName = currentUrl.split('/').pop() || result.item.image;
                                                                            altPath = `https://assets.cahayaanbiya.com/public/images/${fileName}`;
                                                                        }
                                                                        console.log('[Search Image] Trying alternative R2 path:', altPath);
                                                                        target.src = altPath;
                                                                    }
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                            <div className="absolute right-4 bottom-4 left-4">
                                                                <h3 className="mb-1 text-lg font-bold text-white">{result.item.title}</h3>
                                                                {result.item.location && (
                                                                    <p className="text-sm text-white/80">{result.item.location}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <div className="mb-2 flex items-center gap-2 text-sm text-white/60">
                                                                {result.item.location && (
                                                                    <>
                                                                        <MapPin className="h-4 w-4" />
                                                                        <span>{result.item.location}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-amber-400">{result.item.price}</span>
                                                                <span className="text-xs text-white/50">{result.item.duration}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.section>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                        <SearchIcon className="mx-auto mb-4 h-16 w-16 text-white/20" />
                        <h3 className="mb-2 text-xl font-semibold text-white/70">Cari Destinasi & Paket Wisata</h3>
                        <p className="mx-auto max-w-md text-white/50">
                            Masukkan kata kunci untuk mencari destinasi atau paket wisata yang Anda inginkan
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
