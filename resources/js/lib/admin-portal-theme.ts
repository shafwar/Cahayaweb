/**
 * Cahaya Anbiya admin — light, professional UI (putih / krem seperti area terang B2C & splash).
 * Aksen oranye & emas; teks navy #1e3a5f untuk judul, bukan panel biru besar.
 */

export const adminPageBg =
    'relative min-h-screen overflow-hidden bg-[#f8f9fc] text-slate-800 antialiased';

/** Oranye & emas sangat lembut di atas putih */
export const adminAmbient =
    'pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(255,82,0,0.06),transparent_50%),radial-gradient(ellipse_at_100%_20%,rgba(254,201,1,0.08),transparent_45%),radial-gradient(ellipse_at_50%_100%,rgba(30,58,95,0.04),transparent_55%)]';

export const adminContent = 'relative z-10';

/** Kartu / section utama */
export const adminGlassPanel =
    'rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-200/40 ring-1 ring-slate-100/80';

/** Header strip di dalam kartu section */
export const adminSectionHeader =
    'border-b border-slate-100 bg-gradient-to-r from-white via-[#fffdfb] to-orange-50/40 px-5 py-4 sm:px-6';

export const adminMuted = 'text-slate-500';

export const adminPageTitle = 'text-3xl font-semibold tracking-tight text-[#1e3a5f] sm:text-4xl';

export const adminFieldLabel = 'block text-sm font-medium text-slate-700';

export const adminInput =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors focus:border-[#ff5200]/60 focus:outline-none focus:ring-2 focus:ring-[#ff5200]/20';

export const adminSelect = `${adminInput} cursor-pointer`;

export const adminTextarea = `${adminInput} min-h-[5rem] resize-y font-sans`;

export const adminTextareaMono = `${adminTextarea} font-mono text-xs leading-relaxed`;

export const adminSectionTitle = 'text-lg font-semibold tracking-tight text-[#1e3a5f]';

export const adminSectionDesc = `mt-1 text-sm ${adminMuted}`;

export const adminChip =
    'inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-gradient-to-r from-orange-50 to-amber-50/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#c2410c]';

export const adminPrimaryBtn =
    'rounded-xl bg-gradient-to-r from-[#ff5200] to-[#e64a00] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200/60 transition hover:from-[#ff6b35] hover:to-[#ff5200] disabled:opacity-60';

export const adminGhostBtn =
    'rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50';

export const adminBackLink =
    'inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-[#1e3a5f]';

/** Footer aksi create/edit */
export const adminStickyBar =
    'fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200/90 bg-white/95 px-4 py-4 shadow-[0_-8px_30px_-10px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-6';

/** Kartu dashboard / list */
export const adminDashboardCard =
    'group relative block h-full overflow-hidden rounded-2xl border-2 border-slate-200/90 bg-white shadow-md shadow-slate-200/30 transition-all duration-300 hover:border-orange-200/80 hover:shadow-lg hover:shadow-orange-100/50';
