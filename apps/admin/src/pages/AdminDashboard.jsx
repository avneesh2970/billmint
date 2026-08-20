import React from 'react';
import { Users, Building, Receipt, TrendingUp, ShieldCheck, Activity, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard({ users = [], auditLogs = [] }) {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform System Overview</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          BillMint SaaS administrative dashboard & global telemetry.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Registered Users</span>
            <div className="w-8 h-8 rounded-xl bg-mint-500/10 text-mint-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">1,420</div>
          <div className="text-xs text-mint-400 font-semibold">+14 new today</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Active Businesses</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">1,180</div>
          <div className="text-xs text-slate-400">83% activation rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Invoices Volume</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">14,890</div>
          <div className="text-xs text-emerald-400 font-semibold">₹1.84 Cr total volume</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Monthly SaaS MRR</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400">₹4,25,000</div>
          <div className="text-xs text-amber-400 font-semibold">+22% YoY MRR Growth</div>
        </div>

      </div>

      {/* Grid Section: User Management Quick View & Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Managed Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Platform Users</h3>
            <Link to="/admin/users" className="text-xs font-bold text-mint-400 hover:underline">
              View All Users →
            </Link>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {users.map(u => (
              <div key={u.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">{u.fullName}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-mint-400" /> Admin Audit Logs
            </h3>
            <Link to="/admin/audit-logs" className="text-xs font-bold text-mint-400 hover:underline">
              Full Logs →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="font-bold text-mint-400">{log.action}</span>
                  <span className="text-[10px]">{log.timestamp.split('T')[0]}</span>
                </div>
                <p className="text-slate-300 text-[11px]">Executor: {log.adminEmail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
