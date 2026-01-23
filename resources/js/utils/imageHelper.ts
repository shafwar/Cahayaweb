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
        
        // R2 custom domain points to bucket root, files are at bucket/public/images/file.jpg
        // So URL should be: baseUrl/public/images/file.jpg
        
        // Check if path already includes folder structure
        if (cleanPath.startsWith('images/') || cleanPath.startsWith('videos/')) {
            return `${r2BaseUrl}/public/${cleanPath}`;
        }
        
        // Check file extension to determine folder
        const lowerPath = cleanPath.toLowerCase();
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        const isVideo = videoExtensions.some(ext => lowerPath.endsWith(ext));
        
        if (isVideo) {
            // Video file - try videos folder
            return `${r2BaseUrl}/public/videos/${cleanPath}`;
        }
        
        // Image file - use images folder
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
            return `${r2BaseUrl}/public/${cleanPath}`;
        }
        
        // Check if it's a video file (mp4, webm, etc.)
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        const isVideoFile = videoExtensions.some(ext => cleanPath.toLowerCase().endsWith(ext));
        
        if (isVideoFile) {
            // Video file - use videos folder
            return `${r2BaseUrl}/public/videos/${cleanPath}`;
        }
        
        // Not a recognized video extension, but assume it's a video
        // Try videos folder first, then public root
        return `${r2BaseUrl}/public/videos/${cleanPath}`;
    } catch (error) {
        console.error('Error in getVideoUrl:', error);
        // Even on error, try to return R2 URL structure
        const cleanPath = (path || '').startsWith('/') ? (path || '').slice(1) : (path || '');
        return `https://assets.cahayaanbiya.com/public/videos/${cleanPath}`;
    }
}
