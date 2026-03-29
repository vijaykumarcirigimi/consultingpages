import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";

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
    const { prompt } = await req.json();

    // 1. Locate the Library
    // Fallback switch removed: The application now explicitly packages a local copy
    // of the library folder during both the `npm run dev` and `npm run build` steps.
    const libraryPath = path.join(process.cwd(), "library");
    const indexPath = path.join(libraryPath, "library-index.json");
    
    let indexData = "";
    try {
      indexData = await fs.readFile(indexPath, "utf-8");
    } catch(err) {
      console.error("Could not read library index, looking at: ", indexPath);
      return NextResponse.json({ error: "Library index not found." }, { status: 500 });
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
        You are an expert AI Page Builder and Content Strategist.
        The user wants to build a landing page with this intent: "${prompt}".
        
        Here is the library of available sections (JSON format):
        ${indexData}
        
        Your task:
        1. Select 3 to 5 appropriate HTML sections from the library to build the page. 
           Always start with a hero section (e.g., "edstellar-hero-classic-split.html").
           End with "edstellar-footer.html".
        2. Generate specific, targeted, keyword-rich text to overwrite the dummy content in those HTML files.
        
        Output MUST be valid JSON in this exact format:
        {
          "sections": [
            {
              "file": "edstellar-hero-classic-split.html",
              "replacements": [
                { "selector": "h1", "text": "Your custom headline" },
                { "selector": ".hero-sub", "text": "Your custom subheadline" }
              ]
            }
          ]
        }
        
        Only replace major text elements like h1, h2, p, and .tag. Use valid CSS selectors that would match generic elements inside those specific files. Try to replace .card titles, etc.
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
      const filePath = path.join(libraryPath, section.file);
      let htmlContent = "";
      try {
        htmlContent = await fs.readFile(filePath, "utf-8");
      } catch(e) {
        console.warn(`Skipping missing file: ${section.file}`);
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
