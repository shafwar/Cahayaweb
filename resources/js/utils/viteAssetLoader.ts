/**
 * Safe Vite asset loader with retry and fallback logic
 * Prevents white screen if assets fail to load
 */

interface AssetLoadOptions {
    maxRetries?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
}

/**
 * Load a script with retry logic
 */
export function loadScript(src: string, options: AssetLoadOptions = {}): Promise<void> {
    const { maxRetries = 3, retryDelay = 1000, onError } = options;

    return new Promise((resolve, reject) => {
        let attempts = 0;

        const tryLoad = () => {
            attempts++;
            const script = document.createElement('script');
            script.type = 'module';
            script.src = src;
            script.crossOrigin = 'anonymous';

            script.onload = () => {
                console.log(`[Vite Asset] Successfully loaded: ${src}`);
                resolve();
            };

            script.onerror = (error) => {
                console.error(`[Vite Asset] Failed to load (attempt ${attempts}/${maxRetries}): ${src}`, error);
                
                if (attempts < maxRetries) {
                    console.log(`[Vite Asset] Retrying in ${retryDelay}ms...`);
                    setTimeout(tryLoad, retryDelay);
                } else {
                    const loadError = new Error(`Failed to load script after ${maxRetries} attempts: ${src}`);
                    if (onError) {
                        onError(loadError);
                    }
                    reject(loadError);
                }
            };

            document.head.appendChild(script);
        };

        tryLoad();
    });
}

/**
 * Load a stylesheet with retry logic
 */
export function loadStylesheet(href: string, options: AssetLoadOptions = {}): Promise<void> {
    const { maxRetries = 3, retryDelay = 1000, onError } = options;

    return new Promise((resolve, reject) => {
        let attempts = 0;

        const tryLoad = () => {
            attempts++;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.crossOrigin = 'anonymous';

            link.onload = () => {
                console.log(`[Vite Asset] Successfully loaded stylesheet: ${href}`);
                resolve();
            };

            link.onerror = (error) => {
                console.error(`[Vite Asset] Failed to load stylesheet (attempt ${attempts}/${maxRetries}): ${href}`, error);
                
                if (attempts < maxRetries) {
                    console.log(`[Vite Asset] Retrying stylesheet in ${retryDelay}ms...`);
                    setTimeout(tryLoad, retryDelay);
                } else {
                    const loadError = new Error(`Failed to load stylesheet after ${maxRetries} attempts: ${href}`);
                    if (onError) {
                        onError(loadError);
                    }
                    // Stylesheets are not critical - resolve anyway
                    resolve();
                }
            };

            document.head.appendChild(link);
        };

        tryLoad();
    });
}

/**
 * Monitor Vite asset loading and show fallback if critical assets fail
 */
export function monitorViteAssets(): void {
    if (typeof window === 'undefined') return;

    const criticalAssets: string[] = [];
    const failedAssets: string[] = [];
    let checkTimeout: ReturnType<typeof setTimeout> | null = null;

    // Monitor script loading errors
    const originalAppendChild = document.head.appendChild.bind(document.head);
    document.head.appendChild = function <T extends Node>(node: T): T {
        if (node instanceof HTMLScriptElement && node.src) {
            const src = node.src;
            if (src.includes('/build/assets/')) {
                criticalAssets.push(src);
                
                const originalOnError = node.onerror;
                node.onerror = function (error) {
                    failedAssets.push(src);
                    console.error(`[Vite Asset Monitor] Script failed to load: ${src}`, error);
                    
                    if (originalOnError) {
                        originalOnError.call(this, error);
                    }

                    // Check if all critical assets failed
                    if (checkTimeout) clearTimeout(checkTimeout);
                    checkTimeout = setTimeout(() => {
                        checkCriticalAssets();
                    }, 2000);
                };
            }
        }
        return originalAppendChild(node);
    };

    function checkCriticalAssets() {
        if (failedAssets.length === 0) return;
        
        const failedCritical = criticalAssets.filter(asset => failedAssets.includes(asset));
        const failureRate = failedCritical.length / criticalAssets.length;

        // If more than 50% of critical assets failed, show fallback
        if (failureRate > 0.5) {
            console.error('[Vite Asset Monitor] Critical assets failed to load. Showing fallback UI.');
            showAssetErrorFallback();
        }
    }

    function showAssetErrorFallback() {
        const existingFallback = document.getElementById('asset-error-fallback');
        if (existingFallback) return;

        const fallback = document.createElement('div');
        fallback.id = 'asset-error-fallback';
        fallback.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        fallback.innerHTML = `
            <div style="text-align: center; max-width: 600px;">
                <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #111827;">
                    Loading Application Assets
                </h1>
                <p style="color: #6b7280; margin-bottom: 1.5rem;">
                    Some assets failed to load. Please wait while we retry...
                </p>
                <div style="margin-bottom: 1.5rem;">
                    <button 
                        onclick="window.location.reload()" 
                        style="
                            padding: 0.75rem 1.5rem; 
                            background-color: #3b82f6; 
                            color: white; 
                            border: none; 
                            border-radius: 0.375rem; 
                            cursor: pointer; 
                            font-size: 1rem; 
                            font-weight: 500;
                        "
                    >
                        Reload Page
                    </button>
                </div>
                <p style="font-size: 0.875rem; color: #9ca3af;">
                    If this problem persists, please contact support.
                </p>
            </div>
        `;
        
        document.body.appendChild(fallback);
    }
}
