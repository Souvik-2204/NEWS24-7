import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Mail, ArrowRight, Rss, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#07080a] border-t border-zinc-800 text-gray-400 text-xs mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid: Masthead branding & News Desks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif text-3xl font-black text-white">
              NEWS <span className="text-amber-400 italic">24</span><span className="text-amber-500">*</span>7
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              The premier digital newspaper delivering uncompromising global journalism, independent investigations, and real-time financial market intelligence from bureaus across New Delhi, New York, London, and Tokyo.
            </p>
            <div className="flex items-center space-x-3 text-xs text-amber-400 pt-2 font-medium">
              <Award className="w-4 h-4 text-amber-400" />
              <span>International Press Freedom Standard Verified</span>
            </div>
          </div>

          {/* Editorial Desks */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Editorial Desks</h3>
            <ul className="space-y-2.5">
              <li><Link to="/world" className="hover:text-amber-400 transition-colors">World Affairs</Link></li>
              <li><Link to="/india" className="hover:text-amber-400 transition-colors">India Subcontinent</Link></li>
              <li><Link to="/politics" className="hover:text-amber-400 transition-colors">Politics & Parliament</Link></li>
              <li><Link to="/markets" className="hover:text-amber-400 transition-colors">Financial Intelligence</Link></li>
              <li><Link to="/business" className="hover:text-amber-400 transition-colors">Business & Enterprise</Link></li>
            </ul>
          </div>

          {/* Specialized Sections */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Technology & Culture</h3>
            <ul className="space-y-2.5">
              <li><Link to="/technology" className="hover:text-amber-400 transition-colors">Silicon & AI Systems</Link></li>
              <li><Link to="/science" className="hover:text-amber-400 transition-colors">Cosmology & Biotech</Link></li>
              <li><Link to="/sports" className="hover:text-amber-400 transition-colors">Global Championships</Link></li>
              <li><Link to="/entertainment" className="hover:text-amber-400 transition-colors">Cinema & Culture</Link></li>
              <li><Link to="/opinion" className="hover:text-amber-400 transition-colors">Editorial Perspectives</Link></li>
            </ul>
          </div>

          {/* Subscriptions & Institutional */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Membership</h3>
            <ul className="space-y-2.5">
              <li><Link to="/subscriptions" className="text-amber-400 hover:text-amber-300 font-medium">Bronze (₹99/mo)</Link></li>
              <li><Link to="/subscriptions" className="text-amber-400 hover:text-amber-300 font-medium">Silver (₹199/mo)</Link></li>
              <li><Link to="/subscriptions" className="text-amber-400 hover:text-amber-300 font-medium">Gold VIP (₹399/mo)</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Our Editorial Board</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Global Bureau Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Global Bureaus Bar */}
        <div className="py-6 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-gray-500 font-mono">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 font-semibold uppercase">Global Bureaus:</span>
            <span>New Delhi</span>
            <span>•</span>
            <span>New York</span>
            <span>•</span>
            <span>London</span>
            <span>•</span>
            <span>Singapore</span>
            <span>•</span>
            <span>Tokyo</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live News & Market Feeds Active</span>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <p>© 2026 NEWS 24*7 Publishing Syndicate Ltd. All international editorial rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Dispatch</span>
            <span className="hover:text-gray-400 cursor-pointer">Editorial Guidelines</span>
            <span className="hover:text-gray-400 cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
