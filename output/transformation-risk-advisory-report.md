# Design Scout Report

**Page:** Transformation & Risk Advisory
**Date:** 2026-03-27
**Sections identified:** 14
**Library matched:** 14 | **Custom designs:** 0

---

## Section mapping

### 1. Hero Banner
- **Content summary:** Breadcrumb + H1 "Transformation & Risk Advisory for Enterprise Organizations" + description + dual CTAs (Request Advisory Consultation / Explore Services) + Transformation Readiness Overview dashboard (Change Readiness 72%, AI Readiness 46%, Capability Risk HIGH, etc.)
- **Status:** ✅ MATCHED
- **Library category:** hero
- **Recommended:** `edstellar-hero-classic-split.html` (hero-classic-split)
- **Why:** Split layout with breadcrumb, dual CTA, and image placeholder — the readiness overview dashboard replaces the image placeholder as a styled panel (built inline by page-assembler as a brand-styled dashboard card within the existing image container)
- **Alternatives:** None in category

### 2. Stats / Trust Numbers
- **Content summary:** 4 metrics — 14+ Years Enterprise Experience, 5,000+ Expert Practitioners Globally, 100+ Global Delivery Locations, Fortune 500 Client Portfolio
- **Status:** ✅ MATCHED
- **Library category:** stats
- **Recommended:** `edstellar-stats-card-grid.html` (stats-card-grid)
- **Why:** Standard 4-column navy card grid below hero for trust metrics
- **Alternatives:** `edstellar-stats-icon-cards.html` (stats-icon-cards)

### 3. Client Logo Wall
- **Content summary:** VISA, ABB, ADITYA BIRLA, and other Fortune 500 organizations
- **Status:** ✅ MATCHED
- **Library category:** logo_wall
- **Recommended:** `edstellar-logo-wall.html` (logo-wall-navy)
- **Why:** Navy brand tag grid for Fortune 500 social proof
- **Alternatives:** None in category

### 4. Problem Statement with Evidence Stats
- **Content summary:** "Most Transformations Fail Before They Start" — editorial heading + 3 stat evidence cards: 70% transformation failure rate, 54% AI initiatives stalled, 3× cost of reactive response
- **Status:** ✅ MATCHED
- **Library category:** stats
- **Recommended:** `edstellar-stats-icon-cards.html` (stats-icon-cards)
- **Why:** Left editorial heading with label (32%) + right stat card grid (64%) — ideal for presenting problem evidence with narrative context; the editorial heading frames the problem while stat cards deliver impact data
- **Alternatives:** `edstellar-challenges-section.html` (challenges-card-grid) — if stat emphasis were less important than challenge descriptions

### 5. Three Capabilities Overview
- **Content summary:** "Three Capabilities. One Integrated Advisory Practice." — 3 service cards: Change & Transformation Enablement, AI Readiness Audit & Transformation, Organizational Risk Assessment — each with icon, title, description, and CTA link
- **Status:** ✅ MATCHED
- **Library category:** three_pillars
- **Recommended:** `edstellar-three-pillars-cards.html` (three-pillars-cards)
- **Why:** 3-column card grid with lime accent bars and icons — exact match for a 3-pillar service overview with explore CTAs
- **Alternatives:** None in category

### 6. Service Areas Detail (Change Enablement, AI Readiness, Organizational Risk)
- **Content summary:** 3 detailed service areas — each with heading, 2-paragraph description, 5–6 bullet points, and embedded data visualization (Change Architecture Framework diagram, AI Readiness 6-dimension scorecard, Organizational Risk Heat Map)
- **Status:** ✅ MATCHED
- **Library category:** service_detail
- **Recommended:** `edstellar-detailed-explanation-of-service-with-image-and-accordion.html` (detail-accordion-with-image)
- **Why:** 3 numbered accordion blocks (01–03) with expand/collapse, image area per block, and bullet sub-features — the data visualizations (framework diagram, scorecard, heat map) render in each block's image area; interactive exploration keeps the page compact
- **Alternatives:** `edstellar-outcomes-horizontal-tabs.html` (outcomes-horizontal-tabs) — if horizontal tabs with rich embeds were preferred over accordion

### 7. Five Risk Dimensions
- **Content summary:** "What Edstellar's Organizational Risk Assessment Covers" — 5 cards: Capability Risk, Talent Concentration, Succession Risk, Culture Risk, Transformation Risk — each with title + description
- **Status:** ✅ MATCHED
- **Library category:** industries
- **Recommended:** `edstellar-industries-icon-grid.html` (industries-icon-grid)
- **Why:** 3x3 icon card grid on white background — uses 5 of 9 slots (3+2 centered), with icon circles and short descriptions per card; clean scannable layout matches the risk dimension content structure
- **Alternatives:** `edstellar-industries-navy-split.html` (industries-navy-split) — if dark background were preferred

### 8. Delivery Process
- **Content summary:** "How Edstellar Delivers Transformation & Risk Advisory" — 4 phases: Diagnostic Discovery (2–4 weeks), Analysis & Framework (3–6 weeks), Intervention Design (4–8 weeks), Execution & Tracking (Ongoing)
- **Status:** ✅ MATCHED
- **Library category:** process
- **Recommended:** `edstellar-process-vertical-stepper.html` (process-vertical-stepper)
- **Why:** Navy background with vertical timeline, numbered step markers, and lime duration badges — premium dark section with ample content space per step; pairs well after the light risk dimensions section
- **Alternatives:** `edstellar-process-horizontal-timeline.html` (process-horizontal-timeline); `edstellar-process-card-grid.html` (process-card-grid)

### 9. Client Testimonial
- **Content summary:** VP of Digital Transformation quote from Global Technology Firm about AI readiness audit impact and organizational readiness diagnosis
- **Status:** ✅ MATCHED
- **Library category:** testimonials
- **Recommended:** `edstellar-testimonials-section-with-small-user-thumbnail.html` (testimonials-split-carousel)
- **Why:** Left heading + right quote card with avatar initials — works for single featured testimonial
- **Alternatives:** None in category

### 10. Download Asset
- **Content summary:** "Download: Transformation Readiness Assessment Framework" — diagnostic toolkit for CHROs covering change readiness scoring, AI maturity benchmarks, risk prioritization
- **Status:** ✅ MATCHED
- **Library category:** download_asset
- **Recommended:** `edstellar-download-asset-option-c.html` (download-banner-card)
- **Why:** Navy card with left text + right asset preview — compact, self-contained; navy background creates contrast
- **Alternatives:** `edstellar-download-asset-option-a.html` (download-split-preview)

### 11. Connected Services
- **Content summary:** "From Advisory Insight to Workforce Action" — 3 connected services: Talent Diagnostic Solutions, AI & Digital Transformation Training, Skills Intelligence & SBO
- **Status:** ✅ MATCHED
- **Library category:** connected_services
- **Recommended:** `edstellar-connected-services-card-strip.html` (connected-card-strip)
- **Why:** 3-column white cards on light background — exact match for 3 connected services with icon, title, description, and arrow CTA
- **Alternatives:** `edstellar-connected-services-navy-scroll.html` (connected-navy-scroll) — if more than 3 services needed

### 12. FAQ
- **Content summary:** "Transformation & Risk Advisory — What You Need to Know" — 5 questions covering change enablement, AI readiness audit vs tech assessment, risk dimensions, service integration, and engagement timelines
- **Status:** ✅ MATCHED
- **Library category:** faq
- **Recommended:** `edstellar-faq-section.html` (faq-accordion)
- **Why:** Standard 5-question accordion FAQ — exact match
- **Alternatives:** None in category

### 13. Lead Capture Form
- **Content summary:** "Ready to Transform with Confidence?" — consultation CTA with advisory consultation button
- **Status:** ✅ MATCHED
- **Library category:** form
- **Recommended:** `edstellar-form-section.html` (form-split-image)
- **Why:** Standard lead capture form as conversion endpoint for consulting pages
- **Alternatives:** None in category

### 14. Footer
- **Content summary:** Standard site footer
- **Status:** ✅ MATCHED
- **Library category:** footer
- **Recommended:** `edstellar-footer.html` (footer-centered)
- **Why:** Standard footer for all consulting pages
- **Alternatives:** None in category

---

## Recommended page flow

1. `edstellar-hero-classic-split.html` — Hero Banner (with readiness dashboard in image area)
2. `edstellar-stats-card-grid.html` — Stats / Trust Numbers
3. `edstellar-logo-wall.html` — Client Logo Wall
4. `edstellar-stats-icon-cards.html` — Problem Statement with Evidence Stats
5. `edstellar-three-pillars-cards.html` — Three Capabilities Overview
6. `edstellar-detailed-explanation-of-service-with-image-and-accordion.html` — Service Areas Detail (3 accordion blocks)
7. `edstellar-industries-icon-grid.html` — Five Risk Dimensions
8. `edstellar-process-vertical-stepper.html` — Delivery Process
9. `edstellar-testimonials-section-with-small-user-thumbnail.html` — Client Testimonial
10. `edstellar-download-asset-option-c.html` — Download Asset
11. `edstellar-connected-services-card-strip.html` — Connected Services
12. `edstellar-faq-section.html` — FAQ
13. `edstellar-form-section.html` — Lead Capture Form
14. `edstellar-footer.html` — Footer

---

## Notes
- The Transformation Readiness Overview dashboard (Change Readiness 72%, AI Readiness 46%, Capability Risk HIGH, Succession Risk MEDIUM, Culture Risk LOW) should be built as a styled panel within the hero's image placeholder area — using navy cards with lime/red/amber indicators matching the brand system.
- The problem statement uses stats-icon-cards instead of challenges-card-grid because the content is structured as stat-evidence rather than pain-point descriptions — the editorial heading provides narrative framing while stat cards deliver quantified impact.
- The 3 service areas (Change Enablement, AI Readiness, Organizational Risk) use the accordion variant to give each service its own expandable block with data visualization — the Change Architecture Framework, AI Readiness 6-dimension scorecard, and Risk Heat Map are built as rich HTML within each accordion block's image area.
- Five Risk Dimensions reuses the industries-icon-grid layout (5 of 9 slots) since the content structure (icon + title + description cards) matches perfectly despite different semantic context.
- Connected services section uses the 3-column card strip since exactly 3 services are listed.
