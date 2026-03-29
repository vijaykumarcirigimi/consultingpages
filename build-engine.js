#!/usr/bin/env node
/**
 * Edstellar Consulting Page Build Engine
 *
 * Automates the mechanical parts of page assembly:
 *   1. Parses a Design Scout report to get ordered file list
 *   2. Reads all library HTML files
 *   3. Extracts and merges CSS (deduplicates :root, resets)
 *   4. Extracts body HTML sections
 *   5. Extracts and IIFE-wraps JavaScript
 *   6. Appends Dev Reference Panel template
 *   7. Outputs a skeleton page ready for content swapping
 *
 * Usage:
 *   node build-engine.js <report-path> [--output <path>] [--content <path>]
 *
 * Example:
 *   node build-engine.js output/tna-report.md --output output/tna-skeleton.html
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────────────────

const LIBRARY_DIR = path.join(__dirname, 'library');

const MASTER_ROOT = `:root {
    --navy: #2D2F6B;
    --navy-card: #2E3054;
    --navy-deep: #232558;
    --navy-light: #383A72;
    --lime: #C5E826;
    --lime-hover: #D4F23A;
    --lime-text: #1A2600;
    --lime-dim: rgba(197,232,38,0.08);
    --red: #D94848;
    --red-bg: #FDF0F0;
    --white: #FFFFFF;
    --off-white: #F4F5F7;
    --light-bg: #EEF0F4;
    --surface: #FFFFFF;
    --text-primary: #1A1A2E;
    --text-secondary: #5C5E6E;
    --text-muted: #8A8C9A;
    --text-body: #D0D2E0;
    --text-muted-navy: #9496B0;
    --border: #DCDEE5;
    --border-navy: rgba(255,255,255,0.1);
    --border-light: #E2E3E8;
    --radius: 10px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --font: 'Inter', -apple-system, sans-serif;
  }`;

const MASTER_RESET = `* { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:var(--font); -webkit-font-smoothing:antialiased; }`;

// ─── Report Parser ───────────────────────────────────────────────────────────

function parseReport(reportPath) {
  const content = fs.readFileSync(reportPath, 'utf-8');

  // Extract page name
  const pageMatch = content.match(/\*\*Page:\*\*\s*(.+)/);
  const pageName = pageMatch ? pageMatch[1].trim() : 'Consulting Page';

  // Extract page flow section
  const flowMatch = content.match(/## Recommended page flow\s*\n([\s\S]*?)(?=\n---|\n## |\n$)/);
  if (!flowMatch) {
    throw new Error('Could not find "## Recommended page flow" section in report');
  }

  const flowLines = flowMatch[1].trim().split('\n').filter(l => l.trim());
  const pageFlow = [];

  for (const line of flowLines) {
    // Match: 1. `edstellar-hero-classic-split.html` — Hero Banner
    const libMatch = line.match(/^\d+\.\s*`([^`]+\.html)`\s*(?:—|--|-)\s*(.+)/);
    if (libMatch) {
      pageFlow.push({
        type: 'library',
        file: libMatch[1],
        label: libMatch[2].trim()
      });
      continue;
    }

    // Match: 7. `CUSTOM: #business-priorities` — Business Priorities + Before/After
    const customMatch = line.match(/^\d+\.\s*`CUSTOM:\s*#([^`]+)`\s*(?:—|--|-)\s*(.+)/);
    if (customMatch) {
      pageFlow.push({
        type: 'custom',
        sectionId: customMatch[1],
        label: customMatch[2].trim()
      });
      continue;
    }
  }

  // Extract custom design specs from the section mapping
  const customSpecs = {};
  const sectionBlocks = content.split(/### \d+\./);

  for (const block of sectionBlocks) {
    if (!block.includes('CUSTOM DESIGN')) continue;

    const idMatch = block.match(/\*\*Section ID:\*\*\s*#(\S+)/);
    if (!idMatch) continue;
    const sectionId = idMatch[1];

    // Extract CSS from ```css ... ``` blocks
    const cssBlocks = [];
    const cssRegex = /```css\s*\n([\s\S]*?)```/g;
    let cssMatch;
    while ((cssMatch = cssRegex.exec(block)) !== null) {
      cssBlocks.push(cssMatch[1].trim());
    }

    // Extract HTML from ```html ... ``` blocks
    const htmlBlocks = [];
    const htmlRegex = /```html\s*\n([\s\S]*?)```/g;
    let htmlMatch;
    while ((htmlMatch = htmlRegex.exec(block)) !== null) {
      htmlBlocks.push(htmlMatch[1].trim());
    }

    // Extract JS requirement
    const jsMatch = block.match(/\*\*JS required:\*\*\s*(.+)/);
    const jsRequired = jsMatch ? jsMatch[1].trim() : 'None';

    // Extract JS from ```javascript or ```js blocks
    const jsBlocks = [];
    const jsRegex = /```(?:javascript|js)\s*\n([\s\S]*?)```/g;
    let jsBlockMatch;
    while ((jsBlockMatch = jsRegex.exec(block)) !== null) {
      jsBlocks.push(jsBlockMatch[1].trim());
    }

    customSpecs[sectionId] = {
      css: cssBlocks.join('\n\n'),
      html: htmlBlocks.join('\n'),
      js: jsRequired !== 'None' ? jsBlocks.join('\n\n') : '',
      label: ''
    };
  }

  // Attach labels from pageFlow
  for (const item of pageFlow) {
    if (item.type === 'custom' && customSpecs[item.sectionId]) {
      customSpecs[item.sectionId].label = item.label;
    }
  }

  return { pageName, pageFlow, customSpecs };
}

// ─── HTML File Processor ─────────────────────────────────────────────────────

function extractFromLibraryFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract CSS (everything between <style> tags)
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/i);
  let css = styleMatch ? styleMatch[1].trim() : '';

  // Strip :root block
  css = css.replace(/:root\s*\{[^}]*\}/g, '').trim();

  // Strip * reset and body reset
  css = css.replace(/\*\s*\{[^}]*margin\s*:\s*0[^}]*\}/g, '').trim();
  css = css.replace(/body\s*\{[^}]*font-family[^}]*\}/g, '').trim();

  // Clean up multiple blank lines
  css = css.replace(/\n{3,}/g, '\n\n').trim();

  // Extract body HTML
  const bodyMatch = content.match(/<body>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1].trim() : '';

  // Separate script from HTML
  let js = '';
  const scriptMatch = bodyContent.match(/<script>([\s\S]*?)<\/script>/gi);
  if (scriptMatch) {
    for (const block of scriptMatch) {
      const inner = block.replace(/<\/?script>/gi, '').trim();
      if (inner) js += inner + '\n';
    }
    // Remove script tags from HTML
    bodyContent = bodyContent.replace(/<script>[\s\S]*?<\/script>/gi, '').trim();
  }

  return { css, html: bodyContent, js };
}

// ─── Dev Reference Panel ─────────────────────────────────────────────────────

function getDevReferencePanel(pageName, pageSlug) {
  return `<!-- ═══════════════════════════════════════════════════
     DEV REFERENCE PANEL — Internal use only
     Remove this section before publishing to production
     ═══════════════════════════════════════════════════ -->
<div class="dev-ref-panel">
  <style>
    .dev-ref-panel { max-width:1120px; margin:48px auto 64px; padding:0 48px; font-family:var(--font, 'Inter', sans-serif); }
    .dev-ref-banner { background:#1A1A2E; border-radius:12px; overflow:hidden; }
    .dev-ref-header { display:flex; align-items:center; justify-content:space-between; padding:20px 28px; cursor:pointer; user-select:none; }
    .dev-ref-header:hover { background:rgba(255,255,255,0.03); }
    .dev-ref-title { display:flex; align-items:center; gap:12px; }
    .dev-ref-title h3 { font-size:15px; font-weight:700; color:#C5E826; letter-spacing:-0.01em; }
    .dev-ref-badge { font-size:10px; font-weight:700; color:#1A1A2E; background:#C5E826; padding:3px 8px; border-radius:4px; text-transform:uppercase; letter-spacing:0.05em; }
    .dev-ref-toggle { width:28px; height:28px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.2); background:transparent; color:rgba(255,255,255,0.6); font-size:18px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.25s; font-family:var(--font, 'Inter', sans-serif); }
    .dev-ref-banner.open .dev-ref-toggle { transform:rotate(45deg); color:#C5E826; border-color:#C5E826; }
    .dev-ref-body { max-height:0; overflow:hidden; transition:max-height 0.4s cubic-bezier(0.4,0,0.2,1); }
    .dev-ref-banner.open .dev-ref-body { max-height:5000px; }
    .dev-ref-content { padding:0 28px 28px; }
    .dev-ref-tabs { display:flex; gap:4px; margin-bottom:24px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0; }
    .dev-ref-tab { padding:10px 18px; font-size:12px; font-weight:600; color:rgba(255,255,255,0.5); background:transparent; border:none; border-bottom:2px solid transparent; cursor:pointer; font-family:var(--font, 'Inter', sans-serif); transition:all 0.2s; margin-bottom:-1px; }
    .dev-ref-tab:hover { color:rgba(255,255,255,0.8); }
    .dev-ref-tab.active { color:#C5E826; border-bottom-color:#C5E826; }
    .dev-ref-tab-content { display:none; }
    .dev-ref-tab-content.active { display:block; }
    .dev-ref-section { margin-bottom:24px; }
    .dev-ref-section h4 { font-size:13px; font-weight:700; color:#C5E826; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px; }
    .dev-ref-table { width:100%; border-collapse:collapse; font-size:12px; }
    .dev-ref-table th { text-align:left; padding:8px 12px; color:rgba(255,255,255,0.5); font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:0.04em; border-bottom:1px solid rgba(255,255,255,0.1); }
    .dev-ref-table td { padding:8px 12px; color:rgba(255,255,255,0.75); border-bottom:1px solid rgba(255,255,255,0.05); vertical-align:top; line-height:1.5; }
    .dev-ref-table tr:last-child td { border-bottom:none; }
    .dev-ref-code { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:16px; font-family:'Courier New', monospace; font-size:11px; color:rgba(255,255,255,0.7); line-height:1.6; overflow-x:auto; white-space:pre; margin-bottom:16px; }
    .dev-ref-code .tag { color:#C5E826; }
    .dev-ref-code .attr { color:#7B93DB; }
    .dev-ref-code .val { color:#F0A862; }
    .dev-ref-note { font-size:11px; color:rgba(255,255,255,0.4); line-height:1.5; margin-top:8px; font-style:italic; }
    .dev-ref-table a { color:#7B93DB; text-decoration:none; word-break:break-all; font-size:11px; }
    .dev-ref-table a:hover { color:#C5E826; text-decoration:underline; }
    @media (max-width:768px) { .dev-ref-panel { padding:0 16px; } .dev-ref-tabs { flex-wrap:wrap; } }
  </style>

  <div class="dev-ref-banner" id="devRefBanner">
    <div class="dev-ref-header" onclick="document.getElementById('devRefBanner').classList.toggle('open')">
      <div class="dev-ref-title">
        <h3>Developer Reference Panel</h3>
        <span class="dev-ref-badge">Internal Only</span>
      </div>
      <button class="dev-ref-toggle">+</button>
    </div>
    <div class="dev-ref-body">
      <div class="dev-ref-content">

        <div class="dev-ref-tabs" id="devRefTabs">
          <button class="dev-ref-tab active" data-devtab="meta">SEO & Meta Tags</button>
          <button class="dev-ref-tab" data-devtab="images">Image Reference</button>
        </div>

        <!-- TAB 1: SEO & Meta Tags -->
        <div class="dev-ref-tab-content active" id="devTab-meta">
          <div class="dev-ref-section">
            <h4>Core SEO Fields</h4>
            <table class="dev-ref-table">
              <tr><th>Field</th><th>Value</th></tr>
              <tr><td>Page Slug</td><td><!-- SEO:SLUG --></td></tr>
              <tr><td>Primary Keyword</td><td><!-- SEO:PRIMARY_KEYWORD --></td></tr>
              <tr><td>H1 Tag</td><td><!-- SEO:H1 --></td></tr>
              <tr><td>Secondary Keywords</td><td><!-- SEO:SECONDARY_KEYWORDS --></td></tr>
            </table>
          </div>
          <div class="dev-ref-section">
            <h4>Variation 1: Primary Meta Tags (Search Engines)</h4>
            <table class="dev-ref-table">
              <tr><th>Tag</th><th>Value</th></tr>
              <tr><td>title</td><td><!-- SEO:META_TITLE --></td></tr>
              <tr><td>meta description</td><td><!-- SEO:META_DESCRIPTION --></td></tr>
              <tr><td>meta keywords</td><td><!-- SEO:META_KEYWORDS --></td></tr>
              <tr><td>canonical</td><td><!-- SEO:CANONICAL --></td></tr>
            </table>
          </div>
          <div class="dev-ref-section">
            <h4>Variation 2: Open Graph Tags</h4>
            <table class="dev-ref-table">
              <tr><th>Tag</th><th>Value</th></tr>
              <tr><td>og:type</td><td>website</td></tr>
              <tr><td>og:url</td><td><!-- SEO:CANONICAL --></td></tr>
              <tr><td>og:title</td><td><!-- SEO:OG_TITLE --></td></tr>
              <tr><td>og:description</td><td><!-- SEO:OG_DESCRIPTION --></td></tr>
              <tr><td>og:image</td><td><!-- SEO:OG_IMAGE --></td></tr>
            </table>
          </div>
          <div class="dev-ref-section">
            <h4>Variation 3: Twitter Card Tags</h4>
            <table class="dev-ref-table">
              <tr><th>Tag</th><th>Value</th></tr>
              <tr><td>twitter:card</td><td>summary_large_image</td></tr>
              <tr><td>twitter:url</td><td><!-- SEO:CANONICAL --></td></tr>
              <tr><td>twitter:title</td><td><!-- SEO:OG_TITLE --></td></tr>
              <tr><td>twitter:description</td><td><!-- SEO:OG_DESCRIPTION --></td></tr>
              <tr><td>twitter:image</td><td><!-- SEO:OG_IMAGE --></td></tr>
            </table>
          </div>
          <div class="dev-ref-section">
            <h4>Ready-to-Copy Meta Tags</h4>
            <div class="dev-ref-code"><!-- SEO:HEAD_BLOCK --></div>
          </div>
          <div class="dev-ref-section">
            <h4>Schema.org Structured Data</h4>
            <div class="dev-ref-code"><!-- SEO:SCHEMA_JSON_LD --></div>
          </div>
          <p class="dev-ref-note">Validate schema at search.google.com/test/rich-results before deploying. OG image should be 1200x630px.</p>
        </div>

        <!-- TAB 2: Image Reference -->
        <div class="dev-ref-tab-content" id="devTab-images">
          <div class="dev-ref-section">
            <h4>Image Mapping — Section by Section</h4>
            <table class="dev-ref-table">
              <tr><th>#</th><th>Section</th><th>Category</th><th>Alt Text / Description</th><th>Ratio</th><th>Unsplash URL</th></tr>
              <!-- IMAGE_ROWS -->
            </table>
          </div>
          <p class="dev-ref-note">All images sourced from Unsplash (royalty-free, no attribution required). Replace URLs with production-hosted versions before deploying. See output/${pageSlug}-images.md for the full manifest.</p>
        </div>

      </div>
    </div>
  </div>
</div>`;
}

// ─── Skeleton Page Builder ───────────────────────────────────────────────────

function buildSkeleton(reportPath, outputPath) {
  const startTime = Date.now();

  // Parse the report
  const { pageName, pageFlow, customSpecs } = parseReport(reportPath);
  console.log(`\n  Page: ${pageName}`);
  console.log(`  Sections: ${pageFlow.length} (${pageFlow.filter(s => s.type === 'library').length} library + ${pageFlow.filter(s => s.type === 'custom').length} custom)\n`);

  const allCSS = [];
  const allHTML = [];
  const allJS = [];
  let sectionIndex = 0;
  let filesRead = 0;
  const missingFiles = [];

  for (const item of pageFlow) {
    sectionIndex++;

    if (item.type === 'library') {
      const filePath = path.join(LIBRARY_DIR, item.file);

      if (!fs.existsSync(filePath)) {
        missingFiles.push(item.file);
        allHTML.push(`  <!-- ═══ Section ${sectionIndex}: ${item.label} ═══ -->\n  <!-- ERROR: Library file not found: ${item.file} -->\n`);
        continue;
      }

      const { css, html, js } = extractFromLibraryFile(filePath);
      filesRead++;

      // Add section CSS with comment header
      if (css) {
        allCSS.push(`    /* ═══ Section ${sectionIndex}: ${item.label} ═══ */\n    ${css.replace(/\n/g, '\n    ')}`);
      }

      // Add section HTML with comment
      allHTML.push(`  <!-- ═══ Section ${sectionIndex}: ${item.label} ═══ -->\n  ${html.replace(/\n/g, '\n  ')}`);

      // Add section JS wrapped in IIFE
      if (js.trim()) {
        allJS.push(`  // ${item.label}\n  (function() {\n    ${js.trim().replace(/\n/g, '\n    ')}\n  })();`);
      }

    } else if (item.type === 'custom') {
      const spec = customSpecs[item.sectionId];
      if (spec) {
        // Add custom CSS
        if (spec.css) {
          allCSS.push(`    /* ═══ Section ${sectionIndex}: ${item.label} (Custom) ═══ */\n    ${spec.css.replace(/\n/g, '\n    ')}`);
        }

        // Add custom HTML
        if (spec.html) {
          allHTML.push(`  <!-- ═══ Section ${sectionIndex}: ${item.label} (Custom) ═══ -->\n  ${spec.html.replace(/\n/g, '\n  ')}`);
        } else {
          allHTML.push(`  <!-- ═══ Section ${sectionIndex}: ${item.label} (Custom) ═══ -->\n  <!-- CUSTOM DESIGN: Build from report spec for #${item.sectionId} -->`);
        }

        // Add custom JS
        if (spec.js) {
          allJS.push(`  // ${item.label} (Custom)\n  (function() {\n    ${spec.js.trim().replace(/\n/g, '\n    ')}\n  })();`);
        }
      } else {
        allHTML.push(`  <!-- ═══ Section ${sectionIndex}: ${item.label} (Custom) ═══ -->\n  <!-- CUSTOM DESIGN: No spec found in report for #${item.sectionId} — LLM must build this -->`);
      }
    }
  }

  // Generate page slug from page name
  const pageSlug = pageName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Add Dev Reference Panel
  const devPanel = getDevReferencePanel(pageName, pageSlug);

  // Dev panel tab JS
  allJS.push(`  // Dev Reference Panel tabs
  (function() {
    var tabs = document.querySelectorAll('#devRefTabs .dev-ref-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        document.querySelectorAll('.dev-ref-tab-content').forEach(function(c) { c.classList.remove('active'); });
        document.getElementById('devTab-' + this.getAttribute('data-devtab')).classList.add('active');
      });
    });
  })();`);

  // Assemble the final page
  const finalHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageName} | Edstellar</title>

  <!-- SEO Meta Tags — to be populated by content-swap -->
  <meta name="description" content="">
  <link rel="canonical" href="https://www.edstellar.com/consulting/${pageSlug}">

  <!-- Font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&display=swap" rel="stylesheet">

  <style>
    /* ═══ Master CSS Variables ═══ */
    ${MASTER_ROOT}
    ${MASTER_RESET}

${allCSS.join('\n\n')}
  </style>
</head>
<body>

${allHTML.join('\n\n')}

${devPanel}

  <script>
${allJS.join('\n\n')}
  </script>

</body>
</html>`;

  // Determine output path
  if (!outputPath) {
    outputPath = path.join(__dirname, 'output', `${pageSlug}-skeleton.html`);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, finalHTML, 'utf-8');

  const elapsed = Date.now() - startTime;

  console.log(`  Library files read: ${filesRead}`);
  console.log(`  Custom sections: ${Object.keys(customSpecs).length}`);
  if (missingFiles.length > 0) {
    console.log(`  Missing files: ${missingFiles.join(', ')}`);
  }
  console.log(`  Output: ${outputPath}`);
  console.log(`  Time: ${elapsed}ms\n`);

  return { outputPath, elapsed, filesRead, missingFiles, sectionCount: pageFlow.length };
}

// ─── CLI Entry Point ─────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
  Edstellar Page Build Engine
  ===========================

  Assembles a skeleton HTML page from a Design Scout report + library files.
  The skeleton has all CSS/HTML/JS merged and deduplicated, ready for content swapping.

  Usage:
    node build-engine.js <report-path> [--output <path>]

  Options:
    --output, -o   Output file path (default: output/<slug>-skeleton.html)
    --help, -h     Show this help

  Example:
    node build-engine.js output/tna-report.md
    node build-engine.js output/tna-report.md -o output/tna-skeleton.html
`);
    process.exit(0);
  }

  const reportPath = path.resolve(args[0]);

  if (!fs.existsSync(reportPath)) {
    console.error(`  Error: Report file not found: ${reportPath}`);
    process.exit(1);
  }

  let outputPath = null;
  const outputIdx = args.indexOf('--output') !== -1 ? args.indexOf('--output') : args.indexOf('-o');
  if (outputIdx !== -1 && args[outputIdx + 1]) {
    outputPath = path.resolve(args[outputIdx + 1]);
  }

  console.log('\n  Edstellar Page Build Engine');
  console.log('  ===========================');

  try {
    buildSkeleton(reportPath, outputPath);
    console.log('  Done.\n');
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    process.exit(1);
  }
}

main();
