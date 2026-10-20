"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarDays, 
  UserCheck, 
  Award, 
  AlertTriangle, 
  Mail, 
  RefreshCw, 
  Trophy, 
  UserCog, 
  History,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { AuditLogRecord } from '@/lib/store';
import { OFFICIAL_EVENTS, formatINR } from '@/data/events';

interface OverviewProps {
  onTabChange?: (tab: string) => void;
}

export default function AdminOverview({ onTabChange }: OverviewProps) {
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.logs) setAuditLogs(data.logs);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
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
  const presentCount = stats?.presentCount || 0;
  const absentCount = stats?.absentCount || 0;
  const certsIssued = stats?.certificatesIssued || 0;
  const confirmedWinners = stats?.confirmedWinners || 0;
  const openComplaints = stats?.openComplaints || 0;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-[#061226] p-4 sm:p-6 lg:p-8 rounded-2xl border border-white/5 relative overflow-hidden flex flex-wrap items-center justify-between gap-4 sm:gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7B2CFF]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-mono text-[#00E5FF] uppercase tracking-widest font-bold">
              KMM College MCA • Central Administration
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-space-grotesk text-white">
            TEKNOVA ’26 Master Operations Dashboard
          </h2>
          <p className="text-xs text-[#A9B8D0] font-mono mt-1 max-w-xl">
            Live database-backed management of registrations, coordinator scopes, attendance locking, winner confirmation, and certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-3 bg-[#07172B] hover:bg-white/5 text-[#A9B8D0] hover:text-[#00E5FF] rounded-xl border border-white/10 transition-colors"
            title="Refresh System Stats"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#061226] p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-[#627694] mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Registrations</span>
            <Users size={18} className="text-[#00E5FF]" />
          </div>
          <span className="text-3xl font-extrabold font-space-grotesk text-white block">
            {totalRegs}
          </span>
          <span className="text-[11px] font-mono text-[#A9B8D0] mt-1 block">
            {indRegs} Individual • {teamRegs} Teams
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center justify-between text-emerald-400 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Attendance Check-in</span>
            <UserCheck size={18} />
          </div>
          <span className="text-3xl font-extrabold font-space-grotesk text-emerald-400 block">
            {presentCount}
          </span>
          <span className="text-[11px] font-mono text-[#627694] mt-1 block">
            {absentCount} Absent • {totalRegs - presentCount - absentCount} Unmarked
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-[#00E5FF]/20">
          <div className="flex items-center justify-between text-[#00E5FF] mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Certificates Issued</span>
            <Award size={18} />
          </div>
          <span className="text-3xl font-extrabold font-space-grotesk text-[#00E5FF] block">
            {certsIssued}
          </span>
          <span className="text-[11px] font-mono text-[#627694] mt-1 block">
            {confirmedWinners} Winners Confirmed
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-rose-500/20">
          <div className="flex items-center justify-between text-rose-400 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Open Tickets / Complaints</span>
            <AlertTriangle size={18} />
          </div>
          <span className="text-3xl font-extrabold font-space-grotesk text-rose-400 block">
            {openComplaints}
          </span>
          <span className="text-[11px] font-mono text-[#627694] mt-1 block">
            Requiring Admin Action
          </span>
        </div>
      </div>

      {/* Event-wise Distribution & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Breakdown */}
        <div className="lg:col-span-2 bg-[#061226] rounded-2xl border border-white/5 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
                <CalendarDays className="text-[#00E5FF]" size={18} />
                Event-Wise Registrations & Attendance
              </h3>
              <p className="text-xs text-[#627694] font-mono">
                Single Source of Truth across the {stats?.totalEvents || OFFICIAL_EVENTS.length} official events
              </p>
            </div>
            {onTabChange && (
              <button
                onClick={() => onTabChange('events')}
                className="text-xs font-mono text-[#00E5FF] hover:underline"
              >
                Manage Events →
              </button>
            )}
          </div>

          <div className="space-y-3">
            {OFFICIAL_EVENTS.map(evt => {
              const eventStats = stats?.eventWise?.[evt.slug] || { count: 0, present: 0 };
              const count = eventStats.count;
              const present = eventStats.present;
              const maxScale = Math.max(10, ...Object.values(stats?.eventWise || {}).map((x: any) => x.count || 0));
              const pct = Math.min(100, Math.round((count / maxScale) * 100));

              return (
                <div key={evt.slug} className="p-3 bg-[#07172B] rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white truncate max-w-[240px]">
                      {evt.name}
                    </span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-[#00E5FF] font-bold">{count} Regs</span>
                      <span className="text-emerald-400">({present} Present)</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#008CFF] to-[#00E5FF] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live System Audit Stream */}
        <div className="bg-[#061226] rounded-2xl border border-white/5 p-6 shadow-2xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <h3 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
              <History className="text-[#00E5FF]" size={18} />
              Live Audit Trail
            </h3>
            {onTabChange && (
              <button
                onClick={() => onTabChange('audit')}
                className="text-xs font-mono text-[#00E5FF] hover:underline"
              >
                All Logs →
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {auditLogs.length === 0 ? (
              <div className="text-center py-16 text-xs font-mono text-[#627694]">
                No recent system events logged yet.
              </div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-[#07172B]/60 rounded-xl border border-white/5 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#00E5FF] uppercase">
                      {log.action}
                    </span>
                    <span className="text-[#627694]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-white text-[11px] leading-snug">
                    {log.details}
                  </p>
                  <div className="text-[10px] text-[#627694]">
                    By: {log.performedBy}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
