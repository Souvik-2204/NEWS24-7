import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', bureau: 'delhi', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-zinc-800 pb-8">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 inline-block">
          Global Bureaus
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-white">
          Contact NEWS 24*7
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
          Inquiries for our editorial desks, whistleblowers, and institutional subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Contact Form */}
        <div className="md:col-span-7 glass-card rounded-3xl p-8 border border-zinc-800">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-white">Dispatch Dispatched</h3>
              <p className="text-xs text-gray-400">
                Your communication has been forwarded securely to the chief desk. An editor will reply shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Lord Byron"
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@institution.org"
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Target Bureau</label>
                <select
                  value={form.bureau}
                  onChange={(e) => setForm({ ...form, bureau: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 outline-none"
                >
                  <option value="delhi">New Delhi Bureau (Subcontinent Affairs)</option>
                  <option value="newyork">New York Bureau (Wall Street & UN)</option>
                  <option value="london">London Bureau (European Affairs)</option>
                  <option value="tokyo">Tokyo Bureau (Asia-Pacific)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Confidential Communication</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Briefly describe your inquiry or confidential lead..."
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl p-3 outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Transmit Secure Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Global Addresses */}
        <div className="md:col-span-5 space-y-4 text-xs">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h4 className="font-serif text-sm font-bold text-white">New Delhi Central Bureau</h4>
            <p className="text-gray-400 leading-relaxed">
              The Press House, Connaught Place, New Delhi 110001, India.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h4 className="font-serif text-sm font-bold text-white">New York Bureau</h4>
            <p className="text-gray-400 leading-relaxed">
              5th Avenue, International Media Center, New York, NY 10020, USA.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <h4 className="font-serif text-sm font-bold text-white">Editorial Wire Desk</h4>
            <p className="text-gray-400 font-mono">editorial@news247.global</p>
            <p className="text-[10px] text-gray-500">Encrypted PGP Key Available on Request</p>
          </div>
        </div>

      </div>
    </div>
  );
};
