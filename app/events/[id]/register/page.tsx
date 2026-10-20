"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { resolveEventByIdOrSlug, OfficialEvent, formatINR } from '@/data/events';
import { ParticipantPass } from '@/components/events/ParticipantPass';
import { 
  CheckCircle2, Users, User, ArrowLeft, ArrowRight, Printer, 
  Download, ShieldCheck, AlertCircle, Copy, Check, Calendar, MapPin, QrCode, FileText 
} from 'lucide-react';

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const event = resolveEventByIdOrSlug(eventId);

  const [step, setStep] = useState<1 | 2>(1); // 1: Form, 2: Confirmation / Receipt
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [createdRegistration, setCreatedRegistration] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    course: 'MCA',
    year: '1st Year',
    studentId: '',
    teamName: '',
    teamMembers: [
      { name: '', email: '', studentId: '', phone: '' }
    ],
    termsAccepted: false
  });

  if (!event) {
    return (
      <div className="min-h-screen bg-[#020713] text-white flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl text-center max-w-md">
          <AlertCircle size={40} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-sm text-[#A9B8D0] mb-6">The requested event could not be identified in the official catalogue.</p>
          <Link href="/events" className="px-6 py-2.5 bg-[#008CFF] rounded-xl text-xs font-mono uppercase font-bold">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isTeam = event.participationType === 'team';
  const minTeamMembers = event.teamSize?.min ? event.teamSize.min - 1 : 1; // leader is member 1
  const maxTeamMembers = event.teamSize?.max ? event.teamSize.max - 1 : 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.teamMembers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, teamMembers: updated };
    });
  };

  const addMember = () => {
    if (formData.teamMembers.length < maxTeamMembers) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { name: '', email: '', studentId: '', phone: '' }]
      }));
    }
  };

  const removeMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validations
    if (!formData.fullName.trim()) return setErrorMessage('Full Name is required.');
    if (!formData.email.trim()) return setErrorMessage('Email Address is required.');
    if (!formData.phone.trim() || formData.phone.replace(/[^0-9]/g, '').length < 10) {
      return setErrorMessage('Valid 10-digit Mobile Number is required.');
    }
    if (!formData.college.trim()) return setErrorMessage('College Name is required.');
    if (!formData.termsAccepted) return setErrorMessage('Please acknowledge the rules and terms.');

    if (isTeam) {
      if (!formData.teamName.trim()) return setErrorMessage('Team Name is required for team registration.');
      // Check if minimum members filled
      for (let i = 0; i < formData.teamMembers.length; i++) {
        const mem = formData.teamMembers[i];
        if (mem.name.trim() && !mem.email.trim()) {
          return setErrorMessage(`Please provide email address for Team Member ${i + 2}.`);
        }
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug: event.slug,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          course: formData.course,
          year: formData.year,
          studentId: formData.studentId,
          participationType: event.participationType,
          teamName: isTeam ? formData.teamName : undefined,
          teamMembers: isTeam ? formData.teamMembers.filter(m => m.name.trim().length > 0) : [],
          source: 'public'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setCreatedRegistration(data.registration);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyRegNumber = () => {
    if (createdRegistration?.registrationNumber) {
      navigator.clipboard.writeText(createdRegistration.registrationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          
          {/* Breadcrumb Navigation (Hidden in print) */}
          <nav className="no-print flex text-xs font-mono text-[#A9B8D0] mb-8 items-center gap-2">
            <Link href="/" className="hover:text-[#00E5FF]">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-[#00E5FF]">Events</Link>
            <span>/</span>
            <Link href={`/events/${event.slug}`} className="hover:text-[#00E5FF]">{event.name}</Link>
            <span>/</span>
            <span className="text-[#00E5FF] font-bold">Register</span>
          </nav>

          {/* STEP 1: Registration Form */}
          {step === 1 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-white/10 gap-4">
                <div>
                  <span className="text-xs font-mono text-[#00E5FF] uppercase font-bold tracking-widest block mb-1">
                    Event Registration Form
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black font-space-grotesk text-white">
                    {event.name}
                  </h1>
                  <p className="text-xs text-[#A9B8D0] mt-1">
                    {event.category} • {event.workingInterpretation}
                  </p>
                </div>

                <div className="px-3.5 py-1.5 bg-[#07172B] border border-[#00E5FF]/30 rounded-xl text-xs font-mono text-[#00E5FF] flex items-center gap-1.5">
                  {isTeam ? <Users size={14} /> : <User size={14} />}
                  <span>{isTeam ? `Team Event (${event.teamSize?.min || 1}–${event.teamSize?.max || 4} members)` : 'Individual'}</span>
                </div>
              </div>

              {/* Error notice */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-sm text-rose-300">
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-400" />
                  <div>{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section A: Team Details (If team event) */}
                {isTeam && (
                  <div className="p-6 bg-[#061226] border border-white/5 rounded-2xl space-y-4">
                    <h3 className="text-base font-bold font-space-grotesk text-white uppercase tracking-wider flex items-center gap-2">
                      <Users size={18} className="text-[#00E5FF]" /> Team Information
                    </h3>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B8D0] mb-2 uppercase tracking-wider">
                        Team Name *
                      </label>
                      <input 
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleInputChange}
                        placeholder="e.g. CyberKnights, Algorithmics"
                        required
                        className="w-full px-4 py-3 bg-[#07172B] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Section B: Primary Participant / Team Leader Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold font-space-grotesk text-white uppercase tracking-wider flex items-center gap-2">
                    <User size={18} className="text-[#00E5FF]" /> 
                    {isTeam ? "Team Leader (Primary Contact)" : "Participant Information"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#A9B8D0] mb-1.5 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input 
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        required
                        className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B8D0] mb-1.5 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. student@college.edu"
                        required
                        className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B8D0] mb-1.5 uppercase tracking-wider">
                        Mobile Number *
                      </label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        required
                        className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B8D0] mb-1.5 uppercase tracking-wider">
                        College / Institution Name *
                      </label>
                      <input 
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        placeholder="e.g. KMM College, Model Engineering College"
                        required
                        className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B8D0] mb-1.5 uppercase tracking-wider">
                        Course / Degree
                      </label>
                      <select 
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
                      >
                        <option value="MCA">MCA</option>
                        <option value="BCA">BCA</option>
                        <option value="B.Tech (CS/IT)">B.Tech (CS/IT)</option>
                        <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B8D0] mb-1.5 uppercase tracking-wider">
                        Year of Study
                      </label>
                      <select 
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white text-sm focus:border-[#00E5FF] outline-none"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section C: Additional Team Members (If Team Event) */}
                {isTeam && maxTeamMembers > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold font-space-grotesk text-white uppercase tracking-wider">
                        Team Members (Max {event.teamSize?.max || 4} total including leader)
                      </h3>
                      {formData.teamMembers.length < maxTeamMembers && (
                        <button
                          type="button"
                          onClick={addMember}
                          className="px-3 py-1 bg-[#008CFF]/20 hover:bg-[#008CFF]/30 text-[#00E5FF] border border-[#00E5FF]/30 rounded-lg text-xs font-mono"
                        >
                          + Add Member
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {formData.teamMembers.map((member, index) => (
                        <div key={index} className="p-4 bg-[#061226] border border-white/5 rounded-xl space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-[#00E5FF] font-bold">
                              Member #{index + 2}
                            </span>
                            {formData.teamMembers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMember(index)}
                                className="text-xs text-rose-400 hover:text-rose-300"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input 
                              type="text"
                              value={member.name}
                              onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                              placeholder="Member Name"
                              className="px-3 py-2 bg-[#07172B] border border-white/10 rounded-lg text-xs text-white"
                            />
                            <input 
                              type="email"
                              value={member.email}
                              onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                              placeholder="Member Email"
                              className="px-3 py-2 bg-[#07172B] border border-white/10 rounded-lg text-xs text-white"
                            />
                            <input 
                              type="tel"
                              value={member.phone || ''}
                              onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                              placeholder="Phone (Optional)"
                              className="px-3 py-2 bg-[#07172B] border border-white/10 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms and Confirmation */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 rounded bg-[#061226] border-white/20 text-[#008CFF] focus:ring-[#00E5FF]"
                    />
                    <span className="text-xs text-[#A9B8D0] leading-relaxed">
                      I confirm that the details provided are accurate. I will present a valid college ID card upon desk check-in on fest dates (Dec 2–3, 2026) and agree to follow the official rules of {event.name}.
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-4 flex justify-end gap-4">
                  <Link
                    href={`/events/${event.slug}`}
                    className="px-6 py-3.5 bg-[#07172B] text-white hover:bg-white/5 border border-white/10 rounded-xl text-xs font-mono uppercase font-bold"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] text-white rounded-xl text-xs font-mono uppercase font-bold transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? 'Registering In Database...' : 'Confirm Registration'}
                    {!submitting && <ArrowRight size={14} />}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Registration Confirmation & Official Participant Pass */}
          {step === 2 && createdRegistration && (
            <div className="space-y-8">
              {/* Success Notification Bar (Hidden in print) */}
              <div className="no-print glass-panel p-6 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={32} className="text-emerald-400 shrink-0" />
                  <div>
                    <h2 className="text-lg font-bold text-white font-space-grotesk">Registration Confirmed!</h2>
                    <p className="text-xs text-[#A9B8D0]">
                      Successfully recorded in the database. Save your official pass image or print it below.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/events"
                    className="px-4 py-2 bg-[#07172B] hover:bg-white/5 text-white border border-white/10 rounded-xl text-xs font-mono transition-colors"
                  >
                    Explore More Events
                  </Link>
                </div>
              </div>

              {/* The Official Cyberpunk Participant Pass */}
              <ParticipantPass
                registration={createdRegistration}
                eventCategory={event.category}
              />

              {/* Supplementary Details & Contest Summary */}
              <div className="no-print pt-2">
                <div className="glass-panel rounded-2xl border border-white/10 p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                    <div>
                      <span className="text-xs font-mono text-[#00E5FF] uppercase tracking-wider block">
                        Contest Details
                      </span>
                      <h3 className="text-base font-bold text-white font-space-grotesk">
                        {createdRegistration.eventName}
                      </h3>
                      <p className="text-xs text-[#A9B8D0] mt-0.5">{event.workingInterpretation}</p>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[10px] font-mono text-[#A9B8D0] block">VENUE & TIMING</span>
                      <span className="text-xs font-bold text-white font-mono">
                        {event.venue} • {event.date} ({event.time})
                      </span>
                    </div>
                  </div>

                  {/* Team Members if applicable */}
                  {createdRegistration.teamMembers && createdRegistration.teamMembers.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase font-bold text-[#A9B8D0]">
                        Team Roster ({createdRegistration.teamMembers.length + 1} Members) — Team {createdRegistration.teamName}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 bg-[#061226] border border-white/10 rounded-xl">
                          <span className="font-bold text-white">1. {createdRegistration.participant.fullName}</span>
                          <span className="text-[#00E5FF] text-[10px] ml-1.5 font-mono">(Leader)</span>
                          <div className="text-[11px] text-[#A9B8D0] mt-0.5">{createdRegistration.participant.email}</div>
                        </div>
                        {createdRegistration.teamMembers.map((m: any, i: number) => (
                          <div key={i} className="p-3 bg-[#061226] border border-white/10 rounded-xl">
                            <span className="font-bold text-white">{i + 2}. {m.name}</span>
                            <div className="text-[11px] text-[#A9B8D0] mt-0.5">{m.email}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs border-t border-white/10">
                    <span className="text-[#A9B8D0]">
                      Need to reprint or verify later? Use the self-service lookup portal anytime.
                    </span>
                    <Link
                      href="/lookup"
                      className="text-[#00E5FF] hover:underline font-mono font-bold"
                    >
                      Visit Lookup Page →
                    </Link>
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
