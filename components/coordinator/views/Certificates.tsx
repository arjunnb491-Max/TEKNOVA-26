"use client";

import React, { useState, useEffect } from 'react';
import { Award, Mail, CheckCircle2, Clock, AlertCircle, RefreshCw, RotateCcw, ExternalLink, ShieldCheck } from 'lucide-react';
import { OfficialEvent } from '@/data/events';
import { CertificateRecord, RegistrationRecord } from '@/lib/store';

interface CertificatesProps {
  event: OfficialEvent;
}

export default function Certificates({ event }: CertificatesProps) {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [certRes, regRes] = await Promise.all([
        fetch(`/api/certificates?eventId=${event.slug}`),
        fetch(`/api/attendance?eventId=${event.slug}`)
      ]);

      const certData = await certRes.json();
      const regData = await regRes.json();

      if (certData.certificates) {
        setCertificates(certData.certificates);
      }
      if (regData.registrations) {
        setRegistrations(regData.registrations);
      }
    } catch (err: any) {
      setError('Failed to load certificates or roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [event.slug]);

  const handleIssueParticipation = async () => {
    setGenerating(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'issue_participation',
          eventId: event.slug,
          performedBy: `Coordinator (${event.name})`
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(`Issued ${data.issued} new participation certificates (${data.skipped} already issued). Only attendees marked present are eligible.`);
        loadData();
      } else {
        setError(data.error || 'Failed to issue certificates.');
      }
    } catch (err: any) {
      setError('Error communicating with certificate service.');
    } finally {
      setGenerating(false);
    }
  };

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
          performedBy: `Coordinator (${event.name})`
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
      setError('Retry connection error.');
    } finally {
      setRetryingId(null);
    }
  };

  const eligibleCount = registrations.filter(r => r.attendanceStatus === 'present' || r.day1Attendance === 'present').length;
  const issuedCount = certificates.length;
  const emailsSent = certificates.filter(c => c.emailStatus === 'sent').length;
  const emailsFailed = certificates.filter(c => c.emailStatus === 'failed').length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#061226] p-4 rounded-xl border border-white/5">
          <span className="text-[10px] font-mono text-[#627694] uppercase tracking-wider block">Eligible Attendees</span>
          <span className="text-2xl font-bold font-space-grotesk text-white">{eligibleCount}</span>
        </div>
        <div className="bg-[#061226] p-4 rounded-xl border border-emerald-500/20">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Award size={12} /> Certificates Issued
          </span>
          <span className="text-2xl font-bold font-space-grotesk text-emerald-400">{issuedCount}</span>
        </div>
        <div className="bg-[#061226] p-4 rounded-xl border border-[#00E5FF]/20">
          <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block flex items-center gap-1.5">
            <Mail size={12} /> Emails Dispatched
          </span>
          <span className="text-2xl font-bold font-space-grotesk text-[#00E5FF]">{emailsSent}</span>
        </div>
        <div className="bg-[#061226] p-4 rounded-xl border border-rose-500/20">
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
            <AlertCircle size={12} /> Delivery Failures
          </span>
          <span className="text-2xl font-bold font-space-grotesk text-rose-400">{emailsFailed}</span>
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

      {/* Main Certificates Registry */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h3 className="text-sm font-bold font-space-grotesk text-white">
              Official Certificates & Email Dispatch Engine — {event.name}
            </h3>
            <p className="text-xs text-[#627694] font-mono mt-0.5">
              Certificates are strictly issued only to present participants. Duplicates are prevented by unique constraints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 text-[#A9B8D0] hover:text-[#00E5FF] hover:bg-[#07172B] rounded-xl border border-white/5 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleIssueParticipation}
              disabled={generating || eligibleCount === 0}
              className="px-5 py-2 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] text-xs font-bold font-mono rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Award size={14} />
              {generating ? 'Generating...' : 'Issue All Eligible Participation Certificates'}
            </button>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs">
            {eligibleCount > 0 
              ? `${eligibleCount} participants are marked present and eligible. Click "Issue All Eligible Participation Certificates" above to generate certificates.`
              : 'No participants marked present yet. Mark attendance first in the Attendance tab.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Issued At</th>
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
                    <td className="py-3.5 px-4 text-white font-bold">
                      {c.participantName}
                    </td>
                    <td className="py-3.5 px-4 text-[#A9B8D0]">
                      {c.college}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.certificateType.includes('prize') 
                          ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' 
                          : 'bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30'
                      }`}>
                        {c.certificateType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#627694]">
                      {new Date(c.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.emailStatus === 'sent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        c.emailStatus === 'failed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {c.emailStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {c.emailStatus === 'failed' && (
                        <button
                          onClick={() => handleRetryEmail(c.id)}
                          disabled={retryingId === c.id}
                          className="px-2.5 py-1 rounded bg-[#07172B] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold transition-colors inline-flex items-center gap-1"
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
