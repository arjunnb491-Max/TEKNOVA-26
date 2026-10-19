"use client";

import React, { useState, useEffect } from 'react';
import { Award, Mail, CheckCircle2, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { CertificateRecord } from '@/lib/store';
import { OFFICIAL_EVENTS } from '@/data/events';

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState('all');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const url = eventFilter === 'all' ? '/api/certificates' : `/api/certificates?eventId=${eventFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.certificates) {
        setCertificates(data.certificates);
      }
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventFilter]);

  const handleRetryEmail = async (certId: string) => {
    setRetryingId(certId);
    setError(null);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'retry_email',
          certificateId: certId,
          performedBy: 'System Administrator'
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback('Email delivery successfully re-queued and dispatched.');
        loadData();
      } else {
        setError('Retry failed.');
      }
    } catch (err) {
      setError('Connection error while retrying email delivery.');
    } finally {
      setRetryingId(null);
    }
  };

  const sentCount = certificates.filter(c => c.emailStatus === 'sent').length;
  const failedCount = certificates.filter(c => c.emailStatus === 'failed').length;

  return (
    <div className="space-y-6">
      <div className="bg-[#061226] p-6 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <Award className="text-[#00E5FF]" size={20} />
            Central Certificate Registry & Email Queue Monitor
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-0.5">
            Cryptographically unique certificates issued to attendees and verified winners.
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#061226] p-5 rounded-2xl border border-white/5">
          <span className="text-[10px] font-mono text-[#627694] uppercase tracking-wider block mb-1">
            Total Certificates Issued
          </span>
          <span className="text-3xl font-extrabold font-space-grotesk text-white">
            {certificates.length}
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-emerald-500/20">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5 mb-1">
            <Mail size={14} /> Delivered Emails
          </span>
          <span className="text-3xl font-extrabold font-space-grotesk text-emerald-400">
            {sentCount}
          </span>
        </div>

        <div className="bg-[#061226] p-5 rounded-2xl border border-rose-500/20">
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block flex items-center gap-1.5 mb-1">
            <AlertCircle size={14} /> Failed Deliveries
          </span>
          <span className="text-3xl font-extrabold font-space-grotesk text-rose-400">
            {failedCount}
          </span>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-bold font-space-grotesk text-white">
            Certificate Registry Ledger ({certificates.length})
          </h3>
        </div>

        {certificates.length === 0 ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs">
            No certificates generated yet. Coordinators will issue certificates upon completing attendance or confirming winners.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Recipient Name</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Email Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {certificates.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#00E5FF]">
                      {c.certificateNumber}
                    </td>
                    <td className="py-3.5 px-4 text-white">
                      {c.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {c.participantName}
                      <span className="text-[10px] text-[#A9B8D0] block font-normal">{c.college}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A9B8D0]">
                      {c.eventName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        c.certificateType.includes('prize') 
                          ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' 
                          : 'bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30'
                      }`}>
                        {c.certificateType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.emailStatus === 'sent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        c.emailStatus === 'failed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {c.emailStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {c.emailStatus === 'failed' && (
                        <button
                          onClick={() => handleRetryEmail(c.id)}
                          disabled={retryingId === c.id}
                          className="px-2.5 py-1 bg-[#07172B] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold inline-flex items-center gap-1"
                        >
                          <RotateCcw size={10} className={retryingId === c.id ? 'animate-spin' : ''} /> Retry
                        </button>
                      )}
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
