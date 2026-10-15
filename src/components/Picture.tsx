const imgSet = {
  // Section photos: SF channel pieces re-staged by AI on site-palette surfaces (ai-generation-bases/out/sections);
  // where the angle allowed, the original stones are pasted back by mask. One photo per place, never repeated.
  'sec-engagement': { widths: [640, 1080], w: 1080, h: 1440 },
  'sec-bespoke-wide': { widths: [960, 1600], w: 1600, h: 686 },
  'sec-bespoke-emerald': { widths: [480, 800], w: 800, h: 800 },
  'sec-closing': { widths: [560, 880], w: 880, h: 1184 },
  'sec-collection': { widths: [560, 900], w: 900, h: 1200 },
  'page-bespoke': { widths: [900, 1536], w: 1536, h: 1024 },
  'page-engagement': { widths: [900, 1536], w: 1536, h: 1024 },
  // Graded channel photos (no AI): About collage and the channel strip.
  'about-emerald': { widths: [480, 601], w: 601, h: 751 },
  'about-studs': { widths: [480, 800], w: 800, h: 1000 },
  // SF Instagram photos, same grade (assets.sh ig): Bespoke steps, FAQ, Contact.
  'ig-hands-rings': { widths: [560, 960], w: 960, h: 1200 },
  'ig-coffee': { widths: [560, 960], w: 960, h: 1200 },
  'ig-neckline': { widths: [560, 960], w: 960, h: 1200 },
  'ig-blazer': { widths: [560, 960], w: 960, h: 1200 },
  'ig-trench': { widths: [560, 960], w: 960, h: 1200 },
  'tg-bracelets-dark': { widths: [560, 853], w: 853, h: 1066 },
  'tg-tennis-layers': { widths: [560, 960], w: 960, h: 1200 },
  // Graded photos from the SF Telegram channel (assets.sh, tools/grade.py).
  'tg-ring-oval': { widths: [560, 960], w: 960, h: 1200 },
  'tg-ring-radiant': { widths: [560, 960], w: 960, h: 1200 },
  'tg-ring-pear': { widths: [560, 960], w: 960, h: 1200 },
  'tg-ring-round': { widths: [560, 960], w: 960, h: 1200 },
  'tg-ring-pink': { widths: [560, 960], w: 960, h: 1200 },
  'tg-ring-yellow': { widths: [560, 960], w: 960, h: 1200 },
  'tg-ring-pear-2603': { widths: [560, 960], w: 960, h: 1200 },
  'tg-ring-blue-2793': { widths: [560, 844], w: 844, h: 1055 },
  'tg-studs-1264': { widths: [560, 960], w: 960, h: 1200 },
  'tg-earrings-2058': { widths: [560, 960], w: 960, h: 1200 },
  'tg-pendant-2057': { widths: [560, 960], w: 960, h: 1200 },
  'tg-emerald-2787': { widths: [560, 601], w: 601, h: 751 },
  'tg-cross-2075': { widths: [560, 960], w: 960, h: 1200 },
  'tg-tennis-2735': { widths: [560, 640], w: 640, h: 800 },
  'tg-bracelet-2536': { widths: [560, 853], w: 853, h: 1066 },
  'tg-bracelets-2662': { widths: [560, 960], w: 960, h: 1200 },
  'tg-bracelets-3312': { widths: [560, 853], w: 853, h: 1066 },
  'tg-bracelets-2712': { widths: [560, 598], w: 598, h: 747 },
  'tg-yellow-2801': { widths: [560, 960], w: 960, h: 1200 },
  'tg-watch-snake-2334': { widths: [560, 960], w: 960, h: 1200 },
  'tg-watch-square-2221': { widths: [560, 960], w: 960, h: 1200 },
  'tg-watch-oval-2577': { widths: [560, 960], w: 960, h: 1200 },
  'tg-watch-blue-2011': { widths: [560, 960], w: 960, h: 1200 },
  'tg-bracelets': { widths: [560, 960], w: 960, h: 1200 },
  'tg-bracelets-tray': { widths: [598], w: 598, h: 748 },
  'tg-bracelet-studio': { widths: [720, 1280], w: 1280, h: 853 },
  'tg-earrings': { widths: [560, 1000], w: 1000, h: 1250 },
  'tg-necklace': { widths: [560, 960], w: 960, h: 1200 },
  // Own priced pieces: channel photo, AI-edited navy background, original stones (assets.sh).
  'sf-necklace-2062': { widths: [560, 960], w: 960, h: 1200 },
  'sf-studs-177': { widths: [560, 960], w: 960, h: 1200 },
  // AI illustrations for the six priced records of 06.09.2026 (ai-generation-bases/out/prices/demo-*), labelled on the site.
  'demo-earrings': { widths: [560, 960], w: 960, h: 1200 },
  'demo-ring': { widths: [560, 960], w: 960, h: 1200 },
  'demo-pendant': { widths: [560, 960], w: 960, h: 1200 },
  'demo-chain': { widths: [560, 960], w: 960, h: 1200 },
  'demo-bangle-4': { widths: [560, 960], w: 960, h: 1200 },
  'demo-bangle-6': { widths: [560, 960], w: 960, h: 1200 },
} as const;
export type ImageName = keyof typeof imgSet;

export function Picture({ name, alt, sizes, className }: { name: ImageName; alt: string; sizes: string; className?: string }) {
  const { widths, w, h } = imgSet[name];
  const set = (ext: string) => widths.map((x) => `/img/${name}-${x}.${ext} ${x}w`).join(', ');
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img src={`/img/${name}-${widths[0]}.jpg`} srcSet={set('jpg')} sizes={sizes} width={w} height={h} alt={alt} loading="lazy" decoding="async" />
    </picture>
  );
}
