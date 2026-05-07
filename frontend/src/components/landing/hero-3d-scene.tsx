"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, TorusKnot } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

const TEAL = "#14b8a6";
const TEAL_DEEP = "#0f766e";
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

function SlowSpin({ children, speed = 0.15 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.3;
  });
  return <group ref={ref}>{children}</group>;
}

function Scene() {
  return (
    <ParallaxGroup>
      {/* Centerpiece: distorted torus knot — smaller, recessed, off-center */}
      <Float speed={1.3} rotationIntensity={0.6} floatIntensity={1.2}>
        <SlowSpin>
          <TorusKnot args={[0.62, 0.2, 220, 32]} position={[2.2, -0.4, -2]}>
            <MeshDistortMaterial
              color={TEAL}
              emissive={TEAL_DEEP}
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.2}
              distort={0.24}
              speed={1.4}
            />
          </TorusKnot>
        </SlowSpin>
      </Float>

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

      {/* Smaller teal icosahedron — bottom left */}
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

      {/* Smaller secondary teal icosahedron — top left */}
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

      {/* Tiny accent dots */}
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.85} color={"#ffffff"} />
      <pointLight position={[-3, -2, 3]} intensity={1} color={TEAL} />
      <pointLight position={[3, 2, -2]} intensity={0.8} color={AMBER} />
      <fog attach="fog" args={[INK, 5, 11]} />
      <Scene />
    </Canvas>
  );
}
