"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import type { Mesh } from "three";

const HeroBlob = memo(function HeroBlob() {
   const meshRef = useRef<Mesh>(null);

   useFrame(({ clock }) => {
      if (!meshRef.current) return;
      const time = clock.getElapsedTime();
      meshRef.current.rotation.x = Math.sin(time * 0.18) * 0.15;
      meshRef.current.rotation.y += 0.0025;
      meshRef.current.rotation.z = Math.cos(time * 0.22) * 0.08;
   });

   const geometryArgs = useMemo(() => [1.25, 6] as const, []);

   return (
      <mesh ref={meshRef} scale={1.35}>
         <icosahedronGeometry args={geometryArgs} />
         <meshStandardMaterial
            color="#fb923c"
            roughness={0.35}
            metalness={0.25}
            emissive="#f97316"
            emissiveIntensity={0.12}
         />
      </mesh>
   );
});

export default function HeroMeshScene() {
   return (
      <div className="absolute inset-0 pointer-events-none">
         <Canvas camera={{ position: [0, 0, 2.8], fov: 55 }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.65} />
            <directionalLight intensity={1} position={[2.5, 2.5, 3]} />
            <HeroBlob />
         </Canvas>
      </div>
   );
}
