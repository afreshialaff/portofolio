# Afreshia Laffintha Asmy — Portfolio

A quiet, white/black/gray one-page portfolio built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis**.
No loader, no page transitions, no WebGL, no GSAP — CSS animations, `IntersectionObserver` and a few small `requestAnimationFrame` loops.

All copy comes from the résumé and the owner's portfolio notes (chapters 1–7 + case studies, translated from Bahasa Indonesia; no client names) and lives in **one file**: `src/lib/data.ts`.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint
```

Requires Node 18.18+ (Node 20/22 recommended). Optional: set `NEXT_PUBLIC_SITE_URL=https://your-domain` so Open Graph URLs are absolute.

---

## Sections

| # | Section | Component | Notes |
|---|---|---|---|
| — | Navigation | `src/components/Navigation.tsx` | Frosted pill + sliding indicator, **Briefcase** quick access; full-screen menu ≤ 1200 px |
| — | Hero | `src/components/hero/Hero.tsx` | "Accounting, Finance & Business Consulting"; multi-client / parallel work; selected challenging cases; CTAs |
| 01 | About | `sections/About.tsx` | Lanyard ID card; quick facts with both concurrent roles |
| 02 | Services | `sections/Services.tsx` | Seven services with scope + example deliverables; tax split into preparation / computation / review / submission |
| 03 | Case studies | `sections/CaseStudies.tsx` | Four selected challenging cases (custom ERP, Amazon, Singapore, construction) + four engagements; "Open Portfolio Briefcase" |
| 04 | Skills | `sections/Skills.tsx` | 12 core competencies, "View all skills" for the rest; software (daily / familiar), training, languages kept separate |
| 05 | Achievements | `sections/Achievements.tsx` | Business results first; values render final without JS |
| 06 | Experience | `sections/Experience.tsx` | Latest first; concurrent roles labelled; early roles summarised |
| 07 | Credentials | `sections/Credentials.tsx` | Qualifications (issuer · year), training, publications & teaching, awards |
| 08 | Contact + footer | `sections/Contact.tsx` | What to include in a first message; email, phone, LinkedIn, résumé |
| — | Portfolio Briefcase | `components/briefcase/*` | Public drawer (published items only) + owner area at `/briefcase/admin` |

## Portfolio Briefcase

A real document collection for work samples.

**Visitors** open it from the nav ("Briefcase"), the hero or the Case studies section (or `/#briefcase`). They see only
**published** items, with search, category filters, previews (images, PDFs, video), metadata cards for XLSX/CSV/DOCX
(download instead of a fake preview), the evidence label and a link to the related case. With nothing published the
drawer shows "Work samples will be added here."

**The owner** signs in at **`/briefcase/admin`** (not linked publicly, `noindex`):
- drag-and-drop zone and **Choose files** (multi-file), with name, type, size, preview, progress, success/failure and **Retry**
- accepted: PNG, JPG, WebP, GIF, PDF, XLSX, CSV, DOCX, MP4, WebM, MOV — up to **50 MB** each
- every upload starts as a **private draft**; edit title, category, contribution/role, result, evidence label, related case
- **Publish** needs a title, category, contribution, label and a tick confirming the file is cleared for public view
- reorder (↑/↓), replace file (a published item goes back to draft), unpublish, archive/restore, delete drafts

### How it is built
- `src/app/api/briefcase/*` — route handlers: `session` (login/logout), `items` (list/create), `items/[id]`
  (edit/publish/archive/delete), `items/[id]/upload` (retry/replace), `file/[id]` (302 to a 10-minute signed URL).
- Storage: a **private** Supabase Storage bucket; metadata in a Postgres table. Called over REST with the service-role key
  from the server only — no extra npm packages. Files upload straight from the browser to a signed upload URL, so the
  4.5 MB Vercel request limit does not apply.
- Auth: one owner password + HMAC-signed, HttpOnly, SameSite=Strict cookie (8 h). Every write route checks the cookie
  and same origin on the server. Drafts and archived files return 404 to anyone else.

### Setup (one time)
1. Create a Supabase project (free tier is fine).
2. Supabase → SQL Editor → run **`supabase/briefcase.sql`** (creates the table, RLS, and the private `briefcase` bucket).
3. Vercel → Project → Settings → Environment Variables (Production + Preview):
   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | Project URL, e.g. `https://xxxx.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → `service_role` key (keep secret) |
   | `BRIEFCASE_OWNER_PASSWORD` | the password you will use at `/briefcase/admin` |
   | `BRIEFCASE_SESSION_SECRET` | any random string of 32+ characters |
4. Redeploy. Open `/briefcase/admin`, log in, upload.

Until these are set, the site works normally, the public briefcase shows its empty state and the owner page explains
what is missing.

### Samples shipped with the site
Confirmed anonymised samples can also live in `public/briefcase/` and be listed in `src/lib/briefcase/static.ts`
(always published; shown first in the drawer). Spreadsheets get a readable PDF rendering and a preview image.

### Adding files sent to the agent
Files dropped into a chat with an assistant are **not** on the website automatically. They are added through the same
storage path as private drafts with `scripts/briefcase-add.mjs` (needs the two Supabase variables), then reviewed and
published by the owner in `/briefcase/admin`:
```bash
SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/briefcase-add.mjs ./recon.pdf \
  --title "Bank reconciliation working paper" --category "Finance / reconciliation" \
  --label "Anonymised work sample" --case recon
```
Uploading on the website does not send anything to an AI assistant.

### Styling notes
- Design tokens are CSS variables in `src/app/globals.css` (`--paper #f4f2ee`, `--ink #0d0d0d`, `--ease cubic-bezier(.16,1,.3,1)`, …).
- Resets are in `@layer base`, shared classes (`.btn`, `.card`, `.tag`, `.h2`, `.rv`…) in `@layer components`, so Tailwind utilities always win.
- Each component keeps its CSS in a React 19 `<style href precedence>` tag (hoisted and de-duplicated by React). Every one of those sheets **starts with** `@layer theme, base, components, utilities;` — whichever stylesheet the browser sees first then fixes the same layer order, so a component sheet can never be ordered below Tailwind's preflight.
- `prefers-reduced-motion`: Lenis is not started, decorative animation/transition durations are zeroed, the ID card does not swing, the hero video does not autoplay (▶ starts it), counters show final values.

---

## Content provenance (nothing invented)

Everything is from the résumé (a LinkedIn "Resume generated from profile" PDF), including the embedded LinkedIn link and email. Where the brief assumed a developer résumé, the site adapts instead of inventing:

| Brief asked for | Résumé has | What the site does |
|---|---|---|
| GitHub link, project repos | none | GitHub buttons are rendered only if `PROFILE.github` / `project.github` is set — currently hidden |
| Projects | no software projects | **Work** shows seven areas of practice whose descriptions/bullets are the résumé's own wording (reporting, reconciliation, tax, audit, AI & knowledge, cloud accounting, teaching & writing incl. the patent and two publications) |
| Coding-platform logos (LeetCode…) | none | Achievement cards use neutral line icons |
| "DEVELOPER ID" | accountant | Card reads **ACCOUNTANT ID**; rows are Cert. (Chartered Accountant (IAI)), Dept. (AI & Knowledge Dev.), Class of (2024, graduation year) — no made-up ID number |
| Quote | — | "Better financial processes lead to better business decisions." — a paraphrase of the summary's last paragraph, captioned as such |
| Location | full home address | Only "Kota Malang, Jawa Timur, Indonesia" (the profile location) is shown; the street address is deliberately left out |
| Certificate issuers | only IAI and ACCA stated | Issuer shown only where stated |

The mini UIs in **Work** are labelled "Illustrative UI" on screen and contain no client data and no figures.

To edit content, change `src/lib/data.ts` only.

---

## Rebuilding the hero video

`scripts/build-hero-assets.py` (Python 3.9+, `ffmpeg`/`ffprobe` on PATH, `numpy`, `Pillow`):

```bash
pip install numpy pillow
npm run hero
# = python3 scripts/build-hero-assets.py --video source/intro.mp4 --photo source/portrait.png
```

What it does:
1. **Detects the person** (union bounding box of non-background pixels across sampled frames) and crops a 4:5 window head-to-toe, centred on the figure (for this video: `crop=864:1080:497:0`), scaled to **768 × 960**. Override with `--crop W:H:X:Y`.
2. **Whitens** the backdrop: `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98`, so it disappears under `mix-blend-mode: multiply`.
3. **Seamless loop** from the first `--duration` (10 s): the last `--fade` (0.5 s) of the picture cross-fades into the first 0.5 s with `xfade`; the audio is cross-faded **sample-accurately in numpy** (equal-power), never with `acrossfade`. Nothing is retimed, so lips stay in sync. Output length = 9.5 s.
4. Exports `public/hero/hero.mp4` (H.264 yuv420p, CRF 24, `-preset slow`, AAC 96 k, `+faststart`), `public/hero/hero.webm` (VP9 CRF 36, Opus 80 k) and `public/hero/poster.webp` (first frame).
   The WebM/Opus file is sample-exact at the seam (Opus frames divide 9.5 s evenly). The MP4/AAC fallback carries ≤ 15 ms of encoder padding at its end, which some decoders play as a tiny silence on loop.
5. Makes `public/portrait-bust.webp` (480 × 600 head-to-shirt crop — from `--photo` if given, otherwise the sharpest video frame) and `public/og.jpg` (1200 × 630).

Source files are kept in `source/` (`intro.mp4`, `portrait.png`).

---

## Credits & licences

- **Fonts** (self-hosted via `next/font/local`, `src/fonts/`): Inter Tight, Instrument Serif, JetBrains Mono — all SIL Open Font License 1.1 (licence files alongside). Latin subsets from Fontsource.
- **Brand logos** (`public/logos/`): MYOB and Shopee SVGs from [simple-icons](https://github.com/simple-icons/simple-icons), CC0-1.0 (`LICENSE-simple-icons.md`), in their official colours. Logos are trademarks of their owners and are used only to name software listed in the résumé. Accurate, Mekari Jurnal, Zahir, CoreTax, e-Faktur, e-SPT and DJP Online have no openly licensed mark, so neutral line icons are used instead. Details in `public/logos/README.md`.
- **Concept icons** in `TechLogo.tsx` are original line drawings.
- Smooth scroll: [Lenis](https://github.com/darkroomengineering/lenis) (MIT).

---

## Folder structure

```
src/app/            layout.tsx · page.tsx · globals.css
src/components/     App.tsx · Navigation.tsx · hero/Hero.tsx · sections/*.tsx · ui/*.tsx
src/lib/            data.ts · hooks.ts · scroll.tsx
src/fonts/          *.woff2 + OFL licences
public/hero/        hero.mp4 · hero.webm · poster.webp
public/logos/       myob.svg · shopee.svg · licence + README
public/             portrait-bust.webp · og.jpg · favicon.svg · Afreshia-Laffintha-Asmy-Resume.pdf
scripts/            build-hero-assets.py · assets/ (OG fonts)
source/             intro.mp4 · portrait.png
```
