"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, CheckCircle2, Clock, ShieldAlert, RefreshCw, MessageSquare } from 'lucide-react';
import { OfficialEvent } from '@/data/events';
import { ComplaintRecord } from '@/lib/store';

interface ComplaintsProps {
  event: OfficialEvent;
}

export default function Complaints({ event }: ComplaintsProps) {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState<ComplaintRecord['category']>('registration');
  const [priority, setPriority] = useState<ComplaintRecord['priority']>('medium');
  const [description, setDescription] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/complaints?eventId=${event.slug}`);
      const data = await res.json();
      if (data.complaints) {
        setComplaints(data.complaints);
      }
    } catch (err) {
      setError('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Default coordinator name
    setSubmitterName(`Coordinator (${event.name})`);
  }, [event.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !submitterName.trim()) {
      setError('Please provide a description and submitter name.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.slug,
          category,
          priority,
          description: description.trim(),
          submittedBy: submitterName.trim(),
          submitterEmail: submitterEmail.trim() || undefined,
          submitterRole: 'coordinator'
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(`Ticket #${data.complaint.id} logged successfully. Central Admin has been notified.`);
        setDescription('');
        loadData();
      } else {
        setError(data.error || 'Failed to submit ticket.');
      }
    } catch (err) {
      setError('Error communicating with ticket service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#061226] p-6 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={20} />
            Coordinator Support & Escalation Desk — {event.name}
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-1">
            Log technical bugs, registration disputes, or scoring conflicts directly to Administrator.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="p-2 text-[#A9B8D0] hover:text-[#00E5FF] hover:bg-[#07172B] rounded-xl border border-white/5 transition-colors"
          title="Refresh tickets"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Submission Form */}
        <div className="bg-[#061226] rounded-2xl border border-white/5 p-6 shadow-2xl h-fit">
          <h3 className="text-sm font-bold font-space-grotesk text-white mb-4 flex items-center gap-2">
            <Send size={16} className="text-[#00E5FF]" /> File Operational Ticket
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[#A9B8D0] block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="registration">Registration Issue</option>
                <option value="attendance">Attendance Correction</option>
                <option value="results">Scoring / Results Dispute</option>
                <option value="technical">Technical / Network Bug</option>
                <option value="other">Other Operational Support</option>
              </select>
            </div>

            <div>
              <label className="text-[#A9B8D0] block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="low">Low - General Question</option>
                <option value="medium">Medium - Operational Need</option>
                <option value="high">High - Event Blocking</option>
                <option value="urgent">Urgent - Immediate Admin Action</option>
              </select>
            </div>

            <div>
              <label className="text-[#A9B8D0] block mb-1">Detailed Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue, affected participant reg number, or system error..."
                className="w-full p-3 bg-[#07172B] border border-white/10 rounded-xl text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>

            {feedback && (
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 size={14} /> {feedback}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] flex items-center gap-1.5">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Send size={14} />
              {submitting ? 'Transmitting...' : 'Submit to Admin Desk'}
            </button>
          </form>
        </div>

        {/* Existing Tickets Table */}
        <div className="lg:col-span-2 bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-5 border-b border-white/5">
            <h3 className="text-sm font-bold font-space-grotesk text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-[#00E5FF]" /> Active & Resolved Tickets ({complaints.length})
            </h3>
          </div>

          {complaints.length === 0 ? (
            <div className="p-12 text-center text-[#627694] font-mono text-xs">
              No tickets logged for this event. System operational.
            </div>
          ) : (
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[550px]">
              {complaints.map(t => (
                <div key={t.id} className="p-5 hover:bg-white/[0.02] transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-[#00E5FF] text-xs">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        t.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        t.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-white/5 text-[#A9B8D0]'
                      }`}>
                        {t.priority}
                      </span>
                      <span className="text-[10px] font-mono text-[#627694] uppercase">
                        [{t.category}]
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      t.status === 'in_progress' ? 'bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-white font-mono leading-relaxed">
                    {t.description}
                  </p>

                  {t.resolutionNotes && (
                    <div className="p-3 bg-[#07172B] rounded-xl border border-emerald-500/30 text-xs font-mono text-emerald-300">
                      <span className="font-bold block text-emerald-400">Admin Resolution ({t.assignedTo || 'Admin'}):</span>
                      {t.resolutionNotes}
                    </div>
                  )}

                  <div className="text-[10px] text-[#627694] font-mono flex items-center justify-between pt-1">
                    <span>Filed by: {t.submittedBy}</span>
                    <span>{new Date(t.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
