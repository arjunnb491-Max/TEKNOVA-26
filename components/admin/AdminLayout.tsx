"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UserCog, 
  Users, 
  UserCheck, 
  AlertTriangle, 
  History, 
  LogOut,
  ExternalLink,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminLayout({ children, activeTab, setActiveTab }: LayoutProps) {
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard },
    { id: 'events', label: 'Event Management', icon: CalendarDays },
    { id: 'coordinators', label: 'Coordinator Assignments', icon: UserCog },
    { id: 'participants', label: 'Master Participant Directory', icon: Users },
    { id: 'attendance', label: 'Attendance Management', icon: UserCheck },
    { id: 'complaints', label: 'Complaint Resolution Desk', icon: AlertTriangle },
    { id: 'audit', label: 'System Audit Logs', icon: History },
  ];

  const handleLogout = () => {
    localStorage.removeItem('teknova_admin_auth');
    localStorage.removeItem('teknova_admin_user');
    router.push('/admin/login');
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileNavOpen(false);
  };

  const renderNavContent = () => (
    <>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
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
                Central Admin Console
              </span>
            </div>
          </Link>

          {/* Close button inside mobile drawer */}
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="lg:hidden p-1.5 text-[#627694] hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Close Navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-[10px] font-mono text-[#627694] flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Department of MCA • Thrikkakara</span>
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
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-[#008CFF]/30 to-[#7B2CFF]/30 text-white border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,140,255,0.2)]' 
                  : 'text-[#A9B8D0] hover:bg-[#07172B] hover:text-[#00E5FF]'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#00E5FF]' : 'text-[#627694]'} />
              <span className="text-left truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-white/5 bg-[#07172B]/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-lg bg-[#7B2CFF]/20 border border-[#B44CFF]/40 flex items-center justify-center text-xs font-mono font-bold text-[#B44CFF]">
            SU
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-white block truncate">Super Admin</span>
            <span className="text-[10px] font-mono text-[#627694] block truncate">Full System Rights</span>
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

      {/* Mobile Slide-Over Drawer & Backdrop for Smartphones */}
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-[#020713]">
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
              {navItems.find(i => i.id === activeTab)?.label || 'System Admin'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/coordinator"
              target="_blank"
              className="text-xs font-mono text-[#00E5FF] hover:underline hidden md:block"
            >
              Coordinator ↗
            </Link>
            <Link
              href="/receptionist"
              target="_blank"
              className="text-xs font-mono text-[#00E5FF] hover:underline hidden sm:block"
            >
              Reception ↗
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-mono text-[#A9B8D0] hover:text-white px-2 py-1 bg-white/5 rounded-lg border border-white/10"
            >
              Public Site ↗
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-3.5 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
