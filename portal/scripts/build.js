#!/usr/bin/env node
// ============================================
// MaestroAC Build Pipeline — esbuild
// Creates optimized dist/ from source files
// Non-destructive: source files are never modified
// ============================================

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// ── Configuration ──────────────────────────────────────────────

// Tier 0: Synchronous scripts (must execute in order, before app shell)
const TIER0_SCRIPTS = [
  'js/i18n.js',
  'js/error-tracking.js',
  'js/logger.js',
  'js/utils.js',
  'js/haptics.js',
  'js/config.js',
  'js/lazy-loader.js',
  'js/supabase-init.js',
];

// Tier 1: Deferred scripts (core app shell, execute after parse)
const TIER1_SCRIPTS = [
  'js/legibility.js',
  'js/auth-manager.js',
  'js/device-guard.js',
  'js/supabase-health.js',
  // 'js/launcher.js', // REMOVED — launcher overlay eliminated
  'js/profile.js',
  'js/video-lessons.js',
  'js/levels.js',
  'js/auth.js',
  'js/navigation.js',
  'js/global-search.js',
  'js/onboarding-gate.js',
  'js/weather-widget.js',
  'js/quiz.js',
  'js/activity-log.js',
  'js/audit-log.js',
  'js/certificates.js',
  'js/hvac-feed.js',
  'js/web-vitals.js',
  'js/analytics-tracker.js',
  'js/notifications.js',
  'js/welcome-back.js',
  'js/inline-late.js',
];

// Lazy-loaded scripts (individually minified, loaded by MaestroLoader)
const LAZY_JS_DIRS = ['js/admin', 'js/crm'];
const LAZY_JS_ROOT = [
  'js/users-data-client.js',
  'js/inline-early.js',
  'js/desafio-questions-c1.js',
  'js/desafio.js',
  'js/ai-maestro-mario.js',
  'js/tech-chat.js',
  'js/live-streaming.js',
  'js/radio-podcast.js',
  'js/acvolt-certification.js',
  'js/video-tutoriales.js',
  'js/student-exams.js',
  'js/student-grades.js',
  'js/student-upload.js',
  'js/progress-dashboard.js',
  'js/push-notifications.js',
  'js/push-client.js',
  'js/soporte-tecnico.js',
  'js/herramientas-pt-data.js',
  'js/herramientas.js',
  'js/herramientas-heating.js',
  'js/commercial-hvac.js',
  'js/manometer-hvac.js',
  'js/anemometer-hvac.js',
  'js/parts-finder-data.js',
  'js/parts-finder.js',
  'js/hvac-pdf-report.js',
  // Certification study modules (lazy-loaded on demand)
  'js/epa608-questions.js',
  'js/epa608-study.js',
  'js/osha-questions.js',
  'js/osha-study.js',
  'js/a2l-questions.js',
  'js/a2l-study.js',
  'js/nate-questions.js',
  'js/nate-study.js',
  'js/calefaccion-questions.js',
  'js/calefaccion-study.js',
  'js/refri-questions.js',
  'js/refri-study.js',
  'js/et-questions.js',
  'js/et-study.js',
  'js/nate-senior-questions.js',
  'js/nate-senior-study.js',
  'js/study-voice-chat.js',
  'js/gamification.js',
  'js/social-system.js',
  'js/job-board.js',
  'js/marketplace.js',
  'js/pre-departure-checklist.js',
  'js/duct-designer.js',
  'js/maestro-bender.js',
  'js/maestro-pro.js',
  'js/mp-calcs/math.js',
  'js/mp-calcs/math2.js',
  'js/mp-calcs/elec.js',
  'js/mp-calcs/elec2.js',
  'js/mp-calcs/hvac.js',
  'js/mp-calcs/hvac2.js',
  'js/mp-calcs/refrig.js',
  'js/mp-calcs/refrig2.js',
  'js/mp-calcs/nec.js',
  'js/mp-calcs/nec2.js',
  'js/mp-calcs/safe.js',
  'js/mp-calcs/safe2.js',
  'js/mp-calcs/mechanical.js',
  'js/mp-calcs/energy-code.js',
  'js/contractor-zone/questions-law.js',
  'js/contractor-zone/questions-c20.js',
  'js/contractor-zone/questions-c38.js',
  'js/contractor-zone/questions-c10.js',
  'js/contractor-zone/bloque-1.js',
  'js/contractor-zone/bloque-2.js',
  'js/contractor-zone/bloque-3.js',
  'js/contractor-zone/bloque-4.js',
  'js/contractor-zone/bloque-5.js',
  'js/contractor-zone/bloque-6.js',
  'js/contractor-zone/bloque-7.js',
  'js/contractor-zone/bloque-8.js',
  'js/contractor-zone/bloque-9.js',
  'js/contractor-zone/bloque-10.js',
  'js/contractor-zone/bloque-11.js',
  'js/contractor-zone/bloque-12.js',
  'js/contractor-zone/bloque-13.js',
  'js/contractor-zone/cslb-kit.js',
  'js/contractor-zone/templates.js',
  'js/contractor-zone/contractor-zone.js',
  'js/jornal-pro.js',
  'js/chaka-tips.js',
  'js/study-together.js',
  'js/study-activity.js',
  'js/ble-manager.js',
  'js/onboarding-tour.js',
  'js/iap-bridge.js',
  'js/app-tour.js',
];

// Root-level data JS files (loaded by MaestroLoader for admin)
const ROOT_DATA_JS = [
  'registered-students-data.js',
  'whatsapp-audit-data.js',
  'invoice2go-audit-data.js',
  'failed-payments-data.js',
  'fixes-workbooks-exams-calendar.js',
  'pipeline.js',
  'questions.js',
  'zoom.js',
];

// CSS files
const CSS_FILES = [
  'css/main.css',
  'css/theme-wow.css',
  'css/components.css',
  'css/launcher.css',
  'css/ai-maestro.css',
  'css/premium-tools.css',
];

const ROOT_CSS = [
  'pipeline.css',
  'styles.css',
  'styles-crm-clean.css',
];

// Static assets to copy (globs relative to ROOT)
const STATIC_PATTERNS = [
  '*.png', '*.jpg', '*.ico',
  'manifest.json', 'assetlinks.json', 'robots.txt', 'sitemap.xml',
  '_headers', '_redirects',
  'app.html', 'verify.html', 'privacy.html', 'privacy-policy.html', 'terms.html',
  'browserconfig.xml',
];

const STATIC_DIRS = [
  '.well-known',
  'cloudflare-fallback',
  'js/vendor',
];

// ── Utility Functions ──────────────────────────────────────────

function hash(content) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDist() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  ensureDir(DIST);
}

function readFile(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.warn(`  [WARN] File not found: ${rel}`);
    return null;
  }
  return fs.readFileSync(abs, 'utf8');
}

function copyFile(rel) {
  const src = path.join(ROOT, rel);
  const dest = path.join(DIST, rel);
  if (!fs.existsSync(src)) return false;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
}

function copyDir(rel) {
  const src = path.join(ROOT, rel);
  const dest = path.join(DIST, rel);
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(path.join(rel, entry.name));
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function minifyJS(code, filename) {
  const result = await esbuild.transform(code, {
    minify: true,
    target: 'es2018',
    sourcefile: filename,
  });
  return result.code;
}

async function minifyCSS(code, filename) {
  const result = await esbuild.transform(code, {
    minify: true,
    loader: 'css',
    sourcefile: filename,
  });
  return result.code;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
}

// ── Build Steps ────────────────────────────────────────────────

async function buildTierBundle(scripts, bundleName) {
  const parts = [];
  for (const rel of scripts) {
    const code = readFile(rel);
    if (code === null) continue;
    // Wrap each file in an IIFE-like separator to prevent variable leakage issues
    // But since these are global scripts that declare globals, we just concatenate with a separator
    parts.push(`\n/* === ${rel} === */\n${code}`);
  }
  const concatenated = parts.join('\n;\n');
  const minified = await minifyJS(concatenated, bundleName);
  const h = hash(minified);

  const outPath = path.join(DIST, 'js', bundleName);
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, minified);

  return {
    filename: `js/${bundleName}`,
    hash: h,
    originalSize: Buffer.byteLength(concatenated),
    minifiedSize: Buffer.byteLength(minified),
  };
}

async function buildLazyScripts() {
  const results = [];

  // Individual JS files from js/ root
  for (const rel of LAZY_JS_ROOT) {
    const code = readFile(rel);
    if (code === null) continue;
    const minified = await minifyJS(code, rel);
    const outPath = path.join(DIST, rel);
    ensureDir(path.dirname(outPath));
    fs.writeFileSync(outPath, minified);
    results.push({
      file: rel,
      before: Buffer.byteLength(code),
      after: Buffer.byteLength(minified),
    });
  }

  // Admin + CRM directories
  for (const dir of LAZY_JS_DIRS) {
    const absDir = path.join(ROOT, dir);
    if (!fs.existsSync(absDir)) continue;
    const files = fs.readdirSync(absDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const rel = `${dir}/${file}`;
      const code = readFile(rel);
      if (code === null) continue;
      const minified = await minifyJS(code, rel);
      const outPath = path.join(DIST, rel);
      ensureDir(path.dirname(outPath));
      fs.writeFileSync(outPath, minified);
      results.push({
        file: rel,
        before: Buffer.byteLength(code),
        after: Buffer.byteLength(minified),
      });
    }
  }

  // Root-level data JS
  for (const file of ROOT_DATA_JS) {
    const code = readFile(file);
    if (code === null) continue;
    const minified = await minifyJS(code, file);
    const outPath = path.join(DIST, file);
    fs.writeFileSync(outPath, minified);
    results.push({
      file: file,
      before: Buffer.byteLength(code),
      after: Buffer.byteLength(minified),
    });
  }

  return results;
}

async function buildCSS() {
  const results = [];
  const hashes = {};

  for (const rel of CSS_FILES) {
    const code = readFile(rel);
    if (code === null) continue;
    const minified = await minifyCSS(code, rel);
    const outPath = path.join(DIST, rel);
    ensureDir(path.dirname(outPath));
    fs.writeFileSync(outPath, minified);
    hashes[rel] = hash(minified);
    results.push({
      file: rel,
      before: Buffer.byteLength(code),
      after: Buffer.byteLength(minified),
      hash: hashes[rel],
    });
  }

  for (const file of ROOT_CSS) {
    const code = readFile(file);
    if (code === null) continue;
    const minified = await minifyCSS(code, file);
    const outPath = path.join(DIST, file);
    fs.writeFileSync(outPath, minified);
    results.push({
      file: file,
      before: Buffer.byteLength(code),
      after: Buffer.byteLength(minified),
    });
  }

  return { results, hashes };
}

async function buildServiceWorker() {
  const code = readFile('sw.js');
  if (code === null) return null;
  const minified = await minifyJS(code, 'sw.js');
  fs.writeFileSync(path.join(DIST, 'sw.js'), minified);
  return {
    before: Buffer.byteLength(code),
    after: Buffer.byteLength(minified),
  };
}

function processHTML(tier0Info, tier1Info, cssHashes) {
  let html = readFile('index.html');
  if (html === null) throw new Error('index.html not found!');

  // Normalize line endings (Windows CRLF → LF) so regexes match
  html = html.replace(/\r\n/g, '\n');

  // ── Replace Tier 0 script tags with single bundle ──
  // Match the block of 6 synchronous script tags
  const tier0Pattern = [
    '<script src="js/i18n.js',
    '<script src="js/error-tracking.js',
    '<script src="js/logger.js',
    '<script src="js/utils.js',
    '<script src="js/config.js',
    '<script src="js/lazy-loader.js',
    '<script src="js/supabase-init.js',
  ];

  // Find the first Tier 0 script and replace all 6 with one bundled script
  const tier0Regex = /<!-- Tier 0: Synchronous \(must load first\) -->\n<script src="js\/i18n\.js[^"]*"><\/script>\n<script src="js\/error-tracking\.js[^"]*"><\/script>\n<script src="js\/logger\.js[^"]*"><\/script>\n<script src="js\/utils\.js[^"]*"><\/script>\n<script src="js\/config\.js[^"]*"><\/script>\n<script src="js\/lazy-loader\.js[^"]*"><\/script>\n<script src="js\/supabase-init\.js[^"]*"><\/script>/;

  html = html.replace(tier0Regex,
    `<!-- Tier 0: Core bundle (minified) -->\n<script src="${tier0Info.filename}?v=${tier0Info.hash}"></script>`
  );

  // ── Replace Tier 1 defer script tags with single bundle ──
  // These are scattered but we can replace them one by one and add the bundle at the first one's position
  const tier1Files = TIER1_SCRIPTS.map(f => path.basename(f, '.js'));
  let firstTier1Replaced = false;

  for (const script of TIER1_SCRIPTS) {
    const basename = path.basename(script);
    // Match the script tag (with any version query)
    const regex = new RegExp(`<script defer src="${script.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*"><\\/script>\\n?`);
    if (!firstTier1Replaced && regex.test(html)) {
      html = html.replace(regex, `<script defer src="js/tier1.bundle.js?v=${tier1Info.hash}"></script>\n`);
      firstTier1Replaced = true;
    } else {
      html = html.replace(regex, '');
    }
  }

  // ── Update CSS references with content hashes ──
  for (const [cssFile, h] of Object.entries(cssHashes)) {
    const basename = cssFile.replace(/\//g, '\\/').replace(/\./g, '\\.');
    const regex = new RegExp(`(${basename})\\?v=\\d+`, 'g');
    html = html.replace(regex, `$1?v=${h}`);
  }

  // ── Update prefetch hints: remove for scripts now in bundles ──
  // Keep prefetch for lazy-loaded scripts only
  // desafio-questions-c1.js, desafio.js are still lazy — keep them
  // student-exams.js, progress-dashboard.js are still lazy — keep them

  // ── Write processed HTML ──
  fs.writeFileSync(path.join(DIST, 'index.html'), html);

  return Buffer.byteLength(html);
}

function copyStaticAssets() {
  let count = 0;

  // Copy files matching patterns
  const rootFiles = fs.readdirSync(ROOT);
  for (const file of rootFiles) {
    const abs = path.join(ROOT, file);
    if (!fs.statSync(abs).isFile()) continue;

    const shouldCopy = STATIC_PATTERNS.some(pattern => {
      if (pattern.startsWith('*.')) {
        return file.endsWith(pattern.slice(1));
      }
      return file === pattern;
    });

    if (shouldCopy) {
      fs.copyFileSync(abs, path.join(DIST, file));
      count++;
    }
  }

  // Copy static directories
  for (const dir of STATIC_DIRS) {
    if (fs.existsSync(path.join(ROOT, dir))) {
      copyDir(dir);
      count++;
    }
  }

  // Copy supabase directory (Edge Functions aren't part of the frontend build,
  // but keep it for reference)
  // Note: supabase functions are deployed separately via CLI, not via Netlify

  return count;
}

// ── Backward-compatible fallback: individual scripts for old cached HTML ──
// Students with cached (pre-bundle) HTML try to load individual files like
// js/config.js, js/navigation.js, etc. Without these, the server returns
// index.html (SPA fallback) which breaks the app.
async function copyIndividualFallbacks() {
  const allIndividual = [...TIER0_SCRIPTS, ...TIER1_SCRIPTS];
  let count = 0;
  for (const rel of allIndividual) {
    const code = readFile(rel);
    if (code === null) continue;
    const outPath = path.join(DIST, rel);
    if (fs.existsSync(outPath)) continue; // already there (e.g. from lazy build)
    ensureDir(path.dirname(outPath));
    const minified = await minifyJS(code, rel);
    fs.writeFileSync(outPath, minified);
    count++;
  }
  return count;
}

// ── Main Build ─────────────────────────────────────────────────

async function build() {
  const startTime = Date.now();
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   MaestroAC Build Pipeline — esbuild        ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  // Step 1: Clean dist/
  console.log('[1/8] Cleaning dist/...');
  cleanDist();

  // Step 2: Build Tier 0 bundle
  console.log('[2/8] Building Tier 0 bundle (sync core)...');
  const tier0 = await buildTierBundle(TIER0_SCRIPTS, 'tier0.bundle.js');
  console.log(`  ${formatSize(tier0.originalSize)} → ${formatSize(tier0.minifiedSize)} (${Math.round((1 - tier0.minifiedSize / tier0.originalSize) * 100)}% reduction)`);

  // Step 3: Build Tier 1 bundle
  console.log('[3/8] Building Tier 1 bundle (deferred core)...');
  const tier1 = await buildTierBundle(TIER1_SCRIPTS, 'tier1.bundle.js');
  console.log(`  ${formatSize(tier1.originalSize)} → ${formatSize(tier1.minifiedSize)} (${Math.round((1 - tier1.minifiedSize / tier1.originalSize) * 100)}% reduction)`);

  // Step 4: Minify lazy-loaded scripts
  console.log('[4/8] Minifying lazy-loaded scripts...');
  const lazyResults = await buildLazyScripts();
  const lazyBefore = lazyResults.reduce((s, r) => s + r.before, 0);
  const lazyAfter = lazyResults.reduce((s, r) => s + r.after, 0);
  console.log(`  ${lazyResults.length} files: ${formatSize(lazyBefore)} → ${formatSize(lazyAfter)} (${Math.round((1 - lazyAfter / lazyBefore) * 100)}% reduction)`);

  // Step 5: Minify CSS
  console.log('[5/8] Minifying CSS...');
  const { results: cssResults, hashes: cssHashes } = await buildCSS();
  const cssBefore = cssResults.reduce((s, r) => s + r.before, 0);
  const cssAfter = cssResults.reduce((s, r) => s + r.after, 0);
  console.log(`  ${cssResults.length} files: ${formatSize(cssBefore)} → ${formatSize(cssAfter)} (${Math.round((1 - cssAfter / cssBefore) * 100)}% reduction)`);

  // Step 6: Build service worker
  console.log('[6/8] Minifying service worker...');
  const swResult = await buildServiceWorker();
  if (swResult) {
    console.log(`  ${formatSize(swResult.before)} → ${formatSize(swResult.after)}`);
  }

  // Step 7: Process HTML + copy static assets
  console.log('[7/8] Processing HTML + copying static assets...');
  const htmlSize = processHTML(tier0, tier1, cssHashes);
  const staticCount = copyStaticAssets();
  console.log(`  index.html: ${formatSize(htmlSize)}`);
  console.log(`  ${staticCount} static assets copied`);

  // Step 8: Copy individual script fallbacks (for old cached HTML)
  console.log('[8/8] Copying individual script fallbacks (backward compat)...');
  const fallbackCount = await copyIndividualFallbacks();
  console.log(`  ${fallbackCount} fallback scripts copied`);

  // ── Summary ──
  const totalBefore = tier0.originalSize + tier1.originalSize + lazyBefore + cssBefore + (swResult ? swResult.before : 0);
  const totalAfter = tier0.minifiedSize + tier1.minifiedSize + lazyAfter + cssAfter + (swResult ? swResult.after : 0);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('  BUILD COMPLETE');
  console.log('═══════════════════════════════════════════════');
  console.log(`  JS + CSS: ${formatSize(totalBefore)} → ${formatSize(totalAfter)} (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`);
  console.log(`  Output:   ${DIST}`);
  console.log(`  Time:     ${elapsed}s`);
  console.log('');
  console.log('  Bundles:');
  console.log(`    js/tier0.bundle.js  ${formatSize(tier0.minifiedSize)}  (${TIER0_SCRIPTS.length} files)`);
  console.log(`    js/tier1.bundle.js  ${formatSize(tier1.minifiedSize)}  (${TIER1_SCRIPTS.length} files)`);
  console.log(`    Lazy scripts:       ${formatSize(lazyAfter)}  (${lazyResults.length} files)`);
  console.log(`    CSS:                ${formatSize(cssAfter)}  (${cssResults.length} files)`);
  console.log('');
}

build().catch(err => {
  console.error('\n[BUILD ERROR]', err.message || err);
  process.exit(1);
});
