# SF Diamonds — демо-сайт

React 19 + TypeScript + Vite + React Router, 3D: three.js / React Three Fiber / drei (грузится лениво). Бриф и тексты — в `../sf-diamonds-handoff 2`.

```sh
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc + vite build -> dist/
npm run preview      # http://localhost:4173
npm run assets       # пересобрать изображения и шрифты из архива (magick, cwebp, avifenc)
node qa/shots.mjs    # скриншоты всех страниц RU/EN, 1440 и 390 -> qa/shots/
node qa/flows.mjs    # проверки: меню, клавиатура, язык, подборка, форма, reduced motion, 3D
node qa/capture.mjs  # пять кадров 3D-сцены для Gemini -> ../sf-diamonds-handoff 2/assets/scene-renders/
```

Скрипты из `qa/` работают с запущенным `npm run preview`.

## Устройство

- `src/content.ts` — все тексты RU/EN (из `copy/ru.md`, `copy/en.md`, UI-матрицы). Новые демо-строки помечены `// new`.
- `src/data/demo-prices.json` — шесть исторических цен (копия из архива). `src/store.ts` — товары, ссылки WhatsApp, подборка в localStorage.
- `src/pages/*` — главная, коллекция и категории, карточка, подборка, примерка (форма → текст для WhatsApp), редакционные страницы, FAQ, контакты, 404.
- `src/Hero.tsx` — постер (рендер той же сцены), затем 3D после загрузки страницы. Не загружается при reduced motion, saveData и без WebGL. Есть пауза, вне экрана сцена останавливается.
- `src/three/` — сцена кольца. `/capture?shot=…` — маршрут для экспорта кадров.
- Видео и стоимость генерации — в [VIDEO.md](VIDEO.md).

## Деплой

SPA: хостингу нужен fallback на `index.html` для `/ru/*` и `/en/*` (в Netlify это `_redirects`, в Vercel — `rewrites`). Пока владелец не утвердит контент, стоит `noindex`. hreflang и canonical не добавлены: нужен итоговый домен.
