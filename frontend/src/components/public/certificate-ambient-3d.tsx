"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Icosahedron, Torus } from "@react-three/drei";

const TEAL = "#14b8a6";
const TEAL_DEEP = "#0f766e";
const AMBER = "#f59e0b";

function Scene() {
  return (
    <>
      {/* Top-left teal torus accent */}
      <Float speed={1.4} rotationIntensity={0.8} floatIntensity={1.3}>
        <Torus args={[0.45, 0.13, 24, 64]} position={[-3, 1.6, -2]} rotation={[0.3, 0.4, 0]}>
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL_DEEP}
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.25}
          />
        </Torus>
      </Float>

      {/* Top-right amber icosahedron */}
      <Float speed={1.7} rotationIntensity={1.3} floatIntensity={1.6}>
        <Icosahedron args={[0.35, 0]} position={[3.2, 1.4, -2.2]}>
          <meshStandardMaterial
            color={AMBER}
            emissive={AMBER}
            emissiveIntensity={0.32}
            metalness={0.55}
            roughness={0.22}
            flatShading
          />
        </Icosahedron>
      </Float>

      {/* Bottom-left tiny amber */}
      <Float speed={2.1} rotationIntensity={0} floatIntensity={1.8}>
        <mesh position={[-2.6, -1.8, -1]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.3} />
        </mesh>
      </Float>

      {/* Bottom-right teal icosahedron */}
      <Float speed={1.9} rotationIntensity={1.1} floatIntensity={1.4}>
        <Icosahedron args={[0.28, 0]} position={[2.8, -1.6, -1.5]}>
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.28}
            metalness={0.55}
            roughness={0.22}
            flatShading
          />
        </Icosahedron>
      </Float>
    </>
  );
}

export default function CertificateAmbient3d() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 48 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={0.7} />
      <pointLight position={[-3, -2, 3]} intensity={0.8} color={TEAL} />
      <pointLight position={[3, 2, -2]} intensity={0.7} color={AMBER} />
      <Scene />
    </Canvas>
  );
}
