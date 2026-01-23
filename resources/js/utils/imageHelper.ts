/**
 * Helper function to get image URL from sections or R2
 * Priority: sections > R2 URL > fallback local path
 */
export function getImageUrl(
    sections: Record<string, { content?: string; image?: string }> | undefined,
    sectionKey: string,
    fallbackPath: string
): string {
    // First, try to get from sections (database) - this is the highest priority
    const sectionImage = sections?.[sectionKey]?.image;
    if (sectionImage && typeof sectionImage === 'string' && sectionImage.trim()) {
        // If it's already a full URL, return as is
        if (sectionImage.startsWith('http://') || sectionImage.startsWith('https://')) {
            return sectionImage;
        }
        // If it's a relative path, it should already be processed by backend
        return sectionImage;
    }

    // If fallback path is already a full URL (starts with http), return as is
    if (fallbackPath.startsWith('http://') || fallbackPath.startsWith('https://')) {
        return fallbackPath;
    }

    // Try to construct R2 URL from fallback path
    // If path is like '/arabsaudi.jpg', convert to R2 URL: https://assets.cahayaanbiya.com/public/images/arabsaudi.jpg
    const cleanPath = fallbackPath.startsWith('/') ? fallbackPath.slice(1) : fallbackPath;
    
    // Check if it's already in images/ or videos/ folder
    if (cleanPath.startsWith('images/') || cleanPath.startsWith('videos/')) {
        // Use R2 custom domain
        // R2 custom domain points to bucket root, files are at bucket/public/images/file.jpg
        // So URL should be: baseUrl/public/images/file.jpg
        const r2BaseUrl = 'https://assets.cahayaanbiya.com';
        const r2Url = `${r2BaseUrl}/public/${cleanPath}`;
        return r2Url;
    }

    // Assume it's an image in the public root, try images folder
    // R2 custom domain points to bucket root, files are at bucket/public/images/file.jpg
    // So URL should be: baseUrl/public/images/file.jpg
    const r2BaseUrl = 'https://assets.cahayaanbiya.com';
    const r2Path = `public/images/${cleanPath}`;
    const r2Url = `${r2BaseUrl}/${r2Path}`;
    
    // Return R2 URL - browser will handle 404 and trigger onError handler if file doesn't exist
    return r2Url;
}

/**
 * Get R2 URL for a given path
 */
export function getR2Url(path: string): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const r2BaseUrl = 'https://assets.cahayaanbiya.com';
    
    // R2 custom domain points to bucket root, files are at bucket/public/images/file.jpg
    // So URL should be: baseUrl/public/images/file.jpg
    if (cleanPath.startsWith('images/') || cleanPath.startsWith('videos/')) {
        return `${r2BaseUrl}/public/${cleanPath}`;
    }
    
    return `${r2BaseUrl}/public/images/${cleanPath}`;
}

/**
 * Get R2 URL for video files
 * Videos are typically stored in the videos/ folder or public root
 */
export function getVideoUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const r2BaseUrl = 'https://assets.cahayaanbiya.com';
    
    // If path already includes videos/ folder
    if (cleanPath.startsWith('videos/')) {
        return `${r2BaseUrl}/public/${cleanPath}`;
    }
    
    // Check if it's a video file (mp4, webm, etc.)
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const isVideoFile = videoExtensions.some(ext => cleanPath.toLowerCase().endsWith(ext));
    
    if (isVideoFile) {
        // Try videos folder first
        return `${r2BaseUrl}/public/videos/${cleanPath}`;
    }
    
    // Fallback: try public root
    return `${r2BaseUrl}/public/${cleanPath}`;
}
