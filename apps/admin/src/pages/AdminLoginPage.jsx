import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, FileText } from 'lucide-react';

export default function AdminLoginPage({ onAdminLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@billmint.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@billmint.com' && password === 'Admin@123') {
      onAdminLogin({ id: 'admin_1', email, role: 'SUPER_ADMIN' });
      navigate('/admin');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 max-w-md w-full space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-mint-500/10 border border-mint-500/30 text-mint-400 flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">BillMint Admin Console</h1>
          <p className="text-xs text-slate-400">Authorized platform administrative portal.</p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Admin Email</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-mint-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Master Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-mint-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-mint-500 hover:bg-mint-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Authenticate Admin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-[11px] text-slate-500">
            Default credentials pre-filled for evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
