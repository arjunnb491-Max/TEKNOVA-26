"use client";

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Layers, 
  ExternalLink, 
  CheckCircle, 
  Edit3, 
  Save, 
  Gamepad2, 
  HelpCircle, 
  Music, 
  Code2, 
  ShieldAlert, 
  Sparkles,
  BarChart3,
  Award,
  Clock,
  RefreshCw
} from 'lucide-react';
import { OfficialEvent, formatINR } from '@/data/events';
import { RegistrationRecord } from '@/lib/store';

interface WorkflowViewProps {
  event: OfficialEvent;
  onPromoteToWinners?: () => void;
}

export default function WorkflowView({ event, onPromoteToWinners }: WorkflowViewProps) {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'submissions' | 'scoring' | 'leaderboard'>('scoring');
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [scoresInput, setScoresInput] = useState<Record<string, number>>({});
  const [evalNotes, setEvalNotes] = useState('');
  const [subUrl, setSubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // PUBG Lobby state
  const [lobbyCode, setLobbyCode] = useState('TK26-ROOM-8492');
  const [lobbyPass, setLobbyPass] = useState('tek772');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?eventId=${event.slug}`);
      const data = await res.json();
      if (data.registrations) {
        setRegistrations(data.registrations);
        if (data.registrations.length > 0 && !selectedReg) {
          selectParticipant(data.registrations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [event.slug]);

  const selectParticipant = (reg: RegistrationRecord) => {
    setSelectedReg(reg);
    setScoresInput(reg.scores || {});
    setEvalNotes(reg.evaluationNotes || '');
    setSubUrl(reg.projectSubmissionUrl || '');
    setDemoUrl(reg.demoUrl || '');
    setProjectTitle(reg.projectTitle || '');
    setFeedback(null);
  };

  const handleScoreChange = (metric: string, val: number) => {
    setScoresInput(prev => ({
      ...prev,
      [metric]: val
    }));
  };

  const calculateTotal = (scores: Record<string, number>): number => {
    return Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  };

  const handleSaveEvaluation = async () => {
    if (!selectedReg) return;
    setSaving(true);
    setFeedback(null);

    const total = calculateTotal(scoresInput);

    try {
      const res = await fetch('/api/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNumber: selectedReg.registrationNumber,
          submission: {
            projectTitle: projectTitle.trim() || undefined,
            projectSubmissionUrl: subUrl.trim() || undefined,
            demoUrl: demoUrl.trim() || undefined,
            submissionStatus: subUrl || Object.keys(scoresInput).length > 0 ? 'evaluated' : selectedReg.submissionStatus,
            scores: scoresInput,
            totalScore: total,
            evaluationNotes: evalNotes.trim() || undefined
          },
          performedBy: `Coordinator (${event.name})`
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback('Evaluation & score saved successfully!');
        loadData();
      } else {
        setFeedback(data.error || 'Failed to save.');
      }
    } catch (err: any) {
      setFeedback('Error connecting to server.');
    } finally {
      setSaving(false);
    }
  };

  // Sort registrations by totalScore descending for Leaderboard
  const sortedLeaderboard = [...registrations].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

  // Render event-specific rubric configuration
  const renderRubricInputs = () => {
    switch (event.slug) {
      case 'ideatek':
        return [
          { key: 'innovation', label: 'Innovation & Novelty', max: 25 },
          { key: 'feasibility', label: 'Technical Feasibility', max: 25 },
          { key: 'impact', label: 'Societal / Market Impact', max: 25 },
          { key: 'pitch', label: 'Presentation & Prototype Demo', max: 25 },
        ];
      case 'mirror-masters':
        return [
          { key: 'visualFidelity', label: 'Visual Pixel Fidelity & Layout', max: 40 },
          { key: 'responsive', label: 'Mobile & Tablet Responsiveness', max: 30 },
          { key: 'codeQuality', label: 'Semantic Code, CSS & Speed', max: 30 },
        ];
      case 'tek-royale':
        return [
          { key: 'match1', label: 'Match 1 Total Points (Rank + Kills)', max: 50 },
          { key: 'match2', label: 'Match 2 Total Points (Rank + Kills)', max: 50 },
          { key: 'match3', label: 'Match 3 Total Points (Rank + Kills)', max: 50 },
        ];
      case 'tektoniq':
        return [
          { key: 'prelims', label: 'Round 1: Prelims MCQ', max: 30 },
          { key: 'rapidFire', label: 'Round 2: Rapid Fire', max: 30 },
          { key: 'buzzer', label: 'Round 3: Live Buzzer & Code Decryption', max: 40 },
        ];
      case 'beat-blitz':
        return [
          { key: 'musicality', label: 'Rhythm, Timing & Musicality', max: 35 },
          { key: 'originality', label: 'Style, Choreography & Execution', max: 35 },
          { key: 'stagePresence', label: 'Crowd Energy & Stage Presence', max: 30 },
        ];
      default:
        return [
          { key: 'taskCompletion', label: 'Task Completion / Performance', max: 40 },
          { key: 'technicalMerit', label: 'Technical Merit / Accuracy', max: 40 },
          { key: 'speedBonus', label: 'Efficiency & Time Factor', max: 20 },
        ];
    }
  };

  const rubric = renderRubricInputs();

  return (
    <div className="space-y-6">
      {/* Event Header & Mode Badges */}
      <div className="bg-[#061226] p-5 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="text-[#00E5FF]" size={20} />
            <h2 className="text-base font-bold font-space-grotesk text-white">
              {event.name} — Coordinator Evaluation Console
            </h2>
          </div>
          <p className="text-xs text-[#A9B8D0] font-mono mt-1">
            Official format: <span className="text-[#00E5FF] uppercase font-bold">{event.participationType}</span> • Official Prize Pool: <span className="text-emerald-400 font-bold">{event.prizes.length > 0 ? event.prizes.map(p => `${p.position}: ${formatINR(p.amount)}`).join(' | ') : 'Prize details to be announced'}</span>
          </p>
        </div>

        {/* Navigation tabs within workflow */}
        <div className="flex bg-[#07172B] p-1 rounded-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveSubTab('scoring')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'scoring' ? 'bg-[#008CFF] text-white font-bold' : 'text-[#A9B8D0] hover:text-white'
            }`}
          >
            <Edit3 size={14} /> Evaluation & Rubric
          </button>
          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'leaderboard' ? 'bg-[#008CFF] text-white font-bold' : 'text-[#A9B8D0] hover:text-white'
            }`}
          >
            <BarChart3 size={14} /> Live Leaderboard
          </button>
        </div>
      </div>

      {/* PUBG Specific Room Dispatcher */}
      {event.slug === 'tek-royale' && (
        <div className="bg-gradient-to-r from-[#008CFF]/10 to-[#7B2CFF]/10 p-5 rounded-2xl border border-[#00E5FF]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008CFF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
              <Gamepad2 size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider block font-bold">PUBG Custom Room Credentials</span>
              <span className="text-sm font-mono text-white font-bold">Lobby ID: <span className="text-[#00E5FF]">{lobbyCode}</span> • Password: <span className="text-emerald-400">{lobbyPass}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextId = `TK26-ROOM-${Math.floor(1000 + Math.random() * 9000)}`;
                setLobbyCode(nextId);
              }}
              className="px-3 py-1.5 bg-[#07172B] hover:bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-[#A9B8D0] hover:text-white"
            >
              Generate Next Lobby
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-[#061226] p-12 rounded-2xl border border-white/5 text-center text-[#627694] font-mono text-xs">
          Loading event participants...
        </div>
      ) : registrations.length === 0 ? (
        <div className="bg-[#061226] p-12 rounded-2xl border border-white/5 text-center text-[#627694] font-mono text-xs">
          No registrations found for {event.name}. Submissions will appear as participants check in.
        </div>
      ) : activeSubTab === 'scoring' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Participant / Team Roster */}
          <div className="bg-[#061226] rounded-2xl border border-white/5 p-4 flex flex-col h-[650px] overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Candidates ({registrations.length})
              </span>
              <button onClick={loadData} className="text-[#627694] hover:text-[#00E5FF]">
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {registrations.map(reg => {
                const isSelected = selectedReg?.registrationNumber === reg.registrationNumber;
                return (
                  <button
                    key={reg.registrationNumber}
                    onClick={() => selectParticipant(reg)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-[#008CFF]/20 border-[#00E5FF] shadow-[0_0_15px_rgba(0,140,255,0.2)]'
                        : 'bg-[#07172B]/70 border-white/5 hover:border-white/10 text-[#A9B8D0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#00E5FF]">{reg.registrationNumber}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white font-bold">
                        {reg.totalScore !== undefined ? `${reg.totalScore} pts` : 'Pending'}
                      </span>
                    </div>
                    <div className="text-white font-bold truncate mt-1">
                      {reg.teamName || reg.participant.fullName}
                    </div>
                    <div className="text-[10px] text-[#627694] truncate">
                      {reg.participant.college}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Two Columns: Scoring & Submission Form */}
          <div className="lg:col-span-2 bg-[#061226] rounded-2xl border border-[#00E5FF]/20 p-6 flex flex-col h-[650px] overflow-y-auto shadow-2xl">
            {selectedReg ? (
              <div className="space-y-6">
                {/* Active Candidate Card */}
                <div className="p-4 rounded-xl bg-[#07172B] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#00E5FF] uppercase font-bold block">
                      Active Candidate
                    </span>
                    <h3 className="text-lg font-bold font-space-grotesk text-white">
                      {selectedReg.teamName ? `${selectedReg.teamName} (Lead: ${selectedReg.participant.fullName})` : selectedReg.participant.fullName}
                    </h3>
                    <p className="text-xs font-mono text-[#A9B8D0]">
                      {selectedReg.registrationNumber} • {selectedReg.participant.college} • {selectedReg.participant.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#627694] uppercase block">Current Score</span>
                    <span className="text-3xl font-extrabold font-space-grotesk text-[#00E5FF]">
                      {calculateTotal(scoresInput)}
                      <span className="text-xs text-[#627694] font-normal"> / 100</span>
                    </span>
                  </div>
                </div>

                {/* Submission Links (For Project / Web / Design Events) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                    1. Candidate Submissions & Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-[#A9B8D0] block mb-1">
                        Project / Track Title
                      </label>
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={e => setProjectTitle(e.target.value)}
                        placeholder="e.g. AI-Powered Traffic Grid"
                        className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#A9B8D0] block mb-1">
                        Source Code / Repository URL
                      </label>
                      <input
                        type="url"
                        value={subUrl}
                        onChange={e => setSubUrl(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono text-[#A9B8D0] block mb-1">
                        Live Demo / Pitch Deck URL
                      </label>
                      <input
                        type="url"
                        value={demoUrl}
                        onChange={e => setDemoUrl(e.target.value)}
                        placeholder="https://demo-app.vercel.app or Google Drive Link"
                        className="w-full px-3 py-2 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Rubric Evaluation Sliders / Inputs */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                    2. Official Evaluation Criteria
                  </h4>
                  <div className="space-y-3">
                    {rubric.map(item => {
                      const currentVal = scoresInput[item.key] || 0;
                      return (
                        <div key={item.key} className="p-3 bg-[#07172B] rounded-xl border border-white/5 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-white font-medium">{item.label}</span>
                            <span className="text-[#00E5FF] font-bold">
                              {currentVal} / {item.max}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={0}
                              max={item.max}
                              value={currentVal}
                              onChange={e => handleScoreChange(item.key, Number(e.target.value))}
                              className="flex-1 accent-[#00E5FF] bg-white/10 rounded-lg cursor-pointer h-2"
                            />
                            <input
                              type="number"
                              min={0}
                              max={item.max}
                              value={currentVal}
                              onChange={e => handleScoreChange(item.key, Math.min(item.max, Math.max(0, Number(e.target.value))))}
                              className="w-16 px-2 py-1 bg-[#020713] border border-white/10 rounded-lg text-xs font-mono text-center text-white focus:outline-none focus:border-[#00E5FF]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Judge Remarks */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold block">
                    3. Evaluator Remarks & Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={evalNotes}
                    onChange={e => setEvalNotes(e.target.value)}
                    placeholder="Enter judging feedback, technical highlights, strengths or critical flaws..."
                    className="w-full p-3 bg-[#07172B] border border-white/10 rounded-xl text-xs text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                {feedback && (
                  <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${feedback.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    <CheckCircle size={14} /> {feedback}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <div className="text-xs font-mono text-[#627694]">
                    Last updated: {selectedReg.totalScore ? `${selectedReg.totalScore} points recorded` : 'Unrated'}
                  </div>

                  <button
                    onClick={handleSaveEvaluation}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#008CFF] to-[#00E5FF] text-[#020713] text-xs font-bold font-mono rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2"
                  >
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Commit Evaluation Score'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-[#627694] font-mono text-xs">
                Select a candidate from the roster to begin evaluation.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Leaderboard View */
        <div className="bg-[#061226] rounded-2xl border border-white/5 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold font-space-grotesk text-white flex items-center gap-2">
                <Trophy className="text-[#00E5FF]" size={18} />
                Live Standings & Rankings
              </h3>
              <p className="text-xs text-[#627694] font-mono">
                Real-time calculated totals based on all committed evaluator scores.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#07172B]/60 text-[#627694] uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Candidate / Team</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Project / Links</th>
                  <th className="py-3 px-4 text-center">Score / 100</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedLeaderboard.map((reg, idx) => {
                  const rank = idx + 1;
                  const isTop3 = rank <= 3;
                  return (
                    <tr key={reg.registrationNumber} className={`hover:bg-white/[0.02] transition-colors ${isTop3 ? 'bg-white/[0.01]' : ''}`}>
                      <td className="py-3.5 px-4 font-bold">
                        <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-space-grotesk font-extrabold ${
                          rank === 1 ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.5)]' :
                          rank === 2 ? 'bg-slate-300 text-black' :
                          rank === 3 ? 'bg-amber-700 text-white' :
                          'text-[#627694]'
                        }`}>
                          #{rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#00E5FF] font-bold">
                        {reg.registrationNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {reg.teamName || reg.participant.fullName}
                        </div>
                        {reg.teamName && (
                          <div className="text-[10px] text-[#A9B8D0]">Lead: {reg.participant.fullName}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#A9B8D0]">
                        {reg.participant.college}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {reg.projectSubmissionUrl ? (
                            <a
                              href={reg.projectSubmissionUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#00E5FF] hover:underline flex items-center gap-1 text-[10px]"
                            >
                              Code <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span className="text-[#627694] text-[10px]">No code</span>
                          )}
                          {reg.demoUrl && (
                            <a
                              href={reg.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline flex items-center gap-1 text-[10px]"
                            >
                              Demo <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-sm font-space-grotesk text-[#00E5FF]">
                          {reg.totalScore !== undefined ? `${reg.totalScore}` : '—'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          reg.totalScore !== undefined ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-[#627694]'
                        }`}>
                          {reg.totalScore !== undefined ? 'Evaluated' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
