import type { ReactNode } from 'react';
import { useLang, waLink } from '../store.ts';

export function Ext({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}

// Opens WhatsApp with a prepared, editable message. Opening the app is not sending (product-copy-templates.md).
export function WhatsApp({ text, children, className = 'btn btn-solid' }: { text: string; children: ReactNode; className?: string }) {
  const { s } = useLang();
  return (
    <Ext href={waLink(text)} className={className}>
      {children}<span className="vh"> ({s.opensWhatsApp})</span>
    </Ext>
  );
}
