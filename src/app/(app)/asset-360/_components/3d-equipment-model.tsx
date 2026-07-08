"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, BakeShadows, Preload } from '@react-three/drei';
import * as THREE from 'three';

const R3FGroup = 'group' as any;
const R3FMesh = 'mesh' as any;
const R3FBoxGeometry = 'boxGeometry' as any;
const R3FMeshStandardMaterial = 'meshStandardMaterial' as any;
const R3FAmbientLight = 'ambientLight' as any;
const R3FSpotLight = 'spotLight' as any;
const R3FPointLight = 'pointLight' as any;

interface ModelProps {
    status: 'healthy' | 'warning' | 'critical';
    category?: string | null;
}

type TwinStatus = ModelProps['status'];

function statusMaterial(status: TwinStatus) {
    return {
        color: status === 'healthy' ? '#3b82f6' : status === 'warning' ? '#f59e0b' : '#ef4444',
        emissive: status === 'critical' ? '#ef4444' : '#000000',
        emissiveIntensity: status === 'critical' ? 0.45 : 0,
    };
}

function getAssetKind(category?: string | null) {
    const text = String(category || '').toLowerCase();
    if (text.includes('psd') || text.includes('door') || text.includes('cửa')) return 'psd';
    if (text.includes('afc') || text.includes('gate') || text.includes('tvm') || text.includes('bom')) return 'afc';
    return 'generic';
}

function DigitalTwinMesh({ status, category }: ModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const assetKind = getAssetKind(category);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y += delta * 0.25;

        if (status === 'critical') {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.025;
            groupRef.current.scale.set(scale, scale, scale);
        } else {
            groupRef.current.scale.set(1, 1, 1);
        }
    });

    return (
        <R3FGroup ref={groupRef}>
            {assetKind === 'psd' && <PsdTwin status={status} />}
            {assetKind === 'afc' && <AfcTwin status={status} />}
            {assetKind === 'generic' && <GenericTwin status={status} />}
        </R3FGroup>
    );
}

function PsdTwin({ status }: { status: TwinStatus }) {
    const material = statusMaterial(status);
    return (
        <>
            <R3FMesh position={[0, -1.2, 0]} receiveShadow>
                <R3FBoxGeometry args={[4.6, 0.18, 1.3]} />
                <R3FMeshStandardMaterial color="#64748b" roughness={0.65} metalness={0.2} />
            </R3FMesh>
            <R3FMesh position={[0, 0.15, -0.15]} castShadow>
                <R3FBoxGeometry args={[4.3, 2.2, 0.12]} />
                <R3FMeshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.65} />
            </R3FMesh>
            <R3FMesh position={[-0.65, 0.05, 0.02]} castShadow>
                <R3FBoxGeometry args={[1.15, 1.65, 0.18]} />
                <R3FMeshStandardMaterial color={material.color} roughness={0.22} metalness={0.8} emissive={material.emissive} emissiveIntensity={material.emissiveIntensity} />
            </R3FMesh>
            <R3FMesh position={[0.65, 0.05, 0.02]} castShadow>
                <R3FBoxGeometry args={[1.15, 1.65, 0.18]} />
                <R3FMeshStandardMaterial color={material.color} roughness={0.22} metalness={0.8} emissive={material.emissive} emissiveIntensity={material.emissiveIntensity} />
            </R3FMesh>
            <R3FMesh position={[0, 1.45, 0.02]} castShadow>
                <R3FBoxGeometry args={[3.8, 0.22, 0.26]} />
                <R3FMeshStandardMaterial color="#334155" roughness={0.3} metalness={0.75} />
            </R3FMesh>
            <R3FMesh position={[1.85, 1.55, 0.16]} castShadow>
                <R3FBoxGeometry args={[0.34, 0.34, 0.34]} />
                <R3FMeshStandardMaterial color={status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#22c55e'} emissive={status === 'critical' ? '#ef4444' : '#000000'} emissiveIntensity={status === 'critical' ? 0.7 : 0.15} />
            </R3FMesh>
        </>
    );
}

function AfcTwin({ status }: { status: TwinStatus }) {
    const material = statusMaterial(status);
    return (
        <>
            <R3FMesh position={[0, -1.15, 0]} receiveShadow>
                <R3FBoxGeometry args={[4.2, 0.18, 1.4]} />
                <R3FMeshStandardMaterial color="#64748b" roughness={0.65} metalness={0.2} />
            </R3FMesh>
            {[-1.2, 1.2].map((x) => (
                <R3FMesh key={x} position={[x, -0.2, 0]} castShadow>
                    <R3FBoxGeometry args={[0.58, 1.75, 1.0]} />
                    <R3FMeshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.7} />
                </R3FMesh>
            ))}
            <R3FMesh position={[0, -0.18, 0.05]} castShadow>
                <R3FBoxGeometry args={[1.65, 0.12, 0.9]} />
                <R3FMeshStandardMaterial color={material.color} roughness={0.25} metalness={0.75} emissive={material.emissive} emissiveIntensity={material.emissiveIntensity} />
            </R3FMesh>
            <R3FMesh position={[-1.2, 0.85, 0.42]} castShadow>
                <R3FBoxGeometry args={[0.45, 0.14, 0.28]} />
                <R3FMeshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.18} />
            </R3FMesh>
            <R3FMesh position={[1.2, 0.85, 0.42]} castShadow>
                <R3FBoxGeometry args={[0.45, 0.14, 0.28]} />
                <R3FMeshStandardMaterial color={status === 'critical' ? '#ef4444' : '#38bdf8'} emissive={status === 'critical' ? '#ef4444' : '#38bdf8'} emissiveIntensity={0.18} />
            </R3FMesh>
        </>
    );
}

function GenericTwin({ status }: { status: TwinStatus }) {
    const material = statusMaterial(status);
    return (
        <>
            <R3FMesh position={[0, -1.2, 0]} receiveShadow>
                <R3FBoxGeometry args={[3.5, 0.18, 1.6]} />
                <R3FMeshStandardMaterial color="#64748b" roughness={0.65} metalness={0.2} />
            </R3FMesh>
            <R3FMesh position={[0, 0, 0]} castShadow receiveShadow>
                <R3FBoxGeometry args={[2, 2, 2]} />
                <R3FMeshStandardMaterial
                    color={material.color}
                    roughness={0.22}
                    metalness={0.8}
                    emissive={material.emissive}
                    emissiveIntensity={material.emissiveIntensity}
                />
            </R3FMesh>
            <R3FMesh position={[0, 1.25, 0]} castShadow>
                <R3FBoxGeometry args={[1.4, 0.12, 1.4]} />
                <R3FMeshStandardMaterial color="#e2e8f0" roughness={0.35} metalness={0.35} />
            </R3FMesh>
        </>
    );
}

export function Equipment3DModel({ status, category }: ModelProps) {
    return (
        <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-slate-900/5 cursor-move relative">
            <React.Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10 animate-pulse">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
                    <p className="text-slate-500 font-bold text-sm">Đang nạp Mô hình 3D Digital Twin...</p>
                </div>
            }>
                <Canvas camera={{ position: [0, 0.6, 5.5], fov: 45 }} shadows>
                    <R3FAmbientLight intensity={0.55} />
                    <R3FSpotLight position={[10, 10, 10]} angle={0.18} penumbra={1} intensity={1.2} castShadow />
                    <R3FPointLight position={[-10, -10, -10]} intensity={0.45} />

                    <DigitalTwinMesh status={status} category={category} />

                    <ContactShadows position={[0, -1.35, 0]} opacity={0.45} scale={10} blur={2} far={4} />
                    <OrbitControls enableZoom enablePan={false} autoRotate={status === 'healthy'} autoRotateSpeed={0.45} />
                    <Environment preset="city" />
                    <BakeShadows />
                    <Preload all />
                </Canvas>
            </React.Suspense>
        </div>
    );
}
