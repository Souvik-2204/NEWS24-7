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
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917] mb-4">
          Global Archives Search
        </h1>
        <p className="text-xs text-[#574f45] mb-6 font-normal">
          Query investigative dispatches, financial analysis, geopolitical reports, and author bylines.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, tickers, countries, or topics..."
            className="w-full bg-white border border-[#ded5c2] focus:border-[#946638] text-xs text-[#1c1917] placeholder-[#8c8273] rounded-full pl-12 pr-28 py-3.5 outline-none shadow-sm transition-all"
          />
          <SearchIcon className="w-4 h-4 text-[#786f63] absolute left-4 top-4" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-5 py-2 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Filter by Category */}
        <div className="flex items-center justify-center space-x-1.5 overflow-x-auto no-scrollbar py-4 mt-3">
          {['all', 'world', 'india', 'politics', 'business', 'technology', 'markets'].map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedCategory(c);
                handleSearch(searchTerm, c);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
                selectedCategory === c
                  ? 'bg-[#1c1917] text-[#f8f6f0] shadow-sm'
                  : 'bg-[#ede5d6] text-[#574f45] hover:bg-[#ded4c3] hover:text-[#1c1917]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="pb-4 border-b border-[#ded5c2] flex items-center justify-between text-xs text-[#786f63]">
          <span>
            Showing results for <strong>"{searchTerm || 'All Archives'}"</strong>
          </span>
          <span className="font-mono">{results.length} stories indexed</span>
        </div>

        {loading ? (
          <div className="py-24 text-center text-[#786f63]">
            <div className="inline-block w-8 h-8 border-2 border-[#946638] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Searching dispatch archives...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#ded5c2] my-8 shadow-sm">
            <p className="font-serif text-xl font-bold text-[#1c1917]">No Dispatches Match Your Search</p>
            <p className="text-xs text-[#574f45] mt-1">Try broadening your keywords or exploring by category desk.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {results.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-3xl p-5 border border-[#ded5c2] hover:border-[#bda588] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden h-44 mb-4 bg-[#ede5d6]">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-[#784f27] border border-[#d8ccb8] shadow-sm">
                      {art.category}
                    </span>
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
                    <span>Read Dispatch</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
