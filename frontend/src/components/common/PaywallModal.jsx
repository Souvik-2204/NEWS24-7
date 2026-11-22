import React from 'react';
import { Lock, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PaywallModal = ({ requiredTier = 'Gold', userCurrentTier = 'Free', onSubscribeClick }) => {
  return (
    <div className="relative my-8 p-8 md:p-10 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-[#0d0e12] border border-amber-500/30 shadow-2xl text-center overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mb-4">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>

        <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
          Exclusive <span className="text-amber-400">{requiredTier.toUpperCase()}</span> Editorial Story
        </h3>
        
        <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6">
          This deep-dive investigation is reserved for our accredited <span className="font-semibold text-white">{requiredTier}</span> subscribers. Your current tier is <span className="text-amber-400 font-semibold">{userCurrentTier}</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs text-gray-300 mb-8 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Unrestricted investigative journalism</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Real-time Wall & Dalal Street charts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ad-free editorial reading format</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Simulated instant demo activation</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSubscribeClick}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Upgrade to {requiredTier} (Demo Checkout)</span>
          </button>
          <Link
            to="/subscriptions"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-gray-200 font-medium text-xs transition-colors flex items-center justify-center space-x-1"
          >
            <span>Compare All Plans</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};
