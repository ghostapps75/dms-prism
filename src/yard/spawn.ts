import type { YardEntity, SpecimenArchiveItem } from './types';

interface SpawnOptions {
    range: number;
}

export function spawnEntities(specimens: SpecimenArchiveItem[], options: SpawnOptions): YardEntity[] {
    const { range } = options;

    return specimens.map((specimen, _idx) => {
        // Deterministic-ish scatter based on index to avoid total random chaos on reloads
        // But Math.random() is fine for "Yard" feel. 
        // Let's use simple random for variety.

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * range;

        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;

        return {
            id: specimen.id,
            specimen,
            position: [x, 0, z],
            rotation: [0, Math.random() * Math.PI * 2, 0],
            speed: 1.5 + Math.random() * 2.5, // Random speed 1.5 - 4.0
            color: getRandomPastelColor()
        };
    });
}

function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
}
