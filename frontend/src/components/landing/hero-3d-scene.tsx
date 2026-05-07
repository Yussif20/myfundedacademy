"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, Octahedron } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

const TEAL = "#14b8a6";
const TEAL_DEEP = "#0f766e";
const TEAL_BRIGHT = "#5eead4";
const AMBER = "#f59e0b";
const INK = "#0a0f14";

function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    const x = (state.pointer.x * viewport.width) / 80;
    const y = (state.pointer.y * viewport.height) / 80;
    ref.current.rotation.y += (x - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (-y - ref.current.rotation.x) * 0.05;
  });

  return <group ref={ref}>{children}</group>;
}

function SlowSpin({ children, speed = 0.18 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.25;
  });
  return <group ref={ref}>{children}</group>;
}

function GemCenterpiece() {
  return (
    <group position={[1.6, -0.2, -2]} scale={1.05}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1}>
        <SlowSpin>
          {/* Outer faceted gem — clearcoat + emissive teal */}
          <Octahedron args={[1.1, 0]}>
            <meshPhysicalMaterial
              color={TEAL}
              metalness={0.15}
              roughness={0.08}
              clearcoat={1}
              clearcoatRoughness={0.04}
              emissive={TEAL_DEEP}
              emissiveIntensity={0.45}
              envMapIntensity={1.5}
              reflectivity={0.7}
            />
          </Octahedron>

          {/* Inner glow core — slightly smaller, brighter, lower-poly */}
          <Octahedron args={[0.65, 0]}>
            <meshStandardMaterial
              color={TEAL_BRIGHT}
              emissive={TEAL_BRIGHT}
              emissiveIntensity={0.85}
              transparent
              opacity={0.55}
              toneMapped={false}
            />
          </Octahedron>

          {/* Subtle wireframe edges — adds the "faceted" definition */}
          <Octahedron args={[1.105, 0]}>
            <meshBasicMaterial color={TEAL_BRIGHT} wireframe transparent opacity={0.18} />
          </Octahedron>
        </SlowSpin>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <ParallaxGroup>
      {/* Hero centerpiece — faceted teal gem */}
      <GemCenterpiece />

      {/* Floating amber icosahedron — top right accent */}
      <Float speed={1.6} rotationIntensity={1.4} floatIntensity={1.8}>
        <Icosahedron args={[0.4, 0]} position={[3.2, 1.6, -1]}>
          <meshStandardMaterial
            color={AMBER}
            emissive={AMBER}
            emissiveIntensity={0.35}
            metalness={0.5}
            roughness={0.25}
            flatShading
          />
        </Icosahedron>
      </Float>

      {/* Teal icosahedron — bottom left */}
      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.4}>
        <Icosahedron args={[0.3, 0]} position={[-3, -1.4, -0.5]}>
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.28}
            metalness={0.6}
            roughness={0.2}
            flatShading
          />
        </Icosahedron>
      </Float>

      {/* Smaller teal icosahedron — top left */}
      <Float speed={1.9} rotationIntensity={1.1} floatIntensity={1.6}>
        <Icosahedron args={[0.22, 0]} position={[-2.6, 1.5, -1.2]}>
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.32}
            metalness={0.55}
            roughness={0.22}
            flatShading
          />
        </Icosahedron>
      </Float>

      {/* Tiny accent sparkle dots */}
      <Float speed={2.8} rotationIntensity={0} floatIntensity={2}>
        <mesh position={[1.8, -1.7, 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.2} />
        </mesh>
      </Float>
      <Float speed={3.2} rotationIntensity={0} floatIntensity={2.4}>
        <mesh position={[-1.9, 1.7, 0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={1.4} />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={0} floatIntensity={1.8}>
        <mesh position={[2.6, 0.4, 0.2]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.5} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={0} floatIntensity={2}>
        <mesh position={[0.4, 1.2, 0.4]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color={TEAL_BRIGHT}
            emissive={TEAL_BRIGHT}
            emissiveIntensity={1.6}
          />
        </mesh>
      </Float>
    </ParallaxGroup>
  );
}

export default function Hero3dScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.4], fov: 48 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={0.9} color={"#ffffff"} />
      <pointLight position={[-3, -2, 3]} intensity={1.4} color={TEAL} />
      <pointLight position={[3, 2, -2]} intensity={1.1} color={AMBER} />
      <pointLight position={[0, 3, 4]} intensity={0.6} color={TEAL_BRIGHT} />
      <fog attach="fog" args={[INK, 5, 11]} />
      <Scene />
    </Canvas>
  );
}
