"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Trophy, 
  AlertTriangle, 
  LogOut,
  Bell,
  Search,
  Sliders,
  ChevronDown,
  Layers,
  Sparkles,
  Swords,
  Menu,
  X
} from 'lucide-react';
import { OFFICIAL_EVENTS, OfficialEvent } from '@/data/events';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  event: OfficialEvent;
  onEventChange: (slug: string) => void;
}

export default function DashboardLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  event,
  onEventChange 
}: DashboardLayoutProps) {
  const router = useRouter();
  const [eventMenuOpen, setEventMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const getWorkflowTabName = () => {
    switch (event.slug) {
      case 'ideatek': return 'Milestones & Rubric';
      case 'tek-royale': return 'Lobby & Matches';
      case 'mirror-masters': return 'Code & Web Review';
      case 'tektoniq': return 'Quiz Rounds';
      case 'beat-blitz': return 'Dance Battles';
      default: return 'Contest Workflow';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'participants', label: 'Participants & Roster', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'workflow', label: getWorkflowTabName(), icon: Layers },
    { id: 'prizes', label: 'Winner Confirmation', icon: Trophy },
    { id: 'complaints', label: 'Support & Tickets', icon: AlertTriangle },
  ];

  const handleLogout = () => {
    localStorage.removeItem('teknova_coordinator_auth');
    localStorage.removeItem('teknova_coordinator_event');
    router.push('/coordinator/login');
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileNavOpen(false);
  };

  const renderNavContent = () => (
    <>
      {/* Fest & Workspace Header */}
      <div className="p-4 sm:p-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#00E5FF]/30 bg-[#07172B]">
              <Image 
                src="/images/TEKNOVA_26_logo_300x300.png"
                alt="TEKNOVA '26"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-base font-extrabold text-white font-space-grotesk tracking-wider block">
                TEKNOVA ’26
              </span>
              <span className="text-[9px] font-mono text-[#00E5FF] uppercase tracking-widest block">
                Coordinator Console
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="lg:hidden p-1.5 text-[#627694] hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Close Navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Assigned Event Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setEventMenuOpen(!eventMenuOpen)}
            onBlur={() => setTimeout(() => setEventMenuOpen(false), 200)}
            className="w-full p-2.5 bg-[#07172B] hover:bg-[#07172B]/80 border border-[#00E5FF]/30 rounded-xl flex items-center justify-between text-left transition-colors"
          >
            <div className="truncate pr-2">
              <span className="text-[10px] font-mono text-[#00E5FF] block uppercase font-bold">Assigned Event</span>
              <span className="text-xs font-bold text-white font-space-grotesk truncate block">{event.name}</span>
            </div>
            <ChevronDown size={14} className={`text-[#A9B8D0] shrink-0 transition-transform ${eventMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {eventMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 glass-panel rounded-xl border border-[#00E5FF]/30 shadow-2xl py-1 z-50 max-h-60 overflow-y-auto">
              <div className="px-3 py-1 text-[9px] font-mono text-[#627694] uppercase tracking-wider">
                Switch Authorized Event
              </div>
              {OFFICIAL_EVENTS.map(evt => (
                <button
                  key={evt.slug}
                  onClick={() => {
                    onEventChange(evt.slug);
                    setEventMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                    evt.slug === event.slug 
                      ? 'bg-[#008CFF]/20 text-[#00E5FF] font-bold' 
                      : 'text-[#A9B8D0] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate">{evt.name}</span>
                  <span className="text-[9px] font-mono text-[#627694]">{evt.participationType[0].toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-[#008CFF]/30 to-[#7B2CFF]/30 text-white border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,140,255,0.2)]' 
                  : 'text-[#A9B8D0] hover:bg-[#07172B] hover:text-[#00E5FF]'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#00E5FF]' : 'text-[#627694]'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-white/5 bg-[#07172B]/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-lg bg-[#008CFF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-xs font-mono font-bold text-[#00E5FF]">
            {event.name.slice(0, 2)}
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-white block truncate">Official Desk</span>
            <span className="text-[10px] font-mono text-[#627694] block truncate">{event.venue}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Log Out"
          className="p-2 text-[#A9B8D0] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#020713] text-[#A9B8D0] font-sans antialiased overflow-hidden">
      {/* Desktop Sidebar (Persistent on large screens) */}
      <aside className="hidden lg:flex w-64 bg-[#061226] border-r border-[#00E5FF]/15 flex-col shrink-0 relative z-20 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
        {renderNavContent()}
      </aside>

      {/* Mobile Slide-Over Drawer for Smartphones */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />

          {/* Drawer Panel */}
          <aside className="relative w-72 max-w-[85vw] bg-[#061226] border-r border-[#00E5FF]/20 shadow-2xl z-50 flex flex-col h-full animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </aside>
        </div>
      )}

      {/* Main Workspace Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-[#020713]">
        {/* Top Header Bar */}
        <header className="bg-[#061226]/80 backdrop-blur-md border-b border-[#00E5FF]/15 h-16 flex items-center justify-between px-3.5 sm:px-6 shrink-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg border border-white/10 shrink-0"
              aria-label="Open Mobile Navigation"
            >
              <Menu size={18} className="text-[#00E5FF]" />
            </button>

            <h1 className="text-sm sm:text-lg font-bold font-space-grotesk text-white truncate">
              {event.name}
            </h1>
            <span className="text-[10px] sm:text-xs font-mono text-[#00E5FF] px-2 py-0.5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 shrink-0 hidden sm:inline-block">
              {event.workingInterpretation}
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#A9B8D0] bg-[#07172B] px-3 py-1.5 rounded-lg border border-white/5">
              <span>Schedule:</span>
              <span className="text-white font-bold">{event.date} ({event.time})</span>
            </div>

            <Link
              href={`/events/${event.slug}`}
              target="_blank"
              className="text-xs font-mono text-[#00E5FF] hover:underline px-2 py-1 bg-white/5 rounded-lg border border-white/10"
            >
              Public ↗
            </Link>
          </div>
        </header>

        {/* Scrollable Workspace Container */}
        <div className="flex-1 overflow-auto p-3.5 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
