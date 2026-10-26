"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Trophy, 
  Calendar, 
  Search, 
  ArrowRight, 
  RefreshCw,
  Printer,
  AlertTriangle,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { RegistrationRecord } from '@/lib/store';
import { formatINR } from '@/data/events';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';

interface OverviewProps {
  onTabChange?: (tab: string) => void;
}

export default function ReceptionistOverview({ onTabChange }: OverviewProps) {
  const [stats, setStats] = useState<any>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, regsRes] = await Promise.all([
        fetch('/api/admin?type=stats'),
        fetch('/api/register')
      ]);

      const statsData = await statsRes.json();
      const regsData = await regsRes.json();

      if (statsData.stats) setStats(statsData.stats);
      if (regsData.registrations) setRecentRegistrations(regsData.registrations.slice(0, 8));
    } catch (err) {
      console.error('Error loading receptionist overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRegs = stats?.totalRegistrations || 0;
  const indRegs = stats?.individualRegistrations || 0;
  const teamRegs = stats?.teamRegistrations || 0;
  const spotRegs = recentRegistrations.filter(r => r.source === 'receptionist_walkin').length;
  const confirmedWinners = stats?.confirmedWinners || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#061226] p-6 lg:p-8 rounded-2xl border border-white/5 relative overflow-hidden flex flex-wrap items-center justify-between gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#008CFF]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
            <span className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest font-bold">
              KMM College MCA • Thrikkakara
            </span>
          </div>
          <h2 className="text-2xl font-bold font-space-grotesk text-white">
            TEKNOVA ’26 Reception Desk
          </h2>
          <p className="text-xs text-[#A9B8D0] font-mono mt-1 max-w-xl">
            Real-time live registration intake, badge printing, verified pass lookup, and participant queries for Dec 2–3, 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-3 bg-[#07172B] hover:bg-white/5 text-[#A9B8D0] hover:text-[#00E5FF] rounded-xl border border-white/10 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          {onTabChange && (
            <button
              onClick={() => onTabChange('spot-registration')}
              className="px-5 py-3 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] text-xs font-bold font-mono uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2"
            >
              <UserPlus size={16} /> New On-The-Spot Registration
            </button>
          )}
        </div>
      </div>

      {/* Real KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#061226] p-5 rounded-2xl border border-white/5 hover:border-[#00E5FF]/30 transition-all duration-300">
          <div className="flex items-center justify-between text-[#627694] mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Registrations</span>
            <Users size={18} className="text-[#00E5FF]" />
          </div>
          <span className="text-3xl font-extrabold font-space-grotesk text-white block">
            <AnimatedCounter value={totalRegs} duration={900} />
          </span>
          <span className="text-[11px] font-mono text-[#A9B8D0] mt-1 block">
            {indRegs} Individual • {teamRegs} Teams
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300">
          <div className="flex items-center justify-between text-emerald-400 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">On-the-Spot Walk-ins</span>
            <UserPlus size={18} />
          </div>
          <span className="text-3xl font-extrabold font-space-grotesk text-emerald-400 block">
            <AnimatedCounter value={spotRegs} duration={900} />
          </span>
          <span className="text-[11px] font-mono text-[#627694] mt-1 block">
            Issued at Reception Desk
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300">
          <div className="flex items-center justify-between text-amber-400 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Confirmed Winners</span>
            <Trophy size={18} />
          </div>
          <span className="text-3xl font-extrabold font-space-grotesk text-amber-400 block">
            <AnimatedCounter value={confirmedWinners} duration={900} />
          </span>
          <span className="text-[11px] font-mono text-[#627694] mt-1 block">
            Declared by Coordinators
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-[#7B2CFF]/30 hover:border-[#7B2CFF]/60 transition-all duration-300">
          <div className="flex items-center justify-between text-[#B44CFF] mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Official Events</span>
            <Calendar size={18} />
          </div>
          <span className="text-3xl font-extrabold font-space-grotesk text-white block">
            <AnimatedCounter value={10} duration={900} />
          </span>
          <span className="text-[11px] font-mono text-[#A9B8D0] mt-1 block">
            Catalogue Active
          </span>
        </div>
      </div>

      {/* Quick Desk Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Spot Registration', desc: 'Register walk-in student or squad', tab: 'spot-registration', icon: UserPlus, color: 'text-[#00E5FF]' },
          { label: 'Lookup & Print Receipt', desc: 'Search pass and print badge', tab: 'participants', icon: Printer, color: 'text-emerald-400' },
          { label: 'Confirmed Winners', desc: 'View official declared results', tab: 'results', icon: Trophy, color: 'text-amber-400' },
          { label: 'Submit Desk Ticket', desc: 'Report badge or data correction', tab: 'complaints', icon: AlertTriangle, color: 'text-rose-400' },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              onClick={() => onTabChange && onTabChange(action.tab)}
              className="bg-[#061226] hover:bg-[#07172B] p-5 rounded-2xl border border-white/5 hover:border-[#00E5FF]/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={22} className={action.color} />
                <ArrowRight size={14} className="text-[#627694] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold font-space-grotesk text-white mb-1">{action.label}</h4>
              <p className="text-xs text-[#627694] font-mono">{action.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Recent Desk Activity Table */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold font-space-grotesk text-white">
              Recent Registration Activity
            </h3>
            <p className="text-xs text-[#627694] font-mono mt-0.5">
              Live registrations across official events
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onTabChange && (
              <button
                onClick={() => onTabChange('participants')}
                className="px-3 py-1.5 bg-[#07172B] hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Go to Participant Directory to export CSV (Excel)"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            )}
            {onTabChange && (
              <button
                onClick={() => onTabChange('participants')}
                className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1"
              >
                View Full Directory →
              </button>
            )}
          </div>
        </div>

        {recentRegistrations.length === 0 ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs">
            No registrations in the database yet. Click "Spot Registration" to register a candidate.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Participant / Team</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentRegistrations.map(reg => (
                  <tr key={reg.registrationNumber} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#00E5FF]">
                      {reg.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4 text-white font-bold">
                      {reg.participant.fullName}
                      {reg.teamName && (
                        <span className="text-[10px] text-[#A9B8D0] block">
                          Team: {reg.teamName}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#A9B8D0]">
                      {reg.eventName}
                    </td>
                    <td className="py-3.5 px-4 text-[#627694]">
                      {reg.participant.college}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        reg.source === 'receptionist_walkin' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30'
                      }`}>
                        {reg.source === 'receptionist_walkin' ? 'On-The-Spot' : 'Online'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#627694]">
                      {new Date(reg.registrationDate).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
