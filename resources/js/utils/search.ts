/**
 * Optimized keyword-based search utility for destinations, packages, and pages
 * Provides accurate, comprehensive search functionality with precise keyword matching
 */

export interface SearchableItem {
    id: number | string;
    title: string;
    subtitle?: string;
    location?: string;
    description?: string;
    highlights?: string | string[];
    category?: string;
    type?: string;
    href?: string;
    keywords?: string[]; // Additional keywords for better matching
    [key: string]: any;
}

export interface SearchResult {
    item: SearchableItem;
    score: number;
    matchedFields: string[];
    matchedKeywords: string[];
    type: 'destination' | 'package' | 'page';
}

/**
 * Keyword mapping for better search accuracy
 * Maps common search terms to relevant keywords
 */
const KEYWORD_MAP: { [key: string]: string[] } = {
    // Navigation pages
    'home': ['beranda', 'halaman utama', 'utama', 'homepage'],
    'about': ['tentang', 'tentang kami', 'about us', 'profil', 'sejarah'],
    'destinations': ['destinasi', 'tempat wisata', 'lokasi', 'wisata', 'travel'],
    'packages': ['paket', 'paket wisata', 'tour', 'perjalanan', 'trip'],
    'highlights': ['highlight', 'unggulan', 'favorit', 'populer', 'terbaik'],
    'contact': ['kontak', 'hubungi', 'customer service', 'cs', 'bantuan'],
    'blog': ['artikel', 'berita', 'news', 'informasi'],
    
    // Destinations keywords
    'arab saudi': ['saudi', 'makkah', 'madinah', 'umrah', 'hajj', 'haji'],
    'turkey': ['turki', 'istanbul', 'cappadocia', 'pamukkale'],
    'egypt': ['mesir', 'cairo', 'pyramid', 'piramida', 'nile', 'nil'],
    'dubai': ['uae', 'abu dhabi', 'burj khalifa'],
    'jordan': ['petra', 'wadi rum', 'dead sea', 'amman'],
    'oman': ['muscat', 'nizwa', 'wahiba'],
    'qatar': ['doha', 'pearl'],
    'kuwait': ['kuwait city'],
    'bahrain': ['manama', 'pearl diving'],
    
    // Package keywords
    'religious': ['spiritual', 'rohani', 'islam', 'nabi', 'sejarah nabi'],
    'cultural': ['budaya', 'tradisional', 'heritage', 'warisan'],
    'adventure': ['petualangan', 'eksplorasi', 'outdoor'],
    'luxury': ['mewah', 'premium', 'vip'],
};

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
    const normalized = normalizeText(text);
    const words = normalized.split(/\s+/).filter(w => w.length > 2);
    return [...new Set(words)]; // Remove duplicates
}

/**
 * Expand query with synonyms and related keywords
 */
function expandQuery(query: string): string[] {
    const normalized = normalizeText(query);
    const expanded: string[] = [normalized];
    
    // Check if query matches any keyword map
    for (const [key, synonyms] of Object.entries(KEYWORD_MAP)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            expanded.push(...synonyms);
        }
        // Also check if any synonym matches
        for (const synonym of synonyms) {
            if (normalized.includes(synonym) || synonym.includes(normalized)) {
                expanded.push(key, ...synonyms);
            }
        }
    }
    
    return [...new Set(expanded)];
}

/**
 * Normalize text for search comparison
 * Removes accents, converts to lowercase, trims whitespace, removes special chars
 */
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^\w\s]/g, ' ') // Replace special chars with space
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .trim();
}

/**
 * Calculate word similarity (simple Levenshtein-like for partial matching)
 */
function wordSimilarity(word1: string, word2: string): number {
    if (word1 === word2) return 1.0;
    if (word1.includes(word2) || word2.includes(word1)) return 0.8;
    
    // Check for common prefixes/suffixes
    const minLen = Math.min(word1.length, word2.length);
    let matches = 0;
    for (let i = 0; i < minLen; i++) {
        if (word1[i] === word2[i]) matches++;
    }
    return matches / Math.max(word1.length, word2.length);
}

/**
 * Check if query matches text with various strategies
 */
function matchQuery(query: string, text: string): { matched: boolean; score: number; matchedWords: string[] } {
    const normalizedQuery = normalizeText(query);
    const normalizedText = normalizeText(text);
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
    const textWords = normalizedText.split(/\s+/).filter(w => w.length > 0);
    
    let score = 0;
    const matchedWords: string[] = [];
    
    // Exact phrase match
    if (normalizedText.includes(normalizedQuery)) {
        score += 100;
        matchedWords.push(...queryWords);
        return { matched: true, score, matchedWords };
    }
    
    // All words match (AND logic)
    let allWordsMatch = true;
    let wordMatchScore = 0;
    for (const queryWord of queryWords) {
        let wordMatched = false;
        let bestMatch = 0;
        
        for (const textWord of textWords) {
            if (textWord === queryWord) {
                wordMatched = true;
                bestMatch = 1.0;
                matchedWords.push(queryWord);
                break;
            } else if (textWord.includes(queryWord) || queryWord.includes(textWord)) {
                wordMatched = true;
                bestMatch = Math.max(bestMatch, 0.8);
                if (!matchedWords.includes(queryWord)) {
                    matchedWords.push(queryWord);
                }
            } else {
                const similarity = wordSimilarity(queryWord, textWord);
                if (similarity > 0.6) {
                    wordMatched = true;
                    bestMatch = Math.max(bestMatch, similarity);
                    if (!matchedWords.includes(queryWord)) {
                        matchedWords.push(queryWord);
                    }
                }
            }
        }
        
        if (!wordMatched) {
            allWordsMatch = false;
        } else {
            wordMatchScore += bestMatch;
        }
    }
    
    if (allWordsMatch) {
        score += (wordMatchScore / queryWords.length) * 80;
    } else {
        // Partial match (OR logic) - at least one word matches
        const matchedCount = matchedWords.length;
        if (matchedCount > 0) {
            score += (matchedCount / queryWords.length) * 40;
        }
    }
    
    // Word order bonus (if words appear in same order)
    if (matchedWords.length === queryWords.length && queryWords.length > 1) {
        let orderMatch = true;
        let lastIndex = -1;
        for (const word of queryWords) {
            const index = textWords.findIndex(w => w.includes(word) || word.includes(w));
            if (index <= lastIndex) {
                orderMatch = false;
                break;
            }
            lastIndex = index;
        }
        if (orderMatch) {
            score += 10;
        }
    }
    
    return { matched: score > 0, score, matchedWords };
}

/**
 * Extract searchable text from an item
 */
function extractSearchableText(item: SearchableItem): string {
    const parts: string[] = [];
    
    if (item.title) parts.push(item.title);
    if (item.subtitle) parts.push(item.subtitle);
    if (item.location) parts.push(item.location);
    if (item.description) parts.push(item.description);
    if (item.category) parts.push(item.category);
    if (item.type) parts.push(item.type);
    if (item.keywords) parts.push(...item.keywords);
    
    // Handle highlights (can be string or array)
    if (item.highlights) {
        if (Array.isArray(item.highlights)) {
            parts.push(...item.highlights);
        } else {
            parts.push(item.highlights);
        }
    }
    
    return parts.join(' ');
}

/**
 * Calculate search score based on match quality with keyword optimization
 * Higher score = better match
 */
function calculateScore(
    item: SearchableItem,
    query: string,
    normalizedQuery: string,
    expandedQueries: string[]
): { score: number; matchedFields: string[]; matchedKeywords: string[] } {
    let totalScore = 0;
    const matchedFields: string[] = [];
    const matchedKeywords: string[] = [];
    
    const normalizedTitle = normalizeText(item.title || '');
    const normalizedSubtitle = normalizeText(item.subtitle || '');
    const normalizedLocation = normalizeText(item.location || '');
    const normalizedDescription = normalizeText(item.description || '');
    const normalizedCategory = normalizeText(item.category || '');
    const normalizedType = normalizeText(item.type || '');
    
    // Check all expanded queries
    for (const expandedQuery of expandedQueries) {
        const normalizedExpanded = normalizeText(expandedQuery);
        
        // Title matching (highest priority)
        const titleMatch = matchQuery(normalizedExpanded, normalizedTitle);
        if (titleMatch.matched) {
            const fieldScore = titleMatch.score * (normalizedExpanded === normalizedQuery ? 1.0 : 0.7);
            totalScore += fieldScore;
            if (!matchedFields.includes('title')) matchedFields.push('title');
            matchedKeywords.push(...titleMatch.matchedWords);
        }
        
        // Title starts with query (bonus)
        if (normalizedTitle.startsWith(normalizedExpanded)) {
            totalScore += 30;
        }
        
        // Exact title match (highest bonus)
        if (normalizedTitle === normalizedExpanded) {
            totalScore += 50;
        }
        
        // Subtitle matching
        const subtitleMatch = matchQuery(normalizedExpanded, normalizedSubtitle);
        if (subtitleMatch.matched) {
            const fieldScore = subtitleMatch.score * 0.6 * (normalizedExpanded === normalizedQuery ? 1.0 : 0.7);
            totalScore += fieldScore;
            if (!matchedFields.includes('subtitle')) matchedFields.push('subtitle');
            matchedKeywords.push(...subtitleMatch.matchedWords);
        }
        
        // Location matching (high priority for travel)
        const locationMatch = matchQuery(normalizedExpanded, normalizedLocation);
        if (locationMatch.matched) {
            const fieldScore = locationMatch.score * 0.8 * (normalizedExpanded === normalizedQuery ? 1.0 : 0.7);
            totalScore += fieldScore;
            if (!matchedFields.includes('location')) matchedFields.push('location');
            matchedKeywords.push(...locationMatch.matchedWords);
        }
        
        // Category/Type matching
        const categoryMatch = matchQuery(normalizedExpanded, normalizedCategory + ' ' + normalizedType);
        if (categoryMatch.matched) {
            const fieldScore = categoryMatch.score * 0.5 * (normalizedExpanded === normalizedQuery ? 1.0 : 0.7);
            totalScore += fieldScore;
            if (!matchedFields.includes('category')) matchedFields.push('category');
            matchedKeywords.push(...categoryMatch.matchedWords);
        }
        
        // Description matching
        const descMatch = matchQuery(normalizedExpanded, normalizedDescription);
        if (descMatch.matched) {
            const fieldScore = descMatch.score * 0.3 * (normalizedExpanded === normalizedQuery ? 1.0 : 0.7);
            totalScore += fieldScore;
            if (!matchedFields.includes('description')) matchedFields.push('description');
            matchedKeywords.push(...descMatch.matchedWords);
        }
        
        // Highlights matching
        if (item.highlights) {
            const highlightsText = Array.isArray(item.highlights)
                ? item.highlights.join(' ')
                : item.highlights;
            const normalizedHighlights = normalizeText(highlightsText);
            const highlightsMatch = matchQuery(normalizedExpanded, normalizedHighlights);
            if (highlightsMatch.matched) {
                const fieldScore = highlightsMatch.score * 0.4 * (normalizedExpanded === normalizedQuery ? 1.0 : 0.7);
                totalScore += fieldScore;
                if (!matchedFields.includes('highlights')) matchedFields.push('highlights');
                matchedKeywords.push(...highlightsMatch.matchedWords);
            }
        }
        
        // Keywords field matching (if exists)
        if (item.keywords && Array.isArray(item.keywords)) {
            const keywordsText = item.keywords.join(' ');
            const normalizedKeywords = normalizeText(keywordsText);
            const keywordsMatch = matchQuery(normalizedExpanded, normalizedKeywords);
            if (keywordsMatch.matched) {
                const fieldScore = keywordsMatch.score * 0.9 * (normalizedExpanded === normalizedQuery ? 1.0 : 0.7);
                totalScore += fieldScore;
                if (!matchedFields.includes('keywords')) matchedFields.push('keywords');
                matchedKeywords.push(...keywordsMatch.matchedWords);
            }
        }
    }
    
    // Remove duplicate keywords
    const uniqueKeywords = [...new Set(matchedKeywords)];
    
    return { score: totalScore, matchedFields, matchedKeywords: uniqueKeywords };
}

/**
 * Main search function with keyword optimization
 * Searches through destinations, packages, and pages with optimized scoring
 */
export function searchItems(
    query: string,
    destinations: SearchableItem[],
    packages: SearchableItem[],
    pages: SearchableItem[] = []
): SearchResult[] {
    if (!query || !query.trim()) {
        return [];
    }
    
    const normalizedQuery = normalizeText(query.trim());
    const expandedQueries = expandQuery(normalizedQuery);
    const results: SearchResult[] = [];
    
    // Search destinations
    for (const destination of destinations) {
        const { score, matchedFields, matchedKeywords } = calculateScore(
            destination,
            query,
            normalizedQuery,
            expandedQueries
        );
        if (score > 0) {
            results.push({
                item: destination,
                score,
                matchedFields,
                matchedKeywords,
                type: 'destination',
            });
        }
    }
    
    // Search packages
    for (const pkg of packages) {
        const { score, matchedFields, matchedKeywords } = calculateScore(
            pkg,
            query,
            normalizedQuery,
            expandedQueries
        );
        if (score > 0) {
            results.push({
                item: pkg,
                score,
                matchedFields,
                matchedKeywords,
                type: 'package',
            });
        }
    }
    
    // Search pages
    for (const page of pages) {
        const { score, matchedFields, matchedKeywords } = calculateScore(
            page,
            query,
            normalizedQuery,
            expandedQueries
        );
        if (score > 0) {
            results.push({
                item: page,
                score,
                matchedFields,
                matchedKeywords,
                type: 'page',
            });
        }
    }
    
    // Sort by score (highest first), then by title
    results.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return (a.item.title || '').localeCompare(b.item.title || '');
    });
    
    return results;
}

/**
 * Quick search - returns only top N results
 */
export function quickSearch(
    query: string,
    destinations: SearchableItem[],
    packages: SearchableItem[],
    pages: SearchableItem[] = [],
    limit: number = 10
): SearchResult[] {
    return searchItems(query, destinations, packages, pages).slice(0, limit);
}
