import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './styles/global.css';
import Layout from './components/Layout.tsx';
import { preferredLang } from './components/lang.ts';
import Home from './pages/Home.tsx';
import Collection from './pages/Collection.tsx';
import Product from './pages/Product.tsx';
import Shortlist from './pages/Shortlist.tsx';
import { Editorial, Availability, Faq, Contact, NotFound } from './pages/Editorial.tsx';
import Viewing from './pages/Viewing.tsx';

// Scroll reveals hide content only when JS runs and motion is allowed (see .reveal-on in styles/global.css).
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('reveal-on');

const Capture = lazy(() => import('./pages/Capture.tsx'));

const router = createBrowserRouter([
  { path: '/', element: <Navigate to={`/${preferredLang()}/`} replace /> },
  { path: '/capture', element: <Suspense fallback={null}><Capture /></Suspense> },
  {
    path: '/:lang',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'collection', element: <Collection /> },
      { path: 'collection/:category', element: <Collection /> },
      { path: 'pieces/:slug', element: <Product /> },
      { path: 'shortlist', element: <Shortlist /> },
      { path: 'bespoke', element: <Editorial page="bespoke" /> },
      { path: 'engagement', element: <Editorial page="engagement" image="page-engagement" /> },
      { path: 'materials', element: <Editorial page="materials" /> },
      { path: 'about', element: <Editorial page="about" /> },
      { path: 'service', element: <Editorial page="service" /> },
      { path: 'availability', element: <Availability /> },
      { path: 'viewing', element: <Viewing /> },
      { path: 'faq', element: <Faq /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
