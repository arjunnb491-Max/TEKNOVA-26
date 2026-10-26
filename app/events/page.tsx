"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { supabase, DbEvent } from '@/lib/supabase';
import { OFFICIAL_EVENTS, OfficialEvent, formatINR, TOTAL_KNOWN_PRIZE_POOL } from '@/data/events';
import { Search, Trophy, Calendar, MapPin, Users, User, ArrowRight, AlertCircle, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import { EventCard } from '@/components/events/EventCard';

export default function EventsListing() {
  const [dbEvents, setDbEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchLiveEvents = async () => {
    setLoading(true);
    setQueryError(null);
    try {
      // Query published events from live Supabase events table
      const { data, error } = await supabase
        .from('events')
        .select('id, name, slug, description, event_type, rules, venue, registration_fee, prize_pool, is_published')
        .eq('is_published', true);

      if (error) {
        setQueryError(error.message);
      } else {
        setDbEvents(data || []);
      }
    } catch (err: any) {
      setQueryError(err?.message || 'Failed to connect to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveEvents();
  }, []);

  // Determine events to display:
  // If database contains published events, map them; otherwise use official fest catalogue with clear indication
  const hasLiveDbEvents = dbEvents.length > 0;

  const displayList: OfficialEvent[] = hasLiveDbEvents
    ? dbEvents.map(d => {
        const matched = OFFICIAL_EVENTS.find(e => e.slug === d.slug || e.name.toLowerCase() === d.name.toLowerCase());
        return {
          id: d.id,
          slug: d.slug || d.id,
          name: d.name,
          category: matched ? matched.category : 'Technical',
          subCategory: matched ? matched.subCategory : 'Competition',
          workingInterpretation: matched ? matched.workingInterpretation : (d.description || 'Official Event'),
          participationType: d.event_type === 'team' ? 'team' : 'individual',
          description: d.description || matched?.description || '',
          rules: d.rules ? [d.rules] : (matched?.rules || []),
          prizes: matched?.prizes || (d.prize_pool ? [{ position: '1st', amount: d.prize_pool }] : []),
          prizePoolSubtotal: d.prize_pool || matched?.prizePoolSubtotal || 0,
          date: matched?.date || 'December 2–3, 2026',
          time: matched?.time || '10:00 AM',
          venue: d.venue || matched?.venue || 'KMM Campus',
          registrationFee: d.registration_fee,
          registrationOpen: true,
          image: matched?.image || '/images/TEKNOVA \'26_ Neon Tech Fest.png'
        };
      })
    : OFFICIAL_EVENTS;

  // Filter based on search and category
  const filteredEvents = displayList.filter(evt => {
    const matchesSearch = 
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.workingInterpretation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = 
      selectedCategory === 'All' || 
      evt.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Technical', 'Gaming', 'Flagship', 'Cultural', 'Exhibition'];

  return (
    <div className="min-h-screen bg-[#020713] text-[#A9B8D0] font-sans antialiased">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          
          {/* Header */}
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2 block">
              Official Festival Catalogue
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-space-grotesk text-white mb-4 glow-cyan tracking-tight">
              EXPLORE EVENTS
            </h1>
            <p className="text-sm md:text-base text-[#A9B8D0] leading-relaxed">
              Official tournaments and flagship challenges across MCA and KMM College campus.
              Total Published Prize Pool: <strong className="text-white font-mono">{formatINR(TOTAL_KNOWN_PRIZE_POOL)}+</strong>
            </p>

            {/* Supabase Connection Status Bar */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-xl bg-[#07172B] border border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Database size={14} className={hasLiveDbEvents ? "text-emerald-400" : "text-[#00E5FF]"} />
                <span>Supabase Live Status:</span>
              </div>
              {loading ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <RefreshCw size={12} className="animate-spin" /> Querying table public.events...
                </span>
              ) : queryError ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {queryError}
                </span>
              ) : hasLiveDbEvents ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {dbEvents.length} Database Records Published
                </span>
              ) : (
                <span className="text-[#00E5FF] flex items-center gap-1">
                  <CheckCircle2 size={12} /> Connected (0 published in DB table — displaying official {OFFICIAL_EVENTS.length} events catalogue)
                </span>
              )}
              <button 
                onClick={fetchLiveEvents}
                className="ml-2 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
                title="Refresh from Supabase"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-10 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A9B8D0]" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, rules, keywords (e.g., Debugging, PUBG, PES, Ideathon)..." 
                className="w-full pl-12 pr-4 py-3 bg-[#061226] border border-white/10 rounded-xl text-white placeholder-[#627694] focus:outline-none focus:border-[#00E5FF] text-sm font-medium transition-all"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    selectedCategory === cat 
                      ? "bg-gradient-to-r from-[#008CFF] to-[#7B2CFF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]" 
                      : "bg-[#07172B] text-[#A9B8D0] hover:text-white hover:bg-[#07172B]/80 border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-panel p-6 rounded-2xl border border-white/5 animate-pulse space-y-4">
                  <div className="h-44 bg-white/5 rounded-xl"></div>
                  <div className="h-6 bg-white/5 rounded w-3/4"></div>
                  <div className="h-4 bg-white/5 rounded w-full"></div>
                  <div className="h-10 bg-white/5 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty Search Results */}
          {!loading && filteredEvents.length === 0 && (
            <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center max-w-xl mx-auto my-12">
              <div className="w-16 h-16 rounded-2xl bg-[#008CFF]/10 text-[#00E5FF] flex items-center justify-center mx-auto mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">No Matching Events Found</h3>
              <p className="text-sm text-[#A9B8D0] mb-6">
                Try adjusting your search keywords or resetting the category filter.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-6 py-2.5 bg-[#07172B] hover:bg-white/10 text-[#00E5FF] border border-[#00E5FF]/30 rounded-xl text-xs font-mono uppercase tracking-wider transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Events Grid */}
          {!loading && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, idx) => (
                <EventCard key={event.id} event={event} index={idx} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
