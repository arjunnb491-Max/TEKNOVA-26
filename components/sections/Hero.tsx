import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Calendar, MapPin, Sparkles, Trophy, Award } from "lucide-react";
import { formatINR, TOTAL_KNOWN_PRIZE_POOL } from "@/data/events";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-20 overflow-hidden bg-[#020713]">
      {/* Background digital grid & ambient lighting */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>
      
      {/* Neon energy orbs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#008CFF]/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-32 -translate-y-1/2 w-[650px] h-[650px] bg-[#7B2CFF]/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Festival Identity & Information */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Department & Institution Badge */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 px-3.5 py-1.5 rounded-full border border-[#00E5FF]/30 bg-[#07172B]/80 backdrop-blur-md text-xs font-mono">
              <span className="text-[#00E5FF] font-bold">KMM College of Arts and Science, Thrikkakara</span>
              <span className="text-white/30">•</span>
              <span className="text-[#A9B8D0]">Department of MCA</span>
            </div>

            {/* Main Fest Title */}
            <div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-space-grotesk tracking-tight text-white glow-cyan">
                TEKNOVA <span className="text-gradient-cyan">’26</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm font-mono tracking-[0.25em] text-[#00E5FF] uppercase font-bold">
                IDEAS TODAY. A BRIGHTER TOMORROW.
              </p>
            </div>

            {/* Theme & Secondary Tagline */}
            <div className="space-y-2">
              <p className="text-lg sm:text-xl text-[#F5F8FF] font-medium tracking-wide">
                IDEAS • PEOPLE • POSSIBILITIES
              </p>
              <p className="text-sm font-mono text-[#A9B8D0] uppercase tracking-widest">
                MORE THAN JUST TECH
              </p>
            </div>

            {/* Festival Key Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="p-3 bg-[#061226]/80 border border-white/5 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-xs text-[#00E5FF] font-mono mb-1">
                  <Calendar size={13} />
                  <span>DATES</span>
                </div>
                <div className="text-sm font-bold text-white font-space-grotesk">Dec 2–3, 2026</div>
              </div>

              <div className="p-3 bg-[#061226]/80 border border-white/5 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-xs text-[#00E5FF] font-mono mb-1">
                  <MapPin size={13} />
                  <span>CAMPUS</span>
                </div>
                <div className="text-sm font-bold text-white font-space-grotesk">Thrikkakara</div>
              </div>

              <div className="p-3 bg-[#061226]/80 border border-white/5 rounded-xl text-left col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-[#00E5FF] font-mono mb-1">
                  <Trophy size={13} />
                  <span>PRIZE POOL</span>
                </div>
                <div className="text-sm font-bold text-[#00E5FF] font-space-grotesk">
                  {formatINR(TOTAL_KNOWN_PRIZE_POOL)}+
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/events"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,140,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2 group"
              >
                EXPLORE EVENTS
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/events"
                className="w-full sm:w-auto px-8 py-4 bg-[#07172B]/80 hover:bg-[#07172B] border border-[#00E5FF]/40 hover:border-[#00E5FF] text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} className="text-[#00E5FF]" />
                REGISTER NOW
              </Link>
            </div>
          </div>

          {/* Right Column: Authentic Festival Poster / Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden glass-panel border border-[#00E5FF]/30 shadow-[0_0_40px_rgba(0,140,255,0.25)] group">
              <Image
                src="/images/TEKNOVA '26_ Neon Tech Fest.png"
                alt="TEKNOVA '26 Official Fest Poster"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-transparent to-transparent opacity-60"></div>
              
              {/* Overlay Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#020713]/85 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono uppercase text-[#00E5FF]">KMM MCA Tech Fest</div>
                  <div className="text-sm font-bold text-white font-space-grotesk">10 Competitions • 2 Days</div>
                </div>
                <div className="px-2.5 py-1 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-mono font-bold rounded">
                  DEC 2–3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
