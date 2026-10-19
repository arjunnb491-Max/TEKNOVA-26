"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Trophy, Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { OFFICIAL_EVENTS, formatINR } from '@/data/events';

export default function EventsList() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = OFFICIAL_EVENTS.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(search.toLowerCase()) || 
      e.workingInterpretation.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-[#061226] p-5 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#627694]" size={16} />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search event name or category..." 
              className="w-full pl-10 pr-4 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Design">Design</option>
            <option value="Creative">Creative</option>
            <option value="Gaming">Gaming</option>
            <option value="Cultural">Cultural</option>
          </select>
        </div>

        <div className="text-xs font-mono text-[#627694]">
          Single Source of Truth: <span className="text-[#00E5FF] font-bold">10 Official Events</span>
        </div>
      </div>
      
      {/* Events Table */}
      <div className="bg-[#061226] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Official Event Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Venue & Date</th>
                <th className="py-3 px-4">Published Prize Pool</th>
                <th className="py-3 px-4 text-center">Public Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((e, idx) => (
                <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#627694]">
                    #{idx + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{e.name}</span>
                    <span className="text-[10px] text-[#A9B8D0]">{e.workingInterpretation}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#008CFF]/20 text-[#00E5FF] border border-[#008CFF]/30">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#A9B8D0] uppercase">
                    {e.participationType}
                  </td>
                  <td className="py-3.5 px-4 text-[#A9B8D0]">
                    <div className="text-white">{e.venue}</div>
                    <div className="text-[10px] text-[#627694]">{e.date} ({e.time})</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {e.prizes.length > 0 ? (
                      <div className="space-y-0.5">
                        {e.prizes.map((p, idx) => (
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
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/events/${e.slug}`}
                      target="_blank"
                      className="px-2.5 py-1 bg-[#07172B] hover:bg-[#008CFF]/20 text-[#00E5FF] border border-white/10 hover:border-[#00E5FF]/40 rounded-lg text-[10px] inline-flex items-center gap-1"
                    >
                      View <ExternalLink size={10} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
