import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Compass, ShieldAlert, Cpu, Globe } from 'lucide-react';

const popularTags = [
  'Internet', 'WhatsApp', 'Tech Guide', 'Android 16',
  'iPhone 18', 'Cyber Security', 'Startups', 'Tech Tutorials', 'Crypto'
];

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-16 transition-colors">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Info and Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="bg-primary text-white px-3 py-1.5 rounded-lg font-display font-extrabold text-lg tracking-wider">
                TECH
              </span>
              <span className="font-display font-bold text-xl tracking-tight">
                Khabar
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              टेक ख़बर हिन्दी में तकनीक और इंटरनेट की दुनिया से जुडी नवीनतम ख़बरें, समीक्षाएं, विश्लेषण और मार्गदर्शिकाएं प्रदान करने वाला अग्रणी पोर्टल है।
            </p>
            <div className="flex flex-col space-y-2 text-xs text-muted pt-2">
              <span className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@techkhabar.ai</span>
              </span>
              <span className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground mb-4 border-l-2 border-primary pl-2.5">
              महत्वपूर्ण लिंक्स
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-muted">
              <li>
                <Link href="/" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>होमपेज</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>हमारे बारे में (About Us)</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>संपर्क करें (Contact Us)</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>गोपनीयता नीति (Privacy Policy)</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>नियम व शर्तें (Terms & Conditions)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: News Categories */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground mb-4 border-l-2 border-primary pl-2.5">
              कैटेगरी
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-muted">
              <li>
                <Link href="/category/internet-news" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>इंटरनेट न्यूज़</span>
                </Link>
              </li>
              <li>
                <Link href="/category/technology-news" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>टेक्नोलॉजी न्यूज़</span>
                </Link>
              </li>
              <li>
                <Link href="/category/mobile-news" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>मोबाइल और गैजेट्स</span>
                </Link>
              </li>
              <li>
                <Link href="/category/cyber-security" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>साइबर सुरक्षा</span>
                </Link>
              </li>
              <li>
                <Link href="/category/how-to-guides" className="hover:text-primary transition-colors flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>हाउ-टू गाइड्स</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Popular Tags */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground mb-4 border-l-2 border-primary pl-2.5">
              लोकप्रिय टैग्स
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-accent text-accent-foreground text-[10px] font-medium px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="bg-accent/40 border-t border-border py-6 text-center text-xs text-muted transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>
            © {new Date().getFullYear()} Tech Khabar. सर्वाधिकार सुरक्षित।
          </span>
          <span>
            Designed for Tech Enthusiasts. Powered by Next.js 15 & MongoDB.
          </span>
        </div>
      </div>
    </footer>
  );
}
