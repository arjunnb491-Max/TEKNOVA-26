"use client";

import React, { useState } from 'react';
import { 
  UserPlus, 
  Users, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { OFFICIAL_EVENTS, OfficialEvent } from '@/data/events';
import { RegistrationRecord } from '@/lib/store';
import { ParticipantPass } from '@/components/events/ParticipantPass';

export default function SpotRegistration() {
  const [selectedEventSlug, setSelectedEventSlug] = useState(OFFICIAL_EVENTS[0].slug);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [studentId, setStudentId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<{ name: string; email: string; phone: string; studentId: string }[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedReg, setCompletedReg] = useState<RegistrationRecord | null>(null);

  const selectedEvent: OfficialEvent = 
    OFFICIAL_EVENTS.find(e => e.slug === selectedEventSlug) || OFFICIAL_EVENTS[0];

  const isTeam = selectedEvent.participationType === 'team';

  const addTeamMember = () => {
    if (teamMembers.length >= 3) return;
    setTeamMembers(prev => [...prev, { name: '', email: '', phone: '', studentId: '' }]);
  };

  const removeTeamMember = (idx: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const updateTeamMember = (idx: number, field: string, value: string) => {
    setTeamMembers(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !college.trim()) {
      return setError('Please fill all required personal information fields.');
    }

    if (isTeam && !teamName.trim()) {
      return setError('Team Name is required for team events.');
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug: selectedEvent.slug,
          participant: {
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            college: college.trim(),
            course: course.trim() || undefined,
            year: year.trim() || undefined,
            studentId: studentId.trim() || undefined
          },
          participationType: selectedEvent.participationType,
          teamName: isTeam ? teamName.trim() : undefined,
          teamMembers: isTeam ? teamMembers.filter(m => m.name.trim()) : undefined,
          source: 'receptionist_walkin',
          registeredBy: 'Reception Desk',
          paymentStatus: 'verified' // Walk-in desk collects cash/on-spot
        })
      });

      const data = await res.json();
      if (data.success && data.registration) {
        setCompletedReg(data.registration);
      } else {
        setError(data.error || 'Failed to submit spot registration.');
      }
    } catch (err: any) {
      setError('Network error while processing registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCollege('');
    setCourse('');
    setYear('');
    setStudentId('');
    setTeamName('');
    setTeamMembers([]);
    setCompletedReg(null);
    setError(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-[#061226] p-6 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
            <UserPlus className="text-[#00E5FF]" size={20} />
            On-The-Spot Participant & Team Registration Desk
          </h2>
          <p className="text-xs text-[#627694] font-mono mt-0.5">
            Issue verified fest entry passes and sync instantly to coordinator roster.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-400 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Confirmation Modal / Print View */}
      {completedReg ? (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> Registration generated successfully: <strong className="text-white">{completedReg.registrationNumber}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 bg-[#00E5FF] text-[#020713] font-bold rounded-lg hover:shadow-lg flex items-center gap-1.5 transition-all"
              >
                <Printer size={14} /> Print Desk Badge
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 bg-[#07172B] text-white rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                Register Another
              </button>
            </div>
          </div>

          {/* The Official Cyberpunk Participant Pass */}
          <ParticipantPass registration={completedReg} />
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} className="bg-[#061226] p-6 lg:p-8 rounded-3xl border border-[#00E5FF]/20 shadow-2xl space-y-6 text-xs font-mono">
          {/* Event Selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold block mb-2">
              Select Official Event Discipline *
            </label>
            <select
              value={selectedEventSlug}
              onChange={e => setSelectedEventSlug(e.target.value)}
              className="w-full px-4 py-3 bg-[#07172B] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00E5FF]"
            >
              {OFFICIAL_EVENTS.map(evt => (
                <option key={evt.slug} value={evt.slug}>
                  {evt.name} — {evt.workingInterpretation} ({evt.participationType.toUpperCase()})
                </option>
              ))}
            </select>
            <div className="mt-2 text-[11px] text-[#A9B8D0]">
              Category: <span className="text-white font-bold">{selectedEvent.category}</span> • Venue: <span className="text-white font-bold">{selectedEvent.venue}</span> • Schedule: <span className="text-white font-bold">{selectedEvent.date} ({selectedEvent.time})</span>
            </div>
          </div>

          {/* Team Fields (if team event) */}
          {isTeam && (
            <div className="p-4 bg-[#07172B] rounded-2xl border border-[#7B2CFF]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#B44CFF] font-bold flex items-center gap-1.5">
                  <Users size={16} /> Team Configuration ({selectedEvent.name})
                </span>
                <span className="text-[10px] text-[#A9B8D0]">Max 4 members</span>
              </div>

              <div>
                <label className="text-[#A9B8D0] block mb-1">Official Team Name *</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  placeholder="e.g. CyberKnights"
                  required
                  className="w-full px-3 py-2 bg-[#020713] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#B44CFF]"
                />
              </div>

              {/* Dynamic Additional Members */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#A9B8D0]">Additional Squad Members</span>
                  {teamMembers.length < 3 && (
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="px-2.5 py-1 bg-[#7B2CFF]/20 text-[#B44CFF] border border-[#7B2CFF]/30 rounded-lg hover:bg-[#7B2CFF]/30 flex items-center gap-1 text-[10px]"
                    >
                      <Plus size={12} /> Add Member
                    </button>
                  )}
                </div>

                {teamMembers.map((m, idx) => (
                  <div key={idx} className="p-3 bg-[#020713] rounded-xl border border-white/5 flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] text-[#627694] w-6">#{idx + 2}</span>
                    <input
                      type="text"
                      value={m.name}
                      onChange={e => updateTeamMember(idx, 'name', e.target.value)}
                      placeholder="Member Full Name"
                      className="flex-1 min-w-[140px] px-2.5 py-1.5 bg-[#07172B] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#B44CFF]"
                    />
                    <input
                      type="tel"
                      value={m.phone}
                      onChange={e => updateTeamMember(idx, 'phone', e.target.value)}
                      placeholder="Phone"
                      className="w-28 px-2.5 py-1.5 bg-[#07172B] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#B44CFF]"
                    />
                    <button
                      type="button"
                      onClick={() => removeTeamMember(idx)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Primary Participant / Team Leader Details */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold block">
              {isTeam ? 'Team Leader / Primary Contact *' : 'Participant Details *'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#A9B8D0] block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Arjun N B"
                  required
                  className="w-full px-3 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[#A9B8D0] block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full px-3 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[#A9B8D0] block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. participant@example.com"
                  required
                  className="w-full px-3 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[#A9B8D0] block mb-1">College / Institution *</label>
                <input
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. KMM College of Arts and Science"
                  required
                  className="w-full px-3 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[#A9B8D0] block mb-1">Course / Branch</label>
                <input
                  type="text"
                  value={course}
                  onChange={e => setCourse(e.target.value)}
                  placeholder="e.g. MCA, BCA, B.Tech"
                  className="w-full px-3 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-[#A9B8D0] block mb-1">Student ID / Roll No</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  placeholder="Optional Student ID"
                  className="w-full px-3 py-2.5 bg-[#07172B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>
          </div>

          {/* Submission button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#627694]">
              Walk-in registrations are verified and immediately visible to coordinators.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2"
            >
              <UserPlus size={16} />
              {submitting ? 'Generating Pass...' : 'Issue Entry Pass'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
