import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Users,
  CreditCard,
  Settings,
  Flame,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Shield,
  Eye,
  Lock,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';

export const AdminDashboardPage = () => {
  const { user, isEditorialStaff, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'articles' | 'editorial' | 'users' | 'breaking' | 'hero' | 'payments' | 'settings'
  const [stats, setStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Article creation/editing modal state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'world',
    tags: 'Geopolitics, Treaty',
    imageUrl: '',
    accessLevel: 'free',
    status: 'published',
    isFeatured: false,
    isBreaking: false,
    readTime: '6 min read'
  });

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTargetArticle, setReviewTargetArticle] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Breaking news form state
  const [newBreakingTitle, setNewBreakingTitle] = useState('');
  const [newBreakingCat, setNewBreakingCat] = useState('Markets');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, artsRes, brkRes, heroRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/articles?limit=100&status=all'),
        api.get('/news/breaking'),
        api.get('/news/hero-slides')
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (artsRes.status === 'fulfilled') setArticles(artsRes.value.data.articles || []);
      if (brkRes.status === 'fulfilled') setBreakingNews(brkRes.value.data || []);
      if (heroRes.status === 'fulfilled') setHeroSlides(heroRes.value.data || []);

      if (isAdmin) {
        const [usrRes, payRes, setRes, logRes] = await Promise.allSettled([
          api.get('/admin/users'),
          api.get('/admin/payments'),
          api.get('/admin/settings'),
          api.get('/admin/logs')
        ]);
        if (usrRes.status === 'fulfilled') setUsersList(usrRes.value.data || []);
        if (payRes.status === 'fulfilled') setPayments(payRes.value.data || []);
        if (setRes.status === 'fulfilled') setSettings(setRes.value.data || {});
        if (logRes.status === 'fulfilled') setLogs(logRes.value.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditorialStaff) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user]);

  // Handle article submit (create or edit)
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticleId) {
        await api.put(`/articles/${editingArticleId}`, articleForm);
      } else {
        await api.post('/articles', articleForm);
      }
      setIsArticleModalOpen(false);
      setEditingArticleId(null);
      fetchDashboardData();
    } catch (err) {
      alert('Error saving article: ' + (err.response?.data?.message || err.message));
    }
  };

  const openEditArticle = (art) => {
    setEditingArticleId(art.id);
    setArticleForm({
      title: art.title,
      summary: art.summary,
      content: art.content,
      category: art.category,
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : art.tags,
      imageUrl: art.imageUrl,
      accessLevel: art.accessLevel || 'free',
      status: art.status || 'published',
      isFeatured: !!art.isFeatured,
      isBreaking: !!art.isBreaking,
      readTime: art.readTime || '5 min read'
    });
    setIsArticleModalOpen(true);
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article permanently?')) return;
    try {
      await api.delete(`/articles/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Review workflow action (approve or reject)
  const handleReviewAction = async (action) => {
    setReviewError('');
    if (!reviewTargetArticle) return;

    // Authors cannot approve their own articles check
    if (reviewTargetArticle.author?.id === user.id) {
      setReviewError('Strict Policy Violation: You cannot approve or review your own article.');
      return;
    }

    try {
      await api.post(`/articles/${reviewTargetArticle.id}/review`, {
        action,
        comment: reviewComment || `Reviewed by ${user.name} (${user.role})`
      });
      setReviewModalOpen(false);
      setReviewTargetArticle(null);
      setReviewComment('');
      fetchDashboardData();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Review submission failed.');
    }
  };

  // User role/tier update
  const handleUpdateUser = async (userId, role, tier) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role, tier });
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update user: ' + (err.response?.data?.message || err.message));
    }
  };

  // Add breaking news item
  const handleAddBreaking = async (e) => {
    e.preventDefault();
    if (!newBreakingTitle.trim()) return;
    const newItem = {
      id: 'brk_' + Date.now(),
      title: newBreakingTitle.trim(),
      category: newBreakingCat,
      priority: 'high',
      url: '/markets',
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...breakingNews];
    try {
      await api.put('/admin/breaking', { breaking: updated });
      setBreakingNews(updated);
      setNewBreakingTitle('');
    } catch (err) {
      alert('Failed to update breaking news.');
    }
  };

  const handleDeleteBreaking = async (id) => {
    const updated = breakingNews.filter((b) => b.id !== id);
    try {
      await api.put('/admin/breaking', { breaking: updated });
      setBreakingNews(updated);
    } catch (err) {
      alert('Failed to delete breaking ticker.');
    }
  };

  // Filter pending review articles
  const pendingArticles = articles.filter((a) => a.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1.5">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Editorial Intelligence & Governance Bureau</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            NEWS 24*7 Admin Control Center
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Logged in as <strong className="text-white">{user?.name}</strong> ({user?.role}) • Verified Access
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setEditingArticleId(null);
              setArticleForm({
                title: '',
                summary: '',
                content: '<p>Lead editorial dispatch text...</p>',
                category: 'world',
                tags: 'Diplomacy, International',
                imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
                accessLevel: 'free',
                status: user?.role === 'Author/Journalist' ? 'pending' : 'published',
                isFeatured: false,
                isBreaking: false,
                readTime: '5 min read'
              });
              setIsArticleModalOpen(true);
            }}
            className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Create Article</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-gray-400 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 border-b border-zinc-800/80">
        {[
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'editorial', label: `Review Queue (${pendingArticles.length})`, icon: Clock, alert: pendingArticles.length > 0 },
          { id: 'articles', label: `Articles (${articles.length})`, icon: FileText },
          { id: 'breaking', label: 'Breaking Ticker', icon: Flame },
          { id: 'hero', label: 'Hero Carousel', icon: ImageIcon },
          ...(isAdmin ? [
            { id: 'users', label: 'Users & Roles', icon: Users },
            { id: 'payments', label: 'Payment Audit', icon: CreditCard },
            { id: 'settings', label: 'Settings & Logs', icon: Settings }
          ] : [])
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-zinc-900/60 text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Analytics Overview */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-8 animate-fade-in">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Registered Users</span>
              <span className="text-3xl font-black font-mono text-white mt-1 block">{stats.users?.total}</span>
              <span className="text-xs text-amber-400 font-mono mt-1 block">{stats.users?.subscribers} Active Subscribers</span>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Dispatches</span>
              <span className="text-3xl font-black font-mono text-white mt-1 block">{stats.articles?.total}</span>
              <span className="text-xs text-emerald-400 font-mono mt-1 block">{stats.articles?.published} Published</span>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Pending Editorial Review</span>
              <span className="text-3xl font-black font-mono text-amber-400 mt-1 block">{stats.articles?.pending}</span>
              <span className="text-xs text-gray-400 font-mono mt-1 block">Awaiting approval</span>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Simulated Revenue (INR)</span>
              <span className="text-3xl font-black font-mono text-white mt-1 block">₹{stats.financials?.totalRevenue?.toLocaleString()}</span>
              <span className="text-xs text-emerald-400 font-mono mt-1 block">{stats.financials?.successfulTransactions} Successful TXs</span>
            </div>
          </div>

          {/* Activity Logs & Quick Review Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 glass-card rounded-3xl p-6 border border-zinc-800">
              <h3 className="font-serif text-lg font-bold text-white mb-4">
                Recent Institutional Activity Audit
              </h3>
              <div className="space-y-2.5">
                {stats.recentLogs?.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-amber-400 font-mono text-[11px] uppercase mr-2">
                        [{log.action}]
                      </span>
                      <span className="text-gray-300 font-mono">
                        {log.details?.title || log.details?.email || JSON.stringify(log.details)}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-zinc-800 space-y-4">
              <h3 className="font-serif text-lg font-bold text-white">Editorial Protocol Note</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Articles authored by Journalists automatically route to the Review Queue. Authors cannot approve their own submissions. Section Editors and Chief Editors retain full sign-off authority.
              </p>
              <button
                onClick={() => setActiveTab('editorial')}
                className="w-full py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider"
              >
                Inspect Review Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Editorial Review Queue */}
      {activeTab === 'editorial' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Editorial Review Queue</h3>
              <p className="text-xs text-gray-400">Articles pending sign-off before publication.</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 font-bold font-mono">
              {pendingArticles.length} Pending
            </span>
          </div>

          {pendingArticles.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="font-serif text-lg">The Editorial Queue is pristine.</p>
              <p className="text-xs text-gray-500">All submitted journalist dispatches have been evaluated.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold uppercase text-[9px]">
                        {art.category}
                      </span>
                      <span className="text-gray-400 font-mono">By {art.author?.name} ({art.author?.role})</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-white leading-snug">{art.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{art.summary}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setReviewTargetArticle(art);
                        setReviewComment('');
                        setReviewError('');
                        setReviewModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider shadow-md"
                    >
                      Review & Approve / Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: All Articles Manager */}
      {activeTab === 'articles' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Article Archive Management</h3>
              <p className="text-xs text-gray-400">Published, drafts, and pending editorial dispatches.</p>
            </div>
            <span className="text-xs text-gray-500 font-mono">{articles.length} Total Articles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-gray-400">
                  <th className="pb-3">Title & Category</th>
                  <th className="pb-3">Author</th>
                  <th className="pb-3">Access Tier</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Views</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 max-w-xs font-sans">
                      <Link to={`/article/${art.slug || art.id}`} className="font-bold text-white hover:text-amber-400 line-clamp-1">
                        {art.title}
                      </Link>
                      <span className="text-[10px] text-amber-400/90 font-mono uppercase">{art.category}</span>
                    </td>
                    <td className="py-3 text-gray-400">{art.author?.name || 'Wire'}</td>
                    <td className="py-3 capitalize text-amber-400 font-bold">{art.accessLevel || 'free'}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          art.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : art.status === 'pending'
                            ? 'bg-amber-400/20 text-amber-400'
                            : 'bg-zinc-800 text-gray-400'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{art.views?.toLocaleString() || 0}</td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => openEditArticle(art)}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1 rounded bg-zinc-800 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Breaking Ticker Manager */}
      {activeTab === 'breaking' && (
        <div className="space-y-6 animate-fade-in max-w-4xl">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white">Add Breaking News Ticker Item</h3>
            <form onSubmit={handleAddBreaking} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={newBreakingTitle}
                onChange={(e) => setNewBreakingTitle(e.target.value)}
                placeholder="Enter urgent headline text..."
                className="flex-1 bg-zinc-950 border border-zinc-700 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-amber-400"
              />
              <select
                value={newBreakingCat}
                onChange={(e) => setNewBreakingCat(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 text-xs text-white rounded-xl px-4 py-3 outline-none"
              >
                <option value="Markets">Markets</option>
                <option value="World">World</option>
                <option value="Politics">Politics</option>
                <option value="Science">Science</option>
              </select>
              <button
                type="submit"
                className="px-5 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider"
              >
                Publish to Ticker
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {breakingNews.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase mr-2">[{b.category}]</span>
                  <span className="text-white font-serif">{b.title}</span>
                </div>
                <button
                  onClick={() => handleDeleteBreaking(b.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Hero Carousel Manager */}
      {activeTab === 'hero' && (
        <div className="space-y-6 animate-fade-in max-w-4xl">
          <div className="pb-4 border-b border-zinc-800">
            <h3 className="font-serif text-xl font-bold text-white">Homepage Dynamic Hero Backgrounds</h3>
            <p className="text-xs text-gray-400">Controls the cinematic 30-60 second crossfade hero carousel.</p>
          </div>

          <div className="space-y-4">
            {heroSlides.map((slide, idx) => (
              <div key={slide.id} className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                  <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2 flex-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Slide #{idx + 1} • {slide.category}
                  </span>
                  <h4 className="font-serif text-base font-bold text-white leading-snug">{slide.title}</h4>
                  <p className="text-xs text-gray-400">{slide.subtitle}</p>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Accent Word Highlight: <span className="text-amber-400 font-bold">"{slide.accentWord}"</span> • Author: {slide.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Users & Roles (Super Admin) */}
      {activeTab === 'users' && isAdmin && (
        <div className="space-y-6 animate-fade-in">
          <div className="pb-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-white">User Accounts & Role Permissions</h3>
            <span className="text-xs text-gray-500 font-mono">{usersList.length} Accounts Registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-gray-400">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Membership Tier</th>
                  <th className="pb-3 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 font-sans font-bold text-white flex items-center space-x-2">
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full" />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 text-gray-400">{u.email}</td>
                    <td className="py-3 text-amber-400 font-bold">{u.role}</td>
                    <td className="py-3 capitalize text-emerald-400 font-bold">{u.tier || 'Free'}</td>
                    <td className="py-3 text-right">
                      {isSuperAdmin && (
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUser(u.id, e.target.value, u.tier)}
                          className="bg-zinc-900 border border-zinc-700 text-gray-200 text-xs rounded-lg px-2 py-1 outline-none"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Chief Editor">Chief Editor</option>
                          <option value="Section Editor">Section Editor</option>
                          <option value="Author/Journalist">Author/Journalist</option>
                          <option value="Subscriber">Subscriber</option>
                          <option value="Free Reader">Free Reader</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: Payment Audit & Sandbox Invoices */}
      {activeTab === 'payments' && isAdmin && (
        <div className="space-y-6 animate-fade-in">
          <div className="pb-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-white">Simulated Payment Transactions Audit</h3>
            <span className="text-xs text-gray-500 font-mono">{payments.length} Transactions Recorded</span>
          </div>

          <div className="space-y-3">
            {payments.map((tx) => (
              <div key={tx.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{tx.userName}</span>
                    <span className="text-gray-400 font-mono">({tx.userEmail})</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        tx.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono mt-1">
                    Invoice: {tx.invoiceNumber || tx.id} • Method: {tx.paymentMethod} • Tier: {tx.planId?.toUpperCase()}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-base font-bold text-white block">₹{tx.amount}</span>
                  <span className="text-[10px] text-gray-500">{new Date(tx.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: Settings & Audit Logs */}
      {activeTab === 'settings' && isAdmin && settings && (
        <div className="space-y-6 animate-fade-in max-w-3xl">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">Platform Settings</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Site Title</label>
                <input
                  type="text"
                  defaultValue={settings.siteName}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Hero Auto-Rotation Interval (Seconds)</label>
                <input
                  type="number"
                  defaultValue={settings.heroRotationIntervalSeconds || 30}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Create / Edit Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] text-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">
              {editingArticleId ? 'Edit Article' : 'Draft New Editorial Article'}
            </h3>

            <form onSubmit={handleArticleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="Enter headline..."
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Summary / Lead Paragraph</label>
                <textarea
                  rows={2}
                  required
                  value={articleForm.summary}
                  onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl p-3 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full HTML Article Content</label>
                <textarea
                  rows={6}
                  required
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl p-3 font-mono text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category Desk</label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 py-2.5 outline-none"
                  >
                    <option value="world">World</option>
                    <option value="india">India</option>
                    <option value="politics">Politics</option>
                    <option value="business">Business</option>
                    <option value="markets">Markets</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="science">Science</option>
                    <option value="opinion">Opinion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Membership Access Tier</label>
                  <select
                    value={articleForm.accessLevel}
                    onChange={(e) => setArticleForm({ ...articleForm, accessLevel: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 py-2.5 outline-none"
                  >
                    <option value="free">Free (Public Readers)</option>
                    <option value="bronze">Bronze Required</option>
                    <option value="silver">Silver Required</option>
                    <option value="gold">Gold VIP Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={articleForm.imageUrl}
                  onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-2.5 outline-none"
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.isFeatured}
                    onChange={(e) => setArticleForm({ ...articleForm, isFeatured: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-700 text-amber-400"
                  />
                  <span>Featured on Front Page</span>
                </label>
                <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.isBreaking}
                    onChange={(e) => setArticleForm({ ...articleForm, isBreaking: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-700 text-amber-400"
                  />
                  <span>Breaking Flag</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-zinc-800 text-gray-300 font-bold hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase tracking-wider shadow-md"
                >
                  {user?.role === 'Author/Journalist' ? 'Submit for Review' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Workflow Modal */}
      {reviewModalOpen && reviewTargetArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl p-6 text-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-white">Editorial Review & Sign-Off</h3>
            <p className="text-gray-300 font-serif text-base font-bold">{reviewTargetArticle.title}</p>
            <p className="text-gray-400 font-mono">Authored by: {reviewTargetArticle.author?.name} ({reviewTargetArticle.author?.role})</p>

            {reviewError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Review Comments / Reason</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Editorial notes, citations verified, or revisions required..."
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl p-3 outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 rounded-full bg-zinc-800 text-gray-300"
              >
                Cancel
              </button>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => handleReviewAction('reject')}
                  className="px-4 py-2 rounded-full bg-rose-500/20 text-rose-400 font-bold hover:bg-rose-500/30"
                >
                  Reject Submission
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('publish')}
                  className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider"
                >
                  Approve & Publish Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
