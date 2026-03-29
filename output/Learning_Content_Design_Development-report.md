# Design Scout Report

**Page:** Learning Content Design & Development Solutions
**Date:** 2026-03-21
**Sections identified:** 20 (16 content sections + testimonial + download asset + form + footer)
**Library matched:** 16 | **Custom designs:** 4

---

## Section mapping

### 1. Hero Banner
- **Content summary:** H1 "Learning Content Design and Development Solutions" + subtitle + dual CTA (Request a Consultation / Explore Our Services) + 3 trust metrics + image placeholder
- **Status:** ✅ MATCHED
- **Library category:** hero
- **Recommended:** `edstellar-hero-classic-split.html` (hero-classic-split)
- **Why:** Split 55/45 layout matches content structure — H1 left with checkmarks, image right, logo strip below. Dual CTA and trust metrics are native features.
- **Alternatives:** None (single variant)
- **Content mapping notes:**
  - Eyebrow: "Learning Architecture"
  - H1: "Learning Content Design and Development Solutions"
  - Subtitle: The NOW version (expanded 80-120 word paragraph)
  - Primary CTA: "Request a Consultation"
  - Secondary CTA: "Explore Our Services"
  - Trust metrics: "12+ Content Format Types" | "100+ Global Locations" | "Fortune 500 Clients"
  - Breadcrumb: Home > Consulting > Learning Content Design & Development

### 2. Value Proposition Strip
- **Content summary:** 5 trust signal stats (5,000+ Expert Trainers, 2,000+ Learning Programs, 100+ Global Locations, Fortune 500 Clients, 14+ Years) + ghost CTA
- **Status:** ✅ MATCHED
- **Library category:** stats
- **Recommended:** `edstellar-stats-card-grid.html` (stats-card-grid)
- **Why:** 4-column navy card grid on light background is the closest match. Content has 5 stats — use 5 cards (extend grid from 4 to 5 columns, or use 3+2 row layout).
- **Alternatives:** `edstellar-stats-icon-cards.html` (stats-icon-cards) — editorial heading variant, but content here is pure stats without narrative heading
- **Content mapping notes:**
  - Card 1: "5,000+" / "Expert Trainers"
  - Card 2: "2,000+" / "Learning Programs"
  - Card 3: "100+" / "Global Locations"
  - Card 4: "Fortune 500" / "Clients — Visa, ABB, KPMG, BCG"
  - Card 5: "14+" / "Years in Corporate Learning"
  - Below stats: ghost CTA "See Our Client Success Stories"

### 3. Why Learning Content Design Matters
- **Content summary:** H2 "Elevate Workforce Performance Through Tailored Learning Content" + 2 body paragraphs (150-200 words)
- **Status:** ✅ MATCHED
- **Library category:** definitional_intro
- **Recommended:** `edstellar-definitional-intro.html` (definitional-intro)
- **Why:** Centered narrow-width section with label + H2 + 2 paragraphs with lime left accent bar — exactly matches this intro content structure.
- **Alternatives:** None (single variant)
- **Content mapping notes:**
  - Label: "Why It Matters"
  - H2: "Elevate Workforce Performance Through Tailored Learning Content"
  - Lead paragraph (lime accent): First body paragraph about capability gap
  - Second paragraph: Edstellar's learner-centric content solutions paragraph

### 4. Our Learner-Centric Services (12 Service Cards)
- **Content summary:** Eyebrow + H2 + section desc + 12 individual service cards, each with H3 title + 2-3 sentence description + "Learn More" link
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #services-grid-12
- **Background:** var(--surface)
- **Layout:** Centered heading + 4x3 card grid. Each card has lime top accent bar, icon circle, H3 title, description, and "Learn More" text link. Based on three-pillars card pattern extended to 12 items.
- **CSS class prefix:** `.sg12-`
- **HTML structure:**
  ```html
  <section id="services-grid-12" class="sg12-section">
    <div class="sg12-container">
      <div class="sg12-label"><span class="sg12-bar"></span><span>Our Learner-Centric Services</span></div>
      <h2 class="sg12-heading">{heading}</h2>
      <p class="sg12-intro">{description}</p>
      <div class="sg12-grid">
        <!-- Repeat 12 times -->
        <div class="sg12-card">
          <div class="sg12-accent"></div>
          <div class="sg12-icon"><svg viewBox="0 0 24 24" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="2" fill="none"/></svg></div>
          <h3 class="sg12-card-title">{card.title}</h3>
          <p class="sg12-card-desc">{card.description}</p>
          <a href="#" class="sg12-link">Learn More <span>&rarr;</span></a>
        </div>
      </div>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .sg12-section { padding: 72px 48px; background: var(--surface); }
  .sg12-container { max-width: 1120px; margin: 0 auto; text-align: center; }
  .sg12-label { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .sg12-label .sg12-bar { width: 28px; height: 3px; background: var(--lime); }
  .sg12-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--navy); }
  .sg12-heading { font-size: 36px; font-weight: 700; color: var(--navy); margin-bottom: 16px; line-height: 1.25; }
  .sg12-intro { font-size: 17px; line-height: 1.7; color: var(--text-secondary); max-width: 720px; margin: 0 auto 44px; }
  .sg12-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; text-align: left; }
  .sg12-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(45,47,107,0.05); transition: all 0.25s; display: flex; flex-direction: column; }
  .sg12-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(45,47,107,0.08); }
  .sg12-accent { height: 4px; background: var(--lime); }
  .sg12-icon { width: 48px; height: 48px; background: rgba(45,47,107,0.06); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 24px 24px 14px; }
  .sg12-icon svg { width: 22px; height: 22px; stroke: var(--navy); fill: none; stroke-width: 2; }
  .sg12-card-title { font-size: 17px; font-weight: 700; color: var(--navy); margin: 0 24px 8px; line-height: 1.3; }
  .sg12-card-desc { font-size: 14px; line-height: 1.65; color: #555; margin: 0 24px 16px; flex: 1; }
  .sg12-link { font-size: 13px; font-weight: 600; color: var(--navy); text-decoration: none; margin: 0 24px 24px; display: inline-flex; align-items: center; gap: 4px; transition: color 0.2s; }
  .sg12-link:hover { color: var(--lime); }
  .sg12-link span { transition: transform 0.2s; }
  .sg12-link:hover span { transform: translateX(3px); }
  @media (max-width: 1024px) { .sg12-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px) {
    .sg12-section { padding: 40px 20px; }
    .sg12-heading { font-size: 26px; }
    .sg12-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  }
  @media (max-width: 480px) { .sg12-grid { grid-template-columns: 1fr; } }
  ```
- **Content mapping:**
  - Label: "Our Learner-Centric Services"
  - H2: "Our Learner-Centric Learning Content Design & Development Services"
  - Intro: "From custom eLearning to immersive simulations and performance support..."
  - Card 1: "Custom eLearning Design and Development" + description
  - Card 2: "Instructor-Led Training (ILT) Content Design" + description
  - Card 3: "Virtual Instructor-Led Training (VILT) Materials" + description
  - Card 4: "Blended Learning Solutions for the Modern Workforce" + description
  - Card 5: "Microlearning Content Development for Rapid Skill Building" + description
  - Card 6: "Gamification & Game-Based Learning Experiences" + description
  - Card 7: "Simulation-Based Learning for Real-World Competency" + description
  - Card 8: "AR & VR Immersive Learning Solutions" + description
  - Card 9: "Video Content Development for Corporate Training" + description
  - Card 10: "Mobile Learning (M-Learning) Content Development" + description
  - Card 11: "Content Conversion and Modernisation Services" + description
  - Card 12: "Content Curation Services" + description
  - Each card: "Learn More →" link
- **JS required:** None
- **Icon SVGs per card (unique per service):**
  - Card 1 (eLearning): monitor/screen icon
  - Card 2 (ILT): presentation/chalkboard icon
  - Card 3 (VILT): video-camera/webcam icon
  - Card 4 (Blended): layers/stack icon
  - Card 5 (Microlearning): zap/lightning icon
  - Card 6 (Gamification): trophy/gamepad icon
  - Card 7 (Simulation): cpu/grid icon
  - Card 8 (AR/VR): headset/box icon
  - Card 9 (Video): play-circle icon
  - Card 10 (Mobile): smartphone icon
  - Card 11 (Conversion): refresh-cw/arrows icon
  - Card 12 (Curation): bookmark/folder icon

### 5. Content Development Process
- **Content summary:** H2 "Our Custom Content Development Process — From Discovery to Deployment" + 6 numbered steps with descriptions + section CTA
- **Status:** ✅ MATCHED
- **Library category:** process
- **Recommended:** `edstellar-process-vertical-stepper.html` (process-vertical-stepper)
- **Why:** Navy background vertical stepper with detailed content per step. The 6-step content needs room for body text per step, which the vertical stepper provides. Premium dark section creates visual contrast after the light service cards.
- **Alternatives:** `edstellar-process-card-grid.html` (process-card-grid) — interactive expandable cards, good but less linear; `edstellar-process-horizontal-timeline.html` — has 5 steps (content has 6)
- **Content mapping notes:**
  - Label: "Our Process"
  - H2: "Our Custom Content Development Process, From Discovery to Deployment"
  - Description: "Six phases. One proven methodology..."
  - Step 1: "Discovery & Learning Needs Assessment" + body
  - Step 2: "Instructional Design and Content Blueprint" + body
  - Step 3: "Content Development & Production" + body
  - Step 4: "Review, Refinement & Quality Assurance" + body
  - Step 5: "Deployment, Implementation & Trainer Support" + body
  - Step 6: "Measurement, Analytics & Continuous Optimisation" + body

### 6. Testimonial
- **Content summary:** Client quote from L&D Director about completion rates improving from 30% to 85%+
- **Status:** ✅ MATCHED
- **Library category:** testimonials
- **Recommended:** `edstellar-testimonials-section-with-small-user-thumbnail.html` (testimonials-split-carousel)
- **Why:** Quote card with avatar and carousel navigation. Single testimonial can still use this layout effectively.
- **Alternatives:** None (single variant)
- **Content mapping notes:**
  - Quote: "The learning content Edstellar designed for our teams was a step change from what we had before. Completion rates went from 30% to over 85%, and our managers reported visible improvement in on-the-job application within six weeks."
  - Author: "L&D Director"
  - Role: "Fortune 500 Technology Company"

### 7. Download Asset
- **Content summary:** "Download Our Content Development Guide" — downloadable asset CTA from process section
- **Status:** ✅ MATCHED
- **Library category:** download_asset
- **Recommended:** `edstellar-download-asset-option-c.html` (download-banner-card)
- **Why:** Navy card with lime accent, dual CTAs, and asset preview inset. Compact self-contained section that works well after the testimonial.
- **Alternatives:** `edstellar-download-asset-option-a.html` (download-split-preview) — lighter split layout
- **Content mapping notes:**
  - Title: "Content Development Guide"
  - Description: "Download our step-by-step guide to designing and developing learning content that drives measurable performance outcomes."
  - Primary CTA: "Download Guide"
  - Secondary CTA: "View Sample"
  - Features: "6-Phase Methodology" | "Format Selection Matrix" | "Quality Checklist"

### 8. Content Formats We Develop
- **Content summary:** H2 + section desc + 14 content format items, each with format name and short description
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #content-formats
- **Background:** var(--light-bg) where --light-bg: #EEF0F4
- **Layout:** Centered heading + 2-column format row list on light background. Each row has a numbered badge (01-14), format name as H4, and short description. Based on ranked-leaderboard row pattern but adapted for light background.
- **CSS class prefix:** `.cf-`
- **HTML structure:**
  ```html
  <section id="content-formats" class="cf-section">
    <div class="cf-container">
      <div class="cf-header">
        <div>
          <div class="section-label"><div class="bar"></div><span>Content Formats</span></div>
          <h2 class="cf-heading">{heading}</h2>
        </div>
        <div>
          <p class="cf-sub">{description}</p>
          <div class="cf-total"><span class="cf-dot"></span> {total_count} formats available</div>
        </div>
      </div>
      <div class="cf-grid">
        <div class="cf-col">
          <!-- Formats 1-7 -->
          <div class="cf-row">
            <div class="cf-num">01</div>
            <div class="cf-info"><h4>{format.name}</h4><p>{format.description}</p></div>
          </div>
        </div>
        <div class="cf-col">
          <!-- Formats 8-14 -->
          <div class="cf-row">
            <div class="cf-num">08</div>
            <div class="cf-info"><h4>{format.name}</h4><p>{format.description}</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .cf-section { padding: 72px 48px; background: #EEF0F4; }
  .cf-container { max-width: 1060px; margin: 0 auto; }
  .cf-header { display: grid; grid-template-columns: 45% 52%; gap: 3%; align-items: end; margin-bottom: 36px; }
  .cf-heading { font-size: 30px; font-weight: 800; color: var(--navy); line-height: 1.2; letter-spacing: -0.03em; }
  .cf-sub { font-size: 14px; color: #555; line-height: 1.65; }
  .cf-total { display: inline-flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 13px; font-weight: 700; color: var(--navy); }
  .cf-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--lime); display: inline-block; }
  .cf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .cf-col { display: flex; flex-direction: column; gap: 8px; }
  .cf-row { display: grid; grid-template-columns: 48px 1fr; gap: 16px; align-items: center; background: #fff; border: 1px solid #DCDEE5; border-radius: 12px; padding: 18px 24px; transition: all 0.25s; }
  .cf-row:hover { border-color: rgba(197,232,38,0.4); box-shadow: 0 4px 16px rgba(45,47,107,0.06); }
  .cf-num { width: 40px; height: 40px; border-radius: 12px; background: rgba(45,47,107,0.08); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; color: var(--navy); flex-shrink: 0; }
  .cf-row:hover .cf-num { background: var(--lime); color: #1A2600; }
  .cf-info h4 { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 2px; }
  .cf-info p { font-size: 12px; color: #777; line-height: 1.5; }
  @media (max-width: 768px) {
    .cf-section { padding: 40px 20px; }
    .cf-header { grid-template-columns: 1fr; gap: 16px; }
    .cf-grid { grid-template-columns: 1fr; }
  }
  ```
- **Content mapping:**
  - Label: "Content Formats"
  - H2: "Content Formats We Develop"
  - Description: "Twelve content formats. One unified design methodology..."
  - Total: "14+ formats available"
  - Column 1 (01-07): eLearning Modules, ILT Materials, VILT Resources, Microlearning Modules, Gamified Content, Video Learning, Simulations
  - Column 2 (08-14): AR/VR Experiences, Mobile Learning, Job Aids, Interactive PDFs, Assessments & Certification, Nudge Campaigns, Workflow Embeds
- **JS required:** None

### 9. AI-Powered Learning Content Design
- **Content summary:** H2 + 2 body paragraphs + 5 AI capability bullet items + ghost CTA
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #ai-powered
- **Background:** var(--navy)
- **Layout:** Navy background, split layout — left side has label + H2 + 2 body paragraphs + CTA button, right side has 5 AI capability cards with lime numbered indicators. Based on benefit-pillars visual language.
- **CSS class prefix:** `.aip-`
- **HTML structure:**
  ```html
  <section id="ai-powered" class="aip-section">
    <div class="aip-container">
      <div class="aip-split">
        <div class="aip-left">
          <div class="aip-label"><span class="aip-bar"></span><span>AI-Powered</span></div>
          <h2 class="aip-heading">{heading}</h2>
          <p class="aip-body">{paragraph_1}</p>
          <p class="aip-body">{paragraph_2}</p>
          <a href="#" class="aip-cta">{cta_text}</a>
        </div>
        <div class="aip-right">
          <!-- Repeat 5 times -->
          <div class="aip-cap">
            <div class="aip-cap-num">01</div>
            <div class="aip-cap-text">{capability}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .aip-section { padding: 72px 48px; background: var(--navy); }
  .aip-container { max-width: 1120px; margin: 0 auto; }
  .aip-split { display: grid; grid-template-columns: 52% 44%; gap: 4%; align-items: start; }
  .aip-label { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .aip-label .aip-bar { width: 28px; height: 3px; background: var(--lime); }
  .aip-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--lime); }
  .aip-heading { font-size: 36px; font-weight: 700; color: #fff; margin-bottom: 20px; line-height: 1.25; }
  .aip-body { font-size: 16px; line-height: 1.75; color: rgba(255,255,255,0.75); margin-bottom: 16px; }
  .aip-cta { display: inline-block; margin-top: 12px; padding: 12px 28px; border: 1.5px solid rgba(255,255,255,0.3); border-radius: 8px; color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.25s; }
  .aip-cta:hover { border-color: var(--lime); color: var(--lime); }
  .aip-right { display: flex; flex-direction: column; gap: 12px; }
  .aip-cap { display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px 24px; transition: all 0.25s; }
  .aip-cap:hover { background: rgba(255,255,255,0.1); transform: translateX(4px); }
  .aip-cap-num { font-size: 22px; font-weight: 800; color: var(--lime); flex-shrink: 0; min-width: 32px; }
  .aip-cap-text { font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); line-height: 1.5; }
  @media (max-width: 768px) {
    .aip-section { padding: 40px 20px; }
    .aip-heading { font-size: 26px; }
    .aip-split { grid-template-columns: 1fr; gap: 32px; }
  }
  ```
- **Content mapping:**
  - Label: "AI-Powered"
  - H2: "AI-Powered Learning Content Design & Development"
  - Paragraph 1: "Edstellar integrates AI throughout the content development lifecycle..."
  - Paragraph 2: "Our AI-assisted design approach allows Edstellar..."
  - CTA: "See How AI Powers Our Content"
  - Capability 01: "Automated gap analysis and competency mapping"
  - Capability 02: "AI-accelerated eLearning module production"
  - Capability 03: "Personalised content pathway generation"
  - Capability 04: "Natural language processing for content quality checks"
  - Capability 05: "Predictive analytics for learner engagement and drop-off"
- **JS required:** None

### 10. The Transformation
- **Content summary:** Eyebrow + H2 "From Generic Content to Immersive Learning" + description + 4 transformation phases, each with Problem/Solution/Outcome
- **Status:** 🔧 CUSTOM DESIGN
- **Section ID:** #transformation
- **Background:** var(--surface)
- **Layout:** Centered heading + 4-column card grid. Each card has three stacked sections: Problem (top, red accent), Solution (middle, navy accent), Outcome (bottom, lime accent). Hover lifts card.
- **CSS class prefix:** `.tf-`
- **HTML structure:**
  ```html
  <section id="transformation" class="tf-section">
    <div class="tf-container">
      <div class="tf-label"><span class="tf-bar"></span><span>The Transformation</span></div>
      <h2 class="tf-heading">{heading}</h2>
      <p class="tf-intro">{description}</p>
      <div class="tf-grid">
        <!-- Repeat 4 times -->
        <div class="tf-card">
          <div class="tf-phase-label">Phase {n}</div>
          <div class="tf-problem">
            <div class="tf-tag tf-tag-red">Challenge</div>
            <p>{problem}</p>
          </div>
          <div class="tf-solution">
            <div class="tf-tag tf-tag-navy">Solution</div>
            <p>{solution}</p>
          </div>
          <div class="tf-outcome">
            <div class="tf-tag tf-tag-lime">Outcome</div>
            <p>{outcome}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  ```
- **CSS rules:**
  ```css
  .tf-section { padding: 72px 48px; background: var(--surface); }
  .tf-container { max-width: 1120px; margin: 0 auto; text-align: center; }
  .tf-label { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .tf-label .tf-bar { width: 28px; height: 3px; background: var(--lime); }
  .tf-label span:last-child { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--navy); }
  .tf-heading { font-size: 36px; font-weight: 700; color: var(--navy); margin-bottom: 16px; line-height: 1.25; }
  .tf-intro { font-size: 17px; line-height: 1.7; color: #555; max-width: 780px; margin: 0 auto 44px; }
  .tf-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: left; }
  .tf-card { background: #fff; border: 1px solid #DCDEE5; border-radius: 12px; overflow: hidden; transition: all 0.25s; display: flex; flex-direction: column; }
  .tf-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(45,47,107,0.08); }
  .tf-phase-label { padding: 16px 20px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--navy); }
  .tf-problem, .tf-solution, .tf-outcome { padding: 12px 20px; }
  .tf-problem { border-left: 3px solid #E74C3C; margin: 0 12px; padding: 12px; border-radius: 6px; background: rgba(231,76,60,0.04); }
  .tf-solution { border-left: 3px solid var(--navy); margin: 0 12px; padding: 12px; border-radius: 6px; background: rgba(45,47,107,0.04); }
  .tf-outcome { border-left: 3px solid var(--lime); margin: 0 12px 16px; padding: 12px; border-radius: 6px; background: rgba(197,232,38,0.08); }
  .tf-tag { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 3px 8px; border-radius: 4px; margin-bottom: 6px; }
  .tf-tag-red { background: rgba(231,76,60,0.1); color: #C0392B; }
  .tf-tag-navy { background: rgba(45,47,107,0.1); color: var(--navy); }
  .tf-tag-lime { background: rgba(197,232,38,0.2); color: #1A2600; }
  .tf-problem p, .tf-solution p, .tf-outcome p { font-size: 13px; line-height: 1.55; color: #444; }
  @media (max-width: 1024px) { .tf-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) {
    .tf-section { padding: 40px 20px; }
    .tf-heading { font-size: 26px; }
    .tf-grid { grid-template-columns: 1fr; }
  }
  ```
- **Content mapping:**
  - Label: "The Transformation"
  - H2: "From Generic Content to Immersive Learning"
  - Intro: "Most organisations invest in training content that checks a box..."
  - Phase 1: Problem: "Generic, text-heavy eLearning..." / Solution: "Digital Ecosystem: Custom eLearning..." / Outcome: "Role-mapped, competency-aligned modules..."
  - Phase 2: Problem: "Technical and leadership training..." / Solution: "Strategic Design: Simulation-Based..." / Outcome: "Zero-risk practice environments..."
  - Phase 3: Problem: "Knowledge retention drops 70%..." / Solution: "Performance Support: Microlearning..." / Outcome: "Spaced repetition and on-the-job tools..."
  - Phase 4: Problem: "No data on content effectiveness..." / Solution: "Measurable Impact: xAPI Analytics..." / Outcome: "Every content interaction tracked..."
- **JS required:** None

### 11. Industries We Serve
- **Content summary:** H2 "Industry-Specific Learning Content We Develop" + overview paragraph + 8 industries with descriptions + CTA
- **Status:** ✅ MATCHED
- **Library category:** industries
- **Recommended:** `edstellar-industries-icon-grid.html` (industries-icon-grid)
- **Why:** 3x3 icon card grid on white background. Content has 8 industries which fits a 3x3 grid (leaving one slot for a CTA card or using 3+3+2 layout).
- **Alternatives:** `edstellar-industries-navy-split.html` — navy variant with stat card; `edstellar-industries-selectable-tiles.html` — interactive tiles
- **Content mapping notes:**
  - H2: "Industry-Specific Learning Content We Develop"
  - Overview: "Our instructional designers and content developers..."
  - Industry 1: Manufacturing — Safety, compliance, technical upskilling
  - Industry 2: Healthcare & Pharma — Regulatory compliance, clinical skills
  - Industry 3: Financial Services — Compliance, risk management
  - Industry 4: IT & Technology — Technical onboarding, product training
  - Industry 5: Retail & E-Commerce — Customer experience, operations
  - Industry 6: Energy & Utilities — HSE compliance, technical competency
  - Industry 7: Telecommunications — Technical skills, customer service
  - Industry 8: Government & PSUs — Compliance, leadership
  - CTA: "Talk to an Industry Expert"

### 12. Why Leading Organisations Choose Edstellar
- **Content summary:** H2 + 5 differentiators with title + description + section CTA
- **Status:** ✅ MATCHED
- **Library category:** differentiators
- **Recommended:** `edstellar-differentiators-option-a.html` (diff-image-list)
- **Why:** Left image + heading with right differentiator list, alternating accent bars. 6 differentiators in template, content has 5 — perfect fit.
- **Alternatives:** None (single variant)
- **Content mapping notes:**
  - H2: "Why Leading Organisations Choose Edstellar for Learning Content Design"
  - Diff 1: "Full-Service Capability" + description
  - Diff 2: "Technology-Enabled, AI-Powered Production" + description
  - Diff 3: "Industry-Specific Expertise" + description
  - Diff 4: "Global Reach at Enterprise Scale" + description
  - Diff 5: "Talent Transformation Partner" + description
  - CTA: "View Case Studies"

### 13. Client Impact Stats
- **Content summary:** Eyebrow "Client Impact" + H2 "Enterprise Learning Content at Scale" + 4 stat metrics
- **Status:** ✅ MATCHED
- **Library category:** stats
- **Recommended:** `edstellar-stats-icon-cards.html` (stats-icon-cards)
- **Why:** Left editorial heading (32%) + right 2x2 icon card grid (64%). Content has eyebrow + title + 4 stats needing narrative context, which the icon-cards variant provides perfectly.
- **Alternatives:** `edstellar-stats-card-grid.html` — simpler grid, but stats-icon-cards better for this editorial placement later in the page
- **Content mapping notes:**
  - Eyebrow: "Client Impact"
  - H2: "Enterprise Learning Content at Scale"
  - Stat 1: "85%+" / "Average completion rate for Edstellar-designed digital content"
  - Stat 2: "12+" / "Content format types available"
  - Stat 3: "3x" / "Knowledge retention improvement with embedded performance support"
  - Stat 4: "100%" / "SCORM and xAPI compliance across all digital content outputs"

### 14. Ecosystem Integration
- **Content summary:** Eyebrow + H2 "How Edstellar Designs Learning That Sticks" + description + 5 connected steps (Diagnose → Design → Build → Deploy → Sustain)
- **Status:** ✅ MATCHED
- **Library category:** process
- **Recommended:** `edstellar-process-horizontal-timeline.html` (process-horizontal-timeline)
- **Why:** 5 numbered circles on horizontal connecting line — matches exactly the 5-step ecosystem flow. Light background creates contrast after the stats section. Different visual from the vertical stepper used in section 5.
- **Alternatives:** `edstellar-closed-loop-cycle.html` — only 4 steps (content has 5)
- **Content mapping notes:**
  - Label: "Ecosystem Integration"
  - H2: "How Edstellar Designs Learning That Sticks"
  - Description: "Learning architecture doesn't live in isolation..."
  - Step 1: "Diagnose" + description
  - Step 2: "Design" + description
  - Step 3: "Build" + description
  - Step 4: "Deploy" + description
  - Step 5: "Sustain" + description

### 15. Connected Services
- **Content summary:** Eyebrow + description + 3 service cards (Talent Diagnostics, Managed Training, Training Programs)
- **Status:** ✅ MATCHED
- **Library category:** connected_services
- **Recommended:** `edstellar-connected-services-card-strip.html` (connected-card-strip)
- **Why:** 3-column white cards on light background with icon, title, description, arrow CTA. Exact match for 3 connected services.
- **Alternatives:** `edstellar-connected-services-navy-scroll.html` — navy scrollable (overkill for 3 items); `edstellar-connected-services-compact-strip.html` — too minimal
- **Content mapping notes:**
  - Label: "Connected Services"
  - Intro: "Learning architecture integrates with diagnostics, managed training, and training delivery..."
  - Card 1: "Talent Diagnostics" + description + "Explore Diagnostics →"
  - Card 2: "Managed Training" + description + "Explore Managed Training →"
  - Card 3: "Training Programs" + description + "Explore Training →"

### 16. FAQ
- **Content summary:** H2 "Frequently Asked Questions About Learning Content Design & Development" + 7 Q&A items + CTA
- **Status:** ✅ MATCHED
- **Library category:** faq
- **Recommended:** `edstellar-faq-section.html` (faq-accordion)
- **Why:** Accordion with expand/collapse, navy/lime borders. Template has 5 questions, content has 7 — extend to 7 items.
- **Alternatives:** None (single variant)
- **Content mapping notes:**
  - H2: "Frequently Asked Questions About Learning Content Design & Development"
  - Q1-Q7 with full answers from content document
  - FAQ CTA: "Still Have Questions? Talk to Us"

### 17. Related Insights & Resources
- **Content summary:** H2 + intro + 4 resource tiles (guides, eBooks, blogs)
- **Status:** ✅ MATCHED
- **Library category:** resources
- **Recommended:** `edstellar-resources-section.html` (resources-3col)
- **Why:** 3-column blog/resource cards with images and hover zoom. Content has 4 resources — can use 4-column or show 3 + "View All" link.
- **Alternatives:** None (single variant)
- **Content mapping notes:**
  - H2: "Related Insights & Resources"
  - Intro: "Explore Edstellar's guides, eBooks, and research..."
  - Resource 1: "How to Build a Learning Content Strategy That Drives Performance" (Guide)
  - Resource 2: "The Complete Guide to eLearning Design and Development" (eBook)
  - Resource 3: "Microlearning vs eLearning, Which Format Is Right for Your Programme?" (Blog)
  - Resource 4: "How to Evaluate and Procure a Learning Content Design Partner" (Guide) — show as 4th card or "View All" overflow

### 18. Final CTA
- **Content summary:** H2 "Ready to Transform Your Workforce with Expert Learning Content?" + body + 3 value bullets + dual CTA
- **Status:** ✅ MATCHED
- **Library category:** cta_banner
- **Recommended:** `edstellar-cta-banner-lime.html` (cta-banner-lime)
- **Why:** High-contrast lime background CTA strip. The value bullets and dual CTA extend the template slightly but the lime banner is the right visual pattern for maximum conversion.
- **Alternatives:** None (single variant)
- **Content mapping notes:**
  - H2: "Ready to Transform Your Workforce with Expert Learning Content?"
  - Body: "Create learning experiences that drive performance..."
  - Value bullets: 3 items (custom eLearning formats, SCORM/xAPI compliant, AI-powered production)
  - Primary CTA: "Start Designing Learning That Drives Performance"
  - Secondary CTA: "Request a Consultation"

### 19. Lead Capture Form
- **Content summary:** Standard consulting page lead capture form for "Request a Consultation" conversions
- **Status:** ✅ MATCHED
- **Library category:** form
- **Recommended:** `edstellar-form-section.html` (form-split-image)
- **Why:** Left image + right form panel. Standard for all consulting pages.
- **Alternatives:** None (single variant)
- **Content mapping notes:**
  - Form title: "Request a Consultation"
  - Description: "Tell us about your learning content challenge. Our team will respond within 24 hours."
  - Fields: standard 8 fields from template
  - Submit: "Request Consultation"

### 20. Footer
- **Content summary:** Standard footer with copyright, legal links, social icons
- **Status:** ✅ MATCHED
- **Library category:** footer
- **Recommended:** `edstellar-footer.html` (footer-centered)
- **Why:** Standard footer for all consulting pages.
- **Alternatives:** None (single variant)
- **Content mapping notes:**
  - Copyright: "© 2025 Edstellar. All rights reserved."
  - Legal links: Privacy Policy | Terms of Service

---

## Recommended page flow

1. `edstellar-hero-classic-split.html` — Hero Banner
2. `edstellar-stats-card-grid.html` — Value Proposition Strip
3. `edstellar-definitional-intro.html` — Why Learning Content Design Matters
4. `CUSTOM: #services-grid-12` — Our Learner-Centric Services (12 Cards)
5. `edstellar-process-vertical-stepper.html` — Content Development Process
6. `edstellar-testimonials-section-with-small-user-thumbnail.html` — Testimonial
7. `edstellar-download-asset-option-c.html` — Download Asset
8. `CUSTOM: #content-formats` — Content Formats We Develop
9. `CUSTOM: #ai-powered` — AI-Powered Learning Content Design
10. `CUSTOM: #transformation` — The Transformation
11. `edstellar-industries-icon-grid.html` — Industries We Serve
12. `edstellar-differentiators-option-a.html` — Why Edstellar
13. `edstellar-stats-icon-cards.html` — Client Impact Stats
14. `edstellar-process-horizontal-timeline.html` — Ecosystem Integration
15. `edstellar-connected-services-card-strip.html` — Connected Services
16. `edstellar-faq-section.html` — FAQ
17. `edstellar-resources-section.html` — Related Insights & Resources
18. `edstellar-cta-banner-lime.html` — Final CTA
19. `edstellar-form-section.html` — Lead Capture Form
20. `edstellar-footer.html` — Footer

---

## Notes

1. **Stats section used twice:** stats-card-grid for section 2 (value prop strip) and stats-icon-cards for section 13 (client impact). Different variants prevent visual repetition.
2. **Process section used twice:** process-vertical-stepper for section 5 (6-step process) and process-horizontal-timeline for section 14 (5-step ecosystem). Different variants and step counts prevent repetition.
3. **12 Service Cards custom design** is the most significant custom section — 4-column grid extending the three-pillars card pattern to 12 items with unique SVG icons per card.
4. **Content Formats custom design** uses ranked-leaderboard visual language adapted for a light-background 2-column layout with 14 numbered format rows.
5. **AI-Powered custom design** uses a navy split layout combining the definitional-intro text pattern with benefit-pillars numbered card pattern.
6. **Transformation custom design** introduces a Problem→Solution→Outcome tri-colour card pattern unique to this page.
7. **Testimonial** is extracted from Section 5 of the content document and placed as a standalone section between process and download asset for pacing.
8. **Form section** added as standard consulting page conversion element, not explicitly in content document but implied by "Request a Consultation" CTAs throughout.
9. **Em dashes and double dashes** throughout the content should be replaced with commas per user instruction.
