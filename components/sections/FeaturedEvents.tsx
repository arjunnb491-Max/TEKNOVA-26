import { FEATURED_EVENTS, formatINR } from "@/data/events";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Trophy, Users, User, ArrowRight } from "lucide-react";

export function FeaturedEvents() {
  return (
    <section className="py-24 bg-[#020713] relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2 block">
              Flagship & Major Contests
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-space-grotesk text-white mb-4 glow-cyan uppercase">
              Featured Events
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] rounded-full"></div>
          </div>
          
          <Link
            href="/events"
            className="text-[#00E5FF] hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest text-xs font-mono font-semibold group"
          >
            View All {FEATURED_EVENTS.length} Events
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_EVENTS.slice(0, 6).map((event) => (
            <div
              key={event.id}
              className="glass-panel border border-white/5 rounded-2xl overflow-hidden group hover:border-[#00E5FF]/40 hover:shadow-[0_0_30px_rgba(0,140,255,0.2)] transition-all duration-300 flex flex-col"
            >
              {/* Event Image Banner */}
              <div className="h-48 bg-[#07172B] relative overflow-hidden flex items-center justify-center">
                <Image 
                  src={event.image} 
                  alt={event.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-[#020713]/40 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#020713]/90 backdrop-blur border border-[#00E5FF]/30 text-[#00E5FF] rounded-full">
                    {event.category}
                  </span>
                </div>

                {/* Subcategory / interpretation */}
                <div className="absolute bottom-3 left-4 z-20">
                  <span className="text-xs font-mono text-[#A9B8D0] bg-[#07172B]/80 px-2 py-0.5 rounded">
                    {event.workingInterpretation}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold font-space-grotesk text-white group-hover:text-[#00E5FF] transition-colors">
                    {event.name}
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9B8D0] border border-white/10 px-2 py-0.5 rounded bg-white/5 flex items-center gap-1">
                    {event.participationType === 'team' ? <Users size={12} /> : <User size={12} />}
                    {event.participationType}
                  </span>
                </div>
                
                <p className="text-[#A9B8D0] text-sm mb-6 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                {/* Prize Pool Info */}
                <div className="mb-6 p-3 bg-[#061226] border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#A9B8D0]">
                    <Trophy size={14} className="text-[#00E5FF]" />
                    <span>PRIZE POOL</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#00E5FF]">
                    {event.prizePoolSubtotal > 0 ? formatINR(event.prizePoolSubtotal) : (event.prizeNote || 'TBA')}
                  </div>
                </div>
                
                <div className="mt-auto flex gap-3">
                  <Link
                    href={`/events/${event.slug}`}
                    className="flex-1 text-center py-2.5 border border-white/10 rounded-xl font-semibold text-xs text-white uppercase tracking-wider hover:bg-white/5 hover:border-white/20 transition-all"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/events/${event.slug}/register`}
                    className="flex-1 text-center py-2.5 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,140,255,0.3)] flex items-center justify-center gap-1"
                  >
                    Register <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
