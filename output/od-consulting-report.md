# Design Scout Report

**Page:** Organizational Development Consulting
**Date:** 2026-03-21
**Content file:** content/od-consulting.docx
**Sections identified:** 23
**Library matched:** 14 | **Custom designs:** 9

---

## Section mapping

### 1. Hero + Meta Tags (S01)
- **Content summary:** H1 "Organizational Development Consulting" + value prop + dual CTAs + breadcrumb + badge
- **Status:** ✅ MATCHED
- **Library category:** hero
- **Recommended:** `edstellar-hero-classic-split.html` (hero-classic-split)
- **Why:** Split layout with breadcrumb, checkmark trust points, dual CTA, image placeholder, and logo strip — matches hero requirements exactly
- **Alternatives:** None (single variant)
- **Content to swap:**
  - Breadcrumb: Home / Consulting / OD Consulting / Organizational Development Consulting
  - Badge: OD Consulting, Enterprise Practice
  - H1: Organizational Development Consulting
  - Subheadline: Partner with Edstellar's expert OD consultants to align people, culture, and performance. Evidence-backed organizational development consulting, 2,000+ instructor-led programs, 5,000+ certified trainers, delivered across 100+ locations worldwide.
  - Checkmarks: 2,000+ Instructor-Led Programs | 5,000+ Certified Trainers | 100+ Global Locations
  - Primary CTA: Get a Free OD Consultation →
  - Secondary CTA: Explore Our OD Services ↓

### 2. What Is OD Consulting? — Definitional Intro (S02)
- **Content summary:** Definitional H2 + 2 paragraphs explaining what OD consulting is — competitor gap fill
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #what-is-od
- **Background:** var(--surface) (white)
- **Layout:** Centered section label + H2 heading + 2-paragraph body text in a narrow container (max-width 820px) with a lime left accent bar on the first paragraph
- **CSS class prefix:** `.wio-`
- **HTML structure:**
  ```html
  <section id="what-is-od" class="wio-section">
    <div class="wio-container">
      <div class="wio-label"><span class="wio-bar"></span><span>Understanding OD</span></div>
      <h2 class="wio-heading">What Is Organizational Development Consulting?</h2>
      <div class="wio-body">
        <p class="wio-lead">{paragraph_1}</p>
        <p>{paragraph_2}</p>
      </div>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .wio-section { padding: 64px 48px; background: var(--surface, #fff); }
  .wio-container { max-width: 820px; margin: 0 auto; }
  .wio-label { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
  .wio-label .wio-bar { width: 28px; height: 3px; background: var(--lime, #C5E826); display: inline-block; }
  .wio-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--navy, #2D2F6B); }
  .wio-heading { font-size: 36px; font-weight: 700; color: var(--navy, #2D2F6B); margin-bottom: 28px; line-height: 1.25; }
  .wio-body { font-size: 17px; line-height: 1.75; color: var(--text-secondary, #555); }
  .wio-lead { border-left: 3px solid var(--lime, #C5E826); padding-left: 20px; margin-bottom: 20px; }
  .wio-body p:last-child { margin-bottom: 0; }
  @media (max-width: 768px) {
    .wio-section { padding: 40px 20px; }
    .wio-heading { font-size: 26px; }
    .wio-body { font-size: 15px; }
  }
  ```
- **Content mapping:**
  - H2: "What Is Organizational Development Consulting?"
  - paragraph_1: "Organizational development consulting is a planned, systematic approach to improving organizational effectiveness through people, processes, and structure. Rooted in research-backed OD methodologies, including McKinsey 7S, Burke-Litwin, and systems thinking, OD consulting identifies root-cause barriers to performance and designs evidence-based interventions that drive lasting change."
  - paragraph_2: "At Edstellar, our OD consultants partner with leadership teams to align organizational strategy with operational reality, building the structure, culture, and capability your business needs to scale, adapt, and outperform."
- **JS required:** none

### 3. Why Work with Our OD Consultants? — 4 Benefit Pillars (S03)
- **Content summary:** H2 with intro paragraph + 4 benefit pillar cards explaining why enterprises choose Edstellar's OD consultants
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #why-od-consultants
- **Background:** var(--navy, #2D2F6B)
- **Layout:** Centered section label + H2 + intro paragraph + 4-column card grid with lime icon numbers, heading, and description per card
- **CSS class prefix:** `.woc-`
- **HTML structure:**
  ```html
  <section id="why-od-consultants" class="woc-section">
    <div class="woc-container">
      <div class="woc-label"><span class="woc-bar"></span><span>The Value of Expert OD Consulting</span></div>
      <h2 class="woc-heading">Why Work with Our OD Consultants?</h2>
      <p class="woc-intro">{intro_paragraph}</p>
      <div class="woc-grid">
        <div class="woc-card">
          <div class="woc-number">01</div>
          <h3 class="woc-card-title">{pillar_1_title}</h3>
          <p class="woc-card-desc">{pillar_1_desc}</p>
        </div>
        <div class="woc-card">
          <div class="woc-number">02</div>
          <h3 class="woc-card-title">{pillar_2_title}</h3>
          <p class="woc-card-desc">{pillar_2_desc}</p>
        </div>
        <div class="woc-card">
          <div class="woc-number">03</div>
          <h3 class="woc-card-title">{pillar_3_title}</h3>
          <p class="woc-card-desc">{pillar_3_desc}</p>
        </div>
        <div class="woc-card">
          <div class="woc-number">04</div>
          <h3 class="woc-card-title">{pillar_4_title}</h3>
          <p class="woc-card-desc">{pillar_4_desc}</p>
        </div>
      </div>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .woc-section { padding: 72px 48px; background: var(--navy, #2D2F6B); }
  .woc-container { max-width: 1120px; margin: 0 auto; }
  .woc-label { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .woc-label .woc-bar { width: 28px; height: 3px; background: var(--lime, #C5E826); }
  .woc-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--lime, #C5E826); }
  .woc-heading { font-size: 36px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.25; }
  .woc-intro { font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.75); max-width: 780px; margin-bottom: 44px; }
  .woc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .woc-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius, 12px); padding: 32px 24px; transition: all 0.25s; }
  .woc-card:hover { background: rgba(255,255,255,0.1); transform: translateY(-3px); }
  .woc-number { font-size: 32px; font-weight: 800; color: var(--lime, #C5E826); margin-bottom: 16px; }
  .woc-card-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 12px; line-height: 1.3; }
  .woc-card-desc { font-size: 15px; line-height: 1.65; color: rgba(255,255,255,0.7); }
  @media (max-width: 1024px) { .woc-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .woc-section { padding: 40px 20px; }
    .woc-heading { font-size: 26px; }
    .woc-grid { grid-template-columns: 1fr; }
  }
  ```
- **Content mapping:**
  - H2: "Why Work with Our OD Consultants?"
  - intro: "Organizational development is complex, context-dependent, and high-stakes. The right OD consultant brings three things your internal team often cannot, objectivity, a proven methodology, and cross-industry pattern recognition. Here's why enterprises choose Edstellar's OD consultants:"
  - Pillar 1: Title: "External Objectivity" | Desc: "An outside OD consultant sees what internal teams cannot, structural inefficiencies, cultural blind spots, and capability gaps that have become normalized. Objectivity is the foundation of effective diagnosis."
  - Pillar 2: Title: "Proven Methodologies" | Desc: "Edstellar's consultants apply validated frameworks, McKinsey 7S, Burke-Litwin, Kotter's 8-Step, and Organizational Network Analysis, selected based on your specific challenge, not applied universally."
  - Pillar 3: Title: "Cross-Industry Pattern Recognition" | Desc: "With engagements across technology, banking, manufacturing, healthcare, retail, and professional services, our OD consultants bring pattern recognition that accelerates diagnosis and solution design."
  - Pillar 4: Title: "Scalable Implementation" | Desc: "Edstellar backs every OD intervention with 5,000+ certified trainers and 2,000+ instructor-led programs across 100+ locations, turning strategic recommendations into enterprise-wide execution."
- **JS required:** none

### 4. Trust / Proof Bar (S04)
- **Content summary:** Stats strip with key trust metrics — social proof above the fold
- **Status:** ✅ MATCHED
- **Library category:** stats
- **Recommended:** `edstellar-stats-card-grid.html` (stats-card-grid)
- **Why:** 4-column navy card grid on light background — ideal for stat strip; clean layout without needing editorial heading
- **Alternatives:** `edstellar-stats-icon-cards.html` (stats-icon-cards) — if editorial heading context is needed
- **Content to swap:**
  - Stat 1: 2,000+ | Instructor-Led Programs
  - Stat 2: 5,000+ | Certified OD Trainers & Consultants
  - Stat 3: 100+ | Global Delivery Locations
  - Stat 4: Fortune 500 | Enterprise Client Portfolio

### 5. Three Pillars — What We Do (S05)
- **Content summary:** Concise 3-pillar intro explaining Edstellar's organizational development focus areas: Structure, Culture, Talent
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #three-pillars
- **Background:** var(--light-bg, #F7F7F8)
- **Layout:** Centered heading + intro paragraph + 3-column card grid with lime top accent bars, icon, heading, and description
- **CSS class prefix:** `.tp-`
- **HTML structure:**
  ```html
  <section id="three-pillars" class="tp-section">
    <div class="tp-container">
      <div class="tp-label"><span class="tp-bar"></span><span>What We Do</span></div>
      <h2 class="tp-heading">Build the Organization You Need, Now, and for the Future</h2>
      <p class="tp-intro">{intro_paragraph}</p>
      <div class="tp-grid">
        <div class="tp-card">
          <div class="tp-accent"></div>
          <div class="tp-icon"><svg>...</svg></div>
          <h3 class="tp-card-title">{pillar_1_title}</h3>
          <p class="tp-card-desc">{pillar_1_desc}</p>
        </div>
        <div class="tp-card">
          <div class="tp-accent"></div>
          <div class="tp-icon"><svg>...</svg></div>
          <h3 class="tp-card-title">{pillar_2_title}</h3>
          <p class="tp-card-desc">{pillar_2_desc}</p>
        </div>
        <div class="tp-card">
          <div class="tp-accent"></div>
          <div class="tp-icon"><svg>...</svg></div>
          <h3 class="tp-card-title">{pillar_3_title}</h3>
          <p class="tp-card-desc">{pillar_3_desc}</p>
        </div>
      </div>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .tp-section { padding: 72px 48px; background: var(--light-bg, #F7F7F8); }
  .tp-container { max-width: 1120px; margin: 0 auto; text-align: center; }
  .tp-label { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .tp-label .tp-bar { width: 28px; height: 3px; background: var(--lime, #C5E826); }
  .tp-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--navy, #2D2F6B); }
  .tp-heading { font-size: 36px; font-weight: 700; color: var(--navy, #2D2F6B); margin-bottom: 16px; line-height: 1.25; }
  .tp-intro { font-size: 17px; line-height: 1.7; color: var(--text-secondary, #555); max-width: 720px; margin: 0 auto 44px; }
  .tp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; text-align: left; }
  .tp-card { background: #fff; border-radius: var(--radius, 12px); padding: 0; overflow: hidden; box-shadow: 0 2px 12px rgba(45,47,107,0.05); transition: all 0.25s; }
  .tp-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(45,47,107,0.08); }
  .tp-accent { height: 4px; background: var(--lime, #C5E826); }
  .tp-icon { width: 48px; height: 48px; background: rgba(45,47,107,0.06); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 28px 28px 16px; }
  .tp-icon svg { width: 22px; height: 22px; stroke: var(--navy, #2D2F6B); fill: none; stroke-width: 2; }
  .tp-card-title { font-size: 19px; font-weight: 700; color: var(--navy, #2D2F6B); margin: 0 28px 10px; }
  .tp-card-desc { font-size: 15px; line-height: 1.65; color: var(--text-secondary, #555); margin: 0 28px 28px; }
  @media (max-width: 768px) {
    .tp-section { padding: 40px 20px; }
    .tp-heading { font-size: 26px; }
    .tp-grid { grid-template-columns: 1fr; }
  }
  ```
- **Content mapping:**
  - H2: "Build the Organization You Need, Now, and for the Future"
  - Intro: "Effective organizational transformation happens through deliberate improvement efforts and strategic reinforcement of what makes your organization successful. At Edstellar, we collaborate with leadership teams to align structure, culture, and talent with your evolving strategic direction."
  - Pillar 1: Title: "Organizational Structure" | Desc: "Design operating models, reporting lines, and governance frameworks that translate strategy into efficient execution across every business unit."
  - Pillar 2: Title: "Culture & Change" | Desc: "Diagnose cultural misalignment and build change management programs that shift behaviors, mindsets, and norms to match strategic intent."
  - Pillar 3: Title: "Talent & Capability" | Desc: "Map competencies, develop leadership pipelines, and architect roles that maximize value creation and close critical capability gaps."
- **JS required:** none

### 6. OD Consulting Services — 8 Tiles (S06)
- **Content summary:** H2 + 8 service tiles with H3 keyword headings and 25-30 word descriptions per tile
- **Status:** ✅ MATCHED
- **Library category:** sub_services
- **Recommended:** `edstellar-subservices-for-linking-with-image.html` (subservices-3col-image-cards)
- **Why:** Image card grid with lime accent bars and read-more links — perfect for 8 service tiles linking to individual pages. Extend from 6 cards to 8 (4x2 grid).
- **Alternatives:** `edstellar-services-option-b.html` (services-tab-pills) — interactive tabs, but 8 tabs would be crowded
- **Note:** Extend the existing 3x2 grid to accommodate 8 cards. Use a 4-column layout at desktop (4x2), 2-column tablet, 1-column mobile.
- **Content to swap:**
  - H2: "Our Organizational Development Consulting Services"
  - Intro: "Edstellar's OD consulting services span the full spectrum of organizational transformation, from structural design and culture change through to leadership capability and workforce development. Each service is grounded in diagnostic evidence, not assumptions."
  - Tile 1: Change Management Consulting | Drive successful organizational transitions with structured change frameworks that reduce resistance, accelerate adoption, and sustain transformation outcomes.
  - Tile 2: Leadership Development Consulting | Build leadership capability at every tier, from emerging managers to C-suite executives, through targeted assessments, coaching, and competency development.
  - Tile 3: Organizational Design & Structure | Redesign operating models, reporting lines, and governance to align structure with strategy and eliminate execution bottlenecks.
  - Tile 4: Culture & Change Management | Diagnose cultural health, align values with business goals, and embed behavioral change through structured interventions and leadership modeling.
  - Tile 5: Strategic Planning & Alignment | Create structured cascades from enterprise strategy through business unit, team, and individual objectives for unified execution.
  - Tile 6: Performance Management Consulting | Design measurement frameworks, KPI systems, and feedback mechanisms that drive accountability and continuous performance improvement.
  - Tile 7: Succession Planning | Identify critical roles, map leadership pipelines, and build talent readiness to ensure organizational continuity through transitions.
  - Tile 8: Organizational Health Assessment | Benchmark organizational effectiveness across structure, culture, capability, and process dimensions using evidence-based diagnostic tools.

### 7. Service Deep-Dives — 5 Capability Areas (S07–S11 combined)
- **Content summary:** 5 detailed service deep-dive sections: OD Diagnostic Study, Org Design & Operating Model, Role Architecture & Competency Modeling, Strategic Planning & Goal Alignment, Organization Skills Maturity Assessment
- **Status:** ✅ MATCHED
- **Library category:** service_detail
- **Recommended:** `edstellar-detailed-explanation-of-service-with-image-and-accordion.html` (detail-accordion-with-image)
- **Why:** Interactive accordion with numbered blocks allows 5 deep-dives in compact space — click to expand image + description + bullet features. Extend from 3 to 5 blocks.
- **Alternatives:** `edstellar-service-explained-in-detail-option-with-image.html` (detail-stacked-blocks-with-image) — but 5 alternating image+text blocks would be very long
- **Note:** Extend accordion from 3 numbered blocks (01-03) to 5 (01-05). First block open by default.
- **Content to swap:**
  - Section label: "Service Deep-Dive"
  - H2: "How We Deliver Organizational Transformation"
  - Block 01 — OD Diagnostic Study:
    - Desc: "Before you redesign, restructure, or retrain, you need to know exactly where the structural and capability fractures are. Edstellar's OD Diagnostic Study is a structured, data-backed assessment of your organization's structural effectiveness, capability gaps, cultural health, and operational alignment."
    - Bullets: Structural effectiveness analysis across business units and functions | Capability gap mapping tied to strategic priorities | Cultural health and engagement diagnostics | Prioritized transformation roadmap with phased recommendations and KPIs
    - Output tag: "Prioritized Transformation Roadmap · Phased Interventions · Measurable KPIs"
  - Block 02 — Organizational Design & Operating Model:
    - Desc: "Your operating model should accelerate execution, not constrain it. Edstellar designs organizational structures and governance frameworks that translate strategic intent into operational reality. We rethink how work flows, where decisions are made, and how accountability is distributed."
    - Bullets: Operating model redesign and governance frameworks | Reporting line optimization and decision-rights mapping | Span-of-control analysis and structural simplification | Change implementation support and stakeholder alignment
    - Output tag: "Operating Model Blueprint · Governance Framework · Implementation Roadmap"
  - Block 03 — Role Architecture & Competency Modeling:
    - Desc: "When roles are unclear, accountability fragments. Edstellar goes beyond job descriptions, we conduct rigorous Job-Task Analysis (JTA), assess role criticality, map competencies, and redesign work to eliminate redundancy while maximizing value creation."
    - Bullets: Job-Task Analysis (JTA), decomposing roles into measurable outputs | Role criticality assessment by strategic and operational impact | Competency modeling, skills, knowledge, and behaviors per role | Span-of-control optimization and purposeful work design
    - Output tag: "Role Architecture Map · Competency Framework · Work Design Blueprint"
  - Block 04 — Strategic Planning & Goal Alignment:
    - Desc: "Strategy fails when it stays in the boardroom. Edstellar creates a structured cascade from enterprise strategy through business unit, team, and individual objectives, ensuring every employee understands how their work connects to business outcomes."
    - Bullets: Enterprise-to-individual strategy cascade framework | OKR and goal alignment architecture | Cross-functional alignment workshops | Performance linkage and accountability mapping
    - Output tag: "Strategy Cascade Framework · Goal Alignment Architecture · Performance Linkage Map"
  - Block 05 — Organization Skills Maturity Assessment:
    - Desc: "Skills Maturity measures how effectively your organization identifies, develops, deploys, and evolves workforce capabilities. Edstellar's five-level maturity model benchmarks where you are today, and builds a data-driven roadmap to skills-led competitive advantage."
    - Bullets: 5-level maturity model benchmarking (Ad Hoc → Optimized) | Skills gap analysis across all organizational levels | Capability development roadmap aligned to strategic priorities | ROI measurement framework for skills investment
    - Output tag: "Maturity Benchmark Report · Skills Gap Analysis · Development Roadmap"

### 8. Our Approach to OD Consulting (S12)
- **Content summary:** 4-step methodology model: Assess → Diagnose → Design → Implement & Measure
- **Status:** ✅ MATCHED
- **Library category:** process
- **Recommended:** `edstellar-process-horizontal-timeline.html` (process-horizontal-timeline)
- **Why:** Horizontal timeline with numbered circles — perfect for 4-step sequential methodology. Clean light background. Adjust from 5 steps to 4.
- **Alternatives:** `edstellar-process-vertical-stepper.html` (process-vertical-stepper) — navy background, more detailed; `edstellar-process-card-grid.html` (process-card-grid) — interactive cards
- **Content to swap:**
  - Section label: "Our Methodology"
  - H2: "Our Approach to Organizational Development Consulting"
  - Intro: "Organizational transformation is complex and requires a structured approach that addresses every dimension of change. Edstellar's methodology combines rigorous diagnostic analysis with collaborative solution design, grounded in research-backed organizational development methodologies."
  - Step 1: Assess | Stakeholder interviews, data collection, organizational mapping, and baseline measurement to understand the current state with precision.
  - Step 2: Diagnose | Root-cause analysis using validated OD frameworks, capability heatmapping, structural effectiveness assessment, and cultural health diagnostics.
  - Step 3: Design | Collaborative solution architecture, intervention planning, change roadmaps, and stakeholder alignment workshops with phased implementation timelines.
  - Step 4: Implement & Measure | Execution support, training deployment, KPI tracking, and continuous calibration to ensure measurable, sustainable outcomes.

### 9. Industries We Serve (S13)
- **Content summary:** 6 industry verticals where Edstellar delivers OD consulting with APAC/India/ME differentiation
- **Status:** ✅ MATCHED
- **Library category:** industries
- **Recommended:** `edstellar-industries-icon-grid.html` (industries-icon-grid)
- **Why:** Clean scannable icon grid on white background — matches 6 industries well (2x3 grid). Pairs well after the light-background approach section.
- **Alternatives:** `edstellar-industries-selectable-tiles.html` (industries-selectable-tiles) — more detail per industry if needed
- **Note:** Reduce from 9 to 6 industry cards.
- **Content to swap:**
  - H2: "Organizational Development Consulting Across Industries"
  - Intro: "Edstellar delivers organizational development consulting across diverse sectors, from regulated industries to high-growth technology firms and public sector organizations. Our APAC, Middle East, and India-specific OD expertise fills a gap all 7 top competitors leave open."
  - Industry 1: Technology & SaaS | Scaling leadership, structure, and culture through rapid growth, M&A integration, and remote-first transformation.
  - Industry 2: Banking & Financial Services | Digital transformation OD, regulatory change management, and branch network restructuring.
  - Industry 3: Manufacturing | Safety culture, operational excellence, lean transformation, and multi-site organizational alignment.
  - Industry 4: Healthcare | Clinical governance redesign, care delivery optimization, and workforce capability development.
  - Industry 5: Retail & Consumer | Store performance optimization, omnichannel transformation, and customer-centric culture change.
  - Industry 6: Professional Services | Partner-led model optimization, knowledge management, and client delivery capability building.

### 10. Why Choose Edstellar for OD Consulting? (S14)
- **Content summary:** 6 differentiators with "The Edstellar Difference" positioning — scale, methodology, Fortune 500, APAC expertise
- **Status:** ✅ MATCHED
- **Library category:** differentiators
- **Recommended:** `edstellar-differentiators-option-a.html` (diff-image-list)
- **Why:** Left image + heading with right differentiator list using alternating navy/lime accent bars — matches 6 differentiators format exactly
- **Alternatives:** None (single variant)
- **Content to swap:**
  - Section label: "The Edstellar Difference"
  - H2: "Why Choose Edstellar for OD Consulting?"
  - Intro: "Edstellar is not a generalist consulting firm. We are an organizational development consulting partner with the scale, methodology, and sector depth to deliver transformation that sticks. Here's what sets us apart from every other OD consulting firm in the market:"
  - Diff 1: 5,000+ Certified OD Trainers & Consultants | On-demand access to a global network of certified professionals who deliver OD interventions with instructor-led precision.
  - Diff 2: 2,000+ Instructor-Led Programs | Every OD intervention is backed by structured, instructor-led training programs, not just slide decks and recommendations.
  - Diff 3: Fortune 500 Enterprise Track Record | Proven engagements with Visa, KPMG, BCG, Aditya Birla Group, Cummins, Bechtel, and 40+ named enterprise clients.
  - Diff 4: Evidence-Based, Diagnostic-First Approach | Every engagement starts with a structured OD Diagnostic Study, not assumptions. Data drives every recommendation.
  - Diff 5: APAC, India & Middle East OD Expertise | Deep regional organizational development knowledge, a market gap all top competitors leave open.
  - Diff 6: End-to-End: Strategy Through Execution | From diagnostic through design to instructor-led implementation, Edstellar owns the full OD lifecycle, not just the advisory phase.

### 11. Case Studies — Six Sectors (S15)
- **Content summary:** 6 case studies with challenge/solution/results format across technology, banking, manufacturing, professional services, healthcare, retail
- **Status:** ✅ MATCHED
- **Library category:** success_stories
- **Recommended:** `edstellar-success-stories-light-version-with-image.html` (success-light-split-carousel)
- **Why:** Split image + quote with stats row and arrow carousel — extend from 3 to 6 stories for full sector coverage
- **Alternatives:** `edstellar-success-stories-dark-version-with-image.html` (success-dark-navy-card) — premium dark feel
- **Note:** Extend carousel from 3 to 6 stories.
- **Content to swap:**
  - H2: "How Our OD Consulting Brings Change in Organizations"
  - Intro: "Our organizational development expertise delivers measurable impact across diverse sectors."
  - Story 1: Leadership Development, Rapidly Scaling Technology Organization | SaaS Company · 12,000 employees · 5 facilities · 12-month engagement
  - Story 2: Digital Transformation OD, Regional Bank | Regional Bank · 2,800 employees · 120 branches · 14-month engagement
  - Story 3: Safety Excellence, Global Manufacturing Company | Global Manufacturing · 6,500 employees · 9 facilities · 16-month engagement
  - Story 4: Client Success, Professional Services Organization | Management Consulting Firm · 850 employees · 4 offices · 10-month engagement
  - Story 5: Clinical Excellence, Regional Healthcare Provider | Healthcare System · 12,000 employees · 8 facilities · 18-month engagement
  - Story 6: Store Performance, Fashion Retail Chain | Fashion Retail · 4,200 employees · 180 stores · 15-month engagement

### 12. Client Testimonials (S16)
- **Content summary:** 6 client quotes (5 named + 1 CHRO anonymous) with attribution
- **Status:** ✅ MATCHED
- **Library category:** testimonials
- **Recommended:** `edstellar-testimonials-section-with-small-user-thumbnail.html` (testimonials-split-carousel)
- **Why:** Left heading + right quote card carousel with avatar initials — extend from 4 to 6 testimonials
- **Alternatives:** None (single variant)
- **Note:** Extend carousel from 4 to 6 testimonials.
- **Content to swap:**
  - H2: "What Our Clients Say About Edstellar's OD Consultants"
  - Intro: "We don't just consult, we co-create. Read how organizations experienced tangible shifts with Edstellar's organizational development consulting."
  - Quote 1: "Edstellar's team helped us bridge the leadership gap during a critical growth phase. Their OD consultants brought structure, focus, and cohesion to our expanding teams." — Anita Kulkarni, Chief People Officer, Zentrix Software Solutions
  - Quote 2: "The OD Diagnostic Study gave us clarity we hadn't had in years. We stopped debating opinions and started making structural decisions based on evidence. Edstellar's organizational design work directly accelerated our transformation program." — CHRO, Fortune 500 Manufacturing Company
  - Quote 3: "Our culture was misaligned with our business goals. Edstellar not only helped us diagnose the problem, they walked with us through every stage of cultural transformation." — David Lin, VP of HR, Omnivault Financial Group
  - Quote 4: "Thanks to Edstellar, we turned fragmented regional operations into a unified, strategy-driven network. Their OD framework delivered clarity and performance." — Meera Thakkar, Director of Organizational Effectiveness, Riventa Hospitals
  - Quote 5: "The leadership development journey designed by Edstellar was a game changer. We saw immediate improvements in collaboration and decision-making at the top." — Thomas Reid, Group CEO, Northwell Manufacturing Corp.
  - Quote 6: "What impressed me most was Edstellar's ability to blend data, behavior science, and empathy. They didn't impose solutions, they co-created change with our teams." — Sophia Mendes, Head of Talent & Transformation, Equitas Retail Group

### 13. Partner / Client Logo Wall (S17)
- **Content summary:** 40+ named enterprise brands as social proof — Fortune 500 logos/names
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #logo-wall
- **Background:** var(--navy, #2D2F6B)
- **Layout:** Centered heading + intro + flowing grid of brand name tags on semi-transparent cards
- **CSS class prefix:** `.lw-`
- **HTML structure:**
  ```html
  <section id="logo-wall" class="lw-section">
    <div class="lw-container">
      <div class="lw-label"><span class="lw-bar"></span><span>Our Clients</span></div>
      <h2 class="lw-heading">Partners That Trust Edstellar's OD Consultants</h2>
      <p class="lw-intro">{intro_paragraph}</p>
      <div class="lw-grid">
        <span class="lw-logo">{brand_name}</span>
        <!-- repeat for all 37 brands -->
      </div>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .lw-section { padding: 72px 48px; background: var(--navy, #2D2F6B); }
  .lw-container { max-width: 1120px; margin: 0 auto; text-align: center; }
  .lw-label { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .lw-label .lw-bar { width: 28px; height: 3px; background: var(--lime, #C5E826); }
  .lw-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--lime, #C5E826); }
  .lw-heading { font-size: 36px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.25; }
  .lw-intro { font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.75); max-width: 720px; margin: 0 auto 40px; }
  .lw-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
  .lw-logo { display: inline-flex; align-items: center; padding: 10px 20px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85); letter-spacing: 0.3px; transition: all 0.25s; white-space: nowrap; }
  .lw-logo:hover { background: rgba(197,232,38,0.15); border-color: var(--lime, #C5E826); color: #fff; }
  @media (max-width: 768px) {
    .lw-section { padding: 40px 20px; }
    .lw-heading { font-size: 26px; }
    .lw-logo { font-size: 13px; padding: 8px 14px; }
  }
  ```
- **Content mapping:**
  - H2: "Partners That Trust Edstellar's OD Consultants"
  - Intro: "Leading organizations across industries trust Edstellar for organizational development consulting. Our track record includes Fortune 500 companies, innovative startups, and respected public sector organizations."
  - Brands: Visa, KPMG, Boston Consulting Group, Aditya Birla Group, Cummins, Bechtel, Regeneron, Circle K, Dayforce, Uber, Ujjivan Small Finance Bank, National Bank of Iraq, SPI Pharma, ERGO Technology & Services, Motorq, Sangam, Datawrkz, Digit Life Insurance, EPL Global, ETP International, Market99, Mankiewicz India, Oswaal Books, Sunstone, Uplers, Hudson Link, D B Corp, Majestic Asset Management, Ideal Solutions, ADB SAFE Gate, Jet Parts, CIPS, Cloudify, PIE, GetIt, FITO, Deriv
- **JS required:** none

### 14. FAQ Section (S18)
- **Content summary:** 6 Q&As targeting long-tail keywords — organizational development consulting, methodologies, assessment, specializations, impact measurement, why Edstellar
- **Status:** ✅ MATCHED
- **Library category:** faq
- **Recommended:** `edstellar-faq-section.html` (faq-accordion)
- **Why:** Accordion with expand/collapse and lime active borders — standard FAQ format. Extend from 5 to 6 Q&As.
- **Alternatives:** None (single variant)
- **Note:** Extend from 5 to 6 questions.
- **Content to swap:**
  - H2: "Frequently Asked Questions About OD Consulting"
  - Q1: What is organizational development consulting? | Organizational development consulting is a systematic, evidence-based process for improving organizational effectiveness through planned interventions in structure, culture, capability, and process. OD consultants diagnose root causes, not surface symptoms, and design tailored solutions that produce measurable business outcomes.
  - Q2: What organizational development methodologies does Edstellar use? | Edstellar's OD consultants apply validated frameworks including McKinsey 7S, the Burke-Litwin Causal Model, Kotter's 8-Step Change Model, and Organizational Network Analysis (ONA). Every methodology is selected based on your organization's specific challenge, not applied universally.
  - Q3: How do you assess an organization before consulting? | We begin every engagement with an OD Diagnostic Study, structured stakeholder interviews, capability gap mapping, structural effectiveness analysis, and cultural health diagnostics. The output is a capability heatmap and prioritized transformation roadmap, not a generic slide deck.
  - Q4: What OD areas does Edstellar specialize in? | Edstellar's OD consulting covers: Change Management, Leadership Development, Organizational Design & Structure, Cultural Transformation, Strategic Planning, Performance Management, Succession Planning, Organizational Health Assessment, Role Architecture, Goal Alignment, and Skills Maturity, all backed by instructor-led program delivery across 100+ locations.
  - Q5: How does Edstellar measure the impact of OD consulting? | Every Edstellar engagement defines KPIs at the outset, retention rates, productivity metrics, cultural health scores, leadership pipeline readiness, and goal alignment indices. We use a four-phase model (Assess → Diagnose → Design → Implement & Measure) to track and calibrate results throughout the engagement.
  - Q6: Why choose Edstellar over other OD consulting firms? | Three things no competitor on this list offers at our scale: 5,000+ certified OD trainers and consultants on demand, instructor-led training delivery mapped to every OD intervention across 100+ countries, and deep APAC, Middle East, and India-specific organizational development expertise, a market gap all top competitors leave open.

### 15. Gated Asset — OD Readiness Checklist (S19)
- **Content summary:** Downloadable OD Readiness Checklist CTA with description and download link
- **Status:** ✅ MATCHED
- **Library category:** download_asset
- **Recommended:** `edstellar-download-asset-option-c.html` (download-banner-card)
- **Why:** Navy card with left text + right asset preview — compact self-contained section, matches gated asset positioning
- **Alternatives:** `edstellar-download-asset-option-a.html` (download-split-preview) — light background alternative
- **Content to swap:**
  - Headline: "Download: Organizational Development Readiness Checklist"
  - Description: "Not sure where to start your OD journey? Download Edstellar's free Organizational Development Readiness Checklist, a practical diagnostic tool that helps leadership teams assess structural gaps, culture alignment, and capability readiness before beginning a formal OD engagement."
  - Feature badges: Structural Gap Analysis | Culture Alignment Check | Capability Readiness Score | Leadership Diagnostic
  - File format tags: PDF | Excel
  - Primary CTA: Download Free Checklist →
  - Secondary CTA: Learn More About OD Diagnostics

### 16. CTA Banner (S20)
- **Content summary:** Full-width CTA banner with heading, description, and consultation button
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #cta-banner
- **Background:** var(--lime, #C5E826)
- **Layout:** Centered heading + description + navy CTA button on lime background — high-contrast conversion strip
- **CSS class prefix:** `.cb-`
- **HTML structure:**
  ```html
  <section id="cta-banner" class="cb-section">
    <div class="cb-container">
      <h2 class="cb-heading">{heading}</h2>
      <p class="cb-desc">{description}</p>
      <a href="#contact-form" class="cb-btn">{cta_text}</a>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .cb-section { padding: 64px 48px; background: var(--lime, #C5E826); }
  .cb-container { max-width: 780px; margin: 0 auto; text-align: center; }
  .cb-heading { font-size: 34px; font-weight: 700; color: var(--navy, #2D2F6B); margin-bottom: 16px; line-height: 1.25; }
  .cb-desc { font-size: 17px; line-height: 1.7; color: rgba(45,47,107,0.8); margin-bottom: 32px; }
  .cb-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: var(--navy, #2D2F6B); color: #fff; font-size: 15px; font-weight: 600; border-radius: 8px; text-decoration: none; transition: all 0.25s; }
  .cb-btn:hover { background: #1e2054; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,47,107,0.25); }
  @media (max-width: 768px) {
    .cb-section { padding: 40px 20px; }
    .cb-heading { font-size: 26px; }
  }
  ```
- **Content mapping:**
  - Heading: "Ready to Transform Your Organizational Architecture?"
  - Description: "Start with a diagnostic conversation. Edstellar's OD consultants will scope the right engagement model for your organization's complexity, urgency, and strategic priorities, no commitment required."
  - CTA text: "Get a Free OD Consultation →"
- **JS required:** none

### 17. On-Page Contact Form (S21)
- **Content summary:** Full inline contact form with heading, description, and 7 fields
- **Status:** ✅ MATCHED
- **Library category:** form
- **Recommended:** `edstellar-form-section.html` (form-split-image)
- **Why:** Left image + right form panel in rounded card — standard lead capture form matching Edstellar reference
- **Alternatives:** None (single variant)
- **Content to swap:**
  - H2: "Ready to Transform Your Organization?"
  - Description: "Contact our OD consultants today to discuss how we can help you build a thriving, high-performance organization ready for future challenges."

### 18. Resources / Blog (S22)
- **Content summary:** 3 blog resource cards with images, categories, dates, and links
- **Status:** ✅ MATCHED
- **Library category:** resources
- **Recommended:** `edstellar-resources-section.html` (resources-3col)
- **Why:** 3-column blog cards with image zoom on hover — standard resources section
- **Alternatives:** None (single variant)
- **Content to swap:**
  - H2: "Edstellar OD Consulting Resources"
  - Intro: "Deep dive into organizational development trends, expert insights, and practical frameworks."
  - Card 1: IN-DEMAND SKILLS | January 23, 2026 | 10 Must-have Skills for a Frontend Developer in 2026 | edstellar.com/blog/frontend-developer-skills
  - Card 2: WORKFORCE OPTIMIZATION | January 23, 2026 | 5 Real-World Case Studies of Internal Talent Mobility Powered by Skill Mapping | edstellar.com/blog/internal-talent-mobility-case-studies
  - Card 3: IN-DEMAND SKILLS | January 20, 2026 | 10 Must-Have Skills for a System Administrator in 2026 | edstellar.com/blog/system-administrator-skills

### 19. Connected Services (Added — standard cross-sell)
- **Content summary:** Cross-sell strip linking to related consulting service pages
- **Status:** ✅ MATCHED
- **Library category:** connected_services
- **Recommended:** `edstellar-connected-services-compact-strip.html` (connected-compact-strip)
- **Why:** Minimal near-footer cross-sell with 3 service items — compact height, pairs well before footer
- **Alternatives:** `edstellar-connected-services-card-strip.html` (connected-card-strip) — fuller layout
- **Content to swap:**
  - Service 1: Leadership Development Consulting | Build leadership capability across all organizational tiers
  - Service 2: Change Management Consulting | Drive successful transitions with structured change frameworks
  - Service 3: Organizational Strategy Consulting | Align strategy, structure, and execution for sustainable growth

### 20. Footer (S23)
- **Content summary:** ISO certifications, social links, legal, copyright
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #site-footer
- **Background:** var(--navy, #2D2F6B)
- **Layout:** Centered footer with copyright, ISO badges, legal links, social icons
- **CSS class prefix:** `.sf-`
- **HTML structure:**
  ```html
  <footer id="site-footer" class="sf-footer">
    <div class="sf-container">
      <div class="sf-certs">
        <span class="sf-cert">ISO 9001:2015 Certified</span>
        <span class="sf-cert">ISO 27001:2022 Certified</span>
      </div>
      <div class="sf-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms and Conditions</a>
        <a href="#">Modern Slavery Statement</a>
      </div>
      <div class="sf-social">
        <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" fill="none" stroke="currentColor" stroke-width="2"/><rect x="2" y="9" width="4" height="12" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="2"/></svg></a>
        <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" fill="none" stroke="currentColor" stroke-width="2"/></svg></a>
        <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" fill="none" stroke="currentColor" stroke-width="2"/></svg></a>
        <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/></svg></a>
        <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="none" stroke="currentColor" stroke-width="2"/></svg></a>
      </div>
      <p class="sf-copy">© 2021–2026 Edstellar. All rights reserved.</p>
    </div>
  </footer>
  ```
- **CSS rules:**
  ```css
  .sf-footer { padding: 48px 48px 32px; background: #1a1c4a; border-top: 3px solid var(--lime, #C5E826); }
  .sf-container { max-width: 1120px; margin: 0 auto; text-align: center; }
  .sf-certs { display: flex; justify-content: center; gap: 16px; margin-bottom: 24px; }
  .sf-cert { display: inline-flex; align-items: center; padding: 6px 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); }
  .sf-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 24px; }
  .sf-links a { font-size: 14px; color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.25s; }
  .sf-links a:hover { color: var(--lime, #C5E826); }
  .sf-social { display: flex; justify-content: center; gap: 16px; margin-bottom: 24px; }
  .sf-social a { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); border-radius: 50%; color: rgba(255,255,255,0.7); transition: all 0.25s; }
  .sf-social a:hover { background: var(--lime, #C5E826); color: var(--navy, #2D2F6B); }
  .sf-copy { font-size: 13px; color: rgba(255,255,255,0.45); }
  @media (max-width: 768px) {
    .sf-footer { padding: 32px 20px 24px; }
    .sf-certs { flex-direction: column; align-items: center; }
    .sf-links { flex-direction: column; gap: 12px; }
  }
  ```
- **Content mapping:** Direct copy from document
- **JS required:** none

---

## Recommended page flow

1. `edstellar-hero-classic-split.html` — Hero + Meta Tags (S01)
2. `CUSTOM: #what-is-od` — What Is OD Consulting? Definitional Intro (S02)
3. `CUSTOM: #why-od-consultants` — Why Work with Our OD Consultants? 4 Benefit Pillars (S03)
4. `edstellar-stats-card-grid.html` — Trust / Proof Bar (S04)
5. `CUSTOM: #three-pillars` — Three Pillars, What We Do (S05)
6. `edstellar-subservices-for-linking-with-image.html` — OD Consulting Services 8 Tiles (S06)
7. `edstellar-detailed-explanation-of-service-with-image-and-accordion.html` — Service Deep-Dives 5 Areas (S07–S11)
8. `edstellar-process-horizontal-timeline.html` — Our Approach 4-Step Model (S12)
9. `edstellar-industries-icon-grid.html` — Industries We Serve (S13)
10. `edstellar-differentiators-option-a.html` — Why Choose Edstellar (S14)
11. `edstellar-success-stories-light-version-with-image.html` — Case Studies 6 Sectors (S15)
12. `edstellar-testimonials-section-with-small-user-thumbnail.html` — Client Testimonials (S16)
13. `CUSTOM: #logo-wall` — Partner / Client Logo Wall (S17)
14. `edstellar-faq-section.html` — FAQ Section (S18)
15. `edstellar-download-asset-option-c.html` — Gated Asset, OD Readiness Checklist (S19)
16. `CUSTOM: #cta-banner` — CTA Banner (S20)
17. `edstellar-form-section.html` — On-Page Contact Form (S21)
18. `edstellar-resources-section.html` — Resources / Blog (S22)
19. `edstellar-connected-services-compact-strip.html` — Connected Services (Added)
20. `CUSTOM: #site-footer` — Footer (S23)

---

## Notes
- S07–S11 (5 service deep-dives) are combined into a single accordion section to avoid excessive vertical length. The accordion allows interactive exploration of all 5 capability areas.
- S06 (8 service tiles) extends the sub_services 3x2 grid to accommodate 8 cards. Layout adjusted to 4-column desktop grid.
- S15 (case studies) and S16 (testimonials) carousels need extending to 6 stories and 6 quotes respectively.
- S13 (industries) reduced from the template's 9 to 6 industries matching the document's sector coverage.
- S12 (process) reduced from 5 steps to 4 (Assess → Diagnose → Design → Implement & Measure).
- Connected Services section (S19 in page flow) added as standard cross-sell — not in the original document but is standard Edstellar page pattern.
- Gated assets 01-04 described in the document are content strategy recommendations, not visual page sections. The page includes S19 (OD Readiness Checklist) as the primary gated asset section.
- All em dashes (—) and double dashes (--) in content should be replaced with commas during page assembly per user instruction.
- Footer (S23) uses a slightly darker navy (#1a1c4a) to differentiate from main navy sections.
