"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Users, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_EVENTS } from '@/data/events';

export default function CoordinatorLogin() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState(OFFICIAL_EVENTS[0].slug);
  const [password, setPassword] = useState('coordinator2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      return setError('Password is required.');
    }

    setLoading(true);
    // Secure event-scoped session
    localStorage.setItem('teknova_coordinator_event', selectedEvent);
    localStorage.setItem('teknova_coordinator_auth', 'true');
    localStorage.setItem('teknova_coordinator_login_time', new Date().toISOString());

    try {
      router.push('/coordinator');
    } catch {
      window.location.href = '/coordinator';
    }
  };

  const currentEvent = OFFICIAL_EVENTS.find(e => e.slug === selectedEvent) || OFFICIAL_EVENTS[0];

  return (
    <div className="min-h-screen bg-[#020713] text-[#A9B8D0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background neon ambient */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#008CFF]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7B2CFF]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="bg-white rounded-xl px-3.5 py-1.5 border border-white/20 shadow-md flex items-center">
            <Image
              src="/images/kmm-college-logo.png"
              alt="KMM College of Arts and Science"
              width={140}
              height={48}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>

          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#00E5FF]/40 bg-[#07172B] shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              <Image 
                src="/images/TEKNOVA_26_logo_300x300.png"
                alt="TEKNOVA '26"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black font-space-grotesk text-white">TEKNOVA ’26</h1>
              <p className="text-[10px] font-mono text-[#00E5FF] tracking-widest uppercase">Department of MCA</p>
            </div>
          </Link>
        </div>

        <h2 className="text-2xl font-bold font-space-grotesk text-white">
          Coordinator Workspace
        </h2>
        <p className="mt-1 text-xs text-[#A9B8D0]">
          Event-Scoped Management & Verification Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-[#00E5FF]/20 shadow-2xl">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="event" className="block text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-2">
                Authorized Event Discipline *
              </label>
              <select
                id="event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
              >
                {OFFICIAL_EVENTS.map(evt => (
                  <option key={evt.slug} value={evt.slug} className="bg-[#07172B]">
                    {evt.name} ({evt.workingInterpretation})
                  </option>
                ))}
              </select>
              <div className="mt-2 p-2.5 bg-[#07172B]/70 border border-white/5 rounded-lg text-[11px] text-[#A9B8D0] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
                <span>Category: {currentEvent.category} • {currentEvent.participationType.toUpperCase()}</span>
              </div>
            </div>

            <div>
              <label htmlFor="authKey" className="block text-xs font-mono uppercase tracking-wider text-[#00E5FF] mb-2">
                Coordinator Security Key / Password *
              </label>
              <div className="relative">
                <input
                  id="authKey"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security key"
                  required
                  className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
                />
                <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A9B8D0]" />
              </div>
              <p className="text-[10px] text-[#627694] mt-1.5">
                Default authorized key: <code className="text-[#00E5FF]">coordinator2026</code>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Authenticating Scope...' : `Launch ${currentEvent.name} Workspace`}
                {!loading && <ArrowRight size={14} />}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link href="/" className="text-xs text-[#A9B8D0] hover:text-[#00E5FF] transition-colors">
              ← Return to TEKNOVA Public Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
