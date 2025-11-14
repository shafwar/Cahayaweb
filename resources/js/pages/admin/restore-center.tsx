import { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/layouts/public-layout';
import { 
    RotateCcw, 
    AlertCircle, 
    CheckCircle, 
    ArrowLeft, 
    Trash2,
    Filter,
    Search,
    Image as ImageIcon,
    Type,
    Calendar,
    Layers,
    RefreshCw,
    X
} from 'lucide-react';
import axios from 'axios';

interface Change {
    id: number;
    key: string;
    page: string;
    section: string;
    field: string;
    type: 'text' | 'image';
    content: string | null;
    image: string | null;
    updated_at: string;
    updated_at_human: string;
}

export default function RestoreCenter() {
    const [changes, setChanges] = useState<Change[]>([]);
    const [loading, setLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);
    const [result, setResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPage, setFilterPage] = useState<string>('all');
    const [filterType, setFilterType] = useState<'all' | 'text' | 'image'>('all');

    // Fetch changes
    const fetchChanges = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/admin/get-all-changes');
            setChanges(response.data.changes || []);
        } catch (error) {
            console.error('Failed to fetch changes:', error);
            setResult({
                status: 'error',
                message: 'Failed to load changes: ' + ((error as any).response?.data?.message || (error as any).message),
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChanges();
    }, []);

    // Get unique pages
    const pages = useMemo(() => {
        const uniquePages = new Set(changes.map(c => c.page));
        return Array.from(uniquePages).sort();
    }, [changes]);

    // Filter changes
    const filteredChanges = useMemo(() => {
        return changes.filter(change => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const searchText = `${change.page} ${change.section} ${change.field} ${change.key} ${change.content || ''}`.toLowerCase();
                if (!searchText.includes(query)) return false;
            }

            // Page filter
            if (filterPage !== 'all' && change.page.toLowerCase() !== filterPage.toLowerCase()) {
                return false;
            }

            // Type filter
            if (filterType !== 'all' && change.type !== filterType) {
                return false;
            }

            return true;
        });
    }, [changes, searchQuery, filterPage, filterType]);

    // Group by page
    const groupedChanges = useMemo(() => {
        const groups: Record<string, Change[]> = {};
        filteredChanges.forEach(change => {
            if (!groups[change.page]) groups[change.page] = [];
            groups[change.page].push(change);
        });
        return groups;
    }, [filteredChanges]);

    // Stats
    const stats = useMemo(() => {
        const textChanges = changes.filter(c => c.type === 'text').length;
        const imageChanges = changes.filter(c => c.type === 'image').length;
        return { total: changes.length, text: textChanges, image: imageChanges };
    }, [changes]);

    // Reset handlers
    const handleResetSingle = async (key: string, label: string) => {
        if (!confirm(`Reset "${label}"?\n\nThis will restore this item to its original default value.`)) {
            return;
        }

        setIsResetting(true);
        setResult(null);

        try {
            await axios.post('/admin/reset-to-default', { key });
            setResult({
                status: 'success',
                message: `✅ ${label} reset successfully!`,
            });
            await fetchChanges(); // Refresh list
            setTimeout(() => setResult(null), 3000);
        } catch (error) {
            setResult({
                status: 'error',
                message: `❌ Failed: ${(error as any).response?.data?.message || (error as any).message}`,
            });
        } finally {
            setIsResetting(false);
        }
    };

    const handleResetByPage = async (page: string) => {
        if (!confirm(`Reset ALL changes in ${page} page?\n\nThis will restore everything in this page to original defaults.`)) {
            return;
        }

        setIsResetting(true);
        setResult(null);

        try {
            await axios.post('/admin/reset-by-page', { page: page.toLowerCase() });
            setResult({
                status: 'success',
                message: `✅ All ${page} page changes reset successfully!`,
            });
            await fetchChanges();
            setTimeout(() => setResult(null), 3000);
        } catch (error) {
            setResult({
                status: 'error',
                message: `❌ Failed: ${(error as any).response?.data?.message || (error as any).message}`,
            });
        } finally {
            setIsResetting(false);
        }
    };

    const handleResetByType = async (type: 'text' | 'image') => {
        if (!confirm(`Reset ALL ${type} changes across entire website?\n\nThis will restore all ${type} modifications to original defaults.`)) {
            return;
        }

        setIsResetting(true);
        setResult(null);

        try {
            await axios.post('/admin/reset-by-type', { type });
            setResult({
                status: 'success',
                message: `✅ All ${type} changes reset successfully!`,
            });
            await fetchChanges();
            setTimeout(() => setResult(null), 3000);
        } catch (error) {
            setResult({
                status: 'error',
                message: `❌ Failed: ${(error as any).response?.data?.message || (error as any).message}`,
            });
        } finally {
            setIsResetting(false);
        }
    };

    const handleResetAll = async () => {
        if (!confirm('⚠️ RESET ALL CHANGES?\n\nThis will restore EVERYTHING on your website to original defaults.\n\nAre you absolutely sure?')) {
            return;
        }

        if (!confirm('🚨 FINAL CONFIRMATION\n\nThis action will delete ALL customizations:\n• All text changes\n• All image uploads\n• Everything across all pages\n\nThis cannot be undone easily. Continue?')) {
            return;
        }

        setIsResetting(true);
        setResult(null);

        try {
            await axios.post('/admin/reset-all-changes');
            setResult({
                status: 'success',
                message: `✅ All changes reset successfully! Redirecting...`,
            });
            setTimeout(() => {
                window.location.href = '/home?t=' + Date.now();
            }, 2000);
        } catch (error) {
            setResult({
                status: 'error',
                message: `❌ Failed: ${(error as any).response?.data?.message || (error as any).message}`,
            });
            setIsResetting(false);
        }
    };

    return (
        <PublicLayout>
            <Head title="Restore Center - Admin" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-6 px-3 sm:py-8 sm:px-4 md:py-12 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <button
                            onClick={() => router.visit('/home')}
                            className="mb-3 flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white sm:mb-4 sm:text-base"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>Back to Home</span>
                        </button>

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                                <h1 className="flex items-center gap-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                                    <RotateCcw className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-400" />
                                    Restore Center
                                </h1>
                                <p className="mt-2 text-sm text-gray-400 md:text-base">
                                    Complete control over all website changes - restore any text or image to original
                                </p>
                            </div>
                            <button
                                onClick={fetchChanges}
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2.5 text-sm text-blue-400 transition-all hover:bg-blue-500/30 disabled:opacity-50 md:w-auto md:py-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                            <div className="rounded-lg bg-blue-500/10 p-3 sm:p-4">
                                <div className="text-xl font-bold text-blue-400 sm:text-2xl">{stats.total}</div>
                                <div className="text-xs text-gray-400 sm:text-sm">Total Changes</div>
                            </div>
                            <div className="rounded-lg bg-purple-500/10 p-3 sm:p-4">
                                <div className="text-xl font-bold text-purple-400 sm:text-2xl">{stats.text}</div>
                                <div className="text-xs text-gray-400 sm:text-sm">Text Changes</div>
                            </div>
                            <div className="rounded-lg bg-pink-500/10 p-3 sm:p-4">
                                <div className="text-xl font-bold text-pink-400 sm:text-2xl">{stats.image}</div>
                                <div className="text-xs text-gray-400 sm:text-sm">Image Changes</div>
                            </div>
                            <div className="rounded-lg bg-green-500/10 p-3 sm:p-4">
                                <div className="text-xl font-bold text-green-400 sm:text-2xl">{pages.length}</div>
                                <div className="text-xs text-gray-400 sm:text-sm">Pages Modified</div>
                            </div>
                        </div>
                    </div>

                    {/* Result Alert */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`mb-4 rounded-lg p-3 sm:mb-6 sm:p-4 ${
                                    result.status === 'success'
                                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-1 items-start gap-2 sm:items-center sm:gap-3">
                                        {result.status === 'success' ? (
                                            <CheckCircle className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                                        ) : (
                                            <AlertCircle className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                                        )}
                                        <span className="text-xs leading-relaxed sm:text-sm">{result.message}</span>
                                    </div>
                                    <button onClick={() => setResult(null)} className="flex-shrink-0 text-gray-400 hover:text-white">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bulk Actions */}
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 sm:p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-white sm:text-xl">🔥 Bulk Reset Actions</h2>
                                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                                    Reset multiple items at once or restore entire website to defaults
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:flex md:flex-wrap">
                                <button
                                    onClick={() => handleResetByType('text')}
                                    disabled={isResetting || stats.text === 0}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-purple-500 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed sm:px-4 sm:text-sm"
                                >
                                    <Type className="h-4 w-4" />
                                    <span className="whitespace-nowrap">Reset Text ({stats.text})</span>
                                </button>
                                <button
                                    onClick={() => handleResetByType('image')}
                                    disabled={isResetting || stats.image === 0}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed sm:px-4 sm:text-sm"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    <span className="whitespace-nowrap">Reset Images ({stats.image})</span>
                                </button>
                                <button
                                    onClick={handleResetAll}
                                    disabled={isResetting || stats.total === 0}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-3 sm:px-4 sm:text-sm md:col-span-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="whitespace-nowrap">Reset Everything ({stats.total})</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search changes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-3 pl-10 pr-4 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Page Filter */}
                        <select
                            value={filterPage}
                            onChange={(e) => setFilterPage(e.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-auto"
                        >
                            <option value="all">All Pages</option>
                            {pages.map(page => (
                                <option key={page} value={page.toLowerCase()}>{page}</option>
                            ))}
                        </select>

                        {/* Type Filter */}
                        <div className="grid grid-cols-3 gap-2 sm:flex">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs transition-all sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
                                    filterType === 'all'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }`}
                            >
                                <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">All</span>
                            </button>
                            <button
                                onClick={() => setFilterType('text')}
                                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs transition-all sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
                                    filterType === 'text'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }`}
                            >
                                <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Text</span>
                            </button>
                            <button
                                onClick={() => setFilterType('image')}
                                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs transition-all sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
                                    filterType === 'image'
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }`}
                            >
                                <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Images</span>
                            </button>
                        </div>
                    </div>

                    {/* Changes List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-8 sm:py-12">
                            <div className="text-center">
                                <RefreshCw className="mx-auto h-10 w-10 animate-spin text-blue-400 sm:h-12 sm:w-12" />
                                <p className="mt-3 text-sm text-gray-400 sm:mt-4 sm:text-base">Loading changes...</p>
                            </div>
                        </div>
                    ) : Object.keys(groupedChanges).length === 0 ? (
                        <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-8 text-center backdrop-blur-sm sm:p-12">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-400 sm:h-16 sm:w-16" />
                            <h3 className="mt-3 text-lg font-semibold text-white sm:mt-4 sm:text-xl">No Changes Found</h3>
                            <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                                {searchQuery || filterPage !== 'all' || filterType !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Everything is at original defaults - no customizations made yet!'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 sm:space-y-6">
                            {Object.entries(groupedChanges).map(([page, pageChanges]) => (
                                <div key={page} className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 backdrop-blur-sm sm:p-6">
                                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-white sm:text-2xl">
                                                {page} Page
                                            </h2>
                                            <p className="text-xs text-gray-400 sm:text-sm">
                                                {pageChanges.length} change{pageChanges.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleResetByPage(page)}
                                            disabled={isResetting}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-orange-600 disabled:opacity-50 sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            <span>Reset Page</span>
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {pageChanges.map((change) => (
                                            <div
                                                key={change.id}
                                                className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-3 transition-all hover:border-gray-600 sm:p-4"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                                                    {/* Preview */}
                                                    {change.type === 'image' && change.image ? (
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={change.image}
                                                                alt="Preview"
                                                                className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                                                            />
                                                        </div>
                                                    ) : null}

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                change.type === 'image'
                                                                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                                                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                            }`}>
                                                                {change.type === 'image' ? (
                                                                    <ImageIcon className="h-3 w-3" />
                                                                ) : (
                                                                    <Type className="h-3 w-3" />
                                                                )}
                                                                {change.type}
                                                            </span>
                                                            <h3 className="text-sm font-semibold text-white sm:text-base">
                                                                {change.section} - {change.field}
                                                            </h3>
                                                        </div>
                                                        <p className="mt-1 truncate text-xs text-gray-500 sm:text-sm">{change.key}</p>
                                                        {change.type === 'text' && change.content && (
                                                            <p className="mt-2 line-clamp-2 text-xs text-gray-300 sm:text-sm">
                                                                {change.content}
                                                            </p>
                                                        )}
                                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                            <Calendar className="h-3 w-3" />
                                                            {change.updated_at_human}
                                                        </div>
                                                    </div>

                                                    {/* Action */}
                                                    <button
                                                        onClick={() => handleResetSingle(change.key, `${change.section} - ${change.field}`)}
                                                        disabled={isResetting}
                                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-purple-600 disabled:opacity-50 sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                        <span>Reset</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}

