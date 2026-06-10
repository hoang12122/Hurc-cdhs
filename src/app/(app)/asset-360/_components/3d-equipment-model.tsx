"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, BakeShadows, Preload } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
    status: 'healthy' | 'warning' | 'critical';
}

function EquipmentMesh({ status }: ModelProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
            meshRef.current.rotation.x += delta * 0.2;
            
            // Pulse effect if critical
            if (status === 'critical') {
                const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
                meshRef.current.scale.set(scale, scale, scale);
            } else {
                meshRef.current.scale.set(1, 1, 1);
            }
        }
    });

    const color = status === 'healthy' ? '#3b82f6' : status === 'warning' ? '#f59e0b' : '#ef4444';
    const emissive = status === 'critical' ? '#ef4444' : '#000000';
    const emissiveIntensity = status === 'critical' ? 0.5 : 0;

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial 
                color={color} 
                roughness={0.2} 
                metalness={0.8}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
            />
        </mesh>
    );
}

export function Equipment3DModel({ status }: ModelProps) {
    return (
        <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-slate-900/5 cursor-move relative">
            <React.Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10 animate-pulse">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
                    <p className="text-slate-500 font-bold text-sm">Đang nạp Mô hình 3D Digital Twin...</p>
                </div>
            }>
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    
                    <EquipmentMesh status={status} />
                    
                    <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                    <OrbitControls enableZoom={true} enablePan={false} autoRotate={status === 'healthy'} autoRotateSpeed={0.5} />
                    <Environment preset="city" />
                    <BakeShadows />
                    <Preload all />
                </Canvas>
            </React.Suspense>
        </div>
    );
}
