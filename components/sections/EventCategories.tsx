import { CATEGORIES } from "@/data/events";
import { Cpu, Music, Sparkles, Gamepad2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-10 h-10 text-[#00E5FF]" />,
  Gamepad2: <Gamepad2 className="w-10 h-10 text-[#008CFF]" />,
  Sparkles: <Sparkles className="w-10 h-10 text-[#B44CFF]" />,
  Music: <Music className="w-10 h-10 text-[#7B2CFF]" />,
};

export function EventCategories() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#061226]/50">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollReveal direction="up" className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2 block flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
            Competitive Disciplines
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-space-grotesk text-white mb-4 glow-cyan uppercase">
            Event Categories
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#008CFF] via-[#00E5FF] to-[#7B2CFF] mx-auto rounded-full"></div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => (
            <ScrollReveal
              key={category.id}
              delay={index * 0.08}
              direction="up"
              className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-[#00E5FF]/50 hover:shadow-[0_0_35px_rgba(0,229,255,0.2)] transition-all duration-300 group relative overflow-hidden flex flex-col cyber-bracket"
            >
              {/* Abstract background glow */}
              <div className="absolute -right-10 -top-10 w-36 h-36 bg-[#008CFF]/10 rounded-full blur-2xl group-hover:bg-[#00E5FF]/20 transition-all duration-500"></div>
              
              <div className="mb-6 bg-white/5 inline-flex p-4 rounded-xl border border-white/5 group-hover:scale-110 group-hover:bg-[#00E5FF]/10 transition-all duration-300 self-start">
                {iconMap[category.iconName] || <Cpu className="w-10 h-10 text-[#00E5FF]" />}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 font-space-grotesk tracking-wide group-hover:text-[#00E5FF] transition-colors">
                {category.name}
              </h3>
              
              <p className="text-sm text-[#A9B8D0] mb-8 flex-grow leading-relaxed">
                {category.description}
              </p>
              
              <Link
                href={`/events?category=${category.id}`}
                className="inline-flex items-center gap-2 text-white font-semibold uppercase tracking-wider text-xs group/btn mt-auto"
              >
                <span className="relative z-10 text-[#00E5FF] group-hover:text-white transition-colors">Explore Category</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform text-[#00E5FF]" />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
