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
  body: string;       // full body content (including nav if present)
  scripts: string[];
}

/* ────────────────────────────────────────────
   1. Parse developer-reference docx into sections
   ──────────────────────────────────────────── */

function parseSections(docText: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const lines = docText.split("\n");

  interface Marker {
    module: string;
    lineIdx: number;
    charPos: number;
  }
  const markers: Marker[] = [];

  let charOffset = 0;
  const lineOffsets: number[] = [];
  for (const line of lines) {
    lineOffsets.push(charOffset);
    charOffset += line.length + 1;
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

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

    const filenameMatch = trimmed.match(/^(edstellar[\w\-]+\.html)\s*$/i);
    if (filenameMatch) {
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

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].charPos;
    const end =
      i + 1 < markers.length
        ? lineOffsets[Math.max(0, markers[i + 1].lineIdx - 3)]
        : docText.length;

    let content = docText.substring(start, end).trim();
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
   2. CSS Scoping Engine
   Scopes section-specific CSS under [data-es="sN"]
   and extracts global rules (:root, *, body, html, .page-wrap)
   ──────────────────────────────────────────── */

const GLOBAL_SELECTOR_RE = /^(:root|\*|body|html|\.page-wrap)\b/;

function scopeCss(
  rawCss: string,
  scopeAttr: string
): { global: string; scoped: string } {
  const globalChunks: string[] = [];
  const scopedChunks: string[] = [];

  let pos = 0;
  const len = rawCss.length;

  while (pos < len) {
    // Skip whitespace and CSS comments
    const before = pos;
    while (pos < len && /\s/.test(rawCss[pos])) pos++;
    if (pos < len && rawCss[pos] === "/" && rawCss[pos + 1] === "*") {
      const end = rawCss.indexOf("*/", pos + 2);
      pos = end === -1 ? len : end + 2;
      continue;
    }
    if (pos >= len) break;

    // Read selector or @-rule up to the opening brace
    const selStart = pos;
    while (pos < len && rawCss[pos] !== "{") pos++;
    if (pos >= len) break;

    const selector = rawCss.slice(selStart, pos).trim();

    // Read the balanced brace block
    let depth = 0;
    const blockStart = pos;
    while (pos < len) {
      if (rawCss[pos] === "{") depth++;
      if (rawCss[pos] === "}") {
        depth--;
        if (depth === 0) {
          pos++;
          break;
        }
      }
      pos++;
    }

    const blockBody = rawCss.slice(blockStart, pos); // { ... }
    const fullRule = selector + " " + blockBody;

    // Classify the rule
    if (/^@media/i.test(selector)) {
      // Media query — scope its inner rules
      const inner = rawCss.slice(blockStart + 1, pos - 1);
      const scopedInner = scopeSimpleRules(inner, scopeAttr);
      scopedChunks.push(`${selector} {\n${scopedInner}\n}`);
    } else if (/^@/i.test(selector)) {
      // @keyframes, @font-face etc — keep global
      scopedChunks.push(fullRule);
    } else if (GLOBAL_SELECTOR_RE.test(selector)) {
      globalChunks.push(fullRule);
    } else {
      // Regular rule — scope it
      scopedChunks.push(`${scopeAttr} ${selector} ${blockBody}`);
    }
  }

  return {
    global: globalChunks.join("\n"),
    scoped: scopedChunks.join("\n"),
  };
}

/** Scope simple (non-nested) rules inside a @media block */
function scopeSimpleRules(css: string, scopeAttr: string): string {
  return css.replace(
    /([^{}\n][^{}]*?)\s*\{([^{}]*)\}/g,
    (_match, sel, body) => {
      const trimSel = (sel as string).trim();
      if (GLOBAL_SELECTOR_RE.test(trimSel)) return _match;
      return `  ${scopeAttr} ${trimSel} {${body}}`;
    }
  );
}

/* ────────────────────────────────────────────
   3. Extract parts from a template HTML file
   ──────────────────────────────────────────── */

function extractTemplateParts(html: string): TemplateParts {
  const $ = cheerio.load(html);

  const css = $("style")
    .map((_, el) => $(el).html() || "")
    .get()
    .join("\n\n");

  const fonts = $('link[rel="stylesheet"]')
    .map((_, el) => $.html(el))
    .get();

  const scripts = $("script")
    .map((_, el) => $(el).html() || "")
    .get()
    .filter((s) => s.trim().length > 0);

  // Remove scripts to avoid duplication in body
  $("script").remove();

  // Get full body content (including nav if the template has one)
  const pageWrap = $(".page-wrap");
  const body = pageWrap.length
    ? pageWrap.html()?.trim() || ""
    : $("body").html()?.trim() || "";

  return { css, fonts, body, scripts };
}

/* ────────────────────────────────────────────
   4. Gemini: fill one section
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

  html = html
    .replace(/^```html?\s*\n?/i, "")
    .replace(/\n?\s*```\s*$/i, "")
    .trim();

  return html;
}

/* ────────────────────────────────────────────
   5. Batch-parallel helper
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
   6. POST handler
   ──────────────────────────────────────────── */

export const maxDuration = 300;

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

    /* ── 2. Parse sections ── */
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

    /* ── 3. Load unique templates ── */
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

    /* ── 4. Extract template parts ── */
    const partsCache: Record<string, TemplateParts> = {};
    for (const mod of uniqueModules) {
      if (templateCache[mod]) {
        partsCache[mod] = extractTemplateParts(templateCache[mod]);
      }
    }

    /* ── 5. Fill sections via Gemini (parallel batches of 5) ── */
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
        return parts.body;
      }
    });

    /* ── 6. Scope CSS per section to prevent class collisions ── */
    // Collect global CSS from the FIRST template only (avoids duplicates)
    let globalCss = "";
    const allScopedCss: string[] = [];
    const globalCssCollected = new Set<string>();

    for (let i = 0; i < sections.length; i++) {
      const parts = partsCache[sections[i].module];
      if (!parts) continue;

      const scope = `[data-es="s${i}"]`;
      const { global, scoped } = scopeCss(parts.css, scope);

      // Only add global rules we haven't seen yet (by first line as key)
      if (!globalCssCollected.has("done")) {
        globalCss = global;
        globalCssCollected.add("done");
      }

      allScopedCss.push(
        `/* ═══ Section ${i + 1}: ${sections[i].module} ═══ */\n${scoped}`
      );
    }

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

    /* ── 9. SEO metadata from document ── */
    const titleMatch = docText.match(/Meta Title\s+(.+)/i);
    const descMatch = docText.match(/Meta Description\s+(.+)/i);
    const pageTitle = titleMatch
      ? titleMatch[1].trim()
      : "Edstellar Consulting Page";
    const pageDesc = descMatch ? descMatch[1].trim() : "";

    /* ── 10. Build each section wrapped with data-es scope ── */
    const sectionBlocks = filledBodies.map(
      (body, i) => `<div data-es="s${i}">\n${body}\n</div>`
    );

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
/* ═══ Global (shared across all sections) ═══ */
${globalCss}

.page-wrap {
  max-width: 1280px;
  margin: 0 auto;
  background: #FFFFFF;
  min-height: 100vh;
}
body {
  font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
  margin: 0;
  padding: 0;
  background: #F4F5F7;
  color: #1A1A1A;
  -webkit-font-smoothing: antialiased;
}
* { margin: 0; padding: 0; box-sizing: border-box; }

/* ═══ Scoped section styles ═══ */
${allScopedCss.join("\n\n")}
</style>
</head>
<body>
<div class="page-wrap">
${sectionBlocks.join("\n\n")}
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
