import { FEATURED_EVENTS } from "@/data/events";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function FeaturedEvents() {
  return (
    <section className="py-24 bg-[#020713] relative overflow-hidden">
      {/* Background cyber ambiance */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#008CFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-[#7B2CFF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollReveal direction="up" className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2 block flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
              Flagship & Major Contests
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-space-grotesk text-white mb-4 glow-cyan uppercase">
              Featured Events
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] rounded-full"></div>
          </div>
          
          <Link
            href="/events"
            className="text-[#00E5FF] hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest text-xs font-mono font-semibold group p-2 rounded-xl hover:bg-white/5"
          >
            <span>View All {FEATURED_EVENTS.length} Events</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_EVENTS.slice(0, 6).map((event, idx) => (
            <EventCard key={event.id} event={event} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
