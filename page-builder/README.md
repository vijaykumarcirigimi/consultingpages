# Edstellar Page Stitcher

Upload a **developer-reference `.docx`** document and get a fully assembled, responsive Edstellar consulting page in seconds.

## How it works

1. **Upload** a developer-reference document (produced by the doc-builder skill)
2. The engine **parses** every `DESIGN MODULE: filename.html` tag in the document
3. For each section, it **loads** the matching HTML template from the library
4. **Gemini 2.0 Flash** fills each template with the real content from the document
5. All sections are **stitched** into one production-ready HTML page with combined CSS and JS
6. **Download** the final `.html` file

## Setup

```bash
cd page-builder
npm install
```

Create a `.env.local` file:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `page-builder`
4. Add environment variable: `GEMINI_API_KEY` = your key
5. Deploy

The `copy-lib` build script automatically syncs the HTML library from the parent `library/` directory into `public/library/` during build.

## Tech stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Google Gemini 2.0 Flash API
- Mammoth (docx parsing)
- Cheerio (HTML manipulation)
