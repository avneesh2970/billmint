import React from 'react';
import { Activity, ShieldAlert } from 'lucide-react';

export default function AuditLogsPage({ auditLogs = [] }) {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Audit Trail</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Immutable audit logs of administrative actions, logins, user suspensions, and security events.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Log ID</th>
                <th className="py-3.5 px-6">Admin Account</th>
                <th className="py-3.5 px-6">Action Performed</th>
                <th className="py-3.5 px-6">Target Entity</th>
                <th className="py-3.5 px-6">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-850">
                  <td className="py-4 px-6 font-mono text-xs text-slate-500">{log.id}</td>
                  <td className="py-4 px-6 font-semibold text-slate-200">{log.adminEmail}</td>
                  <td className="py-4 px-6 font-bold text-mint-400">{log.action}</td>
                  <td className="py-4 px-6 text-slate-400">{log.target || 'System'}</td>
                  <td className="py-4 px-6 text-slate-500 text-xs">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
