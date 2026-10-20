"use client";

import React, { useState, useEffect } from 'react';
import { Search, Download, Printer, Users, Eye, X, RefreshCw, CheckCircle2, Phone, Mail, School } from 'lucide-react';
import { OFFICIAL_EVENTS } from '@/data/events';
import { RegistrationRecord } from '@/lib/store';
import { ParticipantPass } from '@/components/events/ParticipantPass';

export default function ReceptionistParticipants() {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
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
    return (
      r.registrationNumber.toLowerCase().includes(q) ||
      r.participant.fullName.toLowerCase().includes(q) ||
      r.participant.college.toLowerCase().includes(q) ||
      r.participant.phone.includes(q) ||
      (r.teamName && r.teamName.toLowerCase().includes(q))
    );
  });

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    if (filtered.length === 0) return;

    const escapeCSV = (val: string | number | null | undefined): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Registration Number',
      'Event Name',
      'Event ID',
      'Format',
      'Participant Name',
      'College',
      'Phone',
      'Email',
      'Course',
      'Year',
      'Student ID',
      'Team Name',
      'Team Members',
      'Registration Type',
      'Payment Status',
      'Attendance Overall',
      'Day 1 Attendance',
      'Day 2 Attendance',
      'Attendance Marked By',
      'Attendance Marked Time',
      'Registration Date'
    ];

    const rows = filtered.map(r => {
      const teamMembersFormatted = r.teamMembers && r.teamMembers.length > 0
        ? r.teamMembers.map(m => `${m.name}${m.phone ? ` (${m.phone})` : ''}${m.email ? ` [${m.email}]` : ''}`).join('; ')
        : '';

      return [
        escapeCSV(r.registrationNumber),
        escapeCSV(r.eventName),
        escapeCSV(r.eventSlug || r.eventId),
        escapeCSV(r.participationType),
        escapeCSV(r.participant.fullName),
        escapeCSV(r.participant.college),
        escapeCSV(r.participant.phone),
        escapeCSV(r.participant.email),
        escapeCSV(r.participant.course || '—'),
        escapeCSV(r.participant.year || '—'),
        escapeCSV(r.participant.studentId || '—'),
        escapeCSV(r.teamName || '—'),
        escapeCSV(teamMembersFormatted || '—'),
        escapeCSV(r.source === 'receptionist_walkin' ? 'On-The-Spot Walk-in' : 'Online'),
        escapeCSV(r.paymentStatus),
        escapeCSV(r.attendanceStatus),
        escapeCSV(r.day1Attendance || 'not_marked'),
        escapeCSV(r.day2Attendance || 'not_marked'),
        escapeCSV(r.attendanceMarkedBy || '—'),
        escapeCSV(r.attendanceMarkedAt ? new Date(r.attendanceMarkedAt).toLocaleString('en-IN') : '—'),
        escapeCSV(new Date(r.registrationDate).toLocaleString('en-IN'))
      ].join(',');
    });

    // Prepend UTF-8 BOM so Microsoft Excel correctly renders all text encodings
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filterTag = eventFilter === 'all' ? 'All_Events' : eventFilter;
    const dateTag = new Date().toISOString().slice(0, 10);
    link.download = `TEKNOVA_26_Participants_${filterTag}_${dateTag}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-[#061226] p-3.5 sm:p-5 rounded-2xl border border-white/5 flex flex-wrap gap-3 sm:gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#627694]" size={16} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Reg No, Name, College, Phone..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="all">All Events ({OFFICIAL_EVENTS.length} Official)</option>
            {OFFICIAL_EVENTS.map(e => (
              <option key={e.slug} value={e.slug}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex-1 sm:flex-none justify-center px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            title={filtered.length === 0 ? "No participants available to export" : "Download participant details as .csv (Excel) file"}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 sm:p-2.5 text-[#A9B8D0] hover:text-[#00E5FF] hover:bg-[#07172B] rounded-xl border border-white/5 transition-colors shrink-0"
            title="Refresh Directory"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-bold font-space-grotesk text-white">
            Participant Directory & Badge Registry ({filtered.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
            Loading participant records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs">
            {search ? 'No participants match your query.' : 'No registrations found.'}
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
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(r => (
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
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        r.source === 'receptionist_walkin' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30'
                      }`}>
                        {r.source === 'receptionist_walkin' ? 'Walk-in' : 'Online'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedReg(r)}
                        className="px-3 py-1 bg-[#07172B] hover:bg-[#008CFF]/20 text-[#00E5FF] border border-white/10 hover:border-[#00E5FF]/40 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 mx-auto"
                      >
                        <Eye size={12} /> View / Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal View & Print Dialog */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#061226] border border-[#00E5FF]/40 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative space-y-6 my-6 text-white">
            <div className="flex items-center justify-between no-print border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#00E5FF] tracking-widest uppercase font-bold block">
                  Reception Desk Deskpass
                </span>
                <h3 className="text-xl font-black font-space-grotesk text-white">
                  Participant Entry Pass
                </h3>
                <p className="text-xs font-mono text-[#A9B8D0]">
                  {selectedReg.registrationNumber} • {selectedReg.participant.fullName}
                </p>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-[#627694] hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Official Cyberpunk Participant Pass */}
            <ParticipantPass registration={selectedReg} />

            <div className="pt-2 flex items-center justify-between text-xs text-[#627694] font-mono border-t border-white/10 no-print">
              <span>Candidate: {selectedReg.participant.phone} • {selectedReg.participant.email}</span>
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 bg-[#07172B] hover:bg-white/5 text-[#A9B8D0] hover:text-white rounded-xl text-xs font-mono border border-white/10 transition-colors"
              >
                Close Pass Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
