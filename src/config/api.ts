export const API_BASE = import.meta.env.VITE_API_BASE || '';

export function apiUrl(path: string) {
    // If path doesn't start with /, add it
    const safePath = path.startsWith('/') ? path : `/${path}`;
    // If API_BASE is empty (dev proxy), just return path
    if (!API_BASE) return safePath;

    // Remove trailing slash from base if present
    const safeBase = API_BASE.replace(/\/$/, '');
    return `${safeBase}${safePath}`;
}
