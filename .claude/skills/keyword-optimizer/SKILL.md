---
name: keyword-optimizer
description: Skill that adds commercial-intent keyword variations ([service] consulting, [service] company, [service] firm, [service] services, [service] provider, [service] agency, [service] solutions) into headings and body content contextually. Also removes all em-dashes. Outputs an optimized content file ready for assembly.
---

# Keyword Optimizer

You optimize consulting page content files by injecting **commercial-intent keyword variations** of the page's core service into headings (H1, H2, H3) and body content. These variations capture how real buyers search for consulting providers. You also remove all em-dashes (—). The optimized content file replaces the original as input for the page-assembler.

## Prerequisites

Before running this skill, the user must have:
1. A **content file** (`content/[page].md` or `content/[page].docx`) — the raw page content
2. Optionally, a **competitor research brief** (`output/[slug]-research.md`) — for keyword context

If a Design Scout report already exists, it can also be referenced for section structure.

## Process

### Step 1: Read the content file and identify the core service

Read the content file and identify:
- All sections (hero, stats, services, FAQ, etc.)
- The **SEO metadata block** (if present) — extract Primary Keywords, Secondary Keywords, and any long-tail variants
- The **core service name** — this is the main service the page is about (e.g., "Learning Governance, Analytics & ROI", "Training Needs Analysis", "Talent Assessment")

### Step 2: Generate commercial-intent keyword variations

From the core service name and its sub-services, generate these **commercial-intent variations** that real buyers use when searching for a provider:

| Variation pattern | Example (for "Learning Governance, Analytics & ROI") |
|---|---|
| `[service] consulting` | learning governance consulting, learning analytics consulting, training ROI consulting |
| `[service] consulting firm` | learning governance consulting firm, learning analytics consulting firm |
| `[service] consulting company` | learning governance consulting company, training ROI consulting company |
| `[service] consulting services` | learning analytics consulting services, L&D measurement consulting services |
| `[service] company` | learning governance company, learning analytics company |
| `[service] firm` | L&D measurement firm, learning analytics firm |
| `[service] provider` | learning governance provider, training ROI provider |
| `[service] agency` | learning analytics agency (use sparingly — only where natural) |
| `[service] solutions` | learning governance solutions, L&D analytics solutions |
| `[service] services` | learning governance services, training ROI services |
| `[service] experts` | learning analytics experts, L&D measurement experts |
| `[service] specialists` | training ROI specialists, learning governance specialists |

Also generate **combined variations** using the page's sub-services and pillar terms:
- e.g., "learning governance and analytics consulting firm"
- e.g., "training ROI measurement consulting company"
- e.g., "L&D measurement and analytics services"

### Step 3: Map variations to sections

Place variations contextually across the page. Not every section needs a variation — only add where it reads naturally:

| Section type | Which variations fit naturally |
|---|---|
| **Hero (H1 + body)** | `[service] consulting` in H1 (likely already there). Add 1-2 variations like `consulting firm` or `consulting services` in the hero description. |
| **Definitional Intro** | `[service] consulting` or `consulting services` in the opening or closing sentence |
| **Problem / Challenges** | Minimal — pain-point sections rarely mention provider types. Skip unless a sentence naturally accommodates "consulting firm" or "experts" |
| **Services section heading (H2)** | `[service] consulting services` in the H2 |
| **Service descriptions** | `[sub-service] services` or `[sub-service] solutions` in 2-3 service tile descriptions |
| **Service deep-dives** | `[sub-service] consulting` or `[sub-service] experts` in 1-2 deep-dive intros |
| **Differentiators / Why Choose** | `consulting firm`, `consulting company`, or `consulting partner` in 2-3 differentiator descriptions — this is the highest-value section for these terms |
| **Process / Methodology** | `consulting services` or `consulting firm` once in the intro sentence |
| **Industries** | `[service] consulting for [industry]` or `[service] firm for [industry]` in 2-3 industry descriptions |
| **Case Studies** | `consulting firm` or `consulting partner` in 1-2 solution descriptions |
| **FAQ** | `consulting firm`, `consulting company`, or `consulting services` in 2-3 FAQ answers — FAQ is high-value for long-tail commercial queries |
| **CTA / Form** | `consulting firm` or `consulting services` in CTA text or form follow-up |
| **Connected Services** | Skip — these link to other pages |
| **Testimonials** | NEVER modify — client quotes must remain authentic |
| **Logo Wall** | `consulting firm` or `consulting partner` once in intro text |
| **Resources / Blog** | Skip unless a blog title naturally fits a variation |

### Step 4: Inject variations into content

**Rules for injection — contextual, never forced:**

1. **Read the sentence first** — only add a variation if the sentence structure already accommodates it or needs minimal rewording. If you have to restructure the sentence to fit the keyword, skip it.
2. **One variation per paragraph max** — never put two commercial-intent variations in the same paragraph
3. **Vary the suffixes** — don't repeat "consulting firm" 10 times. Spread across consulting, firm, company, services, provider, experts, specialists, solutions
4. **Headings get priority** — a variation in an H2 or H3 carries more SEO weight than one buried in body text. Prioritize heading placements.
5. **Natural phrasing patterns** — these variations work best in sentences like:
   - "As a leading [service] consulting firm, Edstellar..."
   - "Our [service] consulting services help enterprises..."
   - "Choose Edstellar as your [service] consulting partner..."
   - "Work with a [service] consulting company that..."
   - "Edstellar's [service] specialists design..."
   - "...delivered by experienced [service] experts"
6. **Never add to client quotes or testimonial text**
7. **Never add to code blocks, URLs, or technical identifiers**
8. **Preserve the author's voice** — the content should still sound like it was written by one person, not keyword-optimized by a tool
9. **Target count:** Aim for **15-25 commercial-intent variation insertions** across the full page. More than 25 risks feeling forced. Fewer than 15 misses the SEO opportunity.

### Step 5: Remove all em-dashes

Scan the entire content and replace every em-dash character (—) with a comma followed by a space (, ). This applies to:
- Headings and subheadlines
- Body paragraphs and descriptions
- List items and bullet points
- FAQ questions and answers
- Stat labels and context text
- CTA text and form descriptions
- All other visible text

Also remove any Unicode variants:
- `—` (em-dash, U+2014) → `, `
- `–` (en-dash, U+2013) → `, `
- `---` (triple hyphen used as em-dash) → `, `
- `--` (double hyphen used as em-dash) → `, `

**Do NOT replace:**
- Single hyphens (-) used in compound words (e.g., "well-known", "decision-making")
- Hyphens in slugs, URLs, or file names
- Hyphens in CSS class names or code blocks

### Step 6: Output the optimized content

Save the optimized content file to:
```
output/[page-slug]-optimized.md
```

The output file must:
- Preserve the exact same section structure and order as the original content file
- Contain all the same content with commercial-intent variations naturally integrated
- Have zero em-dashes or en-dashes in text content
- Include a metadata header showing what was done:

```markdown
# Keyword-Optimized Content

**Source:** content/[filename]
**Date:** [date]
**Core service:** [service name]
**Commercial-intent variations generated:** [list all variations]
**Sections optimized:** [N]
**Variations injected:** [count of new commercial-intent keyword insertions]
**Em-dashes removed:** [count]

---

[Full optimized content follows, section by section]
```

### Step 7: Generate the optimization report

After the optimized content, append a summary table:

```markdown
---

## Keyword Optimization Summary

| Section | Variation Added | Placement (heading/body) | Notes |
|---|---|---|---|
| Hero | "consulting services" | body | Added to hero description |
| Why Choose | "consulting firm" | body | Added to differentiator 1 |
| FAQ Q3 | "consulting company" | body | Added to answer |
| ... | ... | ... | ... |

### Commercial-intent variation distribution
- **consulting:** [X] occurrences
- **consulting firm:** [X] occurrences
- **consulting company:** [X] occurrences
- **consulting services:** [X] occurrences
- **company:** [X] occurrences
- **firm:** [X] occurrences
- **provider:** [X] occurrences
- **services:** [X] occurrences
- **solutions:** [X] occurrences
- **experts:** [X] occurrences
- **specialists:** [X] occurrences
- **Total commercial-intent variations injected:** [N]
- **Total em-dashes removed:** [N]
```

## Rules

1. **Contextual, never forced** — if a variation doesn't fit naturally in a sentence, skip it entirely. No sentence restructuring to accommodate keywords.
2. **Never stuff keywords** — one variation per paragraph max, 15-25 total across the full page
3. **Vary the suffixes** — spread across consulting/firm/company/services/provider/experts/specialists/solutions. No single suffix should appear more than 4-5 times.
4. **Preserve all formatting** — headings, lists, tables, bold, italics must remain intact
5. **Preserve section boundaries** — do not merge, split, or reorder sections
6. **The optimized file replaces the original content file** as input for the page-assembler — it must be complete and self-contained
7. **If no SEO metadata block exists** in the content file, ask the user for the core service name before proceeding
8. **Always output both** the optimized content file AND the summary report in the same file
9. **Em-dash removal is mandatory** — this is not optional, even if no variations need to be added
10. **Do not modify code blocks, URLs, or technical identifiers** — only optimize human-readable text content
11. **Never modify client quotes or testimonial text** — those must remain authentic
