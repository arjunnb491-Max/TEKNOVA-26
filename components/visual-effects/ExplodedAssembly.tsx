"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Play, Pause, Rotate3d, Layers, CheckCircle2 } from "lucide-react";

export function ExplodedAssembly() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeState, setActiveState] = useState<"exploded" | "assembled" | "inspecting">("exploded");
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<string | null>("Quantum Core");

  // GSAP tween timeline reference
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const morphProgress = useRef({ value: 0 }); // 0 = exploded, 1 = assembled

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020713, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4, 2.5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Cyber Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const pointCyan = new THREE.PointLight(0x00e5ff, 4, 15);
    pointCyan.position.set(3, 4, 3);
    scene.add(pointCyan);

    const pointPurple = new THREE.PointLight(0x7b2cff, 4, 15);
    pointPurple.position.set(-3, -2, -3);
    scene.add(pointPurple);

    // 3. Define Layer Components with Fixed Exploded & Assembled Transforms
    const root = new THREE.Group();
    scene.add(root);

    interface LayerDef {
      name: string;
      description: string;
      mesh: THREE.Mesh;
      explodedPos: [number, number, number];
      assembledPos: [number, number, number];
      explodedRot: [number, number, number];
      assembledRot: [number, number, number];
      explodedScale: [number, number, number];
      assembledScale: [number, number, number];
    }

    const layers: LayerDef[] = [];

    // Layer 1: Titanium Base Substrate
    const baseGeo = new THREE.BoxGeometry(2.4, 0.15, 2.4);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x091d3e,
      metalness: 0.8,
      roughness: 0.3,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    root.add(baseMesh);
    layers.push({
      name: "Chassis Baseplate",
      description: "CNC-milled aeronautical titanium housing with electromagnetic grounding.",
      mesh: baseMesh,
      explodedPos: [0, -1.8, 0],
      assembledPos: [0, -0.6, 0],
      explodedRot: [0, Math.PI * 0.15, 0],
      assembledRot: [0, 0, 0],
      explodedScale: [0.8, 0.8, 0.8],
      assembledScale: [1, 1, 1],
    });

    // Layer 2: High-Speed Circuit Board
    const pcbGeo = new THREE.BoxGeometry(2.2, 0.08, 2.2);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x054664,
      metalness: 0.5,
      roughness: 0.4,
      wireframe: true,
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    root.add(pcbMesh);
    layers.push({
      name: "Neural Bus Substrate",
      description: "Multi-layered superconducting silicon bus interconnecting peripheral I/O.",
      mesh: pcbMesh,
      explodedPos: [0, -0.9, 0],
      assembledPos: [0, -0.3, 0],
      explodedRot: [0, -Math.PI * 0.1, 0],
      assembledRot: [0, 0, 0],
      explodedScale: [0.85, 0.85, 0.85],
      assembledScale: [1, 1, 1],
    });

    // Layer 3: Central Quantum Processing Unit (QPU)
    const qpuGeo = new THREE.BoxGeometry(1.2, 0.35, 1.2);
    const qpuMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x008cff,
      emissiveIntensity: 0.4,
    });
    const qpuMesh = new THREE.Mesh(qpuGeo, qpuMat);
    root.add(qpuMesh);
    layers.push({
      name: "Quantum Core",
      description: "Supercooled cryogenic processing engine with coherence preservation lattice.",
      mesh: qpuMesh,
      explodedPos: [0, 0, 0],
      assembledPos: [0, 0, 0],
      explodedRot: [0, 0, 0],
      assembledRot: [0, 0, 0],
      explodedScale: [0.9, 0.9, 0.9],
      assembledScale: [1, 1, 1],
    });

    // Layer 4: Cryogenic Heat Dissipation Fins
    const finsGeo = new THREE.BoxGeometry(2.0, 0.25, 2.0);
    const finsMat = new THREE.MeshStandardMaterial({
      color: 0x1f1848,
      metalness: 0.8,
      roughness: 0.2,
    });
    const finsMesh = new THREE.Mesh(finsGeo, finsMat);
    root.add(finsMesh);
    layers.push({
      name: "Cryo Dissipation Fins",
      description: "Micro-channel radiator lattice for instantaneous heat sink transfer.",
      mesh: finsMesh,
      explodedPos: [0, 0.9, 0],
      assembledPos: [0, 0.3, 0],
      explodedRot: [0, Math.PI * 0.1, 0],
      assembledRot: [0, 0, 0],
      explodedScale: [0.85, 0.85, 0.85],
      assembledScale: [1, 1, 1],
    });

    // Layer 5: Top Holographic Projector Cap
    const capGeo = new THREE.CylinderGeometry(0.8, 1.1, 0.3, 32);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x7b2cff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x7b2cff,
      emissiveIntensity: 0.5,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    root.add(capMesh);
    layers.push({
      name: "Holo-Emitter Cap",
      description: "Diffraction grating optical cap projecting real-time status telemetry.",
      mesh: capMesh,
      explodedPos: [0, 1.8, 0],
      assembledPos: [0, 0.6, 0],
      explodedRot: [0, -Math.PI * 0.2, 0],
      assembledRot: [0, 0, 0],
      explodedScale: [0.8, 0.8, 0.8],
      assembledScale: [1, 1, 1],
    });

    // 4. Mathematical Deterministic Interpolation
    const applyInterpolation = (t: number) => {
      layers.forEach((layer) => {
        // Linear interpolation for Position: P(t) = P_0 * (1-t) + P_1 * t
        layer.mesh.position.x = layer.explodedPos[0] * (1 - t) + layer.assembledPos[0] * t;
        layer.mesh.position.y = layer.explodedPos[1] * (1 - t) + layer.assembledPos[1] * t;
        layer.mesh.position.z = layer.explodedPos[2] * (1 - t) + layer.assembledPos[2] * t;

        // Rotation interpolation
        layer.mesh.rotation.x = layer.explodedRot[0] * (1 - t) + layer.assembledRot[0] * t;
        layer.mesh.rotation.y = layer.explodedRot[1] * (1 - t) + layer.assembledRot[1] * t;
        layer.mesh.rotation.z = layer.explodedRot[2] * (1 - t) + layer.assembledRot[2] * t;

        // Scale interpolation
        layer.mesh.scale.x = layer.explodedScale[0] * (1 - t) + layer.assembledScale[0] * t;
        layer.mesh.scale.y = layer.explodedScale[1] * (1 - t) + layer.assembledScale[1] * t;
        layer.mesh.scale.z = layer.explodedScale[2] * (1 - t) + layer.assembledScale[2] * t;
      });
    };

    // 5. GSAP Timeline with Smooth Mathematical Easing
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      repeatDelay: 1.2,
      onUpdate: () => {
        applyInterpolation(morphProgress.current.value);
        if (morphProgress.current.value > 0.8) setActiveState("assembled");
        else if (morphProgress.current.value < 0.2) setActiveState("exploded");
        else setActiveState("inspecting");
      },
    });

    tl.to(morphProgress.current, {
      value: 1,
      duration: 3.5,
      ease: "power2.inOut",
    });

    timelineRef.current = tl;

    // 6. Interactive Orbit & Animation Loop
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      root.rotation.y += deltaX * 0.008;
      root.rotation.x = Math.max(-0.6, Math.min(0.6, root.rotation.x + deltaY * 0.008));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        root.rotation.y += 0.003; // Gentle idle rotation
      }
      renderer.render(scene, camera);
    };
    animate();

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
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animationFrameId);
      tl.kill();
      renderer.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      pcbGeo.dispose();
      pcbMat.dispose();
      qpuGeo.dispose();
      qpuMat.dispose();
      finsGeo.dispose();
      finsMat.dispose();
      capGeo.dispose();
      capMat.dispose();
    };
  }, []);

  const togglePlayback = () => {
    if (!timelineRef.current) return;
    if (isPlaying) {
      timelineRef.current.pause();
      setIsPlaying(false);
    } else {
      timelineRef.current.play();
      setIsPlaying(true);
    }
  };

  const jumpToState = (target: "exploded" | "assembled") => {
    if (!timelineRef.current) return;
    timelineRef.current.pause();
    setIsPlaying(false);
    const targetVal = target === "assembled" ? 1 : 0;
    gsap.to(morphProgress.current, {
      value: targetVal,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        // Will be reflected on tick
      },
      onComplete: () => {
        setActiveState(target);
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] rounded-3xl bg-[#030917] border border-[#7B2CFF]/30 overflow-hidden shadow-[0_0_50px_rgba(123,44,255,0.15)] flex flex-col cyber-bracket"
    >
      {/* Top Header */}
      <div className="absolute top-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B44CFF] animate-pulse"></span>
            <span className="text-[10px] font-mono text-[#B44CFF] uppercase tracking-widest font-bold">
              Precision Matrix Interpolation
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-space-grotesk text-white">
            Exploded-to-Assembled Hardware Transformation
          </h3>
          <p className="text-xs text-[#A9B8D0] font-mono">
            Fixed exploded &amp; assembled vectors • Drag canvas to orbit
          </p>
        </div>

        {/* State Toggle Buttons */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#061226]/90 border border-white/10 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => jumpToState("exploded")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeState === "exploded" ? "bg-[#7B2CFF] text-white font-bold" : "text-[#A9B8D0] hover:text-white"
            }`}
          >
            Exploded View
          </button>
          <button
            onClick={() => jumpToState("assembled")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeState === "assembled" ? "bg-[#008CFF] text-white font-bold" : "text-[#A9B8D0] hover:text-white"
            }`}
          >
            Assembled View
          </button>
          <button
            onClick={togglePlayback}
            className="p-1.5 text-[#00E5FF] hover:bg-white/5 rounded-lg transition-colors"
            title={isPlaying ? "Pause Timeline" : "Resume Timeline"}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Layer Telemetry Inspector Bar */}
      <div className="absolute bottom-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#061226]/90 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-[#00E5FF] font-bold">Layer Telemetry:</span>
          <div className="flex flex-wrap gap-1.5">
            {["Chassis Baseplate", "Neural Bus Substrate", "Quantum Core", "Cryo Dissipation Fins", "Holo-Emitter Cap"].map(
              (name) => (
                <button
                  key={name}
                  onClick={() => setSelectedLayer(name)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                    selectedLayer === name
                      ? "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-bold"
                      : "bg-[#07172B] text-[#627694] hover:text-[#A9B8D0] border border-white/5"
                  }`}
                >
                  {name}
                </button>
              )
            )}
          </div>
        </div>

        <div className="text-right text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 size={13} />
          <span>Closed-Form Transforms</span>
        </div>
      </div>
    </div>
  );
}

