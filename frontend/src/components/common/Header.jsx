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
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#e5ddcf] shadow-sm sticky top-0 z-40 transition-colors">
      {/* Top Masthead Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[5.25rem] py-2.5 flex items-center justify-between">
        
        {/* Left Side: Hamburger & Date */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-[#f4efe4] hover:bg-[#eae2d2] border border-[#ded5c2] text-[#423b32] hover:text-[#1c1917] transition-colors"
            title="Toggle Navigation Menu"
            aria-label="Navigation Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-medium text-[#5c554b] tracking-wide">
              {currentDate || 'Sunday, November 22, 2026'}
            </span>
            <span className="text-[10px] text-[#946638] font-semibold tracking-wider uppercase">
              Global Edition • Vol. 148 No. 24
            </span>
          </div>
        </div>

        {/* Center: Classic Newspaper Masthead in Deep Charcoal Ink & Warm Camel Beige */}
        <div className="flex flex-col items-center justify-center cursor-pointer py-1" onClick={() => navigate('/')}>
          <h1 className="font-serif tracking-tight text-2xl sm:text-3xl md:text-4xl font-black text-[#1c1917] leading-none selection:bg-[#e8decd] selection:text-[#1c1917]">
            NEWS <span className="text-[#946638] italic font-serif">24</span><span className="text-[#b8895b]">*</span><span className="text-[#1c1917]">7</span>
          </h1>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#786f63] font-sans hidden sm:block mt-1.5 font-semibold">
            The Chronicle of Global & Financial Affairs
          </span>
        </div>

        {/* Right Side: Search, Warm Beige Subscribe Pill & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, topics, tickers..."
              className="w-48 xl:w-56 bg-[#f4efe4] border border-[#ded5c2] focus:border-[#946638] focus:bg-white text-xs text-[#1c1917] placeholder-[#8c8273] rounded-full pl-9 pr-3 py-2 outline-none transition-all duration-200"
            />
            <Search className="w-3.5 h-3.5 text-[#786f63] absolute left-3 pointer-events-none" />
          </form>

          {/* Warm Beige / Camel Pill Subscribe Button */}
          <Link
            to="/subscriptions"
            className="px-4 py-2 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-semibold text-xs transition-transform duration-200 hover:scale-105 shadow-sm flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f4efe4]" />
            <span>Subscribe now</span>
          </Link>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-full bg-[#f4efe4] border border-[#ded5c2] hover:border-[#946638]/50 transition-colors"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-[#1c1917] hidden xl:inline max-w-[90px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#786f63]" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-[#ded5c2] rounded-2xl shadow-xl py-2 z-50 animate-fade-in"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-[#ded5c2] bg-[#fbf9f4]">
                    <p className="text-xs text-[#786f63]">Signed in as</p>
                    <p className="text-sm font-semibold text-[#1c1917] truncate">{user.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ebdccb] text-[#784f27] font-semibold">
                        {user.role}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                        {user.tier} Tier
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-xs text-[#423b32] hover:bg-[#f4efe4] hover:text-[#1c1917]"
                    >
                      <User className="w-4 h-4 mr-2.5 text-[#786f63]" />
                      Reader Dashboard
                    </Link>
                    <Link
                      to="/saved"
                      className="flex items-center px-4 py-2 text-xs text-[#423b32] hover:bg-[#f4efe4] hover:text-[#1c1917]"
                    >
                      <Bookmark className="w-4 h-4 mr-2.5 text-[#786f63]" />
                      Saved Stories ({user.bookmarks?.length || 0})
                    </Link>
                    {isEditorialStaff && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-xs text-[#946638] hover:bg-[#f4efe4] font-semibold"
                      >
                        <Shield className="w-4 h-4 mr-2.5 text-[#946638]" />
                        Admin & Editorial Panel
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-[#ded5c2] pt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium"
                    >
                      <LogOut className="w-4 h-4 mr-2.5 text-red-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-full border border-[#ded5c2] bg-[#f4efe4] hover:bg-[#eae2d2] hover:border-[#bda88e] text-xs font-medium text-[#423b32] hover:text-[#1c1917] transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Slide-out / Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="bg-[#fbf9f5] border-b border-[#ded5c2] px-6 py-6 transition-all duration-300 shadow-lg">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <h4 className="text-[11px] font-bold tracking-wider text-[#946638] uppercase mb-3">Main Desks</h4>
              <ul className="space-y-2 text-sm text-[#423b32]">
                <li><Link to="/world" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">World Affairs</Link></li>
                <li><Link to="/india" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">India National</Link></li>
                <li><Link to="/politics" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Politics & Governance</Link></li>
                <li><Link to="/markets" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Financial Markets</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold tracking-wider text-[#946638] uppercase mb-3">Intelligence</h4>
              <ul className="space-y-2 text-sm text-[#423b32]">
                <li><Link to="/business" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Business & Enterprise</Link></li>
                <li><Link to="/technology" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Technology & AI</Link></li>
                <li><Link to="/science" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Science & Space</Link></li>
                <li><Link to="/opinion" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Editorial Columns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold tracking-wider text-[#946638] uppercase mb-3">Culture & Life</h4>
              <ul className="space-y-2 text-sm text-[#423b32]">
                <li><Link to="/sports" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Sports & Athletics</Link></li>
                <li><Link to="/entertainment" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Entertainment & Arts</Link></li>
                <li><Link to="/subscriptions" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Membership Tiers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold tracking-wider text-[#946638] uppercase mb-3">Institutional</h4>
              <ul className="space-y-2 text-sm text-[#423b32]">
                <li><Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">About NEWS 24*7</Link></li>
                <li><Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-[#946638]">Global Bureaus & Contact</Link></li>
                {isEditorialStaff && (
                  <li><Link to="/admin" onClick={() => setMenuOpen(false)} className="text-[#946638] font-bold">Admin Panel</Link></li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
