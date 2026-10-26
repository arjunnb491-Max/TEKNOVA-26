"use client";

import { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function Countdown() {
  // Fest Start Date: December 2, 2026 09:00 AM IST
  const targetDate = new Date("2026-12-02T09:00:00+05:30").getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const timeBlocks = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 relative overflow-hidden flex justify-center bg-[#020713]">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7B2CFF]/5 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <ScrollReveal direction="up" className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2 block flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
            Fest Countdown
          </span>
          <h2 className="text-2xl md:text-3xl font-mono text-white tracking-[0.3em] uppercase glow-cyan">
            Commencement In
          </h2>
        </ScrollReveal>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {timeBlocks.map((block, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.08} direction="up" className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 glass-panel border border-[#00E5FF]/30 rounded-2xl flex items-center justify-center relative overflow-hidden group mb-4 shadow-[0_0_25px_rgba(0,140,255,0.18)] hover:border-[#00E5FF]/70 hover:shadow-[0_0_35px_rgba(0,229,255,0.35)] transition-all duration-300 cyber-bracket">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="text-4xl md:text-6xl font-black font-space-grotesk text-white glow-cyan z-10 tracking-tight">
                  {block.value.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs md:text-sm font-mono tracking-[0.2em] text-[#A9B8D0]">
                {block.label}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
