import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { Users, CheckCircle, ChevronUp, ChevronDown, Key } from 'lucide-react';

export const DemoRoleSwitcher = () => {
  const { user, switchDemoAccount } = useAuth();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (email) => {
    try {
      setSwitching(true);
      await switchDemoAccount(email);
      setOpen(false);
    } catch (e) {
      console.error('Failed to switch demo account:', e);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Popover Menu */}
      {open && (
        <div className="mb-3 w-80 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl shadow-2xl p-4 text-xs animate-fade-in text-gray-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Demo Role Switcher
              </span>
            </div>
            <span className="text-[10px] text-gray-400">Instant Access</span>
          </div>

          <p className="text-[11px] text-gray-400 my-2">
            Click any role below to test real permissions, paywalls, and editorial workflows:
          </p>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {DEMO_ACCOUNTS.map((acc) => {
              const isActive = user?.email === acc.email;
              return (
                <button
                  key={acc.email}
                  disabled={switching}
                  onClick={() => handleSwitch(acc.email)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between ${
                    isActive
                      ? 'bg-amber-400/10 border-amber-400/50 text-white'
                      : 'bg-zinc-800/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-semibold text-xs text-white">{acc.role}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-700 text-amber-400 font-medium">
                        {acc.tier}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{acc.name}</p>
                    <p className="text-[9px] text-zinc-500 italic mt-0.5">{acc.desc}</p>
                  </div>
                  {isActive && <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-3.5 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-amber-400/40 text-amber-400 hover:text-amber-300 shadow-xl transition-all duration-200 hover:scale-105 backdrop-blur-md"
        title="Switch Demo Role"
      >
        <Users className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-semibold text-gray-200">
          Role: <span className="text-amber-400">{user?.role || 'Guest'}</span>
        </span>
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
