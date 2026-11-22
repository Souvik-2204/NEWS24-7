import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Bookmark, Lock, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CategorySections = () => {
  const [selectedSection, setSelectedSection] = useState('india');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toggleBookmark, isBookmarked } = useAuth();

  const sections = [
    { id: 'india', name: 'India National' },
    { id: 'world', name: 'World Affairs' },
    { id: 'politics', name: 'Politics' },
    { id: 'business', name: 'Business' },
    { id: 'technology', name: 'Technology' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Entertainment' }
  ];

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/articles?category=${selectedSection}&limit=6`);
        setArticles(res.data.articles || []);
      } catch (err) {
        console.error('Error fetching category section:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryArticles();
  }, [selectedSection]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
            Specialized Desks
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
            Section Deep-Dives
          </h2>
        </div>

        {/* Section Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSection === sec.id
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'bg-zinc-900/80 text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of articles for selected section */}
      {loading ? (
        <div className="py-16 text-center text-gray-500">
          <div className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs">Loading {selectedSection} desk...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <p className="font-serif text-lg">No dispatches in this section at this moment.</p>
          <p className="text-xs text-gray-500 mt-1">Our bureau is preparing upcoming investigations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {articles.map((art) => (
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
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-900/90 text-amber-400 border border-amber-400/30">
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
                  <h3 className="font-serif text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-2">
                    {art.title}
                  </h3>
                </Link>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs text-gray-500">
                <span>By {art.author?.name || 'Correspondent'}</span>
                <span className="text-amber-400/90 font-mono text-[11px]">{art.readTime || '5 min'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link to full category */}
      <div className="text-center mt-8">
        <Link
          to={`/${selectedSection}`}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-gray-200 hover:text-amber-400 transition-colors"
        >
          <span>Explore all {sections.find((s) => s.id === selectedSection)?.name} Stories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </section>
  );
};
