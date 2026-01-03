import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import type { YardEntity } from '../types';

interface Props {
    followEnabled: boolean;
    selectedId: string | null;
    entities: YardEntity[];
}

export default function CameraRig({ followEnabled, selectedId }: Props) {
    const { controls } = useThree();
    const vec = useRef(new Vector3());

    useFrame((state: any, dt: any) => {
        // If follow is disabled, do nothing (OrbitControls handles it)
        if (!followEnabled || !selectedId) return;

        // Find selected entity (imperatively to avoid stale closures if we passed a live obj)
        // const targetEntity = entities.find(e => e.id === selectedId);

        // We can't easily get the *LIVE* position from the react state entity object, 
        // because the entity object position [x,y,z] is initial only and not updated by the ref system.
        // The Actor updates the THREE.Group directly.
        // HACK: We need to find the object in the scene graph.

        const sceneObject = state.scene.getObjectByName(selectedId);
        // We didn't set name on the group in SpecimenActor. Let's assume we can find it?
        // Actually, let's fix SpecimenActor to name the group `entity.id`.

        if (sceneObject) {
            const targetPos = sceneObject.position;

            // Smooth follow
            // Desired camera pos: some offset from target
            // We want to keep current camera rotation/height roughly but stick to target XZ

            // Allow OrbitControls to still rotate? 
            // If we manually set camera position, OrbitControls fights us.
            // Standard "Follow" with OrbitControls usually involves setting `controls.target` to the object
            // and letting the camera maintain offset.

            // Smooth lerp the controls target
            const currentTarget = (controls as any).target as Vector3;
            if (currentTarget) {
                vec.current.lerpVectors(currentTarget, targetPos, 3 * dt);
                (controls as any).target.copy(vec.current);
                // We typically also need to update camera position to maintain distance?
                // OrbitControls usually handles camera pos relative to target. 
                // We just update target.
            }
        }
    });

    return <OrbitControls makeDefault minDistance={2} maxDistance={50} maxPolarAngle={Math.PI / 2 - 0.05} />;
}
