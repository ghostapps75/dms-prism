import type { SpecimenArchiveItem } from './types';

const STORAGE_KEY = 'dm_bestiary_collection';

export function getArchivedSpecimens(): SpecimenArchiveItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Basic validation filtering
        return parsed.filter((item: any) =>
            item &&
            typeof item === 'object' &&
            typeof item.id === 'string' &&
            // Must have a model to be worth showing in the yard, 
            // OR at least a name so we can render a fallback box.
            typeof item.name === 'string'
        );
    } catch (err) {
        console.error('Failed to load yard archive:', err);
        return [];
    }
}

export function seedArchive(seeds: SpecimenArchiveItem[]): void {
    try {
        const existing = getArchivedSpecimens();
        const existingIds = new Set(existing.map(e => e.id));

        // Only add seeds that don't already exist by ID
        const newItems = seeds.filter(s => !existingIds.has(s.id));

        if (newItems.length === 0) return;

        const merged = [...existing, ...newItems];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (err) {
        console.error('Failed to seed archive:', err);
    }
}
