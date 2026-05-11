import { Outlet, Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { ScrollToTop } from '../components/ScrollToTop';
import { ScrollToTopOnRouteChange } from '../components/ScrollToTopOnRouteChange';
import { ErrorBoundary } from '../components/ErrorBoundary';

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
          <div className="text-center mb-12">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tight mb-8">
              #NotWaiting
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm mb-8">
            <Link to="/about" className="hover:text-[#EBBD06] transition-colors">About</Link>
            <Link to="/manifesto" className="hover:text-[#EBBD06] transition-colors">Manifesto</Link>
            <Link to="/stories" className="hover:text-[#EBBD06] transition-colors">Stories</Link>
            <Link to="/partners" className="hover:text-[#EBBD06] transition-colors">Partners</Link>
            <Link to="/contact" className="hover:text-[#EBBD06] transition-colors">Contact</Link>
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
