/**
 * Shared copy for Admin B2C package forms (create + edit quick actions).
 * registration_deadline uses HTML datetime-local: YYYY-MM-DDTHH:mm (Waktu server = APP_TIMEZONE, biasanya WIB).
 */

/** Template lengkap — pakai di halaman Create ("Isi form dari template") atau salin dari docs. */
export const B2C_UMRAH_APRIL_2026_FULL = {
    package_code: 'CAH-UMR-2026-04',
    name: 'Umrah Premium 12 Hari — April 2026',
    departure_period: '14–24 April 2026',
    description:
        'Paket umrah dengan hotel bintang 5 dekat Masjidil Haram, mutawwif berpengalaman, dan dokumentasi lengkap. Termasuk tiket pesawat PP, visa, asuransi, dan makan 3x sehari.',
    location: 'Makkah & Madinah',
    duration_label: '10 Days',
    package_type: 'Umrah',
    price_display: 'From Rp 45.000.000 / pax',
    pax_capacity: 40,
    /** Tutup pendaftaran 30 Apr 2026 malam; sesuaikan jika Anda ingin tutup sebelum tanggal berangkat (mis. 12 Apr). */
    registration_deadline: '2026-04-30T23:59',
    terms_and_conditions:
        'Peserta wajib memiliki paspor min. 6 bulan validitas. Pembatalan <30 hari sebelum keberangkatan dikenakan biaya sesuai kebijakan maskapai. Cahaya Anbiya berhak menolak pendaftaran jika kuota penuh.',
    highlights_text: 'Hotel 5* walking distance\nMutawwif berbahasa Indonesia\nManasik intensif',
    features_text: 'Tiket PP ekonomi premium\nVisa umrah\nAsuransi perjalanan\nMakan 3x',
    dates_text: '14 April 2026|Available\n18 April 2026|Limited',
    hotels_text: 'Pullman Zamzam Makkah|Makkah|5\nOberoi Madinah|Madinah|5',
    sort_order: 10,
} as const;

/** Hanya untuk perbaikan cepat di Edit: Register Online hidup lagi (deadline ke depan + Status Open). */
export const B2C_QUICK_FIX_DEADLINE_AND_OPEN = {
    registration_deadline: '2026-04-30T23:59',
    status: 'open' as const,
};
