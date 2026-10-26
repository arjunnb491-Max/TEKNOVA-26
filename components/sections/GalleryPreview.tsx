import Image from "next/image";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function GalleryPreview() {
  const visualAssets = [
    { src: "/images/TEKNOVA '26_ Neon Tech Fest.png", caption: "TEKNOVA '26 Main Fest Key Visual" },
    { src: "/images/Teknova '26 Neon Tech Fest Poster.png", caption: "Neon Fest Poster Design" },
    { src: "/images/TEKNOVA '26_ Neon Tech Fest 1.png", caption: "Gaming & Arena Visuals" },
    { src: "/images/TEKNOVA_ Neon Portal of Possibility.png", caption: "Portal of Possibility Stage" },
    { src: "/images/Neon TEKNOVA'26 Tech Fest Poster.png", caption: "Cyberpunk Digital Concept" },
    { src: "/images/TEKNOVA_26_525x328.jpg", caption: "KMM College MCA Department Banner" },
  ];

  return (
    <section className="py-24 bg-[#061226]/50 relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollReveal direction="up" className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2 block flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
            Visual Identity & Concepts
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-space-grotesk text-white mb-4 uppercase tracking-wider glow-cyan">
            Glimpses of <span className="text-gradient-cyan">TEKNOVA ’26</span>
          </h2>
          <p className="text-sm text-[#A9B8D0] max-w-2xl mx-auto leading-relaxed">
            The futuristic cyberpunk and neon identity of KMM College of Arts and Science MCA Fest.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {visualAssets.map((asset, index) => (
            <ScrollReveal 
              key={index}
              delay={index * 0.06}
              direction="up"
              className={`relative overflow-hidden rounded-2xl bg-[#07172B] border border-white/10 group hover:border-[#00E5FF]/60 hover:shadow-[0_0_30px_rgba(0,140,255,0.25)] transition-all duration-500 aspect-[4/3] cyber-bracket ${
                index === 0 || index === 3 ? "md:col-span-2 md:aspect-[21/9]" : ""
              }`}
            >
              <Image
                src={asset.src}
                alt={asset.caption}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#F5F8FF]">
                <span className="truncate">{asset.caption}</span>
                <span className="text-[10px] text-[#00E5FF] border border-[#00E5FF]/30 px-1.5 py-0.5 rounded bg-[#020713]/80">
                  TEKNOVA
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
