import React, { useState } from 'react';
import { Check, Sparkles, Shield, Zap, Award, ArrowRight } from 'lucide-react';
import { DemoPaymentModal } from '../components/common/DemoPaymentModal';
import { useAuth } from '../context/AuthContext';

export const SubscriptionPlansPage = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState('gold');

  const plans = [
    {
      id: 'bronze',
      name: 'Bronze Access',
      tagline: 'Essential daily digital newspaper for the engaged citizen.',
      monthlyPrice: 99,
      annualPrice: 950,
      badge: 'Popular',
      features: [
        'Ad-lite reading layout across devices',
        'Full access to all standard editorial dispatches',
        'Daily morning market summary email',
        'Saved articles bookmark syncing',
        'Standard reader community commentary'
      ]
    },
    {
      id: 'silver',
      name: 'Silver Deep-Dive',
      tagline: 'Comprehensive investigative journalism & stock market tools.',
      monthlyPrice: 199,
      annualPrice: 1900,
      badge: 'Recommended',
      popular: true,
      features: [
        '100% Ad-free pristine editorial experience',
        'All Bronze features included',
        'Unrestricted access to Silver investigative reports',
        'Interactive real-time Dalal & Wall Street chart tools',
        'Offline audio reader simulation on all articles',
        'Weekend deep-dive geopolitical essays'
      ]
    },
    {
      id: 'gold',
      name: 'Gold All-Access VIP',
      tagline: 'The ultimate financial intelligence & executive briefing suite.',
      monthlyPrice: 399,
      annualPrice: 3800,
      badge: 'VIP Intelligence',
      features: [
        'Complete, unrestricted VIP access to all archives',
        'Exclusive Chief Editor briefings & scoops',
        'Wall Street & Dalal Street proprietary financial modeling',
        'Early access to weekly special investigations',
        'Direct monthly digital town halls with foreign correspondents',
        'Priority editorial verification requests'
      ]
    }
  ];

  const handleOpenCheckout = (planId) => {
    setSelectedPlanForModal(planId);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title & Tagline */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 inline-block">
          Independent Press Membership
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-white leading-tight">
          Support fearless journalism. Power financial clarity.
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
          Choose a subscription tier designed for global thinkers, policymakers, and market leaders.
          Experience our simulated payment sandbox with instant activation.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="inline-flex items-center p-1.5 rounded-full bg-zinc-900 border border-zinc-800 mt-6">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              billingCycle === 'monthly' ? 'bg-amber-400 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
              billingCycle === 'annual' ? 'bg-amber-400 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] bg-zinc-950 text-amber-400 px-2 py-0.5 rounded-full font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p) => {
          const isCurrentTier = user?.tier?.toLowerCase() === p.id;
          const price = billingCycle === 'annual' ? p.annualPrice : p.monthlyPrice;

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                p.popular
                  ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-[#12131b] border-2 border-amber-400/80 shadow-2xl scale-105 z-10'
                  : 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                  Most Preferred
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{p.badge}</span>
                  {isCurrentTier && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-white mb-2">{p.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">{p.tagline}</p>

                {/* Price Display */}
                <div className="flex items-baseline space-x-1 mb-8 pb-6 border-b border-zinc-800">
                  <span className="text-4xl font-serif font-black text-white">₹{price}</span>
                  <span className="text-xs text-gray-500 font-sans">
                    {billingCycle === 'annual' ? ' / year' : ' / month'}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-3.5 mb-8 text-xs text-gray-300">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleOpenCheckout(p.id)}
                className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2 ${
                  p.popular
                    ? 'bg-amber-400 hover:bg-amber-300 text-black'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isCurrentTier ? 'Manage or Renew Plan' : `Subscribe to ${p.name}`}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Institutional Guarantee */}
      <div className="mt-16 p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800 text-center max-w-2xl mx-auto">
        <Shield className="w-8 h-8 text-amber-400 mx-auto mb-3" />
        <h4 className="font-serif text-lg font-bold text-white">Simulated Payment & Security Guarantee</h4>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          All checkout interactions in this environment use demo sandbox transactions. No real credit card or UPI banking credentials are requested or recorded. You can test instant activations and failures freely.
        </p>
      </div>

      {/* Checkout Modal */}
      <DemoPaymentModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        initialPlan={selectedPlanForModal}
      />
    </div>
  );
};
