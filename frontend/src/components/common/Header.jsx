import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, User, Shield, Bookmark, LogOut, ChevronDown, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isEditorialStaff, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };
    updateTime();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="w-full bg-[#0d0e12]/95 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-40">
      {/* Top Masthead Row matching reference design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[5.25rem] py-2.5 flex items-center justify-between">
        
        {/* Left Side: Hamburger & Date */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-gray-300 hover:text-white transition-colors"
            title="Toggle Navigation Menu"
            aria-label="Navigation Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-medium text-gray-400 tracking-wide">
              {currentDate || 'Sunday, November 22, 2026'}
            </span>
            <span className="text-[10px] text-amber-500/90 font-semibold tracking-wider uppercase">
              Global Edition • Vol. 148 No. 24
            </span>
          </div>
        </div>

        {/* Center: Classic Blackletter / Serif Newspaper Masthead */}
        <div className="flex flex-col items-center justify-center cursor-pointer py-1" onClick={() => navigate('/')}>
          <h1 className="font-serif tracking-tight text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none selection:bg-amber-400 selection:text-black">
            NEWS <span className="text-amber-400 italic font-serif">24</span><span className="text-amber-500">*</span><span className="text-white">7</span>
          </h1>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-gray-400 font-sans hidden sm:block mt-1.5 font-medium">
            The Chronicle of Global & Financial Affairs
          </span>
        </div>

        {/* Right Side: Search, Subscribe Pill & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, topics, tickers..."
              className="w-48 xl:w-56 bg-zinc-900/90 border border-zinc-800 focus:border-amber-400 text-xs text-gray-200 placeholder-gray-500 rounded-full pl-9 pr-3 py-2 outline-none transition-all duration-200"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Yellow Pill Subscribe Button matching reference */}
          <Link
            to="/subscriptions"
            className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-transform duration-200 hover:scale-105 shadow-md flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Subscribe now</span>
          </Link>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 transition-colors"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-gray-200 hidden xl:inline max-w-[90px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 font-medium">
                        {user.role}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                        {user.tier} Tier
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-xs text-gray-300 hover:bg-zinc-800 hover:text-white"
                    >
                      <User className="w-4 h-4 mr-2.5 text-gray-400" />
                      Reader Dashboard
                    </Link>
                    <Link
                      to="/saved"
                      className="flex items-center px-4 py-2 text-xs text-gray-300 hover:bg-zinc-800 hover:text-white"
                    >
                      <Bookmark className="w-4 h-4 mr-2.5 text-gray-400" />
                      Saved Stories ({user.bookmarks?.length || 0})
                    </Link>
                    {isEditorialStaff && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-xs text-amber-400 hover:bg-zinc-800 font-semibold"
                      >
                        <Shield className="w-4 h-4 mr-2.5 text-amber-400" />
                        Admin & Editorial Panel
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-zinc-800 pt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-xs text-red-400 hover:bg-zinc-800 text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2.5 text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-full border border-zinc-700 hover:border-gray-500 text-xs text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Slide-out / Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 px-6 py-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <h4 className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-3">Main Desks</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/world" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">World Affairs</Link></li>
                <li><Link to="/india" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">India National</Link></li>
                <li><Link to="/politics" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Politics & Governance</Link></li>
                <li><Link to="/markets" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Financial Markets</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-3">Intelligence</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/business" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Business & Enterprise</Link></li>
                <li><Link to="/technology" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Technology & AI</Link></li>
                <li><Link to="/science" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Science & Space</Link></li>
                <li><Link to="/opinion" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Editorial Columns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-3">Culture & Life</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/sports" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Sports & Athletics</Link></li>
                <li><Link to="/entertainment" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Entertainment & Arts</Link></li>
                <li><Link to="/subscriptions" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Membership Tiers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-3">Institutional</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">About NEWS 24*7</Link></li>
                <li><Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-amber-400">Global Bureaus & Contact</Link></li>
                {isEditorialStaff && (
                  <li><Link to="/admin" onClick={() => setMenuOpen(false)} className="text-amber-400 font-semibold">Admin Panel</Link></li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
