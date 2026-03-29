import { NextResponse } from "next/server";
import * as mammoth from "mammoth";
import { parseSectionsFromHtml } from "@/lib/parse-sections";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("document") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No document uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Use convertToHtml to preserve headings, bold, paragraphs, lists
    const { value: docHtml } = await mammoth.convertToHtml({ buffer });

    const sections = parseSectionsFromHtml(docHtml);
    if (sections.length === 0) {
      return NextResponse.json(
        { error: 'No template markers found. Please upload a developer-reference .docx.' },
        { status: 400 }
      );
    }

    // Extract SEO metadata from raw text
    const { value: docText } = await mammoth.extractRawText({ buffer });
    const titleMatch = docText.match(/Meta Title\s+(.+)/i);
    const descMatch = docText.match(/Meta Description\s+(.+)/i);

    return NextResponse.json({
      sections,
      seo: {
        title: titleMatch ? titleMatch[1].trim() : "",
        description: descMatch ? descMatch[1].trim() : "",
      },
    });
  } catch (error: any) {
    console.error("Parse error:", error);
    return NextResponse.json({ error: error.message || "Parse failed" }, { status: 500 });
  }
}
