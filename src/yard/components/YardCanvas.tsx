import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import type { YardEntity } from '../types';
import Ground from './Ground';
import SpecimenActor from './SpecimenActor';
import CameraRig from './CameraRig';
import { Environment } from '@react-three/drei';

interface Props {
    entities: YardEntity[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    followEnabled: boolean;
}

export default function YardCanvas({ entities, selectedId, onSelect, followEnabled }: Props) {
    // We handle selection clearing here if ground is clicked
    const handleGroundClick = () => onSelect(null);

    return (
        <Canvas shadows camera={{ position: [0, 10, 20], fov: 50 }}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1}
                castShadow
                shadow-mapSize={[2048, 2048]}
            >
                <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50]} />
            </directionalLight>

            <fog attach="fog" args={['#1e293b', 10, 50]} />
            <color attach="background" args={['#1e293b']} />

            {/* Environment for nice reflections on shiny materials */}
            <Environment preset="night" />

            <group>
                <Ground size={100} onGroundClick={handleGroundClick} />

                <Suspense fallback={null}>
                    {entities.map(entity => (
                        <group key={entity.id} name={entity.id}>
                            <SpecimenActor
                                entity={entity}
                                isSelected={selectedId === entity.id}
                                onSelect={onSelect}
                                range={40} // Wander range matches ground roughly
                            />
                        </group>
                    ))}
                </Suspense>
            </group>

            <CameraRig
                followEnabled={followEnabled}
                selectedId={selectedId}
                entities={entities}
            />
        </Canvas>
    );
}
