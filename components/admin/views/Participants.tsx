"use client";

import React, { useState, useEffect } from 'react';
import { Search, Download, Users, RefreshCw, Eye, X } from 'lucide-react';
import { OFFICIAL_EVENTS } from '@/data/events';
import { RegistrationRecord } from '@/lib/store';

export default function AdminParticipants() {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const url = eventFilter === 'all' ? '/api/register' : `/api/register?eventId=${eventFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.registrations) {
        setRegistrations(data.registrations);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventFilter]);

  const filtered = registrations.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = (
      r.registrationNumber.toLowerCase().includes(q) ||
      r.participant.fullName.toLowerCase().includes(q) ||
      r.participant.college.toLowerCase().includes(q) ||
      r.participant.phone.includes(q) ||
      (r.teamName && r.teamName.toLowerCase().includes(q))
    );
    const matchType = typeFilter === 'all' || r.participationType === typeFilter;
    return matchSearch && matchType;
  });

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['Registration Number', 'Event Name', 'Participant Name', 'College', 'Phone', 'Email', 'Type', 'Team Name', 'Source', 'Attendance', 'Date'];
    const rows = filtered.map(r => [
      r.registrationNumber,
      `"${r.eventName}"`,
      `"${r.participant.fullName}"`,
      `"${r.participant.college}"`,
      `"${r.participant.phone}"`,
      `"${r.participant.email}"`,
      r.participationType,
      `"${r.teamName || ''}"`,
      r.source,
      r.attendanceStatus,
      new Date(r.registrationDate).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TEKNOVA_26_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-[#061226] p-5 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#627694]" size={16} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Reg No, Name, College..."
              className="w-full pl-10 pr-4 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
            className="px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="all">All Events (10 Official)</option>
            {OFFICIAL_EVENTS.map(e => (
              <option key={e.slug} value={e.slug}>{e.name}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="all">All Formats</option>
            <option value="individual">Individual Only</option>
            <option value="team">Teams Only</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 text-[#A9B8D0] hover:text-[#00E5FF] hover:bg-[#07172B] rounded-xl border border-white/5 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="px-4 py-2 bg-[#07172B] hover:bg-[#008CFF]/20 text-[#00E5FF] border border-white/10 hover:border-[#00E5FF]/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <Download size={14} /> Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                <th className="py-3 px-4">Reg No</th>
                <th className="py-3 px-4">Participant / Team</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#627694] font-mono text-xs">
                    {search ? 'No participants match your search query.' : 'No participant registrations found in the database.'}
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                <tr key={r.registrationNumber} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#00E5FF]">
                    {r.registrationNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">
                      {r.participant.fullName}
                    </div>
                    {r.teamName && (
                      <div className="text-[10px] text-[#A9B8D0]">
                        Team: <span className="text-[#00E5FF]">{r.teamName}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-[#627694]">{r.participant.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#A9B8D0]">
                    {r.eventName}
                  </td>
                  <td className="py-3.5 px-4 text-[#627694]">
                    {r.participant.college}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[#A9B8D0]">
                    {r.participationType}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      r.source === 'receptionist_walkin' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30'
                    }`}>
                      {r.source === 'receptionist_walkin' ? 'Walk-in' : 'Online'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      r.attendanceStatus === 'present' ? 'bg-emerald-500/20 text-emerald-400' :
                      r.attendanceStatus === 'absent' ? 'bg-rose-500/20 text-rose-400' :
                      'text-[#627694]'
                    }`}>
                      {r.attendanceStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedReg(r)}
                      className="px-2.5 py-1 bg-[#07172B] hover:bg-[#008CFF]/20 text-[#00E5FF] border border-white/10 rounded-lg text-[10px] font-bold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#061226] border border-[#00E5FF]/40 rounded-3xl max-w-xl w-full p-6 lg:p-8 shadow-2xl relative space-y-4 text-white text-xs font-mono">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute top-5 right-5 text-[#627694] hover:text-white p-2"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold">
                Participant Record Details
              </span>
              <h3 className="text-xl font-bold font-space-grotesk text-white">
                {selectedReg.participant.fullName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#07172B] rounded-xl border border-white/5">
                <span className="text-[10px] text-[#627694] block">Registration No</span>
                <span className="text-[#00E5FF] font-bold block">{selectedReg.registrationNumber}</span>
              </div>
              <div className="p-3 bg-[#07172B] rounded-xl border border-white/5">
                <span className="text-[10px] text-[#627694] block">Event</span>
                <span className="text-white font-bold block">{selectedReg.eventName}</span>
              </div>
              <div className="p-3 bg-[#07172B] rounded-xl border border-white/5">
                <span className="text-[10px] text-[#627694] block">College</span>
                <span className="text-white block truncate">{selectedReg.participant.college}</span>
              </div>
              <div className="p-3 bg-[#07172B] rounded-xl border border-white/5">
                <span className="text-[10px] text-[#627694] block">Contact</span>
                <span className="text-[#A9B8D0] block">{selectedReg.participant.phone}</span>
                <span className="text-[#627694] text-[10px] block truncate">{selectedReg.participant.email}</span>
              </div>
            </div>

            {selectedReg.teamName && (
              <div className="p-3 bg-[#07172B] rounded-xl border border-[#7B2CFF]/30">
                <span className="text-[#B44CFF] font-bold block mb-1">
                  Team: {selectedReg.teamName}
                </span>
                {selectedReg.teamMembers && selectedReg.teamMembers.map((m, idx) => (
                  <div key={idx} className="text-[11px] text-[#A9B8D0]">
                    #{idx + 2}: {m.name} ({m.phone || 'Phone verified'})
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 bg-[#07172B] text-white rounded-xl border border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
