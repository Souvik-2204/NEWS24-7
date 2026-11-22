import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bookmark, Lock, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const FeaturedNewsGrid = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleBookmark, isBookmarked } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles?limit=8');
        setArticles(res.data.articles || []);
      } catch (err) {
        console.error('Failed to load featured grid:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-[#786f63]">
        <div className="inline-block w-8 h-8 border-2 border-[#946638] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs">Curating editorial front page...</p>
      </div>
    );
  }

  const leadArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);
  const sideArticles = articles.slice(4, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[#e5ddcf]">
      
      {/* Editorial Section Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#ded5c2]">
        <div>
          <span className="text-[11px] font-bold text-[#946638] uppercase tracking-widest block">
            Front Page Dispatches
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1c1917] mt-1">
            Editor's Pick & In-Depth Reports
          </h2>
        </div>
        <Link
          to="/world"
          className="text-xs font-semibold text-[#5c554a] hover:text-[#946638] flex items-center space-x-1"
        >
          <span>View All Dispatches</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Lead Editorial Story (Col 7) */}
        {leadArticle && (
          <div className="lg:col-span-7 flex flex-col justify-between glass-card rounded-3xl p-6 sm:p-8 border border-[#ded5c2] group hover:shadow-xl transition-all">
            <div>
              <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 w-full mb-6">
                <img
                  src={leadArticle.imageUrl}
                  alt={leadArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 text-[#784f27] border border-[#d8ccb8] shadow-sm">
                    {leadArticle.category}
                  </span>
                  {leadArticle.accessLevel && leadArticle.accessLevel !== 'free' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#946638] text-white flex items-center space-x-1 shadow-sm">
                      <Lock className="w-3 h-3 text-white" />
                      <span>{leadArticle.accessLevel}</span>
                    </span>
                  )}
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={() => toggleBookmark(leadArticle.id)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white border border-[#ded5c2] text-[#5c554a] hover:text-[#946638] shadow-sm transition-colors"
                  title="Save Story"
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked(leadArticle.id) ? 'fill-[#946638] text-[#946638]' : ''}`}
                  />
                </button>
              </div>

              <Link to={`/article/${leadArticle.slug || leadArticle.id}`}>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1917] group-hover:text-[#946638] transition-colors leading-tight mb-3">
                  {leadArticle.title}
                </h3>
              </Link>

              <p className="text-[#574f45] text-sm leading-relaxed mb-6 font-normal">
                {leadArticle.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#ded5c2] text-xs text-[#786f63]">
              <div className="flex items-center space-x-2">
                <span className="text-[#1c1917] font-semibold">{leadArticle.author?.name || 'Staff Correspondent'}</span>
                <span>•</span>
                <span>{new Date(leadArticle.publishedAt || leadArticle.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1 text-[#946638] font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#946638]" />
                <span>{leadArticle.readTime || '6 min read'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Right: Secondary Stories Stack (Col 5) */}
        <div className="lg:col-span-5 space-y-5">
          {secondaryArticles.map((art) => (
            <div
              key={art.id}
              className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-[#ded5c2] flex flex-col justify-between group"
            >
              <div className="flex space-x-4">
                <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[#ede5d6]">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {art.accessLevel && art.accessLevel !== 'free' && (
                    <span className="absolute bottom-2 left-2 p-1 rounded-md bg-[#946638] text-white shadow-sm">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#946638]">
                      {art.category}
                    </span>
                    <button
                      onClick={() => toggleBookmark(art.id)}
                      className="text-[#8c8273] hover:text-[#946638]"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(art.id) ? 'fill-[#946638] text-[#946638]' : ''}`} />
                    </button>
                  </div>

                  <Link to={`/article/${art.slug || art.id}`}>
                    <h4 className="font-serif text-sm font-bold text-[#1c1917] group-hover:text-[#946638] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                  </Link>

                  <p className="text-[11px] text-[#5c554a] line-clamp-2 mt-1.5 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#786f63] mt-3 pt-2 border-t border-[#ded5c2] font-mono">
                <span>By {art.author?.name || 'Wire'}</span>
                <span>{art.readTime || '5 min read'}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Horizontal Card Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {sideArticles.map((art) => (
          <Link
            key={art.id}
            to={`/article/${art.slug || art.id}`}
            className="p-4 rounded-2xl bg-white hover:bg-[#faf7f2] border border-[#ded5c2] shadow-sm hover:border-[#bda588] transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 text-[#784f27] border border-[#d8ccb8] shadow-sm">
                  {art.category}
                </span>
              </div>
              <h5 className="font-serif text-xs font-bold text-[#1c1917] group-hover:text-[#946638] transition-colors line-clamp-2">
                {art.title}
              </h5>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#786f63] mt-2 pt-2 border-t border-[#ded5c2]">
              <span>{art.readTime || '4 min read'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#8c8273] group-hover:text-[#946638]" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
