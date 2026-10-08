"use client";

import { useEffect, useRef } from "react";
import { TIMELINE, sectionIndex } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { onAnchorClick } from "@/lib/scroll";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.tl{--when:clamp(150px,20vw,260px);--gap:clamp(36px,4vw,64px);position:relative;margin-top:64px;padding-bottom:8px}
.tl-spine{position:absolute;left:calc(var(--when) + var(--gap) / 2);top:8px;bottom:0;width:2px;margin-left:-1px;background:var(--soft);border-radius:2px;overflow:hidden}
.tl-spine i{position:absolute;inset:0;background:var(--ink);transform-origin:50% 0;transform:scaleY(0);will-change:transform}
.tl-list{list-style:none;margin:0;padding:0;display:grid;gap:clamp(14px,2vw,22px)}
.tl-stop{position:relative;display:grid;grid-template-columns:var(--when) minmax(0,1fr);gap:0 var(--gap);align-items:start}
.tl-when{padding-top:20px;text-align:right;font-family:var(--font-mono);font-size:12.5px;line-height:1.5;color:var(--faint);text-transform:uppercase;
  transition:color .6s var(--ease)}
.tl-when b{display:block;font-family:var(--font-sans);font-weight:700;font-size:clamp(26px,2.6vw,40px);letter-spacing:-.05em;line-height:1;color:var(--faint);
  text-transform:none;transition:color .6s var(--ease)}
.tl-stop.is-lit .tl-when{color:var(--mute)}
.tl-stop.is-lit .tl-when b{color:var(--ink)}
.tl-dot{position:absolute;left:calc(var(--when) + var(--gap) / 2);top:26px;width:15px;height:15px;margin-left:-7.5px;border-radius:50%;background:var(--paper);
  box-shadow:inset 0 0 0 2px var(--faint);transition:box-shadow .6s var(--ease),background-color .6s var(--ease),transform .6s var(--ease)}
.tl-stop.is-lit .tl-dot{background:var(--ink);box-shadow:0 0 0 6px rgba(13,13,13,.08);transform:scale(1.1)}
.tl-card{max-width:780px;padding:20px 22px;border-radius:22px;background:var(--card);box-shadow:var(--hair);opacity:.55;transform:translateX(12px);
  transition:opacity .8s var(--ease),transform .8s var(--ease),box-shadow .6s var(--ease)}
.tl-stop.is-lit .tl-card{opacity:1;transform:none}
.tl-card:hover{box-shadow:var(--hair),var(--shadow-soft)}
.tl-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.tl-kind{flex:none;margin-top:3px;padding:3px 8px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font-family:var(--font-mono);font-size:10px;text-transform:uppercase;color:var(--mute)}
.tl-kind.edu{background:var(--ink);color:#fff;box-shadow:none}
.tl-card h3{font-weight:700;font-size:clamp(18px,1.6vw,22px);letter-spacing:-.035em;line-height:1.15}
.tl-place{margin-top:4px;font-size:14.5px;font-weight:500;color:var(--ink-2)}
.tl-place span{color:var(--mute);font-weight:400}
.tl-detail{margin-top:10px;font-size:14px;line-height:1.55;color:var(--mute)}
.tl-items{list-style:none;margin:12px 0 0;padding:0;display:grid}
.tl-items li{display:grid;gap:2px;padding:8px 0;border-top:1px dashed var(--line);font-size:13.5px}
.tl-items b{font-weight:500}
.tl-items span{color:var(--mute);font-size:12.5px}
.no-js .tl-card{opacity:1;transform:none}
.tl-next{display:block;position:relative;margin:0 0 clamp(20px,3vw,32px) calc(var(--when) + var(--gap));max-width:480px;padding:28px 26px;border-radius:24px;
  border:1.5px dashed rgba(13,13,13,.25);background:transparent;transition:border-color .5s var(--ease),background-color .5s var(--ease)}
.tl-next:hover{border-color:var(--ink);background:var(--card)}
.tl-next small{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--mute)}
.tl-next p{margin-top:8px;font-weight:700;font-size:clamp(26px,3vw,38px);letter-spacing:-.045em;line-height:1}
.tl-next p em{font-family:var(--font-serif);font-weight:400;color:var(--mute)}
@media (max-width: 720px){
  .tl{--when:0px;--gap:34px}
  .tl-spine,.tl-dot{left:8px}
  .tl-dot{top:4px}
  .tl-stop{grid-template-columns:minmax(0,1fr);padding-left:34px}
  .tl-when{padding-top:0;text-align:left;margin-bottom:8px;display:flex;align-items:baseline;gap:10px}
  .tl-when b{font-size:24px}
  .tl-next{margin-left:34px}
}
}
`;

export default function Experience() {
  const tlRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLElement>(null);

  /* draw the spine with scroll progress and light each stop as it is reached */
  useEffect(() => {
    const tl = tlRef.current;
    const fill = fillRef.current;
    if (!tl || !fill) return;
    const stops = Array.from(tl.querySelectorAll<HTMLElement>(".tl-stop"));
    let offsets: number[] = [];
    let raf = 0;
    const measure = () => {
      const top = tl.getBoundingClientRect().top + window.scrollY;
      offsets = stops.map((s) => {
        const dot = s.querySelector<HTMLElement>(".tl-dot");
        return (dot ? dot.getBoundingClientRect().top + window.scrollY : s.getBoundingClientRect().top + window.scrollY) - top + 7;
      });
    };
    const tick = () => {
      raf = 0;
      const rect = tl.getBoundingClientRect();
      const line = window.innerHeight * 0.62;
      const px = Math.max(0, Math.min(rect.height, line - rect.top));
      fill.style.transform = `scaleY(${rect.height ? px / rect.height : 0})`;
      stops.forEach((s, i) => s.classList.toggle("is-lit", px >= offsets[i]));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(tl);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="experience" className="section" aria-labelledby="exp-title">
      <style href="experience" precedence="component">
        {css}
      </style>
      <div className="wrap">
        <SectionHead index={sectionIndex("experience")} label="Experience" title="Latest work first, one" accent="path." id="exp-title" />

        <div className="tl" ref={tlRef}>
          <a href="#contact" className="tl-next" onClick={onAnchorClick}>
            <small>Next —</small>
            <p>
              Your <em>team?</em>
            </p>
          </a>
          <div className="tl-spine" aria-hidden="true">
            <i ref={fillRef} />
          </div>
          <ol className="tl-list">
            {TIMELINE.map((s) => (
              <li key={s.start + s.title} className="tl-stop">
                <p className="tl-when">
                  <b>{s.start.slice(0, 4)}</b>
                  <span>{s.period}</span>
                </p>
                <span className="tl-dot" aria-hidden="true" />
                <div className="tl-card">
                  <div className="tl-top">
                    <h3>{s.title}</h3>
                    <span className={`tl-kind ${s.kind === "education" ? "edu" : ""}`}>
                      {s.badge ?? (s.kind === "education" ? "Education" : s.kind === "earlier" ? "Summary" : "Experience")}
                    </span>
                  </div>
                  <p className="tl-place">
                    {s.place}
                    {s.location && <span> · {s.location}</span>}
                  </p>
                  {s.detail && <p className="tl-detail">{s.detail}</p>}
                  {s.items && (
                    <ul className="tl-items">
                      {s.items.map((it) => (
                        <li key={it.title}>
                          <b>{it.title}</b>
                          <span>
                            {it.place} · {it.period}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
