import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";
import * as mammoth from "mammoth";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface ParsedSection {
  index: number;
  module: string;
  content: string;
}

interface TemplateParts {
  css: string;
  fonts: string[];
  nav: string;
  body: string;
  scripts: string[];
}

/* ────────────────────────────────────────────
   1. Parse developer-reference docx into sections
   ──────────────────────────────────────────── */

function parseSections(docText: string): ParsedSection[] {
  const sections: ParsedSection[] = [];

  // The docx (via mammoth raw text) produces this pattern:
  //   "  DESIGN MODULE  \n\n  edstellar-xxx.html  \n"
  // The label and filename are on SEPARATE lines with whitespace padding.
  // We also handle the inline format "DESIGN MODULE: edstellar-xxx.html" as a fallback.

  // Strategy: find every line that looks like an edstellar-*.html filename.
  // Only count those that appear shortly after a "DESIGN MODULE" line.
  const lines = docText.split("\n");

  interface Marker {
    module: string;
    lineIdx: number;
    charPos: number; // character offset in full text for slicing content
  }
  const markers: Marker[] = [];

  // Build a char-offset map for each line
  let charOffset = 0;
  const lineOffsets: number[] = [];
  for (const line of lines) {
    lineOffsets.push(charOffset);
    charOffset += line.length + 1; // +1 for the \n
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Pattern 1: inline "DESIGN MODULE: filename.html"
    const inlineMatch = trimmed.match(
      /DESIGN MODULE\s*:\s*(edstellar[\w\-]+\.html)/i
    );
    if (inlineMatch) {
      markers.push({
        module: inlineMatch[1].trim(),
        lineIdx: i,
        charPos: lineOffsets[i] + lines[i].length,
      });
      continue;
    }

    // Pattern 2: standalone filename line preceded by a "DESIGN MODULE" line
    // (possibly with a blank line in between)
    const filenameMatch = trimmed.match(/^(edstellar[\w\-]+\.html)\s*$/i);
    if (filenameMatch) {
      // Look back up to 3 lines for "DESIGN MODULE"
      let foundTag = false;
      for (let j = 1; j <= 3 && i - j >= 0; j++) {
        if (/DESIGN\s+MODULE/i.test(lines[i - j].trim())) {
          foundTag = true;
          break;
        }
      }
      if (foundTag) {
        markers.push({
          module: filenameMatch[1].trim(),
          lineIdx: i,
          charPos: lineOffsets[i] + lines[i].length,
        });
      }
    }
  }

  if (markers.length === 0) return [];

  // Extract content between markers
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].charPos;
    const end =
      i + 1 < markers.length
        ? // Go back to the DESIGN MODULE label line (a few lines before the filename)
          lineOffsets[Math.max(0, markers[i + 1].lineIdx - 3)]
        : docText.length;

    let content = docText.substring(start, end).trim();

    // Strip trailing "DESIGN MODULE" label that belongs to the next section
    content = content.replace(/\s*DESIGN\s+MODULE\s*$/i, "").trim();

    sections.push({
      index: i + 1,
      module: markers[i].module,
      content,
    });
  }

  return sections;
}

/* ────────────────────────────────────────────
   2. Extract reusable parts from a template
   ──────────────────────────────────────────── */

function extractTemplateParts(html: string): TemplateParts {
  const $ = cheerio.load(html);

  // CSS
  const css = $("style")
    .map((_, el) => $(el).html() || "")
    .get()
    .join("\n\n");

  // Font link tags (deduplicate later)
  const fonts = $('link[rel="stylesheet"]')
    .map((_, el) => $.html(el))
    .get();

  // Scripts (preserve for interactive sections)
  const scripts = $("script")
    .map((_, el) => $(el).html() || "")
    .get()
    .filter((s) => s.trim().length > 0);

  // Nav (only the hero template has this)
  const nav = $.html(".ed-nav") || "";

  // Section body = everything inside .page-wrap MINUS the nav
  // (or everything in <body> if no .page-wrap)
  const pageWrap = $(".page-wrap");
  if (pageWrap.length) {
    pageWrap.find(".ed-nav").remove();
    $("script").remove();
    return { css, fonts, nav, body: pageWrap.html()?.trim() || "", scripts };
  }

  $("body").find(".ed-nav").remove();
  $("script").remove();
  return { css, fonts, nav, body: $("body").html()?.trim() || "", scripts };
}

/* ────────────────────────────────────────────
   3. Gemini: fill one section
   ──────────────────────────────────────────── */

async function fillSectionWithAI(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  templateBody: string,
  sectionContent: string,
  moduleName: string
): Promise<string> {
  const prompt = `You are a precise HTML content-replacement engine for the Edstellar consulting website.

TASK
Replace ALL placeholder / demo text in the HTML template below with the real content provided. The result must look like a production-ready section of a consulting page.

RULES  (follow every one exactly)
1. Keep ALL HTML tags, classes, IDs, inline styles, data-* attributes, and SVG elements EXACTLY as they are.
2. Only change TEXT CONTENT inside elements — never rename classes or restructure the DOM.
3. Match content SEMANTICALLY:
   • Headings → <h1>/<h2>/<h3>
   • Paragraphs / descriptions → <p> or descriptive <span>
   • Bullet / check items → list item elements
   • Stat numbers → number elements, stat labels → label elements
   • CTA button text → button text
   • Image description tags → keep the placeholder markup, update alt-text or caption text only
4. If the content has MORE items than the template provides (e.g. 6 challenges but the template shows 4 cards), DUPLICATE the last card's HTML pattern and fill the extras.
5. If the content has FEWER items, REMOVE the surplus template items entirely.
6. Preserve all inline SVG icons — do NOT delete or alter them.
7. Do NOT output markdown fences, backticks, or any explanation. Return ONLY raw HTML.

TEMPLATE HTML  (module: ${moduleName})
${templateBody}

CONTENT TO INSERT
${sectionContent}

Return the filled HTML now:`;

  const result = await model.generateContent(prompt);
  let html = result.response.text();

  // Strip markdown code fences if Gemini wraps them
  html = html
    .replace(/^```html?\s*\n?/i, "")
    .replace(/\n?\s*```\s*$/i, "")
    .trim();

  return html;
}

/* ────────────────────────────────────────────
   4. Batch-parallel helper
   ──────────────────────────────────────────── */

async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T, idx: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item, bIdx) => fn(item, i + bIdx))
    );
    results.push(...batchResults);
  }
  return results;
}

/* ────────────────────────────────────────────
   5. POST handler
   ──────────────────────────────────────────── */

export const maxDuration = 300; // Vercel Pro: up to 300 s

export async function POST(req: Request) {
  try {
    /* ── Validate API key ── */
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    /* ── 1. Read uploaded docx ── */
    const formData = await req.formData();
    const file = formData.get("document") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "No document uploaded." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { value: docText } = await mammoth.extractRawText({ buffer });

    /* ── 2. Parse sections from document ── */
    const sections = parseSections(docText);
    if (sections.length === 0) {
      return NextResponse.json(
        {
          error:
            'No "DESIGN MODULE:" markers found in the document. Please upload a developer-reference .docx file.',
        },
        { status: 400 }
      );
    }

    /* ── 3. Load unique templates from the static library ── */
    const baseUrl = new URL(req.url).origin;
    const uniqueModules = [...new Set(sections.map((s) => s.module))];
    const templateCache: Record<string, string> = {};

    await Promise.all(
      uniqueModules.map(async (mod) => {
        try {
          const res = await fetch(`${baseUrl}/library/${mod}`);
          if (res.ok) templateCache[mod] = await res.text();
          else console.warn(`Template not found: ${mod}`);
        } catch (e) {
          console.warn(`Failed to fetch template ${mod}:`, e);
        }
      })
    );

    /* ── 4. Extract CSS / nav / body from each template ── */
    const partsCache: Record<string, TemplateParts> = {};
    for (const mod of uniqueModules) {
      if (templateCache[mod]) {
        partsCache[mod] = extractTemplateParts(templateCache[mod]);
      }
    }

    /* ── 5. Fill every section in parallel batches via Gemini ── */
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const filledBodies = await processBatch(sections, 5, async (section) => {
      const parts = partsCache[section.module];
      if (!parts) return `<!-- Template not found: ${section.module} -->`;

      try {
        return await fillSectionWithAI(
          model,
          parts.body,
          section.content,
          section.module
        );
      } catch (err: any) {
        console.error(`AI fill failed for ${section.module}:`, err?.message);
        // Graceful fallback: return template with original placeholder content
        return parts.body;
      }
    });

    /* ── 6. Collect all CSS (concatenated — duplicates are harmless) ── */
    const allCss = uniqueModules
      .filter((mod) => partsCache[mod])
      .map((mod) => partsCache[mod].css)
      .join("\n\n/* ═══ next section ═══ */\n\n");

    /* ── 7. Deduplicate font links ── */
    const fontSet = new Set<string>();
    uniqueModules.forEach((mod) => {
      partsCache[mod]?.fonts.forEach((f) => fontSet.add(f));
    });

    /* ── 8. Collect scripts (one copy per unique template) ── */
    const scriptSet = new Set<string>();
    const seenModules = new Set<string>();
    for (const section of sections) {
      if (seenModules.has(section.module)) continue;
      seenModules.add(section.module);
      partsCache[section.module]?.scripts.forEach((s) => scriptSet.add(s));
    }

    /* ── 9. Nav from the first template (hero) ── */
    const heroNav = partsCache[sections[0]?.module]?.nav || "";

    /* ── 10. SEO metadata from document ── */
    const titleMatch = docText.match(/Meta Title\s+(.+)/i);
    const descMatch = docText.match(/Meta Description\s+(.+)/i);
    const pageTitle = titleMatch
      ? titleMatch[1].trim()
      : "Edstellar Consulting Page";
    const pageDesc = descMatch ? descMatch[1].trim() : "";

    /* ── 11. Assemble final HTML ── */
    const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(pageTitle)}</title>
${pageDesc ? `<meta name="description" content="${escapeHtml(pageDesc)}">` : ""}
${[...fontSet].join("\n")}
<style>
${allCss}

/* ═══ Page-assembly overrides ═══ */
.page-wrap { min-height: auto; }
body { margin: 0; padding: 0; background: #F4F5F7; }
</style>
</head>
<body>
<div class="page-wrap">
${heroNav}
${filledBodies.join("\n\n")}
</div>
${[...scriptSet].map((s) => `<script>\n${s}\n</script>`).join("\n")}
</body>
</html>`;

    return NextResponse.json({
      html: finalHtml,
      sectionCount: sections.length,
      modules: sections.map((s) => s.module),
    });
  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/* ── Tiny HTML-escape for attribute values ── */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
