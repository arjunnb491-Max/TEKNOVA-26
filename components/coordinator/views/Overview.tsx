"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OfficialEvent, formatINR } from '@/data/events';
import { RegistrationRecord, ConfirmedWinnerRecord } from '@/lib/store';
import { 
  Users, UserCheck, Trophy, Calendar, MapPin, 
  ArrowRight, Clock, RefreshCw, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';

export default function CoordinatorOverview({ event }: { event: OfficialEvent }) {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [winners, setWinners] = useState<ConfirmedWinnerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [regRes, winRes] = await Promise.all([
        fetch(`/api/register?eventId=${event.slug}`),
        fetch(`/api/results?eventId=${event.slug}`)
      ]);

      const [regData, winData] = await Promise.all([
        regRes.json(),
        winRes.json()
      ]);

      setRegistrations(regData.registrations || []);
      setWinners(winData.winners || []);
    } catch (err) {
      console.error('Error loading coordinator overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [event.slug]);

  const totalRegs = registrations.length;
  const presentCount = registrations.filter(r => r.attendanceStatus === 'present' || r.day1Attendance === 'present' || r.day2Attendance === 'present').length;
  const attendanceRate = totalRegs > 0 ? Math.round((presentCount / totalRegs) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#00E5FF]/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
              Event Operations Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-space-grotesk text-white">
              {event.name} Dashboard
            </h2>
            <p className="text-xs text-[#A9B8D0]">
              {event.workingInterpretation} • Scheduled: {event.date} at {event.time} ({event.venue})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-[#07172B] hover:bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-[#00E5FF] flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Real Metric KPI Cards with Animated Roll-up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[0_0_20px_rgba(0,140,255,0.2)] transition-all flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#A9B8D0] uppercase mb-1">Total Registrations</div>
            <div className="text-3xl font-black font-space-grotesk text-white">
              <AnimatedCounter value={totalRegs} duration={900} />
            </div>
            <div className="text-[11px] text-[#00E5FF] font-mono mt-1">
              {event.participationType === 'team' ? 'Registered Squads' : 'Individual Competitors'}
            </div>
          </div>
          <div className="p-3 bg-[#008CFF]/15 text-[#00E5FF] rounded-2xl border border-[#00E5FF]/20">
            <Users size={24} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#A9B8D0] uppercase mb-1">Marked Present</div>
            <div className="text-3xl font-black font-space-grotesk text-emerald-400">
              <AnimatedCounter value={presentCount} duration={900} />
            </div>
            <div className="text-[11px] text-[#A9B8D0] font-mono mt-1">
              {attendanceRate}% Check-in Rate
            </div>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[#7B2CFF]/40 hover:shadow-[0_0_20px_rgba(123,44,255,0.2)] transition-all flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#A9B8D0] uppercase mb-1">Prize Allocation</div>
            <div className="text-xl font-bold font-mono text-[#00E5FF]">
              {event.prizePoolSubtotal > 0 ? formatINR(event.prizePoolSubtotal) : (event.prizeNote || 'TBA')}
            </div>
            <div className="text-[11px] text-[#A9B8D0] font-mono mt-1">
              {winners.length} of {event.prizes.length} Positions Confirmed
            </div>
          </div>
          <div className="p-3 bg-[#7B2CFF]/15 text-[#B44CFF] rounded-2xl border border-[#7B2CFF]/20">
            <Trophy size={24} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#A9B8D0] uppercase mb-1">Confirmed Winners</div>
            <div className="text-3xl font-black font-space-grotesk text-[#00E5FF]">
              <AnimatedCounter value={winners.length} duration={900} />
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              {winners.length >= event.prizes.length && event.prizes.length > 0 ? 'All Positions Finalized' : 'Results In Progress'}
            </div>
          </div>
          <div className="p-3 bg-[#00E5FF]/15 text-[#00E5FF] rounded-2xl border border-[#00E5FF]/20">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Event Rules & Prize Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prize Positions Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold font-space-grotesk text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy size={18} className="text-[#00E5FF]" /> Configured Prize Positions
          </h3>

          {event.prizes.length > 0 ? (
            <div className="space-y-3">
              {event.prizes.map((p, idx) => {
                const confirmed = winners.find(w => w.position === p.position);
                return (
                  <div key={idx} className="p-4 bg-[#07172B] border border-white/5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase font-bold text-white block">
                        {p.position} Prize
                      </span>
                      <span className="text-sm font-bold font-mono text-[#00E5FF]">
                        {formatINR(p.amount)}
                      </span>
                    </div>

                    <div className="text-right">
                      {confirmed ? (
                        <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 size={13} /> {confirmed.winnerName}
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          Awaiting Winner
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 bg-[#07172B] border border-white/5 rounded-2xl text-center text-xs font-mono text-[#A9B8D0]">
              {event.prizeNote || "Prize details to be announced"}
            </div>
          )}
        </div>

        {/* Operational Guidelines */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold font-space-grotesk text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar size={18} className="text-[#00E5FF]" /> Desk Checklist
          </h3>

          <div className="space-y-3 text-xs text-[#A9B8D0]">
            <div className="p-3 bg-[#07172B] rounded-xl flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#008CFF]/20 text-[#00E5FF] font-bold font-mono flex items-center justify-center shrink-0">1</span>
              <div>Verify student college ID cards against registered roster upon participant check-in.</div>
            </div>
            <div className="p-3 bg-[#07172B] rounded-xl flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#008CFF]/20 text-[#00E5FF] font-bold font-mono flex items-center justify-center shrink-0">2</span>
              <div>Record attendance under the Attendance tab before commencement of rounds.</div>
            </div>
            <div className="p-3 bg-[#07172B] rounded-xl flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#008CFF]/20 text-[#00E5FF] font-bold font-mono flex items-center justify-center shrink-0">3</span>
              <div>Submit final confirmed winners under Winner Confirmation for receptionist and admin synchronization.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
