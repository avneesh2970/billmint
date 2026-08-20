import React, { useState } from 'react';
import { Search, UserCheck, UserX, Trash2, Shield, Eye } from 'lucide-react';

export default function UserManagement({ users = [], onToggleUserStatus, onDeleteUser }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">User Management</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor user accounts, subscription roles, and toggle access permissions.
        </p>
      </div>

      {/* Search */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-mint-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">User ID</th>
                <th className="py-3.5 px-6">Full Name & Email</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-center">Invoices</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-850">
                  <td className="py-4 px-6 font-mono text-xs text-slate-500">{u.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-white">{u.fullName}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full text-[11px] font-mono">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-slate-200">{u.invoicesCount || 12}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button 
                      onClick={() => onToggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        u.status === 'Active' ? 'bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800' : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                      }`}
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => onDeleteUser(u.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
