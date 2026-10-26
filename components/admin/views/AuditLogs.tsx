"use client";

import React, { useState, useEffect } from 'react';
import { History, Search, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AuditLogRecord } from '@/lib/store';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?type=audit');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.performedBy.toLowerCase().includes(q) ||
      (l.details && l.details.toLowerCase().includes(q)) ||
      (l.eventName && l.eventName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#061226] p-6 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <History className="text-[#00E5FF]" size={20} />
            System Audit Trail & Security Ledger
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-0.5">
            Immutable chronological logging of registrations, attendance locks, and winner confirmations.
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

      <div className="bg-[#061226] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#627694]" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search action, user, or event..."
            className="w-full pl-10 pr-4 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
          />
        </div>
      </div>

      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-bold font-space-grotesk text-white">
            Audit Records ({filtered.length})
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[#627694] font-mono text-xs">
            No audit records match your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Event Discipline</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4">Action Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-[#627694] whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#00E5FF] whitespace-nowrap">
                      {l.action}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[#A9B8D0] text-[10px] uppercase font-bold">
                        {l.entityType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white">
                      {l.eventName || l.eventId || 'System Wide'}
                    </td>
                    <td className="py-3.5 px-4 text-[#A9B8D0] whitespace-nowrap">
                      {l.performedBy}
                    </td>
                    <td className="py-3.5 px-4 text-white text-[11px] max-w-md">
                      {l.details}
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
