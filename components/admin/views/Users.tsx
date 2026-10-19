import React from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

export default function Users() {
  const usersList = [
    { id: 1, name: 'Akshay', username: 'akshay01', role: 'Coordinator', event: 'Coding Challenge', status: 'Active' },
    { id: 2, name: 'Sneha S', username: 'sneha01', role: 'Coordinator', event: 'Web Design', status: 'Active' },
    { id: 3, name: 'Rahul K', username: 'rahul01', role: 'Coordinator', event: 'Business Quiz', status: 'Inactive' },
    { id: 4, name: 'Priya M', username: 'priya01', role: 'Receptionist', event: '-', status: 'Active' },
    { id: 5, name: 'Arun P', username: 'arun01', role: 'Receptionist', event: '-', status: 'Active' },
    { id: 6, name: 'Admin', username: 'admin', role: 'Admin', event: '-', status: 'Active' },
  ];

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-white/80">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">System Users</h2>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-emerald-700 transition-colors">
            <Plus size={16} /> Add User
          </button>
        </div>
        
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button className="px-4 py-2 text-emerald-600 font-bold border-b-2 border-emerald-600">All Users</button>
          <button className="px-4 py-2 text-slate-500 font-medium hover:text-slate-800 transition-colors">Coordinators</button>
          <button className="px-4 py-2 text-slate-500 font-medium hover:text-slate-800 transition-colors">Receptionists</button>
          <button className="px-4 py-2 text-slate-500 font-medium hover:text-slate-800 transition-colors">Admins</button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or role..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
            Filter
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/50 border-b border-slate-200/60">
              <th className="py-4 px-6 w-12"><input type="checkbox" className="rounded" /></th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Event</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-white/80 transition-colors">
                <td className="py-4 px-6"><input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" /></td>
                <td className="py-4 px-6 text-sm font-bold text-slate-900">{u.name}</td>
                <td className="py-4 px-6 text-sm font-medium text-slate-600">{u.username}</td>
                <td className="py-4 px-6 text-sm">
                  <span className="font-semibold text-slate-700">{u.role}</span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">{u.event}</td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${
                    u.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center flex justify-center gap-2">
                  <button className="text-blue-500 hover:text-blue-700 transition-colors p-1 bg-white rounded shadow-sm border border-slate-100">
                    <Edit size={16} />
                  </button>
                  <button className="text-rose-500 hover:text-rose-700 transition-colors p-1 bg-white rounded shadow-sm border border-slate-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-white/30">
        <span className="text-sm font-medium text-slate-500">Showing 1 - 6 of 28</span>
        <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50">&lt;</button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-600 text-white shadow-sm font-bold">1</button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 font-bold">2</button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50">&gt;</button>
         </div>
      </div>
    </div>
  );
}
