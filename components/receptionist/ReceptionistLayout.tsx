"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Calendar, 
  Trophy, 
  AlertTriangle, 
  LogOut,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ReceptionistLayout({ children, activeTab, setActiveTab }: LayoutProps) {
  const router = useRouter();

  const navItems = [
    { id: 'dashboard', label: 'Desk Overview', icon: LayoutDashboard },
    { id: 'spot-registration', label: 'On-the-Spot Registration', icon: UserPlus },
    { id: 'participants', label: 'Participant Search & Receipts', icon: Users },
    { id: 'events', label: 'Official Event Catalogue', icon: Calendar },
    { id: 'results', label: 'Confirmed Winners', icon: Trophy },
    { id: 'complaints', label: 'Desk Support & Tickets', icon: AlertTriangle },
  ];

  const handleLogout = () => {
    localStorage.removeItem('teknova_receptionist_auth');
    localStorage.removeItem('teknova_receptionist_user');
    router.push('/receptionist/login');
  };

  return (
    <div className="flex h-screen bg-[#020713] text-[#A9B8D0] font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#061226] border-r border-[#00E5FF]/15 flex flex-col shrink-0 relative z-20 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5 mb-2 group">
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
                Receptionist Desk
              </span>
            </div>
          </Link>
          <div className="text-[10px] font-mono text-[#627694] flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>KMM College MCA • Live Desk</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#008CFF]/30 to-[#00E5FF]/20 text-white border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,140,255,0.2)]' 
                    : 'text-[#A9B8D0] hover:bg-[#07172B] hover:text-[#00E5FF]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#00E5FF]' : 'text-[#627694]'} />
                <span className="text-left truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#07172B]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-[#008CFF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-xs font-mono font-bold text-[#00E5FF]">
              RD
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">Main Front Desk</span>
              <span className="text-[10px] font-mono text-[#627694] block truncate">On-the-Spot Portal</span>
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
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-[#020713]">
        <header className="bg-[#061226]/80 backdrop-blur-md border-b border-[#00E5FF]/15 h-16 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold font-space-grotesk text-white">
              {navItems.find(i => i.id === activeTab)?.label || 'Receptionist Desk'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/lookup"
              target="_blank"
              className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1"
            >
              Public Pass Verification ↗
            </Link>
            <Link
              href="/events"
              target="_blank"
              className="text-xs font-mono text-[#A9B8D0] hover:text-white"
            >
              Public Schedule ↗
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
