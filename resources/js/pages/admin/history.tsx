import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/layouts/public-layout';
import { getR2Url } from '@/utils/imageHelper';
import { 
    History, 
    RotateCcw, 
    Search, 
    Filter, 
    Image as ImageIcon, 
    Type,
    Calendar,
    User,
    ChevronDown,
    ChevronUp,
    ArrowLeft
} from 'lucide-react';

interface Revision {
    id: number;
    content: string | null;
    image: string | null;
    changed_by: string;
    change_type: string;
    created_at: string;
    created_at_human: string;
}

interface Section {
    key: string;
    current_content: string | null;
    current_image: string | null;
    updated_at: string;
    revisions: Revision[];
    total_revisions: number;
}

interface Props {
    sections: Section[];
}

export default function AdminHistoryPage({ sections }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'text' | 'image'>('all');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [isRestoring, setIsRestoring] = useState<number | null>(null);

    // Parse section key for better display
    const parseSectionKey = (key: string) => {
        const parts = key.split('.');
        const page = parts[0] || 'Unknown';
        const section = parts[1] || '';
        const id = parts[2] || '';
        const field = parts[3] || parts[2] || '';

        return {
            page: page.charAt(0).toUpperCase() + page.slice(1),
            section: section.replace(/([A-Z])/g, ' $1').trim(),
            id,
            field: field.charAt(0).toUpperCase() + field.slice(1),
            fullPath: key,
        };
    };

    // Filter sections
    const filteredSections = useMemo(() => {
        return sections.filter(section => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const { page, section: sectionName, field } = parseSectionKey(section.key);
                const searchText = `${page} ${sectionName} ${field} ${section.key}`.toLowerCase();
                if (!searchText.includes(query)) return false;
            }

            // Type filter
            if (filterType !== 'all') {
                const hasRevisions = section.revisions.length > 0;
                if (!hasRevisions) return false;

                if (filterType === 'text' && !section.current_content) return false;
                if (filterType === 'image' && !section.current_image) return false;
            }

            return true;
        });
    }, [sections, searchQuery, filterType]);

    // Group by page
    const groupedSections = useMemo(() => {
        const groups: Record<string, Section[]> = {};
        filteredSections.forEach(section => {
            const { page } = parseSectionKey(section.key);
            if (!groups[page]) groups[page] = [];
            groups[page].push(section);
        });
        return groups;
    }, [filteredSections]);

    const toggleSection = (key: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const handleRestore = async (sectionKey: string, revisionId: number) => {
        if (!confirm('Are you sure you want to restore to this version?\n\nThis will replace the current content with the selected revision.')) {
            return;
        }

        setIsRestoring(revisionId);

        try {
            await router.post('/admin/history/restore', {
                key: sectionKey,
                revision_id: revisionId,
            }, {
                preserveState: false,
                onSuccess: () => {
                    // Show success notification
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-20 right-4 z-[99999] rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl';
                    notification.innerHTML = `
                        <div class="flex items-center gap-3">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <div>
                                <div class="font-bold">✅ Restored Successfully!</div>
                                <div class="text-sm opacity-90">Reloading page...</div>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
                    }, 800);
                },
                onError: (errors) => {
                    console.error('Restore failed:', errors);
                    alert('Failed to restore: ' + (errors.message || 'Unknown error'));
                    setIsRestoring(null);
                }
            });
        } catch (error) {
            console.error('Restore error:', error);
            alert('Failed to restore revision');
            setIsRestoring(null);
        }
    };

    const getChangeTypeColor = (type: string) => {
        switch (type) {
            case 'text_update': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'image_upload': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'restore': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getChangeTypeIcon = (type: string) => {
        switch (type) {
            case 'text_update': return <Type className="h-3 w-3" />;
            case 'image_upload': return <ImageIcon className="h-3 w-3" />;
            case 'restore': return <RotateCcw className="h-3 w-3" />;
            default: return <History className="h-3 w-3" />;
        }
    };

    return (
        <PublicLayout>
            <Head title="Admin History Management" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.visit('/home')}
                            className="mb-4 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </button>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
                                    <History className="h-8 w-8 text-blue-400" />
                                    History Management
                                </h1>
                                <p className="mt-2 text-gray-400">
                                    View and restore all content changes across your website
                                </p>
                            </div>
                            <div className="rounded-lg bg-blue-500/10 px-4 py-2 text-center">
                                <div className="text-2xl font-bold text-blue-400">{sections.length}</div>
                                <div className="text-xs text-gray-400">Total Sections</div>
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
                                placeholder="Search by page, section, or field..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-3 pl-10 pr-4 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`flex items-center gap-2 rounded-lg px-4 py-3 transition-all ${
                                    filterType === 'all'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }`}
                            >
                                <Filter className="h-4 w-4" />
                                All
                            </button>
                            <button
                                onClick={() => setFilterType('text')}
                                className={`flex items-center gap-2 rounded-lg px-4 py-3 transition-all ${
                                    filterType === 'text'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }`}
                            >
                                <Type className="h-4 w-4" />
                                Text
                            </button>
                            <button
                                onClick={() => setFilterType('image')}
                                className={`flex items-center gap-2 rounded-lg px-4 py-3 transition-all ${
                                    filterType === 'image'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }`}
                            >
                                <ImageIcon className="h-4 w-4" />
                                Images
                            </button>
                        </div>
                    </div>

                    {/* Sections Grouped by Page */}
                    <div className="space-y-6">
                        {Object.entries(groupedSections).map(([page, pageSections]) => (
                            <div key={page} className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-sm">
                                <h2 className="mb-4 text-2xl font-bold text-white">
                                    {page} Page
                                    <span className="ml-3 text-sm font-normal text-gray-400">
                                        ({pageSections.length} sections)
                                    </span>
                                </h2>

                                <div className="space-y-3">
                                    {pageSections.map((section) => {
                                        const { section: sectionName, field, fullPath } = parseSectionKey(section.key);
                                        const isExpanded = expandedSections.has(section.key);

                                        return (
                                            <div
                                                key={section.key}
                                                className="rounded-lg border border-gray-700/50 bg-gray-900/50 transition-all hover:border-gray-600"
                                            >
                                                {/* Section Header */}
                                                <button
                                                    onClick={() => toggleSection(section.key)}
                                                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-800/30"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-semibold text-white">
                                                                {sectionName} - {field}
                                                            </span>
                                                            {section.current_image && (
                                                                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
                                                                    Has Image
                                                                </span>
                                                            )}
                                                            {section.current_content && (
                                                                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
                                                                    Has Text
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="mt-1 text-xs text-gray-500">{fullPath}</div>
                                                        {section.revisions.length > 0 && (
                                                            <div className="mt-2 text-sm text-gray-400">
                                                                {section.total_revisions} revision{section.total_revisions !== 1 ? 's' : ''} available
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </button>

                                                {/* Revisions List */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden border-t border-gray-700/50"
                                                        >
                                                            <div className="space-y-3 p-4">
                                                                {section.revisions.length === 0 ? (
                                                                    <div className="py-8 text-center text-gray-500">
                                                                        No revision history available
                                                                    </div>
                                                                ) : (
                                                                    section.revisions.map((revision, index) => (
                                                                        <motion.div
                                                                            key={revision.id}
                                                                            initial={{ opacity: 0, y: 10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ delay: index * 0.05 }}
                                                                            className="flex items-start gap-4 rounded-lg border border-gray-700/30 bg-gray-800/30 p-4"
                                                                        >
                                                                            {/* Timeline Indicator */}
                                                                            <div className="flex flex-col items-center">
                                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                                                                                    {getChangeTypeIcon(revision.change_type)}
                                                                                </div>
                                                                                {index < section.revisions.length - 1 && (
                                                                                    <div className="h-full w-px bg-gray-700/50" />
                                                                                )}
                                                                            </div>

                                                                            {/* Content */}
                                                                            <div className="flex-1">
                                                                                <div className="mb-2 flex items-start justify-between gap-4">
                                                                                    <div>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getChangeTypeColor(revision.change_type)}`}>
                                                                                                {getChangeTypeIcon(revision.change_type)}
                                                                                                {revision.change_type.replace('_', ' ')}
                                                                                            </span>
                                                                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                                                                <Calendar className="h-3 w-3" />
                                                                                                {revision.created_at_human}
                                                                                            </span>
                                                                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                                                                <User className="h-3 w-3" />
                                                                                                {revision.changed_by}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>

                                                                                    <button
                                                                                        onClick={() => handleRestore(section.key, revision.id)}
                                                                                        disabled={isRestoring === revision.id}
                                                                                        className="flex items-center gap-2 rounded-lg bg-green-500/20 px-3 py-1.5 text-sm font-medium text-green-400 transition-all hover:bg-green-500/30 disabled:opacity-50"
                                                                                    >
                                                                                        {isRestoring === revision.id ? (
                                                                                            <>
                                                                                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                                                </svg>
                                                                                                Restoring...
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <RotateCcw className="h-4 w-4" />
                                                                                                Restore
                                                                                            </>
                                                                                        )}
                                                                                    </button>
                                                                                </div>

                                                                                {/* Preview */}
                                                                                <div className="mt-3 space-y-2">
                                                                                    {revision.image && (
                                                                                        <div className="overflow-hidden rounded-lg border border-gray-700/50">
                                                                                            <img
                                                                                                src={getR2Url(revision.image)}
                                                                                                alt="Revision preview"
                                                                                                className="h-32 w-full object-cover"
                                                                                                onError={(e) => {
                                                                                                    const target = e.currentTarget;
                                                                                                    if (target.src && target.src.includes('assets.cahayaanbiya.com')) {
                                                                                                        const currentUrl = target.src;
                                                                                                        let altPath = currentUrl;
                                                                                                        if (currentUrl.includes('/public/images/')) {
                                                                                                            altPath = currentUrl.replace('/public/images/', '/images/');
                                                                                                        } else if (currentUrl.includes('/public/')) {
                                                                                                            altPath = currentUrl.replace('/public/', '/');
                                                                                                        } else if (currentUrl.includes('/images/')) {
                                                                                                            altPath = currentUrl.replace('/images/', '/public/images/');
                                                                                                        } else {
                                                                                                            const fileName = currentUrl.split('/').pop() || revision.image;
                                                                                                            altPath = `https://assets.cahayaanbiya.com/public/images/${fileName}`;
                                                                                                        }
                                                                                                        console.log('[History Image] Trying alternative R2 path:', altPath);
                                                                                                        target.src = altPath;
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                    {revision.content && (
                                                                                        <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-3 text-sm text-gray-300">
                                                                                            {revision.content}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {Object.keys(groupedSections).length === 0 && (
                            <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-12 text-center backdrop-blur-sm">
                                <History className="mx-auto h-16 w-16 text-gray-600" />
                                <h3 className="mt-4 text-xl font-semibold text-white">No History Found</h3>
                                <p className="mt-2 text-gray-400">
                                    {searchQuery || filterType !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'No content changes have been made yet'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
