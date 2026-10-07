"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { MiniUI } from "@/components/ui/MiniUI";
import { TechLogo } from "@/components/ui/TechLogo";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.work-intro{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.work-intro p{max-width:40ch;color:var(--mute);font-size:15px}
.acc{--spine:66px;display:flex;gap:10px;height:min(78svh,600px);margin-top:48px;container-type:inline-size;container-name:acc}
.acc-panel{position:relative;flex:1 1 0;min-width:0;max-width:var(--spine);border-radius:26px;background:var(--card);box-shadow:var(--hair);overflow:hidden;
  transition:flex-grow .9s var(--ease),max-width .9s var(--ease),box-shadow .6s var(--ease)}
.acc-panel.is-open{flex-grow:8;max-width:100%;box-shadow:var(--hair),var(--shadow-deep)}
.acc-spine{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;
  transition:opacity .45s var(--ease)}
.acc-panel.is-open .acc-spine{opacity:0;pointer-events:none}
.acc-num{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.acc-vt{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:17px;letter-spacing:-.02em;white-space:nowrap}
.acc-plus{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);font-size:20px;line-height:1;
  transition:transform .6s var(--ease),background-color .4s var(--ease),color .4s var(--ease)}
.acc-trigger{position:absolute;inset:0;z-index:2;border-radius:26px}
.acc-panel:not(.is-open):hover .acc-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
.acc-panel.is-open .acc-trigger{pointer-events:none}

.acc-body{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:28px;padding:30px;
  min-width:calc(100cqw - (var(--n) - 1) * (var(--spine) + 10px));opacity:0;visibility:hidden;transition:opacity .4s var(--ease),visibility 0s linear .4s}
.acc-panel.is-open .acc-body{opacity:1;visibility:visible;transition:opacity .7s var(--ease) .25s,visibility 0s}
.acc-text{display:flex;flex-direction:column;min-width:0;overflow:auto;scrollbar-width:none}
.acc-kick{display:flex;align-items:center;gap:12px;font-family:var(--font-mono);font-size:12px;color:var(--mute);text-transform:uppercase}
.acc-kick b{color:var(--ink);font-weight:500}
.acc-text h3{margin-top:18px;font-weight:700;font-size:clamp(30px,3.2vw,48px);line-height:1;letter-spacing:-.045em}
.acc-text > p{margin-top:16px;color:var(--ink-2);font-size:15.5px;line-height:1.6;max-width:52ch}
.acc-feats{list-style:none;margin:22px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 18px}
.acc-feats li{position:relative;padding-left:16px;font-size:13.5px;line-height:1.4;color:var(--ink-2)}
.acc-feats li::before{content:"";position:absolute;left:0;top:.5em;width:7px;height:1.5px;background:var(--ink)}
.acc-tech{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:22px}
.acc-tech .chip img,.acc-tech .chip svg{width:15px;height:15px}
.acc-ui{position:relative;min-width:0;clip-path:inset(0 100% 0 0 round 18px);transition:clip-path 1.1s var(--ease)}
.acc-panel.is-open .acc-ui{clip-path:inset(0 0 0 0 round 18px);transition-delay:.3s}
.acc-ui-tag{position:absolute;right:12px;bottom:12px;z-index:2;font-family:var(--font-mono);font-size:10px;text-transform:uppercase;
  padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.85);box-shadow:inset 0 0 0 1px var(--line);color:var(--mute)}

@container acc (max-width: 1200px){ .acc-body{grid-template-columns:minmax(0,1fr) minmax(0,.85fr);gap:22px;padding:26px} }
@media (max-width: 1180px){
  .acc{flex-direction:column;height:auto;gap:8px}
  .acc-panel{flex:none;max-width:none;border-radius:22px}
  .acc-spine{position:relative;inset:auto;flex-direction:row;justify-content:flex-start;gap:14px;padding:18px 20px;height:72px}
  .acc-panel.is-open .acc-spine{display:none}
  .acc-vt{writing-mode:horizontal-tb;transform:none;flex:1;overflow:hidden;text-overflow:ellipsis}
  .acc-trigger{border-radius:22px}
  .acc-body{position:relative;inset:auto;min-width:0;grid-template-columns:minmax(0,1fr);padding:22px;display:none}
  .acc-panel.is-open .acc-body{display:grid}
  .acc-ui{height:280px}
  .acc-feats{grid-template-columns:minmax(0,1fr)}
}
}
`;

export default function Work() {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <style href="work" precedence="component">
        {css}
      </style>
      <div className="wrap">
        <div className="work-intro">
          <SectionHead index="03" label="Selected work" title="What I do," accent="daily." id="work-title" />
          <p className="rv">
            Eight areas of practice, from the résumé and portfolio notes. The sketches on the right are illustrative, not
            client data.
          </p>
        </div>

        <div className="acc rv" style={{ ["--i" as string]: 1, ["--n" as string]: PROJECTS.length }}>
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                className={`acc-panel ${isOpen ? "is-open" : ""}`}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                aria-labelledby={`acc-h-${p.id}`}
              >
                <button
                  type="button"
                  className="acc-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`acc-b-${p.id}`}
                  onClick={() => setOpen(i)}
                  aria-label={`${p.index} ${p.title}`}
                />
                <div className="acc-spine" aria-hidden="true">
                  <span className="acc-num">{p.index}</span>
                  <span className="acc-vt">{p.title}</span>
                  <span className="acc-plus">+</span>
                </div>
                <div className="acc-body" id={`acc-b-${p.id}`}>
                  <div className="acc-text">
                    <p className="acc-kick">
                      <b>{p.index}</b> {p.kicker}
                    </p>
                    <h3 id={`acc-h-${p.id}`}>{p.title}</h3>
                    <p>{p.description}</p>
                    <ul className="acc-feats">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <div className="acc-tech">
                      {p.tech.map((t) => (
                        <span key={t.name} className="chip">
                          <TechLogo name={t.icon} size={15} />
                          {t.name}
                        </span>
                      ))}
                      {p.github && (
                        <a className="btn btn-primary" href={p.github} target="_blank" rel="noopener noreferrer">
                          View on GitHub <span className="arr" aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="acc-ui">
                    <MiniUI kind={p.ui} title={p.title} />
                    <span className="acc-ui-tag">Illustrative UI</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
