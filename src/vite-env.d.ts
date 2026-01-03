/// <reference types="vite/client" />

import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                alt?: string;
                poster?: string;
                loading?: 'auto' | 'lazy' | 'eager';
                reveal?: 'auto' | 'interaction' | 'manual';
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                'shadow-intensity'?: string;
                'touch-action'?: string;
                style?: React.CSSProperties;
            };
        }
    }
}
