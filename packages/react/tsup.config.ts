import { defineConfig } from 'tsup';

export default defineConfig({
  // Toaster is a second entry (its own `@starlove/ui-react/toaster` subpath) so
  // the main barrel never statically imports the optional `sonner` peer.
  entry: ['src/index.ts', 'src/Toaster.tsx'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'sonner'],
});
