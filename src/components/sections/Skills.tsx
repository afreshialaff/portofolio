"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SKILL_GROUPS, TOOLS, TRAINING, PROFILE, sectionIndex, type Skill, type SkillFamily } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { onAnchorClick } from "@/lib/scroll";
import { SectionHead } from "@/components/ui/SectionHead";
import { TechLogo } from "@/components/ui/TechLogo";

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

.sk-sub{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:44px}
.sk-sub h3{font-family:var(--font-mono);font-weight:500;font-size:12px;text-transform:uppercase;color:var(--mute)}
.sk-sub p{font-size:13.5px;color:var(--mute)}
.sk-filter.is-mode{font-weight:600}
.sk-more{margin-top:14px}
.sk-case{display:inline-flex;align-items:center;gap:6px;margin-top:14px;font-size:13.5px;font-weight:500;border-bottom:1px solid var(--ink);padding-bottom:2px}
.sk-panels{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,.7fr);gap:clamp(14px,2vw,24px);margin-top:28px}
.sk-panel{padding:22px;border-radius:24px;background:var(--card);box-shadow:var(--hair)}
.sk-panel h3{font-weight:700;font-size:20px;letter-spacing:-.035em}
.sk-panel h4{margin-top:16px;font-family:var(--font-mono);font-weight:500;font-size:10.5px;text-transform:uppercase;color:var(--mute)}
.sk-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;list-style:none;padding:0}
.sk-tools li{display:inline-flex;align-items:center;gap:7px;min-height:32px;padding:5px 12px;border-radius:999px;background:var(--paper);font-size:13px;color:var(--ink)}
.sk-tools li img,.sk-tools li svg{width:15px;height:15px;flex:none}
.sk-tools li small{color:var(--mute);font-size:11.5px}
.sk-list{list-style:none;margin:10px 0 0;padding:0;display:grid}
.sk-list li{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--line);font-size:14px;line-height:1.35}
.sk-list li span{color:var(--mute);font-size:12.5px;text-align:right;white-space:nowrap}
.sk-list li em{font-style:normal;padding:2px 8px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--ink);font-size:11px;color:var(--ink)}
.no-js .sk-tile{opacity:1;transform:none}
@media (max-width: 1000px){ .sk-panels{grid-template-columns:minmax(0,1fr)} }
}
`;


const FAMILY_SHADE: Record<SkillFamily, number> = {
  Accounting: 1,
  Finance: 0.88,
  Tax: 0.76,
  Payroll: 0.64,
  "Audit & Risk": 0.52,
  "ERP & Process": 0.38,
  Consulting: 0.24,
};

type Flat = Skill & { n: number };
type Mode = "Core" | "All" | SkillFamily;

export default function Skills() {
  const all: Flat[] = useMemo(
    () => SKILL_GROUPS.flatMap((g) => g.skills).map((s, i) => ({ ...s, n: i + 1 })),
    [],
  );
  const core = all.filter((s) => s.core);
  const families = SKILL_GROUPS.map((g) => g.family);
  const [mode, setMode] = useState<Mode>("Core");
  const shown = mode === "Core" ? core : all;
  const [active, setActive] = useState<Flat>(core[0]);
  const gridRef = useRef<HTMLUListElement>(null);
  const inView = useInView(gridRef, { threshold: 0.1 });
  const [cols, setCols] = useState(8);

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

  const chips: Mode[] = ["Core", "All", ...families];

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <style href="skills" precedence="component">
        {css}
      </style>
      <div className="wrap">
        <SectionHead
          index={sectionIndex("skills")}
          label="Skills"
          title="The periodic table of my"
          accent="practice."
          id="skills-title"
        />

        <div className="sk-sub rv">
          <h3>Practical expertise</h3>
          <p>
            {mode === "Core"
              ? `${core.length} core competencies — open the full table for all ${all.length}.`
              : `All ${all.length} competencies, grouped by family.`}
          </p>
        </div>
        <div className="sk-filters rv" role="group" aria-label="Choose which skills to show" style={{ marginTop: 14 }}>
          {chips.map((f) => (
            <button
              key={f}
              type="button"
              className={`sk-filter ${f === "Core" || f === "All" ? "is-mode" : ""}`}
              aria-pressed={mode === f}
              onClick={() => setMode(f)}
            >
              {f === "Core" ? "Core" : f === "All" ? "View all skills" : f}
              <small>
                {f === "Core" ? core.length : f === "All" ? all.length : all.filter((s) => s.family === f).length}
              </small>
            </button>
          ))}
        </div>

        <div className="sk-layout">
          <ul ref={gridRef} className={`sk-grid ${inView ? "is-in" : ""}`} aria-label="Skills">
            {shown.map((s, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              const dim = mode !== "Core" && mode !== "All" && s.family !== mode;
              return (
                <li key={s.name}>
                  <button
                    type="button"
                    className={`sk-tile ${active.name === s.name ? "is-active" : ""} ${dim ? "is-dim" : ""}`}
                    style={{ ["--d" as string]: `${(row + col) * 40}ms`, ["--fo" as string]: FAMILY_SHADE[s.family] }}
                    onMouseEnter={() => setActive(s)}
                    onFocus={() => setActive(s)}
                    onClick={() => setActive(s)}
                    aria-label={`${s.name} — ${s.family}. ${s.applied.join("; ")}`}
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

          <aside className="sk-insp rv" aria-label="Skill details">
            <div className="sk-insp-logo">
              <span className="sk-insp-sym" aria-hidden="true">
                {String(active.n).padStart(2, "0")} · {active.symbol}
              </span>
              <TechLogo key={active.name} name={active.icon} size={120} stroke={0.9} />
            </div>
            <h3>{active.name}</h3>
            <p className="fam">{active.family}</p>
            <h4>Applied in practice</h4>
            <ul>
              {active.applied.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
            {active.caseId && (
              <a href="#cases" className="sk-case" onClick={onAnchorClick}>
                See the related case <span aria-hidden="true">→</span>
              </a>
            )}
          </aside>
        </div>

        <div className="sk-panels">
          <div className="sk-panel rv">
            <h3>Software &amp; tools</h3>
            <h4>Daily use</h4>
            <ul className="sk-tools">
              {TOOLS.daily.map((t) => (
                <li key={t.name}>
                  <TechLogo name={t.icon} size={15} />
                  {t.name}
                </li>
              ))}
            </ul>
            <h4>Familiar with</h4>
            <ul className="sk-tools">
              {TOOLS.exposure.map((t) => (
                <li key={t.name}>
                  <TechLogo name={t.icon} size={15} />
                  {t.name}
                  {t.note && <small>· {t.note}</small>}
                </li>
              ))}
            </ul>
          </div>
          <div className="sk-panel rv" style={{ ["--i" as string]: 1 }}>
            <h3>Training &amp; development</h3>
            <ul className="sk-list">
              {TRAINING.map((t) => (
                <li key={t.title}>
                  {t.title}
                  {t.status ? <em>{t.status}</em> : <span>{t.issuer}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="sk-panel rv" style={{ ["--i" as string]: 2 }}>
            <h3>Languages</h3>
            <ul className="sk-list">
              {PROFILE.languages.map((l) => (
                <li key={l.name}>
                  {l.name}
                  <span>{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
