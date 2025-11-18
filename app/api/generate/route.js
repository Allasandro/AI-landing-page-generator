import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse(
        "OPENAI_API_KEY is not set. Add it in your Vercel project settings.",
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      productName,
      oneLiner,
      description,
      targetAudience,
      tone,
      primaryCta,
      secondaryCta,
    } = body || {};

    if (!productName || !oneLiner || !description || !targetAudience) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const toneLabel =
      tone === "calm"
        ? "calm, confident B2B SaaS"
        : tone === "playful"
        ? "playful, fun, creator-focused"
        : tone === "minimal"
        ? "minimal, clean, product-focused"
        : "bold, punchy, hacker-news-launch style";

    const prompt = `
You are a senior SaaS copywriter who specialises in landing pages that convert.

Write high-converting landing page copy for the following product. Return **only** valid JSON that matches this exact TypeScript type:

type LandingPage = {
  heroTitle: string;
  heroSubtitle: string;
  features: { title: string; body: string }[];
  pricing: { name: string; price: string; cadence: string; bullet: string }[];
  faqs: { q: string; a: string }[];
  rawHtml: string;
};

Product name: ${productName}
One-line pitch: ${oneLiner}
Target audience: ${targetAudience}
Detailed description: ${description}
Preferred tone of voice: ${toneLabel}
Primary call-to-action button label: ${primaryCta || "Get started free"}
Secondary call-to-action button label: ${secondaryCta || "Watch demo"}

Constraints:
- Hero title must be under 90 characters, sharp and concrete.
- Hero subtitle must be 1–2 sentences and focus on outcome and speed.
- Include exactly 4 features focused on pain points and outcomes.
- Include exactly 2 pricing tiers. Make them realistic for an indie SaaS.
- FAQs should be concise, addressing trust, editing, and usage.
- In "rawHtml", include a clean, semantic HTML5 snippet with sections for hero, features, pricing, and FAQs. No inline styles, no <html> or <body> tags.
- Do NOT include markdown. Do NOT include comments. Do NOT wrap the JSON in backticks.
`;

    // Call the Responses API without response_format and parse JSON manually
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const content = response.output[0]?.content[0];

    if (!content || typeof content.text !== "string") {
      throw new Error("No text content returned from model");
    }

    let parsed;
    try {
      parsed = JSON.parse(content.text);
    } catch (e) {
      console.error("Failed to parse JSON from model:", content.text);
      throw new Error("Model did not return valid JSON");
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Error in /api/generate:", err);
    return new NextResponse("Failed to generate landing page copy", { status: 500 });
  }
}
