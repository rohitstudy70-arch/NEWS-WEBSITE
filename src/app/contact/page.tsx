'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    // Simulate submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.6 }
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Intro Header */}
      <div className="text-center space-y-3">
        <span className="text-primary text-xs font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
          संपर्क करें (Contact Us)
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
          क्या आपके पास कोई सवाल या सुझाव है?
        </h1>
        <p className="text-xs md:text-sm text-muted max-w-xl mx-auto leading-relaxed">
          विज्ञापन, साझेदारी, कंटेंट लेखन या किसी भी तकनीकी प्रश्न के लिए बेझिझक हमसे संपर्क करें। हम 24 घंटों के भीतर जवाब देंगे।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column (1/3 width) */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl flex items-start space-x-3.5 shadow-sm transition-colors">
            <Mail className="w-5 h-5 text-primary mt-1" />
            <div>
              <h3 className="text-xs md:text-sm font-bold text-foreground">ईमेल करें (Email)</h3>
              <p className="text-xs text-muted font-medium mt-1">support@techkhabar.ai</p>
              <p className="text-xs text-muted font-medium">media@techkhabar.ai</p>
            </div>
          </div>

          <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl flex items-start space-x-3.5 shadow-sm transition-colors">
            <Phone className="w-5 h-5 text-primary mt-1" />
            <div>
              <h3 className="text-xs md:text-sm font-bold text-foreground">कॉल करें (Phone)</h3>
              <p className="text-xs text-muted font-medium mt-1">+91 98765 43210</p>
              <p className="text-xs text-muted font-medium">सोम - शनि (10 AM - 6 PM)</p>
            </div>
          </div>

          <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl flex items-start space-x-3.5 shadow-sm transition-colors">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <h3 className="text-xs md:text-sm font-bold text-foreground">कार्यालय (Office)</h3>
              <p className="text-xs text-muted font-medium mt-1 leading-relaxed">
                टेक ख़बर AI मीडिया नेटवर्क,<br />
                सेक्टर 62, नोएडा,<br />
                उत्तर प्रदेश, 201301
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Column (2/3 width) */}
        <div className="bg-card text-card-foreground border border-border p-6 md:p-8 rounded-3xl shadow-sm transition-colors md:col-span-2">
          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 mx-auto" />
              <h3 className="text-base font-bold">आपका संदेश प्राप्त हुआ!</h3>
              <p className="text-xs leading-relaxed max-w-sm mx-auto">
                हमसे संपर्क करने के लिए धन्यवाद। हमारी टीम जल्द ही आपसे इस संबंध में संपर्क करेगी।
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-primary hover:underline mt-4 cursor-pointer"
              >
                नया संदेश भेजें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">आपका नाम *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">आपका ईमेल *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">विषय (Subject)</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">आपका संदेश *</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/95 text-white font-bold py-3 px-8 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer"
              >
                <span>{loading ? 'भेजा जा रहा है...' : 'संदेश भेजें'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
