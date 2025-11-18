"use client";

import { useState } from "react";

const defaultState = {
  productName: "",
  oneLiner: "",
  description: "",
  targetAudience: "",
  tone: "bold",
  primaryCta: "Get started free",
  secondaryCta: "Watch demo"
};

export default function HomePage() {
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState("pretty");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate landing page");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(defaultState);
    setResult(null);
    setError("");
  };

  const heroTitle = result?.heroTitle || "Your AI-native startup, in one line.";
  const heroSubtitle =
    result?.heroSubtitle ||
    "Drop your idea in. Get a conversion-optimized landing page out. Built for indie hackers, by an indie hacker.";
  const features = result?.features || [
    {
      title: "Conversion-first copy",
      body: "Every section is written with headlines, hooks and CTAs optimized for signups."
    },
    {
      title: "Designed for speed",
      body: "From idea to published page in under 60 seconds. No Figma, no copywriters."
    },
    {
      title: "Export-ready HTML",
      body: "Copy and paste your landing into Webflow, Framer, Vercel or anywhere else."
    },
    {
      title: "Battle-tested sections",
      body: "Hero, features, pricing, FAQs and social proof tuned for SaaS and indie projects."
    }
  ];
  const pricing = result?.pricing || [
    {
      name: "Starter",
      price: "$9",
      cadence: "one-time",
      bullet: "Export one high-converting landing page."
    },
    {
      name: "Indie Hacker",
      price: "$29",
      cadence: "per month",
      bullet: "Unlimited pages, projects and experiments."
    }
  ];
  const faqs =
    result?.faqs ||
    [
      {
        q: "Do I need any design skills?",
        a: "No. Just describe your product and audience in plain language, we handle the rest."
      },
      {
        q: "Can I edit the copy after?",
        a: "Yes, you get clean text and HTML you can tweak in your stack of choice."
      }
    ];

  const generatedHtml = result?.rawHtml || "";

  return (
    <main>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <div className="badge">
              <span className="badge-dot" />
              SHIPPING IN PUBLIC · V0.1
            </div>
            <div style={{ marginTop: 8 }}>
              <div className="app-title">
                <span className="logo">Λ</span>
                <span>AI Landing Page Studio</span>
              </div>
              <div className="app-subtitle">
                Turn a one-line startup idea into a full landing page in seconds.
              </div>
            </div>
          </div>
          <div className="app-header-right">
            <div className="app-header-pill">No-code · Built live · Indie SaaS</div>
          </div>
        </header>

        <div className="app-body">
          <section className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Idea input</div>
                <div className="card-annotation">
                  Describe your startup. We&apos;ll handle hero, features, pricing, and FAQs.
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-row">
                <label className="form-label">
                  <strong>Product name</strong> · <span>What are you building?</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="Example: LaunchPage AI"
                  value={form.productName}
                  onChange={handleChange("productName")}
                />
              </div>

              <div className="form-row">
                <label className="form-label">
                  <strong>One-line pitch</strong> · <span>Explain it like you would on X</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={160}
                  placeholder="Generate a full startup landing page from a single sentence."
                  value={form.oneLiner}
                  onChange={handleChange("oneLiner")}
                />
              </div>

              <div className="form-row">
                <label className="form-label">
                  <strong>Who is this for?</strong> · <span>Target audience</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  placeholder="Indie hackers, solo founders, small SaaS teams..."
                  value={form.targetAudience}
                  onChange={handleChange("targetAudience")}
                />
              </div>

              <div className="form-row">
                <label className="form-label">
                  <strong>What does it do?</strong> · <span>Details, pain points, outcomes</span>
                </label>
                <textarea
                  required
                  maxLength={800}
                  placeholder="Explain the problem, how your product solves it, what makes it different, and what success looks like for your users."
                  value={form.description}
                  onChange={handleChange("description")}
                />
                <div className="helper-text">
                  The more specific you are (metrics, examples, audience), the sharper the copy.
                </div>
              </div>

              <div className="inline-inputs">
                <div className="form-row">
                  <label className="form-label">
                    <strong>Voice &amp; tone</strong>
                  </label>
                  <select value={form.tone} onChange={handleChange("tone")}>
                    <option value="bold">Bold &amp; punchy (startup launch)</option>
                    <option value="calm">Calm &amp; confident (B2B SaaS)</option>
                    <option value="playful">Playful &amp; fun (creator tools)</option>
                    <option value="minimal">Minimal &amp; product-focused</option>
                  </select>
                </div>
                <div className="form-row">
                  <label className="form-label">
                    <strong>Primary CTA label</strong>
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    placeholder="Get started free"
                    value={form.primaryCta}
                    onChange={handleChange("primaryCta")}
                  />
                </div>
              </div>

              <div className="inline-inputs">
                <div className="form-row">
                  <label className="form-label">
                    <strong>Secondary CTA label</strong>
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    placeholder="Watch demo"
                    value={form.secondaryCta}
                    onChange={handleChange("secondaryCta")}
                  />
                  <div className="helper-text">
                    Optional. Used for a softer action like a demo or live preview.
                  </div>
                </div>
              </div>

              <div className="chip-row">
                <span className="chip highlight">Hero copy</span>
                <span className="chip highlight">Features</span>
                <span className="chip highlight">Pricing section</span>
                <span className="chip">FAQs</span>
                <span className="chip">Conversion hints</span>
              </div>

              <div className="actions-row">
                <button type="submit" className="button-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "999px",
                          border: "2px solid rgba(15,23,42,0.7)",
                          borderTopColor: "#020617",
                          display: "inline-block",
                          animation: "spin 0.7s linear infinite"
                        }}
                      />
                      Generating page...
                    </>
                  ) : (
                    <>
                      <span>Generate landing page</span>
                      <span style={{ fontSize: 16 }}>↻</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset form
                </button>
                <span className="helper-text">
                  Uses your OPENAI_API_KEY on the server. You keep full control.
                </span>
              </div>

              {error && (
                <div style={{ fontSize: 12, color: "var(--danger)", marginTop: 6 }}>{error}</div>
              )}
            </form>
          </section>

          <section className="card">
            <div className="preview-header">
              <div>
                <div className="card-title">Live preview</div>
                <div className="card-annotation">
                  This is what your generated landing page copy will roughly look like.
                </div>
              </div>
              <div className="preview-tabs">
                <button
                  type="button"
                  className={
                    "preview-tab" + (previewMode === "pretty" ? " active" : "")
                  }
                  onClick={() => setPreviewMode("pretty")}
                >
                  Visual
                </button>
                <button
                  type="button"
                  className={
                    "preview-tab" + (previewMode === "html" ? " active" : "")
                  }
                  onClick={() => setPreviewMode("html")}
                >
                  HTML
                </button>
              </div>
            </div>

            {previewMode === "pretty" ? (
              <div className="preview-shell">
                <div className="preview-browser-bar">
                  <div className="preview-dots">
                    <span className="preview-dot red" />
                    <span className="preview-dot amber" />
                    <span className="preview-dot green" />
                  </div>
                  <div className="preview-url">
                    {form.productName || "your-product"}.launchpage.ai
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>live preview</div>
                </div>
                <div className="preview-body">
                  <div className="preview-hero-eyebrow">
                    {form.targetAudience
                      ? `${form.targetAudience} · AI-powered`
                      : "Indie SaaS · AI-powered"}
                  </div>
                  <h1 className="preview-hero-title">{heroTitle}</h1>
                  <p className="preview-hero-subtitle">{heroSubtitle}</p>
                  <div className="preview-cta-row">
                    <button className="button-primary" type="button">
                      {form.primaryCta || "Get started free"}
                    </button>
                    <div className="preview-secondary-cta">
                      {form.secondaryCta || "Watch demo"}
                    </div>
                  </div>
                  <div className="preview-metadata">
                    <span className="preview-pill">
                      Built for{" "}
                      {form.targetAudience || "indie hackers and tiny SaaS teams"}
                    </span>
                    <span className="preview-pill">No-code friendly</span>
                    <span className="preview-pill">Export to HTML</span>
                  </div>

                  <h2 className="preview-section-title">Features</h2>
                  <div className="preview-feature-grid">
                    {features.map((f, idx) => (
                      <div key={idx} className="preview-feature-card">
                        <div className="preview-feature-title">{f.title}</div>
                        <div className="preview-feature-body">{f.body}</div>
                      </div>
                    ))}
                  </div>

                  <h2 className="preview-section-title">Pricing</h2>
                  <div className="preview-pricing-grid">
                    {pricing.map((p, idx) => (
                      <div key={idx} className="preview-pricing-card">
                        <div className="preview-pricing-name">{p.name}</div>
                        <div className="preview-pricing-amount">{p.price}</div>
                        <div className="preview-pricing-meta">{p.cadence}</div>
                        <div className="preview-pricing-meta" style={{ marginTop: 6 }}>
                          {p.bullet}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h2 className="preview-section-title">FAQs</h2>
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="preview-faq-item">
                      <div className="preview-faq-question">{faq.q}</div>
                      <div className="preview-faq-answer">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <pre
                style={{
                  background: "#020617",
                  borderRadius: 10,
                  border: "1px solid rgba(30,64,175,0.8)",
                  padding: 12,
                  fontSize: 11,
                  maxHeight: 460,
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word"
                }}
              >
                {generatedHtml || "<!-- Generated landing page HTML will appear here once you run it on a server with your OPENAI_API_KEY configured. -->"}
              </pre>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
