import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const HeroSection = () => {
  const [slides, setSlides] = useState([
    {
      id: 'slide_01',
      category: 'POLITICS',
      title: 'The response has been huge says Jenna.',
      accentWord: 'huge',
      subtitle: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.',
      author: 'JOHN MULLER',
      authorRole: 'Chief Political Editor',
      readTime: '10 MIN READ',
      imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1600&q=85',
      articleId: 'art_pol_01',
      nextPreview: {
        title: 'The response has been huge.',
        imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=300&q=80'
      }
    },
    {
      id: 'slide_02',
      category: 'TECHNOLOGY',
      title: 'Semiconductor Renaissance: India and Taiwan inaugurate $12B mega-fab complex.',
      accentWord: 'Renaissance',
      subtitle: '2nm silicon fabrication hub marks pivotal shift in global technological autonomy and supply chain resilience.',
      author: 'DR. PRIYA SEN SHARMA',
      authorRole: 'Technology Affairs Editor',
      readTime: '8 MIN READ',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
      articleId: 'art_tech_01',
      nextPreview: {
        title: 'Semiconductor Renaissance',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80'
      }
    },
    {
      id: 'slide_03',
      category: 'BUSINESS & MARKETS',
      title: 'Global Central Banks signal rate cuts as disinflation trend solidifies.',
      accentWord: 'solidifies',
      subtitle: 'Simultaneous monetary easing projected across Federal Reserve, RBI, and European Central Bank heading into Q3.',
      author: 'ALISTAIR VANCE',
      authorRole: 'Global Macro Strategist',
      readTime: '7 MIN READ',
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1600&q=85',
      articleId: 'art_mkt_01',
      nextPreview: {
        title: 'Central Banks signal cuts',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80'
      }
    },
    {
      id: 'slide_04',
      category: 'WORLD DIPLOMACY',
      title: 'Historic Himalayan Climate Accord signed by eight South Asian delegations.',
      accentWord: 'Historic',
      subtitle: 'Multilateral treaty creates $40B glacier preservation endowment with real-time satellite runoff monitoring.',
      author: 'KAVITA RAMACHANDRAN',
      authorRole: 'Foreign Affairs Bureau',
      readTime: '9 MIN READ',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
      articleId: 'art_wld_01',
      nextPreview: {
        title: 'Himalayan Climate Accord',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80'
      }
    }
  ]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Fetch administrator controlled hero slides from backend if available
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const res = await api.get('/news/hero-slides');
        if (res.data && res.data.length > 0) {
          setSlides(res.data);
        }
      } catch (err) {
        // Fall back gracefully to default editorial slides
      }
    };
    fetchHeroSlides();
  }, []);

  // Automatic rotation every 30 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 30000);
    return () => clearInterval(timer);
  }, [isAutoPlay, slides.length]);

  const current = slides[currentSlideIndex] || slides[0];
  const nextSlide = slides[(currentSlideIndex + 1) % slides.length] || slides[0];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* Outer rounded editorial card */}
      <div className="relative rounded-[2rem] overflow-hidden bg-[#241f1a] border border-[#ded5c2] shadow-xl min-h-[580px] lg:min-h-[640px] flex flex-col justify-between">
        
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
            {/* Cinematic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c1813]/95 via-[#1c1813]/80 to-transparent lg:w-3/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1813] via-[#1c1813]/40 to-transparent" />
            <div className="absolute inset-0 bg-black/20 backdrop-grayscale-[20%]" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container (2-Column Asymmetric Editorial Layout) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 h-full">
          
          {/* Left Column: Big Editorial Serif Headline & Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            
            {/* Top Category Tag */}
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#e8c7a2] uppercase bg-[#946638]/40 border border-[#b8895b]/50 px-3 py-1 rounded-full inline-block backdrop-blur-md">
                {current.category || 'FEATURED'}
              </span>
            </div>

            {/* Huge Serif Headline */}
            <div className="space-y-4 my-auto">
              <Link to={current.articleId ? `/article/${current.articleId}` : '/politics'}>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-[#faf7f2] leading-[1.12] tracking-tight hover:text-[#e8ded1] transition-colors">
                  {current.title.split(current.accentWord || 'huge').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="italic font-normal text-[#dfb88e]">
                          {current.accentWord || 'huge'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </h2>
              </Link>

              {current.subtitle && (
                <p className="text-[#e2dad0] text-sm md:text-base font-light max-w-xl leading-relaxed">
                  {current.subtitle}
                </p>
              )}

              {/* Author & Read Time Pill */}
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#3d342b] border border-[#6b5d4f] overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${current.author || 'JM'}&backgroundColor=3d342b&textColor=dfb88e`}
                      alt={current.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#f5eee2] uppercase tracking-wider block">
                      BY {current.author || 'JOHN MULLER'}
                    </span>
                    <span className="text-[10px] text-[#c9bfae]">
                      {current.authorRole || 'Special International Correspondent'}
                    </span>
                  </div>
                </div>

                <div className="h-4 w-px bg-[#6b5d4f]" />

                <div className="flex items-center text-xs text-[#dfb88e] font-semibold tracking-wide">
                  <Clock className="w-3.5 h-3.5 mr-1 text-[#dfb88e]" />
                  <span>{current.readTime || '10 MIN READ'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Numbered Slide Indicators & 'NEXT' Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#6b5d4f]/50">
              
              {/* Carousel Indicators */}
              <div className="flex items-center space-x-3">
                {slides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`text-sm font-semibold transition-all px-2 py-1 rounded-md ${
                      currentSlideIndex === idx
                        ? 'text-[#dfb88e] border-b-2 border-[#dfb88e] font-bold'
                        : 'text-[#a39785] hover:text-[#f5eee2]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="p-1 rounded-md text-[#a39785] hover:text-white transition-colors ml-2"
                  title={isAutoPlay ? 'Pause auto-rotation (30s)' : 'Resume auto-rotation'}
                >
                  {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* NEXT Preview Card */}
              <div
                onClick={() => setCurrentSlideIndex((currentSlideIndex + 1) % slides.length)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-[#2e261f]/80 hover:bg-[#3d3329] border border-[#6b5d4f] cursor-pointer transition-all duration-200 group max-w-xs"
              >
                <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={nextSlide.imageUrl || nextSlide.nextPreview?.imageUrl}
                    alt="Next story preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[9px] uppercase tracking-wider text-[#dfb88e] font-bold block">
                    NEXT STORY
                  </span>
                  <p className="text-[11px] font-serif text-[#f5eee2] truncate group-hover:text-[#dfb88e] transition-colors">
                    {nextSlide.title}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#a39785] group-hover:text-[#dfb88e] shrink-0" />
              </div>

            </div>
          </div>

          {/* Right Column: Modern Glass-Effect Editorial Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Top Large Frosted Glass Card in Soft White/Warm Beige */}
            <div className="glass-card glass-card-hover rounded-2xl p-5 border border-[#ded5c2] shadow-xl">
              <div className="rounded-xl overflow-hidden h-40 w-full mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                  alt="City and climate diplomacy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <Link to="/article/art_pol_01">
                <h3 className="font-serif text-lg font-bold text-[#1c1917] hover:text-[#946638] transition-colors line-clamp-2 mb-2">
                  The response has been huge says Jenna Mekks.
                </h3>
              </Link>

              <p className="text-xs text-[#5c554a] leading-relaxed line-clamp-3 mb-3 font-normal">
                A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. Multilateral consensus reached on sovereign capital deployment.
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#786f63] pt-2 border-t border-[#ded5c2]">
                <span className="text-[#946638] font-bold">10 MIN READ</span>
                <span className="text-[#8c8273]">Global Climate Bureau</span>
              </div>
            </div>

            {/* Mini Stacked Glass Cards */}
            <div className="space-y-2.5">
              
              {/* Mini Card 1 */}
              <Link
                to="/article/art_tech_01"
                className="glass-card glass-card-hover rounded-xl p-3 flex items-center space-x-3.5 group"
              >
                <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-[#ede5d6]">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80"
                    alt="Technology node"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xs font-semibold text-[#1c1917] group-hover:text-[#946638] transition-colors line-clamp-2">
                    Semiconductor Renaissance: 2nm silicon fabrication hub inaugurates.
                  </h4>
                  <span className="text-[10px] text-[#786f63] font-mono mt-1 block">
                    7 MIN READ • TECHNOLOGY
                  </span>
                </div>
              </Link>

              {/* Mini Card 2 */}
              <Link
                to="/article/art_mkt_01"
                className="glass-card glass-card-hover rounded-xl p-3 flex items-center space-x-3.5 group"
              >
                <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-[#ede5d6]">
                  <img
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80"
                    alt="Stock market bull run"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xs font-semibold text-[#1c1917] group-hover:text-[#946638] transition-colors line-clamp-2">
                    Dalal Street & Wall Street synchronize in record bull run as inflation cools.
                  </h4>
                  <span className="text-[10px] text-[#786f63] font-mono mt-1 block">
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
