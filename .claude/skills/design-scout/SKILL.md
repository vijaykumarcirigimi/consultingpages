---
name: design-scout
description: Analyze a consulting page content file and match each section to available HTML designs in the library. Produces a report mapping sections to designs. When no library design matches, generates a custom inline design specification using the Edstellar brand system. Zero content is ever skipped.
---

# Design Scout

You analyze consulting page content files and produce a structured report that maps every section to a design — either an existing library design or a custom inline design you specify. **No content from the document is ever skipped or flagged as a gap.**

## Process

1. **Read the library index** at `library/library-index.json` — this is your source of truth for what designs exist
2. **Parse the content file** provided by the user and identify every section
3. **Match each section** to the best library design variant
4. **For unmatched sections** — instead of flagging as "NEEDS DESIGN", create a **custom design specification** that the page-assembler can build inline. Include the CSS class names, layout structure, HTML skeleton, and content mapping.
5. **Output the report** with the complete mapping (to file or in memory as directed)

## Section recognition

Use these patterns to identify sections in content files:

| Content pattern | Library category |
|---|---|
| Hero, banner, headline + CTA, above the fold | `hero` |
| Stats, numbers, metrics, trust badges, 300+, 95% | `stats` |
| Problem, challenge, pain point, what we solve | `problem_statement` |
| Services, what we offer, capabilities, consulting services | `services` |
| Sub-services, service cards with images, service list linking | `sub_services` |
| Service detail, how we deliver, capability deep-dive, expanded | `service_detail` |
| Why us, differentiators, what makes us different, our value | `differentiators` |
| Download, resource, template, framework, free guide, asset | `download_asset` |
| Success stories, case studies, client results, impact | `success_stories` |
| Testimonials, client quotes, what clients say | `testimonials` |
| FAQ, frequently asked, common questions | `faq` |
| Resources, blog, insights, articles | `resources` |
| Form, contact, schedule, book, consultation, lead capture | `form` |
| Industries, use cases, sectors, who we serve | `industries` |
| Process steps, methodology, how it works (numbered steps) | `process` |
| Ranked list, volume table, leaderboard, most requested | `ranked_leaderboard` |
| Closed-loop model, cycle diagram, circular process | `closed_loop_cycle` |
| Connected services, related services, ecosystem | `connected_services` |
| Team, our consultants, meet the team | Custom design needed |
| Pricing, packages, plans | Custom design needed |
| Comparison table, before vs after, metrics table | Custom design needed |
| Any other content section not in the library | Custom design needed |

## Matching logic

For each identified section:
1. Find the matching library category from `library-index.json`
2. If multiple variants exist, pick the best one based on:
   - Does the content have images? → prefer variants with image support
   - Does the content have stats/numbers? → prefer variants with stat displays
   - Is interactivity needed (tabs, carousel, accordion)? → prefer interactive variants
   - Is the section on a light or dark background context? → match accordingly
3. Provide a 1-line reason for your choice
4. List alternatives from the same category

## Custom design specification (for unmatched sections)

When NO library design matches a content section, do NOT skip it. Instead, produce a **custom design spec** that gives the page-assembler everything it needs to build the section inline. The spec must follow the Edstellar brand system exactly.

### Brand system reference
- **Colors:** navy (#2D2F6B), lime (#C5E826), use existing CSS variables (--navy, --lime, --surface, --text-primary, etc.)
- **Font:** Inter (var(--font))
- **Border radius:** var(--radius), var(--radius-lg), var(--radius-xl)
- **Max width:** 1060px or 1120px centered
- **Padding:** 64px 48px desktop, 40px 20px mobile
- **Section backgrounds:** alternate between var(--surface), var(--light-bg), var(--navy)

### Custom design spec format

For each unmatched section, include:

```markdown
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #[kebab-case-id]
- **Background:** [var(--surface) | var(--light-bg) | var(--navy)]
- **Layout:** [description — e.g., "centered heading + 3-column card grid" or "split 45/55 with left image"]
- **CSS class prefix:** [unique prefix to avoid conflicts — e.g., `.bt-` for before/after table]
- **HTML structure:**
  ```html
  [Complete HTML skeleton with class names and placeholder content markers like {heading}, {item.title}, {item.value}]
  ```
- **CSS rules:** [Complete CSS for the section — must use existing CSS variables, follow the brand system, include responsive breakpoints]
- **Content mapping:** [How to map content file data into the HTML structure — e.g., "Row 1: {metric} | {outcome} | {result}"]
- **JS required:** [none | description of any interactivity needed]
```

### Design patterns to draw from

When creating custom designs, use visual patterns already established in the library:
- **Navy numbered circles** → from process stepper or closed-loop cycle
- **Lime accent bars** → from stat cards or differentiator list
- **Card grids** → from sub-services or industries
- **Hover transitions** → 0.25s, translateY(-3px), box-shadow: 0 8px 28px rgba(45,47,107,0.06)
- **Split layouts** → 42%/55% or 45%/52% with gap
- **Section labels** → `.section-label` with `.bar` + uppercase span
- **Responsive patterns** → stack to 1-column below 768px

## Report format

Output this exact structure:

```markdown
# Design Scout Report

**Page:** [Name]
**Date:** [Date]
**Sections identified:** [N]
**Library matched:** [N] | **Custom designs:** [N]

---

## Section mapping

### 1. [Section name]
- **Content summary:** [1-line]
- **Status:** ✅ MATCHED
- **Library category:** [key]
- **Recommended:** `[filename]` ([variant id])
- **Why:** [1-line reason]
- **Alternatives:** [other variants if any]

### 2. [Section name]
- **Content summary:** [1-line]
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #[id]
- **Background:** [value]
- **Layout:** [description]
- **CSS class prefix:** [prefix]
- **HTML structure:** [skeleton]
- **CSS rules:** [complete CSS]
- **Content mapping:** [instructions]
- **JS required:** [none or description]

---

## Recommended page flow

1. `[filename]` — [Section name]
2. `[filename]` — [Section name]
3. `CUSTOM: #[id]` — [Section name]
...

---

## Notes
[Any observations]
```

## Rules

1. Always read `library/library-index.json` FIRST — never assume what exists
2. One recommended design per section — don't suggest multiple for the same section
3. Be specific about WHY a variant was chosen
4. **NEVER skip content** — every section in the content file MUST appear in the report with either a library match or a custom design spec
5. **NEVER flag sections as "NEEDS DESIGN" and leave them** — always provide the custom design spec so the page-assembler can build it
6. Preserve section order from the content file
7. If content is ambiguous, infer the most likely section type from context rather than skipping
8. Custom designs must be complete enough that the page-assembler can build them without reading additional files — include full CSS, HTML structure, and content mapping
9. Custom design CSS must use existing CSS variables and follow the brand system — do not introduce new colors or font families
10. After the page is built, save new custom designs as standalone HTML files in the `library/` folder and update `library/library-index.json` so they can be reused on future pages
