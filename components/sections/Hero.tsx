"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ChevronRight, Calendar, MapPin, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { TOTAL_KNOWN_PRIZE_POOL } from "@/data/events";
import { CyberBackground } from "@/components/animations/CyberBackground";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-20 overflow-hidden bg-[#020713]">
      {/* Cinematic Cyber Background with Particles & Morphing Geometric Forms */}
      <CyberBackground density="medium" showGeometricShapes={true} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Festival Identity & Information with Staggered Entrance */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Department & Institution Branding Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-3 p-1.5 pr-4 rounded-2xl border border-[#00E5FF]/30 bg-[#07172B]/90 backdrop-blur-md shadow-[0_0_20px_rgba(0,140,255,0.15)] hover:border-[#00E5FF]/60 transition-colors">
                <div className="bg-white rounded-xl px-3 py-1 flex items-center justify-center shadow-sm">
                  <Image
                    src="/images/kmm-college-logo.png"
                    alt="KMM College of Arts and Science, Thrikkakara"
                    width={130}
                    height={45}
                    className="h-7 sm:h-8 w-auto object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00E5FF] font-bold text-xs font-mono">Department of MCA</span>
                    <span className="text-white/30 text-xs hidden sm:inline">•</span>
                    <span className="text-[11px] text-[#A9B8D0] font-mono hidden sm:inline">Thrikkakara</span>
                  </div>
                  <span className="text-[10px] text-white/70 font-mono tracking-wider">
                    Approved by AICTE & Govt. of Kerala • M.G. University
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Main Fest Title */}
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-space-grotesk tracking-tight text-white glow-cyan">
                TEKNOVA <span className="text-gradient-cyan">’26</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm font-mono tracking-[0.25em] text-[#00E5FF] uppercase font-bold">
                IDEAS TODAY. A BRIGHTER TOMORROW.
              </p>
            </motion.div>

            {/* Theme & Secondary Tagline */}
            <motion.div variants={itemVariants} className="space-y-2">
              <p className="text-lg sm:text-xl text-[#F5F8FF] font-medium tracking-wide">
                IDEAS • PEOPLE • POSSIBILITIES
              </p>
              <p className="text-sm font-mono text-[#A9B8D0] uppercase tracking-widest">
                MORE THAN JUST TECH
              </p>
            </motion.div>

            {/* Festival Key Metrics Bar */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0"
            >
              <div className="p-3 bg-[#061226]/80 border border-white/5 hover:border-[#00E5FF]/30 transition-colors rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-xs text-[#00E5FF] font-mono mb-1">
                  <Calendar size={13} />
                  <span>DATES</span>
                </div>
                <div className="text-sm font-bold text-white font-space-grotesk">Dec 2–3, 2026</div>
              </div>

              <div className="p-3 bg-[#061226]/80 border border-white/5 hover:border-[#00E5FF]/30 transition-colors rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-xs text-[#00E5FF] font-mono mb-1">
                  <MapPin size={13} />
                  <span>CAMPUS</span>
                </div>
                <div className="text-sm font-bold text-white font-space-grotesk">Thrikkakara</div>
              </div>

              <div className="p-3 bg-[#061226]/80 border border-white/5 hover:border-[#7B2CFF]/30 transition-colors rounded-xl text-left col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-[#00E5FF] font-mono mb-1">
                  <Trophy size={13} />
                  <span>PRIZE POOL</span>
                </div>
                <div className="text-sm font-bold text-[#00E5FF] font-space-grotesk">
                  <AnimatedCounter prefix="₹" value={TOTAL_KNOWN_PRIZE_POOL} suffix="+" duration={1200} />
                </div>
              </div>
            </motion.div>

            {/* Action Buttons with Energy Glow & Cyber Accents */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link
                href="/events"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,140,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>EXPLORE EVENTS</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              
              <Link
                href="/events"
                className="w-full sm:w-auto px-8 py-4 bg-[#07172B]/90 hover:bg-[#07172B] border border-[#00E5FF]/40 hover:border-[#00E5FF] text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)] hover:scale-[1.02] active:scale-[0.98] group"
              >
                <Sparkles size={16} className="text-[#00E5FF] group-hover:rotate-12 transition-transform duration-300" />
                <span>REGISTER NOW</span>
                <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#00E5FF]" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Cyber Visual Showcase with Holographic Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden glass-panel border border-[#00E5FF]/30 shadow-[0_0_50px_rgba(0,140,255,0.25)] hover:shadow-[0_0_70px_rgba(0,229,255,0.35)] hover:border-[#00E5FF]/60 transition-all duration-500 group cyber-bracket">
              <Image
                src="/images/TEKNOVA '26_ Neon Tech Fest.png"
                alt="TEKNOVA '26 Official Fest Poster"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-transparent to-transparent opacity-60"></div>
              
              {/* Subtle top scanline light */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

              {/* Overlay Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#020713]/85 backdrop-blur-md border border-white/10 flex items-center justify-between group-hover:border-[#00E5FF]/30 transition-colors">
                <div>
                  <div className="text-xs font-mono uppercase text-[#00E5FF] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
                    KMM MCA Tech Fest
                  </div>
                  <div className="text-sm font-bold text-white font-space-grotesk">10 Competitions • 2 Days</div>
                </div>
                <div className="px-2.5 py-1 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-mono font-bold rounded">
                  DEC 2–3
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
