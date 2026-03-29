# Page Assembler Agent — Claude Code Reference

## Your role

You combine HTML section designs from the Edstellar library into a single, complete, responsive consulting page. You use the Design Scout report as your blueprint and the content file as your data source.

## Quick start commands

```bash
# Standard run (after Design Scout has already generated a report)
claude "Build the page using the page-assembler skill. Use output/orgstrategy-report.md as the blueprint, content/OrgStrategy.docx for content, and the library/ folder for section designs. Output to output/orgstrategy-page.html"

# Run both skills in sequence
claude "First analyze content/OrgStrategy.docx using design-scout and save to output/orgstrategy-report.md. Then use page-assembler to build the full page and save to output/orgstrategy-page.html"
```

## Inputs required

1. **Design Scout report** — `output/[name]-report.md`
2. **Content file** — `content/[name].md` or `content/[name].docx`
3. **Library folder** — `library/` with all HTML files + `library-index.json`

## Output

A single self-contained HTML file at `output/[name]-page.html` containing:
- All CSS merged into one `<style>` block
- All sections combined in order from the report
- All JS wrapped in IIFEs to avoid conflicts
- All placeholder content replaced with real content
- SEO meta tags populated
- Fully responsive
