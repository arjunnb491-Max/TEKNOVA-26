"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, UserCheck } from 'lucide-react';
import { OfficialEvent, formatINR } from '@/data/events';
import { ConfirmedWinnerRecord, RegistrationRecord } from '@/lib/store';

interface PrizesProps {
  event: OfficialEvent;
}

export default function Prizes({ event }: PrizesProps) {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [confirmedWinners, setConfirmedWinners] = useState<ConfirmedWinnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [regsRes, winnersRes] = await Promise.all([
        fetch(`/api/attendance?eventId=${event.slug}`),
        fetch(`/api/results?eventId=${event.slug}`)
      ]);

      const regsData = await regsRes.json();
      const winnersData = await winnersRes.json();

      if (regsData.registrations) {
        setRegistrations(regsData.registrations);
      }

      if (winnersData.winners) {
        setConfirmedWinners(winnersData.winners);
        const map: Record<string, string> = {};
        for (const w of winnersData.winners) {
          map[w.position] = w.registrationNumber;
        }
        setSelections(map);
      }
    } catch (err: any) {
      setError('Failed to load winners or registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [event.slug]);

  const handleSelect = (position: string, regNo: string) => {
    setSelections(prev => ({
      ...prev,
      [position]: regNo
    }));
    setFeedback(null);
    setError(null);
  };

  const handleConfirmWinner = async (position: '1st' | '2nd' | '3rd') => {
    const regNo = selections[position];
    if (!regNo) {
      setError(`Please select a candidate for ${position} prize.`);
      return;
    }

    setSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.slug,
          position,
          registrationNumber: regNo,
          confirmedBy: `Coordinator (${event.name})`
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(`Confirmed ${position} Prize winner for ${event.name}! Handed over to Receptionist and Admin.`);
        loadData();
      } else {
        setError(data.error || 'Failed to confirm winner.');
      }
    } catch (err: any) {
      setError('Network error while confirming winner.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPositionIcon = (pos: string) => {
    if (pos === '1st') return <Trophy className="text-amber-400" size={20} />;
    if (pos === '2nd') return <Medal className="text-slate-300" size={20} />;
    return <Award className="text-amber-700" size={20} />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#061226] p-6 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <Trophy className="text-[#00E5FF]" size={20} />
            Official Result & Winner Declaration — {event.name}
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-1">
            Confirmed winners are immediately synced to Receptionist Portal, Admin Analytics, and Certificate Engine.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="p-2 text-[#A9B8D0] hover:text-[#00E5FF] hover:bg-[#07172B] rounded-xl border border-white/5 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedback}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-400 flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Prize Position Cards */}
      {event.prizes.length === 0 ? (
        <div className="bg-[#061226] p-12 rounded-2xl border border-white/5 text-center text-[#627694] font-mono text-xs">
          Prize details to be announced by organizers for {event.name}. Winner confirmation will unlock once prize configuration is finalized.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {event.prizes.map((prize) => {
            const currentWinner = confirmedWinners.find(w => w.position === prize.position);
            const selectedRegNo = selections[prize.position];
            const isConfirmed = Boolean(currentWinner);

            return (
              <div
                key={prize.position}
                className={`bg-[#061226] rounded-2xl p-6 border transition-all ${
                  isConfirmed 
                    ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                    : 'border-white/10 hover:border-[#00E5FF]/30'
                }`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    {getPositionIcon(prize.position)}
                    <span className="text-sm font-bold font-space-grotesk text-white">
                      {prize.position} Prize
                    </span>
                  </div>
                  <span className="text-sm font-extrabold font-space-grotesk text-emerald-400">
                    {formatINR(prize.amount)}
                  </span>
                </div>

                <div className="py-5 space-y-3">
                  <label className="text-[10px] font-mono uppercase text-[#627694] block">
                    Select Valid Candidate
                  </label>
                  <select
                    value={selectedRegNo || ''}
                    onChange={e => handleSelect(prize.position, e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                  >
                    <option value="">-- Choose Winner --</option>
                    {registrations.map(r => (
                      <option key={r.registrationNumber} value={r.registrationNumber}>
                        {r.registrationNumber} - {r.teamName || r.participant.fullName} ({r.participant.college}) {r.totalScore ? `[${r.totalScore} pts]` : ''}
                      </option>
                    ))}
                  </select>

                  {currentWinner && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono">
                      <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Confirmed: {currentWinner.winnerName}
                      </span>
                      <span className="text-[10px] text-[#A9B8D0] block mt-0.5">
                        {currentWinner.college} • {currentWinner.registrationNumber}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleConfirmWinner(prize.position as any)}
                  disabled={submitting || !selectedRegNo}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
                    isConfirmed 
                      ? 'bg-[#07172B] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10' 
                      : 'bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  }`}
                >
                  {isConfirmed ? 'Update & Re-confirm' : 'Confirm Official Winner'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmed Winners Table */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-bold font-space-grotesk text-white">
            Confirmed Winners Registry ({confirmedWinners.length})
          </h3>
        </div>

        {confirmedWinners.length === 0 ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs">
            No winners confirmed yet. Select candidates above to finalize the results.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Winner Name</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Prize Amount</th>
                  <th className="py-3 px-4">Confirmed At</th>
                  <th className="py-3 px-4 text-center">Certificate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {confirmedWinners.map(w => (
                  <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      {getPositionIcon(w.position)} {w.position} Place
                    </td>
                    <td className="py-3.5 px-4 text-[#00E5FF] font-bold">
                      {w.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4 text-white font-bold">
                      {w.winnerName}
                      {w.teamName && <span className="text-[10px] text-[#A9B8D0] block">Team: {w.teamName}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-[#A9B8D0]">
                      {w.college}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-extrabold">
                      {formatINR(w.prizeAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-[#627694]">
                      {new Date(w.confirmedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        Auto-Issued
                      </span>
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
