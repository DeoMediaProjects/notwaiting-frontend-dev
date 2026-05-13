import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Instagram } from 'lucide-react';

const socials = [
  { href: 'https://www.tiktok.com/@notwaiting.africa', label: 'TikTok', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )},
  { href: 'https://www.instagram.com/notwaiting.africa/', label: 'Instagram', icon: <Instagram size={16} /> },
  { href: 'https://x.com/_notwaiting_', label: 'X', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.258 5.622 5.906-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
  { href: 'https://www.facebook.com/profile.php?id=61564808614053', label: 'Facebook', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )},
  { href: 'https://www.linkedin.com/company/not-waiting/', label: 'LinkedIn', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )},
];

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    // { path: '/about', label: 'About' },
    // { path: '/manifesto', label: 'Manifesto' },
    // { path: '/stories', label: 'Stories' },
    // { path: '/partners', label: 'Partners' },
    // { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="bg-[#DD3935] text-white sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-black uppercase tracking-tight hover:text-[#EBBD06] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            #NotWaiting
          </Link>

          {/* Desktop Navigation + Socials */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-[#EBBD06] transition-colors ${
                  location.pathname === link.path ? 'text-[#EBBD06] font-black' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-[#EBBD06] transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile: socials always visible + menu toggle */}
          <div className="md:hidden flex items-center gap-4">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-[#EBBD06] transition-colors">
                {s.icon}
              </a>
            ))}
            <button
              className="text-white hover:text-[#EBBD06] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block hover:text-[#EBBD06] transition-colors ${
                  location.pathname === link.path ? 'text-[#EBBD06] font-black' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
