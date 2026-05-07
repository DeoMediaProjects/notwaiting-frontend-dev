import { createBrowserRouter } from 'react-router';
import Root from './layouts/Root';
import Home from './pages/Home';
import About from './pages/About';
import Manifesto from './pages/Manifesto';
import Stories from './pages/Stories';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import GetMark from './pages/GetMark';
import Dashboard from './pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'manifesto', Component: Manifesto },
      { path: 'stories', Component: Stories },
      { path: 'partners', Component: Partners },
      { path: 'contact', Component: Contact },
      { path: 'dashboard', Component: Dashboard },
    ]
  },
  {
    path: '/get-mark',
    Component: GetMark
  }
]);
