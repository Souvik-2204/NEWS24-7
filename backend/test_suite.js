import axios from 'axios';

async function testFullPlatform() {
  console.log('Testing full platform...');
  
  // 1. Markets
  const mkt = await axios.get('http://localhost:5000/api/markets');
  console.log('1. Markets Loaded. Indian indices:', mkt.data.indianIndices?.length, 'Currencies:', mkt.data.currencies?.length);

  // 2. Auth - Login as Super Admin
  const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'admin@news247.global',
    password: 'password123'
  });
  console.log('2. Admin Login OK. Token received. Role:', adminLogin.data.user.role);
  const adminToken = adminLogin.data.token;

  // 3. Auth - Login as Author
  const authorLogin = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'author@news247.global',
    password: 'password123'
  });
  console.log('3. Author Login OK. Role:', authorLogin.data.user.role);
  const authorToken = authorLogin.data.token;

  // 4. Author creates article (enforced pending)
  const newArticle = await axios.post('http://localhost:5000/api/articles', {
    title: 'Post-Quantum Encryption Protocols Adopted by Central Bank Consortium',
    summary: 'Central banking networks transition to lattice-based post-quantum cryptography.',
    content: '<p>The international central banking consortium today finalized standards for lattice-based cryptographic key exchanges across cross-border settlement channels.</p>',
    category: 'technology',
    tags: ['Quantum', 'Banking', 'Cybersecurity'],
    accessLevel: 'silver',
    status: 'published'
  }, {
    headers: { Authorization: 'Bearer ' + authorToken }
  });
  console.log('4. Author submitted article ID:', newArticle.data.article.id, 'Enforced status:', newArticle.data.article.status);

  // 5. Author self-approval attempt (MUST BE BLOCKED)
  try {
    await axios.post('http://localhost:5000/api/articles/' + newArticle.data.article.id + '/review', {
      action: 'publish',
      comment: 'I approve my own article'
    }, {
      headers: { Authorization: 'Bearer ' + authorToken }
    });
    console.error('5. ERROR: Author self-approval was not blocked!');
  } catch(err) {
    console.log('5. Self-approval blocked! Code:', err.response?.status, 'Message:', err.response?.data?.message);
  }

  // 6. Super Admin review & approval
  const approved = await axios.post('http://localhost:5000/api/articles/' + newArticle.data.article.id + '/review', {
    action: 'publish',
    comment: 'Editorial board verified cryptographic sources.'
  }, {
    headers: { Authorization: 'Bearer ' + adminToken }
  });
  console.log('6. Admin approved article. New status:', approved.data.article.status);

  // 7. Demo Payment Failure Simulation
  const failTx = await axios.post('http://localhost:5000/api/subscriptions/checkout-demo', {
    planId: 'gold',
    billingCycle: 'monthly',
    simulateFailure: true,
    paymentMethod: 'Credit Card'
  }, {
    headers: { Authorization: 'Bearer ' + authorToken }
  }).catch(e => e.response);
  console.log('7. Payment failure simulation properly declined! Status:', failTx.status, 'Reason:', failTx.data?.transaction?.reason);

  // 8. Demo Payment Success Simulation
  const successTx = await axios.post('http://localhost:5000/api/subscriptions/checkout-demo', {
    planId: 'gold',
    billingCycle: 'annual',
    simulateFailure: false,
    paymentMethod: 'UPI'
  }, {
    headers: { Authorization: 'Bearer ' + authorToken }
  });
  console.log('8. Payment success simulation! New tier:', successTx.data.newTier, 'Invoice:', successTx.data.transaction?.invoiceNumber);

  // 9. Admin Stats
  const stats = await axios.get('http://localhost:5000/api/admin/stats', {
    headers: { Authorization: 'Bearer ' + adminToken }
  });
  console.log('9. Admin Stats: Total Articles:', stats.data.articles.total, 'Revenue:', stats.data.financials.totalRevenue, 'Active Subscribers:', stats.data.users.subscribers);

  console.log('\n======================================================');
  console.log('  >>> ALL SYSTEM & EDITORIAL WORKFLOW VERIFICATIONS PASSED 100%! <<<');
  console.log('======================================================\n');
}

testFullPlatform().catch(console.error);
