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
      <div className="w-full max-w-md bg-white border border-[#ded5c2] rounded-3xl p-8 shadow-xl space-y-6 text-[#1c1917]">
        
        {/* Masthead Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <h2 className="font-serif text-3xl font-black text-[#1c1917]">
              NEWS <span className="text-[#946638] italic">24</span><span className="text-[#b8895b]">*</span>7
            </h2>
          </Link>
          <p className="text-xs text-[#786f63] uppercase tracking-widest font-mono font-bold">
            Accredited Subscriber Sign In
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {demoMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{demoMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1c1917] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@news247.global"
                className="w-full bg-[#faf7f2] border border-[#ded5c2] focus:border-[#946638] text-xs text-[#1c1917] rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#786f63] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1c1917] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#faf7f2] border border-[#ded5c2] focus:border-[#946638] text-xs text-[#1c1917] rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#786f63] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] shadow-md disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to NEWS 24*7'}
          </button>
        </form>

        {/* Demo Accounts Quick-Select Box */}
        <div className="pt-4 border-t border-[#ded5c2]">
          <p className="text-[11px] font-bold text-[#946638] uppercase tracking-wider mb-2 flex items-center space-x-1">
            <Key className="w-3.5 h-3.5 text-[#946638]" />
            <span>Instant Demo Login (1-Click)</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => pickDemoAccount(acc.email)}
                className="p-2 rounded-xl bg-[#faf7f2] hover:bg-[#f2ece0] border border-[#ded5c2] text-left transition-colors"
              >
                <span className="font-bold text-[#1c1917] block truncate">{acc.role}</span>
                <span className="text-[10px] text-[#786f63] block truncate">{acc.name}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#786f63]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#946638] hover:underline font-bold">
            Create Reader Account
          </Link>
        </p>

      </div>
    </div>
  );
};
