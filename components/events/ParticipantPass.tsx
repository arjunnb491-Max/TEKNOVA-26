"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  QrCode, 
  CheckCircle2, 
  Calendar, 
  MapPin 
} from 'lucide-react';

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
  // Mode: 'mobile' (Smartphone Ratio) vs 'landscape' (Badge Ratio)
  const [viewMode, setViewMode] = useState<'mobile' | 'landscape'>('mobile');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Auto-detect mobile screen on mount to default to Smartphone Ratio on phones
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewMode(window.innerWidth < 768 ? 'mobile' : 'landscape');
    }
  }, []);

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

  // Canvas-based download: handles both Smartphone Ratio and Landscape Card
  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      if (viewMode === 'mobile') {
        // Generate high-resolution Smartphone Ratio Pass (1080 x 1620)
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1620;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get canvas context");

        // Background
        const grad = ctx.createLinearGradient(0, 0, 1080, 1620);
        grad.addColorStop(0, '#020713');
        grad.addColorStop(0.5, '#061226');
        grad.addColorStop(1, '#07172B');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1620);

        // Cyber Glow Orbs
        const orb1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 500);
        orb1.addColorStop(0, 'rgba(0, 140, 255, 0.25)');
        orb1.addColorStop(1, 'transparent');
        ctx.fillStyle = orb1;
        ctx.fillRect(0, 0, 1080, 800);

        const orb2 = ctx.createRadialGradient(880, 1400, 10, 880, 1400, 500);
        orb2.addColorStop(0, 'rgba(123, 44, 255, 0.25)');
        orb2.addColorStop(1, 'transparent');
        ctx.fillStyle = orb2;
        ctx.fillRect(0, 800, 1080, 820);

        // Outer Cyber Border
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 40, 1000, 1540);

        // Header Section: Load KMM College Logo
        try {
          const collegeImg = new window.Image();
          collegeImg.crossOrigin = "anonymous";
          collegeImg.src = '/images/kmm-college-logo.png';
          await new Promise<void>((resolve) => {
            collegeImg.onload = () => resolve();
            collegeImg.onerror = () => resolve(); // continue if logo fails
          });
          if (collegeImg.width) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(390, 80, 300, 100, 16);
            ctx.fill();
            ctx.drawImage(collegeImg, 410, 95, 260, 70);
          }
        } catch (e) {
          console.warn("Logo draw skipped", e);
        }

        // Header Text
        ctx.fillStyle = '#00E5FF';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DEPARTMENT OF MCA • THRIKKAKARA', 540, 220);

        ctx.fillStyle = '#A9B8D0';
        ctx.font = '18px monospace';
        ctx.fillText('Approved by AICTE & Govt. of Kerala • M.G. University', 540, 255);

        // Fest Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 80px "Space Grotesk", sans-serif';
        ctx.fillText('TEKNOVA ’26', 540, 350);

        ctx.fillStyle = '#00E5FF';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('INNOVATE  |  CREATE  |  COMPETE  |  EXPERIENCE', 540, 395);

        // Badge Pill: PARTICIPANT PASS
        ctx.fillStyle = '#7B2CFF';
        ctx.beginPath();
        ctx.roundRect(290, 435, 500, 60, 30);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 28px "Space Grotesk", sans-serif';
        ctx.fillText('OFFICIAL PARTICIPANT PASS', 540, 475);

        // White Ticket Body Card
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(90, 530, 900, 870, 28);
        ctx.fill();

        // Left notch & Right notch for ticket look
        ctx.fillStyle = '#061226';
        ctx.beginPath();
        ctx.arc(90, 1150, 30, -Math.PI / 2, Math.PI / 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(990, 1150, 30, Math.PI / 2, -Math.PI / 2);
        ctx.fill();

        // Dashed tear line across notches
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3;
        ctx.setLineDash([12, 10]);
        ctx.beginPath();
        ctx.moveTo(130, 1150);
        ctx.lineTo(950, 1150);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Draw 7 Form Lines
        const fields = [
          { label: "NAME", value: displayName },
          { label: "REGISTRATION NO.", value: regNo, isAccent: true },
          { label: "EVENT", value: eventName },
          { label: "COLLEGE", value: college },
          { label: "CATEGORY", value: category },
          { label: "PASS NO.", value: passNo, isPurple: true },
          { label: "ISSUE DATE", value: issueDate }
        ];

        let startY = 610;
        const rowHeight = 72;

        fields.forEach((f) => {
          // Label
          ctx.textAlign = 'left';
          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 20px monospace';
          ctx.fillText(f.label, 140, startY);

          ctx.fillStyle = '#0F172A';
          ctx.fillText(':', 400, startY);

          // Underline
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(430, startY + 8);
          ctx.lineTo(940, startY + 8);
          ctx.stroke();

          // Value
          if (f.isAccent) {
            ctx.fillStyle = '#0052CC';
            ctx.font = '900 24px monospace';
          } else if (f.isPurple) {
            ctx.fillStyle = '#7B2CFF';
            ctx.font = '900 24px monospace';
          } else {
            ctx.fillStyle = '#0A1E46';
            ctx.font = 'bold 21px "Space Grotesk", sans-serif';
          }

          ctx.fillText(f.value.slice(0, 34), 430, startY);
          startY += rowHeight;
        });

        // Verification & Barcode section (below tear line)
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 22px "Space Grotesk", sans-serif';
        ctx.fillText('VERIFIED PARTICIPATION PASS', 140, 1220);

        ctx.fillStyle = '#64748B';
        ctx.font = '16px monospace';
        ctx.fillText('Present at Reception Desk for physical badge and food coupon.', 140, 1255);
        ctx.fillText('Fest Schedule: December 2–3, 2026 • Thrikkakara', 140, 1285);

        // Status Stamp
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.roundRect(740, 1205, 200, 48, 12);
        ctx.fill();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('✓ CONFIRMED', 840, 1235);

        // Footer Bar
        ctx.fillStyle = '#00E5FF';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('TECHNOLOGY   |   CREATIVITY   |   INNOVATION', 540, 1470);

        ctx.fillStyle = '#A9B8D0';
        ctx.font = '16px monospace';
        ctx.fillText('IDEAS TODAY. A BRIGHTER TOMORROW.', 540, 1515);

        // Trigger download
        const link = document.createElement('a');
        link.download = `TEKNOVA26-MOBILE-PASS-${regNo}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        // Generate Landscape Badge (1024 x 682)
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
        ctx.fillStyle = '#0a1e46';
        ctx.font = 'bold 15px "Space Grotesk", "Segoe UI", Arial, sans-serif';
        ctx.textBaseline = 'middle';

        const startX = 425;
        const maxWidth = 390;

        ctx.fillText(displayName.slice(0, 38), startX, 368, maxWidth);
        ctx.fillText(regNo, startX, 398, maxWidth);
        ctx.fillText(eventName.slice(0, 36), startX, 428, maxWidth);
        ctx.fillText(college.slice(0, 42), startX, 459, maxWidth);
        ctx.fillText(category, startX, 489, maxWidth);
        ctx.fillText(passNo, startX, 520, maxWidth);
        ctx.fillText(issueDate, startX, 551, maxWidth);

        const link = document.createElement('a');
        link.download = `TEKNOVA26-PASS-${regNo}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error("Pass download error:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Header & Ratio View Switcher */}
      {showActions && (
        <div className="no-print space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#07172B]/90 backdrop-blur-md border border-[#00E5FF]/20 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl border border-[#00E5FF]/20 shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
                  Official Festival Access
                </div>
                <div className="text-base font-bold text-white font-space-grotesk flex items-center gap-2">
                  Participant Pass
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Ratio View Switcher: Smartphone vs Landscape */}
            <div className="flex items-center p-1 bg-[#061226] border border-white/10 rounded-xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode('mobile')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  viewMode === 'mobile'
                    ? "bg-[#008CFF] text-white font-bold shadow-[0_0_12px_rgba(0,140,255,0.4)]"
                    : "text-[#A9B8D0] hover:text-white"
                }`}
                title="Fit to Smartphone Screen Ratio"
              >
                <Smartphone size={14} />
                <span>Smartphone Ratio</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('landscape')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  viewMode === 'landscape'
                    ? "bg-[#008CFF] text-white font-bold shadow-[0_0_12px_rgba(0,140,255,0.4)]"
                    : "text-[#A9B8D0] hover:text-white"
                }`}
                title="Official Landscape Badge View"
              >
                <Monitor size={14} />
                <span>Landscape Badge</span>
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#061226]/80 rounded-xl border border-white/5">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-[#07172B] hover:bg-[#008CFF]/20 text-[#A9B8D0] hover:text-white border border-white/10 hover:border-[#00E5FF]/40 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all"
              title="Copy Registration Number"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : regNo}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadImage}
                disabled={downloading}
                className="px-4 py-2 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50"
              >
                <Download size={14} />
                <span>{downloading ? "Generating..." : viewMode === 'mobile' ? "Save Mobile Pass (.PNG)" : "Save Badge (.PNG)"}</span>
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
        </div>
      )}

      {/* VIEW 1: SMARTPHONE RATIO (Vertical Mobile Pass Ticket) */}
      {viewMode === 'mobile' && (
        <div className="participant-pass-mobile relative w-full max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden shadow-[0_0_45px_rgba(0,140,255,0.3)] border-2 border-[#00E5FF]/40 bg-[#061226] text-white select-none">
          {/* Neon decorative background glow */}
          <div className="absolute top-0 -left-20 w-64 h-64 bg-[#008CFF]/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 -right-20 w-64 h-64 bg-[#7B2CFF]/25 rounded-full blur-[90px] pointer-events-none"></div>

          {/* Top Institutional Header */}
          <div className="relative z-10 p-5 text-center space-y-3 border-b border-white/10 bg-gradient-to-b from-[#020713] to-transparent">
            {/* KMM College Logo Badge */}
            <div className="inline-block bg-white rounded-xl px-3 py-1.5 shadow-md">
              <Image
                src="/images/kmm-college-logo.png"
                alt="KMM College of Arts and Science"
                width={130}
                height={46}
                className="h-7 w-auto object-contain mx-auto"
                priority
              />
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] font-mono font-bold text-[#00E5FF] tracking-wider uppercase">
                Department of MCA • Thrikkakara
              </div>
              <div className="text-[9px] font-mono text-[#A9B8D0] tracking-wide">
                Approved by AICTE & Govt. of Kerala • M.G. University
              </div>
            </div>

            {/* Glowing 3D Fest Title */}
            <div className="pt-2">
              <h1 className="text-3xl sm:text-4xl font-black font-space-grotesk tracking-tight text-white glow-cyan">
                TEKNOVA <span className="text-gradient-cyan">’26</span>
              </h1>
              <p className="text-[9px] font-mono text-[#00E5FF] uppercase tracking-[0.2em] font-bold mt-0.5">
                INNOVATE • CREATE • COMPETE • EXPERIENCE
              </p>
            </div>

            {/* Pass Category Ribbon */}
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#7B2CFF] to-[#008CFF] text-white text-[11px] font-space-grotesk font-black tracking-widest uppercase shadow-[0_0_15px_rgba(123,44,255,0.4)]">
              PARTICIPANT PASS
            </div>
          </div>

          {/* Inner Ticket Card (White / Light ticket body with 7 fields) */}
          <div className="relative z-10 p-4 sm:p-5">
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-2xl relative overflow-hidden border border-slate-200">
              {/* Ticket Notches */}
              <div className="absolute -left-3 top-3/4 w-6 h-6 rounded-full bg-[#061226] border-r border-[#00E5FF]/40"></div>
              <div className="absolute -right-3 top-3/4 w-6 h-6 rounded-full bg-[#061226] border-l border-[#00E5FF]/40"></div>

              {/* 7 Fields Breakdown */}
              <div className="space-y-3.5 text-xs">
                {/* Field 1: NAME */}
                <div className="border-b border-slate-200 pb-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    NAME
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-950 font-space-grotesk truncate mt-0.5" title={displayName}>
                    {displayName}
                  </div>
                </div>

                {/* Field 2: REGISTRATION NO. */}
                <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      REGISTRATION NO.
                    </div>
                    <div className="text-sm font-black font-mono text-blue-700 tracking-wider mt-0.5">
                      {regNo}
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold">
                    CONFIRMED
                  </span>
                </div>

                {/* Field 3: EVENT */}
                <div className="border-b border-slate-200 pb-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    EVENT
                  </div>
                  <div className="text-sm font-extrabold text-slate-950 font-space-grotesk truncate mt-0.5" title={eventName}>
                    {eventName}
                  </div>
                </div>

                {/* Field 4: COLLEGE */}
                <div className="border-b border-slate-200 pb-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    COLLEGE
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-0.5" title={college}>
                    {college}
                  </div>
                </div>

                {/* Field 5: CATEGORY */}
                <div className="border-b border-slate-200 pb-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    CATEGORY
                  </div>
                  <div className="text-xs font-bold text-slate-800 uppercase mt-0.5">
                    {category}
                  </div>
                </div>

                {/* Field 6 & 7: PASS NO. & ISSUE DATE */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      PASS NO.
                    </div>
                    <div className="text-xs font-black font-mono text-purple-700 mt-0.5">
                      {passNo}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      ISSUE DATE
                    </div>
                    <div className="text-xs font-bold font-mono text-slate-700 mt-0.5">
                      {issueDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Perforated ticket cut line */}
              <div className="my-4 border-t-2 border-dashed border-slate-300"></div>

              {/* Verified pass barcode / QR code representation */}
              <div className="flex items-center justify-between text-slate-600 pt-1">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-slate-900 block uppercase">
                    Desk Verification Pass
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block">
                    Dec 2–3, 2026 • Thrikkakara
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  <QrCode size={16} className="text-blue-700" />
                  <span className="text-[10px] font-mono font-bold">{cleanDigits.slice(-4) || "SCAN"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 p-3 text-center border-t border-white/10 bg-[#020713]/80">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-bold block">
              TECHNOLOGY • CREATIVITY • INNOVATION
            </span>
          </div>
        </div>
      )}

      {/* VIEW 2: LANDSCAPE BADGE (Original 1024 x 682 Template) */}
      {viewMode === 'landscape' && (
        <div className="space-y-2">
          {/* Landscape Card Container with Mobile-Safe Responsive Scaling */}
          <div 
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

          <p className="no-print text-center text-[11px] font-mono text-[#A9B8D0]">
            Tip: Switch to <strong>Smartphone Ratio</strong> above for a vertical mobile lockscreen pass.
          </p>
        </div>
      )}

      {/* Helpful Desk Instructions */}
      {showActions && (
        <div className="no-print p-4 bg-[#07172B]/60 border border-white/5 rounded-2xl flex items-start gap-3 text-xs text-[#A9B8D0] max-w-3xl mx-auto">
          <ShieldCheck size={18} className="text-[#00E5FF] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">Desk Check-in Instructions</span>
            <p className="leading-relaxed">
              Present this pass (either in Smartphone Ratio on your phone or printed) along with your college identity card at the Reception Desk on fest dates (Dec 2–3, 2026) to claim your physical badge and lucky draw token.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
