# Edstellar Page Stitcher

Upload a **developer-reference `.docx`** and interactively build a consulting page by choosing designs from the library.

## How it works

1. **Upload** a developer-reference document (produced by the doc-builder skill)
2. The app **parses** every `DESIGN MODULE` tag and shows all sections with their content
3. **Pick designs** — each section is pre-assigned a design from the document, but you can change it from the full library
4. Click **Assemble Page** — the app loads each template, injects your content, scopes CSS to prevent conflicts, and stitches everything together
5. **Preview** the page live and **download** the final HTML

No AI, no API keys. All content injection runs locally on the server.

## Setup

```bash
cd page-builder
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import in [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `page-builder`
4. Deploy — no environment variables needed

## Tech stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Mammoth (docx parsing)
- Cheerio (HTML manipulation + content injection)
