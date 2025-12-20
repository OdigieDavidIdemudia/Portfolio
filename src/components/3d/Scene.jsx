import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

function Globe() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.001;
        }

        // Mouse interaction parallax
        const { mouse } = state;
        if (meshRef.current) {
            meshRef.current.rotation.x = mouse.y * 0.05;
            meshRef.current.rotation.z = mouse.x * 0.05;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 6]}>
            {/* Main Wireframe Globe */}
            <Sphere ref={meshRef} args={[10, 64, 64]} scale={1.8}>
                <meshBasicMaterial
                    color="#00E5FF"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </Sphere>

            {/* Inner Globe Glow */}
            <Sphere args={[9.8, 64, 64]} scale={1.8}>
                <meshBasicMaterial
                    color="#0B0F14"
                />
            </Sphere>
        </group>
    );
}

export default function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Globe />
        </>
    );
}
