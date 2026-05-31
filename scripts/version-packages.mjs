#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const CSS_PACKAGE_NAME = "@starlove/ui";
const REACT_PACKAGE_NAME = "@starlove/ui-react";
const RELEASE_SCRIPT = "pnpm --filter @starlove/ui-react build && pnpm --filter ./packages/css publish --no-git-checks && pnpm --filter ./packages/react publish --no-git-checks";

function cssDependencyRange(version) {
  return `^${version}`;
}

function usage() {
  return `Usage: pnpm run version:packages -- <version> [--root <repo>]\n\nExample:\n  pnpm run version:packages -- 3.1.2\n`;
}

function parseArgs(argv) {
  let version = null;
  let root = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      continue;
    }
    if (arg === "--root") {
      root = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "-h" || arg === "--help") {
      return { help: true };
    }
    if (!version) {
      version = arg;
      continue;
    }
    throw new Error(`Unexpected argument: ${arg}\n\n${usage()}`);
  }

  if (!version) {
    throw new Error(`Missing version.\n\n${usage()}`);
  }
  // npm versions must be full major.minor.patch — normalize a 2-part "3.2" to
  // "3.2.0" so the shorthand works as people expect.
  if (/^(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    version = `${version}.0`;
  }
  if (!VERSION_RE.test(version)) {
    throw new Error(`Expected a semantic version like 3.1.2, got: ${version}`);
  }

  const scriptDir = dirname(fileURLToPath(import.meta.url));
  return {
    version,
    rootDir: resolve(root ?? join(scriptDir, ".."))
  };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceStringProperty(text, propertyName, value, filePath) {
  const pattern = new RegExp(`("${escapeRegExp(propertyName)}"\\s*:\\s*)"[^"]*"`);
  if (!pattern.test(text)) {
    throw new Error(`${filePath} is missing string property ${propertyName}`);
  }
  return text.replace(pattern, (_match, prefix) => `${prefix}${JSON.stringify(value)}`);
}

function replaceBooleanProperty(text, propertyName, value, filePath) {
  const pattern = new RegExp(`("${escapeRegExp(propertyName)}"\\s*:\\s*)(true|false)`);
  if (!pattern.test(text)) {
    throw new Error(`${filePath} is missing boolean property ${propertyName}`);
  }
  return text.replace(pattern, (_match, prefix) => `${prefix}${value ? "true" : "false"}`);
}

function updateTextFile(path, transform) {
  const original = readFileSync(path, "utf8");
  const next = transform(original);
  if (next !== original) {
    writeFileSync(path, next);
  }
}

function assertPackageName(pkg, expectedName, path) {
  if (pkg.name !== expectedName) {
    throw new Error(`${path} must be named ${expectedName}, got ${pkg.name ?? "<missing>"}`);
  }
}

function updatePackageLock(rootDir, rootPkg, version) {
  const lockPath = join(rootDir, "package-lock.json");
  if (!existsSync(lockPath)) {
    return false;
  }

  const cssRange = cssDependencyRange(version);

  const lock = readJson(lockPath);
  lock.name = rootPkg.name;
  lock.version = version;

  if (lock.packages?.[""]) {
    lock.packages[""].name = rootPkg.name;
    lock.packages[""].version = version;
    lock.packages[""].private = true;
  }
  if (lock.packages?.["packages/css"]) {
    lock.packages["packages/css"].name = CSS_PACKAGE_NAME;
    lock.packages["packages/css"].version = version;
  }
  if (lock.packages?.["packages/react"]) {
    const reactLock = lock.packages["packages/react"];
    reactLock.name = REACT_PACKAGE_NAME;
    reactLock.version = version;
    reactLock.dependencies = {
      ...(reactLock.dependencies ?? {}),
      [CSS_PACKAGE_NAME]: cssRange
    };
  }

  writeJson(lockPath, lock);
  return true;
}

export function bumpPackageVersions({ rootDir, version }) {
  const rootPackagePath = join(rootDir, "package.json");
  const cssPackagePath = join(rootDir, "packages/css/package.json");
  const reactPackagePath = join(rootDir, "packages/react/package.json");

  const rootPkg = readJson(rootPackagePath);
  const cssPkg = readJson(cssPackagePath);
  const reactPkg = readJson(reactPackagePath);

  if (rootPkg.name === CSS_PACKAGE_NAME) {
    throw new Error(`Workspace root must not be named ${CSS_PACKAGE_NAME}; that name belongs to packages/css.`);
  }
  if (rootPkg.name === REACT_PACKAGE_NAME) {
    throw new Error(`Workspace root must not be named ${REACT_PACKAGE_NAME}; that name belongs to packages/react.`);
  }

  assertPackageName(cssPkg, CSS_PACKAGE_NAME, "packages/css/package.json");
  assertPackageName(reactPkg, REACT_PACKAGE_NAME, "packages/react/package.json");

  updateTextFile(rootPackagePath, (text) => {
    let next = replaceStringProperty(text, "version", version, "package.json");
    next = replaceBooleanProperty(next, "private", true, "package.json");
    next = replaceStringProperty(next, "release", RELEASE_SCRIPT, "package.json");
    return next;
  });
  updateTextFile(cssPackagePath, (text) => replaceStringProperty(text, "version", version, "packages/css/package.json"));
  updateTextFile(reactPackagePath, (text) => {
    let next = replaceStringProperty(text, "version", version, "packages/react/package.json");
    next = replaceStringProperty(next, CSS_PACKAGE_NAME, cssDependencyRange(version), "packages/react/package.json");
    return next;
  });

  const updatedLock = updatePackageLock(rootDir, { ...rootPkg, version, private: true }, version);

  return {
    version,
    updated: [
      "package.json",
      "packages/css/package.json",
      "packages/react/package.json",
      ...(updatedLock ? ["package-lock.json"] : [])
    ]
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const result = bumpPackageVersions(args);
  console.log(`Updated Starscape UI packages to ${result.version}:`);
  for (const path of result.updated) {
    console.log(`- ${path}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
