"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Icosahedron, Octahedron } from "@react-three/drei";

const TEAL = "#14b8a6";
const TEAL_DEEP = "#0f766e";
const AMBER = "#f59e0b";

function Scene() {
  return (
    <>
      <Float speed={1.4} rotationIntensity={1.6} floatIntensity={1.6}>
        <Icosahedron args={[1.1, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL_DEEP}
            emissiveIntensity={0.4}
            metalness={0.65}
            roughness={0.22}
            flatShading
          />
        </Icosahedron>
      </Float>
      <Float speed={2.1} rotationIntensity={1.8} floatIntensity={1.8}>
        <Octahedron args={[0.32, 0]} position={[1.8, 0.9, -0.4]}>
          <meshStandardMaterial
            color={AMBER}
            emissive={AMBER}
            emissiveIntensity={0.5}
            metalness={0.5}
            roughness={0.25}
            flatShading
          />
        </Octahedron>
      </Float>
      <Float speed={2.4} rotationIntensity={0} floatIntensity={2}>
        <mesh position={[-1.7, -0.9, 0.5]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.4} />
        </mesh>
      </Float>
    </>
  );
}

export default function Error3d() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.8], fov: 48 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={0.85} />
      <pointLight position={[-3, -2, 3]} intensity={1} color={TEAL} />
      <pointLight position={[3, 2, -2]} intensity={0.9} color={AMBER} />
      <Scene />
    </Canvas>
  );
}
