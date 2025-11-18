# AI Landing Page Generator

This is a minimal **Next.js 14** app that lets you:

- Type in a startup idea
- Send it to OpenAI on the server
- Get a full landing page back (hero, features, pricing, FAQs + HTML)
- See a live visual preview
- Copy the generated HTML into your own stack (Webflow, Framer, custom, etc.)

It is intentionally small and simple so you can extend it.

---

## 1. What you need

You **do not** need to install anything on your own computer if you don't want to.

You only need:

- A free [Vercel](https://vercel.com) account (for hosting)
- An [OpenAI API key](https://platform.openai.com/)

---

## 2. Running this without local setup (recommended)

1. **Download the ZIP** that ChatGPT gave you.
2. Go to **Vercel** → "Add New" → "Project" → "Import from..." → choose "Upload".
3. Upload the ZIP.
4. When Vercel asks for **Environment Variables**, add:

   - `OPENAI_API_KEY` = your secret key from the OpenAI dashboard

5. Click **Deploy**.

Once it finishes, you'll get a live URL like:

`https://your-project-name.vercel.app`

That URL is your **AI landing page generator app**, ready to use.

---

## 3. If you want to run it locally (optional)

If you *do* have Node.js and want to run it on your machine:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

Make sure you have a `.env.local` file with:

```bash
OPENAI_API_KEY=sk-...
```

---

## 4. Where the main logic lives

- `app/page.js` – the main UI (form + preview)
- `app/api/generate/route.js` – calls the OpenAI API and returns structured JSON

You can edit the prompt in `route.js` to:

- Change the style of copy
- Add or remove sections
- Adjust pricing / FAQ style

---

## 5. Next steps you can add later

- Stripe Checkout to charge for exports
- User accounts & saved pages (Supabase)
- Multiple design templates
- Image generation for hero/feature imagery

For now, this is a clean, focused v0.1 you can already launch and iterate on.
