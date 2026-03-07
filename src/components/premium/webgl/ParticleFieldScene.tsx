"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import type { Points } from "three";

const ParticleField = memo(function ParticleField() {
   const pointsRef = useRef<Points>(null);
   const particles = useMemo(() => {
      const count = 450;
      const positions = new Float32Array(count * 3);
      for (let index = 0; index < count; index++) {
         const i3 = index * 3;
         positions[i3] = (Math.random() - 0.5) * 5.8;
         positions[i3 + 1] = (Math.random() - 0.5) * 2.8;
         positions[i3 + 2] = (Math.random() - 0.5) * 2.8;
      }
      return positions;
   }, []);

   useFrame(({ clock }) => {
      if (!pointsRef.current) return;
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
   });

   return (
      <points ref={pointsRef}>
         <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={particles} count={particles.length / 3} itemSize={3} />
         </bufferGeometry>
         <pointsMaterial color="#fb923c" size={0.018} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
      </points>
   );
});

export default function ParticleFieldScene() {
   return (
      <div className="absolute inset-0 pointer-events-none">
         <Canvas camera={{ position: [0, 0, 2.6], fov: 60 }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.5} />
            <ParticleField />
         </Canvas>
      </div>
   );
}
