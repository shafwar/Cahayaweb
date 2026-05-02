import SeoHead from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

type LegalDocumentShellProps = {
    title: string;
    description: string;
    children: ReactNode;
};

export default function LegalDocumentShell({ title, description, children }: LegalDocumentShellProps) {
    return (
        <PublicLayout>
            <SeoHead title={`${title} - Cahaya Anbiya Travel`} description={description} />

            <div className="relative min-h-screen border-t border-[#d4af37]/20 bg-section-photos-home">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 h-[420px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(45,74,111,0.07),transparent_65%)] blur-3xl" />
                    <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,82,0,0.06),transparent_65%)] blur-3xl" />
                </div>

                <article className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
                    <header className="mb-10 text-center">
                        <div className="mb-4 inline-block">
                            <div className="rounded-full border-2 border-[#ff5200] bg-[#ff5200]/15 px-4 py-1.5 shadow-md">
                                <span className="text-xs font-bold tracking-wider text-[#e64a00] uppercase sm:text-sm">Legal</span>
                            </div>
                        </div>
                        <h1 className="mb-4 text-3xl font-bold tracking-tight text-[#1e3a5f] sm:text-4xl">{title}</h1>
                        <p className="mx-auto max-w-xl text-sm text-[#475569] sm:text-base">{description}</p>
                    </header>

                    <div className="rounded-2xl border-2 border-[#d4af37]/25 bg-white/95 p-6 shadow-lg backdrop-blur-sm sm:p-10">
                        <div className="max-w-none space-y-4 text-[15px] leading-relaxed text-slate-700 [&_.lead]:mb-6 [&_.lead]:text-base [&_a]:font-semibold [&_a]:text-[#c2410c] [&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#1e3a5f] [&_h2:first-of-type]:mt-0 [&_li]:mt-2 [&_strong]:text-[#1e3a5f] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
                            {children}
                        </div>
                    </div>

                    <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-[#e2e8f0] pt-8 text-center text-sm font-semibold">
                        <Link href="/privacy-policy" className="text-[#c2410c] underline-offset-4 hover:underline">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-of-service" className="text-[#c2410c] underline-offset-4 hover:underline">
                            Terms of Service
                        </Link>
                        <Link href="/contact" className="text-[#c2410c] underline-offset-4 hover:underline">
                            Contact
                        </Link>
                        <Link href="/home" className="text-[#64748b] underline-offset-4 hover:underline">
                            Home
                        </Link>
                    </nav>
                </article>

                <footer className="relative border-t-2 border-[#d4af37]/30 bg-gradient-to-b from-[#1e3a5f] to-[#2d4a6f] py-12">
                    <div className="mx-auto max-w-7xl px-4 text-center text-sm text-white/60 sm:px-6">
                        <p className="font-medium text-white/80">PT Cahaya Anbiya Wisata — Cahaya Anbiya Travel</p>
                        <p className="mt-2">Questions about these documents? Reach us via the Contact page.</p>
                        <p className="mt-6 text-white/45">© {new Date().getFullYear()} Cahaya Anbiya Travel. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </PublicLayout>
    );
}
