"use client";

import React, { useEffect, useRef } from "react";

interface CyberBackgroundProps {
  density?: "low" | "medium" | "high";
  showGeometricShapes?: boolean;
}

export function CyberBackground({ 
  density = "medium", 
  showGeometricShapes = true 
}: CyberBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Adjust particle count based on screen size and density
    const isMobile = width < 768;
    const baseCount = isMobile ? 18 : density === "high" ? 45 : density === "low" ? 20 : 32;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
    }

    const colors = [
      "rgba(0, 229, 255, ", // Neon Cyan
      "rgba(0, 140, 255, ", // Electric Blue
      "rgba(123, 44, 255, ", // Vivid Violet
      "rgba(180, 76, 255, "  // Neon Purple
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < baseCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let angle = 0;
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      angle += 0.01;

      // Draw subtle connection links between nearby particles
      const maxDistance = isMobile ? 90 : 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const linkAlpha = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${linkAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle alpha breathing
        const currentAlpha = p.alpha + Math.sin(angle * p.pulseSpeed * 20) * 0.15;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.max(0.05, Math.min(0.8, currentAlpha)) + ")";
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color + "0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [density]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Morphing geometric SVG shapes in background */}
      {showGeometricShapes && (
        <div className="absolute inset-0 overflow-hidden opacity-40">
          {/* Cyan Morphing Blob */}
          <div 
            className="absolute -top-24 -left-24 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-[#008CFF]/20 to-[#00E5FF]/25 blur-[90px] rounded-full pointer-events-none"
            style={{ animation: "morphSlow 18s ease-in-out infinite alternate" }}
          />

          {/* Violet Morphing Blob */}
          <div 
            className="absolute top-1/3 -right-24 w-96 h-96 sm:w-[550px] sm:h-[550px] bg-gradient-to-bl from-[#7B2CFF]/20 to-[#B44CFF]/25 blur-[100px] rounded-full pointer-events-none"
            style={{ animation: "morphSlow 22s ease-in-out infinite alternate-reverse" }}
          />

          {/* Deep Navy/Cyan Accent Blob */}
          <div 
            className="absolute -bottom-24 left-1/4 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-r from-[#00E5FF]/15 to-[#07172B]/30 blur-[80px] rounded-full pointer-events-none"
            style={{ animation: "morphSlow 26s ease-in-out infinite alternate" }}
          />

          {/* Futuristic Cyber Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cyber-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#00E5FF" fillOpacity="0.4" />
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(0, 229, 255, 0.08)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cyber-grid)" />
          </svg>
        </div>
      )}

      {/* Dynamic Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none" 
      />
    </div>
  );
}
