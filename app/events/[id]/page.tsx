import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { resolveEventByIdOrSlug, formatINR } from '@/data/events';
import { Calendar, Clock, MapPin, Users, User, ChevronRight, Trophy, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default async function EventDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = resolveEventByIdOrSlug(resolvedParams.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#020713] text-[#A9B8D0] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex text-xs font-mono text-[#A9B8D0] mb-8 items-center gap-2">
            <Link href="/" className="hover:text-[#00E5FF] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/events" className="hover:text-[#00E5FF] transition-colors">Events</Link>
            <ChevronRight size={12} />
            <span className="text-[#00E5FF] font-bold">{event.name}</span>
          </nav>

          <div className="glass-panel rounded-3xl overflow-hidden border border-white/15 shadow-2xl cyber-bracket relative">
            {/* Top Cyber Scanline */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-80 z-30" />

            {/* Banner Header Image */}
            <div className="h-64 sm:h-80 bg-[#07172B] w-full relative overflow-hidden group">
              <Image 
                src={event.image}
                alt={event.name}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-[#020713]/50 to-transparent"></div>
              
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                <span className="px-3.5 py-1 bg-[#020713]/90 backdrop-blur-md text-[#00E5FF] text-xs font-mono font-bold rounded-full border border-[#00E5FF]/40 uppercase tracking-widest">
                  {event.category} • {event.workingInterpretation}
                </span>
                <span className="px-3 py-1 bg-[#07172B]/90 backdrop-blur-md text-white text-xs font-mono rounded-lg border border-white/10 flex items-center gap-1.5">
                  {event.participationType === 'team' ? <Users size={13} className="text-[#00E5FF]" /> : <User size={13} className="text-[#00E5FF]" />}
                  {event.participationType === 'team' ? `Team Event (${event.teamSize ? `${event.teamSize.min}–${event.teamSize.max} members` : 'Team'})` : 'Individual Contest'}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl sm:text-5xl font-black font-space-grotesk text-white glow-cyan tracking-tight">
                  {event.name}
                </h1>
                <p className="text-xs sm:text-sm font-mono text-[#00E5FF] mt-1 tracking-wider uppercase">
                  TEKNOVA ’26 Official Contest • Department of MCA
                </p>
              </div>
            </div>
            
            <div className="p-6 sm:p-10 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Main Details (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Event Overview */}
                  <div>
                    <h2 className="text-lg font-bold font-space-grotesk text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText size={18} className="text-[#00E5FF]" /> Event Overview
                    </h2>
                    <p className="text-base text-[#F5F8FF] leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Rules & Regulations */}
                  <div className="p-6 bg-[#061226] border border-white/5 rounded-2xl">
                    <h2 className="text-lg font-bold font-space-grotesk text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#00E5FF]" /> Official Rules & Guidelines
                    </h2>
                    <ul className="space-y-3 text-sm text-[#A9B8D0]">
                      {event.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-[#00E5FF] mt-0.5 shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Event Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#07172B] border border-white/5 rounded-xl">
                      <div className="text-xs font-mono text-[#00E5FF] mb-1 flex items-center gap-1.5">
                        <Calendar size={13} /> DATE
                      </div>
                      <div className="text-sm font-bold text-white font-space-grotesk">{event.date}</div>
                    </div>

                    <div className="p-4 bg-[#07172B] border border-white/5 rounded-xl">
                      <div className="text-xs font-mono text-[#00E5FF] mb-1 flex items-center gap-1.5">
                        <Clock size={13} /> COMMENCEMENT
                      </div>
                      <div className="text-sm font-bold text-white font-space-grotesk">{event.time}</div>
                    </div>

                    <div className="p-4 bg-[#07172B] border border-white/5 rounded-xl col-span-2 sm:col-span-1">
                      <div className="text-xs font-mono text-[#00E5FF] mb-1 flex items-center gap-1.5">
                        <MapPin size={13} /> VENUE
                      </div>
                      <div className="text-sm font-bold text-white font-space-grotesk">{event.venue}</div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar: Prize Pool & Registration Card (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Prize Card */}
                  <div className="glass-panel p-6 rounded-2xl border border-[#00E5FF]/20 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] font-bold uppercase tracking-wider">
                        <Trophy size={16} /> Prize Structure
                      </div>
                      <span className="text-[10px] font-mono text-[#A9B8D0]">INR (₹)</span>
                    </div>

                    {event.prizes.length > 0 ? (
                      <div className="space-y-3">
                        {event.prizes.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-[#061226] border border-white/5 rounded-xl">
                            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                              {p.position} Prize
                            </span>
                            <span className="text-base font-extrabold font-mono text-[#00E5FF]">
                              {formatINR(p.amount)}
                            </span>
                          </div>
                        ))}
                        <div className="pt-2 flex justify-between items-center text-xs font-mono text-[#A9B8D0]">
                          <span>Published Total:</span>
                          <span className="font-bold text-white">{formatINR(event.prizePoolSubtotal)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#061226] rounded-xl border border-white/5 text-center">
                        <p className="text-xs text-[#00E5FF] font-mono">
                          {event.prizeNote || "Prize details to be announced"}
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link 
                        href={`/events/${event.slug}/register`}
                        className="w-full py-4 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl text-center font-bold text-xs font-mono uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] group energy-pulse"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Register For Contest <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                        </span>
                      </Link>
                    </div>

                    <p className="text-[11px] text-center text-[#A9B8D0] pt-1">
                      No account creation required. Instant printable registration receipt.
                    </p>
                  </div>

                  {/* Department Support Box */}
                  <div className="p-5 bg-[#061226] border border-white/5 rounded-2xl text-xs text-[#A9B8D0] space-y-2">
                    <div className="font-bold text-white font-space-grotesk uppercase tracking-wider">
                      Department of MCA Support
                    </div>
                    <p>Have questions regarding rules or eligibility? Reach out to coordinator desk on fest day.</p>
                    <div className="text-[#00E5FF] font-mono text-[11px]">Venue: KMM College, Thrikkakara</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
