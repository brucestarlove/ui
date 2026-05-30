import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workspaceRoot = dirname(dirname(pkgRoot));
const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));
const rootPkg = JSON.parse(readFileSync(join(workspaceRoot, "package.json"), "utf8"));

function readCss(relativePath) {
  return readFileSync(join(pkgRoot, relativePath), "utf8");
}

test("CSS package exposes Orbit cockpit extensions as v3.0.2", () => {
  assert.equal(rootPkg.version, "3.0.2");
  assert.equal(pkg.version, "3.0.2");

  for (const [subpath, file] of Object.entries({
    "./components/state-pill": "./src/components/state-pill.css",
    "./components/priority-pill": "./src/components/priority-pill.css",
    "./components/activity-dot": "./src/components/activity-dot.css",
    "./components/agent-dot": "./src/components/activity-dot.css",
    "./components/unread-dot": "./src/components/activity-dot.css",
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
  assert.match(arcCss, /\[data-variant="primary"\]/);
  assert.match(arcCss, /\[data-disabled\]::after/);
  assert.match(arcCss, /\.is-disabled::after/);
});

test("lane, signal, pill, search, and lightbox CSS carry Orbit reusable primitives", () => {
  const indexCss = readCss("src/index.css");
  const laneCss = readCss("src/components/lane.css");
  const statePillCss = readCss("src/components/state-pill.css");
  const priorityPillCss = readCss("src/components/priority-pill.css");
  const activityDotCss = readCss("src/components/activity-dot.css");
  const searchCss = readCss("src/components/search-results.css");
  const lightboxCss = readCss("src/components/lightbox.css");

  for (const component of ["state-pill", "priority-pill", "activity-dot", "search-results", "lightbox"]) {
    assert.match(indexCss, new RegExp(`@import "\\./components/${component}\\.css";`));
  }

  assert.match(laneCss, /\.lane\[data-accent\]/);
  assert.match(laneCss, /\.lane\[data-accent="ai-ready"\]/);
  assert.match(laneCss, /--lane-accent-rgb/);
  assert.match(laneCss, /\.column--ai-ready/);
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
