import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, Clock, Bookmark, Lock, ArrowUpRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toggleBookmark, isBookmarked } = useAuth();

  const handleSearch = async (term = searchTerm, cat = selectedCategory) => {
    setLoading(true);
    try {
      let endpoint = `/articles?search=${encodeURIComponent(term)}`;
      if (cat && cat !== 'all') {
        endpoint += `&category=${cat}`;
      }
      const res = await api.get(endpoint);
      setResults(res.data.articles || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      handleSearch(query, selectedCategory);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
    handleSearch(searchTerm, selectedCategory);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header & Search Input */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
          Global Archives Search
        </h1>
        <p className="text-xs text-gray-400 mb-6">
          Query investigative dispatches, financial analysis, geopolitical reports, and author bylines.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, topics, companies, or authors..."
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-400 text-sm text-white rounded-full pl-12 pr-28 py-3.5 outline-none transition-colors shadow-xl"
          />
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider"
          >
            Search
          </button>
        </form>

        {/* Filter pills */}
        <div className="flex items-center justify-center space-x-2 mt-4 overflow-x-auto no-scrollbar py-1">
          {['all', 'india', 'world', 'politics', 'markets', 'technology', 'business'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                handleSearch(searchTerm, cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-zinc-900 border border-zinc-800 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="pb-4 mb-6 border-b border-zinc-800 flex items-center justify-between text-xs text-gray-400">
        <span>
          Found <strong className="text-white">{results.length}</strong> dispatches for "{searchTerm || 'all'}"
        </span>
        <span className="font-mono text-[11px]">Ranked by editorial relevance</span>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">
          <div className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Searching global archives...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="font-serif text-lg">No matching stories found.</p>
          <p className="text-xs text-gray-500 mt-2">Try broader keywords or select a different category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((art) => (
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
                    onClick={() => toggleBookmark(art.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-gray-300 hover:text-amber-400"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(art.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
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
                <span className="text-amber-400 font-mono text-[11px]">{art.readTime || '5 min'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
