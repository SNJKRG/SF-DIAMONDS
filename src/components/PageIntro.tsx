import type { ReactNode } from 'react';
import { useLang } from '../store.ts';
import './PageIntro.css';

// title: the full SEO phrase from s.seo.
export default function PageIntro({ title, h1, lead, children }: { title: string; h1: string; lead?: string; children?: ReactNode }) {
  const { s } = useLang();
  return (
    <section id="top-band" className="intro">
      <title>{title}</title>
      <div className="wrap">
        <h1>{h1}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children && <div className="actions">{children}</div>}
      </div>
    </section>
  );
}
