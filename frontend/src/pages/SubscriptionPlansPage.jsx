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

  const handleSelectPlan = (planId) => {
    setSelectedPlanForModal(planId);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-[#946638] uppercase tracking-widest px-3 py-1 rounded-full bg-[#f2ece0] border border-[#d3c4b0] inline-block shadow-sm">
          Independent Journalism • Institutional Trust
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#1c1917]">
          Accredited Editorial Membership Plans
        </h1>
        <p className="text-[#574f45] text-sm sm:text-base leading-relaxed">
          Support fearless, fact-checked investigative journalism with unrestricted access to global correspondents, market telemetry, and executive briefings.
        </p>

        {/* Billing cycle switch */}
        <div className="inline-flex items-center p-1 bg-[#ede5d6] rounded-2xl border border-[#ded5c2] mt-4 shadow-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-[#1c1917] shadow-sm'
                : 'text-[#574f45] hover:text-[#1c1917]'
            }`}
          >
            Monthly Invoicing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
              billingCycle === 'annual'
                ? 'bg-white text-[#1c1917] shadow-sm'
                : 'text-[#574f45] hover:text-[#1c1917]'
            }`}
          >
            <span>Annual Invoicing</span>
            <span className="text-[10px] bg-[#946638] text-white px-2 py-0.5 rounded-full font-bold">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p) => {
          const isUserCurrent = user?.tier?.toLowerCase() === p.id;
          const price = billingCycle === 'annual' ? p.annualPrice : p.monthlyPrice;

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                p.popular
                  ? 'bg-gradient-to-b from-[#fbf8f2] to-white border-2 border-[#946638] shadow-xl'
                  : 'bg-white border border-[#ded5c2] shadow-sm hover:border-[#bda588]'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#946638] text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
                  Most Popular Across Institutions
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-2xl font-bold text-[#1c1917]">{p.name}</h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f2ece0] text-[#784f27] border border-[#d3c4b0]">
                    {p.badge}
                  </span>
                </div>

                <p className="text-xs text-[#574f45] leading-relaxed mb-6 font-normal">
                  {p.tagline}
                </p>

                <div className="mb-8 pb-6 border-b border-[#ded5c2]">
                  <span className="font-serif text-4xl sm:text-5xl font-black text-[#1c1917]">
                    ₹{price}
                  </span>
                  <span className="text-xs text-[#786f63] font-mono ml-2">
                    {billingCycle === 'annual' ? '/year' : '/month'}
                  </span>
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-3.5 text-xs text-[#423b32] mb-8">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-[#946638] shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  onClick={() => handleSelectPlan(p.id)}
                  className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md flex items-center justify-center space-x-1.5 ${
                    p.popular
                      ? 'bg-[#946638] hover:bg-[#7e552d] text-white'
                      : 'bg-[#1c1917] hover:bg-[#2e261f] text-[#f8f6f0]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isUserCurrent ? 'Current Active Tier' : `Select ${p.name}`}</span>
                </button>
                <p className="text-center text-[10px] text-[#786f63] mt-2 font-mono">
                  Simulated Demo Checkout • Cancel Anytime
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demo Checkout Modal */}
      <DemoPaymentModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        defaultPlan={selectedPlanForModal}
      />
    </div>
  );
};
