import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../store.ts';
import { HERO_VIDEO } from '../../media.ts';
import './Hero.css';

const RingScene = lazy(() => import('../../three/RingScene.tsx'));

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const mq = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches;

// Motion only when the visitor allows it and the device can render it; otherwise the poster is the hero.
function motionAllowed() {
  if (mq('(prefers-reduced-motion: reduce)')) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

// Posters are renders of the same 3D scene (01-hero-front), so the live scene fades in without changing the ring.
function Poster() {
  const set = (name: string, ext: string, widths: number[]) => widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture className="hero-poster">
      <source media="(max-width: 700px)" type="image/avif" srcSet={set('hero-3d-mobile', 'avif', [780, 1170])} sizes="100vw" />
      <source media="(max-width: 700px)" type="image/webp" srcSet={set('hero-3d-mobile', 'webp', [780, 1170])} sizes="100vw" />
      <source media="(max-width: 700px)" srcSet={set('hero-3d-mobile', 'jpg', [780, 1170])} sizes="100vw" />
      <source type="image/avif" srcSet={set('hero-3d', 'avif', [1280, 1920])} sizes="100vw" />
      <source type="image/webp" srcSet={set('hero-3d', 'webp', [1280, 1920])} sizes="100vw" />
      <img src="/img/hero-3d-1920.jpg" srcSet={set('hero-3d', 'jpg', [1280, 1920])} sizes="100vw"
        width="1920" height="1080" alt="" fetchPriority="high" decoding="async" />
    </picture>
  );
}

function HeroVideo({ playing, onReady, onError }: { playing: boolean; onReady: () => void; onError: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const src = mq('(max-width: 700px)') ? HERO_VIDEO.mobile : HERO_VIDEO.desktop;
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(onError); else v.pause();
  }, [playing, onError]);
  if (!src) return null;
  return <video ref={ref} className="hero-media" src={src} muted loop playsInline preload="auto" aria-hidden onCanPlay={onReady} onError={onError} />;
}

export default function Hero() {
  const { s, to } = useLang();
  const section = useRef<HTMLElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const useVideo = !!(HERO_VIDEO.desktop || HERO_VIDEO.mobile);

  // Start heavy media only after the page (poster, text, fonts) has loaded.
  useEffect(() => {
    if (!motionAllowed()) return;
    let id: number;
    const start = () => { id = window.setTimeout(() => setLoad(true), 300); };
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
    return () => { window.clearTimeout(id); window.removeEventListener('load', start); };
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = inView;

  // Slogans change once through the list and settle back on the first; none of this under reduced motion.
  const slogans = s.hero.slogans;
  const [k, setK] = useState(0);
  const [cycled, setCycled] = useState(false);
  useEffect(() => {
    if (cycled || !inView || mq('(prefers-reduced-motion: reduce)')) return;
    const id = window.setTimeout(() => {
      const next = (k + 1) % slogans.length;
      setK(next);
      if (next === 0) setCycled(true);
    }, 6000); // long enough to read both lines calmly before the next one
    return () => window.clearTimeout(id);
  }, [k, cycled, inView, slogans.length]);
  const fail = () => { setFailed(true); setReady(false); };

  return (
    <section ref={section} id="top-band" className={`hero panel${ready && !failed ? ' is-live' : ''}`} data-panel="0">
      <title>{s.seo.home}</title>
      <Poster />
      {load && !failed && (
        <div className="hero-media" role="img" aria-label={s.hero.sceneLabel}>
          {useVideo ? (
            <HeroVideo playing={animate} onReady={() => setReady(true)} onError={fail} />
          ) : (
            <Boundary onError={fail}>
              <Suspense fallback={null}>
                <RingScene animate={animate} framing={mq('(max-width: 700px)') ? 'portrait' : 'landscape'} onReady={() => setReady(true)} onError={fail} />
              </Suspense>
            </Boundary>
          )}
        </div>
      )}
      <div className="hero-content">
        <p className="hero-kicker" key={k}><span>{slogans[k][0]}</span> <span>{slogans[k][1]}</span></p>
        <p className="hero-sub">{s.hero.sub}</p>
        <div className="actions">
          <Link to={to('/collection')} className="btn btn-glass btn-primary">{s.hero.primary}</Link>
          <Link to={to('/#contact')} className="btn btn-glass">{s.hero.secondary}</Link>
        </div>
      </div>
      {/* ORE-scale wordmark: the brand name is the headline and sits in front of the ring. */}
      <h1 className="hero-mark"><span>SF</span> <span>Diamonds</span></h1>
    </section>
  );
}
