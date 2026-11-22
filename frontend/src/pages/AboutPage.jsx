import React from 'react';
import { Award, Globe, Shield, BookOpen, Users, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-zinc-800 pb-8">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 inline-block">
          The Chronicle Charter
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-white">
          About NEWS 24*7
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
          Founded on the uncompromising pursuit of global truth, sovereign investigative accountability, and institutional financial clarity.
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed space-y-6">
        <p className="drop-cap text-base">
          Headquartered across New Delhi and New York, with regional newsrooms in London, Tokyo, and Singapore, NEWS 24*7 stands as an independent international newspaper syndicate. In an era saturated with synthesized headlines and algorithmic brevity, our mission remains steadfast: delivering slow, rigorous, verified investigative journalism coupled with high-frequency financial intelligence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10 not-prose">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <Feather className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="font-serif text-base font-bold text-white mb-1">Editorial Autonomy</h3>
            <p className="text-xs text-gray-400">Zero corporate or partisan ownership dictating story selection.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <Globe className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="font-serif text-base font-bold text-white mb-1">Global Desks</h3>
            <p className="text-xs text-gray-400">Accredited correspondents embedded in international policy corridors.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <Award className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="font-serif text-base font-bold text-white mb-1">Dual Peer Review</h3>
            <p className="text-xs text-gray-400">Strict two-tier editorial verification before any article is published.</p>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold text-white pt-4">The Editorial Board</h2>
        <p>
          Our newsroom brings together veteran foreign correspondents, former central banking economists, and investigative data journalists dedicated to demystifying the political economy of the 21st century.
        </p>
      </div>
    </div>
  );
};
