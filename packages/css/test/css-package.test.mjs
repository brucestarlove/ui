import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workspaceRoot = dirname(dirname(pkgRoot));
const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));
const rootPkg = JSON.parse(readFileSync(join(workspaceRoot, "package.json"), "utf8"));
const reactPkg = JSON.parse(readFileSync(join(workspaceRoot, "packages/react/package.json"), "utf8"));
const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function readCss(relativePath) {
  return readFileSync(join(pkgRoot, relativePath), "utf8");
}

test("workspace root cannot publish over the CSS package", () => {
  assert.equal(rootPkg.name, "starscape-ui-system-v3");
  assert.equal(rootPkg.private, true);
  assert.notEqual(rootPkg.name, pkg.name);
  assert.match(rootPkg.scripts.release, /--filter \.\/packages\/css publish/);
});

test("workspace packages are versioned together", () => {
  assert.match(pkg.version, SEMVER_RE);
  assert.equal(rootPkg.version, pkg.version);
  assert.equal(reactPkg.version, pkg.version);
});

test("CSS package exposes Orbit cockpit extensions", () => {
  for (const [subpath, file] of Object.entries({
    "./components/state-pill": "./src/components/state-pill.css",
    "./components/priority-pill": "./src/components/priority-pill.css",
    "./components/dot": "./src/components/dot.css",
    "./components/card-accordion": "./src/components/card-accordion.css",
    "./components/search-results": "./src/components/search-results.css",
    "./components/lightbox": "./src/components/lightbox.css"
  })) {
    assert.equal(pkg.exports[subpath], file);
    assert.equal(existsSync(join(pkgRoot, file)), true, `${file} should exist`);
  }
});

test("button CSS exposes every variant on data-variant only (no modifier-class aliases)", () => {
  const buttonCss = readCss("src/components/button.css");
  const arcCss = readCss("src/components/button-arc.css");

  assert.match(buttonCss, /button\[data-variant="primary"\]/);
  assert.match(buttonCss, /button\[data-variant="secondary"\]/);
  assert.match(buttonCss, /button\[data-variant="ghost"\]/);
  assert.match(buttonCss, /button\[data-variant="cta"\]/);
  assert.match(buttonCss, /button\[data-variant="command"\]/);
  assert.match(buttonCss, /button\[data-variant="plus"\]/);
  assert.match(buttonCss, /button\[data-disabled\]/);
  assert.match(buttonCss, /button\[aria-disabled="true"\]/);

  // Variant flavors live on data-variant only — the kanban/Orbit modifier-class
  // aliases (.btn-sun, .btn-secondary, .btn-plus, .column-add-btn,
  // .add-card-phantom) are pruned from the package; Orbit owns those locally.
  assert.doesNotMatch(buttonCss, /\.btn-sun\b/);
  assert.doesNotMatch(buttonCss, /\.btn-secondary\b/);
  assert.doesNotMatch(buttonCss, /\.btn-plus\b/);
  assert.doesNotMatch(buttonCss, /\.column-add-btn\b/);
  assert.doesNotMatch(buttonCss, /\.add-card-phantom\b/);

  // Primary press-invert is scoped to the default variant via a zero-specificity
  // :where() exclusion chain (no escape-hatch alias classes).
  assert.match(buttonCss, /button:where\(:not\(\[data-variant\]\)[\s\S]*\):active/);
  assert.match(arcCss, /\[data-variant="primary"\]/);
  assert.match(arcCss, /:not\(\[data-variant="card-accordion"\]\)/);
  assert.match(arcCss, /:not\(\.column-add-btn\)/);
  assert.match(arcCss, /:not\(\.add-card-phantom\)/);
  assert.match(arcCss, /:not\(\[data-no-arc\]\)/);
  assert.match(arcCss, /\[data-disabled\]::after/);
  assert.match(arcCss, /\.is-disabled::after/);
});

test("topbar menu and compact card accordion stay split from default button chrome", () => {
  const menuCss = readCss("src/components/menu-flyout.css");
  const topbarChipCss = readCss("src/components/topbar-chip.css");
  const cardAccordionCss = readCss("src/components/card-accordion.css");

  assert.match(menuCss, /--menu-flyout-item-radius/);
  assert.match(menuCss, /border-radius:\s*var\(--menu-flyout-item-radius/);
  assert.match(menuCss, /\.menu-flyout-item:hover[\s\S]*transform:\s*none/);
  assert.match(menuCss, /\.menu-flyout-item:hover[\s\S]*filter:\s*none/);
  assert.match(topbarChipCss, /\.topbar-chip:hover[\s\S]*transform:\s*none/);
  assert.match(topbarChipCss, /\.topbar-chip:hover[\s\S]*filter:\s*none/);
  assert.match(cardAccordionCss, /button\.card-expand-trigger\[data-variant="card-accordion"\]/);
  assert.match(cardAccordionCss, /button\.card-expand-trigger\[data-variant="card-accordion"\]::after[\s\S]*content:\s*none/);
  assert.match(cardAccordionCss, /min-height:\s*0/);
  assert.match(cardAccordionCss, /card-expand-trigger:not\(\.card-expand-trigger--static\):hover[\s\S]*transform:\s*none/);
  assert.match(cardAccordionCss, /card-expand-trigger:not\(\.card-expand-trigger--static\):hover[\s\S]*filter:\s*none/);
});

test("close and remove icon buttons stay compact instead of inheriting default button chrome", () => {
  const iconControls = [
    ["src/components/create-flyout.css", "create-flyout-close"],
    ["src/components/drawer.css", "drawer-close"],
    ["src/components/modal.css", "modal-close"],
    ["src/components/toast.css", "toast-close"],
    ["src/components/alert.css", "alert-close"],
    ["src/components/tag-input.css", "tag-remove"],
    ["src/components/input.css", "input-search-clear"]
  ];

  for (const [file, className] of iconControls) {
    const css = readCss(file);
    assert.match(css, new RegExp(`button\\.${className}[\\s\\S]*?\\{[\\s\\S]*?min-width:\\s*0`), `${className} should reset default min-width`);
    assert.match(css, new RegExp(`button\\.${className}[\\s\\S]*?\\{[\\s\\S]*?min-height:\\s*0`), `${className} should reset default min-height`);
    assert.match(css, new RegExp(`button\\.${className}[\\s\\S]*?\\{[\\s\\S]*?padding:\\s*0`), `${className} should reset default padding`);
    assert.match(css, new RegExp(`button\\.${className}:hover[\\s\\S]*?\\{[\\s\\S]*?transform:\\s*none`), `${className} should not lift on hover`);
    assert.match(css, new RegExp(`button\\.${className}:hover[\\s\\S]*?\\{[\\s\\S]*?filter:\\s*none`), `${className} should not brighten on hover`);
    assert.match(css, new RegExp(`button\\.${className}::after[\\s\\S]*?content:\\s*none`), `${className} should suppress ARC pseudo-elements`);
  }

  assert.doesNotMatch(readCss("src/components/create-flyout.css"), /button\.create-flyout-close[\s\S]*min-width:\s*2rem/);
});

test("settings drawer forms keep description rhythm and bounded action buttons", () => {
  const drawerCss = readCss("src/components/drawer.css");

  assert.match(drawerCss, /--drawer-action-min-inline-size:\s*12\.5rem/);
  assert.match(drawerCss, /--drawer-action-max-inline-size:\s*18rem/);
  assert.match(drawerCss, /\.drawer \.section > \.description \+ \.field-form/);
  assert.match(drawerCss, /\.drawer \.section > \.description \+ \.deployment-actions/);
  assert.match(drawerCss, /margin-top:\s*0\.85rem/);
  assert.match(drawerCss, /\.drawer \.field-form > button/);
  assert.match(drawerCss, /\.drawer \.deployment-actions > button/);
  assert.match(drawerCss, /\.drawer \.repository-delete-actions > button/);
  assert.match(drawerCss, /min-inline-size:\s*min\(100%, var\(--drawer-action-min-inline-size\)\)/);
  assert.match(drawerCss, /max-inline-size:\s*min\(100%, var\(--drawer-action-max-inline-size\)\)/);
  assert.match(drawerCss, /\.drawer \.deployment-actions,[\s\S]*display:\s*flex/);
});

test("lane, signal, pill, search, and lightbox CSS carry Orbit reusable primitives", () => {
  const indexCss = readCss("src/index.css");
  const laneCss = readCss("src/components/lane.css");
  const listCss = readCss("src/components/list.css");
  const epicAccordionCss = readCss("src/components/epic-accordion.css");
  const cardAccordionCss = readCss("src/components/card-accordion.css");
  const statePillCss = readCss("src/components/state-pill.css");
  const priorityPillCss = readCss("src/components/priority-pill.css");
  const dotCss = readCss("src/components/dot.css");
  const searchCss = readCss("src/components/search-results.css");
  const lightboxCss = readCss("src/components/lightbox.css");

  for (const component of ["state-pill", "priority-pill", "dot", "card-accordion", "search-results", "lightbox"]) {
    assert.match(indexCss, new RegExp(`@import "\\./components/${component}\\.css";`));
  }

  assert.match(laneCss, /\.lane\[data-accent\]/);
  assert.match(laneCss, /\.lane\[data-accent="ai-ready"\]/);
  assert.match(laneCss, /--lane-accent-rgb/);
  assert.match(laneCss, /\.column--ai-ready/);
  assert.match(listCss, /\.list-stars > li\s*\{[\s\S]*padding-inline-start:\s*2\.45rem/);
  assert.match(listCss, /\.list-stars > li::before\s*\{[\s\S]*top:\s*50%[\s\S]*transform:\s*translateY\(-50%\)/);
  assert.match(listCss, /\.list-stars > li::after\s*\{[\s\S]*top:\s*50%[\s\S]*transform:\s*translateY\(-50%\)/);
  assert.doesNotMatch(epicAccordionCss, /epic-accordion-body\s+\.list-stars/);
  assert.match(cardAccordionCss, /\.card-meta/);
  assert.match(cardAccordionCss, /\.card-expand-trigger/);
  assert.match(cardAccordionCss, /button\.card-expand-trigger/);
  assert.match(cardAccordionCss, /box-shadow:\s*none/);
  assert.match(cardAccordionCss, /\.card-expand-trigger--static/);
  assert.match(cardAccordionCss, /\.card-expandable/);
  assert.match(cardAccordionCss, /\.card-type-id/);
  assert.match(cardAccordionCss, /\.card-priority-id/);
  assert.match(cardAccordionCss, /\.card-expand-chevron/);
  assert.doesNotMatch(cardAccordionCss, /epic-accordion/);
  // Pills carry their variants on data-variant; Orbit alias chains
  // (.detail-state-badge/.search-hit-state combos, .detail-priority-badge,
  // .card-priority-id, .priority) are pruned from these files.
  assert.match(statePillCss, /\.state-pill\[data-variant="ai-ready"\]/);
  assert.match(statePillCss, /\.state-pill\[data-variant="in-progress"\]/);
  assert.match(statePillCss, /\.state-pill\[data-variant="review"\]/);
  assert.match(statePillCss, /\.state-pill\[data-variant="done"\]/);
  assert.doesNotMatch(statePillCss, /\.detail-state-badge|\.search-hit-state|\.detail-card-state/);
  assert.match(priorityPillCss, /\.priority-pill\[data-variant="urgent"\]/);
  assert.doesNotMatch(priorityPillCss, /\.detail-priority-badge|\.card-priority-id/);
  // Presence dots: the .dot taxonomy (presence glow + tone-halo live + count
  // bubble). Orbit's .agent-dot/.card-unread-dot/.agents-pill aliases are pruned.
  assert.match(dotCss, /\.dot\s*\{/);
  assert.match(dotCss, /\.dot\[data-live\]/);
  assert.match(dotCss, /\.dot\[data-count\]/);
  assert.doesNotMatch(dotCss, /\.agent-dot|\.card-unread-dot|\.agents-pill|\.activity-dot/);
  assert.match(searchCss, /\.search-hit-title/);
  assert.doesNotMatch(searchCss, /state-pill-ai-ready/);
  assert.match(lightboxCss, /\.attachment-lightbox/);
});
