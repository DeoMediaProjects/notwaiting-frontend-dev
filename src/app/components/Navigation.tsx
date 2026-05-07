import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
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
                className={`hover:text-[#EBBD06] transition-colors ${
                  location.pathname === link.path ? 'text-[#EBBD06] font-black' : ''
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
