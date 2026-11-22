import React from 'react';
import { Flame, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';

export const BreakingTicker = () => {
  const { breakingNews } = useNews();

  if (!breakingNews || breakingNews.length === 0) return null;

  return (
    <div className="w-full bg-[#f2ece0] border-b border-[#e5ddcf] overflow-hidden text-xs py-2 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        {/* Flashing Breaking Badge in Warm Beige Terracotta */}
        <div className="flex items-center space-x-1.5 bg-[#e6dcce] border border-[#d3c4b0] text-[#784f27] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 mr-3 animate-pulse">
          <Flame className="w-3.5 h-3.5 text-[#946638]" />
          <span className="text-[11px]">Breaking</span>
        </div>

        {/* Continuous ticker marquee */}
        <div className="overflow-hidden whitespace-nowrap relative flex-1">
          <div className="inline-block animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
            {breakingNews.map((item, idx) => (
              <Link
                key={item.id || idx}
                to={item.url || '/markets'}
                className="inline-flex items-center text-[#3c362d] hover:text-[#946638] mx-4 transition-colors group"
              >
                <span className="text-[10px] text-[#946638] font-bold uppercase mr-1.5">
                  [{item.category || 'Updates'}]
                </span>
                <span className="font-serif text-xs font-medium group-hover:underline">
                  {item.title}
                </span>
                <ArrowUpRight className="w-3 h-3 ml-1 text-[#8c8273] group-hover:text-[#946638] transition-colors" />
                <span className="text-[#b5a996] ml-4 font-mono">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
