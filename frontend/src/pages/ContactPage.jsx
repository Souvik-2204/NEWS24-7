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
      <div className="text-center space-y-3 border-b border-[#ded5c2] pb-8">
        <span className="text-xs font-bold text-[#946638] uppercase tracking-widest px-3 py-1 rounded-full bg-[#f2ece0] border border-[#d3c4b0] inline-block shadow-sm">
          Global Bureaus
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#1c1917]">
          Contact NEWS 24*7
        </h1>
        <p className="text-[#574f45] text-sm max-w-xl mx-auto leading-relaxed font-normal">
          Inquiries for our editorial desks, whistleblowers, and institutional subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-[#ded5c2] shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#1c1917]">Dispatch Dispatched</h3>
              <p className="text-xs text-[#574f45]">
                Your communication has been forwarded securely to the chief desk. An editor will reply shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1c1917] font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Lord Byron"
                  className="w-full bg-[#faf7f2] border border-[#ded5c2] text-[#1c1917] rounded-xl px-4 py-3 outline-none focus:border-[#946638]"
                />
              </div>

              <div>
                <label className="block text-[#1c1917] font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@institution.org"
                  className="w-full bg-[#faf7f2] border border-[#ded5c2] text-[#1c1917] rounded-xl px-4 py-3 outline-none focus:border-[#946638]"
                />
              </div>

              <div>
                <label className="block text-[#1c1917] font-bold mb-1">Target Editorial Bureau</label>
                <select
                  value={form.bureau}
                  onChange={(e) => setForm({ ...form, bureau: e.target.value })}
                  className="w-full bg-[#faf7f2] border border-[#ded5c2] text-[#1c1917] rounded-xl px-4 py-3 outline-none focus:border-[#946638]"
                >
                  <option value="delhi">New Delhi — Parliament & South Asia Bureau</option>
                  <option value="ny">New York — Wall Street & UN Bureau</option>
                  <option value="london">London — European Geopolitics Bureau</option>
                  <option value="tokyo">Tokyo — East Asia Technology & Trade</option>
                  <option value="investigations">Special Confidential Investigations</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1c1917] font-bold mb-1">Communication / Lead Text</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Provide detailed dispatch context or inquiry..."
                  className="w-full bg-[#faf7f2] border border-[#ded5c2] text-[#1c1917] rounded-xl p-4 outline-none focus:border-[#946638]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#946638] hover:bg-[#7e552d] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Transmit to Bureau Desk</span>
              </button>
            </form>
          )}
        </div>

        {/* Bureau Addresses */}
        <div className="md:col-span-5 space-y-4 text-xs">
          <div className="p-6 rounded-3xl bg-white border border-[#ded5c2] shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-[#946638] font-bold font-mono">
              <MapPin className="w-4 h-4 text-[#946638]" />
              <span>HEADQUARTERS</span>
            </div>
            <h4 className="font-serif text-base font-bold text-[#1c1917]">Press Enclave Bureau</h4>
            <p className="text-[#574f45] leading-relaxed">
              NEWS 24*7 Tower, 14 Barakhamba Road, Connaught Place, New Delhi 110001, India
            </p>
            <p className="text-[#786f63] font-mono">Tel: +91 11 4892 0000</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#ded5c2] shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-[#946638] font-bold font-mono">
              <MapPin className="w-4 h-4 text-[#946638]" />
              <span>WALL STREET BUREAU</span>
            </div>
            <h4 className="font-serif text-base font-bold text-[#1c1917]">Americas Financial Desk</h4>
            <p className="text-[#574f45] leading-relaxed">
              45 Rockefeller Plaza, 28th Floor, New York, NY 10111, United States
            </p>
            <p className="text-[#786f63] font-mono">Tel: +1 212 555 0198</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ded5c2] flex items-center space-x-3 text-[#786f63]">
            <ShieldCheck className="w-5 h-5 text-[#946638] shrink-0" />
            <span className="text-[11px]">PGP Encrypted whistleblower leads accepted via secure drop.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
