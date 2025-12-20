import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT = 80;
const RADIUS = 15;
const CONNECTION_DISTANCE = 5;

export default function NetworkScene() {
    const groupRef = useRef();

    // Generate stable nodes
    const { positions, colors } = useMemo(() => {
        const tempPositions = new Float32Array(NODE_COUNT * 3);
        const tempColors = new Float32Array(NODE_COUNT * 3);
        const color = new THREE.Color("#00E5FF");

        for (let i = 0; i < NODE_COUNT; i++) {
            // Spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = RADIUS * (0.8 + Math.random() * 0.4); // Variation in radius

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            tempPositions[i * 3] = x;
            tempPositions[i * 3 + 1] = y;
            tempPositions[i * 3 + 2] = z;

            tempColors[i * 3] = color.r;
            tempColors[i * 3 + 1] = color.g;
            tempColors[i * 3 + 2] = color.b;
        }

        return { positions: tempPositions, colors: tempColors };
    }, []);

    // Generate connections
    const linePositions = useMemo(() => {
        const lines = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            const x1 = positions[i * 3];
            const y1 = positions[i * 3 + 1];
            const z1 = positions[i * 3 + 2];

            for (let j = i + 1; j < NODE_COUNT; j++) {
                const x2 = positions[j * 3];
                const y2 = positions[j * 3 + 1];
                const z2 = positions[j * 3 + 2];

                const dist = Math.sqrt(
                    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
                );

                if (dist < CONNECTION_DISTANCE) {
                    lines.push(x1, y1, z1);
                    lines.push(x2, y2, z2);
                }
            }
        }
        return new Float32Array(lines);
    }, [positions]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001; // Slow drift
            groupRef.current.rotation.x = state.mouse.y * 0.1;
            groupRef.current.rotation.z = state.mouse.x * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Nodes */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={NODE_COUNT}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={NODE_COUNT}
                        array={colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.15}
                    vertexColors
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                />
            </points>

            {/* Edges */}
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={linePositions.length / 3}
                        array={linePositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#00E5FF"
                    transparent
                    opacity={0.15}
                    linewidth={1}
                />
            </lineSegments>
        </group>
    );
}
