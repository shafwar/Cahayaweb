/**
 * Shared copy for Admin B2C package forms (create + edit quick actions).
 * registration_deadline uses HTML datetime-local: YYYY-MM-DDTHH:mm (nilai dari browser admin).
 */

/** Selaras field form admin B2C (hindari impor sirkular ke B2cPackageAdminForm). */
export type B2cPackageTemplateFill = {
    package_code: string;
    name: string;
    departure_period: string;
    description: string;
    location: string;
    duration_label: string;
    package_type: string;
    price_display: string;
    pax_capacity: number;
    registration_deadline: string;
    terms_and_conditions: string;
    status: 'open' | 'closed';
    image_path: string;
    highlights_text: string;
    features_text: string;
    dates_text: string;
    hotels_text: string;
    sort_order: number;
};

export function formatDateTimeLocal(d: Date): string {
    const z = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
}

/** Suffix pendek agar package_code / nama unik tiap klik. */
export function randomPackageSuffix(length = 6): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const out: string[] = [];
    const buf = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(buf);
        for (let i = 0; i < length; i++) {
            out.push(chars[buf[i]! % chars.length]);
        }
    } else {
        for (let i = 0; i < length; i++) {
            out.push(chars[Math.floor(Math.random() * chars.length)]!);
        }
    }
    return out.join('');
}

/**
 * Deadline + Status Open untuk tombol perbaikan cepat di Edit (Register Online hidup lagi).
 */
export function getB2cQuickFixDeadlineAndOpen(deadlineDaysFromNow = 45): Pick<B2cPackageTemplateFill, 'registration_deadline' | 'status'> {
    const d = new Date();
    d.setDate(d.getDate() + Math.max(1, deadlineDaysFromNow));
    d.setHours(23, 59, 0, 0);
    return {
        registration_deadline: formatDateTimeLocal(d),
        status: 'open',
    };
}

/** @deprecated Pakai getB2cQuickFixDeadlineAndOpen() agar tanggal selalu ke depan. */
export const B2C_QUICK_FIX_DEADLINE_AND_OPEN = {
    registration_deadline: '2026-04-30T23:59',
    status: 'open' as const,
};

/** Template referensi statis (teks contoh); deadline-nya bisa lewat — untuk salin manual / referensi. */
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

export type B2cCreateTestFillOptions = {
    /** Hari dari sekarang sampai batas pendaftaran (default 45, jam 23:59 lokal). */
    deadlineDaysFromNow?: number;
    paxCapacity?: number;
};

/**
 * Isi penuh form Create: kode & nama unik, deadline di masa depan, Status Open — siap klik Create package (unggah gambar opsional).
 * Selaras dengan dummy `php artisan b2c:seed-dummy-packages`.
 */
export function getB2cCreateFormTestFill(options?: B2cCreateTestFillOptions): B2cPackageTemplateFill {
    const deadlineDays = options?.deadlineDaysFromNow ?? 45;
    const paxCap = options?.paxCapacity ?? 25;
    const suffix = randomPackageSuffix(6);
    const code = `DUMMY-${suffix}`;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Math.max(1, deadlineDays));
    deadline.setHours(23, 59, 0, 0);
    const registration_deadline = formatDateTimeLocal(deadline);

    const depStart = new Date();
    depStart.setDate(depStart.getDate() + Math.max(deadlineDays + 14, 60));
    const depEnd = new Date(depStart);
    depEnd.setDate(depEnd.getDate() + 9);
    const fmt = (x: Date) =>
        x.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const departure_period = `${fmt(depStart)} – ${fmt(depEnd)} (contoh)`;

    const d1 = new Date(deadline);
    d1.setDate(d1.getDate() + 7);
    const d2 = new Date(deadline);
    d2.setDate(d2.getDate() + 14);
    const lineDate = (x: Date) =>
        `${x.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}|Available`;

    return {
        package_code: code,
        name: `[TEST] Umroh Reguler — dummy ${suffix}`,
        departure_period,
        description:
            'Paket dummy untuk pengujian alur registrasi B2C. Peserta dapat mendaftar selama kuota dan batas pendaftaran masih berlaku. Ganti teks ini untuk produksi.',
        location: 'Makkah & Madinah',
        duration_label: '9 hari 8 malam',
        package_type: 'Religious',
        price_display: 'Rp 35.000.000 / pax',
        pax_capacity: Math.min(9999, Math.max(1, paxCap)),
        registration_deadline,
        terms_and_conditions:
            '1. Data peserta wajib benar.\n2. Pembayaran mengikuti ketentuan travel.\n3. Ini paket uji — hapus atau edit sebelum dipublikasikan ke pelanggan.',
        status: 'open',
        image_path: '',
        highlights_text: 'Visa & asuransi (contoh)\nMakan 3× sehari\nTour guide berpengalaman',
        features_text: 'Hotel jarak dekat Masjidil Haram\nManasik sebelum keberangkatan',
        dates_text: `${lineDate(d1)}\n${lineDate(d2)}`,
        hotels_text: 'Hotel Contoh Makkah|Makkah|4\nHotel Contoh Madinah|Madinah|4',
        sort_order: 0,
    };
}
