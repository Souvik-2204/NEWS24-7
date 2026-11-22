import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, AlertCircle, Sparkles } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Free Reader');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#ded5c2] rounded-3xl p-8 shadow-xl space-y-6 text-[#1c1917]">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <h2 className="font-serif text-3xl font-black text-[#1c1917]">
              NEWS <span className="text-[#946638] italic">24</span><span className="text-[#b8895b]">*</span>7
            </h2>
          </Link>
          <p className="text-xs text-[#786f63] uppercase tracking-widest font-mono font-bold">
            Create Reader Membership
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1c1917] uppercase tracking-wider mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lord Byron"
                className="w-full bg-[#faf7f2] border border-[#ded5c2] focus:border-[#946638] text-xs text-[#1c1917] rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
              <User className="w-4 h-4 text-[#786f63] absolute left-3.5 top-3.5" />
            </div>
          </div>

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

          <div>
            <label className="block text-xs font-bold text-[#1c1917] uppercase tracking-wider mb-1.5">
              Account Accreditation Type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#faf7f2] border border-[#ded5c2] focus:border-[#946638] text-xs text-[#1c1917] rounded-xl px-4 py-3 outline-none"
            >
              <option value="Free Reader">Free Reader (Standard Dispatches)</option>
              <option value="Subscriber">Subscriber (Full Access Tier)</option>
              <option value="Author/Journalist">Author / Journalist (Drafting Privileges)</option>
              <option value="Section Editor">Section Editor (Editorial Review)</option>
              <option value="Chief Editor">Chief Editor (Final Publishing Approval)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] shadow-md disabled:opacity-50"
          >
            {loading ? 'Creating Credentials...' : 'Register Account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#786f63]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#946638] hover:underline font-bold">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};
