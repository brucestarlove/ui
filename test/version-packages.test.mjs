import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const workspaceRoot = resolve(import.meta.dirname, "..");
const scriptPath = join(workspaceRoot, "scripts/version-packages.mjs");

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function makeFixture(overrides = {}) {
  const root = mkdtempSync(join(tmpdir(), "starlove-ui-version-"));
  mkdirSync(join(root, "packages/css"), { recursive: true });
  mkdirSync(join(root, "packages/react"), { recursive: true });

  writeJson(join(root, "package.json"), {
    name: "starscape-ui-system-v3",
    version: "1.0.0",
    private: true,
    scripts: {
      release: "pnpm --filter ./packages/css publish --no-git-checks && pnpm --filter ./packages/react publish --no-git-checks"
    },
    ...overrides.rootPackage
  });

  writeJson(join(root, "packages/css/package.json"), {
    name: "@starlove/ui",
    version: "1.0.0",
    exports: {
      "./tokens": "./src/tokens/index.css"
    },
    ...overrides.cssPackage
  });

  writeJson(join(root, "packages/react/package.json"), {
    name: "@starlove/ui-react",
    version: "1.0.0",
    dependencies: {
      "@starlove/ui": "workspace:^"
    },
    ...overrides.reactPackage
  });

  writeJson(join(root, "package-lock.json"), {
    name: "starscape-ui-system-v3",
    version: "1.0.0",
    lockfileVersion: 3,
    packages: {
      "": {
        name: "starscape-ui-system-v3",
        version: "1.0.0",
        private: true
      },
      "packages/css": {
        name: "@starlove/ui",
        version: "1.0.0"
      },
      "packages/react": {
        name: "@starlove/ui-react",
        version: "1.0.0"
      }
    },
    ...overrides.packageLock
  });

  return root;
}

test("version-packages updates versions and npm-safe React dependency ranges", () => {
  const root = makeFixture();
  try {
    const result = spawnSync(process.execPath, [scriptPath, "2.3.4", "--root", root], {
      encoding: "utf8"
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /Updated Starscape UI packages to 2\.3\.4/);

    assert.equal(readJson(join(root, "package.json")).version, "2.3.4");
    assert.equal(readJson(join(root, "package.json")).private, true);
    assert.equal(readJson(join(root, "packages/css/package.json")).version, "2.3.4");

    const reactPackage = readJson(join(root, "packages/react/package.json"));
    assert.equal(reactPackage.version, "2.3.4");
    assert.equal(reactPackage.dependencies["@starlove/ui"], "^2.3.4");

    const lock = readJson(join(root, "package-lock.json"));
    assert.equal(lock.version, "2.3.4");
    assert.equal(lock.packages[""].version, "2.3.4");
    assert.equal(lock.packages[""].private, true);
    assert.equal(lock.packages["packages/css"].version, "2.3.4");
    assert.equal(lock.packages["packages/react"].version, "2.3.4");
    assert.equal(lock.packages["packages/react"].dependencies["@starlove/ui"], "^2.3.4");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("version-packages preserves hand-aligned CSS package formatting", () => {
  const root = makeFixture();
  const cssPackagePath = join(root, "packages/css/package.json");
  writeFileSync(cssPackagePath, `{
  "name": "@starlove/ui",
  "version": "1.0.0",
  "exports": {
    "./tokens":                   "./src/tokens/index.css",
    "./components/state-pill":    "./src/components/state-pill.css"
  }
}\n`);

  try {
    const result = spawnSync(process.execPath, [scriptPath, "2.3.4", "--root", root], {
      encoding: "utf8"
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const text = readFileSync(cssPackagePath, "utf8");
    assert.match(text, /"version": "2\.3\.4"/);
    assert.match(text, /"\.\/tokens":                   "\.\/src\/tokens\/index\.css"/);
    assert.match(text, /"\.\/components\/state-pill":    "\.\/src\/components\/state-pill\.css"/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("version-packages refuses a workspace root named like a publishable package", () => {
  const root = makeFixture({
    rootPackage: {
      name: "@starlove/ui",
      private: true
    },
    packageLock: {
      name: "@starlove/ui",
      packages: {
        "": {
          name: "@starlove/ui",
          version: "1.0.0",
          private: true
        },
        "packages/css": {
          name: "@starlove/ui",
          version: "1.0.0"
        },
        "packages/react": {
          name: "@starlove/ui-react",
          version: "1.0.0"
        }
      }
    }
  });

  try {
    const result = spawnSync(process.execPath, [scriptPath, "2.3.4", "--root", root], {
      encoding: "utf8"
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Workspace root must not be named @starlove\/ui/);
    assert.equal(readJson(join(root, "package.json")).version, "1.0.0");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("version-packages accepts the pnpm run -- argument separator", () => {
  const root = makeFixture();
  try {
    const result = spawnSync(process.execPath, [scriptPath, "--", "2.3.4", "--root", root], {
      encoding: "utf8"
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(readJson(join(root, "packages/css/package.json")).version, "2.3.4");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
