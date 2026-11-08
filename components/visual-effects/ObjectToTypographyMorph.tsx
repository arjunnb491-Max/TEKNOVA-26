"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Play, Pause, Sparkles, Sliders, Type } from "lucide-react";

export function ObjectToTypographyMorph() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [morphValue, setMorphValue] = useState(0); // 0 = Sphere, 1 = Typography
  const [isPlaying, setIsPlaying] = useState(true);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const morphObj = useRef({ progress: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020713, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Generate Deterministic Coordinate Sets (N = 2,200 particles)
    const particleCount = 2200;
    const positionsA = new Float32Array(particleCount * 3); // 3D Sphere Object
    const positionsB = new Float32Array(particleCount * 3); // 3D Text 'TEKNOVA '26'
    const currentPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const vortexOffsets = new Float32Array(particleCount * 3); // Deterministic transit vortex

    // A. Generate 3D Spherical Fibonacci Lattice (Shape A)
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle
    const sphereRadius = 2.4;

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Add structured geometric concentric pulsation
      const r = sphereRadius * (0.85 + (i % 5) * 0.06);
      positionsA[i * 3] = x * r;
      positionsA[i * 3 + 1] = y * r;
      positionsA[i * 3 + 2] = z * r;

      // Vortex offsets for transit curve: sin(pi * t)
      vortexOffsets[i * 3] = (Math.sin(i * 0.1) * 1.5);
      vortexOffsets[i * 3 + 1] = (Math.cos(i * 0.1) * 1.5);
      vortexOffsets[i * 3 + 2] = ((i % 2 === 0 ? 1 : -1) * 1.2);
    }

    // B. Generate 3D Typography Matrix 'TEKNOVA '26' (Shape B)
    // We rasterize high-res canvas text into deterministic point cloud coordinates
    const textCanvas = document.createElement("canvas");
    textCanvas.width = 600;
    textCanvas.height = 200;
    const tCtx = textCanvas.getContext("2d");
    if (tCtx) {
      tCtx.fillStyle = "#000000";
      tCtx.fillRect(0, 0, 600, 200);
      tCtx.fillStyle = "#FFFFFF";
      tCtx.font = "bold 72px 'Space Grotesk', monospace, sans-serif";
      tCtx.textAlign = "center";
      tCtx.textBaseline = "middle";
      tCtx.fillText("TEKNOVA", 300, 75);
      tCtx.font = "bold 52px monospace";
      tCtx.fillText("’26", 300, 145);

      const imgData = tCtx.getImageData(0, 0, 600, 200);
      const validPoints: [number, number][] = [];

      for (let py = 0; py < 200; py += 3) {
        for (let px = 0; px < 600; px += 3) {
          const idx = (py * 600 + px) * 4;
          if (imgData.data[idx] > 128) {
            validPoints.push([px, py]);
          }
        }
      }

      // Map valid text pixels to positionsB in world coordinates (-4.5 to +4.5, -1.8 to +1.8)
      for (let i = 0; i < particleCount; i++) {
        const pt = validPoints[i % validPoints.length];
        const worldX = (pt[0] / 600 - 0.5) * 8.2;
        const worldY = -(pt[1] / 200 - 0.5) * 2.8;
        const worldZ = ((i % 7) - 3) * 0.08; // Layered depth

        positionsB[i * 3] = worldX;
        positionsB[i * 3 + 1] = worldY;
        positionsB[i * 3 + 2] = worldZ;
      }
    }

    // 3. Build Point Cloud Geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Particle Texture (Circular Neon Glow)
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.35, "rgba(0, 229, 255, 0.85)");
      grad.addColorStop(1, "rgba(0, 229, 255, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.14,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // 4. Mathematical Morphing Function (Point-to-point interpolation)
    const updateMorph = (t: number) => {
      // Clamped deterministic parameter
      const p = Math.max(0, Math.min(1, t));
      const posAttr = geometry.attributes.position;
      const colAttr = geometry.attributes.color;

      // Mid-transit dispersion factor: sin(pi * p)
      const transitArch = Math.sin(Math.PI * p);

      const colorA = new THREE.Color(0x7b2cff); // Vivid Violet for Sphere
      const colorB = new THREE.Color(0x00e5ff); // Cyan for Typography
      const curColor = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position: P(t) = A*(1-t) + B*t + transitOffset*sin(pi*t)
        const ax = positionsA[i3];
        const ay = positionsA[i3 + 1];
        const az = positionsA[i3 + 2];

        const bx = positionsB[i3];
        const by = positionsB[i3 + 1];
        const bz = positionsB[i3 + 2];

        const vx = vortexOffsets[i3] * transitArch;
        const vy = vortexOffsets[i3 + 1] * transitArch;
        const vz = vortexOffsets[i3 + 2] * transitArch;

        currentPositions[i3] = ax * (1 - p) + bx * p + vx;
        currentPositions[i3 + 1] = ay * (1 - p) + by * p + vy;
        currentPositions[i3 + 2] = az * (1 - p) + bz * p + vz;

        // Color interpolation
        curColor.lerpColors(colorA, colorB, p);
        if (transitArch > 0.1 && i % 3 === 0) {
          curColor.setHex(0xffffff); // Sparkle highlights in transit
        }

        colors[i3] = curColor.r;
        colors[i3 + 1] = curColor.g;
        colors[i3 + 2] = curColor.b;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    };

    updateMorph(0);

    // 5. GSAP Morph Timeline
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      repeatDelay: 1.5,
      onUpdate: () => {
        updateMorph(morphObj.current.progress);
        setMorphValue(Number(morphObj.current.progress.toFixed(2)));
      },
    });

    tl.to(morphObj.current, {
      progress: 1,
      duration: 3.2,
      ease: "power2.inOut",
    });

    timelineRef.current = tl;

    // 6. Interactive Orbit & Render Loop
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
      pointCloud.rotation.y += deltaX * 0.006;
      pointCloud.rotation.x = Math.max(-0.4, Math.min(0.4, pointCloud.rotation.x + deltaY * 0.006));
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
        // Slow rotation, subdued in text mode so letters stay readable
        const rotSpeed = 0.003 * (1 - morphObj.current.progress * 0.85);
        pointCloud.rotation.y += rotSpeed;
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
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
    };
  }, []);

  const handleScrub = (val: number) => {
    if (!timelineRef.current) return;
    timelineRef.current.pause();
    setIsPlaying(false);
    setMorphValue(val);
    morphObj.current.progress = val;
  };

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] rounded-3xl bg-[#030917] border border-[#00E5FF]/20 overflow-hidden shadow-[0_0_50px_rgba(0,140,255,0.15)] flex flex-col cyber-bracket"
    >
      {/* Header Overlay */}
      <div className="absolute top-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
            <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest font-bold">
              3D Point-Cloud Particle Morphing
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-space-grotesk text-white">
            3D Object-to-Typography Transformation
          </h3>
          <p className="text-xs text-[#A9B8D0] font-mono">
            Fibonacci 3D Geosphere ⟷ TEKNOVA ’26 Typography • 2,200 deterministic nodes
          </p>
        </div>

        {/* State Badge */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#061226]/90 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono">
          <Type size={14} className="text-[#00E5FF]" />
          <span className="text-white font-bold">
            {morphValue >= 0.9 ? "Typography Phase" : morphValue <= 0.1 ? "3D Sphere Phase" : "Transit Vortex"}
          </span>
        </div>
      </div>

      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Scrub & Playback HUD Bar */}
      <div className="absolute bottom-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[#061226]/90 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={togglePlayback}
            className="p-2 bg-[#07172B] hover:bg-[#008CFF]/20 text-[#00E5FF] border border-white/10 rounded-xl transition-colors"
            title={isPlaying ? "Pause Morph" : "Play Morph"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <span className="text-[11px] font-mono text-[#A9B8D0] uppercase">Sphere</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={morphValue}
            onChange={(e) => handleScrub(Number(e.target.value))}
            className="w-48 sm:w-64 accent-[#00E5FF] bg-white/10 rounded-lg cursor-pointer h-1.5"
          />
          <span className="text-[11px] font-mono text-[#00E5FF] font-bold uppercase">TEKNOVA</span>
        </div>

        <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
          <Sparkles size={13} />
          <span>Closed-Form Vortex Transit</span>
        </div>
      </div>
    </div>
  );
}

