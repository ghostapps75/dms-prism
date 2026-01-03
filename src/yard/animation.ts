import { useEffect, useRef } from 'react';
import { useAnimations } from '@react-three/drei';
import { AnimationState } from './types';
import { Group, AnimationClip } from 'three';

export function useSpecimenAnimator(
    group: React.MutableRefObject<Group | null>,
    animations: AnimationClip[],
    moving: boolean
) {
    const { actions, names } = useAnimations(animations, group);
    const currentAction = useRef<string | null>(null);

    // Heuristics to find clips
    const findClip = (terms: string[]) => {
        return names.find((name: string) => terms.some(term => name.toLowerCase().includes(term)));
    };

    useEffect(() => {
        if (!names.length) return;

        // Determine target state
        const targetState = moving ? AnimationState.WALK : AnimationState.IDLE;

        // Find best matching clip
        let clipName: string | undefined;

        if (targetState === AnimationState.WALK) {
            clipName = findClip(['walk', 'run', 'move', 'charge', 'fly']);
        } else {
            clipName = findClip(['idle', 'stand', 'wait', 'breathing']);
        }

        // Fallback: if no walk clip, use idle. If no idle, use 0th.
        if (!clipName && names.length > 0) {
            clipName = names[0];
        }

        if (clipName && clipName !== currentAction.current) {
            // Fade out old
            if (currentAction.current && actions[currentAction.current]) {
                actions[currentAction.current]?.fadeOut(0.5);
            }

            // Fade in new
            const action = actions[clipName];
            if (action) {
                action.reset().fadeIn(0.5).play();
                currentAction.current = clipName;
            }
        }
    }, [moving, names, actions]);

    return { names };
}
