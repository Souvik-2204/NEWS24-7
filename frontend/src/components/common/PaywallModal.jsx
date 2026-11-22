import React from 'react';
import { Lock, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PaywallModal = ({ requiredTier = 'Gold', userCurrentTier = 'Free', onSubscribeClick }) => {
  return (
    <div className="relative my-8 p-8 md:p-10 rounded-3xl bg-gradient-to-b from-white via-[#fcfbf9] to-[#f5eee2] border-2 border-[#caa87e] shadow-xl text-center overflow-hidden">
      {/* Background ambient warm glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#946638]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-[#f2ece0] border border-[#d3c4b0] text-[#784f27] mb-4 shadow-sm">
          <Lock className="w-8 h-8 text-[#946638]" />
        </div>

        <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1c1917] mb-2">
          Exclusive <span className="text-[#946638]">{requiredTier.toUpperCase()}</span> Editorial Story
        </h3>
        
        <p className="text-[#574f45] text-xs md:text-sm leading-relaxed mb-6 font-normal">
          This deep-dive investigation is reserved for our accredited <span className="font-bold text-[#1c1917]">{requiredTier}</span> subscribers. Your current tier is <span className="text-[#946638] font-bold">{userCurrentTier}</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs text-[#574f45] mb-8 bg-white/90 p-4 rounded-2xl border border-[#ded5c2] shadow-sm">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#946638] shrink-0" />
            <span>Unrestricted investigative journalism</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#946638] shrink-0" />
            <span>Real-time Wall & Dalal Street charts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#946638] shrink-0" />
            <span>Ad-free editorial reading format</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-[#946638] shrink-0" />
            <span>Simulated instant demo activation</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSubscribeClick}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 shadow-md flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#f4efe4]" />
            <span>Upgrade to {requiredTier} (Demo Checkout)</span>
          </button>
          <Link
            to="/subscriptions"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#ede5d6] hover:bg-[#ded4c3] text-[#1c1917] font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
          >
            <span>Compare All Plans</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#574f45]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
