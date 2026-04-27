/**
 * Dummy payload for the public B2C package registration form (manual QA).
 * Values satisfy typical validation: DOB before today, unique-ish email, etc.
 */

export type B2cRegistrationDummyFill = {
    full_name: string;
    email: string;
    phone: string;
    passport_number: string;
    address: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    pax: number;
    terms_accepted: boolean;
};

function randomToken(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    }
    return String(Date.now());
}

/**
 * @param maxPax — from package.available_pax (capped server-side to 1–50)
 */
export function getB2cRegistrationFormDummyFill(options: { maxPax: number }): B2cRegistrationDummyFill {
    const token = randomToken();
    const cap = Math.max(1, Math.min(50, options.maxPax));
    const pax = Math.min(2, cap);

    return {
        full_name: 'Peserta Dummy — Uji Form B2C',
        email: `b2c.dummy.${token}@example.com`,
        phone: '081234567890',
        passport_number: 'A12345678',
        address: 'Jl. Contoh Registrasi No. 10, RT 001/RW 002, Kebayoran Baru, Jakarta Selatan 12120',
        date_of_birth: '1990-06-15',
        gender: 'male',
        pax,
        terms_accepted: true,
    };
}
