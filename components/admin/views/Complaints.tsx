"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, MessageSquare, RefreshCw, X, ShieldCheck, Check } from 'lucide-react';
import { ComplaintRecord } from '@/lib/store';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [resolvingTicket, setResolvingTicket] = useState<ComplaintRecord | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/complaints');
      const data = await res.json();
      if (data.complaints) {
        setComplaints(data.complaints);
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openResolveModal = (ticket: ComplaintRecord) => {
    setResolvingTicket(ticket);
    setResolutionNotes(ticket.resolutionNotes || '');
    setFeedback(null);
    setError(null);
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicket || !resolutionNotes.trim()) {
      return setError('Please enter resolution notes explaining the action taken.');
    }

    setSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve',
          complaintId: resolvingTicket.id,
          resolutionNotes: resolutionNotes.trim(),
          resolvedBy: 'System Administrator'
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(`Ticket #${resolvingTicket.id} marked resolved.`);
        setResolvingTicket(null);
        loadData();
      } else {
        setError(data.error || 'Failed to resolve ticket.');
      }
    } catch (err) {
      setError('Connection error while resolving ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = complaints.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#061226] p-6 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={20} />
            Central Complaint Desk & Resolution Center
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-0.5">
            Audit, assign, and officially resolve operational issues reported by coordinators and receptionists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open Only</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved Only</option>
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

      {/* Ticket List */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-bold font-space-grotesk text-white">
            Operational Tickets ({filtered.length})
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs">
            No complaints found for the current filter.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(t => (
              <div key={t.id} className="p-6 hover:bg-white/[0.02] transition-colors space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-[#00E5FF] text-sm">{t.id}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                      t.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      t.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-white/5 text-[#A9B8D0]'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-xs font-mono text-[#627694]">
                      [{t.category.toUpperCase()}] {t.eventName ? `• ${t.eventName}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      t.status === 'in_progress' ? 'bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>

                    {t.status !== 'resolved' && (
                      <button
                        onClick={() => openResolveModal(t)}
                        className="px-3 py-1 bg-[#00E5FF] hover:bg-[#008CFF] text-[#020713] font-bold rounded-lg text-xs font-mono transition-all"
                      >
                        Resolve Ticket
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-white font-mono leading-relaxed">
                  {t.description}
                </p>

                {t.resolutionNotes && (
                  <div className="p-3 bg-[#07172B] rounded-xl border border-emerald-500/30 text-xs font-mono text-emerald-300">
                    <span className="font-bold block text-emerald-400">Resolution ({t.assignedTo || 'Admin'}):</span>
                    {t.resolutionNotes}
                  </div>
                )}

                <div className="text-[10px] text-[#627694] font-mono flex items-center justify-between pt-1">
                  <span>Reported by: <strong className="text-[#A9B8D0]">{t.submittedBy}</strong> ({t.submitterRole})</span>
                  <span>{new Date(t.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {resolvingTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#061226] border border-[#00E5FF]/40 rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl relative space-y-4 text-white text-xs font-mono">
            <button
              onClick={() => setResolvingTicket(null)}
              className="absolute top-5 right-5 text-[#627694] hover:text-white p-2"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold">
                Resolve Ticket #{resolvingTicket.id}
              </span>
              <h3 className="text-base font-bold font-space-grotesk text-white mt-1">
                {resolvingTicket.category.toUpperCase()} — {resolvingTicket.description.slice(0, 50)}...
              </h3>
            </div>

            <form onSubmit={handleResolve} className="space-y-4">
              <div>
                <label className="text-[#A9B8D0] block mb-1">Official Resolution Notes *</label>
                <textarea
                  rows={4}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Detail the action taken (e.g. Corrected name in registry, updated registration details, adjusted attendance)..."
                  required
                  className="w-full p-3 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  className="px-4 py-2 bg-[#07172B] text-white rounded-xl border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all flex items-center gap-1.5"
                >
                  <Check size={14} />
                  {submitting ? 'Resolving...' : 'Commit Official Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
