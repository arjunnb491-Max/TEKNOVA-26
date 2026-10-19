import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { Hero } from '@/components/sections/Hero';
import { FestInfo } from '@/components/sections/FestInfo';
import { Countdown } from '@/components/sections/Countdown';
import { EventCategories } from '@/components/sections/EventCategories';
import { FeaturedEvents } from '@/components/sections/FeaturedEvents';
import { AboutTeknova } from '@/components/sections/AboutTeknova';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { CTA } from '@/components/sections/CTA';
import { Calendar, Clock, MapPin, Mail, Phone, ExternalLink, CheckCircle } from 'lucide-react';
import { OFFICIAL_EVENTS, formatINR } from '@/data/events';

export default function Home() {
  const day1Events = [
    { time: "09:00 AM", title: "IDEATEK (Flagship Ideathon) - Day 1 Commences", venue: "Innovation Hub", type: "Team (2–4)", badge: "Flagship" },
    { time: "10:00 AM", title: "BUG SLAYER - Debugging Contest", venue: "Lab Alpha (MCA)", type: "Individual", badge: "Technical" },
    { time: "10:00 AM", title: "TEKSPHERE - Hardware & Project Exhibition Setup", venue: "Central Courtyard", type: "Showcase", badge: "Exhibition" },
    { time: "11:30 AM", title: "MIRROR MASTERS - Website Replica Challenge", venue: "Web Systems Studio", type: "Team (1–2)", badge: "Technical" },
    { time: "01:30 PM", title: "TEKNOVA E-CLASH - E-Football / PES Tournament", venue: "Gaming Arena", type: "Individual", badge: "Gaming" },
    { time: "All Day", title: "fotonova - Campus Photography Contest", venue: "Campus Grounds", type: "Individual", badge: "Creative" },
  ];

  const day2Events = [
    { time: "09:30 AM", title: "IDEATEK - Prototype Evaluation & Jury Presentation", venue: "Main Auditorium", type: "Team (2–4)", badge: "Flagship" },
    { time: "10:00 AM", title: "TEK ROYALE - PUBG / BGMI Tournament", venue: "E-Sports Hub", type: "Squad (4)", badge: "Gaming" },
    { time: "11:00 AM", title: "TEKTONIQ - Technical Quiz (Prelims & Stage Buzzer)", venue: "Seminar Hall B", type: "Team of 2", badge: "Technical" },
    { time: "02:00 PM", title: "BEAT BLITZ - Spot Dance / Choreography Battles", venue: "Open Air Amphitheatre", type: "Individual", badge: "Cultural" },
    { time: "03:00 PM", title: "CINOVA - Film Fest Screenings & Jury Review", venue: "Mini Theatre", type: "Creative", badge: "Film Fest" },
    { time: "04:30 PM", title: "Grand Valedictory Ceremony & Prize Distribution", venue: "Main Auditorium", type: "All Events", badge: "Awards" },
  ];

  return (
    <div className="min-h-screen bg-[#020713] text-[#A9B8D0] font-sans antialiased selection:bg-[#7B2CFF] selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Fest Core Info Banner */}
        <FestInfo />

        {/* Countdown */}
        <Countdown />

        {/* Featured Contests */}
        <FeaturedEvents />

        {/* Event Disciplines / Categories */}
        <EventCategories />

        {/* Schedule Section */}
        <section id="schedule" className="py-24 bg-[#061226]/60 relative border-t border-white/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2 block">
                Official Itinerary
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-space-grotesk text-white mb-4 uppercase tracking-wider glow-cyan">
                Fest Schedule
              </h2>
              <p className="text-sm text-[#A9B8D0] max-w-xl mx-auto">
                December 2–3, 2026 • Department of MCA, KMM College of Arts and Science, Thrikkakara
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Day 1 */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-[#00E5FF] uppercase font-bold tracking-widest">DAY 01</span>
                    <h3 className="text-2xl font-bold font-space-grotesk text-white">Wednesday, Dec 2, 2026</h3>
                  </div>
                  <div className="px-3 py-1 bg-[#008CFF]/20 border border-[#008CFF]/40 text-[#00E5FF] text-xs font-mono rounded-full">
                    6 Events
                  </div>
                </div>

                <div className="space-y-4">
                  {day1Events.map((evt, i) => (
                    <div key={i} className="p-4 bg-[#07172B]/70 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#00E5FF]/30 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 text-[#00E5FF] border border-[#00E5FF]/20">
                            {evt.badge}
                          </span>
                          <span className="text-xs text-[#A9B8D0] flex items-center gap-1 font-mono">
                            <Clock size={12} className="text-[#00E5FF]" /> {evt.time}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-space-grotesk">{evt.title}</h4>
                        <div className="text-xs text-[#A9B8D0] flex items-center gap-1">
                          <MapPin size={12} className="text-[#008CFF]" /> {evt.venue} • {evt.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day 2 */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-[#B44CFF] uppercase font-bold tracking-widest">DAY 02</span>
                    <h3 className="text-2xl font-bold font-space-grotesk text-white">Thursday, Dec 3, 2026</h3>
                  </div>
                  <div className="px-3 py-1 bg-[#7B2CFF]/20 border border-[#7B2CFF]/40 text-[#B44CFF] text-xs font-mono rounded-full">
                    6 Events
                  </div>
                </div>

                <div className="space-y-4">
                  {day2Events.map((evt, i) => (
                    <div key={i} className="p-4 bg-[#07172B]/70 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#B44CFF]/30 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 text-[#B44CFF] border border-[#7B2CFF]/20">
                            {evt.badge}
                          </span>
                          <span className="text-xs text-[#A9B8D0] flex items-center gap-1 font-mono">
                            <Clock size={12} className="text-[#B44CFF]" /> {evt.time}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-space-grotesk">{evt.title}</h4>
                        <div className="text-xs text-[#A9B8D0] flex items-center gap-1">
                          <MapPin size={12} className="text-[#008CFF]" /> {evt.venue} • {evt.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About TEKNOVA & Department */}
        <AboutTeknova />

        {/* Concept Gallery */}
        <GalleryPreview />

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-[#020713] relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2 block">
                Get in Touch
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-space-grotesk text-white mb-4 uppercase tracking-wider glow-cyan">
                Contact & Location
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-[#008CFF]/10 text-[#00E5FF] flex items-center justify-center mb-4">
                  <MapPin size={24} />
                </div>
                <h3 className="text-lg font-bold text-white font-space-grotesk mb-2">Campus Location</h3>
                <p className="text-xs text-[#A9B8D0] leading-relaxed">
                  KMM College of Arts and Science<br />
                  Thrikkakara, Kochi - 682021<br />
                  Kerala, India
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-[#008CFF]/10 text-[#00E5FF] flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-lg font-bold text-white font-space-grotesk mb-2">Email Queries</h3>
                <p className="text-xs text-[#A9B8D0] leading-relaxed">
                  mca@kmmcollege.edu.in<br />
                  teknova@kmmcollege.edu.in
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-[#008CFF]/10 text-[#00E5FF] flex items-center justify-center mb-4">
                  <Calendar size={24} />
                </div>
                <h3 className="text-lg font-bold text-white font-space-grotesk mb-2">Fest Operations</h3>
                <p className="text-xs text-[#A9B8D0] leading-relaxed">
                  December 2–3, 2026<br />
                  Gates open: 08:30 AM IST<br />
                  Department of MCA
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
