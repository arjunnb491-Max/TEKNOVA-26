"use client";

import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, RefreshCw, CalendarDays } from 'lucide-react';
import { OFFICIAL_EVENTS } from '@/data/events';
import { RegistrationRecord } from '@/lib/store';

export default function AdminAttendance() {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const url = selectedEvent === 'all' ? '/api/register' : `/api/register?eventId=${selectedEvent}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.registrations) {
        setRegistrations(data.registrations);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedEvent]);

  const presentList = registrations.filter(r => r.attendanceStatus === 'present' || r.day1Attendance === 'present' || r.day2Attendance === 'present');
  const absentList = registrations.filter(r => r.attendanceStatus === 'absent');
  const pendingCount = registrations.length - presentList.length - absentList.length;

  return (
    <div className="space-y-6">
      <div className="bg-[#061226] p-6 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <UserCheck className="text-emerald-400" size={20} />
            Central Fest Attendance Control & Check-in Desk
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-0.5">
            Attendance locked by coordinators gates eligibility for official participation certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            className="px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="all">All Events</option>
            {OFFICIAL_EVENTS.map(e => (
              <option key={e.slug} value={e.slug}>{e.name}</option>
            ))}
          </select>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 text-[#A9B8D0] hover:text-[#00E5FF] hover:bg-[#07172B] rounded-xl border border-white/5 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#061226] p-5 rounded-2xl border border-emerald-500/20">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5 mb-1">
            <UserCheck size={14} /> Total Checked-In (Present)
          </span>
          <span className="text-3xl font-extrabold font-space-grotesk text-emerald-400">
            {presentList.length}
          </span>
          <span className="text-[11px] text-[#627694] font-mono block mt-1">
            Eligible for Certificate Generation
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-rose-500/20">
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block flex items-center gap-1.5 mb-1">
            <UserX size={14} /> Marked Absent
          </span>
          <span className="text-3xl font-extrabold font-space-grotesk text-rose-400">
            {absentList.length}
          </span>
          <span className="text-[11px] text-[#627694] font-mono block mt-1">
            Ineligible for Certificates
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-amber-500/20">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block flex items-center gap-1.5 mb-1">
            <Clock size={14} /> Pending Desk Check-in
          </span>
          <span className="text-3xl font-extrabold font-space-grotesk text-amber-400">
            {pendingCount}
          </span>
          <span className="text-[11px] text-[#627694] font-mono block mt-1">
            Awaiting Coordinator Verification
          </span>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-bold font-space-grotesk text-white">
            Live Attendance Ledger ({registrations.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                <th className="py-3 px-4">Reg No</th>
                <th className="py-3 px-4">Participant / Team</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Marked By</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {registrations.map(r => (
                <tr key={r.registrationNumber} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#00E5FF]">
                    {r.registrationNumber}
                  </td>
                  <td className="py-3.5 px-4 text-white font-bold">
                    {r.participant.fullName}
                    {r.teamName && (
                      <span className="text-[10px] text-[#A9B8D0] block">
                        Team: {r.teamName}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#A9B8D0]">
                    {r.eventName}
                  </td>
                  <td className="py-3.5 px-4 text-[#627694]">
                    {r.participant.college}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      r.attendanceStatus === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      r.attendanceStatus === 'absent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {r.attendanceStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#A9B8D0]">
                    {r.attendanceMarkedBy || 'Desk Verification'}
                  </td>
                  <td className="py-3.5 px-4 text-[#627694]">
                    {r.attendanceMarkedAt ? new Date(r.attendanceMarkedAt).toLocaleTimeString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
