/**
 * CSS Scoping Engine
 * Scopes section-specific CSS under a unique attribute selector
 * to prevent class collisions when stitching multiple templates.
 */

const GLOBAL_SELECTOR_RE = /^(:root|\*|body|html|\.page-wrap)\b/;

export function scopeCss(
  rawCss: string,
  scopeAttr: string
): { global: string; scoped: string } {
  const globalChunks: string[] = [];
  const scopedChunks: string[] = [];

  let pos = 0;
  const len = rawCss.length;

  while (pos < len) {
    while (pos < len && /\s/.test(rawCss[pos])) pos++;
    if (pos < len && rawCss[pos] === "/" && rawCss[pos + 1] === "*") {
      const end = rawCss.indexOf("*/", pos + 2);
      pos = end === -1 ? len : end + 2;
      continue;
    }
    if (pos >= len) break;

    const selStart = pos;
    while (pos < len && rawCss[pos] !== "{") pos++;
    if (pos >= len) break;

    const selector = rawCss.slice(selStart, pos).trim();

    let depth = 0;
    const blockStart = pos;
    while (pos < len) {
      if (rawCss[pos] === "{") depth++;
      if (rawCss[pos] === "}") {
        depth--;
        if (depth === 0) { pos++; break; }
      }
      pos++;
    }

    const blockBody = rawCss.slice(blockStart, pos);
    const fullRule = selector + " " + blockBody;

    if (/^@media/i.test(selector)) {
      const inner = rawCss.slice(blockStart + 1, pos - 1);
      const scopedInner = scopeSimpleRules(inner, scopeAttr);
      scopedChunks.push(`${selector} {\n${scopedInner}\n}`);
    } else if (/^@/i.test(selector)) {
      scopedChunks.push(fullRule);
    } else if (GLOBAL_SELECTOR_RE.test(selector)) {
      globalChunks.push(fullRule);
    } else {
      scopedChunks.push(`${scopeAttr} ${selector} ${blockBody}`);
    }
  }

  return {
    global: globalChunks.join("\n"),
    scoped: scopedChunks.join("\n"),
  };
}

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
