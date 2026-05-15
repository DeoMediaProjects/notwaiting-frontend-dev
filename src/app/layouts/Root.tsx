import { Outlet } from 'react-router';
import { Navigation } from '../components/Navigation';
import { ScrollToTop } from '../components/ScrollToTop';
import { ScrollToTopOnRouteChange } from '../components/ScrollToTopOnRouteChange';
import { ErrorBoundary } from '../components/ErrorBoundary';

const socials = [
  { href: 'https://www.tiktok.com/@notwaiting.africa', label: 'TikTok', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )},
  { href: 'https://www.instagram.com/notwaiting.africa/', label: 'Instagram', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )},
  { href: 'https://x.com/_notwaiting_', label: 'X', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.258 5.622 5.906-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
  { href: 'https://www.facebook.com/profile.php?id=61564808614053', label: 'Facebook', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )},
  { href: 'https://www.linkedin.com/company/not-waiting/', label: 'LinkedIn', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )},
];

export default function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTopOnRouteChange />
      <Navigation />

      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <ScrollToTop />
      <footer className="bg-[#027A4F] text-white py-16 px-6">
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
      </footer>
    </div>
  );
}
