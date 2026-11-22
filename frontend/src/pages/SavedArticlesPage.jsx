import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export const SavedArticlesPage = () => {
  const { user, toggleBookmark } = useAuth();
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarked = async () => {
      setLoading(true);
      try {
        const res = await api.get('/articles?limit=100');
        const allArticles = res.data.articles || [];
        const userBookmarks = user?.bookmarks || [];
        const filtered = allArticles.filter((a) => userBookmarks.includes(a.id));
        setBookmarkedArticles(filtered);
      } catch (err) {
        console.error('Failed to load saved stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarked();
  }, [user?.bookmarks]);

  const handleRemove = async (articleId) => {
    await toggleBookmark(articleId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="pb-8 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <Link to="/" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-amber-400 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Front Page</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Saved Stories & Reading List
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Archived dispatches saved for offline reference and deep reading.
          </p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 font-mono">
          {bookmarkedArticles.length} Stories Saved
        </span>
      </div>

      {loading ? (
        <div className="py-24 text-center text-gray-500">
          <div className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Loading reading list...</p>
        </div>
      ) : bookmarkedArticles.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto">
          <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-white mb-2">No Saved Stories Yet</h3>
          <p className="text-xs text-gray-400 mb-6">
            Click the bookmark icon on any article across the newspaper to save it to your reading list.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider"
          >
            Explore Front Page
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {bookmarkedArticles.map((art) => (
            <div
              key={art.id}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-zinc-800/80 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/80 text-amber-400">
                    {art.category}
                  </span>
                  <button
                    onClick={() => handleRemove(art.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-zinc-900/80 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link to={`/article/${art.slug || art.id}`}>
                  <h3 className="font-serif text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug mb-2">
                    {art.title}
                  </h3>
                </Link>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs text-gray-500">
                <span>By {art.author?.name || 'Staff'}</span>
                <span className="text-amber-400/90 font-mono text-[11px]">{art.readTime || '5 min'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
