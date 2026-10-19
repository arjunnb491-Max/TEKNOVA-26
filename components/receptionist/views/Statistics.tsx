import React from 'react';
import { TrendingUp, Users, Activity, Target } from 'lucide-react';

export default function Statistics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Registration Statistics</h2>
          <p className="text-slate-500">Analytics and insights for IT FEST 2025</p>
        </div>
        <select className="px-4 py-2 bg-white/80 border border-slate-200 rounded-lg text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-slate-800">68.4%</p>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+5%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Avg. Team Size</p>
            <p className="text-2xl font-bold text-slate-800">2.8</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
              <Activity size={20} />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Peak Time</p>
            <p className="text-2xl font-bold text-slate-800">10:00 AM</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Target size={20} />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Most Popular</p>
            <p className="text-lg font-bold text-slate-800">Coding Challenge</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Timeline Chart */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm p-6 flex flex-col h-[350px]">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Registration Trend</h3>
          <div className="flex-1 flex items-end justify-between px-2 pb-4 gap-2 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-20">
              <div className="w-full border-b border-slate-400 border-dashed h-0"></div>
              <div className="w-full border-b border-slate-400 border-dashed h-0"></div>
              <div className="w-full border-b border-slate-400 border-dashed h-0"></div>
              <div className="w-full border-b border-slate-400 border-dashed h-0"></div>
            </div>
            
            {/* Bars */}
            {[20, 35, 25, 60, 45, 80, 55].map((height, idx) => (
              <div key={idx} className="w-full max-w-10 flex flex-col justify-end gap-2 group h-full relative z-10">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-md transition-all duration-300 group-hover:opacity-80" 
                  style={{ height: `${height}%` }}
                >
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {height * 2}
                   </div>
                </div>
                <span className="text-[10px] font-semibold text-center text-slate-500">Day {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* College Participation */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm p-6 h-[350px] overflow-hidden flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Top Colleges</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {[
              { name: 'KMM College of Arts', count: 85, color: 'bg-blue-500' },
              { name: 'SD College', count: 62, color: 'bg-indigo-500' },
              { name: 'SB College', count: 45, color: 'bg-purple-500' },
              { name: 'AC College', count: 30, color: 'bg-emerald-500' },
              { name: 'MB College', count: 28, color: 'bg-amber-500' },
              { name: 'SC College', count: 15, color: 'bg-rose-500' },
            ].map((college, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{college.name}</span>
                  <span className="font-bold text-slate-900">{college.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${college.color}`} style={{ width: `${(college.count / 85) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
