/**
 * Content Injection Engine
 * Parses structured developer-reference content and injects it
 * into HTML templates using cheerio. No AI required.
 */
import * as cheerio from "cheerio";

/* ────────────────────────────────────────────
   Content Parser — extract structured fields from document text
   ──────────────────────────────────────────── */

export interface ContentFields {
  heading: string;
  subheading: string;
  paragraphs: string[];
  sectionLabel: string;
  breadcrumb: string;
  items: { title: string; description: string; extra: string }[];
  bullets: string[];
  stats: { number: string; label: string; source: string }[];
  primaryCta: string;
  secondaryCta: string;
  bottomCta: string;
  imageDesc: string;
  faqs: { question: string; answer: string }[];
  raw: string;
}

export function parseContent(text: string): ContentFields {
  const lines = text.split("\n").map(l => l.trim());
  const fields: ContentFields = {
    heading: "", subheading: "", paragraphs: [], sectionLabel: "",
    breadcrumb: "", items: [], bullets: [], stats: [],
    primaryCta: "", secondaryCta: "", bottomCta: "",
    imageDesc: "", faqs: [], raw: text,
  };

  let currentItem: { title: string; description: string; extra: string } | null = null;
  let currentFaq: { question: string; answer: string } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      // Flush current FAQ on blank line
      if (currentFaq && currentFaq.answer) {
        fields.faqs.push(currentFaq);
        currentFaq = null;
      }
      continue;
    }

    // Breadcrumb
    if (/^BREADCRUMB/i.test(line)) {
      fields.breadcrumb = line.replace(/^BREADCRUMB\s*/i, "");
      continue;
    }

    // Section label
    if (/^SECTION LABEL/i.test(line)) {
      fields.sectionLabel = line.replace(/^SECTION LABEL\s*/i, "");
      continue;
    }

    // CTAs
    if (/^\[PRIMARY CTA\]/i.test(line)) {
      fields.primaryCta = line.replace(/^\[PRIMARY CTA\]\s*/i, "");
      continue;
    }
    if (/^\[SECONDARY CTA\]/i.test(line)) {
      fields.secondaryCta = line.replace(/^\[SECONDARY CTA\]\s*/i, "");
      continue;
    }
    if (/^\[BOTTOM CTA\]/i.test(line) || /^\[CTA\]/i.test(line)) {
      fields.bottomCta = line.replace(/^\[(BOTTOM )?CTA\]\s*/i, "");
      continue;
    }

    // Image
    if (/^\[IMAGE\]/i.test(line)) {
      fields.imageDesc = line.replace(/^\[IMAGE\]\s*/i, "");
      continue;
    }

    // Stats: "STAT N   number  description *Source: ...*"
    const statMatch = line.match(/^STAT\s+\d+\s+(.+?)[\s]+(.+?)(?:\s*\*Source:\s*(.+?)\*)?$/i);
    if (statMatch) {
      // Split on double-space or tab to separate number from label
      const parts = line.replace(/^STAT\s+\d+\s+/i, "").split(/\s{2,}|\t/);
      if (parts.length >= 2) {
        const sourceMatch = line.match(/\*Source:\s*(.+?)\*/);
        fields.stats.push({
          number: parts[0].trim(),
          label: parts.slice(1).join(" ").replace(/\*Source:.*?\*/i, "").trim(),
          source: sourceMatch ? sourceMatch[1] : "",
        });
      }
      continue;
    }

    // Numbered items: "CHALLENGE N:", "STEP N:", "SERVICE N:", "TAB N:", etc.
    const itemMatch = line.match(/^(CHALLENGE|STEP|SERVICE|TAB|PILLAR|DIFFERENTIATOR|STORY|TESTIMONIAL|INDUSTRY|RESOURCE|FORMAT|CAPABILITY)\s+\d+\s*[:\-]\s*(.*)/i);
    if (itemMatch) {
      if (currentItem) fields.items.push(currentItem);
      currentItem = { title: itemMatch[2].trim(), description: "", extra: "" };
      continue;
    }

    // Impact tag / Duration / Format for current item
    if (currentItem && /^Impact tag:/i.test(line)) {
      currentItem.extra = line.replace(/^Impact tag:\s*/i, "");
      continue;
    }
    if (currentItem && /^Duration:/i.test(line)) {
      currentItem.extra = line.replace(/^Duration:\s*/i, "");
      continue;
    }

    // FAQ: "Q:" or "Q1:" or question line followed by "A:" or answer
    const faqQMatch = line.match(/^Q\d*[:\.]?\s*(.*)/i);
    if (faqQMatch) {
      if (currentFaq) fields.faqs.push(currentFaq);
      currentFaq = { question: faqQMatch[1].trim(), answer: "" };
      continue;
    }
    const faqAMatch = line.match(/^A\d*[:\.]?\s*(.*)/i);
    if (faqAMatch && currentFaq) {
      currentFaq.answer = faqAMatch[1].trim();
      continue;
    }
    if (currentFaq && !currentFaq.answer) {
      // Multi-line question
      currentFaq.question += " " + line;
      continue;
    }
    if (currentFaq && currentFaq.answer) {
      // Multi-line answer
      currentFaq.answer += " " + line;
      continue;
    }

    // Bullet items
    if (line.startsWith("- ") || line.startsWith("• ")) {
      fields.bullets.push(line.replace(/^[-•]\s*/, ""));
      if (currentItem) {
        currentItem.description += (currentItem.description ? " " : "") + line.replace(/^[-•]\s*/, "");
      }
      continue;
    }

    // Current item description continuation
    if (currentItem && line.length > 20 && !/^(BADGE|TRUST|BREADCRUMB|\[)/i.test(line)) {
      currentItem.description += (currentItem.description ? " " : "") + line;
      continue;
    }

    // Heading (first substantial line)
    if (!fields.heading && line.length > 5 && !/^(BADGE|TRUST|BREADCRUMB|SECTION LABEL|\[)/i.test(line)) {
      fields.heading = line;
      continue;
    }

    // Subheading / description (next substantial paragraph)
    if (fields.heading && !fields.subheading && line.length > 40) {
      fields.subheading = line;
      continue;
    }

    // Additional paragraphs
    if (fields.heading && line.length > 30) {
      fields.paragraphs.push(line);
    }
  }

  // Flush remaining
  if (currentItem) fields.items.push(currentItem);
  if (currentFaq) fields.faqs.push(currentFaq);

  return fields;
}

/* ────────────────────────────────────────────
   Template Injectors
   ──────────────────────────────────────────── */

export function injectContent(
  templateHtml: string,
  content: string,
  moduleName: string
): string {
  const fields = parseContent(content);
  const $ = cheerio.load(templateHtml, null, false);

  // Dispatch based on template type
  if (moduleName.includes("hero")) return injectHero($, fields);
  if (moduleName.includes("stats")) return injectStats($, fields);
  if (moduleName.includes("challenges")) return injectChallenges($, fields);
  if (moduleName.includes("definitional")) return injectDefinitional($, fields);
  if (moduleName.includes("three-pillars")) return injectCardItems($, fields);
  if (moduleName.includes("services-option")) return injectServices($, fields);
  if (moduleName.includes("service-explained") || moduleName.includes("detailed-explanation")) return injectServiceDetail($, fields);
  if (moduleName.includes("process")) return injectProcess($, fields);
  if (moduleName.includes("outcomes")) return injectTabs($, fields);
  if (moduleName.includes("industries")) return injectCardItems($, fields);
  if (moduleName.includes("differentiators")) return injectDifferentiators($, fields);
  if (moduleName.includes("success-stories")) return injectStories($, fields);
  if (moduleName.includes("testimonials")) return injectTestimonials($, fields);
  if (moduleName.includes("logo-wall")) return injectGenericHeading($, fields);
  if (moduleName.includes("faq")) return injectFaq($, fields);
  if (moduleName.includes("download-asset")) return injectGenericHeading($, fields);
  if (moduleName.includes("cta-banner")) return injectCtaBanner($, fields);
  if (moduleName.includes("form")) return injectGenericHeading($, fields);
  if (moduleName.includes("connected-services")) return injectCardItems($, fields);
  if (moduleName.includes("resources")) return injectCardItems($, fields);
  if (moduleName.includes("benefit-pillars")) return injectCardItems($, fields);
  if (moduleName.includes("ranked-leaderboard")) return injectCardItems($, fields);
  if (moduleName.includes("transformation")) return injectCardItems($, fields);
  if (moduleName.includes("services-grid")) return injectCardItems($, fields);
  if (moduleName.includes("content-formats")) return injectCardItems($, fields);
  if (moduleName.includes("ai-powered")) return injectGenericHeading($, fields);
  if (moduleName.includes("closed-loop")) return injectCardItems($, fields);

  return injectGenericHeading($, fields);
}

/* ── Hero ── */
function injectHero($: cheerio.CheerioAPI, f: ContentFields): string {
  if (f.breadcrumb) {
    $(".breadcrumb").html(f.breadcrumb.split("/").map((p, i, arr) =>
      i < arr.length - 1 ? `<a href="#">${p.trim()}</a> &nbsp;&gt;&nbsp; ` : `<span style="color:var(--lime)">${p.trim()}</span>`
    ).join(""));
  }
  if (f.heading) {
    const words = f.heading.split(" ");
    const mid = Math.ceil(words.length / 2);
    $("h1").html(`${words.slice(0, mid).join(" ")}<br><span class="accent">${words.slice(mid).join(" ")}</span>`);
  }
  if (f.subheading) $(".hero-sub").html(`<strong>${f.subheading.substring(0, 80)}</strong> ${f.subheading.substring(80)}`);
  if (f.bullets.length) {
    const checkHtml = f.bullets.slice(0, 4).map(b =>
      `<div class="check-item"><div class="check-icon"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3 5-5" stroke="var(--lime-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>${b}</div>`
    ).join("");
    $(".check-list").html(checkHtml);
  }
  if (f.primaryCta) $(".btn-lime").text(f.primaryCta);
  if (f.secondaryCta) $(".btn-outline").text(f.secondaryCta);
  return $.html();
}

/* ── Stats ── */
function injectStats($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  const cards = $(".card, .stat-card, [class*='stat']").filter((_, el) => {
    return $(el).find(".number, .stat-number, .stat-value").length > 0;
  });
  f.stats.forEach((stat, i) => {
    const card = cards.eq(i);
    if (card.length) {
      card.find(".number, .stat-number, .stat-value").first().text(stat.number);
      card.find(".label, .stat-label, .stat-desc, p").first().text(stat.label);
    }
  });
  return $.html();
}

/* ── Challenges ── */
function injectChallenges($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  if (f.subheading) $(".section-header p, .section-header .desc").first().text(f.subheading);
  const cards = $(".challenge-card, .card, [class*='challenge'], [class*='pain']");
  f.items.forEach((item, i) => {
    const card = cards.eq(i);
    if (card.length) {
      card.find("h3, .title, .card-title").first().text(item.title);
      card.find("p, .desc, .card-desc").first().text(item.description);
      if (item.extra) card.find(".impact, .tag, [class*='impact']").first().text(item.extra);
    }
  });
  if (f.bottomCta) $(".btn-lime, [class*='cta'] button").last().text(f.bottomCta);
  return $.html();
}

/* ── Definitional Intro ── */
function injectDefinitional($: cheerio.CheerioAPI, f: ContentFields): string {
  if (f.sectionLabel) $(".section-label span, .label").first().text(f.sectionLabel);
  injectH2($, f);
  const paragraphs = $("p").not(".label");
  if (f.subheading) paragraphs.first().text(f.subheading);
  f.paragraphs.forEach((p, i) => {
    const el = paragraphs.eq(i + 1);
    if (el.length) el.text(p);
  });
  return $.html();
}

/* ── Card-based templates (pillars, industries, connected services, etc.) ── */
function injectCardItems($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  if (f.subheading) {
    $("h2").parent().find("p").first().text(f.subheading);
  }
  const cards = $(".card, [class*='card'], [class*='item'], [class*='pillar'], [class*='tile']")
    .filter((_, el) => $(el).find("h3, h4, .title").length > 0);
  f.items.forEach((item, i) => {
    const card = cards.eq(i);
    if (card.length) {
      card.find("h3, h4, .title").first().text(item.title);
      card.find("p, .desc").first().text(item.description);
    }
  });
  if (f.bottomCta) $("button").last().text(f.bottomCta);
  return $.html();
}

/* ── Services (tab/pill based) ── */
function injectServices($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  // Inject into tab labels and panels
  const tabs = $("[class*='tab'], [class*='pill'], [class*='service-item']")
    .filter((_, el) => $(el).text().trim().length > 2);
  const panels = $("[class*='panel'], [class*='detail'], [class*='content-card']")
    .filter((_, el) => $(el).find("h3, h4, p").length > 0);

  f.items.forEach((item, i) => {
    if (tabs.eq(i).length) tabs.eq(i).text(item.title);
    const panel = panels.eq(i);
    if (panel.length) {
      panel.find("h3, h4").first().text(item.title);
      panel.find("p").first().text(item.description);
    }
  });
  return $.html();
}

/* ── Service Detail (accordion / stacked blocks) ── */
function injectServiceDetail($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  const blocks = $("[class*='block'], [class*='accordion'], [class*='capability']")
    .filter((_, el) => $(el).find("h3, h4").length > 0);
  f.items.forEach((item, i) => {
    const block = blocks.eq(i);
    if (block.length) {
      block.find("h3, h4").first().text(item.title);
      block.find("p").first().text(item.description);
    }
  });
  return $.html();
}

/* ── Process / Methodology ── */
function injectProcess($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  if (f.subheading) {
    $("h2").closest("[class*='header']").find("p").first().text(f.subheading);
  }
  const steps = $("[class*='step'], [class*='phase']")
    .filter((_, el) => $(el).find("h3, h4, .title").length > 0);
  f.items.forEach((item, i) => {
    const step = steps.eq(i);
    if (step.length) {
      step.find("h3, h4, .title, .step-title").first().text(item.title);
      step.find("p, .desc, .step-desc").first().text(item.description);
      if (item.extra) step.find("[class*='duration'], [class*='badge']").first().text(item.extra);
    }
  });
  return $.html();
}

/* ── Tabs (outcomes, etc.) ── */
function injectTabs($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  const tabs = $("[class*='tab']").filter((_, el) => {
    const t = $(el).text().trim();
    return t.length > 2 && t.length < 100;
  });
  const panels = $("[class*='panel'], [class*='content']")
    .filter((_, el) => $(el).find("h3, h4, p").length > 0 && $(el).closest("[class*='tab']").length === 0);

  f.items.forEach((item, i) => {
    if (tabs.eq(i).length) {
      const tabEl = tabs.eq(i);
      // Keep any number badge, replace text after it
      const badge = tabEl.find("[class*='badge'], [class*='num']");
      if (badge.length) {
        tabEl.contents().filter((_, n) => n.type === "text").last().replaceWith(` ${item.title}`);
      } else {
        tabEl.text(item.title);
      }
    }
    if (panels.eq(i).length) {
      const panel = panels.eq(i);
      panel.find("h3, h4").first().text(item.title);
      panel.find("p").first().text(item.description);
    }
  });
  return $.html();
}

/* ── Differentiators ── */
function injectDifferentiators($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  const items = $("[class*='diff'], [class*='item'], li")
    .filter((_, el) => $(el).find("h4, strong, .title").length > 0);
  f.items.forEach((item, i) => {
    const el = items.eq(i);
    if (el.length) {
      el.find("h4, strong, .title").first().text(item.title);
      el.find("p, .desc").first().text(item.description);
    }
  });
  return $.html();
}

/* ── Success Stories ── */
function injectStories($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  const slides = $("[class*='story'], [class*='slide']")
    .filter((_, el) => $(el).find("p, blockquote, .quote").length > 0);
  f.items.forEach((item, i) => {
    const slide = slides.eq(i);
    if (slide.length) {
      slide.find("h3, h4, .title, .company").first().text(item.title);
      slide.find("p, blockquote, .quote").first().text(item.description);
    }
  });
  return $.html();
}

/* ── Testimonials ── */
function injectTestimonials($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  const slides = $("[class*='testimonial'], [class*='quote'], [class*='slide']")
    .filter((_, el) => $(el).find("p, .text, .quote-text").length > 0);
  f.items.forEach((item, i) => {
    const slide = slides.eq(i);
    if (slide.length) {
      slide.find("p, .text, .quote-text").first().text(item.description);
      slide.find(".name, .author, strong").first().text(item.title);
    }
  });
  return $.html();
}

/* ── FAQ ── */
function injectFaq($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  const items = $("[class*='faq-item'], [class*='accordion']");
  f.faqs.forEach((faq, i) => {
    const item = items.eq(i);
    if (item.length) {
      item.find("[class*='question'], [class*='q'], h3, h4, summary").first().contents()
        .filter((_, n) => n.type === "text").first().replaceWith(faq.question);
      item.find("[class*='answer'], [class*='a'], p, .faq-body").first().text(faq.answer);
    }
  });
  // If more FAQs than template slots, clone the last item
  if (f.faqs.length > items.length && items.length > 0) {
    const parent = items.last().parent();
    for (let i = items.length; i < f.faqs.length; i++) {
      const clone = items.last().clone();
      clone.find("[class*='question'], [class*='q'], h3, h4").first().text(f.faqs[i].question);
      clone.find("[class*='answer'], [class*='a'], p, .faq-body").first().text(f.faqs[i].answer);
      clone.removeClass("active");
      parent.append(clone);
    }
  }
  return $.html();
}

/* ── CTA Banner ── */
function injectCtaBanner($: cheerio.CheerioAPI, f: ContentFields): string {
  if (f.heading) $("h2, h3").first().text(f.heading);
  if (f.subheading) $("p").first().text(f.subheading);
  if (f.primaryCta) $("button, a[class*='btn']").first().text(f.primaryCta);
  return $.html();
}

/* ── Generic heading + description fallback ── */
function injectGenericHeading($: cheerio.CheerioAPI, f: ContentFields): string {
  injectH2($, f);
  if (f.subheading) $("h2").parent().find("p").first().text(f.subheading);
  f.paragraphs.forEach((p, i) => {
    const el = $("p").eq(i + 1);
    if (el.length) el.text(p);
  });
  return $.html();
}

/* ── Shared helper ── */
function injectH2($: cheerio.CheerioAPI, f: ContentFields): void {
  if (f.heading) {
    const h2 = $("h2").first();
    if (h2.length) {
      // Preserve accent spans if present
      const accent = h2.find(".accent, .dark");
      if (accent.length) {
        const words = f.heading.split(" ");
        const mid = Math.ceil(words.length * 0.6);
        h2.find(".dark").text(words.slice(0, mid).join(" "));
        h2.find(".accent").text(words.slice(mid).join(" "));
      } else {
        h2.text(f.heading);
      }
    }
  }
}
