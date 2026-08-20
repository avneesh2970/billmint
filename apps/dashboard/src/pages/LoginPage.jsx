import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Lock } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@billmint.com');
  const [password, setPassword] = useState('Demo@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiRequest('/auth/login', 'POST', { email, password });
      if (res.token) {
        localStorage.setItem('billmint_token', res.token);
      }
      navigate('/dashboard');
    } catch (err) {
      // Demo fallback
      localStorage.setItem('billmint_token', 'demo_jwt_token_2026');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 text-mint-600 font-extrabold text-2xl">
            <div className="w-9 h-9 rounded-xl bg-mint-600 text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-charcoal-900">Bill<span className="text-mint-600">Mint</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-charcoal-900">Welcome back</h1>
          <p className="text-xs text-slate-500">Log in to manage your invoices and business billing.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-mint-600 rounded border-slate-300 focus:ring-mint-500"
              />
              <span>Remember me</span>
            </label>
            <span className="text-mint-600 font-semibold cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-mint-600 hover:bg-mint-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Login to Workspace'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 space-y-2">
          <p className="text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-mint-600 hover:underline">
              Create free account
            </Link>
          </p>
          <p className="text-[11px] text-slate-400">
            Admin? Access the <a href="http://localhost:3002" className="text-slate-600 underline font-semibold">Admin Panel</a>
          </p>
        </div>

      </div>
    </div>
  );
}
