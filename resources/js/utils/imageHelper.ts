/**
 * Helper function to get image URL from sections or R2
 * Priority: sections > R2 URL > fallback local path
 */
export function getImageUrl(
    sections: Record<string, { content?: string; image?: string }> | undefined,
    sectionKey: string,
    fallbackPath: string
): string {
    // First, try to get from sections (database)
    const sectionImage = sections?.[sectionKey]?.image;
    if (sectionImage && typeof sectionImage === 'string' && sectionImage.trim()) {
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
        // Use R2 custom domain (should match AWS_URL in .env)
        const r2BaseUrl = 'https://assets.cahayaanbiya.com';
        return `${r2BaseUrl}/public/${cleanPath}`;
    }

    // Assume it's an image in the public root, try images folder
    const r2BaseUrl = 'https://assets.cahayaanbiya.com';
    const r2Path = `public/images/${cleanPath}`;
    return `${r2BaseUrl}/${r2Path}`;
}

/**
 * Get R2 URL for a given path
 */
export function getR2Url(path: string): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const r2BaseUrl = 'https://assets.cahayaanbiya.com';
    
    if (cleanPath.startsWith('images/') || cleanPath.startsWith('videos/')) {
        return `${r2BaseUrl}/public/${cleanPath}`;
    }
    
    return `${r2BaseUrl}/public/images/${cleanPath}`;
}
