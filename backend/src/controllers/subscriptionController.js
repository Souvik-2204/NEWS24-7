import { readJson, writeJson, logActivity } from '../utils/storage.js';

export const getPlans = async (req, res) => {
  try {
    const settings = await readJson('settings.json', {});
    const plans = settings.plans || {
      bronze: { monthly: 99, annual: 950, features: ['Ad-lite experience', 'Standard editorial stories', 'Daily market summary'] },
      silver: { monthly: 199, annual: 1900, features: ['Ad-free reading', 'Deep dive investigative journalism', 'Real-time stock charts & indices', 'Offline audio reader'] },
      gold: { monthly: 399, annual: 3800, features: ['Unlimited VIP access', 'All Silver features', 'Exclusive Chief Editor briefings', 'Wall Street & Dalal Street intelligence', 'Early access newsletters', 'Direct Q&A with journalists'] }
    };

    return res.json(plans);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve subscription plans.', error: err.message });
  }
};

export const subscribeDemo = async (req, res) => {
  try {
    const { planId, billingCycle = 'monthly', simulateFailure = false, paymentMethod = 'UPI' } = req.body;
    const user = req.user;

    const settings = await readJson('settings.json', {});
    const planConfig = settings.plans?.[planId?.toLowerCase()];

    if (!planConfig) {
      return res.status(400).json({ message: 'Invalid subscription plan chosen.' });
    }

    const amount = billingCycle === 'annual' ? planConfig.annual : planConfig.monthly;
    const txId = 'pay_tx_' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 4);

    const payments = await readJson('payments.json', []);

    // Payment simulation check
    if (simulateFailure) {
      const failedPayment = {
        id: txId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        planId,
        amount,
        currency: 'INR',
        status: 'failed',
        reason: 'Simulated Card Decline: Insufficient Sandbox Liquidity',
        paymentMethod,
        timestamp: new Date().toISOString()
      };
      payments.unshift(failedPayment);
      await writeJson('payments.json', payments);
      await logActivity('PAYMENT_FAILED_SIMULATION', { txId, planId, amount }, user.id, user.role);

      return res.status(402).json({
        success: false,
        message: 'Payment simulation declined. (Simulated test failure triggered as requested).',
        transaction: failedPayment
      });
    }

    // Success Simulation
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const successfulPayment = {
      id: txId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      planId,
      amount,
      currency: 'INR',
      status: 'success',
      paymentMethod,
      gatewayReference: `DEMO_GATEWAY_${Date.now()}`,
      timestamp: new Date().toISOString(),
      invoiceNumber
    };

    payments.unshift(successfulPayment);
    await writeJson('payments.json', payments);

    // Update or create subscription
    const subscriptions = await readJson('subscriptions.json', []);
    const existingSubIdx = subscriptions.findIndex((s) => s.userId === user.id);

    const durationDays = billingCycle === 'annual' ? 365 : 30;
    const startDate = new Date();
    const expiryDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const capitalizedTier = planId.charAt(0).toUpperCase() + planId.slice(1);

    const subscriptionData = {
      id: existingSubIdx !== -1 ? subscriptions[existingSubIdx].id : 'sub_' + Date.now().toString().slice(-6),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      planId,
      planName: `${capitalizedTier} Tier Subscription`,
      billingCycle,
      amountPaid: amount,
      currency: 'INR',
      status: 'active',
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      paymentMethod,
      autoRenew: true
    };

    if (existingSubIdx !== -1) {
      subscriptions[existingSubIdx] = subscriptionData;
    } else {
      subscriptions.push(subscriptionData);
    }
    await writeJson('subscriptions.json', subscriptions);

    // Update user tier and role in users.json
    const users = await readJson('users.json', []);
    const userIdx = users.findIndex((u) => u.id === user.id);
    if (userIdx !== -1) {
      users[userIdx].tier = capitalizedTier;
      if (users[userIdx].role === 'Free Reader') {
        users[userIdx].role = 'Subscriber';
      }
      await writeJson('users.json', users);
    }

    await logActivity('SUBSCRIPTION_ACTIVATED', { planId, billingCycle, amount }, user.id, user.role);

    return res.json({
      success: true,
      message: `Congratulations! Your ${capitalizedTier} Subscription is now active.`,
      subscription: subscriptionData,
      transaction: successfulPayment,
      newTier: capitalizedTier
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to process demo subscription.', error: err.message });
  }
};

export const getMySubscription = async (req, res) => {
  try {
    const subscriptions = await readJson('subscriptions.json', []);
    const payments = await readJson('payments.json', []);

    const userSub = subscriptions.find((s) => s.userId === req.user.id);
    const userPayments = payments.filter((p) => p.userId === req.user.id);

    return res.json({
      subscription: userSub || null,
      transactions: userPayments
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve subscription.', error: err.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscriptions = await readJson('subscriptions.json', []);
    const userSubIdx = subscriptions.findIndex((s) => s.userId === req.user.id && s.status === 'active');

    if (userSubIdx === -1) {
      return res.status(404).json({ message: 'No active subscription found to cancel.' });
    }

    subscriptions[userSubIdx].autoRenew = false;
    subscriptions[userSubIdx].status = 'cancelled';
    await writeJson('subscriptions.json', subscriptions);

    await logActivity('SUBSCRIPTION_CANCELLED', { subId: subscriptions[userSubIdx].id }, req.user.id, req.user.role);

    return res.json({
      message: 'Subscription renewal has been cancelled. Access remains valid until expiry date.',
      subscription: subscriptions[userSubIdx]
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to cancel subscription.', error: err.message });
  }
};
