import { type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { adminBackLink, adminFormHeroTitle, adminMuted, adminStickyBar } from '@/lib/admin-portal-theme';
import { B2C_PACKAGE_FORM_NAV } from '@/components/admin/b2c-package-form-nav';

type Props = {
    title: string;
    description?: string;
    chip: ReactNode;
    headerActions?: ReactNode;
    meta?: ReactNode;
    children: ReactNode;
    stickyNote: string;
    stickyActions: ReactNode;
};

/**
 * Kerangka halaman create/edit paket B2C: navigasi atas, hero kartu putih,
 * grid form + TOC desktop, bar aksi bawah (gunakan di dalam <form>).
 */
export default function B2cPackageFormPageLayout({
    title,
    description,
    chip,
    headerActions,
    meta,
    children,
    stickyNote,
    stickyActions,
}: Props) {
    return (
        <>
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
                <div className="mb-6 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/admin/b2c-packages" className={adminBackLink}>
                        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                        Back to packages
                    </Link>
                    <p className={`text-xs sm:text-right ${adminMuted}`}>Wide screens: jump between sections using the list on the right.</p>
                </div>

                <header className="mb-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">{chip}</div>
                            <h1 className={adminFormHeroTitle}>{title}</h1>
                            {meta ? <div className="pt-0.5">{meta}</div> : null}
                            {description ? <p className={`max-w-2xl text-sm leading-relaxed sm:text-base ${adminMuted}`}>{description}</p> : null}
                        </div>
                        {headerActions ? <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">{headerActions}</div> : null}
                    </div>
                </header>

                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:items-start lg:gap-12">
                    <div className="min-w-0 space-y-8">{children}</div>

                    <aside className="hidden lg:block" aria-label="Daftar bagian form">
                        <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Di halaman ini</p>
                            <nav className="mt-3">
                                <ul className="space-y-0.5 border-l-2 border-orange-100 pl-3">
                                    {B2C_PACKAGE_FORM_NAV.map((item, i) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="group flex gap-2.5 rounded-r-lg py-2 pr-1 text-sm text-slate-600 transition hover:bg-orange-50/80 hover:text-orange-800"
                                            >
                                                <span className="w-5 shrink-0 pt-0.5 text-right font-mono text-[11px] font-semibold text-slate-400 tabular-nums group-hover:text-orange-600">
                                                    {i + 1}
                                                </span>
                                                <span className="min-w-0 leading-snug">{item.label}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>

            <div className={adminStickyBar}>
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className={`text-xs sm:text-sm ${adminMuted}`}>{stickyNote}</p>
                    <div className="flex flex-wrap gap-2 sm:justify-end">{stickyActions}</div>
                </div>
            </div>
        </>
    );
}
