import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { formatINR, TOTAL_KNOWN_PRIZE_POOL, OFFICIAL_EVENTS } from "@/data/events";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden flex items-center justify-center bg-[#020713]">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-grid opacity-25"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[#008CFF]/10 rounded-full blur-[140px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="glass-panel-elevated p-10 md:p-16 rounded-3xl border border-[#00E5FF]/30 max-w-4xl mx-auto relative overflow-hidden shadow-[0_0_50px_rgba(0,140,255,0.2)]">
          {/* Top highlight glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#00E5FF]/20 to-transparent blur-2xl pointer-events-none"></div>
          
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-3 block">
            December 2–3, 2026 • KMM College, Thrikkakara
          </span>

          <h2 className="text-3xl md:text-5xl font-black font-space-grotesk text-white mb-6 tracking-tight uppercase relative z-10 glow-cyan">
            Step Into <span className="text-gradient-cyan">TEKNOVA ’26</span>
          </h2>
          
          <p className="text-base md:text-lg text-[#A9B8D0] mb-8 max-w-2xl mx-auto leading-relaxed relative z-10">
            Compete across {OFFICIAL_EVENTS.length} official tournaments for a total published prize pool of <strong className="text-white font-mono">{formatINR(TOTAL_KNOWN_PRIZE_POOL)}+</strong>. No participant account required to register.
          </p>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(0,140,255,0.4)] flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              REGISTER FOR EVENTS <ArrowRight size={16} />
            </Link>
            <Link
              href="/lookup"
              className="w-full sm:w-auto px-8 py-4 bg-[#07172B] hover:bg-[#061226] border border-white/10 hover:border-[#00E5FF]/40 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              LOOKUP MY REGISTRATION
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
