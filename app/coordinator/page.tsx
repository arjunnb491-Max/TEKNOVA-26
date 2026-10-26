"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/coordinator/DashboardLayout';
import Overview from '@/components/coordinator/views/Overview';
import Participants from '@/components/coordinator/views/Participants';
import Attendance from '@/components/coordinator/views/Attendance';
import WorkflowView from '@/components/coordinator/views/WorkflowView';
import Prizes from '@/components/coordinator/views/Prizes';
import Complaints from '@/components/coordinator/views/Complaints';
import { OFFICIAL_EVENTS, OfficialEvent } from '@/data/events';

export default function CoordinatorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [eventSlug, setEventSlug] = useState('ideatek');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem('teknova_coordinator_auth');
    if (!auth) {
      router.push('/coordinator/login');
      return;
    }
    const storedSlug = localStorage.getItem('teknova_coordinator_event');
    if (storedSlug && OFFICIAL_EVENTS.some(e => e.slug === storedSlug)) {
      setEventSlug(storedSlug);
    }
  }, [router]);

  const currentEvent: OfficialEvent = 
    OFFICIAL_EVENTS.find(e => e.slug === eventSlug) || OFFICIAL_EVENTS[0];

  const handleEventChange = (newSlug: string) => {
    setEventSlug(newSlug);
    localStorage.setItem('teknova_coordinator_event', newSlug);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020713] flex items-center justify-center text-[#627694] font-mono text-xs">
        Loading coordinator workspace...
      </div>
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <Overview event={currentEvent} />;
      case 'participants': return <Participants event={currentEvent} />;
      case 'attendance': return <Attendance event={currentEvent} />;
      case 'workflow': return <WorkflowView event={currentEvent} />;
      case 'prizes': return <Prizes event={currentEvent} />;
      case 'complaints': return <Complaints event={currentEvent} />;
      default: return <Overview event={currentEvent} />;
    }
  };

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      event={currentEvent}
      onEventChange={handleEventChange}
    >
      {renderView()}
    </DashboardLayout>
  );
}
