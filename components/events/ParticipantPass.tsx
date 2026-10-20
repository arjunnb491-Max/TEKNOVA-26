"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Printer, Download, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';

export interface ParticipantPassData {
  registrationNumber: string;
  eventName: string;
  participationType?: 'individual' | 'team';
  teamName?: string;
  category?: string;
  eventCategory?: string;
  registrationDate?: string;
  passNumber?: string;
  participant?: {
    fullName: string;
    college?: string;
    email?: string;
    phone?: string;
    course?: string;
  };
  // Fallbacks if flat data is provided
  fullName?: string;
  college?: string;
}

interface ParticipantPassProps {
  registration: ParticipantPassData;
  eventCategory?: string;
  className?: string;
  showActions?: boolean;
}

export function ParticipantPass({
  registration,
  eventCategory,
  className = "",
  showActions = true
}: ParticipantPassProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const passContainerRef = useRef<HTMLDivElement>(null);

  // Computed values
  const name = registration.participant?.fullName || registration.fullName || "Participant";
  const displayName = registration.teamName 
    ? `${name.toUpperCase()} (TEAM: ${registration.teamName.toUpperCase()})` 
    : name.toUpperCase();

  const regNo = registration.registrationNumber || "TKN26-REG";
  const eventName = registration.eventName?.toUpperCase() || "TEKNOVA '26 EVENT";
  const college = (registration.participant?.college || registration.college || "KMM College of Arts & Science").toUpperCase();
  const category = (eventCategory || registration.category || registration.eventCategory || "Technical Competition").toUpperCase();
  
  // Format Pass Number: e.g. TKN-PASS-4821
  const cleanDigits = regNo.replace(/[^0-9]/g, '');
  const passNo = registration.passNumber || `TKN-PASS-${cleanDigits.slice(-4) || '2026'}`;

  // Format Date: e.g. 20 OCT 2026
  const dateObj = registration.registrationDate ? new Date(registration.registrationDate) : new Date();
  const issueDate = isNaN(dateObj.getTime())
    ? "20 OCT 2026"
    : dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(regNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Canvas-based pixel-perfect image generation for downloading to device gallery
  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 682;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = '/images/participant-pass-template.png';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load pass template image"));
      });

      // Draw background template
      ctx.drawImage(img, 0, 0, 1024, 682);

      // Configure text styles
      ctx.fillStyle = '#0a1e46'; // Navy dark blue matching the card template
      ctx.font = 'bold 15px "Space Grotesk", "Segoe UI", Arial, sans-serif';
      ctx.textBaseline = 'middle';

      // Starting X position for dynamic values after colon and line start
      const startX = 425;
      const maxWidth = 390;

      // Draw 7 lines of dynamic values
      ctx.fillText(displayName.slice(0, 38), startX, 368, maxWidth);
      ctx.fillText(regNo, startX, 398, maxWidth);
      ctx.fillText(eventName.slice(0, 36), startX, 428, maxWidth);
      ctx.fillText(college.slice(0, 42), startX, 459, maxWidth);
      ctx.fillText(category, startX, 489, maxWidth);
      ctx.fillText(passNo, startX, 520, maxWidth);
      ctx.fillText(issueDate, startX, 551, maxWidth);

      // Trigger download
      const link = document.createElement('a');
      link.download = `TEKNOVA26-PASS-${regNo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Pass download error:", err);
      // Fallback: window print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Action Controls Header */}
      {showActions && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 p-4 bg-[#07172B]/80 backdrop-blur-md border border-[#00E5FF]/20 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl border border-[#00E5FF]/20">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
                Official Festival Access
              </div>
              <div className="text-sm font-bold text-white font-space-grotesk flex items-center gap-2">
                Participant Pass
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-[#061226] hover:bg-[#008CFF]/20 text-[#A9B8D0] hover:text-white border border-white/10 hover:border-[#00E5FF]/40 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all"
              title="Copy Registration Number"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : regNo}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="px-4 py-2 bg-[#008CFF] hover:bg-[#00E5FF] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,140,255,0.3)] disabled:opacity-50"
            >
              <Download size={14} />
              <span>{downloading ? "Generating..." : "Save Image (.PNG)"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#7B2CFF] hover:bg-[#B44CFF] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(123,44,255,0.3)]"
            >
              <Printer size={14} />
              <span>Print Pass</span>
            </button>
          </div>
        </div>
      )}

      {/* The Participant Pass Card Container */}
      <div 
        ref={passContainerRef}
        className="participant-pass-card relative w-full max-w-3xl mx-auto aspect-[1024/682] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,140,255,0.3)] border-2 border-[#00E5FF]/30 select-none bg-[#020713]"
        style={{
          containerType: 'inline-size'
        }}
      >
        {/* Pass Template Artwork */}
        <Image
          src="/images/participant-pass-template.png"
          alt="TEKNOVA '26 Official Participant Pass"
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover pointer-events-none"
          priority
        />

        {/* Dynamic Text Overlay matching the 7 lines */}
        <div 
          className="absolute font-bold text-[#0a1e46] font-space-grotesk tracking-wide"
          style={{
            left: '42.0%',
            width: '39.0%',
            top: '51.8%',
            bottom: '15.5%',
            fontSize: 'clamp(8px, 1.6cqw, 15px)',
            lineHeight: 1
          }}
        >
          {/* Row 1: NAME */}
          <div 
            className="absolute left-0 right-0 flex items-center truncate"
            style={{ top: '0.0%', height: '8.0%' }}
            title={displayName}
          >
            <span className="truncate">{displayName}</span>
          </div>

          {/* Row 2: REGISTRATION NO. */}
          <div 
            className="absolute left-0 right-0 flex items-center font-mono font-black tracking-wider text-[#0052cc]"
            style={{ top: '15.5%', height: '8.0%' }}
          >
            <span className="truncate">{regNo}</span>
          </div>

          {/* Row 3: EVENT */}
          <div 
            className="absolute left-0 right-0 flex items-center truncate font-black text-[#0a1e46]"
            style={{ top: '30.8%', height: '8.0%' }}
            title={eventName}
          >
            <span className="truncate">{eventName}</span>
          </div>

          {/* Row 4: COLLEGE */}
          <div 
            className="absolute left-0 right-0 flex items-center truncate text-[0.92em]"
            style={{ top: '46.0%', height: '8.0%' }}
            title={college}
          >
            <span className="truncate">{college}</span>
          </div>

          {/* Row 5: CATEGORY */}
          <div 
            className="absolute left-0 right-0 flex items-center truncate text-[0.95em]"
            style={{ top: '61.2%', height: '8.0%' }}
          >
            <span className="truncate">{category}</span>
          </div>

          {/* Row 6: PASS NO. */}
          <div 
            className="absolute left-0 right-0 flex items-center font-mono font-black tracking-widest text-[#7B2CFF]"
            style={{ top: '76.5%', height: '8.0%' }}
          >
            <span className="truncate">{passNo}</span>
          </div>

          {/* Row 7: ISSUE DATE */}
          <div 
            className="absolute left-0 right-0 flex items-center font-mono text-[0.92em]"
            style={{ top: '91.8%', height: '8.0%' }}
          >
            <span className="truncate">{issueDate}</span>
          </div>
        </div>
      </div>

      {/* Helpful Instructions */}
      {showActions && (
        <div className="no-print p-4 bg-[#07172B]/60 border border-white/5 rounded-2xl flex items-start gap-3 text-xs text-[#A9B8D0] max-w-3xl mx-auto">
          <ShieldCheck size={18} className="text-[#00E5FF] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">Desk Check-in Instructions</span>
            <p className="leading-relaxed">
              Present this pass (either on your smartphone or as a printed copy) along with your college identity card at the Reception Desk on fest dates (Dec 2–3, 2026) to claim your physical badge, food token, and Lucky Draw entry coupon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
