# Design Scout Report

**Page:** Training Needs Analysis Services
**Date:** 2026-03-21
**Sections identified:** 22 (18 content sections + 2 SEO additions + form + footer)
**Library matched:** 16 | **Custom designs:** 6

---

## Section mapping

### 1. Hero Banner
- **Content summary:** Badge "Enterprise Capability Diagnostics" + H1 "Training Needs Analysis Services" + tagline + 2x2 highlights grid + dual CTA (Book Consultation / Download Sample Report) + TNA Executive Dashboard sample block
- **Status:** ✅ MATCHED
- **Library category:** hero
- **Recommended:** `edstellar-hero-classic-split.html` (hero-classic-split)
- **Why:** Split layout with H1 left, image right. The 2x2 highlights grid maps to checkmark trust points. Dashboard sample can be placed as the right-side visual.
- **Content mapping notes:**
  - Eyebrow: "Enterprise Capability Diagnostics"
  - H1: "Training Needs Analysis Services"
  - Subtitle: "Data-driven capability diagnostics that align learning investments to business performance, risk, and ROI."
  - Trust points: "Business-aligned Training Needs Analysis Services" | "Role and risk-based Training Needs Analysis" | "Measurable training outcomes and ROI visibility"
  - Primary CTA: "Book a Diagnostic Consultation"
  - Secondary CTA: "Download Sample TNA Report"
  - Breadcrumb: Home > Corporate Training > Training Needs Analysis Services

### 2. What Is Training Needs Analysis (SEO Addition)
- **Content summary:** Definitional H2 explaining what TNA/LNA is, referencing ADDIE framework, 120-150 words
- **Status:** ✅ MATCHED
- **Library category:** definitional_intro
- **Recommended:** `edstellar-definitional-intro.html` (definitional-intro)
- **Why:** Centered narrow container with label + H2 + 2 paragraphs — perfect for definitional content
- **Content mapping notes:**
  - Label: "Understanding TNA"
  - H2: "What Is Training Needs Analysis (TNA)?"
  - Lead paragraph: "A Training Needs Analysis (TNA), also known as a Learning Needs Analysis (LNA), is a structured diagnostic process that identifies the gap between your workforce's current capabilities and the skills required to meet business objectives. Rooted in the ADDIE framework, TNA provides the evidence base for every training investment decision."
  - Second paragraph: "Rather than assuming what training your teams need, a properly conducted TNA uses multi-source data to pinpoint exactly where skill gaps exist, which roles are most affected, and what the business impact of those gaps is, enabling precise, ROI-driven learning investments."

### 3. Strategic Alignment Intro
- **Content summary:** H2 "Training Needs Analysis for Business-Aligned Prioritization" + body paragraph about diagnosis-led training
- **Status:** ✅ MATCHED
- **Library category:** closed_loop_cycle
- **Recommended:** `edstellar-closed-loop-cycle.html` (closed-loop-cycle)
- **Why:** 4-step connected cycle matches the 4-step diagnostic-to-prioritization flow (Business Goals → Role Expectations → Skill Requirements → Learning Priorities). Centered heading with callout card for supporting text.
- **Content mapping notes:**
  - H2: "Training Needs Analysis for Business-Aligned Prioritization"
  - Step 1: "Business Goals" / "Revenue, growth, transformation targets"
  - Step 2: "Role Expectations" / "Performance standards by job family"
  - Step 3: "Skill Requirements" / "Competency gaps and skill gaps analysis"
  - Step 4: "Learning Priorities" / "Risk-ranked, ROI-driven interventions"
  - Callout: "Diagnosis-led training converts learning investment into measurable performance impact."

### 4. Stats Strip
- **Content summary:** 3 stat metrics (68%, 3.2x, 41%) with descriptions
- **Status:** ✅ MATCHED
- **Library category:** stats
- **Recommended:** `edstellar-stats-card-grid.html` (stats-card-grid)
- **Why:** Navy card grid for stat metrics — use 3 cards instead of 4
- **Content mapping notes:**
  - Stat 1: "68%" / "of enterprise training spend addresses low-priority skill gaps"
  - Stat 2: "3.2x" / "higher ROI when learning investments are diagnostically prioritized"
  - Stat 3: "41%" / "of performance issues traced to non-training root causes via TNA"

### 5. Supporting Pillars
- **Content summary:** 3-column card row (Stakeholder Alignment, Comprehensive Assessments, Clear Training Roadmap)
- **Status:** ✅ MATCHED
- **Library category:** three_pillars
- **Recommended:** `edstellar-three-pillars-cards.html` (three-pillars-cards)
- **Why:** Exactly 3 pillars with titles + descriptions on light background
- **Content mapping notes:**
  - Card 1: "Stakeholder Alignment" / "Work closely with stakeholders to ensure training goals are aligned with organizational priorities."
  - Card 2: "Comprehensive Assessments" / "Collect and integrate data from various sources to identify skill gaps and development opportunities."
  - Card 3: "Clear Training Roadmap" / "Develop a tailored training roadmap that translates identified needs into actionable programs and measurable outcomes."

### 6. Stakeholder Relevance (3 Personas)
- **Content summary:** H2 + intro + 3-column persona grid (CHROs, BU Heads, HRBPs) + callout + CTA
- **Status:** ✅ MATCHED
- **Library category:** benefit_pillars
- **Recommended:** `edstellar-benefit-pillars-4col.html` (benefit-pillars-4col)
- **Why:** Navy background numbered cards work well for persona targeting. Use 3 of the 4 columns, or add the callout as the 4th card.
- **Content mapping notes:**
  - Label: "Stakeholder Relevance"
  - H2: "Leadership & Transformation Teams Enabled by Edstellar's TNA"
  - Intro: "TNA delivers decision-grade insights for every leader involved in workforce capability, training investment, or organizational transformation."
  - Card 01: "CHROs & L&D Leaders" / "Prioritize training spend with evidence..."
  - Card 02: "BU / Functional Heads" / "Close role-critical capability gaps..."
  - Card 03: "HRBPs & Transformation Teams" / "Separate training vs. structural issues..."
  - Card 04: "Not Sure Where to Start?" / "If you're unsure what to train, who to train, or whether training is even the right solution, Training Needs Analysis is the right starting point."

### 7. Business Priorities Table + Before/After
- **Content summary:** H2 + intro + 6-row business priority table + 5-row before/after comparison table
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #business-priorities
- **Background:** var(--surface)
- **Layout:** Centered heading + intro, then 6-row card list for priorities (icon + title + description), followed by a before/after comparison table with red "Before" column and lime "After" column
- **CSS class prefix:** `.bp-`
- **HTML structure:**
  ```html
  <section id="business-priorities" class="bp-section">
    <div class="bp-container">
      <div class="bp-label"><span class="bp-bar"></span><span>Business Priorities</span></div>
      <h2 class="bp-heading">{heading}</h2>
      <p class="bp-intro">{intro}</p>
      <div class="bp-list">
        <div class="bp-item"><div class="bp-accent"></div><div><h4>{title}</h4><p>{description}</p></div></div>
        <!-- repeat 6x -->
      </div>
      <div class="bp-compare">
        <h3 class="bp-compare-title">Before vs. After Edstellar's TNA</h3>
        <div class="bp-table">
          <div class="bp-table-header"><span>Decision Dimension</span><span>Before TNA</span><span>After Edstellar's TNA</span></div>
          <div class="bp-table-row"><span>{dimension}</span><span class="bp-before">{before}</span><span class="bp-after">{after}</span></div>
          <!-- repeat 5x -->
        </div>
      </div>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .bp-section { padding: 72px 48px; background: var(--surface); }
  .bp-container { max-width: 1120px; margin: 0 auto; }
  .bp-label { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .bp-label .bp-bar { width: 28px; height: 3px; background: var(--lime); }
  .bp-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--navy); }
  .bp-heading { font-size: 32px; font-weight: 800; color: var(--navy); margin-bottom: 12px; line-height: 1.2; }
  .bp-intro { font-size: 15px; color: var(--text-secondary); line-height: 1.65; max-width: 700px; margin-bottom: 36px; }
  .bp-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 48px; }
  .bp-item { display: flex; gap: 16px; padding: 20px 0; border-bottom: 1px solid var(--border); }
  .bp-item:first-child { padding-top: 0; }
  .bp-item:last-child { border-bottom: none; }
  .bp-accent { width: 4px; min-height: 36px; border-radius: 2px; flex-shrink: 0; margin-top: 2px; }
  .bp-item:nth-child(odd) .bp-accent { background: var(--navy); }
  .bp-item:nth-child(even) .bp-accent { background: var(--lime); }
  .bp-item h4 { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .bp-item p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
  .bp-compare-title { font-size: 22px; font-weight: 700; color: var(--navy); margin-bottom: 20px; }
  .bp-table { border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
  .bp-table-header { display: grid; grid-template-columns: 1fr 1fr 1fr; background: var(--navy); padding: 14px 20px; }
  .bp-table-header span { font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.04em; }
  .bp-table-row { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 14px 20px; border-bottom: 1px solid var(--border); align-items: start; }
  .bp-table-row:last-child { border-bottom: none; }
  .bp-table-row span:first-child { font-size: 14px; font-weight: 700; color: var(--navy); }
  .bp-before { font-size: 13px; color: #C0392B; line-height: 1.5; padding-left: 12px; border-left: 3px solid rgba(231,76,60,0.3); }
  .bp-after { font-size: 13px; color: #1a6b2a; line-height: 1.5; padding-left: 12px; border-left: 3px solid var(--lime); }
  @media (max-width: 768px) { .bp-section { padding: 40px 20px; } .bp-heading { font-size: 26px; } .bp-table-header, .bp-table-row { grid-template-columns: 1fr; gap: 8px; } }
  ```
- **JS required:** None

### 8. Partner Logos
- **Content summary:** 40+ partner brand names in a grid
- **Status:** ✅ MATCHED
- **Library category:** logo_wall
- **Recommended:** `edstellar-logo-wall.html` (logo-wall-navy)
- **Why:** Navy background brand tag grid — perfect for 40+ brand names

### 9. 5-Phase Methodology
- **Content summary:** H2 + intro + 5 phases with tags, descriptions + gated asset CTA
- **Status:** ✅ MATCHED
- **Library category:** process
- **Recommended:** `edstellar-process-vertical-stepper.html` (process-vertical-stepper)
- **Why:** Navy background with detailed content per step. 5 phases with rich descriptions need the vertical stepper's room.

### 10. Download Asset (Methodology One-Pager)
- **Content summary:** Ungated PDF one-pager download CTA
- **Status:** ✅ MATCHED
- **Library category:** download_asset
- **Recommended:** `edstellar-download-asset-option-c.html` (download-banner-card)
- **Why:** Navy banner card with asset preview — compact self-contained section

### 11. Assessment Types (2x2 Grid)
- **Content summary:** H2 + intro + 4 assessment type cards with 6-7 bullet items each + CTA
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #assessment-types
- **Background:** var(--surface)
- **Layout:** Centered heading + 2x2 card grid. Each card: navy title bar, bullet list, hover effect
- **CSS class prefix:** `.at-`
- **CSS rules:**
  ```css
  .at-section { padding: 72px 48px; background: var(--surface); }
  .at-container { max-width: 1120px; margin: 0 auto; text-align: center; }
  .at-label { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .at-label .at-bar { width: 28px; height: 3px; background: var(--lime); }
  .at-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--navy); }
  .at-heading { font-size: 32px; font-weight: 800; color: var(--navy); margin-bottom: 12px; line-height: 1.2; }
  .at-intro { font-size: 15px; color: var(--text-secondary); line-height: 1.65; max-width: 660px; margin: 0 auto 40px; }
  .at-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; }
  .at-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.25s; }
  .at-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(45,47,107,0.08); border-color: var(--lime); }
  .at-card-header { background: var(--navy); padding: 18px 24px; }
  .at-card-header h3 { font-size: 17px; font-weight: 700; color: #fff; }
  .at-card-body { padding: 20px 24px; }
  .at-card-body ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .at-card-body li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
  .at-card-body li::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--lime); flex-shrink: 0; margin-top: 7px; }
  .at-cta { margin-top: 36px; text-align: center; }
  .at-cta a { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: var(--navy); color: #fff; font-size: 15px; font-weight: 700; border-radius: 8px; text-decoration: none; transition: all 0.25s; }
  .at-cta a:hover { background: #1e2054; transform: translateY(-2px); }
  @media (max-width: 768px) { .at-section { padding: 40px 20px; } .at-heading { font-size: 26px; } .at-grid { grid-template-columns: 1fr; } }
  ```
- **JS required:** None

### 12. Diagnostic Methods (6-Method Evidence Grid)
- **Content summary:** H2 + intro + triangulation rule callout + 6-row method table (Method / Data / Bias Reduced / Decision Enabled)
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #diagnostic-methods
- **Background:** #EEF0F4
- **Layout:** Split heading, then 6 stacked method cards, each with 3 sub-fields
- **CSS class prefix:** `.dm-`
- **CSS rules:**
  ```css
  .dm-section { padding: 72px 48px; background: #EEF0F4; }
  .dm-container { max-width: 1120px; margin: 0 auto; }
  .dm-header { display: grid; grid-template-columns: 45% 52%; gap: 3%; align-items: end; margin-bottom: 20px; }
  .dm-label { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .dm-label .dm-bar { width: 28px; height: 3px; background: var(--lime); }
  .dm-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--navy); }
  .dm-heading { font-size: 30px; font-weight: 800; color: var(--navy); line-height: 1.2; }
  .dm-intro { font-size: 14px; color: var(--text-secondary); line-height: 1.65; }
  .dm-rule { background: var(--navy); border-radius: 12px; padding: 20px 24px; margin-bottom: 32px; display: flex; align-items: flex-start; gap: 14px; }
  .dm-rule-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(197,232,38,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .dm-rule p { font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.6; }
  .dm-rule strong { color: var(--lime); }
  .dm-grid { display: flex; flex-direction: column; gap: 12px; }
  .dm-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 24px; transition: all 0.25s; }
  .dm-card:hover { border-color: var(--lime); box-shadow: 0 4px 16px rgba(45,47,107,0.06); }
  .dm-card h4 { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .dm-card h4::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--lime); flex-shrink: 0; }
  .dm-fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .dm-field-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 4px; }
  .dm-field-text { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
  @media (max-width: 768px) { .dm-section { padding: 40px 20px; } .dm-header { grid-template-columns: 1fr; } .dm-heading { font-size: 26px; } .dm-fields { grid-template-columns: 1fr; } }
  ```
- **JS required:** None

### 13. Deliverables & Outcomes (6 Deliverables A-F)
- **Content summary:** H2 + intro + 6 major deliverables, each with description, bullet features, and sample data tables
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #deliverables
- **Background:** var(--navy)
- **Layout:** Navy background, centered heading, 6 clickable accordion cards. Each card expands to show description + bullet items. Sample data tables omitted from visual (referenced in dev panel).
- **CSS class prefix:** `.dv-`
- **CSS rules:**
  ```css
  .dv-section { padding: 72px 48px; background: var(--navy); }
  .dv-container { max-width: 1060px; margin: 0 auto; text-align: center; }
  .dv-label { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .dv-label .dv-bar { width: 28px; height: 3px; background: var(--lime); }
  .dv-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--lime); }
  .dv-heading { font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 12px; line-height: 1.2; }
  .dv-intro { font-size: 15px; color: #9496B0; line-height: 1.65; max-width: 660px; margin: 0 auto 40px; }
  .dv-list { display: flex; flex-direction: column; gap: 10px; text-align: left; }
  .dv-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; transition: all 0.3s; cursor: pointer; overflow: hidden; }
  .dv-item:hover { background: rgba(255,255,255,0.06); }
  .dv-item.dv-active { border-color: rgba(197,232,38,0.3); background: rgba(255,255,255,0.07); }
  .dv-item-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; gap: 16px; }
  .dv-item-left { display: flex; align-items: center; gap: 14px; }
  .dv-item-letter { font-size: 20px; font-weight: 800; color: var(--lime); min-width: 28px; }
  .dv-item-title { font-size: 17px; font-weight: 700; color: #fff; }
  .dv-item.dv-active .dv-item-title { color: var(--lime); }
  .dv-item-toggle { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.5); font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s; flex-shrink: 0; font-family: var(--font); }
  .dv-item.dv-active .dv-item-toggle { background: var(--lime); border-color: var(--lime); color: var(--navy); transform: rotate(45deg); }
  .dv-item-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s; opacity: 0; }
  .dv-item.dv-active .dv-item-body { max-height: 400px; opacity: 1; }
  .dv-item-content { padding: 0 24px 24px; }
  .dv-item-desc { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.65; margin-bottom: 14px; }
  .dv-bullets { display: flex; flex-direction: column; gap: 8px; }
  .dv-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: rgba(255,255,255,0.85); line-height: 1.5; }
  .dv-bullet::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--lime); flex-shrink: 0; margin-top: 6px; }
  @media (max-width: 768px) { .dv-section { padding: 40px 20px; } .dv-heading { font-size: 26px; } }
  ```
- **JS required:** Accordion toggle — click to expand one item at a time, similar to FAQ toggle

### 14. Download Asset (Skills Gap Workbook)
- **Content summary:** Gated Excel workbook download CTA after deliverables
- **Status:** ✅ MATCHED
- **Library category:** download_asset
- **Recommended:** `edstellar-download-asset-option-a.html` (download-split-preview)
- **Why:** Light background split layout — visual contrast after navy deliverables section

### 15. Process & Timeline
- **Content summary:** H2 + intro + single-row info table (Duration, Scope, Inputs, Stakeholders, After)
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #process-timeline
- **Background:** #EEF0F4
- **Layout:** Centered heading + 5-column info strip with icon headers
- **CSS class prefix:** `.pt-`
- **CSS rules:**
  ```css
  .pt-section { padding: 64px 48px; background: #EEF0F4; }
  .pt-container { max-width: 1060px; margin: 0 auto; text-align: center; }
  .pt-heading { font-size: 28px; font-weight: 800; color: var(--navy); margin-bottom: 8px; line-height: 1.2; }
  .pt-intro { font-size: 15px; color: var(--text-secondary); margin-bottom: 32px; }
  .pt-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; text-align: left; }
  .pt-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 24px 20px; }
  .pt-card-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--lime); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .pt-card-label::before { content: ''; width: 16px; height: 3px; background: var(--lime); border-radius: 2px; }
  .pt-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.55; }
  @media (max-width: 900px) { .pt-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px) { .pt-section { padding: 40px 20px; } .pt-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .pt-grid { grid-template-columns: 1fr; } }
  ```
- **JS required:** None

### 16. Impact Stats
- **Content summary:** 4 stat cards (300+, 20+, 95%, 85%)
- **Status:** ✅ MATCHED
- **Library category:** stats
- **Recommended:** `edstellar-stats-icon-cards.html` (stats-icon-cards)
- **Why:** Editorial heading + 2x2 icon card grid for mid-page stats with context

### 17. Case Studies
- **Content summary:** H2 + intro + 3 metrics-first case studies (Technology, Financial Services, Manufacturing)
- **Status:** ✅ MATCHED
- **Library category:** success_stories
- **Recommended:** `edstellar-success-stories-dark-version-with-image.html` (success-dark-navy-card)
- **Why:** Navy card with metrics — matches the metrics-first evidence format

### 18. Client Testimonials
- **Content summary:** H2 + 5 client testimonials with names, titles, companies
- **Status:** ✅ MATCHED
- **Library category:** testimonials
- **Recommended:** `edstellar-testimonials-section-with-small-user-thumbnail.html` (testimonials-split-carousel)
- **Why:** Standard testimonial carousel with avatar thumbnails

### 19. Industry Diagnostics (15 sectors)
- **Content summary:** H2 + intro + 15 industry sectors with use case descriptions and tags + CTA
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #industry-diagnostics
- **Background:** var(--surface)
- **Layout:** Centered heading + 3x5 card grid (15 industries). Each card: icon, industry name, description, tag pills. Based on industries-icon-grid pattern expanded to 15 items.
- **CSS class prefix:** `.ind15-`
- **CSS rules:**
  ```css
  .ind15-section { padding: 72px 48px; background: var(--surface); }
  .ind15-container { max-width: 1120px; margin: 0 auto; text-align: center; }
  .ind15-label { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .ind15-label .ind15-bar { width: 28px; height: 3px; background: var(--lime); }
  .ind15-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--navy); }
  .ind15-heading { font-size: 32px; font-weight: 800; color: var(--navy); margin-bottom: 12px; line-height: 1.2; }
  .ind15-intro { font-size: 15px; color: var(--text-secondary); max-width: 660px; margin: 0 auto 40px; line-height: 1.65; }
  .ind15-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: left; margin-bottom: 36px; }
  .ind15-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 22px 20px; transition: all 0.25s; }
  .ind15-card:hover { border-color: var(--lime); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,47,107,0.06); }
  .ind15-card h4 { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 6px; }
  .ind15-card p { font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px; }
  .ind15-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .ind15-tag { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 4px; background: rgba(45,47,107,0.06); color: var(--navy); }
  .ind15-cta { text-align: center; }
  .ind15-cta a { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: var(--navy); color: #fff; font-size: 15px; font-weight: 700; border-radius: 8px; text-decoration: none; transition: all 0.25s; }
  .ind15-cta a:hover { background: #1e2054; transform: translateY(-2px); }
  @media (max-width: 900px) { .ind15-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) { .ind15-section { padding: 40px 20px; } .ind15-heading { font-size: 26px; } }
  @media (max-width: 480px) { .ind15-grid { grid-template-columns: 1fr; } }
  ```
- **JS required:** None

### 20. Executive FAQs
- **Content summary:** H2 + intro + 6 Q&A items
- **Status:** ✅ MATCHED
- **Library category:** faq
- **Recommended:** `edstellar-faq-section.html` (faq-accordion)
- **Why:** Standard accordion FAQ — extend from 5 to 6 items

### 21. Resources
- **Content summary:** H2 + intro + 3 blog cards
- **Status:** ✅ MATCHED
- **Library category:** resources
- **Recommended:** `edstellar-resources-section.html` (resources-3col)
- **Why:** Standard 3-column blog card grid

### 22. Final CTA
- **Content summary:** H2 "From Diagnostic to Decision. From Insight to Execution." + sub-copy + dual CTA
- **Status:** ✅ MATCHED
- **Library category:** cta_banner
- **Recommended:** `edstellar-cta-banner-lime.html` (cta-banner-lime)
- **Why:** Lime CTA banner for maximum conversion

### 23. Lead Capture Form
- **Content summary:** Standard contact form with fields
- **Status:** ✅ MATCHED
- **Library category:** form
- **Recommended:** `edstellar-form-section.html` (form-split-image)
- **Why:** Standard form with left image

### 24. Footer
- **Content summary:** Standard footer with certs, links, social
- **Status:** ✅ MATCHED
- **Library category:** footer
- **Recommended:** `edstellar-footer.html` (footer-centered)

---

## Recommended page flow

1. `edstellar-hero-classic-split.html` — Hero Banner
2. `edstellar-definitional-intro.html` — What Is Training Needs Analysis?
3. `edstellar-closed-loop-cycle.html` — Strategic Alignment (4-step flow)
4. `edstellar-stats-card-grid.html` — Stats Strip (3 stats)
5. `edstellar-three-pillars-cards.html` — Supporting Pillars
6. `edstellar-benefit-pillars-4col.html` — Stakeholder Relevance (4 persona cards)
7. `CUSTOM: #business-priorities` — Business Priorities + Before/After
8. `edstellar-logo-wall.html` — Partner Logos
9. `edstellar-process-vertical-stepper.html` — 5-Phase Methodology
10. `edstellar-download-asset-option-c.html` — Download: TNA Methodology One-Pager
11. `CUSTOM: #assessment-types` — Assessment Types (2x2 Grid)
12. `CUSTOM: #diagnostic-methods` — Diagnostic Methods (6-Method Grid)
13. `CUSTOM: #deliverables` — Deliverables & Outcomes (6 Accordion Items)
14. `edstellar-download-asset-option-a.html` — Download: Skills Gap Workbook
15. `CUSTOM: #process-timeline` — Process & Timeline (5-card strip)
16. `edstellar-stats-icon-cards.html` — Impact Stats
17. `edstellar-success-stories-dark-version-with-image.html` — Case Studies
18. `edstellar-testimonials-section-with-small-user-thumbnail.html` — Client Testimonials
19. `CUSTOM: #industry-diagnostics` — Industry Diagnostics (15 sectors)
20. `edstellar-faq-section.html` — Executive FAQs
21. `edstellar-resources-section.html` — Resources
22. `edstellar-cta-banner-lime.html` — Final CTA
23. `edstellar-form-section.html` — Lead Capture Form
24. `edstellar-footer.html` — Footer

---

## Notes

1. **SEO metadata** from OPT-01: Meta title "Training Needs Analysis Services | Edstellar" (45 chars), meta description 148 chars, slug /training-needs-analysis-services
2. **Stats section used twice:** stats-card-grid (section 4, 3 stats) and stats-icon-cards (section 16, 4 stats) — different variants prevent repetition
3. **Download asset used twice:** download-banner-card for methodology one-pager (navy, after process) and download-split-preview for workbook (light, after deliverables) — different variants
4. **6 custom designs** needed: business-priorities, assessment-types, diagnostic-methods, deliverables, process-timeline, industry-diagnostics
5. **Deliverables section** contains extensive sample data tables (heatmaps, risk matrices, scorecards). The visual accordion shows titles + descriptions + bullets. The detailed data tables are referenced in the dev panel for interactive implementation.
6. **Em dashes and double dashes** throughout content must be replaced with commas per user instruction
7. **15 industry sectors** in the industries section is significantly more than the standard 9 — requires custom 3x5 grid
8. **5 testimonials** instead of the standard 4 — extend the carousel
9. **Partner logos** section has 40+ brand names — logo-wall handles this natively
10. **Gated assets** (Sample TNA Report, TNA Readiness Quiz) are referenced in content but not built as visual sections — noted in dev panel
