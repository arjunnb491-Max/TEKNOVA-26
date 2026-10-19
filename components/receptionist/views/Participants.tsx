"use client";

import React, { useState, useEffect } from 'react';
import { Search, Download, Printer, Users, Eye, X, RefreshCw, CheckCircle2, Phone, Mail, School } from 'lucide-react';
import { OFFICIAL_EVENTS } from '@/data/events';
import { RegistrationRecord } from '@/lib/store';

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

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-[#061226] p-5 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#627694]" size={16} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Reg No, Name, College, Phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="all">All Events (10 Official)</option>
            {OFFICIAL_EVENTS.map(e => (
              <option key={e.slug} value={e.slug}>{e.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="p-2.5 text-[#A9B8D0] hover:text-[#00E5FF] hover:bg-[#07172B] rounded-xl border border-white/5 transition-colors"
          title="Refresh Directory"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#061226] border border-[#00E5FF]/40 rounded-3xl max-w-2xl w-full p-6 lg:p-8 shadow-2xl relative space-y-6 printable-receipt text-white">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute top-5 right-5 text-[#627694] hover:text-white p-2 no-print"
            >
              <X size={20} />
            </button>

            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#00E5FF] tracking-widest uppercase font-bold block">
                  KMM College of Arts and Science • MCA Department
                </span>
                <h3 className="text-xl font-black font-space-grotesk text-white">
                  TEKNOVA ’26 OFFICIAL ENTRY PASS
                </h3>
                <p className="text-xs font-mono text-[#A9B8D0]">
                  December 2–3, 2026 • Thrikkakara
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[#627694] block uppercase">Reg No</span>
                <span className="text-lg font-extrabold font-mono text-[#00E5FF]">
                  {selectedReg.registrationNumber}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#07172B] rounded-xl border border-white/5">
                <span className="text-[10px] text-[#627694] block">Event</span>
                <span className="text-white font-bold block mt-0.5">{selectedReg.eventName}</span>
              </div>
              <div className="p-3 bg-[#07172B] rounded-xl border border-white/5">
                <span className="text-[10px] text-[#627694] block">Candidate</span>
                <span className="text-white font-bold block mt-0.5">{selectedReg.participant.fullName}</span>
              </div>
              <div className="p-3 bg-[#07172B] rounded-xl border border-white/5">
                <span className="text-[10px] text-[#627694] block">Mobile & Email</span>
                <span className="text-[#A9B8D0] block mt-0.5">{selectedReg.participant.phone}</span>
                <span className="text-[#627694] text-[10px] block truncate">{selectedReg.participant.email}</span>
              </div>
              <div className="p-3 bg-[#07172B] rounded-xl border border-white/5">
                <span className="text-[10px] text-[#627694] block">College</span>
                <span className="text-white font-bold block mt-0.5 truncate">{selectedReg.participant.college}</span>
              </div>
            </div>

            {selectedReg.teamName && (
              <div className="p-4 bg-[#07172B] rounded-xl border border-[#7B2CFF]/30 text-xs font-mono">
                <span className="text-[#B44CFF] font-bold block mb-1">
                  Team: {selectedReg.teamName} (Leader: {selectedReg.participant.fullName})
                </span>
                {selectedReg.teamMembers && selectedReg.teamMembers.length > 0 && (
                  <div className="text-[11px] text-[#A9B8D0] space-y-0.5">
                    {selectedReg.teamMembers.map((m, idx) => (
                      <div key={idx}>Member {idx + 2}: {m.name} ({m.phone || 'Phone verified'})</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between no-print">
              <span className="text-[11px] text-[#627694] font-mono">
                Source: {selectedReg.source} • Registered: {new Date(selectedReg.registrationDate).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 shadow-lg"
                >
                  <Printer size={14} /> Print Pass
                </button>
                <button
                  onClick={() => setSelectedReg(null)}
                  className="px-4 py-2 bg-[#07172B] text-[#A9B8D0] hover:text-white rounded-xl text-xs font-mono border border-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
