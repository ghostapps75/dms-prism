import type { SpecimenArchiveItem } from './types';

export const SEED_SPECIMENS: SpecimenArchiveItem[] = [
    {
        id: 'seed-1',
        name: 'Abyssal Walker',
        type: 'Construct',
        description: 'A heavy, automated scout unit retrieved from the lower depths.',
        imageUrl: '', // Not used in Yard
        thumbnailUrl: '/generated/thumbs/13231f4bf32bcbae730d5ec2.png',
        modelUrl: '/generated/models/3942f3b08d4859fd3ebb8a15.glb',
        dateCreated: new Date().toISOString()
    },
    {
        id: 'seed-2',
        name: 'Crimson Stalker',
        type: 'Beast',
        description: 'Fast, agile, and constantly hunting for signal patterns.',
        imageUrl: '',
        thumbnailUrl: '/generated/thumbs/56a7e5c5c1cb751fff97bf8d.png',
        modelUrl: '/generated/models/4d78402f8f035d733dba2e62.glb',
        dateCreated: new Date().toISOString()
    },
    {
        id: 'seed-3',
        name: 'Echo Drone',
        type: 'Machine',
        description: 'Resonates with local frequencies. Harmless but annoying.',
        imageUrl: '',
        thumbnailUrl: '/generated/thumbs/b66b9cccfbcb961160173cd4.png',
        modelUrl: '/generated/models/4fb9e2f87a582415431c203f.glb',
        dateCreated: new Date().toISOString()
    },
    {
        id: 'seed-4',
        name: 'Void Glider',
        type: 'Alien',
        description: 'Drifts silently through the yard, observing.',
        imageUrl: '',
        thumbnailUrl: '/generated/thumbs/ba3829a193917e460014f6f3.png',
        modelUrl: '/generated/models/5b92c9d4cff1cb2f6ed66de7.glb',
        dateCreated: new Date().toISOString()
    },
    {
        id: 'seed-5',
        name: 'Scrap Titan',
        type: 'Construct',
        description: 'Built from the remains of failed experiments.',
        imageUrl: '',
        thumbnailUrl: '', // Fallback to placeholder color
        modelUrl: '/generated/models/866fb6a243f920fdbd6f4a4b.glb',
        dateCreated: new Date().toISOString()
    }
];
