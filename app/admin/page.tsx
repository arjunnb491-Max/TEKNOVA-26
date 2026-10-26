"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Overview from '@/components/admin/views/Overview';
import Events from '@/components/admin/views/Events';
import Coordinators from '@/components/admin/views/Coordinators';
import Participants from '@/components/admin/views/Participants';
import Attendance from '@/components/admin/views/Attendance';
import Complaints from '@/components/admin/views/Complaints';
import AuditLogs from '@/components/admin/views/AuditLogs';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem('teknova_admin_auth');
    if (!auth) {
      router.push('/admin/login');
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020713] flex items-center justify-center text-[#627694] font-mono text-xs">
        Loading admin console...
      </div>
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <Overview onTabChange={setActiveTab} />;
      case 'events': return <Events />;
      case 'coordinators': return <Coordinators />;
      case 'participants': return <Participants />;
      case 'attendance': return <Attendance />;
      case 'complaints': return <Complaints />;
      case 'audit': return <AuditLogs />;
      default: return <Overview onTabChange={setActiveTab} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderView()}
    </AdminLayout>
  );
}
