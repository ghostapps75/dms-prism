export const API_BASE = import.meta.env.VITE_API_BASE || '';

// Strictly validate API_BASE to prevent leaking secrets/placeholders
if (
    API_BASE.includes('Bearer') ||
    API_BASE.includes('\n') ||
    API_BASE.length > 200
) {
    console.error(
        'CRITICAL: VITE_API_BASE appears to contain invalid characters or secrets. Clearing it.'
    );
    throw new Error(
        'Security Alert: VITE_API_BASE is malformed. Check Netlify Environment Variables.'
    );
}

export function apiUrl(path: string) {
    const safePath = path.startsWith('/') ? path : `/${path}`;

    // Allow dev proxy or relative paths
    if (!API_BASE) return safePath;

    const safeBase = API_BASE.replace(/\/$/, '');
    return `${safeBase}${safePath}`;
}
