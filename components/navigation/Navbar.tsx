"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Shield, Users, UserCheck, Search, ChevronDown } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);
  const portalsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (portalsRef.current && !portalsRef.current.contains(event.target as Node)) {
        setPortalsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPortalsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setPortalsOpen(false);
    }, 250);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Schedule", href: "/#schedule" },
    { name: "About", href: "/#about" },
    { name: "Receipt Lookup", href: "/lookup" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#020713]/90 backdrop-blur-md border-b border-[#00E5FF]/20 shadow-[0_4px_30px_rgba(0,140,255,0.15)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.3)] bg-[#07172B]">
              <Image 
                src="/images/TEKNOVA_26_logo_300x300.png"
                alt="TEKNOVA '26 Logo"
                fill
                sizes="40px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-extrabold tracking-wider text-white font-space-grotesk group-hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                TEKNOVA <span className="text-[#00E5FF]">’26</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#A9B8D0] uppercase hidden sm:block">
                KMM College • MCA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[#A9B8D0] hover:text-[#00E5FF] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Portals Dropdown */}
            <div 
              ref={portalsRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setPortalsOpen(!portalsOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider text-[#00E5FF] border border-[#00E5FF]/30 hover:bg-[#00E5FF]/10 transition-colors"
                aria-expanded={portalsOpen}
                aria-haspopup="true"
              >
                Portals <ChevronDown size={14} className={`transition-transform duration-200 ${portalsOpen ? "rotate-180" : ""}`} />
              </button>

              {portalsOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-60 glass-panel rounded-xl border border-[#00E5FF]/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-[#627694] tracking-widest border-b border-white/5 mb-1">
                    Staff & Officials
                  </div>
                  <Link
                    href="/coordinator/login"
                    onClick={() => setPortalsOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-[#F5F8FF] hover:bg-[#008CFF]/20 hover:text-[#00E5FF] transition-colors"
                  >
                    <Users size={15} className="text-[#00E5FF] shrink-0" />
                    <div>
                      <span className="font-bold block">Coordinator Portal</span>
                      <span className="text-[10px] text-[#A9B8D0] block">Attendance & Scoring</span>
                    </div>
                  </Link>
                  <Link
                    href="/receptionist/login"
                    onClick={() => setPortalsOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-[#F5F8FF] hover:bg-[#008CFF]/20 hover:text-[#00E5FF] transition-colors"
                  >
                    <UserCheck size={15} className="text-[#00E5FF] shrink-0" />
                    <div>
                      <span className="font-bold block">Receptionist Desk</span>
                      <span className="text-[10px] text-[#A9B8D0] block">Walk-in & Passes</span>
                    </div>
                  </Link>
                  <Link
                    href="/admin/login"
                    onClick={() => setPortalsOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-[#F5F8FF] hover:bg-[#7B2CFF]/20 hover:text-[#B44CFF] transition-colors"
                  >
                    <Shield size={15} className="text-[#B44CFF] shrink-0" />
                    <div>
                      <span className="font-bold block">Administrator Hub</span>
                      <span className="text-[10px] text-[#A9B8D0] block">Command & Analytics</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/events"
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] hover:from-[#00E5FF] hover:to-[#B44CFF] rounded-lg transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)]"
            >
              Register Now
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} className="text-[#00E5FF]" /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-[#00E5FF]/20 mt-3 px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#A9B8D0] hover:text-[#00E5FF] py-1 border-b border-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#627694]">Staff Portals</span>
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/coordinator/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-[#07172B] border border-white/5 rounded-lg text-center text-xs text-[#00E5FF] hover:border-[#00E5FF]/40"
                >
                  Coordinator
                </Link>
                <Link
                  href="/receptionist/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-[#07172B] border border-white/5 rounded-lg text-center text-xs text-[#00E5FF] hover:border-[#00E5FF]/40"
                >
                  Receptionist
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-[#07172B] border border-white/5 rounded-lg text-center text-xs text-[#B44CFF] hover:border-[#B44CFF]/40"
                >
                  Admin
                </Link>
              </div>
            </div>

            <Link
              href="/events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 w-full py-3 text-center text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] rounded-lg shadow-lg"
            >
              Register for Events
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
