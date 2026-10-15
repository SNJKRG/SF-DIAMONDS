import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

// Adds .is-in once the element scrolls into view; CSS does the rest (hidden only under html.reveal-on).
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({ children, className = '', i = 0 }: { children: ReactNode; className?: string; i?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className={className} data-reveal style={{ '--i': i } as CSSProperties}>{children}</div>;
}
