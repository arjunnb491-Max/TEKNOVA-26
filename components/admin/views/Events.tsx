"use client";

import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Edit3, 
  Save, 
  X, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  MapPin, 
  Clock, 
  DollarSign,
  Plus,
  Trash2
} from 'lucide-react';
import { OFFICIAL_EVENTS, OfficialEvent, formatINR } from '@/data/events';

export default function AdminEvents() {
  const [events, setEvents] = useState<OfficialEvent[]>(OFFICIAL_EVENTS);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<OfficialEvent | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [fee, setFee] = useState<number | undefined>(undefined);
  const [regOpen, setRegOpen] = useState(true);
  const [description, setDescription] = useState('');
  const [prizes, setPrizes] = useState<{ position: string; amount: number }[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?type=events');
      const data = await res.json();
      if (data.events && data.events.length > 0) {
        setEvents(data.events);
      } else {
        setEvents(OFFICIAL_EVENTS);
      }
    } catch (err) {
      setEvents(OFFICIAL_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const startEdit = (evt: OfficialEvent) => {
    setEditingEvent(evt);
    setName(evt.name);
    setCategory(evt.category);
    setVenue(evt.venue || '');
    setDate(evt.date || '');
    setTime(evt.time || '');
    setFee(evt.registrationFee ?? undefined);
    setRegOpen(evt.registrationOpen ?? true);
    setDescription(evt.description || '');
    setPrizes([...evt.prizes]);
    setFeedback(null);
    setError(null);
  };

  const addPrize = () => {
    const nextPos = prizes.length === 0 ? '1st' : prizes.length === 1 ? '2nd' : '3rd';
    setPrizes(prev => [...prev, { position: nextPos, amount: 2000 }]);
  };

  const removePrize = (idx: number) => {
    setPrizes(prev => prev.filter((_, i) => i !== idx));
  };

  const updatePrize = (idx: number, field: string, val: any) => {
    setPrizes(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_event',
          eventSlug: editingEvent.slug,
          updates: {
            name: name.trim(),
            category: category.trim(),
            venue: venue.trim(),
            date: date.trim(),
            time: time.trim(),
            registrationFee: fee ? Number(fee) : undefined,
            registrationOpen: regOpen,
            description: description.trim(),
            prizes: prizes.map(p => ({ position: p.position as any, amount: Number(p.amount) }))
          },
          performedBy: 'System Administrator'
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(`Event "${editingEvent.name}" updated successfully.`);
        setEditingEvent(null);
        loadData();
      } else {
        setError(data.error || 'Failed to update event.');
      }
    } catch (err) {
      setError('Error communicating with server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#061226] p-6 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <CalendarDays className="text-[#00E5FF]" size={20} />
            Official Event Catalogue & Prize Management
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-0.5">
            Single Source of Truth: 10 official events. Edit rules, prize positions, venue, and registration status.
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
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Events Cards / Table */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Official Event Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Schedule & Venue</th>
                <th className="py-3 px-4">Published Prizes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((evt, idx) => (
                <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#627694]">
                    #{idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {evt.name}
                    <span className="text-[10px] text-[#A9B8D0] block font-normal">
                      {evt.workingInterpretation}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30">
                      {evt.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[#A9B8D0]">
                    {evt.participationType}
                  </td>
                  <td className="py-3.5 px-4 text-[#A9B8D0]">
                    <div className="text-white">{evt.venue}</div>
                    <div className="text-[10px] text-[#627694]">{evt.date} ({evt.time})</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {evt.prizes.length > 0 ? (
                      <div className="space-y-0.5">
                        {evt.prizes.map((p, idx) => (
                          <div key={idx} className="text-emerald-400 font-bold text-[11px]">
                            {p.position}: {formatINR(p.amount)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#627694] italic text-[10px]">
                        Prize details to be announced
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.registrationOpen !== false 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {evt.registrationOpen !== false ? 'OPEN' : 'CLOSED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => startEdit(evt)}
                      className="px-3 py-1 bg-[#07172B] hover:bg-[#008CFF]/20 text-[#00E5FF] border border-white/10 hover:border-[#00E5FF]/40 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1.5"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#061226] border border-[#00E5FF]/40 rounded-3xl max-w-2xl w-full p-6 lg:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-white text-xs font-mono">
            <button
              onClick={() => setEditingEvent(null)}
              className="absolute top-5 right-5 text-[#627694] hover:text-white p-2"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold">
                Edit Event Configuration
              </span>
              <h3 className="text-xl font-bold font-space-grotesk text-white">
                {editingEvent.name}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A9B8D0] block mb-1">Display Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <label className="text-[#A9B8D0] block mb-1">Category *</label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <label className="text-[#A9B8D0] block mb-1">Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <label className="text-[#A9B8D0] block mb-1">Date & Time</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      placeholder="e.g. Dec 2, 2026"
                      className="w-1/2 px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                    <input
                      type="text"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className="w-1/2 px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#A9B8D0] block mb-1">Registration Fee (₹)</label>
                  <input
                    type="number"
                    value={fee ?? ''}
                    onChange={e => setFee(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0 for Free"
                    className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <label className="text-[#A9B8D0] block mb-1">Registration Status</label>
                  <select
                    value={regOpen ? 'true' : 'false'}
                    onChange={e => setRegOpen(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                  >
                    <option value="true">OPEN — Accepting Registrations</option>
                    <option value="false">CLOSED — Locked</option>
                  </select>
                </div>
              </div>

              {/* Prize Pool Configuration */}
              <div className="p-4 bg-[#07172B] rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#00E5FF] font-bold flex items-center gap-1.5">
                    <Trophy size={14} /> Configured Prize Pool
                  </span>
                  <button
                    type="button"
                    onClick={addPrize}
                    className="px-2.5 py-1 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 rounded-lg hover:bg-[#00E5FF]/30 text-[10px] flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Prize
                  </button>
                </div>

                {prizes.length === 0 ? (
                  <p className="text-[11px] text-[#627694] italic">
                    No prizes configured yet. Public site will display "Prize details to be announced".
                  </p>
                ) : (
                  prizes.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={p.position}
                        onChange={e => updatePrize(idx, 'position', e.target.value)}
                        placeholder="Position (1st, 2nd, 3rd)"
                        className="w-24 px-2.5 py-1.5 bg-[#020713] border border-white/10 rounded-lg text-white"
                      />
                      <input
                        type="number"
                        value={p.amount}
                        onChange={e => updatePrize(idx, 'amount', Number(e.target.value))}
                        placeholder="Amount in INR"
                        className="flex-1 px-2.5 py-1.5 bg-[#020713] border border-white/10 rounded-lg text-white font-mono text-emerald-400 font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => removePrize(idx)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div>
                <label className="text-[#A9B8D0] block mb-1">Event Description & Rules</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-3 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-[#07172B] text-[#A9B8D0] hover:text-white rounded-xl border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2"
                >
                  <Save size={14} />
                  {saving ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
