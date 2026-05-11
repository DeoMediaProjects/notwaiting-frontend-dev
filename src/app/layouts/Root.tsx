import { useState } from 'react';
import { Outlet, Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { ScrollToTop } from '../components/ScrollToTop';
import { ScrollToTopOnRouteChange } from '../components/ScrollToTopOnRouteChange';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export type Language = 'EN' | 'FR';

const socials = [
  { href: 'https://www.tiktok.com/@notwaiting.africa', label: 'TikTok', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )},
  { href: 'https://www.instagram.com/notwaiting.africa/', label: 'Instagram', icon: <Instagram size={20} /> },
  { href: 'https://x.com/_notwaiting_', label: 'X', icon: <Twitter size={20} /> },
  { href: 'https://www.facebook.com/profile.php?id=61564808614053', label: 'Facebook', icon: <Facebook size={20} /> },
];

export default function Root() {
  const [language, setLanguage] = useState<Language>('EN');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTopOnRouteChange />
      {/* <Navigation /> */}

      {/* Floating social icons */}
      <div className="fixed top-0 right-0 z-50 flex items-center gap-5 px-6 py-5">
        {socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-white hover:text-[#EBBD06] transition-colors drop-shadow-md">
            {s.icon}
          </a>
        ))}
      </div>

      {/* Language toggle — top left */}
      <div className="fixed top-0 left-0 z-50 flex items-center px-6 py-5">
        <div className="flex items-center drop-shadow-md bg-white/10 backdrop-blur-sm rounded-full overflow-hidden border border-white/20">
          <button
            onClick={() => setLanguage('EN')}
            className={`px-3 py-1 text-xs font-black uppercase tracking-wide transition-colors ${
              language === 'EN' ? 'bg-white text-[#0C0C0A]' : 'text-white hover:text-[#EBBD06]'
            }`}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('FR')}
            className={`px-3 py-1 text-xs font-black uppercase tracking-wide transition-colors ${
              language === 'FR' ? 'bg-white text-[#0C0C0A]' : 'text-white hover:text-[#EBBD06]'
            }`}
            aria-label="Switch to French"
          >
            FR
          </button>
        </div>
      </div>

      <main className="flex-1">
        <Outlet context={{ language }} />
      </main>
      <ScrollToTop />
      {/* <footer className="bg-[#027A4F] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tight mb-8">
              #NotWaiting
            </h2>
            <div className="flex justify-center gap-6">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-[#EBBD06] transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm mb-8">
          </div>
          <div className="text-center text-sm text-white/70">
            <p>&copy; 2026 #NotWaiting. All rights reserved.</p>
            <p className="mt-2">A movement for African builders, creators, and innovators.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
