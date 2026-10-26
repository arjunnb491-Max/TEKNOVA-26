"use client";

import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Clock, Save, Lock, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { OfficialEvent } from '@/data/events';
import { RegistrationRecord } from '@/lib/store';

interface AttendanceProps {
  event: OfficialEvent;
}

export default function Attendance({ event }: AttendanceProps) {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDay, setFilterDay] = useState<'overall' | 'day1' | 'day2'>('overall');
  const [attendanceState, setAttendanceState] = useState<Record<string, { status: 'present' | 'absent' | 'not_marked'; day1?: 'present' | 'absent' | 'not_marked'; day2?: 'present' | 'absent' | 'not_marked' }>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTwoDayEvent = event.slug === 'ideatek';

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/attendance?eventId=${event.slug}`);
      const data = await res.json();
      if (data.registrations) {
        setRegistrations(data.registrations);
        const map: Record<string, { status: 'present' | 'absent' | 'not_marked'; day1?: 'present' | 'absent' | 'not_marked'; day2?: 'present' | 'absent' | 'not_marked' }> = {};
        for (const r of data.registrations) {
          map[r.registrationNumber] = {
            status: r.attendanceStatus || 'not_marked',
            day1: r.day1Attendance || 'not_marked',
            day2: r.day2Attendance || 'not_marked'
          };
        }
        setAttendanceState(map);
      }
    } catch (err: any) {
      setError('Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [event.slug]);

  const setStatus = (regNo: string, status: 'present' | 'absent' | 'not_marked', day?: 'day1' | 'day2') => {
    setAttendanceState(prev => {
      const current = prev[regNo] || { status: 'not_marked', day1: 'not_marked', day2: 'not_marked' };
      if (day === 'day1') {
        const nextDay1 = status;
        const nextStatus = nextDay1 === 'present' || current.day2 === 'present' ? 'present' : nextDay1 === 'absent' && current.day2 === 'absent' ? 'absent' : current.status;
        return { ...prev, [regNo]: { ...current, day1: nextDay1, status: nextStatus } };
      } else if (day === 'day2') {
        const nextDay2 = status;
        const nextStatus = current.day1 === 'present' || nextDay2 === 'present' ? 'present' : current.day1 === 'absent' && nextDay2 === 'absent' ? 'absent' : current.status;
        return { ...prev, [regNo]: { ...current, day2: nextDay2, status: nextStatus } };
      } else {
        return { ...prev, [regNo]: { ...current, status, day1: status, day2: status } };
      }
    });
    setSaveSuccess(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError(null);
    try {
      for (const [regNo, item] of Object.entries(attendanceState)) {
        await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registrationNumber: regNo,
            status: item.status,
            day1: item.day1,
            day2: item.day2,
            markedBy: `Coordinator (${event.name})`
          })
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadData();
    } catch (err: any) {
      setError('Error saving attendance records.');
    } finally {
      setSaving(false);
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const q = search.toLowerCase();
    return (
      r.registrationNumber.toLowerCase().includes(q) ||
      r.participant.fullName.toLowerCase().includes(q) ||
      r.participant.college.toLowerCase().includes(q) ||
      (r.teamName && r.teamName.toLowerCase().includes(q))
    );
  });

  const presentCount = Object.values(attendanceState).filter(s => s.status === 'present').length;
  const absentCount = Object.values(attendanceState).filter(s => s.status === 'absent').length;
  const pendingCount = registrations.length - presentCount - absentCount;

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#061226] p-4 rounded-xl border border-white/5">
          <span className="text-[10px] font-mono text-[#627694] uppercase tracking-wider block">Total Roster</span>
          <span className="text-2xl font-bold font-space-grotesk text-white">{registrations.length}</span>
        </div>
        <div className="bg-[#061226] p-4 rounded-xl border border-emerald-500/20">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <UserCheck size={12} /> Present
          </span>
          <span className="text-2xl font-bold font-space-grotesk text-emerald-400">{presentCount}</span>
        </div>
        <div className="bg-[#061226] p-4 rounded-xl border border-rose-500/20">
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
            <UserX size={12} /> Absent
          </span>
          <span className="text-2xl font-bold font-space-grotesk text-rose-400">{absentCount}</span>
        </div>
        <div className="bg-[#061226] p-4 rounded-xl border border-amber-500/20">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Clock size={12} /> Pending Check-in
          </span>
          <span className="text-2xl font-bold font-space-grotesk text-amber-400">{pendingCount}</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#061226] rounded-2xl border border-[#00E5FF]/20 overflow-hidden shadow-2xl">
        <div className="p-3.5 sm:p-5 border-b border-white/5 flex flex-wrap gap-3 sm:gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#627694]" size={16} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search reg no, name, college, team..."
                className="w-full pl-10 pr-4 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            {isTwoDayEvent && (
              <div className="flex bg-[#07172B] rounded-xl p-1 border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setFilterDay('overall')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${filterDay === 'overall' ? 'bg-[#008CFF] text-white font-bold' : 'text-[#A9B8D0] hover:text-white'}`}
                >
                  Both Days
                </button>
                <button
                  onClick={() => setFilterDay('day1')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${filterDay === 'day1' ? 'bg-[#008CFF] text-white font-bold' : 'text-[#A9B8D0] hover:text-white'}`}
                >
                  Day 1 (Dec 2)
                </button>
                <button
                  onClick={() => setFilterDay('day2')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${filterDay === 'day2' ? 'bg-[#008CFF] text-white font-bold' : 'text-[#A9B8D0] hover:text-white'}`}
                >
                  Day 2 (Dec 3)
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 text-[#A9B8D0] hover:text-[#00E5FF] hover:bg-[#07172B] rounded-xl border border-white/5 transition-colors shrink-0"
              title="Refresh roster"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] text-xs font-bold font-mono rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2"
            >
              <Save size={14} />
              {saving ? 'Syncing...' : 'Save & Lock'}
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/30 px-5 py-2.5 text-xs text-emerald-400 font-mono flex items-center gap-2">
            <CheckCircle2 size={16} /> Attendance records synced to database successfully.
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border-b border-rose-500/30 px-5 py-2.5 text-xs text-rose-400 font-mono flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
            Loading participant roster from database...
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs">
            {search ? 'No participants matched your search.' : 'No participants registered for this event yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Participant / Team</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Format</th>
                  {isTwoDayEvent && (
                    <>
                      <th className="py-3 px-4 text-center">Day 1 Check-in</th>
                      <th className="py-3 px-4 text-center">Day 2 Check-in</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-center">Overall Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRegistrations.map(reg => {
                  const state = attendanceState[reg.registrationNumber] || { status: 'not_marked', day1: 'not_marked', day2: 'not_marked' };
                  return (
                    <tr key={reg.registrationNumber} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#00E5FF]">
                        {reg.registrationNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {reg.participant.fullName}
                        </div>
                        {reg.teamName && (
                          <div className="text-[10px] text-[#A9B8D0]">
                            Team: <span className="text-[#00E5FF]">{reg.teamName}</span>
                            {reg.teamMembers && reg.teamMembers.length > 0 && ` (${reg.teamMembers.length + 1} members)`}
                          </div>
                        )}
                        <div className="text-[10px] text-[#627694]">{reg.participant.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#A9B8D0]">
                        {reg.participant.college}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${reg.participationType === 'team' ? 'bg-[#7B2CFF]/20 text-[#B44CFF] border border-[#7B2CFF]/30' : 'bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30'}`}>
                          {reg.participationType}
                        </span>
                      </td>

                      {isTwoDayEvent && (
                        <>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex gap-1 bg-[#07172B] p-1 rounded-lg border border-white/5">
                              <button
                                onClick={() => setStatus(reg.registrationNumber, 'present', 'day1')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${state.day1 === 'present' ? 'bg-emerald-500 text-[#020713]' : 'text-[#627694] hover:text-emerald-400'}`}
                              >
                                P
                              </button>
                              <button
                                onClick={() => setStatus(reg.registrationNumber, 'absent', 'day1')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${state.day1 === 'absent' ? 'bg-rose-500 text-white' : 'text-[#627694] hover:text-rose-400'}`}
                              >
                                A
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex gap-1 bg-[#07172B] p-1 rounded-lg border border-white/5">
                              <button
                                onClick={() => setStatus(reg.registrationNumber, 'present', 'day2')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${state.day2 === 'present' ? 'bg-emerald-500 text-[#020713]' : 'text-[#627694] hover:text-emerald-400'}`}
                              >
                                P
                              </button>
                              <button
                                onClick={() => setStatus(reg.registrationNumber, 'absent', 'day2')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${state.day2 === 'absent' ? 'bg-rose-500 text-white' : 'text-[#627694] hover:text-rose-400'}`}
                              >
                                A
                              </button>
                            </div>
                          </td>
                        </>
                      )}

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex gap-1 bg-[#07172B] p-1 rounded-lg border border-white/5">
                          <button
                            onClick={() => setStatus(reg.registrationNumber, 'present')}
                            className={`px-3 py-1 rounded text-[10px] font-bold transition-colors flex items-center gap-1 ${
                              state.status === 'present' 
                                ? 'bg-emerald-500 text-[#020713] shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                                : 'text-[#627694] hover:text-emerald-400'
                            }`}
                          >
                            <UserCheck size={12} /> Present
                          </button>
                          <button
                            onClick={() => setStatus(reg.registrationNumber, 'absent')}
                            className={`px-3 py-1 rounded text-[10px] font-bold transition-colors flex items-center gap-1 ${
                              state.status === 'absent' 
                                ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                                : 'text-[#627694] hover:text-rose-400'
                            }`}
                          >
                            <UserX size={12} /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
