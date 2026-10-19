import React from 'react';
import { Save, Shield, Bell, User, Layout, Database } from 'lucide-react';

export default function Settings() {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-white/80">
        <h2 className="text-xl font-bold text-slate-800">System Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage global preferences and configurations for IT FEST 2025.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="lg:w-64 flex flex-col gap-2 shrink-0">
          <button className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold border border-emerald-100 shadow-sm">
            <Layout size={18} /> General
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white/50 hover:text-emerald-600 rounded-xl font-medium transition-colors">
            <User size={18} /> Profile
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white/50 hover:text-emerald-600 rounded-xl font-medium transition-colors">
            <Shield size={18} /> Security & Roles
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white/50 hover:text-emerald-600 rounded-xl font-medium transition-colors">
            <Bell size={18} /> Notifications
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white/50 hover:text-emerald-600 rounded-xl font-medium transition-colors">
            <Database size={18} /> Database Backup
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* General Information */}
          <section className="bg-white/80 border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Fest Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Fest Name</label>
                <input type="text" defaultValue="IT FEST 2025" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Theme</label>
                <input type="text" defaultValue="Digital Frontier: Exploring Next-Gen Technologies" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                <input type="date" defaultValue="2025-03-15" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                <input type="date" defaultValue="2025-03-16" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Registration Controls */}
          <section className="bg-white/80 border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Registration Controls</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-slate-800">Global Registrations</h4>
                  <p className="text-xs text-slate-500 mt-1">Enable or disable all online registrations across the platform.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-slate-800">Spot Registration Window</h4>
                  <p className="text-xs text-slate-500 mt-1">Allow Receptionists to process spot registrations currently.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Contact Details */}
          <section className="bg-white/80 border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Support Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
                <input type="email" defaultValue="support@itfest2025.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Support Phone</label>
                <input type="tel" defaultValue="+1 234 567 890" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
          </section>

          <div className="flex justify-end mt-8">
            <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all flex items-center gap-2">
              <Save size={18} /> Save Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
