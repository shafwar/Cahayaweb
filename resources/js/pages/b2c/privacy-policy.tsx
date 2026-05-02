import LegalDocumentShell from '@/components/b2c/LegalDocumentShell';

export default function PrivacyPolicy() {
    return (
        <LegalDocumentShell
            title="Privacy Policy"
            description="How we collect, use, and protect your information when you use our website and services, including optional sign-in with Google."
        >
            <p className="lead text-[#475569]">
                Last updated:{' '}
                <strong>{new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())}</strong>
                . This policy applies to visitors and customers of Cahaya Anbiya Travel (PT Cahaya Anbiya Wisata Indonesia) using{' '}
                <strong>cahayaanbiya.com</strong> and related booking flows.
            </p>

            <h2>1. Who we are</h2>
            <p>
                We operate halal travel services (including Umrah/Hajj-related packages where offered). For privacy-related requests, contact us through the{' '}
                <a href="/contact">Contact</a> page using the published email or WhatsApp.
            </p>

            <h2>2. Information we collect</h2>
            <ul>
                <li>
                    <strong>Account &amp; authentication:</strong> name, email address, and (if you choose it) password; if you use{' '}
                    <strong>Sign in with Google</strong>, Google shares profile identifiers and email according to your Google account settings.
                </li>
                <li>
                    <strong>Bookings &amp; registrations:</strong> traveller details submitted on forms (for example passport-related fields, phone number,
                    address) as required for the package you selected.
                </li>
                <li>
                    <strong>Technical data:</strong> IP address, browser type, device information, cookies or similar technologies used for security,
                    sessions, and basic analytics where enabled.
                </li>
            </ul>

            <h2>3. How we use information</h2>
            <ul>
                <li>To create and secure your account, process registrations, and communicate about your booking.</li>
                <li>To comply with legal obligations (including travel-provider or immigration-related requirements where applicable).</li>
                <li>To improve our website, prevent fraud, and protect our systems.</li>
            </ul>

            <h2>4. Legal bases (summary)</h2>
            <p>
                Depending on context we rely on contract performance (providing travel services), legitimate interests (security and improvement),
                consent where required (for example marketing cookies if separately accepted), and legal obligation where applicable.
            </p>

            <h2>5. Sharing</h2>
            <p>
                We may share necessary data with payment providers, hosting/infrastructure vendors, email/support tools, and partner airlines/hotels or
                ground operators strictly as needed to fulfil your trip. We do not sell your personal data.
            </p>

            <h2>6. Retention</h2>
            <p>
                We retain information only as long as needed for operations, legal, tax, or dispute-resolution purposes. Registration and booking records may be
                kept for the periods required by applicable law or legitimate business needs.
            </p>

            <h2>7. Security</h2>
            <p>
                We use reasonable administrative, technical, and organisational measures to protect personal data. No method of transmission over the Internet is
                completely secure.
            </p>

            <h2>8. Your rights</h2>
            <p>
                Subject to applicable law (including Indonesian PDP Law where relevant), you may request access, correction, deletion, restriction, or objection in
                reasonable cases. Contact us via the published channels on our Contact page.
            </p>

            <h2>9. Third-party services</h2>
            <p>
                Our site may link to third parties or embed services (including Google OAuth). Those services have their own policies; please review Google&apos;s
                privacy documentation when using Google sign-in.
            </p>

            <h2>10. Changes</h2>
            <p>
                We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top will change when we publish revisions.
                Continued use of the site after changes constitutes acceptance unless otherwise required by law.
            </p>
        </LegalDocumentShell>
    );
}
