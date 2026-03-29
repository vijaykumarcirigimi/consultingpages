---
name: content-swap
description: Swap placeholder content in a pre-built skeleton HTML page with real content from an optimized content file. This is the LLM-only step in the hybrid build pipeline — the skeleton already has all CSS/HTML/JS merged and deduplicated by build-engine.js.
---

# Content Swap

You swap placeholder text in a pre-built skeleton page with real content from the optimized content file. The mechanical work (CSS merging, HTML extraction, JS IIFE wrapping, Dev Reference Panel) is already done by `build-engine.js`. Your ONLY job is content mapping.

## Prerequisites

1. A **skeleton HTML page** (`output/[page]-skeleton.html`) — built by `node build-engine.js`
2. A **keyword-optimized content file** (`output/[page]-optimized.md`) — or the original content file
3. The **Design Scout report** (`output/[page]-report.md`) — for content mapping notes per section

If the skeleton doesn't exist, tell the user to run `node build-engine.js output/[page]-report.md` first.

## Process

### Step 1: Read inputs (3 files only)

1. The **skeleton HTML** — this is your working file
2. The **optimized content file** — your data source
3. The **Design Scout report** — use the "Content mapping notes" under each section for field-level guidance

You do NOT need to read any library files or library-index.json. The skeleton already has everything merged.

### Step 2: Swap content section by section

Walk through each `<!-- ═══ Section N: Name ═══ -->` block in the skeleton and replace placeholder text with real content from the optimized file.

**For each section type, swap these fields:**

- **Hero**: headline, subheadline/tagline, eyebrow/badge, trust points/checkmarks, CTA labels, breadcrumb, image alt text
- **Definitional Intro**: label, H2, lead paragraph, second paragraph
- **Stats**: stat numbers, symbols (+, %, x), stat labels
- **Three Pillars**: card titles, card descriptions
- **Benefit Pillars**: label, H2, intro, card titles + descriptions
- **Challenges**: pain point titles, descriptions, impact tags
- **Services**: service names, descriptions, detail text
- **Service Detail**: capability headings, descriptions, sub-feature titles/text
- **Sub-services**: card titles, descriptions, image labels
- **Closed-Loop Cycle**: H2, step labels, step descriptions, callout text
- **Process (any variant)**: step names, descriptions, duration badges, format tags, bullet items
- **Differentiators**: differentiator titles and descriptions
- **Industries**: industry names, descriptions
- **Connected Services**: service names, descriptions, links
- **Download Asset**: asset name, description, features, CTA text
- **Logo Wall**: brand names in tag elements
- **Success Stories**: quotes, author names, roles, stat numbers + labels
- **Testimonials**: quotes, names, roles, avatar initials
- **FAQ**: question titles, answer text
- **Resources**: blog titles, categories, dates
- **CTA Banner**: heading, description, button text
- **Form**: heading, description, field labels
- **Transformation Phases**: phase titles, problem/solution/outcome text
- **Ranked Leaderboard**: row titles, volume counts
- **AI-Powered Split**: heading, paragraphs, capability card titles + descriptions
- **Content Formats**: format titles, descriptions
- **Outcomes/Deliverables**: tab labels, feature lists, visual panel content
- **Services Grid 12**: card titles, descriptions, links

**For custom sections** (marked with `(Custom)` in section comments):
- The report's content mapping notes tell you exactly which `{placeholder}` fields to fill
- Replace `{heading}`, `{title}`, `{description}`, etc. with real content

### Step 3: Populate the Dev Reference Panel

Fill in the SEO metadata placeholders in the Dev Reference Panel:
- Replace `<!-- SEO:SLUG -->` with the page slug
- Replace `<!-- SEO:PRIMARY_KEYWORD -->` with the primary keyword
- Replace `<!-- SEO:H1 -->` with the H1 text and character count
- Replace `<!-- SEO:SECONDARY_KEYWORDS -->` with secondary keywords
- Replace `<!-- SEO:META_TITLE -->` with meta title and character count
- Replace `<!-- SEO:META_DESCRIPTION -->` with meta description and character count
- Replace `<!-- SEO:META_KEYWORDS -->` with all keywords
- Replace `<!-- SEO:CANONICAL -->` with the canonical URL
- Replace `<!-- SEO:OG_TITLE -->` with OG title
- Replace `<!-- SEO:OG_DESCRIPTION -->` with OG description
- Replace `<!-- SEO:OG_IMAGE -->` with OG image URL placeholder
- Replace `<!-- SEO:HEAD_BLOCK -->` with the complete ready-to-copy `<head>` meta HTML
- Replace `<!-- SEO:SCHEMA_JSON_LD -->` with the Schema.org JSON-LD script
- Replace `<!-- IMAGE_ROWS -->` with placeholder image rows (section, category, alt text, ratio, search terms)

Also populate the `<head>` meta tags at the top of the page (title, description, canonical are already templated).

### Step 4: Safety checks

1. **Em-dashes**: Search for any remaining `—` in visible text and replace with commas
2. **Missing content**: If any section has no matching content in the file, keep the placeholder and add `<!-- TODO: Replace with real content -->`
3. **HTML structure**: Do NOT change any HTML tags, CSS classes, IDs, or structural markup
4. **Interactive elements**: Do NOT modify any JavaScript, onclick handlers, or data attributes

### Step 5: Save the final page

Save to: `output/[page-slug]-page.html`

This replaces the skeleton — the skeleton was an intermediate build artifact.

## What you do NOT do

- Read library HTML files (already merged into skeleton)
- Read library-index.json (not needed)
- Merge or deduplicate CSS (already done)
- Wrap JS in IIFEs (already done)
- Build the Dev Reference Panel HTML (already in skeleton)
- Build custom section CSS/HTML (already extracted from report by build-engine)

## Output quality checklist

- [ ] Every placeholder text replaced with real content from the optimized file
- [ ] All custom section `{placeholder}` fields filled with real content
- [ ] Dev Reference Panel SEO fields populated
- [ ] No em-dashes remain in visible text
- [ ] HTML structure, CSS classes, and JS untouched
- [ ] All interactive features intact
- [ ] Every section from report present — zero skipped
- [ ] File saved to output/[slug]-page.html
