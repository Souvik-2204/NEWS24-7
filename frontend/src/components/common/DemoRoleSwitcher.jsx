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
      {/* Popover Menu in Crisp White / Warm Beige */}
      {open && (
        <div className="mb-3 w-80 bg-white/98 backdrop-blur-xl border border-[#ded5c2] rounded-2xl shadow-2xl p-4 text-xs animate-fade-in text-[#1c1917]">
          <div className="flex items-center justify-between pb-3 border-b border-[#ded5c2]">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-[#946638]" />
              <span className="font-bold text-[#1c1917] uppercase tracking-wider text-[11px]">
                Demo Role Switcher
              </span>
            </div>
            <span className="text-[10px] text-[#786f63]">Instant Access</span>
          </div>

          <p className="text-[11px] text-[#574f45] my-2">
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
                      ? 'bg-[#f4efe4] border-[#946638] text-[#1c1917] shadow-sm ring-1 ring-[#946638]/30'
                      : 'bg-[#faf8f4] border-[#ded5c2] hover:border-[#bda588] hover:bg-[#f2ece0] text-[#423b32]'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-[#1c1917]">{acc.role}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ebe2d3] text-[#784f27] font-semibold">
                        {acc.tier}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#786f63] mt-0.5 font-mono">{acc.email}</p>
                  </div>
                  {isActive && (
                    <CheckCircle className="w-4 h-4 text-[#946638] shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-[#ded5c2] text-[10px] text-[#786f63] flex items-center justify-between">
            <span>Password for all: <strong>password123</strong></span>
            <span>Switch takes ~100ms</span>
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-[#1c1917] hover:bg-[#2b251f] text-[#f8f6f0] border border-[#ded5c2] shadow-xl text-xs font-bold transition-all duration-200 hover:scale-105"
      >
        <Users className="w-4 h-4 text-[#d4be9c]" />
        <span>Role: <strong className="text-[#dfb88e]">{user?.role || 'Guest'}</strong></span>
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
