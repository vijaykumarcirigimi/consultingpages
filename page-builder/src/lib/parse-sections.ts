/**
 * Parse a developer-reference docx (via mammoth raw text) into sections.
 * Each section has an index, title, pre-assigned design module, and content text.
 */

export interface ParsedSection {
  index: number;
  title: string;
  module: string;   // pre-assigned from DESIGN MODULE tag in document
  content: string;  // raw text for that section
}

export function parseSections(docText: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const lines = docText.split("\n");

  interface Marker { module: string; lineIdx: number; charPos: number; }
  const markers: Marker[] = [];

  let charOffset = 0;
  const lineOffsets: number[] = [];
  for (const line of lines) {
    lineOffsets.push(charOffset);
    charOffset += line.length + 1;
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Pattern 1: inline "DESIGN MODULE: filename.html"
    const inlineMatch = trimmed.match(
      /DESIGN MODULE\s*:\s*(edstellar[\w\-]+\.html)/i
    );
    if (inlineMatch) {
      markers.push({ module: inlineMatch[1].trim(), lineIdx: i, charPos: lineOffsets[i] + lines[i].length });
      continue;
    }

    // Pattern 2: standalone filename preceded by "DESIGN MODULE" label
    const filenameMatch = trimmed.match(/^(edstellar[\w\-]+\.html)\s*$/i);
    if (filenameMatch) {
      let foundTag = false;
      for (let j = 1; j <= 3 && i - j >= 0; j++) {
        if (/DESIGN\s+MODULE/i.test(lines[i - j].trim())) { foundTag = true; break; }
      }
      if (foundTag) {
        markers.push({ module: filenameMatch[1].trim(), lineIdx: i, charPos: lineOffsets[i] + lines[i].length });
      }
    }
  }

  if (markers.length === 0) return [];

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].charPos;
    const end = i + 1 < markers.length
      ? lineOffsets[Math.max(0, markers[i + 1].lineIdx - 3)]
      : docText.length;

    let content = docText.substring(start, end).trim();
    content = content.replace(/\s*DESIGN\s+MODULE\s*$/i, "").trim();

    // Extract title from first meaningful line of content
    const titleLine = content.split("\n").find(l => l.trim().length > 5 && !/^(BREADCRUMB|BADGE|SECTION LABEL|\[)/i.test(l.trim()));
    const title = titleLine?.trim().substring(0, 80) || `Section ${i + 1}`;

    sections.push({ index: i + 1, title, module: markers[i].module, content });
  }

  return sections;
}
