import React from 'react';
import { Award, Globe, Shield, BookOpen, Users, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-[#ded5c2] pb-8">
        <span className="text-xs font-bold text-[#946638] uppercase tracking-widest px-3 py-1 rounded-full bg-[#f2ece0] border border-[#d3c4b0] inline-block shadow-sm">
          The Chronicle Charter
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#1c1917]">
          About NEWS 24*7
        </h1>
        <p className="text-[#574f45] text-sm max-w-xl mx-auto leading-relaxed font-normal">
          Founded on the uncompromising pursuit of global truth, sovereign investigative accountability, and institutional financial clarity.
        </p>
      </div>

      <div className="prose max-w-none text-[#29241e] font-serif text-sm leading-relaxed space-y-6">
        <p className="drop-cap text-base">
          Headquartered across New Delhi and New York, with regional newsrooms in London, Tokyo, and Singapore, NEWS 24*7 stands as an independent international newspaper syndicate. In an era saturated with synthesized headlines and algorithmic brevity, our mission remains steadfast: delivering slow, rigorous, verified investigative journalism coupled with high-frequency financial intelligence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10 not-prose">
          <div className="p-6 rounded-2xl bg-white border border-[#ded5c2] shadow-sm">
            <Feather className="w-6 h-6 text-[#946638] mb-2" />
            <h3 className="font-serif text-base font-bold text-[#1c1917] mb-1">Editorial Autonomy</h3>
            <p className="text-xs text-[#574f45]">Zero corporate or partisan ownership dictating story selection.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#ded5c2] shadow-sm">
            <Globe className="w-6 h-6 text-[#946638] mb-2" />
            <h3 className="font-serif text-base font-bold text-[#1c1917] mb-1">Global Desks</h3>
            <p className="text-xs text-[#574f45]">Accredited correspondents embedded in international policy corridors.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#ded5c2] shadow-sm">
            <Award className="w-6 h-6 text-[#946638] mb-2" />
            <h3 className="font-serif text-base font-bold text-[#1c1917] mb-1">Dual Peer Review</h3>
            <p className="text-xs text-[#574f45]">Strict two-tier editorial verification before any article is published.</p>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#1c1917] pt-4">The Editorial Board</h2>
        <p>
          Our newsroom brings together veteran foreign correspondents, former central banking economists, and investigative data journalists dedicated to demystifying the political economy of the 21st century.
        </p>
      </div>
    </div>
  );
};
