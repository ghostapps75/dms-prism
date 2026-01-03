import { useRef } from 'react';
import { Mesh } from 'three';

interface Props {
    size?: number;
    onGroundClick: () => void;
}

export default function Ground({ size = 100, onGroundClick }: Props) {
    const meshRef = useRef<Mesh>(null);

    return (
        <group>
            {/* Invisi-plane for clicks and shadows */}
            <mesh
                ref={meshRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.01, 0]}
                receiveShadow
                onClick={(e: any) => {
                    e.stopPropagation();
                    onGroundClick();
                }}
            >
                <planeGeometry args={[size, size]} />
                <shadowMaterial opacity={0.3} color="#000000" />
            </mesh>

            {/* Visual Grid */}
            <gridHelper args={[size, size / 2, 0x444444, 0x222222]} />
        </group>
    );
}
