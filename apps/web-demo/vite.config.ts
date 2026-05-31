import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Subpath must come first: the bare-specifier alias below is a prefix
      // match, so it would otherwise swallow `@starlove/ui-react/toaster`.
      '@starlove/ui-react/toaster': fileURLToPath(
        new URL('../../packages/react/src/Toaster.tsx', import.meta.url),
      ),
      '@starlove/ui-react': fileURLToPath(
        new URL('../../packages/react/src/index.ts', import.meta.url),
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    open: false,
  },
});
