import LegalDocumentShell from '@/components/b2c/LegalDocumentShell';

export default function TermsOfService() {
    return (
        <LegalDocumentShell
            title="Terms of Service"
            description="Rules for using our website, accounts, and travel-related services offered by Cahaya Anbiya Travel."
        >
            <p className="lead text-[#475569]">
                Last updated:{' '}
                <strong>{new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())}</strong>. By accessing{' '}
                <strong>cahayaanbiya.com</strong> or creating an account, you agree to these Terms together with our{' '}
                <a href="/privacy-policy">Privacy Policy</a>.
            </p>

            <h2>1. Operator</h2>
            <p>
                These Terms govern use of the website and related online services operated by <strong>PT Cahaya Anbiya Wisata Indonesia</strong> (
                &quot;Cahaya Anbiya&quot;, &quot;we&quot;, &quot;us&quot;).
            </p>

            <h2>2. Eligibility &amp; accounts</h2>
            <ul>
                <li>You must provide accurate registration information.</li>
                <li>You are responsible for safeguarding credentials. Notify us promptly if you suspect unauthorised access.</li>
                <li>Optional <strong>Google sign-in</strong> links your Google identity to your Cahaya Anbiya account subject to Google&apos;s terms.</li>
            </ul>

            <h2>3. Travel services</h2>
            <ul>
                <li>
                    Package descriptions, prices, dates, capacity, and inclusions are shown on the site or in confirmations and may change until confirmed in
                    writing according to our processes.
                </li>
                <li>
                    Passport validity, visas, health requirements, and traveller behaviour remain your responsibility unless expressly stated otherwise in a signed
                    agreement or formal quotation.
                </li>
                <li>Cancellation, reschedule, refund, and force-majeure rules follow the specific package terms communicated at booking and applicable law.</li>
            </ul>

            <h2>4. Payments</h2>
            <p>
                Payment schedules, methods, and confirmations will be communicated during checkout or by our staff. You agree to pay amounts due according to the
                agreed schedule.
            </p>

            <h2>5. Acceptable use</h2>
            <p>You agree not to misuse the site or accounts — including unlawful activity, scraping that harms performance, impersonation, or attempting unauthorised access.</p>

            <h2>6. Intellectual property</h2>
            <p>
                Content on this site (text, branding, layout, images where proprietary) is owned by Cahaya Anbiya or licensors. Do not copy or redistribute except as
                permitted by law or with our written consent.
            </p>

            <h2>7. Disclaimer</h2>
            <p>
                We strive for accurate information but do not guarantee error-free content. Travel involves third-party operators; schedules and external conditions may
                change. Liability is limited to the extent permitted by applicable law and any separate written agreement for your booking.
            </p>

            <h2>8. Limitation of liability</h2>
            <p>
                To the fullest extent permitted by law, we are not liable for indirect or consequential losses arising from site use unless caused by our wilful misconduct or
                gross negligence as determined under applicable law.
            </p>

            <h2>9. Suspension</h2>
            <p>We may suspend or terminate access where necessary for security, fraud prevention, or breach of these Terms.</p>

            <h2>10. Governing law</h2>
            <p>
                These Terms are governed by the laws of the Republic of Indonesia, unless mandatory consumer protections in your jurisdiction provide otherwise.
                Disputes should first be addressed through our Contact channels in good faith.
            </p>

            <h2>11. Changes</h2>
            <p>We may update these Terms; continued use after updates constitutes acceptance of the revised Terms where permitted by law.</p>
        </LegalDocumentShell>
    );
}
