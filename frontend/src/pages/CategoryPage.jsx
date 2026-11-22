import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Bookmark, Lock, ArrowUpRight, Filter, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CategoryPage = ({ categoryOverride }) => {
  const { categorySlug } = useParams();
  const category = categoryOverride || categorySlug || 'world';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState('all');
  const { toggleBookmark, isBookmarked } = useAuth();

  const categoryTitles = {
    world: 'World Affairs & Geopolitics',
    india: 'India National & Subcontinent Affairs',
    politics: 'Politics, Governance & Parliaments',
    business: 'Global Business, Startups & Enterprise',
    technology: 'Technology, AI & Semiconductor Systems',
    sports: 'Sports & Global Championships',
    entertainment: 'Entertainment, Cinema & Arts',
    science: 'Science, Space Exploration & Biotech',
    opinion: 'Editorial Columns & Perspectives'
  };

  const title = categoryTitles[category.toLowerCase()] || `${category.toUpperCase()} Dispatches`;

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      setLoading(true);
      try {
        const query = filterTier === 'all'
          ? `/articles?category=${category}&limit=30`
          : `/articles?category=${category}&accessLevel=${filterTier}&limit=30`;
        const res = await api.get(query);
        setArticles(res.data.articles || []);
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryArticles();
  }, [category, filterTier]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Masthead Banner */}
      <div className="pb-8 border-b border-zinc-800">
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
          <span>Desk</span>
          <span>/</span>
          <span>{category.toUpperCase()}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white">
              {title}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-2xl">
              Live updates, investigative coverage, and expert commentary curated from international bureaus.
            </p>
          </div>

          {/* Access Level Filter */}
          <div className="flex items-center space-x-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 self-start md:self-auto">
            {['all', 'free', 'bronze', 'silver', 'gold'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterTier === tier
                    ? 'bg-amber-400 text-black shadow-sm font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-24 text-center text-gray-500">
          <div className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Connecting to {category} bureau feed...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-24 text-center text-gray-400">
          <p className="font-serif text-xl">No stories currently found under this filter.</p>
          <p className="text-xs text-gray-500 mt-2">Try clearing your filters or check back shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {articles.map((art) => (
            <div
              key={art.id}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-zinc-800/80 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 rounded-xl overflow-hidden mb-4">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/80 text-amber-400 border border-amber-400/30">
                      {art.category}
                    </span>
                    {art.accessLevel && art.accessLevel !== 'free' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-black flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-black" />
                        <span>{art.accessLevel}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleBookmark(art.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(art.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <Link to={`/article/${art.slug || art.id}`}>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-2">
                    {art.title}
                  </h3>
                </Link>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
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
