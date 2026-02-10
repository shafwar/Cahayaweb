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
            // CRITICAL FIX: Check if URL uses wrong domain (cahayaanbiya.com instead of assets.cahayaanbiya.com)
            if (sectionImage.startsWith('http://') || sectionImage.startsWith('https://')) {
                // If URL uses wrong domain, convert to R2 URL
                if (sectionImage.includes('cahayaanbiya.com') && !sectionImage.includes('assets.cahayaanbiya.com')) {
                    // Extract path from wrong URL and convert to R2 URL
                    try {
                        const url = new URL(sectionImage);
                        const path = url.pathname; // e.g., "/public/images/destinations/cahayaanbiya/05282.jpeg"
                        // Remove leading slash and convert to R2 URL
                        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
                        return getR2Url(cleanPath);
                    } catch {
                        // If URL parsing fails, try to extract path manually
                        const pathMatch = sectionImage.match(/\/public\/images\/(.+)$/);
                        if (pathMatch) {
                            return getR2Url(`images/${pathMatch[1]}`);
                        }
                        // Fallback: try to extract filename
                        const filenameMatch = sectionImage.match(/\/([^\/]+\.(jpeg|jpg|png|webp))$/i);
                        if (filenameMatch) {
                            return getR2Url(`images/${filenameMatch[1]}`);
                        }
                    }
                }
                // If URL is already correct R2 URL, return as is
                if (sectionImage.includes('assets.cahayaanbiya.com')) {
                    return sectionImage;
                }
                // For other URLs, return as is (might be external URLs)
                return sectionImage;
            }
            // If it's a relative path, convert to R2 URL
            if (!sectionImage.startsWith('http')) {
                // Backend returned relative path - convert to R2 URL
                return getR2Url(sectionImage);
            }
            return sectionImage;
        }

        // If fallback path is already a full URL (starts with http), check domain
        if (fallbackPath.startsWith('http://') || fallbackPath.startsWith('https://')) {
            // Check if URL uses wrong domain
            if (fallbackPath.includes('cahayaanbiya.com') && !fallbackPath.includes('assets.cahayaanbiya.com')) {
                // Convert wrong URL to R2 URL
                try {
                    const url = new URL(fallbackPath);
                    const path = url.pathname;
                    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
                    return getR2Url(cleanPath);
                } catch {
                    // Fallback: extract path manually
                    const pathMatch = fallbackPath.match(/\/public\/images\/(.+)$/);
                    if (pathMatch) {
                        return getR2Url(`images/${pathMatch[1]}`);
                    }
                }
            }
            // If already correct R2 URL, return as is
            if (fallbackPath.includes('assets.cahayaanbiya.com')) {
                return fallbackPath;
            }
            // For other URLs, return as is
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
 * Automatically encodes special characters (spaces, etc.) in filename for proper URL handling
 */
export function getR2Url(path: string): string {
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
        
        // Split path into directory and filename for proper encoding
        const lastSlashIndex = cleanPath.lastIndexOf('/');
        let directory = '';
        let filename = cleanPath;
        
        if (lastSlashIndex !== -1) {
            directory = cleanPath.substring(0, lastSlashIndex + 1);
            filename = cleanPath.substring(lastSlashIndex + 1);
        }
        
        // Encode filename to handle spaces and special characters (e.g., "Destination Cahaya 1.jpeg" -> "Destination%20Cahaya%201.jpeg")
        const encodedFilename = encodeURIComponent(filename);
        const encodedPath = directory + encodedFilename;
        
        // Try multiple path variations based on common R2 bucket structures:
        // 1. If path already includes folder structure (images/, videos/, packages/)
        if (cleanPath.startsWith('images/') || cleanPath.startsWith('videos/') || cleanPath.startsWith('packages/')) {
            // Use /public/ prefix (R2 bucket structure)
            return `${r2BaseUrl}/public/${encodedPath}`;
        }
        
        // 2. Check file extension to determine folder
        const lowerPath = cleanPath.toLowerCase();
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        const isVideo = videoExtensions.some(ext => lowerPath.endsWith(ext));
        
        if (isVideo) {
            // Video file - try videos folder with /public/ prefix
            return `${r2BaseUrl}/public/videos/${encodedPath}`;
        }
        
        // 3. Image file - use public path (packages/ for package images, else images/)
        // For images like "Destination Cahaya X.jpeg", they go to images/ folder
        if (cleanPath.startsWith('packages/')) {
            return `${r2BaseUrl}/public/${encodedPath}`;
        }
        // All other images (including "Destination Cahaya X.jpeg") go to images/ folder
        return `${r2BaseUrl}/public/images/${encodedPath}`;
    } catch (error) {
        console.error('Error in getR2Url:', error);
        // Even on error, try to return R2 URL structure with encoding
        try {
            const cleanPath = (path || '').startsWith('/') ? (path || '').slice(1) : (path || '');
            const encodedPath = encodeURIComponent(cleanPath);
            return `https://assets.cahayaanbiya.com/public/images/${encodedPath}`;
        } catch {
            return path || '';
        }
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
