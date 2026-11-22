import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Mail, ArrowRight, Rss, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#ede5d6] border-t border-[#ded4c3] text-[#544c41] text-xs mt-20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid: Masthead branding & News Desks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#ded4c3]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif text-3xl font-black text-[#1c1917]">
              NEWS <span className="text-[#946638] italic">24</span><span className="text-[#b8895b]">*</span>7
            </h2>
            <p className="text-[#5c554a] text-xs leading-relaxed max-w-sm">
              The premier digital newspaper delivering uncompromising global journalism, independent investigations, and real-time financial market intelligence from bureaus across New Delhi, New York, London, and Tokyo.
            </p>
            <div className="flex items-center space-x-3 text-xs text-[#784f27] pt-2 font-semibold">
              <Award className="w-4 h-4 text-[#946638]" />
              <span>International Press Freedom Standard Verified</span>
            </div>
          </div>

          {/* Editorial Desks */}
          <div>
            <h3 className="text-[#1c1917] font-bold text-xs tracking-wider uppercase mb-4">Editorial Desks</h3>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/world" className="hover:text-[#946638] transition-colors">World Affairs</Link></li>
              <li><Link to="/india" className="hover:text-[#946638] transition-colors">India Subcontinent</Link></li>
              <li><Link to="/politics" className="hover:text-[#946638] transition-colors">Politics & Parliament</Link></li>
              <li><Link to="/markets" className="hover:text-[#946638] transition-colors">Financial Intelligence</Link></li>
              <li><Link to="/business" className="hover:text-[#946638] transition-colors">Business & Enterprise</Link></li>
            </ul>
          </div>

          {/* Specialized Sections */}
          <div>
            <h3 className="text-[#1c1917] font-bold text-xs tracking-wider uppercase mb-4">Technology & Culture</h3>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/technology" className="hover:text-[#946638] transition-colors">Silicon & AI Systems</Link></li>
              <li><Link to="/science" className="hover:text-[#946638] transition-colors">Cosmology & Biotech</Link></li>
              <li><Link to="/sports" className="hover:text-[#946638] transition-colors">Global Championships</Link></li>
              <li><Link to="/entertainment" className="hover:text-[#946638] transition-colors">Cinema & Culture</Link></li>
              <li><Link to="/opinion" className="hover:text-[#946638] transition-colors">Editorial Perspectives</Link></li>
            </ul>
          </div>

          {/* Subscriptions & Institutional */}
          <div>
            <h3 className="text-[#1c1917] font-bold text-xs tracking-wider uppercase mb-4">Membership</h3>
            <ul className="space-y-2.5 font-semibold">
              <li><Link to="/subscriptions" className="text-[#946638] hover:text-[#784f27]">Bronze (₹99/mo)</Link></li>
              <li><Link to="/subscriptions" className="text-[#946638] hover:text-[#784f27]">Silver (₹199/mo)</Link></li>
              <li><Link to="/subscriptions" className="text-[#946638] hover:text-[#784f27]">Gold VIP (₹399/mo)</Link></li>
              <li><Link to="/about" className="text-[#544c41] hover:text-[#1c1917] font-medium transition-colors">About Our Editorial Board</Link></li>
              <li><Link to="/contact" className="text-[#544c41] hover:text-[#1c1917] font-medium transition-colors">Global Bureau Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#786f63] gap-4">
          <p>© {new Date().getFullYear()} NEWS 24*7 Chronicle Syndicate Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Market data delayed by 15 mins</span>
            <span>•</span>
            <Link to="/about" className="hover:underline">Code of Ethics</Link>
            <span>•</span>
            <Link to="/contact" className="hover:underline">Syndication Licensing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
