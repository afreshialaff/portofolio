"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SKILL_GROUPS, type Skill, type SkillFamily } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { SectionHead } from "@/components/ui/SectionHead";
import { TechLogo, brandColor, isBrand } from "@/components/ui/TechLogo";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.sk-filters{display:flex;flex-wrap:wrap;gap:8px;margin-top:36px}
.sk-filter{height:36px;padding:0 15px;border-radius:999px;font-size:13.5px;font-weight:500;color:var(--ink-2);box-shadow:inset 0 0 0 1px rgba(13,13,13,.14);
  transition:background-color .45s var(--ease),color .45s var(--ease),box-shadow .45s var(--ease)}
.sk-filter:hover{box-shadow:inset 0 0 0 1px var(--ink);color:var(--ink)}
.sk-filter[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:inset 0 0 0 1px var(--ink)}
.sk-filter small{font-family:var(--font-mono);font-size:10.5px;opacity:.6;margin-left:6px}

.sk-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(20px,2.5vw,36px);align-items:start;margin-top:28px}
.sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;list-style:none;margin:0;padding:0}
.sk-tile{position:relative;width:100%;aspect-ratio:1/1.12;display:flex;flex-direction:column;justify-content:space-between;text-align:left;
  padding:9px 10px 9px;border-radius:14px;background:var(--card);box-shadow:var(--hair);overflow:hidden;
  opacity:0;transform:translateY(14px) scale(.94);
  transition:opacity .7s var(--ease),transform .8s var(--ease),box-shadow .45s var(--ease),background-color .45s var(--ease),color .45s var(--ease),filter .5s var(--ease);
  transition-delay:var(--d,0ms)}
.sk-grid.is-in .sk-tile{opacity:1;transform:none}
.sk-tile:hover,.sk-tile.is-active{transform:translateY(-3px);box-shadow:var(--hair),0 16px 30px -18px rgba(13,13,13,.45);transition-delay:0ms}
.sk-tile.is-active{background:var(--ink);color:#fff}
.sk-tile.is-active .sk-num,.sk-tile.is-active .sk-fam{color:rgba(255,255,255,.6)}
.sk-grid.is-in .sk-tile.is-dim{opacity:.22;filter:grayscale(1);transform:scale(.97)}
.sk-num{font-family:var(--font-mono);font-size:10px;color:var(--mute);display:flex;justify-content:space-between}
.sk-num i{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:var(--fo,.5)}
.sk-sym{font-weight:700;font-size:clamp(20px,2.1vw,30px);letter-spacing:-.05em;line-height:1}
.sk-name{font-size:11px;line-height:1.2;font-weight:500;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.4em}
.sk-fam{font-family:var(--font-mono);font-size:9px;text-transform:uppercase;color:var(--faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.sk-insp{position:sticky;top:104px;padding:22px;border-radius:26px;background:var(--card);box-shadow:var(--hair),var(--shadow-soft)}
.sk-insp-logo{position:relative;height:190px;display:grid;place-items:center;border-radius:18px;background:var(--paper);overflow:hidden;color:var(--ink)}
.sk-insp-logo::before{content:"";position:absolute;width:200px;height:200px;border-radius:50%;background:radial-gradient(closest-side,var(--glow,rgba(13,13,13,.10)),transparent);filter:blur(10px)}
.sk-insp-logo > *{position:relative;animation:pop .7s var(--ease) both}
@keyframes pop{0%{opacity:0;transform:scale(.6) rotate(-8deg)}60%{opacity:1;transform:scale(1.06)}100%{transform:none}}
.sk-insp-sym{position:absolute;right:14px;top:12px;font-family:var(--font-mono);font-size:11px;color:var(--mute)}
.sk-insp h3{margin-top:18px;font-weight:700;font-size:24px;letter-spacing:-.04em;line-height:1.1}
.sk-insp .fam{margin-top:6px;font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--mute)}
.sk-insp h4{margin-top:18px;font-family:var(--font-mono);font-weight:500;font-size:10.5px;text-transform:uppercase;color:var(--mute)}
.sk-insp ul{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:6px}
.sk-insp li{font-size:13.5px;line-height:1.4;padding:8px 12px;border-radius:12px;background:var(--paper);color:var(--ink-2)}
.sk-legend{margin-top:16px;font-size:12px;color:var(--mute)}

@media (max-width: 1100px){ .sk-layout{grid-template-columns:minmax(0,1fr) 280px} .sk-grid{grid-template-columns:repeat(6,minmax(0,1fr))} }
@media (max-width: 860px){
  .sk-layout{grid-template-columns:minmax(0,1fr)}
  .sk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
  .sk-insp{position:relative;top:0}
  .sk-insp-logo{height:170px}
}
@media (max-width: 420px){ .sk-sym{font-size:22px} .sk-fam{display:none} .sk-name{font-size:10.5px} }
}
`;

const FAMILY_SHADE: Record<SkillFamily, number> = {
  Accounting: 1,
  Finance: 0.9,
  Tax: 0.8,
  Payroll: 0.68,
  "Audit & Risk": 0.58,
  Systems: 0.46,
  "AI & Data": 0.36,
  Advisory: 0.26,
  Languages: 0.16,
};

type Flat = Skill & { n: number };

export default function Skills() {
  const all: Flat[] = useMemo(
    () => SKILL_GROUPS.flatMap((g) => g.skills).map((s, i) => ({ ...s, n: i + 1 })),
    [],
  );
  const families = SKILL_GROUPS.map((g) => g.family);
  const [filter, setFilter] = useState<SkillFamily | "All">("All");
  const [active, setActive] = useState<Flat>(all[0]);
  const gridRef = useRef<HTMLUListElement>(null);
  const inView = useInView(gridRef, { threshold: 0.15 });
  const [cols, setCols] = useState(8);

  // keep the diagonal wave in step with the responsive column count
  useEffect(() => {
    const measure = () => {
      const el = gridRef.current;
      if (!el) return;
      const n = getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length;
      if (n) setCols(n);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const glow = brandColor(active.icon);

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <style href="skills" precedence="component">
        {css}
      </style>
      <div className="wrap">
        <SectionHead index="02" label="Skills" title="The periodic table of my" accent="stack." id="skills-title" />

        <div className="sk-filters rv" role="group" aria-label="Filter skills by family">
          {(["All", ...families] as const).map((f) => (
            <button
              key={f}
              type="button"
              className="sk-filter"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
              <small>
                {f === "All" ? all.length : all.filter((s) => s.family === f).length}
              </small>
            </button>
          ))}
        </div>

        <div className="sk-layout">
          <ul ref={gridRef} className={`sk-grid ${inView ? "is-in" : ""}`} aria-label="Skills">
            {all.map((s, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              const dim = filter !== "All" && s.family !== filter;
              return (
                <li key={s.name}>
                  <button
                    type="button"
                    className={`sk-tile ${active.name === s.name ? "is-active" : ""} ${dim ? "is-dim" : ""}`}
                    style={{ ["--d" as string]: `${(row + col) * 40}ms`, ["--fo" as string]: FAMILY_SHADE[s.family] }}
                    onMouseEnter={() => setActive(s)}
                    onFocus={() => setActive(s)}
                    onClick={() => setActive(s)}
                    aria-label={`${s.name} — ${s.family}. ${s.usedIn.join("; ")}`}
                  >
                    <span className="sk-num" aria-hidden="true">
                      {String(s.n).padStart(2, "0")}
                      <i />
                    </span>
                    <span className="sk-sym" aria-hidden="true">
                      {s.symbol}
                    </span>
                    <span aria-hidden="true">
                      <span className="sk-name">{s.name}</span>
                      <span className="sk-fam">{s.family}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="sk-insp rv" id="sk-inspector" aria-label="Skill details">
            <div
              className="sk-insp-logo"
              style={glow ? { ["--glow" as string]: `${glow}33` } : undefined}
            >
              <span className="sk-insp-sym" aria-hidden="true">
                {String(active.n).padStart(2, "0")} · {active.symbol}
              </span>
              <TechLogo
                key={active.name}
                name={active.icon}
                size={isBrand(active.icon) ? 150 : 120}
                stroke={isBrand(active.icon) ? undefined : 0.9}
              />
            </div>
            <h3>{active.name}</h3>
            <p className="fam">{active.family}</p>
            <h4>{active.family === "Languages" ? "Proficiency" : "Where it shows up"}</h4>
            <ul>
              {active.usedIn.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
            <p className="sk-legend">Hover, focus or tap a tile.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
