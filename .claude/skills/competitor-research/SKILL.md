---
name: competitor-research
description: Research 3-5 competitor consulting pages for a given service topic. Extracts section patterns, service framing, stats/proof points, differentiators, and content structure. Outputs a structured research brief that feeds directly into content writing for Edstellar consulting pages.
---

# Competitor Research

You research competitor consulting service pages for a given topic and produce a structured research brief. The brief gives the content writer everything they need to create an Edstellar consulting page content file — without doing keyword research.

## Inputs

The user provides:
1. **Page topic** — the consulting service name (e.g., "Managed Training Services", "Coaching Services")
2. **Page type** — Main page or Sub page
3. **Parent page** (if sub page) — the parent service it falls under
4. **Any context** — notes from the tracker, existing Edstellar pages that relate

## Process

### Step 1: Identify competitors to research

Search the web for the page topic + "consulting services" or "enterprise [topic]". Target these types of competitors:
- **Big 4 / management consulting**: Deloitte, McKinsey, BCG, Korn Ferry, Mercer
- **HR / L&D specialists**: Kincentric, DDI, SHL, Hogan, SHRM, ATD
- **Training / learning companies**: GP Strategies, Skillsoft, CrossKnowledge, LEO Learning
- **Boutique consulting**: any specialist firm ranking well for the topic

Select **3-5 competitor pages** that are most relevant and content-rich.

### Step 2: Analyze each competitor page

For each competitor page, extract:

**A) Page structure** — What sections does the page have? (hero, services list, methodology, case studies, CTA, etc.)

**B) Service framing** — How do they position this service?
- What headline/value proposition do they lead with?
- What pain points do they address?
- How do they describe their approach?

**C) Service offerings** — What specific sub-services or capabilities do they list?
- Bullet points, service cards, expandable sections
- Any unique offerings competitors emphasize

**D) Stats & proof points** — Any numbers, metrics, or evidence they use
- Client counts, success rates, years of experience
- Industry stats, research citations (e.g., "70% of transformations fail")
- ROI claims, benchmark data

**E) Differentiators** — What do they claim makes them different?
- Methodology names, proprietary frameworks
- Technology/platform mentions
- Global reach, industry specialization claims

**F) Process/methodology** — How do they describe their delivery approach?
- Step-by-step process
- Phase names and descriptions
- Timelines mentioned

**G) Content patterns** — Notable content elements
- FAQ questions they answer
- Downloadable resources they offer
- Case study themes
- Industries they highlight

### Step 3: Synthesize findings

After analyzing all competitors, produce a synthesis that identifies:

1. **Common patterns** — What do most/all competitors include? (these are table stakes)
2. **Gaps and opportunities** — What do competitors miss that Edstellar could own?
3. **Best-in-class examples** — Which competitor does each element best?
4. **Recommended Edstellar angle** — How should Edstellar position differently?

### Step 4: Map to Edstellar page structure

Based on the research, recommend content for each section of the Edstellar page template:

- **Hero**: Recommended headline angle, description themes, trust points
- **Stats**: Which 4 stats to feature (from Edstellar's standard stats or topic-specific ones found in research)
- **Problem statement**: Top 3-6 challenges/pain points found across competitors
- **Services**: Recommended service areas and sub-capabilities to highlight
- **Process**: Recommended methodology steps (typically 4-5 phases)
- **FAQ**: Top 5 questions to answer (based on competitor FAQs + common search intent)
- **Download asset**: Recommended framework/template to offer
- **Connected services**: Which other Edstellar services to cross-link
- **Testimonial angle**: What type of client quote would be most impactful

## Output format

```markdown
# Competitor Research Brief

**Page:** [Topic name]
**Type:** [Main / Sub] | **Parent:** [Parent page or NA]
**Date:** [Date]
**Competitors analyzed:** [N]

---

## Competitors Scanned

### 1. [Competitor Name] — [Page Title]
- **URL:** [URL]
- **Headline:** [Their main headline/value prop]
- **Pain points addressed:** [List]
- **Services/capabilities listed:** [List]
- **Stats used:** [Any numbers/proof points]
- **Differentiators claimed:** [List]
- **Process/methodology:** [Steps if any]
- **Notable content:** [FAQs, downloads, case studies]

### 2. [Competitor Name] — [Page Title]
[Same structure]

### 3. [Competitor Name] — [Page Title]
[Same structure]

[... up to 5 competitors]

---

## Synthesis

### Common patterns (table stakes)
- [What every competitor includes — Edstellar must have these]

### Gaps & opportunities
- [What competitors miss — Edstellar can differentiate here]

### Best-in-class examples
- [Which competitor does X best, and what to learn from it]

---

## Recommended Edstellar Content Structure

### Hero
- **Headline angle:** [Recommended H1 direction]
- **Description themes:** [Key themes to hit]
- **Trust points:** [3 checkmark items]

### Problem Statement
- **Recommended challenges (3-6):**
  1. [Challenge + why it matters]
  2. [Challenge]
  3. [Challenge]

### Service Areas
- **Recommended structure:**
  - Service A: [Name] — [What it covers]
  - Service B: [Name] — [What it covers]
  - Service C: [Name] — [What it covers]
- **Key capabilities to highlight per service:** [Lists]

### Data Visualizations
- **Recommended visuals per service area:** [Scorecard, heatmap, framework diagram, etc.]

### Process / Methodology
- **Recommended phases:**
  1. [Phase name] — [What happens] — [Duration estimate]
  2. [Phase]
  3. [Phase]
  4. [Phase]

### FAQ
- **Top 5 questions to answer:**
  1. [Question]
  2. [Question]
  3. [Question]
  4. [Question]
  5. [Question]

### Download Asset
- **Recommended:** [Framework/template name and what it should contain]

### Connected Services
- **Cross-links:** [3-6 related Edstellar services]

### Testimonial Angle
- **Ideal quote theme:** [What the testimonial should demonstrate]
- **Ideal author role:** [CHRO, VP L&D, etc.]

---

## Raw Notes
[Any additional observations, interesting competitor copy, or reference links]
```

## Rules

1. **Always scan real competitor pages** — use web search and web fetch to find and read actual competitor content. Never fabricate competitor data.
2. **3-5 competitors minimum** — fewer than 3 gives an incomplete picture
3. **Focus on enterprise consulting competitors** — skip generic blog posts, listicles, or tool vendor pages unless they have genuine consulting service pages
4. **No keyword research** — this skill focuses on competitor positioning, content structure, and proof points. Keyword mapping is a separate activity.
5. **Map findings to Edstellar's page template** — the output should be directly usable by a content writer creating an Edstellar docx file
6. **Note the source** — always include the competitor URL so findings can be verified
7. **Be specific** — "competitors mention AI" is useless. "Deloitte highlights a 6-dimension AI readiness framework covering Skills, Leadership, Data, Governance, Culture, Infrastructure" is useful.
8. **Output goes to `output/` folder** — save as `output/[topic-slug]-research.md`

## Batch mode

The user can provide multiple topics at once. Run them sequentially, producing one research brief per topic. For efficiency, note any cross-competitor overlaps (e.g., if the same Deloitte page covers both "Assessment Centers" and "Coaching", reference it in both briefs rather than re-scanning).

## Example invocation

```
Research competitors for "Managed Training Services" using the competitor-research skill. This is a Main page with no parent. Save the brief to output/managed-training-services-research.md
```

```
Research competitors for these pages using the competitor-research skill:
1. Learning Governance, Analytics & ROI (Sub page under L&D Consulting)
2. Digital Learning Ecosystem Design (Sub page under Learning Content)
Save briefs to output/
```
