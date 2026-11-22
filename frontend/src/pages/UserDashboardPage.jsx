import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  CreditCard,
  Bookmark,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  LogOut
} from 'lucide-react';
import api from '../services/api';
import { DemoPaymentModal } from '../components/common/DemoPaymentModal';

export const UserDashboardPage = () => {
  const { user, subscription, refreshUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const fetchStatusAndTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/subscriptions/my-status');
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error('Failed to load user subscription status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndTransactions();
  }, [user]);

  const handleCancelSub = async () => {
    if (!window.confirm('Simulate cancellation of auto-renew on your subscription?')) return;
    setCancelling(true);
    try {
      const res = await api.post('/subscriptions/cancel');
      setCancelMessage(res.data.message);
      await refreshUser();
      await fetchStatusAndTransactions();
    } catch (err) {
      alert('Cancellation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Reader'}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-2xl font-bold text-white">{user?.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-400 font-semibold">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">{user?.email}</p>
            <p className="text-xs text-gray-500 mt-1">{user?.bio || 'NEWS 24*7 Reader Account'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/saved"
            className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-gray-200 flex items-center space-x-1.5 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Saved Stories ({user?.bookmarks?.length || 0})</span>
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Subscription Card & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Active Membership Status (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Membership Tier
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user?.tier || 'Free'} Status</span>
              </span>
            </div>

            <div className="my-6">
              <h3 className="font-serif text-2xl font-bold text-white">
                {subscription ? subscription.planName : `${user?.tier || 'Free'} Reader Pass`}
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {subscription
                  ? `Active via ${subscription.paymentMethod || 'UPI / Card'}.`
                  : 'You are currently on the free public dispatch tier.'}
              </p>

              {subscription && (
                <div className="mt-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Billing Cycle:</span>
                    <span className="text-white capitalize">{subscription.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="text-amber-400 font-bold">₹{subscription.amountPaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valid Through:</span>
                    <span className="text-white">
                      {new Date(subscription.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Auto Renewal:</span>
                    <span className={subscription.autoRenew ? 'text-emerald-400' : 'text-rose-400'}>
                      {subscription.autoRenew ? 'Enabled' : 'Cancelled'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {cancelMessage && (
              <div className="p-3 mb-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-300">
                {cancelMessage}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] shadow-lg flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>{subscription ? 'Upgrade / Switch Tier' : 'Upgrade to VIP Gold'}</span>
              </button>

              {subscription && subscription.autoRenew && (
                <button
                  disabled={cancelling}
                  onClick={handleCancelSub}
                  className="w-full py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-rose-400 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Processing...' : 'Cancel Auto-Renewal'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Payment History & Simulated Invoices (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-zinc-800">
            <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Simulated Payment History & Invoices</span>
              <CreditCard className="w-4 h-4 text-amber-400" />
            </h3>

            {transactions.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs">
                No simulated transactions on record yet.
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white uppercase">{tx.planId} Tier</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            tx.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-mono mt-1">
                        Invoice: {tx.invoiceNumber || tx.id} • {new Date(tx.timestamp).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-500">{tx.paymentMethod}</p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-white block">₹{tx.amount}</span>
                      <span className="text-[10px] text-gray-500">Sandbox Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Demo Checkout Modal */}
      <DemoPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        initialPlan="gold"
        onPaymentComplete={() => {
          setPaymentModalOpen(false);
          fetchStatusAndTransactions();
        }}
      />
    </div>
  );
};
