import { useParams } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import demo from './data/demo-prices.json';
import { links, t, type Category, type Lang } from './content.ts';
import type { ImageName } from './components/Picture.tsx';

export type Product = {
  id: string;
  slug: string;
  category: Category;
  name: Record<Lang, string>;
  offer?: number; // no price in the post: shown as "price on request"
  regular?: number;
  size?: string;
  stones?: number;
  post: { id: number; date: string };
  image?: ImageName;
  edited?: boolean; // background changed by AI, stones original
  specs?: Record<Lang, string[]>;
};

// Site-only fields for the six historical records. Size and stone count come from the post wording (demo-prices.md).
const meta: Record<string, Pick<Product, 'slug' | 'category' | 'size' | 'stones'>> = {
  'source-price-01': { slug: 'earrings', category: 'earrings' },
  'source-price-02': { slug: 'ring-size-55', category: 'rings', size: '55' },
  'source-price-03': { slug: 'pendant', category: 'necklaces' },
  'source-price-04': { slug: 'chain-bracelet', category: 'bracelets' },
  'source-price-05': { slug: 'bracelet-4-stones', category: 'bracelets', size: '17', stones: 4 },
  'source-price-06': { slug: 'bracelet-6-stones', category: 'bracelets', size: '17', stones: 6 },
};

// sellerLabel is deliberately not exposed: third-party names do not prove originality (fact-register.md).
const fromPost: Product[] = demo.items.map((item) => ({
  id: item.demoId,
  name: item.name,
  offer: item.offerPriceInPost,
  regular: item.regularPriceInPost,
  post: { id: 3279, date: '06.09.2026' },
  ...meta[item.demoId],
}));

// One post (2598-2604) offers engagement rings to order; each photo there is a different ring.
const engagementSpecs: Product['specs'] = {
  ru: ['Природные или лабораторные бриллианты', 'Все бриллианты сертифицированы', 'Изготовление на заказ'],
  en: ['Natural or lab-grown diamonds', 'Every diamond certified', 'Made to order'],
};
const engagement: [string, ImageName, number, string, string][] = [
  ['oval-diamond-ring', 'tg-ring-oval', 2602, 'Кольцо с бриллиантом овальной огранки', 'Oval diamond ring'],
  ['radiant-diamond-ring', 'tg-ring-radiant', 2604, 'Кольцо с бриллиантом огранки радиант', 'Radiant-cut diamond ring'],
  ['round-solitaire-ring', 'tg-ring-round', 2600, 'Кольцо-солитер с круглым бриллиантом', 'Round diamond solitaire ring'],
  ['pear-three-stone-ring', 'tg-ring-pear', 2601, 'Кольцо с грушевидным бриллиантом и боковыми камнями', 'Pear diamond three-stone ring'],
  ['pear-diamond-ring', 'tg-ring-pear-2603', 2603, 'Кольцо с бриллиантом грушевидной огранки', 'Pear-shaped diamond ring'],
  ['pink-pear-ring', 'tg-ring-pink', 2599, 'Кольцо с розовым камнем грушевидной формы', 'Ring with a pink pear-shaped stone'],
  ['yellow-three-stone-ring', 'tg-ring-yellow', 2598, 'Кольцо с жёлтым камнем и боковыми бриллиантами', 'Yellow stone three-stone ring'],
];

// SF's own designs from public posts (a price only where the post gives one). Photo: the channel frame with an AI-edited background; the stones
// are the original pixels pasted back by mask (ai-generation-bases/out/prices). Specs are quoted as the post states them.
const own: Product[] = [
  {
    id: 'sf-post-2062', slug: 'tennis-necklace', category: 'necklaces', image: 'sf-necklace-2062', edited: true, post: { id: 2062, date: '30.07.2025' },
    name: { ru: 'Теннисное колье, 40 см', en: 'Tennis necklace, 40 cm' }, offer: 2200000,
    specs: {
      ru: ['Природные бриллианты, общий вес 20,35 карата', 'Каждый камень около 0,18 карата', 'Цвет FG, чистота VS', 'Длина 40 см'],
      en: ['Natural diamonds, 20.35 ct in total', 'Each stone about 0.18 ct', 'Colour FG, clarity VS', 'Length 40 cm'],
    },
  },
  {
    id: 'sf-post-177', slug: 'halo-studs', category: 'earrings', image: 'sf-studs-177', edited: true, post: { id: 177, date: '02.03.2024' },
    name: { ru: 'Пусеты с ореолом', en: 'Halo stud earrings' }, offer: 120000,
    specs: { ru: ['Природные бриллианты', 'Золото 585 пробы'], en: ['Natural diamonds', '14k (585) gold'] },
  },
  {
    id: 'sf-post-2537', slug: 'tennis-bracelet-2ct', category: 'bracelets', image: 'tg-bracelet-2536', post: { id: 2537, date: '22.01.2026' },
    name: { ru: 'Теннисный браслет, 2 карата', en: 'Tennis bracelet, 2 ct' }, offer: 220000, size: '17',
    specs: {
      ru: ['Природные бриллианты, общий вес 2 карата', 'Центральный камень 0,3 карата', 'Белое золото 750 пробы', 'Длина 17 см'],
      en: ['Natural diamonds, 2 ct in total', 'Centre stone 0.3 ct', '18k (750) white gold', 'Length 17 cm'],
    },
  },
  ...engagement.map(([slug, image, post, ru, en]) => ({
    id: `sf-post-${post}`, slug, category: 'rings' as const, image, post: { id: post, date: '25.02.2026' }, name: { ru, en }, specs: engagementSpecs,
  })),
  {
    id: 'sf-post-2791', slug: 'blue-pear-halo-ring', category: 'rings', image: 'tg-ring-blue-2793', post: { id: 2791, date: '26.04.2026' },
    name: { ru: 'Кольцо с голубым камнем грушевидной формы', en: 'Ring with a pear-shaped blue stone' },
  },
  {
    id: 'sf-post-1262', slug: 'lab-diamond-studs', category: 'earrings', image: 'tg-studs-1264', post: { id: 1262, date: '25.12.2024' },
    name: { ru: 'Пусеты с круглыми бриллиантами', en: 'Round diamond studs' },
    specs: { ru: ['Лабораторные бриллианты'], en: ['Lab-grown diamonds'] },
  },
  {
    id: 'sf-post-2058', slug: 'emerald-cut-drop-earrings', category: 'earrings', image: 'tg-earrings-2058', post: { id: 2058, date: '27.07.2025' },
    name: { ru: 'Серьги-подвески с бриллиантами изумрудной огранки', en: 'Emerald-cut diamond drop earrings' },
  },
  {
    id: 'sf-post-2057', slug: 'double-halo-pendant', category: 'necklaces', image: 'tg-pendant-2057', post: { id: 2057, date: '27.07.2025' },
    name: { ru: 'Подвеска в двойном ореоле', en: 'Double halo pendant' },
  },
  {
    id: 'sf-post-2782', slug: 'emerald-necklace', category: 'necklaces', image: 'tg-emerald-2787', post: { id: 2782, date: '25.04.2026' },
    name: { ru: 'Колье с изумрудом', en: 'Emerald necklace' },
  },
  {
    id: 'sf-post-2734', slug: 'graduated-tennis-necklaces', category: 'necklaces', image: 'tg-tennis-2735', post: { id: 2734, date: '10.04.2026' },
    name: { ru: 'Теннисные колье, от 5 до 15 карат', en: 'Tennis necklaces, 5 to 15 ct' },
    specs: { ru: ['Природные бриллианты', 'Белое золото 750 пробы', 'Под заказ'], en: ['Natural diamonds', '18k (750) white gold', 'Made to order'] },
  },
  {
    id: 'sf-post-2073', slug: 'diamond-cross-pendant', category: 'necklaces', image: 'tg-cross-2075', post: { id: 2073, date: '01.08.2025' },
    name: { ru: 'Подвеска-крест с бриллиантами', en: 'Diamond cross pendant' },
  },
  {
    id: 'sf-post-2659', slug: 'tennis-bracelets-4-16ct', category: 'bracelets', image: 'tg-bracelets-2662', post: { id: 2659, date: '14.03.2026' },
    name: { ru: 'Теннисные браслеты, от 4 до 16 карат', en: 'Tennis bracelets, 4 to 16 ct' },
    specs: { ru: ['Природные бриллианты, FG/VS1', 'Золото 750 пробы'], en: ['Natural diamonds, FG/VS1', '18k (750) gold'] },
  },
  {
    id: 'sf-post-3313', slug: 'tennis-bracelet-7-5ct', category: 'bracelets', image: 'tg-bracelets-3312', post: { id: 3313, date: '18.09.2026' },
    name: { ru: 'Теннисный браслет, 7,5 карата', en: 'Tennis bracelet, 7.5 ct' },
    specs: {
      ru: ['Природные бриллианты, общий вес 7,5 карата', 'Характеристики камней H/VS1', 'Белое золото 750 пробы'],
      en: ['Natural diamonds, 7.5 ct in total', 'Stones H/VS1', '18k (750) white gold'],
    },
  },
  {
    id: 'sf-post-2715', slug: 'tennis-bracelets-white-gold', category: 'bracelets', image: 'tg-bracelets-2712', post: { id: 2715, date: '04.04.2026' },
    name: { ru: 'Теннисные браслеты из белого золота', en: 'White gold tennis bracelets' },
    specs: { ru: ['Природные бриллианты', 'Белое золото 750 пробы'], en: ['Natural diamonds', '18k (750) white gold'] },
  },
  {
    id: 'sf-post-2804', slug: 'yellow-diamond-bracelet', category: 'bracelets', image: 'tg-yellow-2801', post: { id: 2804, date: '27.04.2026' },
    name: { ru: 'Браслет с жёлтыми бриллиантами', en: 'Yellow diamond bracelet' },
    specs: { ru: ['Природные бриллианты'], en: ['Natural diamonds'] },
  },
];

export const products: Product[] = [...own, ...fromPost];

export const productById = (id: string) => products.find((p) => p.id === id);
export const productBySlug = (slug?: string) => products.find((p) => p.slug === slug);

export const formatPrice = (n: number, lang: Lang) => new Intl.NumberFormat(t[lang].locale).format(n);
export const priceLabel = (p: Product, lang: Lang) => (p.offer ? formatPrice(p.offer, lang) : t[lang].prices.onRequest);
export const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k]));
export const pad = (n: number) => String(n).padStart(2, '0');
export const waLink = (text: string) => `${links.whatsapp}?text=${encodeURIComponent(text)}`;

export function useLang() {
  const { lang } = useParams();
  const l: Lang = lang === 'en' ? 'en' : 'ru';
  return { lang: l, s: t[l], to: (p = '') => `/${l}${p}` };
}

// Shortlist: [{ id, size }] in localStorage, shared across tabs. Unknown ids stay and are labelled, never swapped.
type ShortlistItem = { id: string; size: string };
const KEY = 'sf-shortlist';
const listeners = new Set<() => void>();
let cache: ShortlistItem[] | undefined;
let memory: ShortlistItem[] = []; // fallback when storage is blocked

const read = (): ShortlistItem[] => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return memory; }
};
const snapshot = () => (cache ??= read());
const emit = () => { cache = undefined; listeners.forEach((l) => l()); };
const write = (list: ShortlistItem[]) => {
  memory = list;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* private mode: memory only */ }
  emit();
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => e.key === KEY && emit();
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(l); window.removeEventListener('storage', onStorage); };
};

export function useShortlist() {
  const list = useSyncExternalStore(subscribe, snapshot, () => []);
  return {
    list,
    has: (id: string) => list.some((i) => i.id === id),
    toggle: (id: string, size = '') =>
      write(list.some((i) => i.id === id) ? list.filter((i) => i.id !== id) : [...list, { id, size }]),
    setSize: (id: string, size: string) => write(list.map((i) => (i.id === id ? { ...i, size } : i))),
    remove: (id: string) => write(list.filter((i) => i.id !== id)),
  };
}
