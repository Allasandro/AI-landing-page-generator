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
    const { productName, description, stylePreset } = body || {};

    if (!productName && !description) {
      return new NextResponse("Missing product information", { status: 400 });
    }

    // Map UI template style to visual art direction
    const styleMap = {
      minimal:
        "minimalist, clean, lots of white space, subtle gradients, simple line icons, product-focused SaaS hero illustration",
      bold:
        "bold SaaS landing page hero, strong gradients, neon accents, abstract 3D blobs, sharp UI mockups, modern and high contrast",
      playful:
        "soft, friendly, pastel colors, rounded shapes, creator-focused dashboard illustration, subtle hand-drawn details",
      b2b:
        "clean corporate B2B SaaS hero, blue and slate palette, subtle gradients, realistic but simplified dashboard mockup, trustworthy and modern",
    };

    const visualStyle =
      styleMap[stylePreset] ||
      "modern SaaS landing page hero, gradient background, abstract shapes, and product dashboard mockup";

    const prompt = `
Landing page hero illustration for a SaaS product.

Product name: ${productName || "AI-powered SaaS product"}
Description: ${description || "AI startup tool that helps users do their work faster."}

Visual style: ${visualStyle}
Framing: wide hero banner, 16:9 layout, centered composition, no text.
Subject: abstract but clearly tech / SaaS, with UI cards, charts, or dashboard elements.
Quality: crisp, high-resolution, suitable as a landing page hero image.
`;

    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024", // safe size supported by the API
      n: 1,
    });

    const url = image.data?.[0]?.url;

    if (!url) {
      throw new Error("No image URL returned from OpenAI");
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Error in /api/hero-image:", err);
    return new NextResponse("Failed to generate hero image", { status: 500 });
  }
}
