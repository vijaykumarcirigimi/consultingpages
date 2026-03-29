---
name: doc-builder
description: Build a rich Word document (.docx) for developer reference from a Design Scout report and keyword-optimized content file. Each section is tagged with its library design module name. Replaces the page-assembler and image-finder skills. Use after running design-scout and keyword-optimizer.
---

# Doc Builder

You generate a developer reference Word document by running the `build-content-doc.py` script. This is the final step in the consulting page pipeline — it replaces the page-assembler, content-swap, and image-finder skills.

## Prerequisites

Before running this skill, the user must have:
1. A **Design Scout report** (`output/[slug]-report.md`) — from the design-scout skill
2. A **keyword-optimized content file** (`output/[slug]-optimized.md`) — from the keyword-optimizer skill

If either is missing, ask the user to run the prerequisite skills first.

## Process

### Step 1: Identify the input files

From the user's request, identify:
- The **report path** (e.g., `output/tna-report.md`)
- The **optimized content path** (e.g., `output/tna-optimized.md`)
- The **output path** (optional — defaults to `output/[slug]-developer-reference.docx`)

### Step 2: Run the build script

Execute:
```
python build-content-doc.py <report-path> <content-path> [--output <output-path>]
```

The script automatically:
- Parses the Design Scout report to get the page flow (section → design module mapping)
- Parses the optimized content file to extract all section content
- Generates a structured Word document with:
  - **Cover page** with page title and metadata
  - **SEO metadata table** with all meta fields
  - **Page flow overview table** showing every section mapped to its library design file
  - **Section-by-section content** with each section tagged by a navy bar showing the design module filename
  - **Developer notes** from the report (FAQ item count mismatches, background alternation, etc.)

### Step 3: Verify output

After the script runs, confirm:
- The .docx file was created at the output path
- The section count matches the report
- Report any warnings from the script output

### Step 4: Report to user

Tell the user:
- Output file path
- Number of sections
- Library matched vs. custom design count

## What the output document contains

Each section in the document has:

1. **Navy tag bar** showing the design module filename (e.g., `edstellar-hero-classic-split.html`) — or orange "CUSTOM DESIGN" tag for custom sections
2. **Labeled content fields** for every piece of text:
   - Headings (H1, H2, H3)
   - Body paragraphs
   - Bullet lists
   - Stat numbers and labels
   - CTA button labels
   - Image placeholder descriptions
   - Form field labels
   - Developer notes and SEO annotations
3. **Inline bold** preserved from the content file

## Rules

1. Always run the Python script — do NOT manually build the Word document
2. The script handles all formatting, parsing, and layout
3. If the script fails, check that both input files exist and are valid markdown
4. Output goes to `output/` folder by default
5. Do NOT modify the script for page-specific content — it is generic and works with any report + content pair
