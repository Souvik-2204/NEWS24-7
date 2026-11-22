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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ded5c2] gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#946638] uppercase tracking-widest block">
            Specialized Desks
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1c1917] mt-1">
            Section Deep-Dives
          </h2>
        </div>

        {/* Section Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedSection === sec.id
                  ? 'bg-[#946638] text-white shadow-sm'
                  : 'bg-[#f2ece0] text-[#574f45] hover:bg-[#e8dece] hover:text-[#1c1917]'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of articles for selected category */}
      {loading ? (
        <div className="py-20 text-center text-[#786f63]">
          <div className="inline-block w-7 h-7 border-2 border-[#946638] border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs">Fetching latest {selectedSection} dispatches...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center text-[#786f63] bg-white rounded-2xl border border-[#ded5c2] mt-6">
          <p className="text-xs">No dispatches available under this desk right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl p-5 border border-[#ded5c2] hover:border-[#bda588] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden h-44 mb-4 bg-[#ede5d6]">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/95 text-[#784f27] border border-[#d8ccb8] shadow-sm">
                      {art.category}
                    </span>
                    {art.accessLevel && art.accessLevel !== 'free' && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#946638] text-white flex items-center space-x-0.5 shadow-sm">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{art.accessLevel}</span>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleBookmark(art.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#574f45] hover:text-[#946638] shadow-sm transition-colors"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(art.id) ? 'fill-[#946638] text-[#946638]' : ''}`} />
                  </button>
                </div>

                <Link to={`/article/${art.slug || art.id}`}>
                  <h3 className="font-serif text-base font-bold text-[#1c1917] group-hover:text-[#946638] transition-colors line-clamp-2 leading-snug mb-2">
                    {art.title}
                  </h3>
                </Link>

                <p className="text-xs text-[#574f45] line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#786f63] pt-3 mt-4 border-t border-[#ded5c2]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#946638]" />
                  <span>{art.readTime || '5 min read'}</span>
                </div>
                <Link
                  to={`/article/${art.slug || art.id}`}
                  className="font-semibold text-[#946638] hover:underline flex items-center space-x-1 text-xs"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
