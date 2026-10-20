"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { Search, Printer, ShieldCheck, AlertCircle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegistrationLookupPage() {
  const [regNumber, setRegNumber] = useState('');
  const [verification, setVerification] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<any>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRecord(null);

    if (!regNumber.trim() || !verification.trim()) {
      return setError('Please provide both Registration Number and Email/Phone verification.');
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/register?regNumber=${encodeURIComponent(regNumber.trim())}&verify=${encodeURIComponent(verification.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration record could not be verified.');
      }

      setRecord(data.registration);
    } catch (err: any) {
      setError(err.message || 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#020713] text-[#A9B8D0] font-sans antialiased">
      <div className="no-print">
        <Navbar />
      </div>

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          
          <div className="no-print text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2 block">
              Participant Self-Service
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-space-grotesk text-white mb-3 glow-cyan">
              RECEIPT & PASS LOOKUP
            </h1>
            <p className="text-xs md:text-sm text-[#A9B8D0] max-w-lg mx-auto leading-relaxed">
              Retrieve and print your official TEKNOVA ’26 registration receipt. For privacy, your registration number and registered email/phone are required.
            </p>
          </div>

          {/* Lookup Form */}
          {!record && (
            <div className="no-print glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-xs text-rose-300">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLookup} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder="e.g. TK26-BUGS-0001"
                    required
                    className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white font-mono text-sm focus:border-[#00E5FF] outline-none"
                  />
                  <p className="text-[11px] text-[#627694] mt-1">Generated upon initial form submission.</p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#00E5FF] uppercase tracking-wider mb-2">
                    Security Verification (Email or Phone) *
                  </label>
                  <input
                    type="text"
                    value={verification}
                    onChange={(e) => setVerification(e.target.value)}
                    placeholder="Enter email or mobile number used during registration"
                    required
                    className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
                  />
                  <p className="text-[11px] text-[#627694] mt-1">Protects your personal information from unauthorized access.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Verifying Credentials...' : 'Lookup Official Pass'}
                    {!loading && <ArrowRight size={14} />}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Verified Receipt Output */}
          {record && (
            <div className="space-y-6">
              <div className="no-print flex justify-between items-center bg-[#07172B] p-4 rounded-xl border border-white/10">
                <button
                  onClick={() => setRecord(null)}
                  className="text-xs font-mono text-[#00E5FF] hover:underline"
                >
                  ← Lookup Another Registration
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#008CFF] hover:bg-[#00E5FF] text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer size={14} /> Print Receipt
                </button>
              </div>

              {/* Printable Receipt Card */}
              <div className="receipt-container bg-white text-slate-900 rounded-2xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl relative overflow-hidden">
                <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-4 text-left">
                      <Image
                        src="/images/kmm-college-logo.png"
                        alt="KMM College of Arts and Science"
                        width={130}
                        height={46}
                        className="h-10 sm:h-12 w-auto object-contain"
                      />
                      <div>
                        <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-500">
                          OFFICIAL FESTIVAL RECEIPT
                        </div>
                        <div className="text-2xl font-black tracking-tight text-slate-950">
                          TEKNOVA ’26
                        </div>
                        <div className="text-xs font-medium text-slate-600">
                          Department of MCA • KMM College of Arts and Science
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-500">REGISTRATION NUMBER</div>
                      <div className="text-xl font-mono font-black text-indigo-700 tracking-wider">
                        {record.registrationNumber}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(record.registrationDate).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="inline-block px-4 py-1 bg-slate-950 text-white text-xs font-mono font-bold tracking-widest uppercase rounded">
                    CONTEST PARTICIPATION PASS
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm mb-8 pb-8 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Event Registered</span>
                    <strong className="text-base text-slate-950">{record.eventName}</strong>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Participation Format</span>
                    <strong className="text-base text-slate-950 capitalize">{record.participationType}</strong>
                    {record.teamName && (
                      <div className="text-xs text-indigo-700 font-semibold">Team: {record.teamName}</div>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Participant / Leader Name</span>
                    <strong className="text-slate-950">{record.participant.fullName}</strong>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">College / Institution</span>
                    <strong className="text-slate-950">{record.participant.college}</strong>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Email & Mobile</span>
                    <div className="text-slate-900">{record.participant.email} • {record.participant.phone}</div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Payment Verification Status</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase">
                      {record.paymentStatus === 'verified' ? 'Verified / Free Entry' : 'Verified (On-Spot Cleared)'}
                    </span>
                  </div>
                </div>

                {record.teamMembers && record.teamMembers.length > 0 && (
                  <div className="mb-8 pb-8 border-b border-slate-200">
                    <h4 className="text-xs font-mono uppercase font-bold text-slate-500 mb-3">
                      Team Roster ({record.teamMembers.length + 1} Members)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                        <span className="font-bold">1. {record.participant.fullName}</span> (Leader)
                      </div>
                      {record.teamMembers.map((m: any, i: number) => (
                        <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                          <span className="font-bold">{i + 2}. {m.name}</span> ({m.email})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-end pt-2 text-xs text-slate-500 gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-700">Fest Day Instructions:</div>
                    <div>1. Present this printed pass or digital copy at reception on Dec 2–3.</div>
                    <div>2. Bring valid college student ID card.</div>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="h-10 border-b border-slate-400 w-36 mb-1 ml-auto"></div>
                    <div className="text-[10px] font-mono text-slate-600">Authorized Signature / Seal</div>
                    <div className="text-[9px] text-slate-400">Department of MCA</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
