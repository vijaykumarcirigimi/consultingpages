---
name: image-finder
description: Find and embed real Unsplash images into assembled consulting pages. Checks the image library first for reusable matches, then searches Unsplash for new images. Saves all discovered images to the library for future reuse. Use after running the page-assembler skill.
---

# Image Finder

You find real, royalty-free Unsplash images for every placeholder slot in an assembled Edstellar consulting page. You check the image library first, search Unsplash only for gaps, save new finds to the library, and produce an updated HTML file with all images embedded.

## Prerequisites

Before running this skill, the user must have:
1. An **assembled page** (`output/[page]-page.html`) — the page-assembler output containing placeholder image slots
2. The **content file** (`content/[page].md` or `content/[page].docx`) — for understanding context and topic
3. The **image sourcing rules guide** (`image-sourcing-rules-guide.md`) — your rulebook for what to search and where

If the assembled page doesn't exist, ask the user to run the page-assembler skill first.

## Process

### Step 1: Read inputs

Read these files in order:
1. `library/image-library.json` — check for existing images that can be reused
2. The assembled page HTML — scan for all placeholder image slots
3. The content file — understand the consulting service, audience, and tone
4. `image-sourcing-rules-guide.md` — load the 7 image categories and sourcing rules

### Step 2: Inventory all image slots

Scan the HTML and identify every placeholder image slot. These are recognisable by:
- CSS classes: `.hero-image`, `.img-slot`, `.block-image`, `.visual-placeholder`, or similar
- Dashed border styling: `border: 2px dashed ...`
- Placeholder background colour: `background: #C8CAD8` or similar grey
- SVG icon placeholders inside the slot
- Text like "Image placeholder", descriptive notes, or `.note` elements inside the slot

For each slot, record:
1. **Slot ID** — a sequential number (Slot 1, Slot 2, ...)
2. **Section name** — which page section it belongs to (Hero, Challenges, Services, etc.)
3. **HTML location** — the CSS selector or surrounding context to locate it
4. **Current placeholder content** — any descriptive text or notes inside the placeholder (these often hint at what image is needed)
5. **Slot dimensions** — aspect ratio from CSS (e.g., `4/3`, `3/4`, `16/9`) to guide image orientation

### Step 3: Classify each slot

Using the image sourcing rules guide, classify each slot into one of the 7 image categories:

| Category | When to assign |
|---|---|
| 1. HUMAN / PEOPLE | Sections about leadership, teams, client relationships, consulting delivery |
| 2. CONCEPTUAL / FRAMEWORK | Sections explaining methodologies, frameworks, strategies |
| 3. TOOL / SOFTWARE / PRODUCT | Sections referencing technologies, platforms, tools |
| 4. DATA / METRICS / CHART | Sections presenting results, statistics, benchmarks |
| 5. INDUSTRY / SECTOR | Industries section or vertical-specific content |
| 6. WORKSPACE / ENVIRONMENT | Hero backgrounds, form sections, ambient/mood images |
| 7. ICON / ILLUSTRATION | Abstract visual elements, decorative graphics |

For each slot, also determine:
- **Search terms** — 2–3 specific search queries adapted to the page's consulting topic (follow the guide's examples but tailor to the actual service)
- **Orientation preference** — landscape, portrait, or square (based on aspect ratio)
- **Tone** — professional/executive, collaborative/warm, technical/data-driven, etc.

### Step 4: Check the image library for reusable matches

Before searching Unsplash, check `library/image-library.json` for images that match the current slot's needs.

**Match criteria — an existing library image is reusable if:**
- Its `category` matches the slot's category
- Its `tags` overlap with the slot's search terms (at least 2 tag matches)
- Its `orientation` matches the slot's required orientation
- Its `tone` is compatible with the page's audience
- It has NOT already been assigned to another slot on the SAME page (no duplicates within a page)

**For each slot:**
1. Search the library by category + tags
2. If a strong match exists → assign it and mark the slot as "LIBRARY HIT"
3. If no match → mark the slot as "NEEDS SEARCH" and proceed to Step 5

This step saves significant time and tokens by avoiding redundant Unsplash searches for images that already exist in the library.

### Step 5: Search Unsplash for remaining slots

For every slot marked "NEEDS SEARCH", search **Unsplash only** (unsplash.com).

**Search method:**
1. Use `site:unsplash.com/photos [search terms]` via web search to find specific photo page URLs
2. Extract the photo slug ID from the URL (e.g., `OpOsPgGiFwc` from `/photos/man-presenting-...-OpOsPgGiFwc`)
3. Resolve the direct CDN URL by fetching `https://unsplash.com/photos/[SLUG_ID]/download?force=true` — the redirect URL contains the base image ID
4. Construct the final image URL:
   ```
   https://images.unsplash.com/photo-[BASE_ID]?w=[WIDTH]&h=[HEIGHT]&fit=crop&q=80
   ```

**Search rules:**
- Search with specific, contextual terms — NOT generic terms
- Adapt search terms to the exact consulting service on the page (as the guide instructs)
- If the first search doesn't yield good results, try alternative terms from the same category
- Each image on the page must be UNIQUE — never reuse the same image in multiple slots on the same page
- Match image orientation to the slot's aspect ratio (landscape slots need landscape images, etc.)

**Image verification:**
- Royalty-free under the Unsplash License (all Unsplash images qualify)
- High resolution (use `w=800` minimum for large slots, `w=600` for cards)
- Correct orientation for the slot's aspect ratio
- Professional and modern-looking
- Free of competitor logos, watermarks, or inappropriate content

### Step 6: Update the image library

After finding all images, update `library/image-library.json` with every NEW image discovered during this run. Do NOT add duplicates — check if the `unsplash_id` already exists before adding.

**Library entry format:**
```json
{
  "unsplash_id": "OpOsPgGiFwc",
  "base_url": "https://images.unsplash.com/photo-1758691736424-4b4273948341",
  "photographer": "Vitaly Gariev",
  "description": "Man presenting to colleagues in a modern office",
  "alt_text": "Senior executive presenting organizational strategy to colleagues in a modern boardroom",
  "category": "HUMAN",
  "tags": ["executive", "boardroom", "strategy", "meeting", "presenting", "professional", "leadership"],
  "orientation": "landscape",
  "tone": "executive",
  "used_on": ["orgstrategy-page.html"],
  "added_date": "2026-03-21"
}
```

**Library rules:**
- When an existing library image is reused on a new page, append the page filename to its `used_on` array
- Keep tags broad enough to enable cross-page matching but specific enough to be meaningful
- Include 5–10 tags per image covering: subject, setting, action, audience level, and consulting context
- The `tone` field should be one of: `executive`, `collaborative`, `technical`, `warm`, `data-driven`, `abstract`

### Step 7: Build the image manifest

Produce a manifest table summarising all findings:

```markdown
## Image Manifest

| Slot | Section | Category | Source | Image URL | Alt text | Aspect ratio |
|------|---------|----------|--------|-----------|----------|--------------|
| 1 | Hero | WORKSPACE | LIBRARY | https://... | ... | 4:3 |
| 2 | Challenges | HUMAN | UNSPLASH (new) | https://... | ... | 3:4 |
| ... | ... | ... | ... | ... | ... | ... |
```

The **Source** column should indicate whether the image came from the library ("LIBRARY") or was newly searched ("UNSPLASH (new)").

Save this manifest to `output/[page-slug]-images.md` for reference.

### Step 8: Embed images into the HTML

For each placeholder slot, replace the placeholder content with a real `<img>` tag:

**Before (placeholder):**
```html
<div class="hero-image">
  <svg>...</svg>
  Hero image placeholder
  <span class="note">Suggested: professional consulting scene</span>
</div>
```

**After (with real image):**
```html
<div class="hero-image" style="border:none;background:transparent;">
  <img src="https://images.unsplash.com/photo-xxxxx?w=800&h=600&fit=crop&q=80" alt="Business consultants discussing organizational strategy in modern boardroom" style="width:100%;height:100%;object-fit:cover;">
</div>
```

**Embedding rules:**
- Replace the ENTIRE inner content of the placeholder div (SVG icon, text, notes) with a single `<img>` tag
- Keep the outer `<div>` and ALL its CSS classes intact — do NOT change the container
- Add inline style `width:100%;height:100%;object-fit:cover;` to the `<img>` so it fills the slot
- Add `loading="lazy"` to all images except the hero (hero should load eagerly)
- Add descriptive `alt` text for accessibility
- Remove the dashed border and placeholder background by adding an inline style override on the container: `style="border:none;background:transparent;"` — append to existing style if any
- Keep all existing CSS classes on the container div

### Step 9: Update OG and Twitter image meta tags

If a good hero image was found, update these meta tags in the `<head>`:
- `<meta property="og:image" content="[hero image URL with w=1200&h=630]">`
- `<meta property="twitter:image" content="[hero image URL with w=1200&h=630]">`

### Step 10: Output the updated page

Save the updated HTML file, overwriting the original:
```
output/[page-slug]-page.html
```

Also save the image manifest:
```
output/[page-slug]-images.md
```

## Output quality checklist

Before finishing, verify:
- [ ] Every placeholder slot has been replaced with a real image
- [ ] No placeholder SVGs, dashed borders, or "placeholder" text remain visible
- [ ] All images are from Unsplash (royalty-free, no attribution required)
- [ ] All images are high quality and contextually appropriate
- [ ] Image orientations match slot aspect ratios
- [ ] No two slots on the same page use the same image
- [ ] Alt text is descriptive and unique for each image
- [ ] Hero image loads eagerly; all others use `loading="lazy"`
- [ ] Container divs retain their original CSS classes
- [ ] OG/Twitter meta images are updated
- [ ] The image manifest is saved to `output/[page-slug]-images.md`
- [ ] All NEW images have been added to `library/image-library.json`
- [ ] Reused library images have the current page added to their `used_on` array
- [ ] All category-specific rules from the image sourcing guide are followed

## Important rules

1. **Unsplash only** — do NOT search Pexels, Pixabay, or any other source. Unsplash is the sole image source for all pages.
2. **Library first, search second** — always check the image library before searching Unsplash. This saves tokens and time.
3. **Follow the image sourcing rules guide** — it defines what to search for each category and context
4. **Adapt search terms to the specific page topic** — never use generic searches; tailor to the consulting service
5. **Preserve HTML structure** — only replace the INNER content of placeholder divs, never change containers or CSS classes
6. **Every image must be unique per page** — no duplicates within the same page (but the same image CAN be reused across different pages)
7. **Match seniority to audience** — CXO pages need executive-level imagery, not entry-level stock photos
8. **Prefer candid over posed** — natural professional moments over staged stock photos
9. **Charts trend upward** — any data/metrics images must show improvement, never decline
10. **No competitor branding** — verify images don't contain competitor logos or branding
11. **Always update the library** — every new Unsplash image must be saved to `library/image-library.json` for future reuse
12. **The output must remain a SINGLE HTML file** — images are loaded via external URLs, no local files
