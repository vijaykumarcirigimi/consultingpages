# Consulting Page Builder

This project contains an HTML section library for building Edstellar consulting service pages, along with agents that analyze content files and produce developer reference documents tagged with design module names.

## Project structure

```
Consulting Page Builder/
├── CLAUDE.md                    ← You are reading this
├── build-content-doc.py         ← Generic doc builder: report + content → developer-reference.docx
├── library/
│   ├── library-index.json       ← Master catalog of all available HTML design files
│   ├── image-library.json       ← Reusable Unsplash image library (check before searching)
│   └── *.html                   ← HTML section design files + 1 .md SEO template
├── content/
│   └── *.md / *.docx            ← Page content files to analyze and build from
├── .claude/
│   └── skills/
│       ├── competitor-research.md ← Step 0: Research competitors → structured brief
│       ├── design-scout.md      ← Step 1: Analyze content → match to library designs → report
│       ├── keyword-optimizer.md ← Step 2: Add section-wise keywords + remove em-dashes → optimized content
│       └── doc-builder.md       ← Step 3: Report + optimized content → developer reference .docx
├── image-sourcing-rules-guide.md ← Rules for image selection by category and context
└── output/
    ├── *-research.md             ← Competitor research briefs
    ├── *-report.md              ← Design Scout reports
    ├── *-optimized.md           ← Keyword-optimized content files
    └── *-developer-reference.docx ← Developer reference documents (final output)
```

## Workflow

Three skills run in sequence to produce a developer reference document. An optional Step 0 runs first if no content file exists yet.

### Step 0: Competitor Research (optional, for new pages without content)
Scans 3-5 competitor consulting pages for a given topic and produces a structured research brief with section patterns, service framing, stats, differentiators, and recommended Edstellar content structure.

```
Research competitors for "[Topic]" using the competitor-research skill. This is a [Main/Sub] page under [Parent or NA]. Save to output/[slug]-research.md
```

### Step 1: Design Scout
Analyzes a content file and maps each section to the best available library design.

```
Analyze content/[filename].docx using the design-scout skill and output the report to output/[slug]-report.md
```

### Step 2: Keyword Optimizer
Injects section-wise SEO keywords naturally into the content and removes all em-dashes. Outputs an optimized content file that the doc-builder uses.

```
Optimize content/[filename].docx using the keyword-optimizer skill. Output to output/[slug]-optimized.md
```

### Step 3: Doc Builder
Generates a rich Word document with every section tagged by its library design module name. The developer uses this document + the library HTML files to manually build the page.

```
Build the developer reference document using the doc-builder skill. Use output/[slug]-report.md and output/[slug]-optimized.md as inputs.
```

The doc-builder runs `build-content-doc.py` which:
- Parses the report to get the section → design module mapping
- Parses the optimized content to get all text fields
- Generates a .docx with cover page, SEO table, page flow overview, and section-by-section content
- Each section has a navy tag bar showing the exact library filename to use

### All three steps in one command
```
Analyze content/[filename].docx using design-scout and save the report to output/[slug]-report.md. Then optimize the content using keyword-optimizer and save to output/[slug]-optimized.md. Then build the developer reference document using doc-builder.
```

## Key rules

- Always read `library/library-index.json` first to know what designs are available
- Brand system: navy (#2D2F6B), lime (#C5E826), Inter font
- All output goes in the `output/` folder
- NEVER skip content sections — if no library design matches, design-scout provides a custom design spec
- New custom designs must be saved as standalone HTML files in `library/` and added to `library-index.json` for future reuse
- Image sourcing must follow `image-sourcing-rules-guide.md` — 7 categories, Unsplash only
- Image finder checks `library/image-library.json` first, searches Unsplash only for gaps
- All new images found must be saved back to `library/image-library.json` for future reuse
