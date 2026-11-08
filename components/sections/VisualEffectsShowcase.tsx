"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { 
  Layers, 
  Rotate3d, 
  Activity, 
  Type, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Info 
} from "lucide-react";

// Dynamic imports with ssr: false to ensure client-only WebGL & canvas rendering
const Scroll3DAssembly = dynamic(
  () => import("@/components/visual-effects/Scroll3DAssembly").then((mod) => mod.Scroll3DAssembly),
  { ssr: false, loading: () => <EffectLoadingPlaceholder title="Scroll-Controlled 3D Assembly" /> }
);

const ExplodedAssembly = dynamic(
  () => import("@/components/visual-effects/ExplodedAssembly").then((mod) => mod.ExplodedAssembly),
  { ssr: false, loading: () => <EffectLoadingPlaceholder title="Exploded-to-Assembled Transformation" /> }
);

const RealisticCableMovement = dynamic(
  () => import("@/components/visual-effects/RealisticCableMovement").then((mod) => mod.RealisticCableMovement),
  { ssr: false, loading: () => <EffectLoadingPlaceholder title="Realistic Cable Movement" /> }
);

const ObjectToTypographyMorph = dynamic(
  () => import("@/components/visual-effects/ObjectToTypographyMorph").then((mod) => mod.ObjectToTypographyMorph),
  { ssr: false, loading: () => <EffectLoadingPlaceholder title="3D Object-to-Typography Morph" /> }
);

const DampedPendulum = dynamic(
  () => import("@/components/visual-effects/DampedPendulum").then((mod) => mod.DampedPendulum),
  { ssr: false, loading: () => <EffectLoadingPlaceholder title="Interactive Damped Pendulum" /> }
);

function EffectLoadingPlaceholder({ title }: { title: string }) {
  return (
    <div className="w-full h-[520px] rounded-3xl bg-[#030917] border border-white/5 flex flex-col items-center justify-center gap-3 font-mono text-xs text-[#627694]">
      <div className="w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
      <span>Initializing {title}...</span>
    </div>
  );
}

export function VisualEffectsShowcase() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const effects = [
    {
      id: "scroll-3d",
      title: "Scroll-Controlled 3D Assembly",
      subtitle: "GSAP ScrollTrigger • 3D Component Stream",
      icon: Layers,
      color: "#00E5FF",
      mathSpec: "Deterministic vector lerp: P(t) = P_start * (1-t) + P_end * t, scrubbed strictly against viewport scroll delta.",
      component: <Scroll3DAssembly />,
    },
    {
      id: "exploded-assembly",
      title: "Exploded-to-Assembled Transformation",
      subtitle: "Fixed Matrix Transforms • Hardware Layers",
      icon: Rotate3d,
      color: "#7B2CFF",
      mathSpec: "Defined fixed exploded & assembled transforms (R, T, S); smooth power2.inOut polynomial interpolation.",
      component: <ExplodedAssembly />,
    },
    {
      id: "cable-movement",
      title: "Realistic Cable Movement",
      subtitle: "Animated Bézier Splines • Pointer Deformation",
      icon: Activity,
      color: "#008CFF",
      mathSpec: "Cubic Bézier B(t) + harmonic catenary wave y_sag + pointer Gaussian kernel deformation exp(-dist² / 2σ²).",
      component: <RealisticCableMovement />,
    },
    {
      id: "object-morph",
      title: "3D Object-to-Typography Morph",
      subtitle: "2,200 Node Lattice • Closed-Form Transit",
      icon: Type,
      color: "#00E5FF",
      mathSpec: "Point-cloud Fibonacci 3D geosphere mapped to rasterized typography coordinates with sin(πt) transit vortex.",
      component: <ObjectToTypographyMorph />,
    },
    {
      id: "damped-pendulum",
      title: "Interactive Damped Pendulum",
      subtitle: "Closed-Form Harmonic Oscillation • Zero Physics",
      icon: Compass,
      color: "#B44CFF",
      mathSpec: "Exact analytical solution: θ(t) = θ₀ · exp(-γt) · cos(ωt). No physical forces, mass, or physics engine.",
      component: <DampedPendulum />,
    },
  ];

  const currentEffect = effects[activeTab];

  return (
    <section id="visual-engine" className="py-24 bg-[#020713] relative overflow-hidden border-t border-white/5">
      {/* Background Cyber Glow */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#008CFF]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#7B2CFF]/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07172B] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] mb-3">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Deterministic Mathematical Animation Engine</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold font-space-grotesk text-white mb-4 uppercase tracking-wider glow-cyan">
            Interactive <span className="text-gradient-cyan">Visual Effects</span> Suite
          </h2>

          <p className="text-sm md:text-base text-[#A9B8D0] max-w-3xl mx-auto leading-relaxed">
            Five interactive visual effects built strictly with timeline-based animations, GSAP ScrollTrigger, cubic Bézier splines, and mathematical interpolation — with <strong className="text-white">zero physics simulations</strong> or solvers.
          </p>
        </ScrollReveal>

        {/* Effect Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-8">
          {effects.map((eff, idx) => {
            const Icon = eff.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={eff.id}
                onClick={() => setActiveTab(idx)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between h-28 group relative overflow-hidden ${
                  isActive
                    ? "bg-[#07172B] border-[#00E5FF] shadow-[0_0_25px_rgba(0,140,255,0.25)]"
                    : "bg-[#061226]/60 border-white/5 hover:border-white/20 text-[#627694]"
                }`}
              >
                {/* Active top line */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#008CFF] to-[#00E5FF]" />
                )}

                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive ? "bg-[#00E5FF]/20 text-[#00E5FF]" : "bg-white/5 text-[#A9B8D0] group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-mono text-[#627694]">0{idx + 1}</span>
                </div>

                <div>
                  <div className={`text-xs font-bold font-space-grotesk truncate ${isActive ? "text-white" : "text-[#A9B8D0]"}`}>
                    {eff.title}
                  </div>
                  <div className="text-[9px] font-mono text-[#627694] truncate">
                    {eff.subtitle.split("•")[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Effect Canvas Viewport */}
        <div className="mb-6">{currentEffect.component}</div>

        {/* Technical Architecture & Constraint Compliance Card */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#008CFF]/15 text-[#00E5FF] border border-[#00E5FF]/30 shrink-0">
              <Info size={18} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                Mathematical Model &amp; Compliance Specification:
              </div>
              <p className="text-xs font-mono text-[#A9B8D0] mt-1 leading-relaxed">
                {currentEffect.mathSpec}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
              <ShieldCheck size={14} /> Zero Physics Guaranteed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

