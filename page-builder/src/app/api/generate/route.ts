import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";
import * as mammoth from "mammoth";

// Function to provide a fallback/mock response in case no Gemini key is provided
function getMockStrategy() {
  return {
    sections: [
      {
        file: "edstellar-hero-classic-split.html",
        replacements: [
          { selector: "h1 span.accent", text: "AI-Powered Logistics" },
          { selector: "p.hero-sub", text: "Transform your supply chain with cutting-edge AI. We offer tailored solutions for modern distribution networks." }
        ]
      },
      {
        file: "edstellar-stats-card-grid.html",
        replacements: [
          { selector: ".card:nth-child(1) .number", text: "40%" },
          { selector: ".card:nth-child(1) .label", text: "Cost Reduction" }
        ]
      },
      {
        file: "edstellar-footer.html",
        replacements: []
      }
    ]
  };
}

export async function POST(req: Request) {
  try {
    // 1. Process FormData & Extract Docx Text
    const formData = await req.formData();
    const file = formData.get("document") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No document provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extraction = await mammoth.extractRawText({ buffer });
    const documentText = extraction.value;

    // 2. Fetch the Library over HTTP (100% Vercel Proof)
    const baseUrl = req.url.split("/api")[0];
    let indexData = "";
    
    try {
      const idxRes = await fetch(`${baseUrl}/library/library-index.json`);
      if (!idxRes.ok) throw new Error("Failed to fetch library-index.json");
      indexData = await idxRes.text();
    } catch(err) {
      console.error("HTTP Fetch Error on library index:", err);
      return NextResponse.json({ error: "Library index not reachable on CDN." }, { status: 500 });
    }

    let strategy;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== "YOUR_API_KEY_HERE" && apiKey.length > 10) {
      // 2A. Use Gemini AI
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro", 
        generationConfig: { responseMimeType: "application/json" } 
      });
      
      const sysPrompt = `
        You are an expert Content Mapper and AI Page Assembler.
        The user has uploaded a Word document containing their page strategy and copy.
        
        DOCUMENT CONTENT:
        """
        ${documentText}
        """
        
        AVAILABLE DESIGN LIBRARY (JSON):
        """
        ${indexData}
        """
        
        Your task:
        1. Read the user's document carefully.
        2. Identify which sections the user wants (e.g., Hero, Features, Testimonials).
        3. Match them against the closest file names in the Available Design Library.
        4. Extract the exact text from the user's document and assign it to valid generic CSS selectors (h1, h2, p, span, .card, etc.) for that specific file.
        
        Output MUST be valid JSON in this exact format:
        {
          "sections": [
            {
              "file": "edstellar-hero-classic-split.html",
              "replacements": [
                { "selector": "h1", "text": "Extracted headline" },
                { "selector": ".hero-sub", "text": "Extracted subheadline" }
              ]
            }
          ]
        }
        
        Only pick sections that actually exist in the library. If the document is vague about section names, infer the best sections to use based on the text. Always start with a hero and end with a footer.
      `;
      
      const result = await model.generateContent(sysPrompt);
      const responseText = result.response.text();
      strategy = JSON.parse(responseText);
    } else {
      // 2B. Mock Fallback (Useful for immediate testing without keys)
      console.warn("No GEMINI_API_KEY provided. Using mock strategy for demonstration.");
      strategy = getMockStrategy();
    }

    // 3. Assemble Phase (Stitching)
    let finalBodyHtml = "";
    let headStyles = "";
    let headFonts = "";

    for (const section of strategy.sections) {
      let htmlContent = "";
      try {
        const res = await fetch(`${baseUrl}/library/${section.file}`);
        if (!res.ok) throw new Error("HTTP Not found");
        htmlContent = await res.text();
      } catch(e) {
        console.warn(`Skipping missing HTTP file: ${section.file}`);
        continue;
      }
      
      const $ = cheerio.load(htmlContent);
      
      // Extract global fonts & styles from the first loaded section
      // Assuming all sections share the same foundational CSS variables
      if (!headStyles) {
        headStyles = $('style').html() || "";
        headFonts = $('link[rel="stylesheet"]').toString() || "";
      }
      
      // Apply LLM text replacements
      if (section.replacements && Array.isArray(section.replacements)) {
         for (const rep of section.replacements) {
            if ($(rep.selector).length) {
              // Only overwrite text, not inner HTML tags unless cautious.
              // We'll use .text() to be safe, or .html() if we want nested highlights.
              // For safety and preserving layout, let's just replace text.
              $(rep.selector).first().text(rep.text);
            }
         }
      }
      
      // Clean up standalone navigation or redundant wrappers if necessary.
      // E.g., removing the default <nav> from hero if we don't want it, but let's keep it for now.
      $('script').remove();
      
      // We take everything inside <body>. Most templates have <div class="page-wrap"> inside body.
      finalBodyHtml += $('body').html();
    }
    
    // 4. Wrap with global document structure
    const finalHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Target Page</title>
        ${headFonts}
        <style>
          ${headStyles}
          /* Ensure consecutive page-wraps display cleanly */
          body { margin: 0; padding: 0; background: #F4F5F7; }
        </style>
      </head>
      <body>
        ${finalBodyHtml}
      </body>
      </html>
    `;

    return NextResponse.json({ html: finalHtml });
    
  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
