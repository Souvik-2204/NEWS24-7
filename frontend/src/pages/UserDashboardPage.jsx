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
      
      {/* Header Banner in Warm White/Beige */}
      <div className="p-8 rounded-3xl bg-white border border-[#ded5c2] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Reader'}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#946638]"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-2xl font-bold text-[#1c1917]">{user?.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f2ece0] text-[#784f27] font-bold border border-[#d3c4b0]">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-[#786f63] font-mono mt-1">{user?.email}</p>
            <p className="text-xs text-[#574f45] mt-1">{user?.bio || 'NEWS 24*7 Reader Account'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/saved"
            className="px-4 py-2 rounded-full bg-[#f2ece0] hover:bg-[#eae2d2] text-xs font-bold text-[#1c1917] flex items-center space-x-1.5 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-[#946638]" />
            <span>Saved Stories ({user?.bookmarks?.length || 0})</span>
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Subscription Card & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Active Membership Status (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#ded5c2] shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#ded5c2]">
              <span className="text-xs font-bold text-[#946638] uppercase tracking-widest">
                Membership Tier
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user?.tier || 'Free'} Status</span>
              </span>
            </div>

            <div className="my-6">
              <h3 className="font-serif text-2xl font-bold text-[#1c1917]">
                {subscription ? subscription.planName : `${user?.tier || 'Free'} Reader Pass`}
              </h3>
              <p className="text-xs text-[#574f45] mt-1 leading-relaxed font-normal">
                {subscription
                  ? `Active via ${subscription.paymentMethod || 'UPI / Card'}.`
                  : 'You are currently on the free public dispatch tier.'}
              </p>

              {subscription && (
                <div className="mt-4 p-4 rounded-2xl bg-[#faf7f2] border border-[#ded5c2] text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#786f63]">Billing Cycle:</span>
                    <span className="text-[#1c1917] font-semibold capitalize">{subscription.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786f63]">Amount Paid:</span>
                    <span className="text-[#946638] font-bold">₹{subscription.amountPaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786f63]">Valid Through:</span>
                    <span className="text-[#1c1917] font-semibold">
                      {new Date(subscription.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786f63]">Auto Renewal:</span>
                    <span className={subscription.autoRenew ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                      {subscription.autoRenew ? 'Enabled' : 'Cancelled'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {cancelMessage && (
              <div className="p-3 mb-4 rounded-xl bg-[#f2ece0] border border-[#d3c4b0] text-xs text-[#784f27]">
                {cancelMessage}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full py-3 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] shadow-md flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{subscription ? 'Upgrade / Switch Tier' : 'Upgrade to VIP Gold'}</span>
              </button>

              {subscription && subscription.autoRenew && (
                <button
                  disabled={cancelling}
                  onClick={handleCancelSub}
                  className="w-full py-2 rounded-full bg-[#f2ece0] hover:bg-[#e8dece] text-rose-700 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Processing...' : 'Cancel Auto-Renewal'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Payment History & Simulated Invoices (Col 7) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 border border-[#ded5c2] shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#1c1917] mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-[#946638]" />
              <span>Payment & Simulated Invoice History</span>
            </h3>

            {loading ? (
              <p className="text-xs text-[#786f63] py-8 text-center">Loading payment receipts...</p>
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center text-[#786f63]">
                <p className="font-serif text-lg font-bold text-[#1c1917]">No Transactions Yet</p>
                <p className="text-xs mt-1">Upgrade your tier to generate a simulated demo invoice.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ded5c2] flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#1c1917] uppercase">{tx.tier} Membership</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#786f63] font-mono mt-1">
                        Invoice ID: {tx.id} • {new Date(tx.date || tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-base font-bold text-[#946638]">₹{tx.amount}</span>
                      <span className="text-[10px] text-[#786f63] block capitalize">{tx.billingCycle}</span>
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
        defaultPlan={user?.tier === 'Gold' ? 'gold' : 'gold'}
      />
    </div>
  );
};
