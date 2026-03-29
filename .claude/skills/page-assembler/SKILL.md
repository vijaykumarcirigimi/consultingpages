---
name: page-assembler
description: Build a complete, responsive consulting page HTML file by combining section designs from the library based on a Design Scout report. Reads the report to know which designs to use, extracts actual HTML/CSS/JS from each library file, swaps in real content from the content file, and outputs a single production-ready HTML page. Use after running the design-scout skill.
---

# Page Assembler

You build a complete, single-file, responsive consulting service page by combining HTML section designs from the Edstellar library. You use the Design Scout report as your blueprint and the content file as your data source.

## Prerequisites

Before running this skill, the user must have:
1. A **Design Scout report** (`output/[page]-report.md`) — tells you which designs to use
2. A **keyword-optimized content file** (`output/[page]-optimized.md`) — provides all the text with SEO keywords injected and em-dashes removed. If not available, fall back to the original content file (`content/[page].md` or `content/[page].docx`)
3. The **library folder** (`library/`) — contains all the HTML section design files

If any of these are missing, ask the user to run the design-scout and keyword-optimizer skills first or provide the missing file.

## Process

### Step 1: Read inputs

Read these three files in order:
1. The Design Scout report — extract the **Recommended page flow** (ordered list of filenames)
2. The content file — extract all section content (headings, text, stats, lists, quotes, etc.)
3. `library/library-index.json` — for reference metadata about each design

### Step 2: Plan the page structure

From the report's "Recommended page flow" section, create an ordered build list:

```
1. edstellar-hero-classic-split.html → Hero section
2. edstellar-stats-card-grid.html → Stats section
3. edstellar-challenges-section.html → Challenges section
... etc
```

For sections marked `CUSTOM DESIGN` in the report, build them inline using the custom design spec provided (CSS class prefix, HTML structure, CSS rules, content mapping). Add their CSS to the master style block and their HTML in the correct page flow order. If any JS is specified, add it as a separate IIFE in the script block.

**NEVER skip any section.** Every section in the report's page flow must appear in the final HTML — whether it comes from a library file or a custom design spec.

### Step 3: Extract section HTML from library files

For each library file in the build list, you need to extract THREE things:

**A) CSS** — Everything inside the `<style>` tags. Strip duplicate CSS variable declarations (`:root` blocks) after the first section — merge all unique variables into one master `:root` block.

**B) HTML** — The section markup between `<body>` and `</body>`, which includes:
- For the hero file: the `<nav>`, `<section class="hero">`, and `<div class="logo-strip">` inside `<div class="page-wrap">`
- For all other files: the `<section class="section">` block (or equivalent top-level section element)

**C) JavaScript** — Any `<script>` content. Wrap each section's JS in an IIFE or use unique function names to avoid conflicts between sections.

### Step 4: Swap placeholder content with real content

For each extracted section, replace the placeholder/sample content with the REAL content from the content file:

- **Hero**: Replace headline, subheadline, trust points, CTA labels, breadcrumb text, image alt text
- **Stats**: Replace all 4 stat numbers, symbols, and labels
- **Challenges**: Replace all 6 pain point titles, descriptions, and impact tags
- **Services**: Replace all service names, descriptions, and detail text
- **Service detail**: Replace capability headings, descriptions, and sub-feature titles/text
- **Sub-services**: Replace card titles, descriptions, image labels
- **Differentiators**: Replace all differentiator titles and descriptions
- **Process**: Replace step names, descriptions, duration badges, format tags, bullet items
- **Industries**: Replace industry names, descriptions, icons (keep SVG icons, change labels)
- **Connected services**: Replace service names, descriptions, links
- **Download asset**: Replace asset name, description, features, CTA text
- **Success stories**: Replace quotes, author names, roles, stat numbers and labels
- **Testimonials**: Replace quotes, names, roles, avatar initials
- **FAQ**: Replace all question titles and answer text
- **Resources**: Replace blog titles, categories, dates
- **Form**: Replace heading, description, field labels, "what happens next" text

**CRITICAL RULES for content swapping:**
- NEVER change the HTML structure, CSS classes, or layout of the design
- ONLY replace text content inside existing elements
- Keep all CSS classes, IDs, data attributes, and structural markup intact
- Keep all SVG icons — only change text labels if needed
- Keep all image placeholder markup — just update the description text
- Keep all interactive JS functionality intact
- **Em-dashes should already be removed** by the keyword-optimizer skill. If any em-dashes (—) remain in the content, replace them with commas (, ) as a safety net.

### Step 5: Assemble the final page

Build ONE complete HTML file with this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] | Edstellar</title>
  
  <!-- SEO Meta Tags (from seo-metadata-block-template.md if available) -->
  <meta name="description" content="[from content]">
  <link rel="canonical" href="https://www.edstellar.com/consulting/[slug]">
  <!-- OG + Twitter tags -->
  
  <!-- Font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&display=swap" rel="stylesheet">
  
  <style>
    /* ═══ Master CSS Variables ═══ */
    :root {
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
    }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:var(--font); -webkit-font-smoothing:antialiased; }
    
    /* ═══ Section 1: [Name] ═══ */
    [Section 1 CSS — stripped of :root block]
    
    /* ═══ Section 2: [Name] ═══ */
    [Section 2 CSS — stripped of :root block]
    
    /* ... all sections ... */
  </style>
</head>
<body>

  <!-- ═══ Section 1: [Name] ═══ -->
  [Section 1 HTML with real content]
  
  <!-- ═══ Section 2: [Name] ═══ -->
  [Section 2 HTML with real content]
  
  <!-- ... all sections ... -->

  <script>
    /* ═══ Section scripts ═══ */
    
    // [Section name] functionality
    (function() {
      [Section JS wrapped in IIFE]
    })();
    
    // [Next section] functionality
    (function() {
      [Next section JS wrapped in IIFE]
    })();
  </script>

</body>
</html>
```

### Step 6: Handle CSS conflicts

When merging CSS from multiple sections:

1. **Deduplicate `:root` variables** — merge into one master block at the top
2. **Deduplicate reset rules** — keep only ONE `* { margin:0; padding:0; box-sizing:border-box; }` and ONE `body` rule
3. **Namespace class conflicts** — most sections use `.section` as the wrapper class. If two sections use the same class name with different styles, add a parent selector. For example:
   - Hero uses `.hero { }` — no conflict
   - Stats uses `.stats-section { }` — no conflict  
   - But if two sections both style `.section`, use the parent section's unique child to differentiate, or add a section-specific ID
4. **Check for conflicting animation names** — rename if two sections define the same `@keyframes` name

### Step 7: Handle JS conflicts

When merging JavaScript from multiple sections:

1. **Wrap each section's JS in an IIFE** — `(function() { ... })();`
2. **Rename conflicting function names** — e.g., if both FAQ and service detail use `toggle()`, rename to `toggleFaq()` and `toggleDetail()`
3. **Rename conflicting variable names** — e.g., if two carousels both use `var cur = 0`, namespace them
4. **Update onclick handlers** in the HTML to match renamed functions

### Step 8: Add the Dev Reference Panel

After all page sections and before the closing `</body>` tag (but before the `<script>` block), add a **Dev Reference Panel** — a collapsible accordion at the bottom of the page that contains metadata and image guidance for the development team.

This panel is NOT visible to end users by default — it is collapsed and styled as an internal-only reference that the dev team can expand when needed.

**8A) Extract SEO metadata variations from the content file**

Scan the content file for the SEO metadata block (usually near the top, often in a table or structured section labelled "SEO Metadata"). Extract all available fields:
- Page Slug
- Meta Title (with character count)
- Meta Description (with character count)
- Primary Keyword
- Secondary Keywords
- H1 Tag
- Canonical URL
- OG Title / Description
- Schema.org data

If the content file provides these in a table, preserve the table structure. Also generate the complete set of `<head>` meta tags as ready-to-copy HTML code blocks (Primary meta, OG, Twitter, Schema.org JSON-LD) using the `seo-metadata-block-template.md` template as the format guide.

**8B) Generate the image reference table**

If the image manifest file exists at `output/[page-slug]-images.md`, read it and include the image mapping table. If it doesn't exist yet (because image-finder hasn't been run), generate a placeholder table listing every image slot found in the page with columns for Section, Placeholder Description, Recommended Category, and Suggested Search Terms — so the image-finder skill (or a human) can fill it in later.

**8C) Build the accordion HTML**

Add the following self-contained HTML/CSS/JS block. The CSS and JS for this panel must be scoped (prefixed with `.dev-ref-`) to avoid any conflicts with the page's existing styles.

```html
<!-- ═══════════════════════════════════════════════════
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
              <tr><td>Page Slug</td><td>[/consulting/service-slug]</td></tr>
              <tr><td>Primary Keyword</td><td>[keyword]</td></tr>
              <tr><td>H1 Tag</td><td>[H1 text] ([XX] chars)</td></tr>
              <tr><td>Secondary Keywords</td><td>[kw1] · [kw2] · [kw3] · ...</td></tr>
            </table>
          </div>

          <div class="dev-ref-section">
            <h4>Variation 1: Primary Meta Tags (Search Engines)</h4>
            <table class="dev-ref-table">
              <tr><th>Tag</th><th>Value</th></tr>
              <tr><td>title</td><td>[Title] ([XX] chars)</td></tr>
              <tr><td>meta description</td><td>[Description] ([XXX] chars)</td></tr>
              <tr><td>meta keywords</td><td>[primary kw], [secondary kws], Edstellar</td></tr>
              <tr><td>canonical</td><td>[Canonical URL]</td></tr>
            </table>
          </div>

          <div class="dev-ref-section">
            <h4>Variation 2: Open Graph Tags (Facebook, LinkedIn, Social Previews)</h4>
            <table class="dev-ref-table">
              <tr><th>Tag</th><th>Value</th></tr>
              <tr><td>og:type</td><td>website</td></tr>
              <tr><td>og:url</td><td>[Page URL]</td></tr>
              <tr><td>og:title</td><td>[OG Title — same as meta title or shorter]</td></tr>
              <tr><td>og:description</td><td>[OG Description — same or slightly shorter for social]</td></tr>
              <tr><td>og:image</td><td>[OG image URL] (1200x630px)</td></tr>
            </table>
          </div>

          <div class="dev-ref-section">
            <h4>Variation 3: Twitter Card Tags (X / Twitter Previews)</h4>
            <table class="dev-ref-table">
              <tr><th>Tag</th><th>Value</th></tr>
              <tr><td>twitter:card</td><td>summary_large_image</td></tr>
              <tr><td>twitter:url</td><td>[Page URL]</td></tr>
              <tr><td>twitter:title</td><td>[Twitter Title — same as OG title]</td></tr>
              <tr><td>twitter:description</td><td>[Twitter Description — same as OG description]</td></tr>
              <tr><td>twitter:image</td><td>[Twitter image URL] (1200x630px)</td></tr>
            </table>
          </div>

          <div class="dev-ref-section">
            <h4>Ready-to-Copy Meta Tags</h4>
            <div class="dev-ref-code">[Complete <head> meta tags as HTML code — Primary, OG, Twitter, Canonical]</div>
          </div>

          <div class="dev-ref-section">
            <h4>Schema.org Structured Data</h4>
            <div class="dev-ref-code">[Complete JSON-LD script block]</div>
          </div>

          <p class="dev-ref-note">Validate schema at search.google.com/test/rich-results before deploying. OG image should be 1200x630px.</p>
        </div>

        <!-- TAB 2: Image Reference -->
        <div class="dev-ref-tab-content" id="devTab-images">

          <div class="dev-ref-section">
            <h4>Image Mapping — Section by Section</h4>
            <table class="dev-ref-table">
              <tr><th>#</th><th>Section</th><th>Category</th><th>Alt Text / Description</th><th>Ratio</th><th>Unsplash URL</th></tr>
              [One row per image slot. The Unsplash URL column MUST contain the full clickable URL as an anchor tag: <a href="https://images.unsplash.com/photo-XXXXX?w=800&h=600&fit=crop&q=80" target="_blank" rel="noopener">https://images.unsplash.com/photo-XXXXX</a> — so developers can click to open the image directly in a new browser tab. If the image manifest exists, use the actual URLs; otherwise fill in placeholder descriptions and suggested search terms.]
            </table>
          </div>

          <p class="dev-ref-note">All images sourced from Unsplash (royalty-free, no attribution required). Replace URLs with production-hosted versions before deploying. See output/[page-slug]-images.md for the full manifest.</p>
        </div>

      </div>
    </div>
  </div>
</div>
```

**Populate the template:**
1. Replace ALL `[bracketed placeholders]` in the SEO tab with real values extracted from the content file's SEO metadata block
2. Replace the image table rows with one row per image slot found in the page — if `output/[page-slug]-images.md` exists, include the actual image URLs and alt text; if not, fill in the section name, category, placeholder description, and suggested search terms
3. The code blocks should contain the actual, ready-to-paste `<head>` HTML that the dev team can copy directly

**Add the tab-switching JS** inside the main `<script>` block (wrapped in its own IIFE):

```javascript
// Dev Reference Panel tabs
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
})();
```

### Step 9: Output the file

Save the assembled page to:
```
output/[page-slug]-page.html
```

For example: `output/l-and-d-consulting-page.html`

## Output quality checklist

Before finishing, verify:
- [ ] All sections from the report's page flow are included in order
- [ ] All placeholder content has been replaced with real content from the content file
- [ ] No duplicate `:root` blocks or reset rules
- [ ] No CSS class conflicts between sections
- [ ] No JS function name conflicts
- [ ] All interactive features work (carousels, accordions, tabs, etc.)
- [ ] The page is responsive (all sections' media queries are preserved)
- [ ] Font is loaded once (single Google Fonts `<link>`)
- [ ] SEO meta tags are populated if content provides them
- [ ] Section comments clearly mark each section boundary
- [ ] Every section from the content file is present — zero sections skipped
- [ ] Custom design sections use the Edstellar brand system and existing CSS variables
- [ ] New custom designs saved to `library/` folder and `library-index.json` updated for future reuse
- [ ] No em dashes (—) remain in any visible text content (handled by keyword-optimizer, verify as safety net)
- [ ] Dev Reference Panel is present at the bottom with SEO & Image tabs
- [ ] SEO tab contains all metadata values from the content file with ready-to-copy HTML
- [ ] Image tab contains one row per image slot with section, category, and search guidance
- [ ] Dev Reference Panel CSS/JS is scoped with `.dev-ref-` prefix — no conflicts with page styles
- [ ] Dev Reference Panel accordion starts collapsed

## Important rules

1. **Preserve exact design fidelity** — the assembled page must look identical to the individual library files, just combined into one page
2. **Only change text content** — never modify HTML structure, CSS classes, or JS logic
3. **Keep all image placeholders** — don't remove them; the design team will replace with real images later
4. **Maintain section order** from the Design Scout report
5. **The output must be a SINGLE HTML file** — all CSS inline in `<style>`, all JS inline in `<script>`, no external dependencies except Google Fonts
6. **If the content file is a .docx**, use the tools available to read its contents before processing
7. **If any content is missing** for a section, keep the placeholder content from the library file and add a `<!-- TODO: Replace with real content -->` comment
8. **Always include the Dev Reference Panel** — it must be the last element before `</body>`, after all page sections but before the `<script>` block. It provides SEO metadata and image guidance for the development team
9. **Dev Reference Panel must be self-contained** — its CSS is inline within the panel's own `<style>` tag (scoped with `.dev-ref-` prefix), and its JS is added as a separate IIFE in the main script block
