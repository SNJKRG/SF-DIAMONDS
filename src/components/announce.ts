// Polite live region shared by the whole app (shortlist saved, message copied).
export function announce(text: string) {
  const el = document.getElementById('live');
  if (!el) return;
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = text; });
}
