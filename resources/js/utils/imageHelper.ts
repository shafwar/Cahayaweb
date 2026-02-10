/**
 * Helper function to get image URL from sections or R2
 * Priority: sections > R2 URL > fallback local path
 * IMPORTANT: Always returns R2 URL first, falls back to local only on error
 */
export function getImageUrl(
    sections: Record<string, { content?: string; image?: string }> | undefined,
    sectionKey: string,
    fallbackPath: string
): string {
    try {
        // First, try to get from sections (database) - this is the highest priority
        const sectionImage = sections?.[sectionKey]?.image;
        if (sectionImage && typeof sectionImage === 'string' && sectionImage.trim()) {
            // If it's already a full URL, return as is
            if (sectionImage.startsWith('http://') || sectionImage.startsWith('https://')) {
                return sectionImage;
            }
            // If it's a relative path, check if it's already R2 URL from backend
            // Backend should return R2 URLs, but if not, convert it
            if (!sectionImage.startsWith('http')) {
                // Backend returned relative path - convert to R2 URL
                return getR2Url(sectionImage);
            }
            return sectionImage;
        }

        // If fallback path is already a full URL (starts with http), return as is
        if (fallbackPath.startsWith('http://') || fallbackPath.startsWith('https://')) {
            return fallbackPath;
        }

        // Always use R2 URL for fallback paths - NEVER return local path directly
        return getR2Url(fallbackPath);
    } catch (error) {
        console.error('Error in getImageUrl:', error);
        // On error, still try to return R2 URL, not local path
        try {
            return getR2Url(fallbackPath);
        } catch {
            // Last resort: return fallback path (but this should rarely happen)
            return fallbackPath;
        }
    }
}

/**
 * Get R2 URL for a given path
 * IMPORTANT: Always returns R2 URL, never local path
 * Tries multiple path variations to handle different R2 bucket structures
 * Properly handles URL encoding for spaces and special characters
 */
export function getR2Url(path: string): string {
    try {
        if (!path || typeof path !== 'string') {
            return path || '';
        }
        
        // If already a full URL, return as is (but ensure proper encoding)
        if (path.startsWith('http://') || path.startsWith('https://')) {
            // URL is already encoded by browser, return as is
            return path;
        }
        
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const r2BaseUrl = 'https://assets.cahayaanbiya.com';
        
        // Try multiple path variations based on common R2 bucket structures:
        // 1. If path already includes folder structure (images/, videos/, packages/)
        if (cleanPath.startsWith('images/') || cleanPath.startsWith('videos/') || cleanPath.startsWith('packages/')) {
            // Use /public/ prefix (R2 bucket structure)
            // Encode the path properly - browser will handle encoding spaces to %20
            const fullPath = `${r2BaseUrl}/public/${cleanPath}`;
            return fullPath;
        }
        
        // 2. Check file extension to determine folder
        const lowerPath = cleanPath.toLowerCase();
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        const isVideo = videoExtensions.some(ext => lowerPath.endsWith(ext));
        
        if (isVideo) {
            // Video file - try videos folder with /public/ prefix
            return `${r2BaseUrl}/public/videos/${cleanPath}`;
        }
        
        // 3. Image file - use public path (packages/ for package images, else images/)
        if (cleanPath.startsWith('packages/')) {
            return `${r2BaseUrl}/public/${cleanPath}`;
        }
        // For image files, use images/ folder
        // Note: Browser will automatically encode spaces in URL to %20
        return `${r2BaseUrl}/public/images/${cleanPath}`;
    } catch (error) {
        console.error('Error in getR2Url:', error);
        // Even on error, try to return R2 URL structure
        const cleanPath = (path || '').startsWith('/') ? (path || '').slice(1) : (path || '');
        return `https://assets.cahayaanbiya.com/public/images/${cleanPath}`;
    }
}

/**
 * Get R2 URL for video files
 * Videos are typically stored in the videos/ folder or public root
 * IMPORTANT: Always returns R2 URL, never local path
 * Tries multiple path variations to handle different R2 bucket structures
 */
export function getVideoUrl(path: string): string {
    try {
        if (!path || typeof path !== 'string') {
            return path || '';
        }
        
        // If already a full URL, return as is
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const r2BaseUrl = 'https://assets.cahayaanbiya.com';
        
        // If path already includes videos/ folder
        if (cleanPath.startsWith('videos/')) {
            // Try with /public/ prefix first (most common)
            return `${r2BaseUrl}/public/${cleanPath}`;
        }
        
        // Check if it's a video file (mp4, webm, etc.)
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        const isVideoFile = videoExtensions.some(ext => cleanPath.toLowerCase().endsWith(ext));
        
        if (isVideoFile) {
            // Video file - use videos folder with /public/ prefix
            return `${r2BaseUrl}/public/videos/${cleanPath}`;
        }
        
        // Not a recognized video extension, but assume it's a video
        // Try videos folder with /public/ prefix
        return `${r2BaseUrl}/public/videos/${cleanPath}`;
    } catch (error) {
        console.error('Error in getVideoUrl:', error);
        // Even on error, try to return R2 URL structure
        const cleanPath = (path || '').startsWith('/') ? (path || '').slice(1) : (path || '');
        return `https://assets.cahayaanbiya.com/public/videos/${cleanPath}`;
    }
}
