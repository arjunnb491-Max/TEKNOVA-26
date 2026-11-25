import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { resolveEventByIdOrSlug, formatINR } from '@/data/events';
import { getEventRegistrationUrl } from '@/data/registration-links';
import { Calendar, Clock, MapPin, Users, User, ChevronRight, Trophy, ArrowRight, ShieldCheck, FileText, CheckCircle2, Sparkles, ListChecks } from 'lucide-react';

export default async function EventDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = resolveEventByIdOrSlug(resolvedParams.id);

  if (!event) {
    notFound();
  }

  const registrationUrl = getEventRegistrationUrl(event.slug) || getEventRegistrationUrl(event.id);

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
            <div className="relative bg-[#07172B] w-full overflow-hidden group min-h-[300px]">
              {/* Ambient atmospheric backdrop */}
              <div className="absolute inset-0">
                <Image 
                  src={event.image.replace('/thumbnails/', '/banners/')}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover blur-2xl opacity-25 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-[#020713]/60 to-[#020713]/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020713] via-transparent to-[#020713]/80" />
              </div>

              {/* Main Content: Split layout with Left Title/Badges + Right Full Uncropped Poster in Correct Ratio */}
              <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left: Text & Badges */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1 bg-[#020713]/90 backdrop-blur-md text-[#00E5FF] text-xs font-mono font-bold rounded-full border border-[#00E5FF]/40 uppercase tracking-widest shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                      {event.category} • {event.workingInterpretation}
                    </span>
                    <span className="px-3 py-1 bg-[#07172B]/90 backdrop-blur-md text-white text-xs font-mono rounded-lg border border-white/10 flex items-center gap-1.5">
                      {event.participationType === 'team' ? <Users size={13} className="text-[#00E5FF]" /> : <User size={13} className="text-[#00E5FF]" />}
                      {event.participationType === 'team' ? `Team Event (${event.teamSize ? `${event.teamSize.min}–${event.teamSize.max} members` : 'Team'})` : 'Individual Contest'}
                    </span>
                  </div>

                  <div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-space-grotesk text-white glow-cyan tracking-tight">
                      {event.name}
                    </h1>
                    <p className="text-xs sm:text-sm font-mono text-[#00E5FF] mt-2 tracking-wider uppercase">
                      TEKNOVA ’26 Official Contest • Department of MCA
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-[#A9B8D0] leading-relaxed max-w-2xl pt-1">
                    {event.description}
                  </p>
                </div>

                {/* Right: Crisp, Perfectly Proportioned Poster (Preserves Exact 723:1024 Aspect Ratio, Zero Cropping) */}
                <div className="relative w-48 sm:w-56 md:w-64 aspect-[723/1024] rounded-2xl overflow-hidden glass-panel border border-[#00E5FF]/40 shadow-[0_0_35px_rgba(0,140,255,0.35)] hover:shadow-[0_0_55px_rgba(0,229,255,0.5)] hover:border-[#00E5FF]/80 transition-all duration-500 shrink-0 group/poster">
                  <Image
                    src={event.image.replace('/thumbnails/', '/banners/')}
                    alt={`${event.name} Official Tournament Poster`}
                    fill
                    priority
                    sizes="(max-width: 768px) 220px, 260px"
                    className="object-contain object-center group-hover/poster:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-60" />
                </div>
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

                  {/* Rules & Guidelines Container */}
                  {event.guidelinesAndChecklist ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-[#061226] border border-[#00E5FF]/20 rounded-2xl shadow-xl space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] block mb-1">
                              Official Tournament Protocol
                            </span>
                            <h2 className="text-lg font-bold font-space-grotesk text-white uppercase tracking-wider flex items-center gap-2">
                              <ListChecks size={20} className="text-[#00E5FF]" /> {event.name} — RULES &amp; GUIDELINES
                            </h2>
                          </div>
                          <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-bold">
                            Verified Protocol
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {event.guidelinesAndChecklist.sections.map((section, sIdx) => (
                            <div key={sIdx} className="p-5 bg-[#07172B] rounded-xl border border-white/5 space-y-3 hover:border-[#00E5FF]/30 transition-colors">
                              <h3 className="text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-white/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
                                {section.title}
                              </h3>
                              <ul className="space-y-2.5 text-xs text-[#A9B8D0]">
                                {section.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="flex items-start gap-2.5">
                                    <CheckCircle2 size={14} className="text-[#00E5FF] mt-0.5 shrink-0" />
                                    <span className="leading-relaxed text-white/90">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* General Rules & Regulations */}
                        {event.rules.length > 0 && (
                          <div className="p-5 bg-[#07172B]/60 rounded-xl border border-white/5 space-y-3">
                            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                              <ShieldCheck size={14} className="text-[#00E5FF]" /> General Rules &amp; Regulations
                            </h3>
                            <ul className="space-y-2.5 text-xs text-[#A9B8D0]">
                              {event.rules.map((rule, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                  <span className="text-[#00E5FF] font-mono font-bold shrink-0">{idx + 1}.</span>
                                  <span className="leading-relaxed text-white/85">{rule}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {event.guidelinesAndChecklist.importantReminder && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-[#008CFF]/15 via-[#7B2CFF]/15 to-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-start gap-3">
                            <Sparkles size={18} className="text-[#00E5FF] mt-0.5 shrink-0" />
                            <div>
                              <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#00E5FF] mb-1">
                                OFFICIAL MOTTO &amp; REMINDER
                              </div>
                              <p className="text-xs text-white leading-relaxed font-sans font-medium">
                                {event.guidelinesAndChecklist.importantReminder}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Standard Rules List for Other Contests */
                    <div className="p-6 bg-[#061226] border border-white/5 rounded-2xl">
                      <h2 className="text-lg font-bold font-space-grotesk text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[#00E5FF]" /> Official Rules &amp; Guidelines
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
                  )}

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

                    {event.registrationFee !== null && (
                      <div className="flex justify-between items-center p-3 bg-[#07172B] border border-[#00E5FF]/20 rounded-xl">
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          Registration Fee
                        </span>
                        <span className="text-sm font-extrabold font-mono text-[#00E5FF]">
                          ₹{event.registrationFee} <span className="text-[10px] text-[#A9B8D0] font-normal">/ participant</span>
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      {registrationUrl ? (
                        <a 
                          href={registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl text-center font-bold text-xs font-mono uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] group energy-pulse"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Register For Contest <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                          </span>
                        </a>
                      ) : (
                        <div className="w-full py-4 bg-white/5 text-[#A9B8D0]/50 rounded-xl text-center font-bold text-xs font-mono uppercase tracking-widest cursor-not-allowed">
                          Registration Pending
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-center text-[#A9B8D0] pt-1">
                      Official Google Forms registration. Opens in a secure new tab.
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
