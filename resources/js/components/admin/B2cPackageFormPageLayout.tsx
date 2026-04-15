import { type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { adminBackLink, adminFormHeroTitle, adminMuted, adminStickyBar } from '@/lib/admin-portal-theme';
import { B2C_PACKAGE_FORM_NAV } from '@/components/admin/b2c-package-form-nav';

type Props = {
    title: string;
    /** Satu baris opsional di bawah judul / meta */
    description?: string;
    headerActions?: ReactNode;
    meta?: ReactNode;
    /** Kanan bar atas (mis. Logout) */
    topBarEnd?: ReactNode;
    children: ReactNode;
    stickyNote: string;
    stickyActions: ReactNode;
};

/**
 * Halaman create/edit paket: tanpa kartu hero besar — bar atas (Back | aksi),
 * lalu judul + slot kanan, lalu form + TOC.
 */
export default function B2cPackageFormPageLayout({
    title,
    description,
    meta,
    headerActions,
    topBarEnd,
    children,
    stickyNote,
    stickyActions,
}: Props) {
    return (
        <>
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
                <div className="mb-8 border-b border-slate-200/80 pb-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/admin/b2c-packages" className={adminBackLink}>
                            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                            Back to packages
                        </Link>
                        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">{topBarEnd}</div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                        <div className="min-w-0 flex-1">
                            <h1 className={adminFormHeroTitle}>{title}</h1>
                            {meta ? <div className="mt-2">{meta}</div> : null}
                            {description ? (
                                <p className={`mt-2 max-w-2xl text-sm leading-relaxed sm:text-base ${adminMuted}`}>{description}</p>
                            ) : null}
                        </div>
                        {headerActions ? <div className="flex shrink-0 flex-wrap gap-2 sm:pt-0.5">{headerActions}</div> : null}
                    </div>
                </div>

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
