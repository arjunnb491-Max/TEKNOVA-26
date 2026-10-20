import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Award, Users, Lightbulb, Compass } from "lucide-react";

export function AboutTeknova() {
  const pillars = [
    {
      icon: <Lightbulb className="w-5 h-5 text-[#00E5FF]" />,
      title: "IDEAS",
      desc: "Challenging conventional boundaries through flagship Ideathons, coding relays, and web design."
    },
    {
      icon: <Users className="w-5 h-5 text-[#008CFF]" />,
      title: "PEOPLE",
      desc: "Uniting collegiate innovators, developers, gamers, and artists across institutions."
    },
    {
      icon: <Compass className="w-5 h-5 text-[#B44CFF]" />,
      title: "POSSIBILITIES",
      desc: "Creating avenues for industry visibility, skill elevation, and technology leadership."
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#061226]/40">
      {/* Background neon ambient blur */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#008CFF]/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Visual Showcase Card */}
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] max-w-lg mx-auto glass-panel rounded-3xl border border-[#00E5FF]/20 p-2 relative overflow-hidden group shadow-[0_0_35px_rgba(0,140,255,0.2)]">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/TEKNOVA_26_525x328.jpg"
                  alt="KMM College MCA Department TEKNOVA"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-transparent to-transparent opacity-70"></div>
                
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#020713]/90 backdrop-blur-md border border-white/10 flex items-center gap-3">
                  <div className="bg-white rounded-lg p-1.5 shrink-0 shadow-sm">
                    <Image
                      src="/images/kmm-college-logo.png"
                      alt="KMM College of Arts and Science"
                      width={105}
                      height={38}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#00E5FF] uppercase font-bold">Department of MCA</div>
                    <div className="text-sm font-bold text-white font-space-grotesk">KMM College of Arts and Science</div>
                    <div className="text-[10px] text-[#A9B8D0]">Approved by AICTE & Govt. of Kerala • M.G. University</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Description */}
          <div className="flex-1 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] block mb-2">
                The Festival Genesis
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-space-grotesk text-white uppercase tracking-tight glow-cyan">
                About <span className="text-gradient-cyan">TEKNOVA ’26</span>
              </h2>
            </div>
            
            <div className="space-y-4 text-base text-[#A9B8D0] leading-relaxed">
              <p>
                Organized by the <strong className="text-white">Department of MCA</strong> at <strong className="text-white">KMM College of Arts and Science, Thrikkakara</strong>, TEKNOVA ’26 is an intercollegiate technical and cultural symposium taking place on <strong className="text-[#00E5FF]">December 2–3, 2026</strong>.
              </p>
              <p>
                Guided by the theme <strong className="text-[#F5F8FF]">“IDEAS • PEOPLE • POSSIBILITIES”</strong> and the vision <strong className="text-[#00E5FF]">“IDEAS TODAY. A BRIGHTER TOMORROW”</strong>, TEKNOVA is designed to be <strong className="text-[#B44CFF]">“MORE THAN JUST TECH”</strong>. It connects brilliant minds across Kerala in a crucible of competitive rigor, creative expression, and collaborative synergy.
              </p>
            </div>

            {/* Three Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {pillars.map((p, idx) => (
                <div key={idx} className="p-3.5 bg-[#07172B] border border-white/5 rounded-xl">
                  <div className="mb-2 p-2 bg-white/5 rounded-lg inline-block">{p.icon}</div>
                  <div className="text-xs font-bold font-mono text-white mb-1">{p.title}</div>
                  <div className="text-[11px] text-[#A9B8D0] leading-snug">{p.desc}</div>
                </div>
              ))}
            </div>
            
            <div className="pt-2">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,140,255,0.3)] group"
              >
                Explore Contests & Workshops
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const AboutNexus = AboutTeknova;
