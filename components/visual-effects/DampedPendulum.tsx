"use client";

import React, { useEffect, useRef, useState } from "react";
import { Compass, Gauge, RotateCcw, Sparkles } from "lucide-react";

export function DampedPendulum() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentAngleDeg, setCurrentAngleDeg] = useState(0);
  const [decayEnvelope, setDecayEnvelope] = useState(100);
  const [dampingFactor, setDampingFactor] = useState(0.85);
  const [oscillationFreq, setOscillationFreq] = useState(3.4);

  // Closed-form mathematical state
  const isDragging = useRef(false);
  const releaseAngle = useRef(Math.PI * 0.35); // 63 degrees initial
  const releaseTime = useRef(0);
  const currentAngle = useRef(Math.PI * 0.35);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight || 480);

    const pivot = { x: width * 0.5, y: height * 0.16 };
    const armLength = Math.min(width, height) * 0.58;

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight || 480;
      pivot.x = width * 0.5;
      pivot.y = height * 0.16;
    };
    window.addEventListener("resize", handleResize);

    // Trail buffer for arc visualization
    const trailPoints: { x: number; y: number; alpha: number }[] = [];

    // Pointer Event Handlers
    const getPointerPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const pos = getPointerPos(e);
      // Current bob position
      const bobX = pivot.x + Math.sin(currentAngle.current) * armLength;
      const bobY = pivot.y + Math.cos(currentAngle.current) * armLength;

      // Hit test near bob or arm
      const dist = Math.hypot(pos.x - bobX, pos.y - bobY);
      if (dist < 55) {
        isDragging.current = true;
      }
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const pos = getPointerPos(e);
      const dx = pos.x - pivot.x;
      const dy = pos.y - pivot.y;

      // Calculate angle from pivot
      let angle = Math.atan2(dx, dy);
      // Clamp angle to safe limits (-75 deg to +75 deg)
      const maxAngle = Math.PI * 0.42;
      angle = Math.max(-maxAngle, Math.min(maxAngle, angle));

      currentAngle.current = angle;
      releaseAngle.current = angle;
      releaseTime.current = performance.now() * 0.001;
    };

    const onPointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        releaseTime.current = performance.now() * 0.001;
      }
    };

    canvas.addEventListener("mousedown", onPointerDown);
    canvas.addEventListener("touchstart", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);

    // Initial release timestamp
    releaseTime.current = performance.now() * 0.001;

    let animationFrameId: number;

    const render = (timestamp: number) => {
      const nowSec = timestamp * 0.001;
      ctx.clearRect(0, 0, width, height);

      // 1. Calculate Angle Using Pure Analytical Damped Harmonic Oscillation
      // theta(t) = theta_0 * exp(-gamma * deltaT) * cos(omega * deltaT)
      if (!isDragging.current) {
        const deltaT = Math.max(0, nowSec - releaseTime.current);
        const dampingEnvelope = Math.exp(-dampingFactor * deltaT);
        const theta = releaseAngle.current * dampingEnvelope * Math.cos(oscillationFreq * deltaT);

        currentAngle.current = theta;
        setCurrentAngleDeg(Math.round((theta * 180) / Math.PI));
        setDecayEnvelope(Math.round(dampingEnvelope * 100));
      } else {
        setCurrentAngleDeg(Math.round((currentAngle.current * 180) / Math.PI));
        setDecayEnvelope(100);
      }

      // 2. Compute Bob Coordinates
      const angle = currentAngle.current;
      const bobX = pivot.x + Math.sin(angle) * armLength;
      const bobY = pivot.y + Math.cos(angle) * armLength;

      // 3. Add point to trajectory trail
      trailPoints.push({ x: bobX, y: bobY, alpha: 1.0 });
      if (trailPoints.length > 35) {
        trailPoints.shift();
      }

      // 4. Draw Radial Reference Grid & Protractor Arc
      ctx.save();
      ctx.strokeStyle = "rgba(0, 229, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(pivot.x, pivot.y, armLength, Math.PI * 0.5 - Math.PI * 0.42, Math.PI * 0.5 + Math.PI * 0.42);
      ctx.stroke();

      // Center Vertical Equilibrium Axis
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.moveTo(pivot.x, pivot.y);
      ctx.lineTo(pivot.x, pivot.y + armLength + 30);
      ctx.stroke();
      ctx.restore();

      // 5. Draw Fading Trajectory Trail
      for (let i = 0; i < trailPoints.length; i++) {
        const pt = trailPoints[i];
        pt.alpha *= 0.94; // Exponential decay
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${pt.alpha * 0.4})`;
        ctx.shadowColor = "#00E5FF";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // 6. Draw Pendulum Pivot Housing
      ctx.save();
      // Outer Bracket
      ctx.fillStyle = "#07172B";
      ctx.strokeStyle = "#00E5FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pivot.x, pivot.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Center bearing
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(pivot.x, pivot.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. Draw Dual-Color Laser Carbon Rod
      ctx.save();
      const grad = ctx.createLinearGradient(pivot.x, pivot.y, bobX, bobY);
      grad.addColorStop(0, "#00E5FF");
      grad.addColorStop(0.5, "#008CFF");
      grad.addColorStop(1, "#7B2CFF");

      ctx.beginPath();
      ctx.moveTo(pivot.x, pivot.y);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#008CFF";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // 8. Draw Futuristic Pendulum Bob
      ctx.save();
      // Outer Holographic Halo
      ctx.beginPath();
      ctx.arc(bobX, bobY, 26, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(123, 44, 255, 0.25)";
      ctx.strokeStyle = isDragging.current ? "#FFFFFF" : "#00E5FF";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#00E5FF";
      ctx.shadowBlur = isDragging.current ? 25 : 18;
      ctx.fill();
      ctx.stroke();

      // Inner Core
      ctx.beginPath();
      ctx.arc(bobX, bobY, 12, 0, Math.PI * 2);
      ctx.fillStyle = isDragging.current ? "#00E5FF" : "#FFFFFF";
      ctx.shadowColor = "#FFFFFF";
      ctx.shadowBlur = 12;
      ctx.fill();

      // Pulsing Center Ring
      ctx.beginPath();
      ctx.arc(bobX, bobY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#020713";
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onPointerDown);
      canvas.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dampingFactor, oscillationFreq]);

  // Quick preset angle triggers
  const triggerImpulse = (angleDeg: number) => {
    isDragging.current = false;
    releaseAngle.current = (angleDeg * Math.PI) / 180;
    releaseTime.current = performance.now() * 0.001;
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
              Closed-Form Harmonic Oscillation
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-space-grotesk text-white">
            Interactive Damped Pendulum
          </h3>
          <p className="text-xs text-[#A9B8D0] font-mono">
            Analytical equation: θ(t) = θ₀ · e^(−γt) · cos(ωt) • Drag bob to displace
          </p>
        </div>

        {/* Real-Time Mathematical Telemetry Badges */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div className="bg-[#061226]/90 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="text-[#627694]">Current Angle:</span>{" "}
            <span className="text-[#00E5FF] font-bold font-space-grotesk">{currentAngleDeg}°</span>
          </div>
          <div className="bg-[#061226]/90 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="text-[#627694]">Envelope:</span>{" "}
            <span className="text-emerald-400 font-bold">{decayEnvelope}%</span>
          </div>
        </div>
      </div>

      {/* Interactive Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Mathematical Controls Bar */}
      <div className="absolute bottom-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[#061226]/90 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#627694] uppercase text-[10px]">Damping (γ):</span>
            <input
              type="range"
              min={0.2}
              max={2.0}
              step={0.05}
              value={dampingFactor}
              onChange={(e) => setDampingFactor(Number(e.target.value))}
              className="w-24 accent-[#00E5FF] bg-white/10 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#627694] uppercase text-[10px]">Frequency (ω):</span>
            <input
              type="range"
              min={1.5}
              max={6.0}
              step={0.1}
              value={oscillationFreq}
              onChange={(e) => setOscillationFreq(Number(e.target.value))}
              className="w-24 accent-[#7B2CFF] bg-white/10 rounded-lg cursor-pointer h-1.5"
            />
          </div>
        </div>

        {/* Preset displacement impulses */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-[#627694]">Impulse:</span>
          <button
            onClick={() => triggerImpulse(55)}
            className="px-2.5 py-1 bg-[#07172B] hover:bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-[#00E5FF]"
          >
            +55°
          </button>
          <button
            onClick={() => triggerImpulse(-45)}
            className="px-2.5 py-1 bg-[#07172B] hover:bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-[#B44CFF]"
          >
            -45°
          </button>
          <button
            onClick={() => triggerImpulse(70)}
            className="px-2.5 py-1 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] rounded-lg text-[10px] font-mono font-bold"
          >
            Max +70°
          </button>
        </div>
      </div>
    </div>
  );
}

