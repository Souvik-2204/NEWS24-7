import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Type,
  Lock,
  MessageSquare,
  ArrowLeft,
  Check,
  Send,
  Eye,
  Calendar,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PaywallModal } from '../components/common/PaywallModal';
import { DemoPaymentModal } from '../components/common/DemoPaymentModal';

export const ArticleDetailsPage = () => {
  const { id } = useParams();
  const { user, toggleBookmark, isBookmarked } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState('base'); // 'base' | 'lg' | 'xl'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showShareNotice, setShowShareNotice] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Comments state
  const [comments, setComments] = useState([
    {
      id: 'c1',
      name: 'Dr. Anand Mahindra',
      role: 'Diplomatic Policy Fellow',
      time: '3 hours ago',
      text: 'Crucial multilateral realignment. The sovereign capital guarantees will finally de-risk private solar infrastructure across emerging markets.'
    },
    {
      id: 'c2',
      name: 'Claire Chen',
      role: 'Clean Tech Syndicate',
      time: '1 hour ago',
      text: 'The inclusion of open-license perovskite patent sharing is the real game-changer here.'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/articles/${id}`);
      setArticle(res.data);
    } catch (err) {
      console.error('Failed to load article:', err);
      setError('Article could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id, user?.tier]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShowShareNotice(true);
    setTimeout(() => setShowShareNotice(false), 3000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: 'c_' + Date.now(),
      name: user?.name || 'Accredited Reader',
      role: `${user?.role || 'Guest'} • ${user?.tier || 'Free'} Tier`,
      time: 'Just now',
      text: newComment.trim()
    };
    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-[#786f63]">
        <div className="inline-block w-8 h-8 border-2 border-[#946638] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono">Retrieving editorial dispatch...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#1c1917] mb-2">Dispatch Unavailable</h2>
        <p className="text-xs text-[#574f45] mb-6">{error || 'Article not found.'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#946638] text-white text-xs font-bold hover:bg-[#7e552d]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Front Page</span>
        </Link>
      </div>
    );
  }

  const fontSizeClasses = {
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose font-serif'
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#ded5c2] text-xs">
        <Link to="/" className="inline-flex items-center space-x-1.5 text-[#574f45] hover:text-[#946638] transition-colors font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Front Page</span>
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-[#ded5c2] text-[#784f27] shadow-sm">
            {article.category}
          </span>
          {article.accessLevel && article.accessLevel !== 'free' && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#946638] text-white flex items-center space-x-1 shadow-sm">
              <Lock className="w-3 h-3 text-white" />
              <span>{article.accessLevel} VIP</span>
            </span>
          )}
        </div>
      </div>

      {/* Editorial Headline */}
      <header className="space-y-4 mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#1c1917] leading-[1.15] tracking-tight">
          {article.title}
        </h1>

        <p className="text-[#4a4237] text-base sm:text-lg font-normal leading-relaxed">
          {article.summary}
        </p>

        {/* Byline, Date & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#ded5c2] gap-4 text-xs text-[#786f63]">
          <div className="flex items-center space-x-3">
            <img
              src={article.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${article.author?.name || 'Staff'}`}
              alt={article.author?.name}
              className="w-10 h-10 rounded-full object-cover border border-[#ded5c2]"
            />
            <div>
              <span className="text-[#1c1917] font-bold block">{article.author?.name || 'Staff Correspondent'}</span>
              <span className="text-[11px] text-[#786f63] font-mono">
                {article.author?.role || 'Senior Journalist'} • {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Reader Interactive Controls (Audio Reader, Font Size, Bookmark, Share) */}
          <div className="flex items-center space-x-2">
            
            {/* Audio Reader Simulation */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`p-2 rounded-full border transition-colors flex items-center space-x-1 ${
                isPlayingAudio
                  ? 'bg-[#946638] text-white border-[#946638]'
                  : 'bg-white border-[#ded5c2] text-[#423b32] hover:bg-[#faf7f2]'
              }`}
              title="Listen to Audio Article"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#946638]" />}
              <span className="text-[11px] font-semibold hidden sm:inline">
                {isPlayingAudio ? 'Pause Audio' : 'Audio Reader'}
              </span>
            </button>

            {/* Font Adjuster */}
            <button
              onClick={() => {
                if (fontSize === 'base') setFontSize('lg');
                else if (fontSize === 'lg') setFontSize('xl');
                else setFontSize('base');
              }}
              className="p-2 rounded-full bg-white border border-[#ded5c2] text-[#423b32] hover:bg-[#faf7f2] transition-colors"
              title="Adjust Font Size"
            >
              <Type className="w-4 h-4 text-[#786f63]" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(article.id)}
              className="p-2 rounded-full bg-white border border-[#ded5c2] text-[#423b32] hover:text-[#946638] transition-colors"
              title="Bookmark story"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked(article.id) ? 'fill-[#946638] text-[#946638]' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white border border-[#ded5c2] text-[#423b32] hover:text-[#1c1917] transition-colors relative"
              title="Share Story"
            >
              <Share2 className="w-4 h-4 text-[#786f63]" />
              {showShareNotice && (
                <span className="absolute -bottom-8 right-0 text-[10px] bg-[#1c1917] text-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Simulated Audio Player Waveform Bar */}
      {isPlayingAudio && (
        <div className="mb-8 p-4 rounded-2xl bg-white border border-[#caa87e] flex items-center justify-between text-xs animate-fade-in shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#946638] animate-ping" />
            <span className="font-bold text-[#1c1917]">Audio Dispatch Narration Playing</span>
          </div>
          <div className="flex items-center space-x-1">
            {[4, 12, 8, 16, 6, 14, 10, 18, 8, 14, 4, 12].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-[#946638] rounded-full animate-pulse"
                style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden mb-10 shadow-lg border border-[#ded5c2]">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-[400px] sm:h-[480px] object-cover"
        />
        <div className="p-3 bg-[#fbf9f4] border-t border-[#ded5c2] text-[11px] text-[#786f63] font-mono flex items-center justify-between">
          <span>Editorial Photography • NEWS 24*7 Bureau Archive</span>
          <span>Views: {article.views?.toLocaleString() || 1}</span>
        </div>
      </div>

      {/* Article Body Content */}
      <div className={`prose max-w-none text-[#29241e] font-serif ${fontSizeClasses[fontSize]}`}>
        {/* If article is gated by paywall */}
        {article.isGated ? (
          <div>
            <div
              className="drop-cap"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            {/* Paywall Gate Container */}
            <PaywallModal
              requiredTier={article.requiredTier}
              userCurrentTier={article.userCurrentTier}
              onSubscribeClick={() => setPaymentModalOpen(true)}
            />
          </div>
        ) : (
          <div
            className="drop-cap space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}
      </div>

      {/* Tags Row */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-[#ded5c2]">
          <span className="text-xs text-[#786f63] font-bold uppercase tracking-wider mr-2">Filed Under:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-white border border-[#ded5c2] text-[#423b32] font-mono font-medium shadow-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author Bio Box */}
      <div className="my-10 p-6 rounded-3xl bg-white border border-[#ded5c2] shadow-sm flex items-start space-x-4">
        <img
          src={article.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${article.author?.name || 'Staff'}`}
          alt={article.author?.name}
          className="w-14 h-14 rounded-2xl object-cover border border-[#ded5c2] shrink-0"
        />
        <div>
          <h4 className="font-serif text-base font-bold text-[#1c1917]">{article.author?.name}</h4>
          <p className="text-xs text-[#946638] font-bold font-mono mt-0.5">{article.author?.role}</p>
          <p className="text-xs text-[#574f45] mt-2 leading-relaxed">
            Specializing in multilateral diplomacy, strategic economics, and international institutional governance for NEWS 24*7.
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <section className="mt-12 pt-8 border-t border-[#ded5c2]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-2xl font-bold text-[#1c1917] flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-[#946638]" />
            <span>Accredited Reader Commentary ({comments.length})</span>
          </h3>
          <span className="text-xs text-[#786f63] font-mono">Editorial Moderated</span>
        </div>

        {/* Comment input form */}
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="relative">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the intellectual discourse..."
              className="w-full bg-white border border-[#ded5c2] focus:border-[#946638] text-xs text-[#1c1917] rounded-2xl p-4 outline-none transition-colors shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-3 bottom-3 px-4 py-1.5 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-bold text-xs flex items-center space-x-1 shadow-sm"
            >
              <span>Submit</span>
              <Send className="w-3 h-3 text-white" />
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comm) => (
            <div key={comm.id} className="p-4 rounded-2xl bg-white border border-[#ded5c2] text-xs shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-bold text-[#1c1917] block">{comm.name}</span>
                  <span className="text-[10px] text-[#946638] font-mono font-bold">{comm.role}</span>
                </div>
                <span className="text-[10px] text-[#786f63]">{comm.time}</span>
              </div>
              <p className="text-[#423b32] leading-relaxed">{comm.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Checkout Modal */}
      <DemoPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultPlan={article.requiredTier || 'gold'}
      />
    </article>
  );
};
