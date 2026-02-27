"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial, MeshWobbleMaterial, Environment, Center } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

interface Capdana3DProps {
    accentColor: string;
    frontId: string | null;
    bandanaId: string | null;
    viewAngle?: "front" | "right" | "back" | "left" | "top" | "360";
}

const CapModel = ({ accentColor }: { accentColor: string }) => {
    return (
        <group>
            {/* Head/Base placeholder */}
            <mesh position={[0, -0.2, 0]}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
            </mesh>

            {/* Cap body */}
            <mesh position={[0, 0.4, -0.2]}>
                <sphereGeometry args={[0.85, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
                <meshStandardMaterial color="#050505" roughness={0.4} />
            </mesh>

            {/* Cap Visor */}
            <mesh position={[0, 0.35, 0.6]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[1.2, 0.05, 0.8]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
            </mesh>
        </group>
    );
};

const BandanaModel = ({ color }: { color: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={[0, -0.1, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.88, 0.08, 16, 100, Math.PI]} />
                <MeshWobbleMaterial factor={0.2} speed={1.5} color={color} roughness={0.3} metalness={0.2} />
            </mesh>

            {/* Hanging part of the bandana */}
            <mesh position={[0, -0.8, -0.8]} rotation={[0.4, 0, 0]}>
                <planeGeometry args={[1.5, 1.8]} />
                <MeshDistortMaterial factor={0.4} speed={2} color={color} roughness={0.4} />
            </mesh>
        </Float>
    );
};

const CameraController = ({ viewAngle }: { viewAngle: Capdana3DProps["viewAngle"] }) => {
    const orbitRef = useRef<any>(null);

    useEffect(() => {
        if (!orbitRef.current) return;

        let targetAzimuth = 0;
        let targetPolar = Math.PI / 2.5;

        switch (viewAngle) {
            case "front": targetAzimuth = 0; break;
            case "right": targetAzimuth = Math.PI / 2; break;
            case "back": targetAzimuth = Math.PI; break;
            case "left": targetAzimuth = -Math.PI / 2; break;
            case "top": targetAzimuth = 0; targetPolar = 0.1; break;
            case "360":
            default:
                orbitRef.current.autoRotate = true;
                return;
        }

        orbitRef.current.autoRotate = false;

        // Animate the camera cleanly
        const currentAzimuth = orbitRef.current.getAzimuthalAngle();
        const currentPolar = orbitRef.current.getPolarAngle();

        // Normalize
        let diffA = targetAzimuth - currentAzimuth;
        while (diffA < -Math.PI) diffA += Math.PI * 2;
        while (diffA > Math.PI) diffA -= Math.PI * 2;
        targetAzimuth = currentAzimuth + diffA;

        let start = performance.now();
        const animate = (time: number) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / 600, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            orbitRef.current.setAzimuthalAngle(currentAzimuth + diffA * ease);
            orbitRef.current.setPolarAngle(currentPolar + (targetPolar - currentPolar) * ease);

            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

    }, [viewAngle]);

    return (
        <OrbitControls
            ref={orbitRef}
            enableZoom={false}
            autoRotate={viewAngle === "360"}
            autoRotateSpeed={1.0}
            minPolarAngle={0.1}
            maxPolarAngle={Math.PI / 1.5}
            makeDefault
        />
    );
};

export const Capdana3D = ({ accentColor, frontId, bandanaId, viewAngle = "360" }: Capdana3DProps) => {
    return (
        <div className="h-full w-full bg-[#050505] rounded-2xl overflow-hidden relative">
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
                <CameraController viewAngle={viewAngle} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} color={accentColor} intensity={0.5} />

                <Center top>
                    <group scale={1.2}>
                        <CapModel accentColor={accentColor} />
                        {bandanaId && <BandanaModel color={accentColor} />}
                    </group>
                </Center>

                <Environment preset="city" />
            </Canvas>
            <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-[#FF4D4D] font-bold bg-[#FF4D4D]/10 px-3 py-1.5 rounded-full border border-[#FF4D4D]/30 pointer-events-none drop-shadow-md">
                3D Model
            </div>
        </div>
    );
};
