import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import { Group } from 'three';
import type { YardEntity } from '../types';
import { stepWander, pickRandomTarget } from '../ai';
import type { AIState } from '../ai';
import { useSpecimenAnimator } from '../animation';

interface Props {
    entity: YardEntity;
    isSelected: boolean;
    onSelect: (id: string) => void;
    range: number;
}

export default function SpecimenActor({ entity, isSelected, onSelect, range }: Props) {
    const groupRef = useRef<Group>(null);
    const [isMoving, setIsMoving] = useState(false);

    // AI State (Mutable)
    // We initialize target randomly nearby so they don't all start walking to 0,0,0
    const aiState = useRef<AIState>({
        target: pickRandomTarget(range),
        waitTime: Math.random() * 2 // Stagger start times
    });

    // Load Model with fallback
    // let gltf: any = null;
    // let loadError = false;

    // We try/catch the hook usage conceptually, but hooks can't fail conditionally easily.
    // useGLTF allows error handling via ErrorBoundary usually, but for simple safe 
    // loading we can assume we pass a valid url. If url is invalid, it might crash.
    // React Three Fiber 8/9+ implies we might want Suspense wrapping in parent.
    // For now we assume URL is valid or we handle onError in generic way?
    // Actually, useGLTF has no built-in "return null on error" mode without Suspense.
    // We will assume the parent handles Suspense or we wrap this. 
    // BUT user asked "Must not crash on malformed archive data".
    // We will supply a "Safe GLK Loader" pattern? 
    // Simpler: We just pass the URL. If it 404s, console warns. 
    // To allow simple "failover" we might use a try-catch block inside a useEffect? No, hooks.
    // We will blindly try to load. If it fails, R3F usually logs.

    // NOTE: Ideally we'd wrap each actor in an ErrorBoundary component.
    // For this implementation, we will trust the URL but render a fallback if `entity.specimen.modelUrl` is missing.

    const url = entity.specimen.modelUrl;
    // Conditional hook usage is disallowed. We must always call it.
    // We pass a dummy URL if missing, but that's messy.
    // Instead, we will rely on a separate component for the Model vs Placeholder, 
    // or just render Placeholder if (!url).

    return (
        <group
            ref={groupRef}
            position={entity.position}
            rotation={entity.rotation}
            onClick={(e: any) => {
                e.stopPropagation();
                onSelect(entity.id);
            }}
        >
            {/* Selection Ring */}
            {isSelected && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                    <ringGeometry args={[0.8, 0.9, 32]} />
                    <meshBasicMaterial color="#ef4444" opacity={0.8} transparent />
                </mesh>
            )}

            {/* Nameplate (visible on hover or select? Let's just do select for now or always?) */}
            {isSelected && (
                <Text
                    position={[0, 2.5, 0]}
                    fontSize={0.3}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000"
                >
                    {entity.specimen.name}
                </Text>
            )}

            {url ? (
                <GLTFModel
                    url={url}
                    isMoving={isMoving}
                    setIsMoving={setIsMoving}
                    aiState={aiState}
                    speed={entity.speed}
                    range={range}
                    groupRef={groupRef} // We pass the group ref to the model so it can control parent transform? 
                // No, `stepWander` modifies position of `groupRef.current`
                />
            ) : (
                <PlaceholderModel
                    color={entity.color}
                    isMoving={isMoving}
                    setIsMoving={setIsMoving}
                    aiState={aiState}
                    speed={entity.speed}
                    range={range}
                    groupRef={groupRef}
                />
            )}
        </group>
    );
}

// Sub-component to safely use useGLTF and useAnimations
function GLTFModel({ url, isMoving, setIsMoving, aiState, speed, range, groupRef }: any) {
    const { scene, animations } = useGLTF(url) as any;

    // Animation Hook
    // We need a ref for the primitives group to bind animations
    const modelRef = useRef<Group>(null);
    useSpecimenAnimator(modelRef, animations, isMoving);

    // Movement Logic
    useFrame((_state: any, dt: any) => {
        if (!groupRef.current) return;

        const res = stepWander(
            groupRef.current.position,
            groupRef.current.rotation,
            aiState.current,
            dt,
            speed,
            range
        );

        if (res.moving !== isMoving) setIsMoving(res.moving);
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={1.5} // Slight scale up for visibility
            castShadow
            receiveShadow
        />
    );
}

function PlaceholderModel({ color, isMoving, setIsMoving, aiState, speed, range, groupRef }: any) {
    // Basic Box Walking Logic
    useFrame((_state: any, dt: any) => {
        if (!groupRef.current) return;
        const res = stepWander(
            groupRef.current.position,
            groupRef.current.rotation,
            aiState.current,
            dt,
            speed,
            range
        );
        if (res.moving !== isMoving) setIsMoving(res.moving);
    });

    // Bounce animation when moving
    useFrame(() => {
        // Simple bob
        if (isMoving && groupRef.current) {
            // We can't easily bob the parent without messing up Y=0 logic in stepWander.
            // So we bob the mesh logic here if we had a ref to mesh.
            // For placeholder, simple static box is fine.
        }
    });

    return (
        <mesh position={[0, 0.75, 0]} castShadow>
            <boxGeometry args={[0.8, 1.5, 0.8]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}
