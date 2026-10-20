import { Calendar, MapPin, Award, Sparkles } from "lucide-react";
import { formatINR, TOTAL_KNOWN_PRIZE_POOL, OFFICIAL_EVENTS } from "@/data/events";

export function FestInfo() {
  const infoItems = [
    {
      icon: <Calendar className="w-8 h-8 text-[#00E5FF]" />,
      label: "FEST DATES",
      value: "December 2–3, 2026",
      subtext: "2 Days of High-Voltage Tech & Culture",
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#008CFF]" />,
      label: "INSTITUTION VENUE",
      value: "KMM College of Arts and Science",
      subtext: "Thrikkakara, Kochi, Kerala",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-[#B44CFF]" />,
      label: "ORGANIZING BODY",
      value: "Department of MCA",
      subtext: "Ideas • People • Possibilities",
    },
    {
      icon: <Award className="w-8 h-8 text-[#7B2CFF]" />,
      label: "PUBLISHED PRIZE POOL",
      value: formatINR(TOTAL_KNOWN_PRIZE_POOL),
      subtext: `Across ${OFFICIAL_EVENTS.length} Official Tournaments`,
    },
  ];

  return (
    <section className="py-12 border-y border-[#00E5FF]/10 bg-[#061226]/60 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl hover:border-[#00E5FF]/30 transition-all group text-center"
            >
              <div className="mb-4 p-3.5 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-[11px] font-mono tracking-widest text-[#00E5FF] mb-1.5 uppercase font-semibold">
                {item.label}
              </h3>
              <p className="text-base font-bold text-white tracking-wide mb-1 font-space-grotesk">
                {item.value}
              </p>
              <p className="text-xs text-[#A9B8D0]">
                {item.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
