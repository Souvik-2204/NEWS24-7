import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'WORLD', path: '/world' },
  { label: 'INDIA', path: '/india' },
  { label: 'POLITICS', path: '/politics' },
  { label: 'BUSINESS', path: '/business' },
  { label: 'MARKETS', path: '/markets', highlight: true },
  { label: 'TECH', path: '/technology' },
  { label: 'SPORTS', path: '/sports' },
  { label: 'ENTERTAINMENT', path: '/entertainment' },
  { label: 'SCIENCE', path: '/science' },
  { label: 'OPINION', path: '/opinion' }
];

export const Navbar = () => {
  return (
    <nav className="w-full bg-[#0d0e12] border-b border-zinc-800/60 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills matching the Dribbble reference */}
        <div className="flex items-center justify-start md:justify-center space-x-1.5 sm:space-x-2.5 overflow-x-auto no-scrollbar py-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-zinc-800 text-amber-400 border border-zinc-700 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-900/60'
              }`
            }
          >
            HOME
          </NavLink>

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 text-amber-400 border border-zinc-700 shadow-sm'
                    : item.highlight
                    ? 'text-amber-400/90 hover:text-amber-300 hover:bg-zinc-900/60'
                    : 'text-gray-400 hover:text-white hover:bg-zinc-900/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
