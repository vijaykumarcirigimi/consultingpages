/**
 * Parse a developer-reference docx into sections.
 * Uses mammoth's HTML output to preserve headings, bold, paragraphs, and lists.
 */

export interface ParsedSection {
  index: number;
  title: string;
  module: string;
  contentHtml: string;  // HTML content for display/editing
  contentText: string;  // Plain text for the stitch API
}

/**
 * Parse sections from mammoth's HTML output.
 * The docx has template filenames appearing twice: once in the page-flow table (first 23),
 * and again in the section bodies (markers 23+). We use the second set.
 */
export function parseSectionsFromHtml(html: string): ParsedSection[] {
  const sections: ParsedSection[] = [];

  // Find ALL edstellar-*.html filenames in the HTML
  const regex = /edstellar[\w\-]+\.html/gi;
  let match;
  const allMarkers: { file: string; pos: number }[] = [];
  while ((match = regex.exec(html)) !== null) {
    allMarkers.push({ file: match[0], pos: match.index });
  }

  if (allMarkers.length === 0) return [];

  // The first ~half are from the overview table, the second half are section bodies.
  // Detect the split: find where filenames start repeating (second occurrence of first filename)
  const firstName = allMarkers[0].file;
  const bodyStartIdx = allMarkers.findIndex((m, i) => i > 0 && m.file === firstName);
  if (bodyStartIdx === -1) return []; // No section bodies found

  const bodyMarkers = allMarkers.slice(bodyStartIdx);

  for (let i = 0; i < bodyMarkers.length; i++) {
    const marker = bodyMarkers[i];
    // Content starts after the marker's closing </table> or </td> tag
    const afterFilename = marker.pos + marker.file.length;
    // Find the end of the DESIGN MODULE table row
    const tableEnd = html.indexOf("</table>", afterFilename);
    const contentStart = tableEnd !== -1 ? tableEnd + "</table>".length : afterFilename;

    // Content ends at the next section's DESIGN MODULE table (or end of document)
    let contentEnd: number;
    if (i + 1 < bodyMarkers.length) {
      // Find the start of the next DESIGN MODULE table — look for the <table> before the next marker
      const nextPos = bodyMarkers[i + 1].pos;
      // Search backwards from next marker for the <table> tag
      const searchZone = html.substring(Math.max(contentStart, nextPos - 500), nextPos);
      const tableIdx = searchZone.lastIndexOf("<table>");
      contentEnd = tableIdx !== -1 ? (nextPos - 500 + tableIdx > contentStart ? nextPos - 500 + tableIdx : nextPos - 200) : nextPos - 100;
      // Ensure we don't go past the next marker
      if (contentEnd > nextPos) contentEnd = nextPos - 50;
      if (contentEnd < contentStart) contentEnd = nextPos;
    } else {
      contentEnd = html.length;
    }

    let contentHtml = html.substring(contentStart, contentEnd).trim();

    // Clean up: remove separator lines, section headers (S## | ...), DESIGN MODULE remnants
    contentHtml = contentHtml
      .replace(/<p>\s*_{5,}\s*<\/p>/gi, "")                    // horizontal rules
      .replace(/<p><strong>\s*S\d+\s*\|[^<]*<\/strong><\/p>/gi, "")  // S01 | ... headers
      .replace(/<p>\s*S\d+\s*\|[^<]*<\/p>/gi, "")              // S01 | ... headers (non-bold)
      .replace(/<p><strong>\s*DESIGN MODULE\s*<\/strong><\/p>/gi, "") // DESIGN MODULE labels
      .replace(/<p>\s*DESIGN MODULE\s*<\/p>/gi, "")
      .replace(/<p><strong>\s*Impact tag\s*<\/strong><\/p>/gi, "")    // Impact tag labels
      .replace(/\s*\*Icon:[^*]*\*/gi, "")                       // *Icon: ...* hints
      .replace(/\s*\*Source:[^*]*\*/gi, "")                      // *Source: ...* citations
      .replace(/<p><strong>\s*SECTION LABEL\s*<\/strong><\/p>/gi, "") // standalone SECTION LABEL
      .replace(/<p>\s*<\/p>/g, "")                               // empty paragraphs
      .replace(/(<p><strong>\s*)SECTION LABEL\s+/gi, "$1")      // strip SECTION LABEL prefix
      .replace(/(<p><strong>\s*)BREADCRUMB\s+/gi, "$1")         // strip BREADCRUMB prefix
      .replace(/(<p>)\s*\[PRIMARY CTA\]\s*/gi, "$1")            // strip [PRIMARY CTA]
      .replace(/(<p>)\s*\[SECONDARY CTA\]\s*/gi, "$1")          // strip [SECONDARY CTA]
      .replace(/(<p>)\s*\[(BOTTOM )?CTA\]\s*/gi, "$1")          // strip [BOTTOM CTA]
      .replace(/(<p>)\s*\[IMAGE\]\s*/gi, "$1")                  // strip [IMAGE]
      .replace(/(<p><strong>\s*)(CHALLENGE|STEP|SERVICE|TAB|PILLAR|DIFFERENTIATOR|STORY|TESTIMONIAL|INDUSTRY|RESOURCE|FORMAT|CAPABILITY)\s+\d+\s*[:\-]\s*/gi, "$1") // strip numbered prefixes
      .replace(/(<p>)\s*(CHALLENGE|STEP|SERVICE|TAB|PILLAR|DIFFERENTIATOR|STORY|TESTIMONIAL|INDUSTRY|RESOURCE|FORMAT|CAPABILITY)\s+\d+\s*[:\-]\s*/gi, "$1")
      .replace(/(<p><strong>\s*)STAT\s+\d+\s+/gi, "$1")         // strip STAT N prefix
      .replace(/(<p>)\s*STAT\s+\d+\s+/gi, "$1")
      .replace(/(<p><strong>\s*)BADGE\s+/gi, "$1")               // strip BADGE prefix
      .replace(/(<p>)\s*BADGE\s+/gi, "$1")
      .replace(/(<p><strong>\s*)Impact tag:?\s*/gi, "$1")        // strip Impact tag prefix (bold)
      .replace(/(<p>)\s*Impact tag:?\s*/gi, "$1")                // strip Impact tag prefix
      .trim();

    // Extract title from first heading or bold text
    const titleMatch = contentHtml.match(/<(?:h[1-6]|p)><strong>\s*([^<]+?)\s*<\/strong><\/(?:h[1-6]|p)>/i)
      || contentHtml.match(/<(?:h[1-6])>([^<]+?)<\/(?:h[1-6])>/i)
      || contentHtml.match(/<p><strong>([^<]+?)<\/strong>/i);
    const title = titleMatch ? titleMatch[1].trim().substring(0, 80) : `Section ${i + 1}`;

    // Convert HTML to plain text for the stitch API
    const contentText = htmlToPlainText(contentHtml);

    sections.push({
      index: i + 1,
      title,
      module: marker.file,
      contentHtml,
      contentText,
    });
  }

  return sections;
}

/** Simple server-side HTML → plain text conversion */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|h[1-6]|div|tr|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
