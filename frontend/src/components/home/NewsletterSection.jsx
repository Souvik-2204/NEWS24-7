import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-[#12131a] border border-amber-400/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
        
        {/* Ambient glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chief Editor's Morning Briefing</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
            Essential global intelligence delivered at dawn.
          </h3>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
            Join over 120,000 policymakers, fund managers, and diplomats receiving our curated executive summary of overnight geopolitics, market trends, and investigative dispatches.
          </p>

          {subscribed ? (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center space-x-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">Subscription Confirmed</p>
                <p className="text-gray-300 text-[11px]">You will receive tomorrow morning's 06:00 IST Executive Intelligence Briefing.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your institutional or work email..."
                  className="w-full bg-zinc-950/80 border border-zinc-700 focus:border-amber-400 text-xs text-white rounded-full pl-10 pr-4 py-3 outline-none transition-colors"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 shadow-md shrink-0"
              >
                Join Morning Dispatch
              </button>
            </form>
          )}

          <div className="flex items-center space-x-4 mt-4 text-[11px] text-gray-500">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>No spam guarantee</span>
            </span>
            <span>•</span>
            <span>Unsubscribe anytime with one click</span>
          </div>
        </div>
      </div>
    </section>
  );
};
