import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { Lock, Mail, Key, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const pickDemoAccount = (accEmail) => {
    setEmail(accEmail);
    setPassword('password123');
    setDemoMessage(`Populated ${accEmail} with demo password: password123`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Masthead Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <h2 className="font-serif text-3xl font-black text-white">
              NEWS <span className="text-amber-400 italic">24</span><span className="text-amber-500">*</span>7
            </h2>
          </Link>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">
            Accredited Subscriber Sign In
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {demoMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{demoMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@news247.global"
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to NEWS 24*7'}
          </button>
        </form>

        {/* Demo Accounts Quick-Select Box */}
        <div className="pt-4 border-t border-zinc-800">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Demo Login (1-Click)</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => pickDemoAccount(acc.email)}
                className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors"
              >
                <span className="font-bold text-white block truncate">{acc.role}</span>
                <span className="text-[10px] text-gray-500 block truncate">{acc.name}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-400 hover:underline font-semibold">
            Create Reader Account
          </Link>
        </p>

      </div>
    </div>
  );
};
