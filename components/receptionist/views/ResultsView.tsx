"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, RefreshCw, ExternalLink, Calendar } from 'lucide-react';
import { ConfirmedWinnerRecord } from '@/lib/store';
import { formatINR, OFFICIAL_EVENTS } from '@/data/events';

export default function ResultsView() {
  const [winners, setWinners] = useState<ConfirmedWinnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const url = eventFilter === 'all' ? '/api/results' : `/api/results?eventId=${eventFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.winners) {
        setWinners(data.winners);
      }
    } catch (err) {
      console.error('Failed to load confirmed results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventFilter]);

  const getPositionBadge = (pos: string) => {
    if (pos === '1st') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold font-space-grotesk bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center gap-1.5 w-fit">
          <Trophy size={14} /> 1st Place
        </span>
      );
    }
    if (pos === '2nd') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold font-space-grotesk bg-slate-300/20 text-slate-300 border border-slate-300/30 flex items-center gap-1.5 w-fit">
          <Medal size={14} /> 2nd Place
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold font-space-grotesk bg-amber-700/20 text-amber-500 border border-amber-700/30 flex items-center gap-1.5 w-fit">
        <Award size={14} /> 3rd Place
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#061226] p-5 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <Trophy className="text-[#00E5FF]" size={20} />
            Official Declared Results & Winners Registry
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-0.5">
            Confirmed results submitted by official event coordinators. Read-only for reception desk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
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

      {/* Results Table */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
            Loading confirmed results...
          </div>
        ) : winners.length === 0 ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs">
            No winners confirmed yet for the selected filter. Coordinators will declare results as competitions conclude.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Prize Position</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Winner Name</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Prize Amount</th>
                  <th className="py-3 px-4">Confirmed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {winners.map(w => (
                  <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {w.eventName}
                    </td>
                    <td className="py-3.5 px-4">
                      {getPositionBadge(w.position)}
                    </td>
                    <td className="py-3.5 px-4 text-[#00E5FF] font-bold">
                      {w.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4 text-white font-bold">
                      {w.winnerName}
                      {w.teamName && (
                        <span className="text-[10px] text-[#A9B8D0] block">
                          Team: {w.teamName}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#A9B8D0]">
                      {w.college}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-extrabold text-sm">
                      {formatINR(w.prizeAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-[#627694]">
                      {new Date(w.confirmedAt).toLocaleDateString()}
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
