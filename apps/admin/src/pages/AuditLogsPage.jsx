import React, { useState } from 'react';
import { Activity, ShieldAlert, Search, Filter, Clock, UserCheck, FileText, CreditCard, Settings } from 'lucide-react';

export default function AuditLogsPage({ auditLogs = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const filteredLogs = auditLogs.filter(log => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      log.id?.toLowerCase().includes(term) ||
      log.adminEmail?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term) ||
      log.target?.toLowerCase().includes(term);

    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-mint-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Platform Activity & Event Log
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">System Audit & User Activity Stream</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Real-time visibility into all user activities, invoice generations, payment recordings, customer address changes, and security actions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search log ID, user email, action, or target..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-mint-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none"
          >
            <option value="All">All Actions</option>
            <option value="CREATE_INVOICE">CREATE_INVOICE</option>
            <option value="RECORD_PAYMENT">RECORD_PAYMENT</option>
            <option value="ADD_CUSTOMER">ADD_CUSTOMER</option>
            <option value="UPDATE_SETTINGS">UPDATE_SETTINGS</option>
            <option value="ADMIN_LOGIN">ADMIN_LOGIN</option>
            <option value="SUSPEND_USER">SUSPEND_USER</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Log ID</th>
                <th className="py-3.5 px-6">User / Admin Account</th>
                <th className="py-3.5 px-6">Action Event</th>
                <th className="py-3.5 px-6">Target Record / Details</th>
                <th className="py-3.5 px-6">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-slate-500">{log.id}</td>
                  <td className="py-4 px-6 font-semibold text-white">{log.adminEmail || log.userEmail || 'demo@billmint.com'}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${
                      log.action?.includes('RECORD') || log.action?.includes('PAYMENT') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      log.action?.includes('INVOICE') || log.action?.includes('CREATE') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      log.action?.includes('SUSPEND') || log.action?.includes('DELETE') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-medium">{log.target || 'System Config'}</td>
                  <td className="py-4 px-6 text-slate-400 text-xs font-mono">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
