export const AnimationState = {
    IDLE: 'IDLE',
    WALK: 'WALK',
    RUN: 'RUN'
} as const;

export type AnimationState = typeof AnimationState[keyof typeof AnimationState];

export interface SpecimenArchiveItem {
    id: string;
    name: string;
    type: string;
    description: string;
    imageUrl: string;
    thumbnailUrl?: string; // We support the new cached field
    modelUrl?: string;     // The raw/remote or logic-handled URL (we expect logic to fix it)
    dateCreated: string;
}

// Runtime entity state (mutable via refs usually, but simplified for React props/config)
export interface YardEntity {
    id: string; // matches specimen id
    specimen: SpecimenArchiveItem;
    position: [number, number, number];
    rotation: [number, number, number];

    // Initial runtime config
    speed: number;
    color: string; // fallback color
}
