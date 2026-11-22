import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Play, Pause, Bookmark, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';

export const HeroSection = () => {
  const { heroSlides } = useNews();
  const { toggleBookmark, isBookmarked } = useAuth();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const navigate = useNavigate();

  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : [
    {
      id: 'hero_1',
      title: 'The response has been huge says Jenna Mekks on clean energy breakthrough.',
      subtitle: 'Global delegations rally around unprecedented multilateral renewable treaty.',
      category: 'POLITICS',
      author: 'John Muller',
      readTime: '10 MIN READ',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1920&q=80',
      accentWord: 'huge',
      articleId: 'art_pol_01',
      nextPreview: {
        title: 'Summit negotiators reach midnight breakthrough on sovereign fund rules.',
        readTime: '8 MIN READ',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'
      }
    }
  ];

  // Auto-rotate background every 30 seconds
  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 30000);
    return () => clearInterval(timer);
  }, [isAutoPlay, slides.length]);

  const current = slides[currentSlideIndex] || slides[0];
  const nextSlide = slides[(currentSlideIndex + 1) % slides.length] || slides[0];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* Outer rounded editorial card matching Dribbble reference */}
      <div className="relative rounded-[2rem] overflow-hidden bg-[#111218] border border-zinc-800/80 shadow-2xl min-h-[580px] lg:min-h-[640px] flex flex-col justify-between">
        
        {/* Dynamic Background Image with Smooth Crossfade Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || currentSlideIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${current.imageUrl})` }}
          >
            {/* Dark cinematic gradient overlays to guarantee pristine editorial text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent lg:w-3/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-black/30 backdrop-grayscale-[30%]" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container (2-Column Asymmetric Editorial Layout) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 h-full">
          
          {/* Left Column: Big Editorial Serif Headline & Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            
            {/* Top Category Tag */}
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full inline-block">
                {current.category || 'FEATURED'}
              </span>
            </div>

            {/* Huge Serif Headline matching reference style */}
            <div className="space-y-4 my-auto">
              <Link to={current.articleId ? `/article/${current.articleId}` : '/politics'}>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.12] tracking-tight hover:text-gray-100 transition-colors">
                  {current.title.split(current.accentWord || 'huge').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="italic font-normal text-amber-400">
                          {current.accentWord || 'huge'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </h2>
              </Link>

              {current.subtitle && (
                <p className="text-gray-300 text-sm md:text-base font-light max-w-xl leading-relaxed">
                  {current.subtitle}
                </p>
              )}

              {/* Author & Read Time Pill */}
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${current.author || 'JM'}&backgroundColor=1e2029&textColor=f59e0b`}
                      alt={current.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider block">
                      BY {current.author || 'JOHN MULLER'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {current.authorRole || 'Special International Correspondent'}
                    </span>
                  </div>
                </div>

                <div className="h-4 w-px bg-zinc-700" />

                <div className="flex items-center text-xs text-amber-400/90 font-medium tracking-wide">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  <span>{current.readTime || '10 MIN READ'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Numbered Slide Indicators (1 2 3 4) & 'NEXT' Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800/60">
              
              {/* 1 2 3 4 Carousel Indicators matching Dribbble reference */}
              <div className="flex items-center space-x-3">
                {slides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`text-sm font-semibold transition-all px-2 py-1 rounded-md ${
                      currentSlideIndex === idx
                        ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="p-1 rounded-md text-gray-500 hover:text-white transition-colors ml-2"
                  title={isAutoPlay ? 'Pause auto-rotation (30s)' : 'Resume auto-rotation'}
                >
                  {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* NEXT Preview Card on bottom left matching reference */}
              <div
                onClick={() => setCurrentSlideIndex((currentSlideIndex + 1) % slides.length)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 cursor-pointer transition-all duration-200 group max-w-xs"
              >
                <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={nextSlide.imageUrl || nextSlide.nextPreview?.imageUrl}
                    alt="Next story preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">
                    NEXT STORY
                  </span>
                  <p className="text-[11px] font-serif text-gray-200 truncate group-hover:text-amber-400 transition-colors">
                    {nextSlide.title}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 shrink-0" />
              </div>

            </div>
          </div>

          {/* Right Column: Modern Glass-Effect Editorial Cards matching Dribbble reference */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Top Large Frosted Glass Card */}
            <div className="glass-card glass-card-hover rounded-2xl p-5 border border-zinc-800/80 shadow-xl">
              <div className="rounded-xl overflow-hidden h-40 w-full mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                  alt="City and climate diplomacy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <Link to="/article/art_pol_01">
                <h3 className="font-serif text-lg font-bold text-white hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                  The response has been huge says Jenna Mekks.
                </h3>
              </Link>

              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-3">
                A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. Multilateral consensus reached on sovereign capital deployment.
              </p>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-zinc-800/60">
                <span className="text-amber-400 font-medium">10 MIN READ</span>
                <span className="text-zinc-500">Global Climate Bureau</span>
              </div>
            </div>

            {/* Mini Stacked Glass Cards matching reference */}
            <div className="space-y-2.5">
              
              {/* Mini Card 1 */}
              <Link
                to="/article/art_tech_01"
                className="glass-card glass-card-hover rounded-xl p-3 flex items-center space-x-3.5 group"
              >
                <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80"
                    alt="Technology node"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xs font-semibold text-gray-200 group-hover:text-amber-400 transition-colors line-clamp-2">
                    Semiconductor Renaissance: 2nm silicon fabrication hub inaugurates.
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                    7 MIN READ • TECHNOLOGY
                  </span>
                </div>
              </Link>

              {/* Mini Card 2 */}
              <Link
                to="/article/art_mkt_01"
                className="glass-card glass-card-hover rounded-xl p-3 flex items-center space-x-3.5 group"
              >
                <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                  <img
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80"
                    alt="Stock market bull run"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xs font-semibold text-gray-200 group-hover:text-amber-400 transition-colors line-clamp-2">
                    Dalal Street & Wall Street synchronize in record bull run as inflation cools.
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                    5 MIN READ • MARKETS
                  </span>
                </div>
              </Link>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
