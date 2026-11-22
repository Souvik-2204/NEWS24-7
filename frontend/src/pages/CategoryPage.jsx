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
      <div className="pb-8 border-b border-[#ded5c2]">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#946638] uppercase tracking-widest mb-2 font-bold">
          <span>Desk</span>
          <span>/</span>
          <span>{category.toUpperCase()}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#1c1917]">
              {title}
            </h1>
            <p className="text-xs text-[#574f45] mt-2 max-w-2xl leading-relaxed">
              Verified investigative dispatches, deep analysis, and accredited global reporting curated by NEWS 24*7 foreign correspondents.
            </p>
          </div>

          {/* Access Level Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-[#ede5d6] p-1 rounded-xl border border-[#ded5c2] self-start md:self-auto">
            {['all', 'free', 'bronze', 'silver', 'gold'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                  filterTier === tier
                    ? 'bg-[#946638] text-white shadow-sm'
                    : 'text-[#574f45] hover:text-[#1c1917]'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Articles Grid */}
      {loading ? (
        <div className="py-24 text-center text-[#786f63]">
          <div className="inline-block w-8 h-8 border-2 border-[#946638] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-mono">Curating {category} wire...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#ded5c2] my-8 shadow-sm">
          <p className="font-serif text-xl font-bold text-[#1c1917]">No Dispatches Found</p>
          <p className="text-xs text-[#786f63] mt-1">There are no stories under this filter at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl p-6 border border-[#ded5c2] hover:border-[#bda588] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden h-52 mb-5 bg-[#ede5d6]">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-[#784f27] border border-[#d8ccb8] shadow-sm">
                      {art.category}
                    </span>
                    {art.accessLevel && art.accessLevel !== 'free' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#946638] text-white flex items-center space-x-1 shadow-sm">
                        <Lock className="w-3 h-3" />
                        <span>{art.accessLevel}</span>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleBookmark(art.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#574f45] hover:text-[#946638] shadow-sm transition-colors"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(art.id) ? 'fill-[#946638] text-[#946638]' : ''}`} />
                  </button>
                </div>

                <Link to={`/article/${art.slug || art.id}`}>
                  <h3 className="font-serif text-lg font-bold text-[#1c1917] group-hover:text-[#946638] transition-colors leading-snug line-clamp-2 mb-2">
                    {art.title}
                  </h3>
                </Link>

                <p className="text-xs text-[#574f45] line-clamp-3 leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#786f63] pt-4 border-t border-[#ded5c2]">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#1c1917]">{art.author?.name || 'Bureau'}</span>
                  <span>•</span>
                  <span>{new Date(art.publishedAt || art.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1 text-[#946638] font-bold">
                  <Clock className="w-3 h-3" />
                  <span>{art.readTime || '5 min'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
