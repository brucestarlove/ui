# Starscape — design philosophy

Starscape (`@starlove/ui`) is an **opinionated brand design layer**, not a
defensive, collision-safe component library. It is published publicly only
because the styles would be extracted anyway, and it is meant to be reused across
all of our projects (or forked into a new brand variant). These rules are the
*why* behind how the package is named and structured.

## 1. Element-first
Style semantic HTML elements directly (`button`, `input`, `table`, `h1`…). The
common case is **classless** — clean markup, the brand always wins. There is
**no `ss-`/namespace prefix**; global override of plain elements is the point.

## 2. Classes only when no element fits
Reach for a class only for compositional concepts with no HTML equivalent
(`card`, `lane`, `chip`, `topbar`). Keep them short, unprefixed, kebab-case.

## 3. Variants via attributes, not class soup
One axis → one attribute:
- `data-variant` — structural/form variation (e.g. `secondary`, `ghost`, `cta`).
- `data-tone` — semantic color intent (`success`, `warning`, `danger`, `accent`).
- `data-size` — scale (`sm`, `md`, `lg`).
- State via boolean / ARIA attributes (`data-open`, `data-active`,
  `aria-expanded`, `aria-current`, `:checked`, `:disabled`).

Bare element = the default variant. Never encode a variant as a modifier class
(`.btn-secondary`, `.ghost`) — use `data-variant`.

## 4. React mirrors the CSS
React props map to data-attributes; component → CSS class is 1:1. Multi-part
("compound") components use **flat prefixed siblings**
(`PageSidebarHeader`, `FlyoutItem`, `ContextMenuItem`), not dot-namespacing.

## 5. Unify, never delete *flavors*
Every visual flavor is kept. Tidy-ups normalize *names and mechanisms* only —
they never remove a look someone might want.

## 6. Zero legacy burden
There is no backwards-compatibility obligation to anything (including the prior
kanban / ss-orbit codebase this was extracted from). Aliases, dual class+attr
selectors, `@deprecated` props, and compat shims are **cruft to prune** — not
assets. (Contrast with rule 5: prune legacy *mechanisms*, keep visual *flavors* —
e.g. drop the `.btn-sun` alias, keep the CTA look via `data-variant="cta"`.)

## 7. Specificity via `:where()`
Base element styles are wrapped in `:where()` so they carry **zero specificity**.
Any class or inline style added later then overrides them without `!important`.
This is what makes "override every element" safe to live with.
