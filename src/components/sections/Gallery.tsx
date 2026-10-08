import { CASES, GALLERY, sectionIndex } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * Proof-of-work gallery. Renders nothing until GALLERY (src/lib/data.ts) has items,
 * so the public site never shows empty cards, broken images or dead buttons.
 *
 * Add a file to /public/gallery and an entry like:
 *   { id: "erp-dashboard", title: "ERP — invoicing module", category: "ERP",
 *     summary: "…", label: "Demo using synthetic data", kind: "image",
 *     src: "/gallery/erp-dashboard.webp", caseId: "erp" }
 * PDFs and videos take a `preview` image as well.
 */

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.gal-grid{list-style:none;margin:48px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.6vw,20px)}
.gal-card{display:flex;flex-direction:column;height:100%;border-radius:24px;background:var(--card);box-shadow:var(--hair);overflow:hidden;
  transition:box-shadow .6s var(--ease),transform .6s var(--ease)}
.gal-card:hover{transform:translateY(-4px);box-shadow:var(--hair),var(--shadow-soft)}
.gal-prev{position:relative;aspect-ratio:4/3;background:var(--paper);overflow:hidden}
.gal-prev img,.gal-prev video{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
.gal-card:hover .gal-prev img{transform:scale(1.04)}
.gal-label{position:absolute;left:12px;top:12px;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.9);box-shadow:inset 0 0 0 1px var(--line);
  font-family:var(--font-mono);font-size:10px;text-transform:uppercase;color:var(--ink)}
.gal-body{display:flex;flex-direction:column;gap:8px;padding:18px 20px 20px;flex:1}
.gal-cat{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--mute)}
.gal-body h3{font-weight:700;font-size:19px;letter-spacing:-.035em;line-height:1.15}
.gal-body p{font-size:14px;line-height:1.5;color:var(--ink-2)}
.gal-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:8px}
.gal-actions .btn{height:40px;padding:0 16px;font-size:13.5px}
@media (max-width: 960px){ .gal-grid{grid-template-columns:repeat(2,minmax(0,1fr))} }
@media (max-width: 620px){ .gal-grid{grid-template-columns:minmax(0,1fr)} }
}
`;

export default function Gallery() {
  if (!GALLERY.length) return null;
  return (
    <section id="gallery" className="section" aria-labelledby="gallery-title">
      <style href="gallery" precedence="component">
        {css}
      </style>
      <div className="wrap">
        <SectionHead index={sectionIndex("gallery")} label="Proof of work" title="Samples you can" accent="open." id="gallery-title" />
        <ul className="gal-grid">
          {GALLERY.map((g, i) => {
            const relatedCase = g.caseId ? CASES.find((c) => c.id === g.caseId) : undefined;
            const preview = g.kind === "image" ? g.src : g.preview;
            return (
              <li key={g.id} className="rv" style={{ ["--i" as string]: i % 3 }}>
                <article className="gal-card">
                  <div className="gal-prev">
                    {g.kind === "video" ? (
                      <video src={g.src} poster={g.preview} controls preload="none" playsInline aria-label={g.title} />
                    ) : preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt={`${g.title} — ${g.label}`} loading="lazy" decoding="async" />
                    ) : null}
                    <span className="gal-label">{g.label}</span>
                  </div>
                  <div className="gal-body">
                    <p className="gal-cat">{g.category}</p>
                    <h3>{g.title}</h3>
                    <p>{g.summary}</p>
                    <div className="gal-actions">
                      {g.kind !== "video" && (
                        <a className="btn btn-primary" href={g.src} target="_blank" rel="noopener noreferrer">
                          {g.kind === "pdf" ? "Open PDF" : "View full size"} <span className="arr" aria-hidden="true">↗</span>
                        </a>
                      )}
                      {relatedCase && (
                        <a className="btn btn-ghost" href="#cases">
                          Related case
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
