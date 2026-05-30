# Ritual Publish

Use this when releasing the Starscape UI packages.

Replace the version number in every command.

```bash
pnpm run version:packages -- 3.1.3
pnpm test
pnpm run build
pnpm --filter ./packages/css publish --access public --no-git-checks
pnpm --filter @starlove/ui-react publish --access public --no-git-checks
```
