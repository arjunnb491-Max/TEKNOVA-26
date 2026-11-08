"use client";

import React, { useEffect, useRef, useState } from "react";
import { Zap, Activity, Radio, Cpu } from "lucide-react";

interface CableDef {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  width: number;
  baseSag: number;
  frequency: number;
  phase: number;
  p0: [number, number]; // Start
  p3: [number, number]; // End
  dataPackets: { t: number; speed: number; size: number }[];
}

export function RealisticCableMovement() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pulseSpeed, setPulseSpeed] = useState(1);
  const [interactiveTension, setInteractiveTension] = useState(0.85);

  const pointerPos = useRef({ x: -1000, y: -1000, active: false });
  const pointerVelocity = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight || 480);

    // Cable Configurations across terminals
    const cables: CableDef[] = [
      {
        id: "cable-1",
        name: "Main Optical Fiber Alpha",
        color: "#00E5FF",
        glowColor: "rgba(0, 229, 255, 0.4)",
        width: 3.5,
        baseSag: 85,
        frequency: 1.2,
        phase: 0,
        p0: [width * 0.08, height * 0.28],
        p3: [width * 0.92, height * 0.32],
        dataPackets: [
          { t: 0.1, speed: 0.003, size: 5 },
          { t: 0.5, speed: 0.0035, size: 6 },
          { t: 0.8, speed: 0.0028, size: 4 },
        ],
      },
      {
        id: "cable-2",
        name: "Superconducting Bus Beta",
        color: "#008CFF",
        glowColor: "rgba(0, 140, 255, 0.45)",
        width: 4.5,
        baseSag: 130,
        frequency: 0.9,
        phase: Math.PI * 0.35,
        p0: [width * 0.08, height * 0.4],
        p3: [width * 0.92, height * 0.45],
        dataPackets: [
          { t: 0.25, speed: 0.0025, size: 7 },
          { t: 0.7, speed: 0.003, size: 6 },
        ],
      },
      {
        id: "cable-3",
        name: "Quantum Coherence Feed Gamma",
        color: "#7B2CFF",
        glowColor: "rgba(123, 44, 255, 0.4)",
        width: 3.0,
        baseSag: 175,
        frequency: 1.5,
        phase: Math.PI * 0.7,
        p0: [width * 0.08, height * 0.52],
        p3: [width * 0.92, height * 0.58],
        dataPackets: [
          { t: 0.15, speed: 0.004, size: 5 },
          { t: 0.6, speed: 0.0042, size: 5 },
        ],
      },
      {
        id: "cable-4",
        name: "Telemetry Pulse Conduit Delta",
        color: "#F59E0B",
        glowColor: "rgba(245, 158, 11, 0.4)",
        width: 2.5,
        baseSag: 105,
        frequency: 1.8,
        phase: Math.PI * 1.1,
        p0: [width * 0.08, height * 0.65],
        p3: [width * 0.92, height * 0.7],
        dataPackets: [
          { t: 0.35, speed: 0.005, size: 4 },
          { t: 0.85, speed: 0.0048, size: 5 },
        ],
      },
    ];

    // Resize Handler
    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight || 480;

      // Update cable endpoints proportionally
      cables[0].p0 = [width * 0.08, height * 0.28];
      cables[0].p3 = [width * 0.92, height * 0.32];
      cables[1].p0 = [width * 0.08, height * 0.4];
      cables[1].p3 = [width * 0.92, height * 0.45];
      cables[2].p0 = [width * 0.08, height * 0.52];
      cables[2].p3 = [width * 0.92, height * 0.58];
      cables[3].p0 = [width * 0.08, height * 0.65];
      cables[3].p3 = [width * 0.92, height * 0.7];
    };
    window.addEventListener("resize", handleResize);

    // Pointer Tracking for Deterministic Deformation
    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      pointerVelocity.current.x = currentX - lastPointer.current.x;
      pointerVelocity.current.y = currentY - lastPointer.current.y;
      lastPointer.current = { x: currentX, y: currentY };

      pointerPos.current = {
        x: currentX,
        y: currentY,
        active: true,
      };
    };

    const onPointerLeave = () => {
      pointerPos.current.active = false;
    };

    canvas.addEventListener("mousemove", onPointerMove);
    canvas.addEventListener("mouseleave", onPointerLeave);

    // Mathematical Cubic Bézier Point Calculator: B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
    const getBezierPoint = (
      t: number,
      p0: [number, number],
      p1: [number, number],
      p2: [number, number],
      p3: [number, number]
    ): [number, number] => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
      const y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];
      return [x, y];
    };

    // Main Deterministic Animation Loop
    let animationFrameId: number;
    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) * 0.001 * pulseSpeed;
      ctx.clearRect(0, 0, width, height);

      // Draw Terminal Mount Points (Left & Right server rack brackets)
      ctx.fillStyle = "#07172B";
      ctx.strokeStyle = "#00E5FF";
      ctx.lineWidth = 2;

      // Left Terminal Rack
      ctx.fillRect(width * 0.05, height * 0.15, width * 0.03, height * 0.7);
      ctx.strokeRect(width * 0.05, height * 0.15, width * 0.03, height * 0.7);

      // Right Terminal Rack
      ctx.fillRect(width * 0.92, height * 0.15, width * 0.03, height * 0.7);
      ctx.strokeRect(width * 0.92, height * 0.15, width * 0.03, height * 0.7);

      // Render Each Cable
      cables.forEach((cable) => {
        const [x0, y0] = cable.p0;
        const [x3, y3] = cable.p3;
        const dx = x3 - x0;
        const dy = y3 - y0;

        // 1. Natural Catenary Sag modulated by mathematical harmonic sine wave
        // Fundamental harmonic: sin(omega * t)
        const harmonicWave = Math.sin(elapsed * cable.frequency + cable.phase) * (18 * (1.1 - interactiveTension));
        const secondaryHarmonic = Math.cos(elapsed * cable.frequency * 1.8 + cable.phase) * (8 * (1.1 - interactiveTension));
        const totalSag = (cable.baseSag * (1.25 - interactiveTension * 0.5)) + harmonicWave + secondaryHarmonic;

        // 2. Control Points P1 & P2 calculated along cable length
        let cp1x = x0 + dx * 0.33;
        let cp1y = y0 + dy * 0.33 + totalSag;

        let cp2x = x0 + dx * 0.67;
        let cp2y = y0 + dy * 0.67 + totalSag;

        // 3. Pointer-Controlled Mathematical Deformation
        // Calculates Euclidean distance from pointer to curve center and applies Gaussian influence
        if (pointerPos.current.active) {
          const midX = (x0 + x3) * 0.5;
          const midY = (y0 + y3) * 0.5 + totalSag;
          const dist = Math.hypot(pointerPos.current.x - midX, pointerPos.current.y - midY);

          // Gaussian bell curve influence: exp(-dist^2 / (2 * sigma^2))
          const sigma = 180;
          const influence = Math.exp(-(dist * dist) / (2 * sigma * sigma));

          if (influence > 0.01) {
            const offsetY = (pointerPos.current.y - midY) * influence * 0.65;
            const offsetX = (pointerPos.current.x - midX) * influence * 0.25;

            cp1x += offsetX * 0.7;
            cp1y += offsetY;
            cp2x += offsetX * 0.7;
            cp2y += offsetY;
          }
        }

        const p1: [number, number] = [cp1x, cp1y];
        const p2: [number, number] = [cp2x, cp2y];

        // 4. Draw Cable Glow Layer
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], x3, y3);
        ctx.strokeStyle = cable.glowColor;
        ctx.lineWidth = cable.width + 6;
        ctx.shadowColor = cable.color;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.restore();

        // 5. Draw Core Cable Line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], x3, y3);
        ctx.strokeStyle = cable.color;
        ctx.lineWidth = cable.width;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();

        // 6. Terminal Connector Plugs
        ctx.fillStyle = "#00E5FF";
        ctx.beginPath();
        ctx.arc(x0, y0, 5, 0, Math.PI * 2);
        ctx.arc(x3, y3, 5, 0, Math.PI * 2);
        ctx.fill();

        // 7. Animated Data Photons (Traveling Packets)
        cable.dataPackets.forEach((packet) => {
          packet.t = (packet.t + packet.speed * pulseSpeed) % 1.0;
          const [ptX, ptY] = getBezierPoint(packet.t, cable.p0, p1, p2, cable.p3);

          ctx.save();
          ctx.beginPath();
          ctx.arc(ptX, ptY, packet.size, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = cable.color;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.restore();
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onPointerMove);
      canvas.removeEventListener("mouseleave", onPointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pulseSpeed, interactiveTension]);

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
              Spline &amp; Cubic Bézier Trajectories
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-space-grotesk text-white">
            Realistic Cable Movement &amp; Pointer Deformation
          </h3>
          <p className="text-xs text-[#A9B8D0] font-mono">
            Gaussian influence deformation • Parametric photon flow • No physics solvers
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-[#061226]/90 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono">
          <Zap size={14} className="text-[#00E5FF]" />
          <span className="text-white font-bold">4 Active Optical Feeds</span>
        </div>
      </div>

      {/* Interactive Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Interaction Controls */}
      <div className="absolute bottom-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[#061226]/90 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#627694] uppercase text-[10px]">Tension / Sag:</span>
            <input
              type="range"
              min={0.3}
              max={1.0}
              step={0.05}
              value={interactiveTension}
              onChange={(e) => setInteractiveTension(Number(e.target.value))}
              className="w-28 accent-[#00E5FF] bg-white/10 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#627694] uppercase text-[10px]">Wave Speed:</span>
            <input
              type="range"
              min={0.2}
              max={2.5}
              step={0.1}
              value={pulseSpeed}
              onChange={(e) => setPulseSpeed(Number(e.target.value))}
              className="w-28 accent-[#7B2CFF] bg-white/10 rounded-lg cursor-pointer h-1.5"
            />
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#00E5FF] flex items-center gap-1.5">
          <Activity size={13} />
          <span>Move cursor over cables to deform</span>
        </div>
      </div>
    </div>
  );
}

