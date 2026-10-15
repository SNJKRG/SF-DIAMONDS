// Hero media switch. When the Gemini clips are ready, put the encoded files in public/video and set the paths:
// the hero then plays the clip instead of the realtime 3D scene (same poster-first and pause rules).
// See prompts/video/export-guide.md in the handoff for encoding targets (mobile <= 2 MB, desktop <= 4-6 MB).
export const HERO_VIDEO: { desktop: string | null; mobile: string | null } = {
  desktop: null, // e.g. '/video/hero-desktop.mp4'
  mobile: null, // e.g. '/video/hero-mobile.mp4'
};
