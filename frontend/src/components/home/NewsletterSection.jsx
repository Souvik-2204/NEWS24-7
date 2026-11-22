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
      <div className="relative rounded-3xl bg-gradient-to-r from-[#f5eee2] via-[#fbf8f2] to-[#ede3d2] border border-[#d9ccb6] p-8 sm:p-12 overflow-hidden shadow-sm">
        
        {/* Ambient warm glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#946638]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#e8decd] border border-[#cfbe9f] text-[#734b22] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#946638]" />
            <span>Chief Editor's Morning Briefing</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1c1917] leading-tight mb-3">
            Essential global intelligence delivered at dawn.
          </h3>

          <p className="text-[#574f45] text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            Join over 120,000 policymakers, fund managers, and diplomats receiving our curated executive summary of overnight geopolitics, market trends, and investigative dispatches.
          </p>

          {subscribed ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center space-x-3 text-xs shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Subscription Confirmed</p>
                <p className="text-emerald-700 text-[11px]">You will receive tomorrow morning's 06:00 IST Executive Intelligence Briefing.</p>
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
                  className="w-full bg-white border border-[#cfbe9f] focus:border-[#946638] text-xs text-[#1c1917] placeholder-[#8c8273] rounded-full pl-10 pr-4 py-3 outline-none transition-colors shadow-sm"
                />
                <Mail className="w-4 h-4 text-[#8c8273] absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 shadow-md shrink-0"
              >
                Join Briefing
              </button>
            </form>
          )}

          <div className="flex items-center space-x-4 mt-4 text-[11px] text-[#786f63]">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#946638]" />
              <span>Strict Privacy Protocol</span>
            </div>
            <span>•</span>
            <span>Unsubscribe with 1-click anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};
