"use client";

import React, { useState, useEffect } from 'react';
import { OfficialEvent } from '@/data/events';
import { RegistrationRecord } from '@/lib/store';
import { Search, Download, Users, User, RefreshCw, Eye, X, Phone, Mail, School } from 'lucide-react';

export default function CoordinatorParticipants({ event }: { event: OfficialEvent }) {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/register?eventId=${event.slug}`);
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [event.slug]);

  const filtered = registrations.filter(r => {
    const q = search.toLowerCase();
    const matchName = r.participant.fullName.toLowerCase().includes(q);
    const matchCollege = r.participant.college.toLowerCase().includes(q);
    const matchReg = r.registrationNumber.toLowerCase().includes(q);
    const matchTeam = r.teamName?.toLowerCase().includes(q) || false;
    return matchName || matchCollege || matchReg || matchTeam;
  });

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['Reg Number', 'Participant Name', 'Email', 'Phone', 'College', 'Participation Type', 'Team Name', 'Members', 'Attendance', 'Registration Date'];
    const rows = registrations.map(r => [
      `"${r.registrationNumber}"`,
      `"${r.participant.fullName}"`,
      `"${r.participant.email}"`,
      `"${r.participant.phone}"`,
      `"${r.participant.college}"`,
      `"${r.participationType}"`,
      `"${r.teamName || '-'}"`,
      `"${r.teamMembers ? r.teamMembers.map(m => m.name).join('; ') : '-'}"`,
      `"${r.attendanceStatus}"`,
      `"${new Date(r.registrationDate).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.slug}_participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Actions Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A9B8D0]" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by participant name, college, registration #..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:border-[#00E5FF] outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchRegistrations}
            className="p-2.5 bg-[#07172B] hover:bg-white/5 border border-white/10 rounded-xl text-[#00E5FF] text-xs transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={exportCSV}
            disabled={registrations.length === 0}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#008CFF] hover:bg-[#00E5FF] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
          >
            <Download size={14} /> Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* Participants Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07172B] border-b border-white/5 font-mono text-[#00E5FF] uppercase">
              <tr>
                <th className="p-4">Reg Number</th>
                <th className="p-4">Participant / Team Leader</th>
                <th className="p-4">College</th>
                <th className="p-4">Format</th>
                <th className="p-4">Attendance</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#A9B8D0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center font-mono text-[#A9B8D0]">
                    Loading registered roster...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center font-mono text-[#627694]">
                    No registrations found for {event.name}.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      {r.registrationNumber}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{r.participant.fullName}</div>
                      <div className="text-[11px] text-[#627694]">{r.participant.email} • {r.participant.phone}</div>
                    </td>
                    <td className="p-4">
                      {r.participant.college}
                    </td>
                    <td className="p-4 capitalize">
                      {r.participationType}
                      {r.teamName && (
                        <div className="text-[11px] text-[#00E5FF] font-mono">Team: {r.teamName}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        r.attendanceStatus === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        r.attendanceStatus === 'absent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-white/5 text-[#A9B8D0] border border-white/10'
                      }`}>
                        {r.attendanceStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedReg(r)}
                        className="px-3 py-1.5 bg-[#07172B] hover:bg-white/10 text-[#00E5FF] rounded-lg text-xs font-mono inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#00E5FF]/30 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute top-5 right-5 text-[#A9B8D0] hover:text-white p-1 rounded-lg"
            >
              <X size={20} />
            </button>

            <span className="text-xs font-mono uppercase text-[#00E5FF] tracking-widest block mb-1">
              Roster Detail
            </span>
            <h3 className="text-xl font-bold font-space-grotesk text-white mb-4">
              {selectedReg.registrationNumber}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-[#07172B] rounded-xl space-y-2">
                <div className="text-[#A9B8D0]">Full Name: <strong className="text-white">{selectedReg.participant.fullName}</strong></div>
                <div className="text-[#A9B8D0]">College: <strong className="text-white">{selectedReg.participant.college}</strong></div>
                <div className="text-[#A9B8D0]">Email: <strong className="text-white">{selectedReg.participant.email}</strong></div>
                <div className="text-[#A9B8D0]">Phone: <strong className="text-white">{selectedReg.participant.phone}</strong></div>
                {selectedReg.participant.course && (
                  <div className="text-[#A9B8D0]">Course & Year: <strong className="text-white">{selectedReg.participant.course} ({selectedReg.participant.year})</strong></div>
                )}
              </div>

              {selectedReg.teamMembers && selectedReg.teamMembers.length > 0 && (
                <div className="p-3.5 bg-[#07172B] rounded-xl space-y-2">
                  <div className="text-xs font-mono text-[#00E5FF] uppercase font-bold">
                    Team Members ({selectedReg.teamName})
                  </div>
                  {selectedReg.teamMembers.map((m, i) => (
                    <div key={i} className="text-[#A9B8D0] border-t border-white/5 pt-1.5 mt-1.5">
                      <div className="font-bold text-white">{i + 1}. {m.name}</div>
                      <div>{m.email} {m.phone ? `• ${m.phone}` : ''}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3.5 bg-[#061226] rounded-xl space-y-1 text-[#A9B8D0]">
                <div>Registration Source: <strong className="text-white capitalize">{selectedReg.source}</strong></div>
                <div>Timestamp: <strong className="text-white">{new Date(selectedReg.registrationDate).toLocaleString('en-IN')}</strong></div>
                <div>Payment Status: <strong className="text-emerald-400 capitalize">{selectedReg.paymentStatus}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
