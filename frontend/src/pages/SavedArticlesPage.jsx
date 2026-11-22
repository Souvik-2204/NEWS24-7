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
      <div className="pb-8 border-b border-[#ded5c2] flex items-center justify-between">
        <div>
          <Link to="/" className="inline-flex items-center space-x-1.5 text-xs text-[#574f45] hover:text-[#946638] mb-2 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Front Page</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917]">
            Saved Stories & Reading List
          </h1>
          <p className="text-xs text-[#574f45] mt-1 font-normal">
            Archived dispatches saved for offline reference and deep reading.
          </p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-[#f2ece0] border border-[#d3c4b0] text-[#784f27] font-mono font-bold">
          {bookmarkedArticles.length} Stories Saved
        </span>
      </div>

      {loading ? (
        <div className="py-24 text-center text-[#786f63]">
          <div className="inline-block w-8 h-8 border-2 border-[#946638] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Loading reading list...</p>
        </div>
      ) : bookmarkedArticles.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#ded5c2] my-8 shadow-sm">
          <Bookmark className="w-12 h-12 text-[#946638] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-xl font-bold text-[#1c1917]">No Saved Stories</h3>
          <p className="text-xs text-[#574f45] mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any dispatch to save it to your personal institutional library.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 px-5 py-2.5 rounded-full bg-[#946638] text-white text-xs font-bold hover:bg-[#7e552d] shadow-sm"
          >
            Explore Front Page
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {bookmarkedArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl p-5 border border-[#ded5c2] shadow-sm hover:border-[#bda588] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden h-44 mb-4 bg-[#ede5d6]">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/95 text-[#784f27] border border-[#d8ccb8] shadow-sm">
                    {art.category}
                  </span>
                  <button
                    onClick={() => handleRemove(art.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-rose-600 shadow-sm transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link to={`/article/${art.slug || art.id}`}>
                  <h3 className="font-serif text-base font-bold text-[#1c1917] group-hover:text-[#946638] transition-colors line-clamp-2 leading-snug mb-2">
                    {art.title}
                  </h3>
                </Link>

                <p className="text-xs text-[#574f45] line-clamp-2 leading-relaxed font-normal">
                  {art.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#786f63] pt-4 mt-4 border-t border-[#ded5c2]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#946638]" />
                  <span>{art.readTime || '5 min'}</span>
                </div>
                <Link
                  to={`/article/${art.slug || art.id}`}
                  className="font-bold text-[#946638] hover:underline flex items-center space-x-1"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
