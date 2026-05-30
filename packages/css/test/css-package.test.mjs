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
    "./components/activity-dot": "./src/components/activity-dot.css",
    "./components/agent-dot": "./src/components/activity-dot.css",
    "./components/unread-dot": "./src/components/activity-dot.css",
    "./components/card-accordion": "./src/components/card-accordion.css",
    "./components/search-results": "./src/components/search-results.css",
    "./components/lightbox": "./src/components/lightbox.css"
  })) {
    assert.equal(pkg.exports[subpath], file);
    assert.equal(existsSync(join(pkgRoot, file)), true, `${file} should exist`);
  }
});

test("button CSS supports explicit primary, secondary, ghost, and disabled ARC controls", () => {
  const buttonCss = readCss("src/components/button.css");
  const arcCss = readCss("src/components/button-arc.css");

  assert.match(buttonCss, /button\[data-variant="primary"\]/);
  assert.match(buttonCss, /button\[data-variant="secondary"\]/);
  assert.match(buttonCss, /button\[data-variant="ghost"\]/);
  assert.match(buttonCss, /button\[data-disabled\]/);
  assert.match(buttonCss, /button\.is-disabled/);
  assert.match(buttonCss, /button\[aria-disabled="true"\]/);
  assert.match(buttonCss, /\.btn-sun\s+\.btn-plus/);
  assert.match(buttonCss, /button\[data-variant="cta"\]\s+\.btn-plus/);
  assert.match(buttonCss, /\.column-add-btn/);
  assert.match(buttonCss, /\.add-card-phantom/);
  assert.match(buttonCss, /button\.column-add-btn[\s\S]*border-radius:\s*var\(--radius-control/);
  assert.match(buttonCss, /button\.add-card-phantom[\s\S]*border-radius:\s*var\(--radius-control/);
  assert.match(buttonCss, /button:not\(\[data-variant\]\)[\s\S]*:not\(\.card-expand-trigger\)/);
  assert.match(buttonCss, /button\[data-variant="cta"\]\s+\.btn-plus[\s\S]*transform:\s*translateY\(-0\.02em\)/);
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

test("lane, signal, pill, search, and lightbox CSS carry Orbit reusable primitives", () => {
  const indexCss = readCss("src/index.css");
  const laneCss = readCss("src/components/lane.css");
  const listCss = readCss("src/components/list.css");
  const epicAccordionCss = readCss("src/components/accordion-epic.css");
  const cardAccordionCss = readCss("src/components/card-accordion.css");
  const statePillCss = readCss("src/components/state-pill.css");
  const priorityPillCss = readCss("src/components/priority-pill.css");
  const activityDotCss = readCss("src/components/activity-dot.css");
  const searchCss = readCss("src/components/search-results.css");
  const lightboxCss = readCss("src/components/lightbox.css");

  for (const component of ["state-pill", "priority-pill", "activity-dot", "card-accordion", "search-results", "lightbox"]) {
    assert.match(indexCss, new RegExp(`@import "\\./components/${component}\\.css";`));
  }

  assert.match(laneCss, /\.lane\[data-accent\]/);
  assert.match(laneCss, /\.lane\[data-accent="ai-ready"\]/);
  assert.match(laneCss, /--lane-accent-rgb/);
  assert.match(laneCss, /\.column--ai-ready/);
  assert.match(listCss, /\.list-stars > li\s*\{[\s\S]*padding-inline-start:\s*2\.45rem/);
  assert.match(listCss, /\.list-stars > li::before\s*\{[\s\S]*top:\s*50%[\s\S]*transform:\s*translateY\(-50%\)/);
  assert.match(listCss, /\.list-stars > li::after\s*\{[\s\S]*top:\s*50%[\s\S]*transform:\s*translateY\(-50%\)/);
  assert.doesNotMatch(epicAccordionCss, /accordion-epic-body\s+\.list-stars/);
  assert.match(cardAccordionCss, /\.card-meta/);
  assert.match(cardAccordionCss, /\.card-expand-trigger/);
  assert.match(cardAccordionCss, /button\.card-expand-trigger/);
  assert.match(cardAccordionCss, /box-shadow:\s*none/);
  assert.match(cardAccordionCss, /\.card-expand-trigger--static/);
  assert.match(cardAccordionCss, /\.card-expandable/);
  assert.match(cardAccordionCss, /\.card-type-id/);
  assert.match(cardAccordionCss, /\.card-priority-id/);
  assert.match(cardAccordionCss, /\.card-expand-chevron/);
  assert.doesNotMatch(cardAccordionCss, /accordion-epic/);
  assert.match(statePillCss, /\.state-pill-ai-ready/);
  assert.match(statePillCss, /\.state-pill-in-progress/);
  assert.match(statePillCss, /\.state-pill-review/);
  assert.match(statePillCss, /\.state-pill-done/);
  assert.match(priorityPillCss, /\.priority-pill-urgent/);
  assert.match(activityDotCss, /\.agent-dot/);
  assert.match(activityDotCss, /\.card-unread-dot\.has-count/);
  assert.match(searchCss, /\.search-hit-title/);
  assert.doesNotMatch(searchCss, /state-pill-ai-ready/);
  assert.match(lightboxCss, /\.attachment-lightbox/);
});
