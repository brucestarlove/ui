import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workspaceRoot = dirname(dirname(pkgRoot));
const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));
const rootPkg = JSON.parse(readFileSync(join(workspaceRoot, "package.json"), "utf8"));
const reactPkg = JSON.parse(readFileSync(join(workspaceRoot, "packages/react/package.json"), "utf8"));
const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

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

test("every exports subpath resolves to a file that exists", () => {
  for (const [subpath, target] of Object.entries(pkg.exports)) {
    if (subpath.endsWith("*")) continue; // wildcard glob, nothing to stat
    const file = typeof target === "string" ? target : target?.default ?? target?.import;
    if (!file) continue;
    assert.equal(existsSync(join(pkgRoot, file)), true, `${subpath} -> ${file} should exist`);
  }
});

test("default CSS does not force package-relative cursor asset requests", () => {
  for (const file of cssFiles(join(pkgRoot, "src"))) {
    if (file.includes("/src/cursors/")) continue;

    const css = readFileSync(file, "utf8");
    assert.doesNotMatch(css, /url\(['"]?\.\.\/cursors\//, file);
  }

  const resetCss = readFileSync(join(pkgRoot, "src/base/reset.css"), "utf8");
  assert.match(resetCss, /cursor: var\(--sl-cursor-arrow, default\);/);
  assert.match(resetCss, /cursor: var\(--sl-cursor-link, pointer\);/);
  assert.match(resetCss, /cursor: var\(--sl-cursor-select, text\);/);
});

function cssFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) return cssFiles(path);
    if (entry.endsWith(".css")) return [path];

    return [];
  });
}
