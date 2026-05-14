import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/manifesto', label: 'Manifesto' },
    { path: '/stories', label: 'Stories' },
    { path: '/partners', label: 'Partners' },
    { path: '/contact', label: 'Contact' }
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`pb-0.5 transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-white border-b-2 border-[#EBBD06]'
                    : 'text-white/70 hover:text-white border-b-2 border-transparent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-[#EBBD06] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-white border-l-2 border-[#EBBD06] pl-3'
                    : 'text-white/70 hover:text-white pl-3'
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
