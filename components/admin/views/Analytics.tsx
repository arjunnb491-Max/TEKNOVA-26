import React from 'react';
import { ClipboardList, Users, Monitor, MapPin } from 'lucide-react';

export default function Analytics() {
  const metrics = [
    { label: 'Total Registrations', value: '350', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Unique Participants', value: '320', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Online Registrations', value: '280', icon: Monitor, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Spot Registrations', value: '70', icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Analytics & Reports</h2>
          <p className="text-slate-500">Comprehensive insights into fest data</p>
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2 bg-white/80 border border-slate-200 rounded-lg text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-500">
            <option>All Events</option>
            <option>Technical</option>
            <option>Cultural</option>
          </select>
          <select className="px-4 py-2 bg-white/80 border border-slate-200 rounded-lg text-sm shadow-sm outline-none focus:ring-2 focus:ring-emerald-500">
            <option>All Time</option>
            <option>Today</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-sm flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.bg} ${m.color}`}>
              <m.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">{m.label}</p>
              <p className="text-3xl font-extrabold text-slate-900">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event-wise Participation Chart */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm p-6 h-[400px] flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Event-wise Participation</h3>
          <div className="flex-1 flex items-end justify-around px-2 pb-6 gap-2 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-20">
              <div className="w-full border-b border-slate-400 border-dashed h-0 flex justify-start"><span className="text-xs absolute -left-2 -translate-y-1/2">150</span></div>
              <div className="w-full border-b border-slate-400 border-dashed h-0 flex justify-start"><span className="text-xs absolute -left-2 -translate-y-1/2">100</span></div>
              <div className="w-full border-b border-slate-400 border-dashed h-0 flex justify-start"><span className="text-xs absolute -left-2 -translate-y-1/2">50</span></div>
              <div className="w-full border-b border-slate-400 border-dashed h-0 flex justify-start"><span className="text-xs absolute -left-2 -translate-y-1/2">0</span></div>
            </div>
            
            {[
              { label: 'Coding', h: 80 }, { label: 'Web', h: 50 }, { label: 'Business', h: 40 },
              { label: 'Dance', h: 60 }, { label: 'Photography', h: 30 }, { label: 'Design', h: 20 },
              { label: 'Quiz', h: 45 }
            ].map((bar, idx) => (
              <div key={idx} className="w-full max-w-12 flex flex-col justify-end gap-2 group h-full relative z-10">
                <div 
                  className="w-full bg-blue-500 rounded-t-md transition-all duration-300 group-hover:bg-blue-600" 
                  style={{ height: `${bar.h}%` }}
                ></div>
                <span className="text-[10px] font-semibold text-center text-slate-600 leading-tight">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Trend Chart */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm p-6 h-[400px] flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-2">Registration Trend</h3>
          <div className="flex justify-end gap-4 mb-4 text-xs font-semibold">
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded-full"></div>Online</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-cyan-300 rounded-full"></div>Spot</div>
          </div>
          <div className="flex-1 relative flex items-end justify-between px-4 pb-6">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-20">
              <div className="w-full border-b border-slate-400 border-dashed h-0 flex justify-start"><span className="text-xs absolute -left-2 -translate-y-1/2">150</span></div>
              <div className="w-full border-b border-slate-400 border-dashed h-0 flex justify-start"><span className="text-xs absolute -left-2 -translate-y-1/2">100</span></div>
              <div className="w-full border-b border-slate-400 border-dashed h-0 flex justify-start"><span className="text-xs absolute -left-2 -translate-y-1/2">50</span></div>
              <div className="w-full border-b border-slate-400 border-dashed h-0 flex justify-start"><span className="text-xs absolute -left-2 -translate-y-1/2">0</span></div>
            </div>

            {/* SVG Line mockup */}
            <svg className="absolute inset-0 w-full h-[85%] pb-8 px-4" preserveAspectRatio="none">
              <path d="M 0,150 Q 50,100 100,120 T 200,80 T 300,40 T 400,60" fill="none" stroke="#2563eb" strokeWidth="3" />
              <path d="M 0,200 Q 50,180 100,190 T 200,150 T 300,170 T 400,160" fill="none" stroke="#67e8f9" strokeWidth="3" />
            </svg>

            {['10 Mar', '11 Mar', '12 Mar', '13 Mar', '14 Mar', '15 Mar'].map((day, idx) => (
              <span key={idx} className="text-[10px] font-semibold text-slate-500 z-10">{day}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
