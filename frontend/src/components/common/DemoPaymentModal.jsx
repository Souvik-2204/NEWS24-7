import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, CreditCard, Smartphone, Building, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const DemoPaymentModal = ({ isOpen, onClose, initialPlan = 'gold', onPaymentComplete }) => {
  const { user, refreshUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success: boolean, message: string, invoice?: string }

  if (!isOpen) return null;

  const planPricing = {
    bronze: { name: 'Bronze Access', monthly: 99, annual: 950 },
    silver: { name: 'Silver Deep-Dive', monthly: 199, annual: 1900 },
    gold: { name: 'Gold All-Access VIP', monthly: 399, annual: 3800 }
  };

  const currentPlan = planPricing[selectedPlan.toLowerCase()] || planPricing.gold;
  const price = billingCycle === 'annual' ? currentPlan.annual : currentPlan.monthly;

  const handleSimulatePayment = async (simulateFailure = false) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await api.post('/subscriptions/checkout-demo', {
        planId: selectedPlan.toLowerCase(),
        billingCycle,
        paymentMethod,
        simulateFailure
      });

      setResult({
        success: true,
        message: res.data.message,
        invoice: res.data.transaction?.invoiceNumber,
        newTier: res.data.newTier
      });
      await refreshUser();
      if (onPaymentComplete) onPaymentComplete(res.data);
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Payment simulation declined. (Test failure demonstration).'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden animate-fade-in text-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#0d0e12]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-white">Simulated Demo Checkout</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors"
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
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}
            >
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm">{result.success ? 'Payment Simulation Successful!' : 'Payment Simulation Declined'}</p>
                <p className="mt-1 text-gray-300">{result.message}</p>
                {result.invoice && (
                  <p className="mt-1 font-mono text-[10px] text-emerald-400">
                    Demo Invoice: {result.invoice} • Tier Updated to {result.newTier}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
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
                        ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm'
                        : 'bg-zinc-800/60 border-zinc-800 text-gray-400 hover:bg-zinc-800'
                    }`}
                  >
                    <p className="font-bold text-xs uppercase tracking-wide">{planKey}</p>
                    <p className="text-sm font-semibold text-amber-400 mt-1">
                      ₹{billingCycle === 'annual' ? planPricing[planKey].annual : planPricing[planKey].monthly}
                    </p>
                    <p className="text-[10px] text-gray-500">{billingCycle === 'annual' ? '/year' : '/month'}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => { setBillingCycle('monthly'); setResult(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                billingCycle === 'monthly' ? 'bg-zinc-800 text-amber-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => { setBillingCycle('annual'); setResult(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                billingCycle === 'annual' ? 'bg-zinc-800 text-amber-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[9px] bg-amber-400/20 text-amber-400 px-1 rounded font-bold">20% OFF</span>
            </button>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
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
                        ? 'bg-amber-400/15 border-amber-400 text-white'
                        : 'bg-zinc-800/60 border-zinc-800 text-gray-400 hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-amber-400' : 'text-gray-400'}`} />
                    <span className="text-[11px] font-medium">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Total Demo Payable:</p>
              <p className="text-xl font-bold font-serif text-white">
                ₹{price} <span className="text-xs font-sans text-gray-500 font-normal">({billingCycle})</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1 text-[11px] text-amber-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulated Sandbox</span>
              </span>
              <p className="text-[10px] text-gray-500">Zero real charges</p>
            </div>
          </div>

          {/* Action Simulation Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSimulatePayment(false)}
              className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span>Simulate Successful Payment (Instant Upgrade)</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSimulatePayment(true)}
              className="w-full py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-rose-400 font-semibold text-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Payment Failure / Card Decline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
