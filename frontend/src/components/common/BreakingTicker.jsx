import React from 'react';
import { Flame, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';

export const BreakingTicker = () => {
  const { breakingNews } = useNews();

  if (!breakingNews || breakingNews.length === 0) return null;

  return (
    <div className="w-full bg-[#13141b] border-b border-zinc-800/80 overflow-hidden text-xs py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        {/* Flashing Breaking Badge */}
        <div className="flex items-center space-x-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 mr-3 animate-pulse">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px]">Breaking</span>
        </div>

        {/* Continuous ticker marquee */}
        <div className="overflow-hidden whitespace-nowrap relative flex-1">
          <div className="inline-block animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
            {breakingNews.map((item, idx) => (
              <Link
                key={item.id || idx}
                to={item.url || '/markets'}
                className="inline-flex items-center text-gray-300 hover:text-amber-400 mx-4 transition-colors group"
              >
                <span className="text-[10px] text-amber-400/80 font-semibold uppercase mr-1.5">
                  [{item.category || 'Updates'}]
                </span>
                <span className="font-serif text-xs group-hover:underline">
                  {item.title}
                </span>
                <ArrowUpRight className="w-3 h-3 ml-1 text-gray-500 group-hover:text-amber-400 transition-colors" />
                <span className="text-zinc-600 ml-4 font-mono">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
