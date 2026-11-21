"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { CyberBackground } from "@/components/animations/CyberBackground";
import { 
  OFFICIAL_SPONSORS, 
  OFFICIAL_SPONSORSHIP_CONTACT, 
  Sponsor, 
  SponsorTier 
} from "@/data/sponsors";
import { 
  ExternalLink, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Users2,
  Zap,
  Globe
} from "lucide-react";

export default function SponsorsPage() {
  const shouldReduceMotion = useReducedMotion();
  const [sponsors, setSponsors] = useState<Sponsor[]>(OFFICIAL_SPONSORS);
  const [activePartnerTab, setActivePartnerTab] = useState<"all" | "community" | "media" | "technology" | "supporting">("all");
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  // Fetch dynamic sponsors if available in database via API
  useEffect(() => {
    let isMounted = true;
    async function loadSponsors() {
      try {
        const res = await fetch("/api/sponsors");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.sponsors) && data.sponsors.length > 0 && isMounted) {
            setSponsors(data.sponsors);
          }
        }
      } catch {
        // Keeps verified official fallback catalogue
      }
    }
    loadSponsors();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter sponsors by tier
  const titleSponsors = sponsors.filter((s) => s.isActive && s.tier === "title");
  const poweredBySponsors = sponsors.filter((s) => s.isActive && s.tier === "powered_by");
  const associateSponsors = sponsors.filter((s) => s.isActive && s.tier === "associate");
  
  // Section 5 Partners
  const communityPartners = sponsors.filter((s) => s.isActive && s.tier === "community");
  const mediaPartners = sponsors.filter((s) => s.isActive && s.tier === "media");
  const techPartners = sponsors.filter((s) => s.isActive && s.tier === "technology");
  const supportingPartners = sponsors.filter((s) => s.isActive && s.tier === "supporting");

  const partnersPool = [
    { tier: "community" as const, title: "Community Partners", list: communityPartners },
    { tier: "media" as const, title: "Media Partners", list: mediaPartners },
    { tier: "technology" as const, title: "Technology Partners", list: techPartners },
    { tier: "supporting" as const, title: "Supporting Partners", list: supportingPartners },
  ].filter((group) => group.list.length > 0);

  const displayedPartners = activePartnerTab === "all" 
    ? partnersPool 
    : partnersPool.filter((p) => p.tier === activePartnerTab);

  return (
    <div className="min-h-screen bg-[#020713] text-[#A9B8D0] flex flex-col selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* SECTION 1 – HERO */}
        {/* ========================================================================= */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#020713]">
          {/* Cybernetic Particle Grid & Atmosphere */}
          <CyberBackground density="medium" showGeometricShapes={true} />

          {/* Accent radial glow backdrop */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#00E5FF]/10 via-[#008CFF]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            {/* Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#00E5FF]/30 bg-[#07172B]/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,140,255,0.2)] mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#00E5FF] uppercase">
                TEKNOVA’26 • OUR PARTNERS
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black font-space-grotesk tracking-tight text-white mb-6 uppercase"
            >
              POWERING THE <span className="text-gradient-cyan">FUTURE</span> TOGETHER.
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-[#F5F8FF]/80 max-w-3xl mx-auto leading-relaxed mb-10"
            >
              Behind every great innovation is a community that believes in possibilities.
              Meet the industry pioneers, innovators, and partner ecosystems making TEKNOVA’26 possible.
            </motion.p>

            {/* Quick Metrics / Tier Anchors */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto"
            >
              {titleSponsors.length > 0 && (
                <a
                  href="#title-sponsor"
                  className="px-4 py-2 rounded-xl bg-[#07172B]/80 border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] hover:bg-[#00E5FF]/10 hover:border-[#00E5FF]/60 transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={13} /> Title Sponsor
                </a>
              )}
              {poweredBySponsors.length > 0 && (
                <a
                  href="#powered-by"
                  className="px-4 py-2 rounded-xl bg-[#07172B]/80 border border-white/10 text-xs font-mono text-[#F5F8FF] hover:border-[#00E5FF]/40 transition-all flex items-center gap-1.5"
                >
                  <Zap size={13} className="text-[#008CFF]" /> Powered By ({poweredBySponsors.length})
                </a>
              )}
              {associateSponsors.length > 0 && (
                <a
                  href="#associate-sponsors"
                  className="px-4 py-2 rounded-xl bg-[#07172B]/80 border border-white/10 text-xs font-mono text-[#F5F8FF] hover:border-[#00E5FF]/40 transition-all flex items-center gap-1.5"
                >
                  <Building2 size={13} className="text-[#B44CFF]" /> Associate ({associateSponsors.length})
                </a>
              )}
              <a
                href="#community-partners"
                className="px-4 py-2 rounded-xl bg-[#07172B]/80 border border-white/10 text-xs font-mono text-[#F5F8FF] hover:border-[#00E5FF]/40 transition-all flex items-center gap-1.5"
              >
                <Users2 size={13} className="text-[#00E5FF]" /> Ecosystem & Media
              </a>
              <a
                href="#become-a-sponsor"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#008CFF]/20 to-[#7B2CFF]/20 border border-[#00E5FF]/40 text-xs font-mono font-bold text-[#00E5FF] hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all flex items-center gap-1.5"
              >
                Partner With Us <ChevronRight size={13} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 – TITLE SPONSOR (Only shown if confirmed Title Sponsor exists) */}
        {/* ========================================================================= */}
        {titleSponsors.length > 0 && (
          <section id="title-sponsor" className="py-16 relative z-10 border-t border-white/5 bg-[#020713]">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-10">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#00E5FF] font-bold block mb-2">
                  CONFIRMED APEX PARTNER
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-space-grotesk text-white tracking-wide">
                  OFFICIAL TITLE SPONSOR
                </h2>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                {titleSponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="relative group rounded-3xl p-8 sm:p-12 glass-panel-elevated border border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.12)] hover:border-[#00E5FF]/70 transition-all duration-300 overflow-hidden"
                  >
                    {/* Glowing Accent Corner Aura */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#00E5FF]/15 via-[#7B2CFF]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
                    
                    {/* Top Tier Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-semibold">
                        <Sparkles size={14} /> {sponsor.category}
                      </div>
                      <span className="text-xs font-mono text-[#627694] tracking-widest uppercase">
                        PREMIER LEVEL PARTNERSHIP
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      {/* Logo Container */}
                      <div className="md:col-span-5 flex items-center justify-center p-6 bg-[#020713]/80 rounded-2xl border border-white/10 shadow-inner group-hover:border-[#00E5FF]/40 transition-colors">
                        <div className="relative w-full h-24 sm:h-28 flex items-center justify-center">
                          <Image
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 320px"
                            className="object-contain filter drop-shadow-[0_0_12px_rgba(0,229,255,0.3)] transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      {/* Sponsor Details */}
                      <div className="md:col-span-7 space-y-4 text-center md:text-left">
                        <h3 className="text-2xl sm:text-3xl font-extrabold font-space-grotesk text-white">
                          {sponsor.name}
                        </h3>
                        {sponsor.description && (
                          <p className="text-sm sm:text-base text-[#A9B8D0] leading-relaxed">
                            {sponsor.description}
                          </p>
                        )}
                        <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                          {sponsor.websiteUrl && (
                            <a
                              href={sponsor.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white font-space-grotesk font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(0,140,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all"
                            >
                              Visit Website <ExternalLink size={15} />
                            </a>
                          )}
                          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00E5FF]">
                            <ShieldCheck size={14} /> Verified Fest Partner
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3 – POWERED BY */}
        {/* ========================================================================= */}
        {poweredBySponsors.length > 0 && (
          <section id="powered-by" className="py-20 relative z-10 border-t border-white/5 bg-[#020713]">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#008CFF] font-bold block mb-2">
                  MAJOR CONFLUENCE SPONSORS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-white tracking-wide uppercase">
                  POWERED BY
                </h2>
                <p className="mt-3 text-sm text-[#A9B8D0]">
                  Industry champions delivering essential infrastructure, high-performance hardware, and technical mentorship.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {poweredBySponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="group relative rounded-2xl p-7 sm:p-9 glass-panel border border-[#008CFF]/25 hover:border-[#00E5FF]/60 hover:shadow-[0_8px_30px_rgba(0,140,255,0.18)] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Category Badge */}
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <span className="px-3 py-1 rounded-md bg-[#008CFF]/15 border border-[#008CFF]/30 text-[11px] font-mono text-[#00E5FF] font-medium tracking-wide">
                          {sponsor.category}
                        </span>
                        <Zap size={15} className="text-[#00E5FF]" />
                      </div>

                      {/* Sponsor Logo Container */}
                      <div className="w-full h-24 bg-[#020713]/70 rounded-xl border border-white/5 p-4 flex items-center justify-center mb-6 group-hover:border-[#008CFF]/30 transition-colors">
                        <div className="relative w-full h-full">
                          <Image
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Sponsor Details */}
                      <h3 className="text-xl sm:text-2xl font-bold font-space-grotesk text-white mb-2">
                        {sponsor.name}
                      </h3>

                      {sponsor.description && (
                        <p className="text-xs sm:text-sm text-[#A9B8D0] leading-relaxed mb-6">
                          {sponsor.description}
                        </p>
                      )}
                    </div>

                    {sponsor.websiteUrl && (
                      <div className="pt-4 border-t border-white/5">
                        <a
                          href={sponsor.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#00E5FF] hover:text-white transition-colors"
                        >
                          Official Website <ExternalLink size={13} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4 – ASSOCIATE SPONSORS */}
        {/* ========================================================================= */}
        {associateSponsors.length > 0 && (
          <section id="associate-sponsors" className="py-20 relative z-10 border-t border-white/5 bg-[#020713]">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B44CFF] font-bold block mb-2">
                  TECHNOLOGY & INNOVATION ALLIANCE
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-white tracking-wide uppercase">
                  ASSOCIATE SPONSORS
                </h2>
                <p className="mt-3 text-sm text-[#A9B8D0]">
                  Accelerating developer talent and supporting competition verticals with technical tooling and bounty rewards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {associateSponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="group rounded-2xl p-6 glass-panel border border-white/10 hover:border-[#00E5FF]/40 hover:bg-[#07172B]/80 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Consistent Logo Container */}
                      <div className="w-full h-24 bg-[#020713]/80 rounded-xl border border-white/5 p-4 flex items-center justify-center mb-5 group-hover:border-white/20 transition-colors">
                        <div className="relative w-full h-full">
                          <Image
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      <div className="mb-2">
                        <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block mb-1">
                          {sponsor.category}
                        </span>
                        <h3 className="text-lg font-bold font-space-grotesk text-white">
                          {sponsor.name}
                        </h3>
                      </div>

                      {sponsor.description && (
                        <p className="text-xs text-[#A9B8D0] leading-relaxed mb-4">
                          {sponsor.description}
                        </p>
                      )}
                    </div>

                    {sponsor.websiteUrl && (
                      <div className="pt-3 border-t border-white/5">
                        <a
                          href={sponsor.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#F5F8FF] hover:text-[#00E5FF] transition-colors"
                        >
                          Visit Sponsor <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5 – COMMUNITY & MEDIA PARTNERS (Hides empty categories) */}
        {/* ========================================================================= */}
        {partnersPool.length > 0 && (
          <section id="community-partners" className="py-20 relative z-10 border-t border-white/5 bg-[#020713]">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#00E5FF] font-bold block mb-2">
                  ECOSYSTEM CATALYSTS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-white tracking-wide uppercase">
                  COMMUNITY & MEDIA PARTNERS
                </h2>
                <p className="mt-3 text-sm text-[#A9B8D0]">
                  Amplifying student reach, open-source enthusiasm, and intercollegiate youth culture across South India.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                <button
                  type="button"
                  onClick={() => setActivePartnerTab("all")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    activePartnerTab === "all"
                      ? "bg-[#00E5FF] text-[#020713] font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                      : "bg-[#07172B] text-[#A9B8D0] border border-white/5 hover:text-white hover:border-white/20"
                  }`}
                >
                  All Partners
                </button>
                {partnersPool.map((group) => (
                  <button
                    key={group.tier}
                    type="button"
                    onClick={() => setActivePartnerTab(group.tier)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                      activePartnerTab === group.tier
                        ? "bg-[#00E5FF] text-[#020713] font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                        : "bg-[#07172B] text-[#A9B8D0] border border-white/5 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {group.title} ({group.list.length})
                  </button>
                ))}
              </div>

              {/* Categorized Partner Grids */}
              <div className="space-y-12 max-w-5xl mx-auto">
                {displayedPartners.map((group) => (
                  <div key={group.tier} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
                        {group.title}
                      </h3>
                      <div className="h-[1px] flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {group.list.map((partner) => (
                        <div
                          key={partner.id}
                          className="group p-4 rounded-xl bg-[#07172B]/70 border border-white/5 hover:border-[#00E5FF]/30 hover:bg-[#07172B] transition-all flex flex-col justify-between"
                        >
                          <div className="w-full h-16 bg-[#020713]/60 rounded-lg p-2 flex items-center justify-center mb-3">
                            <div className="relative w-full h-full">
                              <Image
                                src={partner.logoUrl}
                                alt={partner.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 200px"
                                className="object-contain group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono uppercase text-[#627694] block">
                              {partner.category}
                            </span>
                            <span className="text-xs font-bold text-white block truncate">
                              {partner.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6 – BECOME A SPONSOR */}
        {/* ========================================================================= */}
        <section id="become-a-sponsor" className="py-24 relative z-10 border-t border-white/5 overflow-hidden bg-gradient-to-b from-[#020713] via-[#061226] to-[#020713]">
          {/* Cyber aura lighting */}
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#00E5FF]/10 to-[#7B2CFF]/10 blur-3xl pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto glass-panel-elevated rounded-3xl p-8 sm:p-14 border border-[#00E5FF]/30 shadow-[0_12px_50px_rgba(0,140,255,0.2)] text-center">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#00E5FF] font-bold block mb-3">
                JOIN THE CONFLUENCE
              </span>
              
              <h2 className="text-3xl sm:text-5xl font-black font-space-grotesk text-white tracking-tight uppercase mb-4">
                BECOME PART OF THE FUTURE.
              </h2>

              <p className="text-sm sm:text-base text-[#A9B8D0] max-w-2xl mx-auto leading-relaxed mb-8">
                Partner with TEKNOVA’26 and connect with the next generation of innovators, creators, 
                and technology enthusiasts. Showcase your company, recruit premier tech talent, and elevate your brand presence.
              </p>

              {/* Official Sponsorship Actions */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <a
                  href={`mailto:${OFFICIAL_SPONSORSHIP_CONTACT.email}?subject=TEKNOVA'26%20Sponsorship%20Inquiry&body=Hello%20TEKNOVA'26%20Organizing%20Committee,%0D%0A%0D%0AWe%20are%20interested%20in%20partnering%20with%20TEKNOVA'26.%20Please%20share%20the%20detailed%20sponsorship%20deck%20and%20deliverables.%0D%0A%0D%0ACompany%20Name:%0D%0AContact%20Person:%0D%0APhone:`}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white font-space-grotesk font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,140,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all flex items-center gap-2"
                >
                  <Mail size={16} /> BECOME A SPONSOR
                </a>

                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#07172B] hover:bg-[#07172B]/80 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2"
                >
                  <FileText size={15} /> Sponsorship Deck & Desk
                </button>
              </div>

              {/* Official Sponsorship Secretariat Desk Box */}
              <div className="pt-8 border-t border-white/10 text-left grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs text-[#A9B8D0]">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#627694] tracking-widest block font-bold">
                    HOST INSTITUTION
                  </span>
                  <div className="font-semibold text-[#F5F8FF] flex items-center gap-1.5">
                    <Building2 size={13} className="text-[#00E5FF] shrink-0" />
                    <span>{OFFICIAL_SPONSORSHIP_CONTACT.institution}</span>
                  </div>
                  <p className="text-[11px] leading-tight text-[#A9B8D0]">
                    {OFFICIAL_SPONSORSHIP_CONTACT.department}
                  </p>
                  <p className="text-[10px] text-[#627694]">
                    {OFFICIAL_SPONSORSHIP_CONTACT.affiliations}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#627694] tracking-widest block font-bold">
                    CAMPUS DESK LOCATION
                  </span>
                  <div className="flex items-start gap-1.5 text-[#F5F8FF]">
                    <MapPin size={13} className="text-[#00E5FF] shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">
                      {OFFICIAL_SPONSORSHIP_CONTACT.address}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#627694] block">
                    Kochi Metro Corridor • Ernakulam
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#627694] tracking-widest block font-bold">
                    DIRECT SPONSORSHIP DESK
                  </span>
                  <div className="flex items-center gap-1.5 text-[#F5F8FF]">
                    <Mail size={13} className="text-[#00E5FF] shrink-0" />
                    <a href={`mailto:${OFFICIAL_SPONSORSHIP_CONTACT.email}`} className="hover:text-[#00E5FF] transition-colors">
                      {OFFICIAL_SPONSORSHIP_CONTACT.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A9B8D0]">
                    <Phone size={13} className="text-[#00E5FF] shrink-0" />
                    <span>{OFFICIAL_SPONSORSHIP_CONTACT.phone}</span>
                  </div>
                  <span className="text-[10px] text-[#00E5FF] block font-mono">
                    Fest Dates: Dec 2–3, 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal: Sponsorship Desk & Deliverables */}
        {inquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-[#00E5FF]/40 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider">
                    TEKNOVA’26 PARTNERSHIP
                  </span>
                  <h3 className="text-xl font-bold font-space-grotesk text-white">
                    Sponsorship Deliverables & Contact
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-[#A9B8D0]">
                <p>
                  TEKNOVA’26 brings together over <strong className="text-white">1,500+ student delegates</strong> from 50+ universities across engineering, computer applications, and management disciplines.
                </p>

                <div className="p-4 bg-[#020713]/80 rounded-xl border border-white/10 space-y-2">
                  <div className="font-bold text-white uppercase text-[11px] font-mono text-[#00E5FF]">
                    Partnership Tiers & Opportunities:
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-[11px]">
                    <li><strong>Title & Powered By:</strong> Keynote stage naming, premier banner placements, stall space, hackathon jury seat.</li>
                    <li><strong>Associate Sponsors:</strong> Workshop branding, technical problem statement sponsor, booth space.</li>
                    <li><strong>Community & Media:</strong> Digital co-branding, fest press release coverage, student broadcast syndication.</li>
                  </ul>
                </div>

                <div className="p-3 bg-[#07172B] rounded-xl border border-[#00E5FF]/20 text-[11px] space-y-1">
                  <div className="text-white font-semibold">Ready to collaborate?</div>
                  <div>Reach our Fest Secretariat directly at <a href={`mailto:${OFFICIAL_SPONSORSHIP_CONTACT.email}`} className="text-[#00E5FF] underline">{OFFICIAL_SPONSORSHIP_CONTACT.email}</a>.</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-colors"
                >
                  Close
                </button>
                <a
                  href={`mailto:${OFFICIAL_SPONSORSHIP_CONTACT.email}?subject=TEKNOVA'26%20Sponsorship%20Inquiry`}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] text-white text-xs font-mono font-bold hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all flex items-center gap-1.5"
                >
                  <Mail size={13} /> Contact Secretariat
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* SECTION 7 – FOOTER (Reused existing footer) */}
      {/* ========================================================================= */}
      <Footer />
    </div>
  );
}

