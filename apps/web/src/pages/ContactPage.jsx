import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-charcoal-900 tracking-tight">Contact BillMint</h1>
        <p className="text-slate-600">Have questions or need assistance? Our support team is here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact Info */}
        <div className="space-y-6 bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-white">Get in touch</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Reach out for sales inquiries, technical support, feature requests, or partnership opportunities.
          </p>

          <div className="space-y-4 pt-4 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-mint-400" />
              <span>support@billmint.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-mint-400" />
              <span>+91 (800) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-mint-400" />
              <span>Mint Heights, Cyber City, Bengaluru, India</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-mint-600 mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-charcoal-900">Message Received!</h3>
              <p className="text-sm text-slate-600">Thank you for reaching out. A BillMint team member will get back to you shortly.</p>
              <button 
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="text-xs font-semibold text-mint-600 underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  required 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ananya Roy"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ananya@company.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  required 
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea 
                  rows="4" 
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-mint-500 focus:outline-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-3.5 bg-mint-600 hover:bg-mint-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
