"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Trophy, Users, User, ArrowRight, ChevronRight, Calendar, MapPin } from "lucide-react";
import { OfficialEvent, formatINR } from "@/data/events";

interface EventCardProps {
  event: OfficialEvent;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.5,
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.08, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="glass-panel border border-white/10 rounded-2xl overflow-hidden group hover:border-[#00E5FF]/50 hover:shadow-[0_0_35px_rgba(0,140,255,0.25)] transition-all duration-500 flex flex-col cyber-bracket relative"
    >
      {/* Top subtle scanline accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />

      {/* Event Image Banner with Zoom & Layered Crossfade Mask */}
      <div className="h-52 bg-[#07172B] relative overflow-hidden flex items-center justify-center">
        <Image 
          src={event.image} 
          alt={event.name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out opacity-65 group-hover:opacity-90"
        />
        {/* Layered mask transition overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-[#020713]/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#020713]/90 backdrop-blur-md border border-[#00E5FF]/40 text-[#00E5FF] rounded-full shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            {event.category}
          </span>
        </div>

        {/* Subcategory / interpretation */}
        <div className="absolute bottom-3 left-4 z-20">
          <span className="text-xs font-mono text-[#A9B8D0] bg-[#07172B]/90 backdrop-blur-sm border border-white/5 px-2.5 py-0.5 rounded">
            {event.workingInterpretation}
          </span>
        </div>
      </div>
      
      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="text-xl font-bold font-space-grotesk text-white group-hover:text-[#00E5FF] transition-colors duration-300">
            {event.name}
          </h3>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9B8D0] border border-white/10 px-2 py-0.5 rounded bg-white/5 flex items-center gap-1 shrink-0">
            {event.participationType === 'team' ? <Users size={12} className="text-[#00E5FF]" /> : <User size={12} className="text-[#00E5FF]" />}
            {event.participationType}
          </span>
        </div>
        
        <p className="text-[#A9B8D0] text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Schedule & Venue Metadata */}
        <div className="space-y-1.5 mb-5 text-xs text-[#A9B8D0] font-mono">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-[#00E5FF] shrink-0" />
            <span className="truncate">{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#008CFF] shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Prize Pool Info Box */}
        <div className="mb-6 p-3 bg-[#061226] border border-white/5 group-hover:border-[#00E5FF]/20 rounded-xl flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A9B8D0]">
            <Trophy size={14} className="text-[#00E5FF]" />
            <span>PRIZE POOL</span>
          </div>
          <div className="text-sm font-bold font-mono text-[#00E5FF]">
            {event.prizePoolSubtotal > 0 ? formatINR(event.prizePoolSubtotal) : (event.prizeNote || 'TBA')}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-auto flex gap-3">
          <Link
            href={`/events/${event.slug}`}
            className="flex-1 text-center py-2.5 border border-white/10 rounded-xl font-semibold text-xs text-white uppercase tracking-wider hover:bg-white/5 hover:border-[#00E5FF]/40 transition-all duration-300 flex items-center justify-center gap-1 group/btn"
          >
            <span>Details</span>
            <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform duration-300 text-[#00E5FF]" />
          </Link>
          <Link
            href={`/events/${event.slug}/register`}
            className="flex-1 text-center py-2.5 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(0,140,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] flex items-center justify-center gap-1.5 group/reg"
          >
            <span>Register</span>
            <ArrowRight size={14} className="group-hover/reg:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
