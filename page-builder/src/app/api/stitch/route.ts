import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { scopeCss } from "@/lib/css-scoper";
import { injectContent } from "@/lib/content-injector";

interface StitchSection {
  module: string;
  content: string;
}

interface StitchRequest {
  sections: StitchSection[];
  seo?: { title?: string; description?: string };
}

export async function POST(req: Request) {
  try {
    const body: StitchRequest = await req.json();
    const { sections, seo } = body;

    if (!sections?.length) {
      return NextResponse.json({ error: "No sections provided." }, { status: 400 });
    }

    const baseUrl = new URL(req.url).origin;

    /* ── 1. Load unique templates ── */
    const uniqueModules = [...new Set(sections.map(s => s.module))];
    const templateCache: Record<string, string> = {};

    await Promise.all(
      uniqueModules.map(async (mod) => {
        try {
          const res = await fetch(`${baseUrl}/library/${mod}`);
          if (res.ok) templateCache[mod] = await res.text();
        } catch (e) {
          console.warn(`Template ${mod} not found`);
        }
      })
    );

    /* ── 2. Process each section ── */
    const sectionBlocks: string[] = [];
    const allScopedCss: string[] = [];
    let globalCss = "";
    let globalCssSet = false;
    const fontSet = new Set<string>();
    const scriptSet = new Set<string>();
    const seenModulesForScripts = new Set<string>();

    for (let i = 0; i < sections.length; i++) {
      const { module: mod, content } = sections[i];
      const raw = templateCache[mod];
      if (!raw) {
        sectionBlocks.push(`<!-- Missing template: ${mod} -->`);
        continue;
      }

      const $ = cheerio.load(raw);

      // Extract CSS
      const css = $("style").map((_, el) => $(el).html() || "").get().join("\n\n");

      // Extract fonts
      $('link[rel="stylesheet"]').each((_, el) => { fontSet.add($.html(el)); });

      // Extract scripts (one copy per unique module)
      if (!seenModulesForScripts.has(mod)) {
        seenModulesForScripts.add(mod);
        $("script").each((_, el) => {
          const s = $(el).html()?.trim();
          if (s) scriptSet.add(s);
        });
      }

      // Scope CSS
      const scope = `[data-es="s${i}"]`;
      const { global, scoped } = scopeCss(css, scope);
      if (!globalCssSet) { globalCss = global; globalCssSet = true; }
      allScopedCss.push(`/* Section ${i + 1}: ${mod} */\n${scoped}`);

      // Extract body HTML
      $("style").remove();
      $("script").remove();
      const pageWrap = $(".page-wrap");
      const bodyHtml = pageWrap.length
        ? pageWrap.html()?.trim() || ""
        : $("body").html()?.trim() || "";

      // Inject content into body HTML
      const filledHtml = injectContent(bodyHtml, content, mod);

      sectionBlocks.push(`<div data-es="s${i}">\n${filledHtml}\n</div>`);
    }

    /* ── 3. Assemble ── */
    const pageTitle = seo?.title || "Edstellar Consulting Page";
    const pageDesc = seo?.description || "";

    const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(pageTitle)}</title>
${pageDesc ? `<meta name="description" content="${esc(pageDesc)}">` : ""}
${[...fontSet].join("\n")}
<style>
/* Global */
${globalCss}
.page-wrap { max-width: 1280px; margin: 0 auto; background: #FFFFFF; min-height: 100vh; }
body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; margin: 0; padding: 0; background: #F4F5F7; color: #1A1A1A; -webkit-font-smoothing: antialiased; }
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Scoped */
${allScopedCss.join("\n\n")}
</style>
</head>
<body>
<div class="page-wrap">
${sectionBlocks.join("\n\n")}
</div>
${[...scriptSet].map(s => `<script>\n${s}\n</script>`).join("\n")}
</body>
</html>`;

    return NextResponse.json({ html: finalHtml, sectionCount: sections.length });
  } catch (error: any) {
    console.error("Stitch error:", error);
    return NextResponse.json({ error: error.message || "Stitch failed" }, { status: 500 });
  }
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
