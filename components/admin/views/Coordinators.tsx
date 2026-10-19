"use client";

import React, { useState, useEffect } from 'react';
import { UserCog, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, Mail, ShieldCheck } from 'lucide-react';
import { OFFICIAL_EVENTS } from '@/data/events';

export default function AdminCoordinators() {
  const [coordinators, setCoordinators] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(OFFICIAL_EVENTS[0].slug);
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?type=coordinators');
      const data = await res.json();
      if (data.coordinators) {
        setCoordinators(data.coordinators);
      }
    } catch (err) {
      console.error('Error loading coordinators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      return setError('Please enter a valid email address.');
    }

    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign_coordinator',
          eventSlug: selectedEvent,
          email: newEmail.trim(),
          performedBy: 'System Administrator'
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(`Assigned ${newEmail} to ${OFFICIAL_EVENTS.find(e => e.slug === selectedEvent)?.name}.`);
        setNewEmail('');
        loadData();
      } else {
        setError(data.error || 'Failed to assign coordinator.');
      }
    } catch (err) {
      setError('Connection error while assigning coordinator.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (eventSlug: string, email: string) => {
    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_coordinator',
          eventSlug,
          email,
          performedBy: 'System Administrator'
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(`Removed ${email} from event.`);
        loadData();
      } else {
        setError('Failed to remove coordinator.');
      }
    } catch (err) {
      setError('Connection error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#061226] p-6 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <UserCog className="text-[#00E5FF]" size={20} />
            Event Coordinator Assignments & Access Control
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-0.5">
            Coordinators have access restricted strictly to their assigned event workspaces.
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

      {/* Assignment Bar */}
      <div className="bg-[#061226] p-5 rounded-2xl border border-white/5 shadow-2xl">
        <form onSubmit={handleAssign} className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[#627694] uppercase tracking-wider block mb-1 text-[10px]">
              Select Event Discipline
            </label>
            <select
              value={selectedEvent}
              onChange={e => setSelectedEvent(e.target.value)}
              className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
            >
              {OFFICIAL_EVENTS.map(evt => (
                <option key={evt.slug} value={evt.slug}>{evt.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-[2] min-w-[260px]">
            <label className="text-[#627694] uppercase tracking-wider block mb-1 text-[10px]">
              Coordinator Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="e.g. coordinator@kmmcollege.edu.in"
              required
              className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all flex items-center gap-1.5"
            >
              <Plus size={14} /> Assign Official Coordinator
            </button>
          </div>
        </form>
      </div>

      {/* Assignments Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OFFICIAL_EVENTS.map(evt => {
          const assigned = coordinators[evt.slug] || [];
          return (
            <div key={evt.slug} className="bg-[#061226] p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <h3 className="font-bold font-space-grotesk text-white text-sm">
                    {evt.name}
                  </h3>
                  <span className="text-[10px] text-[#A9B8D0] font-mono">
                    {evt.workingInterpretation} • {evt.participationType.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#00E5FF] px-2 py-0.5 rounded bg-[#008CFF]/10 border border-[#008CFF]/20">
                  {assigned.length} Assigned
                </span>
              </div>

              <div className="space-y-1.5">
                {assigned.length === 0 ? (
                  <p className="text-[11px] text-[#627694] font-mono italic py-2">
                    No individual coordinators assigned. Default desk credentials active.
                  </p>
                ) : (
                  assigned.map(email => (
                    <div
                      key={email}
                      className="p-2.5 bg-[#07172B] rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2 text-white">
                        <Mail size={12} className="text-[#00E5FF]" />
                        <span>{email}</span>
                      </div>
                      <button
                        onClick={() => handleRemove(evt.slug, email)}
                        disabled={saving}
                        className="text-[#627694] hover:text-rose-400 p-1 transition-colors"
                        title="Remove Assignment"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
