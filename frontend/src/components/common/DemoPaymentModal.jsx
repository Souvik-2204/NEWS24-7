import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  ShieldCheck,
  Building,
  Smartphone,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const DemoPaymentModal = ({ isOpen, onClose, defaultPlan = 'gold' }) => {
  const { user, refreshUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const planPricing = {
    bronze: { monthly: 99, annual: 950 },
    silver: { monthly: 199, annual: 1900 },
    gold: { monthly: 399, annual: 3800 }
  };

  const price = billingCycle === 'annual'
    ? planPricing[selectedPlan.toLowerCase()]?.annual
    : planPricing[selectedPlan.toLowerCase()]?.monthly;

  const handleSimulatePayment = async (shouldFail = false) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/subscriptions/subscribe', {
        planId: selectedPlan.toLowerCase(),
        billingCycle,
        paymentMethod,
        simulateFailure: shouldFail
      });
      setResult({
        success: true,
        message: res.data.message,
        invoice: res.data.invoice?.id,
        newTier: res.data.newTier
      });
      await refreshUser();
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Payment simulation failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-[#ded5c2] rounded-3xl shadow-2xl overflow-hidden animate-fade-in text-[#1c1917]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#ded5c2] bg-[#fbf9f4]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#946638]" />
            <h3 className="font-serif text-lg font-bold text-[#1c1917]">Simulated Demo Checkout</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#ede5d6] text-[#786f63] hover:text-[#1c1917] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Result Alert if already simulated */}
          {result && (
            <div
              className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
                result.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm">{result.success ? 'Payment Simulation Successful!' : 'Payment Simulation Declined'}</p>
                <p className="mt-1 text-[#574f45]">{result.message}</p>
                {result.invoice && (
                  <p className="mt-1 font-mono text-[10px] text-emerald-700 font-bold">
                    Demo Invoice: {result.invoice} • Tier Updated to {result.newTier}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1c1917] uppercase tracking-wider mb-2">
              Select Subscription Plan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['bronze', 'silver', 'gold'].map((planKey) => {
                const isSelected = selectedPlan.toLowerCase() === planKey;
                return (
                  <button
                    key={planKey}
                    type="button"
                    onClick={() => { setSelectedPlan(planKey); setResult(null); }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#f4efe4] border-[#946638] text-[#1c1917] shadow-sm ring-1 ring-[#946638]'
                        : 'bg-white border-[#ded5c2] text-[#574f45] hover:bg-[#fbf9f4]'
                    }`}
                  >
                    <p className="font-bold text-xs uppercase tracking-wide">{planKey}</p>
                    <p className="text-sm font-bold text-[#946638] mt-1">
                      ₹{billingCycle === 'annual' ? planPricing[planKey].annual : planPricing[planKey].monthly}
                    </p>
                    <p className="text-[10px] text-[#786f63]">{billingCycle === 'annual' ? '/year' : '/month'}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center p-1 bg-[#ede5d6] rounded-xl border border-[#ded5c2]">
            <button
              type="button"
              onClick={() => { setBillingCycle('monthly'); setResult(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                billingCycle === 'monthly' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#574f45] hover:text-[#1c1917]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => { setBillingCycle('annual'); setResult(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                billingCycle === 'annual' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#574f45] hover:text-[#1c1917]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[9px] bg-[#946638] text-white px-1.5 py-0.2 rounded font-bold">20% OFF</span>
            </button>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1c1917] uppercase tracking-wider mb-2">
              Simulated Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                { id: 'Credit Card', label: 'Card Demo', icon: CreditCard },
                { id: 'NetBanking', label: 'NetBanking', icon: Building }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#f4efe4] border-[#946638] text-[#1c1917] font-bold shadow-sm'
                        : 'bg-white border-[#ded5c2] text-[#574f45] hover:bg-[#fbf9f4]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#946638]' : 'text-[#786f63]'}`} />
                    <span className="text-[11px] font-medium">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ded5c2] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#786f63]">Total Demo Payable:</p>
              <p className="text-xl font-bold font-serif text-[#1c1917]">
                ₹{price} <span className="text-xs font-sans text-[#786f63] font-normal">({billingCycle})</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1 text-[11px] text-[#946638] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#946638]" />
                <span>Simulated Sandbox</span>
              </span>
              <p className="text-[10px] text-[#786f63]">Zero real charges</p>
            </div>
          </div>

          {/* Action Simulation Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSimulatePayment(false)}
              className="w-full py-3 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Simulate Successful Payment (Instant Upgrade)</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSimulatePayment(true)}
              className="w-full py-2.5 rounded-full bg-[#f2ece0] hover:bg-[#e8dece] text-rose-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
              <span>Simulate Payment Failure / Card Decline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
