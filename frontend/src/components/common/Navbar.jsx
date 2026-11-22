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
    <nav className="w-full bg-[#fbf9f5] border-b border-[#e5ddcf] py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills matching editorial newspaper style */}
        <div className="flex items-center justify-start md:justify-center space-x-1.5 sm:space-x-2.5 overflow-x-auto no-scrollbar py-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-[#1c1917] text-[#f8f6f0] shadow-sm'
                  : 'text-[#5c554b] hover:text-[#1c1917] hover:bg-[#ede5d5]'
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
                `px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1c1917] text-[#f8f6f0] shadow-sm'
                    : item.highlight
                    ? 'text-[#946638] hover:text-[#784f27] hover:bg-[#ede5d5] font-extrabold'
                    : 'text-[#5c554b] hover:text-[#1c1917] hover:bg-[#ede5d5]'
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
