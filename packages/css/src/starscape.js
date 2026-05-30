/**
 * Starscape v3 — JS engine for the dark-mode background system.
 *
 * Mounts a `.grain > .milky-way` skeleton if not present, builds 7 signature
 * stars at random positions, runs a 3-layer parallax canvas starfield, and
 * spawns shooting stars every 14–42 seconds. Sleeps in light mode and on
 * `prefers-reduced-motion: reduce`.
 *
 * Port of public/js/starscape.js from minimal-agent-board, with added:
 *   - SSR safety
 *   - Idempotency (calling twice returns the same handle)
 *   - Full teardown on stop()
 *   - Auto-sync via MutationObserver on <html data-theme>
 *   - Auto-sync via matchMedia for prefers-color-scheme & reduced-motion
 *
 *   import { startStarscape } from '@starlove/ui/starscape';
 *   const handle = startStarscape();
 *   // …
 *   handle.stop();   // teardown when you're done
 */

let activeHandle = null;

/**
 * @typedef {Object} StarscapeOptions
 * @property {Element|string} [mountTo]      Element (or selector) to attach to. Defaults to existing `.grain` or document.body.
 * @property {number}  [signatureStars=7]    Number of signature pinpoint stars.
 * @property {boolean} [canvasStars=true]    Whether to run the canvas starfield.
 * @property {boolean} [meteors=true]        Whether to spawn shooting stars.
 * @property {boolean} [parallax=true]       Whether stars track mouse movement.
 * @property {number}  [meteorMinDelay=14000] Minimum ms between meteors.
 * @property {number}  [meteorMaxDelay=42000] Maximum ms between meteors.
 * @property {number}  [densityScale=1]      Multiplier for star count.
 */

/**
 * @typedef {Object} StarscapeHandle
 * @property {() => void} sync   Re-evaluate theme + reduced-motion (idempotent).
 * @property {() => void} stop   Tear down DOM, listeners, RAF, and timers.
 */

/**
 * Mount the Starscape dark-mode background system.
 *
 * @param {StarscapeOptions} [options]
 * @returns {StarscapeHandle}
 */
export function startStarscape(options = {}) {
  // SSR / non-DOM environments: return a no-op handle.
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { sync: noop, stop: noop };
  }

  // Idempotency — if an instance is already running, return its handle so
  // double-mounting is harmless.
  if (activeHandle) return activeHandle;

  const opts = {
    mountTo: undefined,
    signatureStars: 7,
    canvasStars: true,
    meteors: true,
    parallax: true,
    meteorMinDelay: 14000,
    meteorMaxDelay: 42000,
    densityScale: 1,
    ...options,
  };

  // ---- Resolve / create the .grain mount point ----
  let grain = resolveMount(opts.mountTo);
  let createdGrain = false;
  if (!grain) {
    grain = document.createElement('div');
    grain.className = 'grain';
    grain.setAttribute('aria-hidden', 'true');
    const milky = document.createElement('div');
    milky.className = 'milky-way';
    milky.setAttribute('aria-hidden', 'true');
    grain.appendChild(milky);
    document.body.insertBefore(grain, document.body.firstChild);
    createdGrain = true;
  } else if (!grain.querySelector('.milky-way')) {
    const milky = document.createElement('div');
    milky.className = 'milky-way';
    milky.setAttribute('aria-hidden', 'true');
    grain.insertBefore(milky, grain.firstChild);
  }

  // ---- Signature stars ----
  buildSignatureStars(grain, opts.signatureStars);

  // ---- Canvas starfield ----
  let canvas = null;
  let ctx = null;
  let stars = [];
  let width = 0;
  let height = 0;
  let rafId = 0;
  let running = false;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  if (opts.canvasStars) {
    canvas = document.createElement('canvas');
    canvas.className = 'starfield-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    ctx = canvas.getContext('2d');
    const milky = grain.querySelector('.milky-way');
    if (milky && milky.nextSibling) {
      grain.insertBefore(canvas, milky.nextSibling);
    } else if (milky) {
      grain.appendChild(canvas);
    } else {
      grain.insertBefore(canvas, grain.firstChild);
    }
  }

  function resize() {
    if (!canvas || !ctx) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * DPR);
    canvas.height = Math.round(height * DPR);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildCanvasStars();
  }

  function buildCanvasStars() {
    if (!ctx) return;
    const density = (width * height) / (1440 * 900) * opts.densityScale;
    const layers = [
      { count: Math.round(320 * density), depth: 0.12, sizes: [[1, 0.9], [1.4, 0.1]],            glow: 0   },
      { count: Math.round(160 * density), depth: 0.30, sizes: [[1, 0.5], [1.6, 0.4], [2.4, 0.1]], glow: 1.8 },
      { count: Math.round(44 * density),  depth: 0.58, sizes: [[1.8, 0.5], [2.6, 0.38], [3.6, 0.12]], glow: 2.4 },
    ];
    const rng = mulberry32(0xc0ffee);
    stars = [];
    for (const layer of layers) {
      for (let i = 0; i < layer.count; i++) {
        const size = pickWeighted(rng(), layer.sizes);
        stars.push({
          x: rng() * width,
          y: rng() * height,
          size,
          depth: layer.depth,
          glow: size >= 2 ? layer.glow : 0,
          rgb: pickStarColor(rng()),
          period: 2.2 + rng() * 5.4,
          phase: rng() * Math.PI * 2,
          amp: 0.25 + rng() * 0.5,
          baseAlpha: size < 1.5 ? 0.45 + rng() * 0.28 : 0.55 + rng() * 0.22,
        });
      }
    }
  }

  function frame(t) {
    if (!ctx) return;
    if (opts.parallax) {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
    } else {
      mouse.x = 0; mouse.y = 0;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    const time = t / 1000;
    const parallaxPx = 70;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const pulse = 0.5 + 0.5 * Math.sin(time * ((2 * Math.PI) / s.period) + s.phase);
      const alpha = s.baseAlpha * (1 - s.amp + s.amp * pulse);
      const px = s.x - mouse.x * s.depth * parallaxPx;
      const py = s.y - mouse.y * s.depth * parallaxPx;
      const [r, g, b] = s.rgb;

      if (s.glow > 0) {
        const radius = s.size * s.glow;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.85})`);
        grad.addColorStop(0.35, `rgba(${r},${g},${b},${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, s.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const half = s.size / 2;
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fillRect(px - half, py - half, s.size, s.size);
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    if (running) rafId = requestAnimationFrame(frame);
  }

  function drawStaticFrame() {
    if (!ctx) return;
    if (!stars.length) buildCanvasStars();
    frame(0);
  }

  function start() {
    if (!ctx || running) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }

  function stopRaf() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  // ---- Theme & reduced-motion sync ----

  function isDarkMode() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark') return true;
    if (explicit === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function isReducedMotion() {
    // Three resolution states, mirroring useTheme:
    //   1. data-motion="reduce" on <html> → always reduce
    //   2. data-motion="full"   on <html> → ignore OS reduce
    //   3. otherwise → defer to OS prefers-reduced-motion
    const explicit = document.documentElement.getAttribute('data-motion');
    if (explicit === 'reduce') return true;
    if (explicit === 'full') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function sync() {
    const dark = isDarkMode();
    const reduced = isReducedMotion();
    if (!dark) {
      stopRaf();
      if (ctx) ctx.clearRect(0, 0, width, height);
      return;
    }
    if (!stars.length) resize();
    if (reduced || document.hidden) {
      stopRaf();
      drawStaticFrame();
    } else {
      start();
    }
  }

  // ---- Mouse / window listeners ----

  function onPointerMove(e) {
    if (!opts.parallax || !width || !height) return;
    mouse.tx = e.clientX / width - 0.5;
    mouse.ty = e.clientY / height - 0.5;
  }

  function onResize() {
    resize();
    sync();
  }

  // Watch <html data-theme> and <html data-motion> attribute changes so
  // theme/motion toggles auto-sync without the consumer wiring up a callback.
  const themeObserver = new MutationObserver(() => sync());
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-motion'],
  });

  const reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colorSchemeMql = window.matchMedia('(prefers-color-scheme: dark)');
  reducedMotionMql.addEventListener('change', sync);
  colorSchemeMql.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // ---- Meteors ----

  let meteorTimer = 0;

  function scheduleMeteor() {
    if (!opts.meteors) return;
    const range = opts.meteorMaxDelay - opts.meteorMinDelay;
    const delay = opts.meteorMinDelay + Math.random() * range;
    meteorTimer = window.setTimeout(spawnMeteor, delay);
  }

  function spawnMeteor() {
    meteorTimer = 0;
    if (!opts.meteors) return;
    if (!isDarkMode() || isReducedMotion() || document.hidden) {
      scheduleMeteor();
      return;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const startX = Math.random() * vw * 0.6;
    const startY = Math.random() * vh * 0.55;
    const distance = 380 + Math.random() * 520;
    const angleDeg = 18 + Math.random() * 26;
    const rad = (angleDeg * Math.PI) / 180;
    const endX = startX + Math.cos(rad) * distance;
    const endY = startY + Math.sin(rad) * distance;

    const m = document.createElement('div');
    m.className = 'meteor';
    m.setAttribute('aria-hidden', 'true');
    m.style.setProperty('--from-x', startX + 'px');
    m.style.setProperty('--from-y', startY + 'px');
    m.style.setProperty('--to-x', endX + 'px');
    m.style.setProperty('--to-y', endY + 'px');
    m.style.setProperty('--angle', angleDeg + 'deg');
    grain.appendChild(m);
    m.addEventListener('animationend', () => m.remove(), { once: true });

    scheduleMeteor();
  }

  // ---- Boot ----

  if (canvas) resize();
  sync();
  scheduleMeteor();

  // ---- Teardown ----

  function stop() {
    stopRaf();
    if (meteorTimer) {
      window.clearTimeout(meteorTimer);
      meteorTimer = 0;
    }
    themeObserver.disconnect();
    reducedMotionMql.removeEventListener('change', sync);
    colorSchemeMql.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointerMove);

    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    grain.querySelectorAll('.signature-star').forEach((el) => el.remove());
    grain.querySelectorAll('.meteor').forEach((el) => el.remove());

    if (createdGrain && grain.parentNode) {
      grain.parentNode.removeChild(grain);
    }

    activeHandle = null;
  }

  activeHandle = { sync, stop };
  return activeHandle;
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function noop() {}

function resolveMount(target) {
  if (!target) {
    return document.querySelector('.grain');
  }
  if (typeof target === 'string') return document.querySelector(target);
  if (target instanceof Element) return target;
  return null;
}

function buildSignatureStars(grain, count) {
  // Clear any previously-injected stars.
  grain.querySelectorAll('.signature-star').forEach((el) => el.remove());
  const rng = mulberry32(0x5ca1e5);
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'signature-star';
    star.setAttribute('aria-hidden', 'true');
    star.style.left = (6 + rng() * 88).toFixed(2) + '%';
    star.style.top = (8 + rng() * 78).toFixed(2) + '%';
    star.style.animationDelay = (-rng() * 4.8).toFixed(2) + 's';
    grain.appendChild(star);
  }
}

function pickStarColor(r) {
  if (r < 0.80) return [255, 255, 255];     // 80% white
  if (r < 0.93) return [255, 222, 186];     // 13% warm peach
  return [195, 218, 255];                    // 7% cool blue
}

function pickWeighted(r, table) {
  let acc = 0;
  for (const [value, weight] of table) {
    acc += weight;
    if (r <= acc) return value;
  }
  return table[table.length - 1][0];
}

// Deterministic PRNG so star placement is stable across reloads.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
