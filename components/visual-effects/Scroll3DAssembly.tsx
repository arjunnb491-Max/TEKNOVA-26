"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Maximize2, RotateCcw, Sliders } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Scroll3DAssembly() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [manualScrub, setManualScrub] = useState(false);

  // References for animation state
  const animTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressObj = useRef({ value: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Setup Three.js Scene, Camera, Renderer
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020713, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lighting (Deterministic, no dynamic shadow solvers)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 3, 20);
    cyanLight.position.set(3, 4, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x7b2cff, 3, 20);
    purpleLight.position.set(-3, -2, -3);
    scene.add(purpleLight);

    // 3. Create Separated 3D Components
    const rootAssembly = new THREE.Group();
    scene.add(rootAssembly);

    // Part A: Central Quantum Core (Icosahedron + Wireframe)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
      emissive: 0x008cff,
      emissiveIntensity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootAssembly.add(coreMesh);

    // Core solid inner nucleus
    const nucleusGeo = new THREE.OctahedronGeometry(0.45);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    rootAssembly.add(nucleusMesh);

    // Part B: Concentric Optical Gimbal Ring 1
    const ring1Geo = new THREE.TorusGeometry(1.6, 0.04, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    rootAssembly.add(ring1Mesh);

    // Part C: Outer Gimbal Ring 2
    const ring2Geo = new THREE.TorusGeometry(2.1, 0.045, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x7b2cff,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    rootAssembly.add(ring2Mesh);

    // Part D: 4 Corner Cyber Brackets (Upper/Lower Left/Right)
    const bracketGeo = new THREE.BoxGeometry(0.25, 0.9, 0.4);
    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0x0f2b5c,
      metalness: 0.7,
      roughness: 0.3,
    });

    const brackets: THREE.Mesh[] = [];
    const bracketTargetPositions: [number, number, number][] = [
      [1.5, 1.2, 0],
      [-1.5, 1.2, 0],
      [1.5, -1.2, 0],
      [-1.5, -1.2, 0],
    ];

    for (let i = 0; i < 4; i++) {
      const bMesh = new THREE.Mesh(bracketGeo, bracketMat);
      rootAssembly.add(bMesh);
      brackets.push(bMesh);
    }

    // Part E: Apex Optical Emitter
    const apexGeo = new THREE.ConeGeometry(0.4, 0.8, 4);
    const apexMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
    });
    const apexMesh = new THREE.Mesh(apexGeo, apexMat);
    rootAssembly.add(apexMesh);

    // 4. Mathematical Interpolation Function (Strictly deterministic)
    // Lerps between Exploded State (t=0) and Assembled State (t=1)
    const applyAssemblyState = (t: number) => {
      // Clamped deterministic progress 0..1
      const progressClamped = Math.max(0, Math.min(1, t));

      // Core: expands from scale 0.35 to 1.0; rotation spins down to locked orientation
      const coreScale = 0.35 + 0.65 * progressClamped;
      coreMesh.scale.set(coreScale, coreScale, coreScale);
      coreMesh.rotation.y = (1 - progressClamped) * Math.PI * 3;
      coreMesh.rotation.x = (1 - progressClamped) * Math.PI;

      nucleusMesh.scale.set(coreScale, coreScale, coreScale);

      // Ring 1: starts far along Z axis and tilted 65 deg, rotates into flat aligned plane
      ring1Mesh.position.z = (1 - progressClamped) * 3.5;
      ring1Mesh.position.y = (1 - progressClamped) * 1.5;
      ring1Mesh.rotation.x = (1 - progressClamped) * 1.2;
      ring1Mesh.rotation.y = progressClamped * Math.PI * 0.25;
      ring1Mesh.scale.setScalar(0.5 + 0.5 * progressClamped);

      // Ring 2: starts far along negative Z and opposite tilt, rotates into concentric orbit
      ring2Mesh.position.z = (1 - progressClamped) * -3.5;
      ring2Mesh.position.y = (1 - progressClamped) * -1.5;
      ring2Mesh.rotation.x = (1 - progressClamped) * -1.2;
      ring2Mesh.rotation.y = (1 - progressClamped) * Math.PI * 0.5;
      ring2Mesh.scale.setScalar(0.4 + 0.6 * progressClamped);

      // Brackets: explode radially outward along X, Y, Z
      brackets.forEach((b, idx) => {
        const [tx, ty, tz] = bracketTargetPositions[idx];
        const explodeMult = 1 + (1 - progressClamped) * 2.8;
        b.position.set(tx * explodeMult, ty * explodeMult, (1 - progressClamped) * (idx % 2 === 0 ? 2 : -2));
        b.rotation.z = (1 - progressClamped) * (idx % 2 === 0 ? Math.PI : -Math.PI);
        b.rotation.y = (1 - progressClamped) * Math.PI * 0.5;
        b.scale.setScalar(0.3 + 0.7 * progressClamped);
      });

      // Apex Emitter: floats down from Y + 4.0 into apex docking position (Y = 1.95)
      apexMesh.position.y = 1.95 + (1 - progressClamped) * 3.5;
      apexMesh.rotation.y = (1 - progressClamped) * Math.PI * 4;
      apexMesh.rotation.z = Math.PI; // point downwards toward core
      apexMesh.scale.setScalar(0.2 + 0.8 * progressClamped);

      // Gentle global rotation
      rootAssembly.rotation.y = progressClamped * Math.PI * 0.5;
    };

    // Initialize at exploded (0)
    applyAssemblyState(0);

    // 5. GSAP ScrollTrigger Integration
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 0.8,
      onUpdate: (self) => {
        if (!manualScrub) {
          progressObj.current.value = self.progress;
          setProgress(Number(self.progress.toFixed(3)));
          applyAssemblyState(self.progress);
        }
      },
    });

    // 6. Deterministic Render Loop (60 FPS tick)
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 7. Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 480;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      scrollTriggerInstance.kill();
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      bracketGeo.dispose();
      bracketMat.dispose();
      apexGeo.dispose();
      apexMat.dispose();
    };
  }, [manualScrub]);

  const handleSliderScrub = (val: number) => {
    setManualScrub(true);
    setProgress(val);
    progressObj.current.value = val;
    // Animate smoothly to new value using GSAP
    gsap.to(progressObj.current, {
      value: val,
      duration: 0.2,
      ease: "power2.out",
      onUpdate: () => {
        // Will be picked up on tick or render
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] rounded-3xl bg-[#030917] border border-[#00E5FF]/20 overflow-hidden shadow-[0_0_50px_rgba(0,140,255,0.15)] flex flex-col cyber-bracket"
    >
      {/* Visual Header Overlay */}
      <div className="absolute top-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
            <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest font-bold">
              Deterministic 3D Component Stream
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-space-grotesk text-white">
            Scroll-Controlled 3D Component Assembly
          </h3>
          <p className="text-xs text-[#A9B8D0] font-mono">
            Synchronized via GSAP ScrollTrigger • Mathematical interpolation only
          </p>
        </div>

        {/* State Badge */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#061226]/90 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-[#627694]">Assembly State:</span>
          <span className="text-[#00E5FF] font-bold">
            {progress >= 0.95 ? "100% Locked" : progress <= 0.05 ? "Exploded" : `${Math.round(progress * 100)}% Interpolated`}
          </span>
        </div>
      </div>

      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Interactive HUD Scrub Bar */}
      <div className="absolute bottom-4 left-6 right-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-[#061226]/90 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-[11px] font-mono uppercase text-[#00E5FF] font-bold flex items-center gap-1.5 shrink-0">
            <Sliders size={14} /> Assembly Scrub
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={progress}
            onChange={(e) => handleSliderScrub(Number(e.target.value))}
            className="w-full sm:w-64 accent-[#00E5FF] bg-white/10 rounded-lg cursor-pointer h-1.5"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#A9B8D0]">
          <button
            onClick={() => {
              setManualScrub(false);
            }}
            className="px-3 py-1 bg-[#07172B] hover:bg-white/5 border border-white/10 rounded-lg text-[10px] text-[#00E5FF] transition-colors"
          >
            {manualScrub ? "Re-bind to Page Scroll" : "Bound to ScrollTrigger"}
          </button>
        </div>
      </div>
    </div>
  );
}

