import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// three/R3F are reached only through dynamic import() (Hero, Capture), so they land in a lazy chunk on their own.
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1100 },
});
