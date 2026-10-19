"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReceptionistLayout from '@/components/receptionist/ReceptionistLayout';
import Overview from '@/components/receptionist/views/Overview';
import SpotRegistration from '@/components/receptionist/views/SpotRegistration';
import EventsList from '@/components/receptionist/views/EventsList';
import Participants from '@/components/receptionist/views/Participants';
import ResultsView from '@/components/receptionist/views/ResultsView';
import ComplaintsView from '@/components/receptionist/views/ComplaintsView';

export default function ReceptionistDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem('teknova_receptionist_auth');
    if (!auth) {
      router.push('/receptionist/login');
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020713] flex items-center justify-center text-[#627694] font-mono text-xs">
        Loading receptionist workspace...
      </div>
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <Overview onTabChange={setActiveTab} />;
      case 'spot-registration': return <SpotRegistration />;
      case 'participants': return <Participants />;
      case 'events': return <EventsList />;
      case 'results': return <ResultsView />;
      case 'complaints': return <ComplaintsView />;
      default: return <Overview onTabChange={setActiveTab} />;
    }
  };

  return (
    <ReceptionistLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderView()}
    </ReceptionistLayout>
  );
}
