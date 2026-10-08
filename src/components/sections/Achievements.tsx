"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENTS, sectionIndex, type Achievement } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { TechLogo } from "@/components/ui/TechLogo";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.ach{position:relative}
.ach-pin{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:clamp(24px,5vh,48px)}
.ach-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.ach-prog{width:min(260px,40vw);height:2px;background:var(--soft);border-radius:2px;overflow:hidden}
.ach-prog i{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
.ach-meta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:var(--font-mono);font-size:11px;color:var(--mute);text-transform:uppercase}
.ach-track{display:flex;gap:clamp(14px,1.6vw,22px);padding:16px var(--gutter) 28px;width:max-content;will-change:transform}
.ach-card{position:relative;flex:none;width:clamp(300px,40vw,540px);height:clamp(260px,36vh,310px);border-radius:28px;background:var(--card);
  box-shadow:var(--hair);padding:clamp(20px,2vw,26px);display:flex;flex-direction:column;justify-content:space-between;
  transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
.ach-card.is-focus{transform:translateY(-12px);box-shadow:var(--hair),var(--shadow-deep)}
.ach-top{display:flex;justify-content:space-between;align-items:flex-start}
.ach-logo{position:relative;width:72px;height:72px;border-radius:20px;display:grid;place-items:center;background:var(--paper);box-shadow:var(--hair);color:var(--ink)}
.ach-logo::before{content:"";position:absolute;inset:-14px;z-index:-1;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.10),transparent);
  opacity:.5;transition:opacity .8s var(--ease),transform .8s var(--ease)}
.ach-card.is-focus .ach-logo::before{opacity:1;transform:scale(1.25)}
.ach-logo{isolation:isolate}
.ach-idx{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.ach-bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.ach-text{flex:1;min-width:0}
.ach-label{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--mute)}
.ach-cap{margin-top:6px;font-weight:700;font-size:clamp(17px,1.5vw,21px);letter-spacing:-.03em;line-height:1.15}
.ach-detail{margin-top:6px;font-size:12.5px;line-height:1.45;color:var(--mute)}
.ach-num{flex:none;font-weight:700;font-size:clamp(64px,7.4vw,118px);line-height:.82;letter-spacing:-.06em;font-variant-numeric:tabular-nums;white-space:nowrap}
.ach-num.long{font-size:clamp(48px,4.8vw,80px)}
.ach-num small{font-size:.36em;letter-spacing:-.03em;color:var(--mute);font-weight:600;margin-left:2px}
.ach-num .pre{font-size:.5em;color:var(--mute);margin-right:2px;vertical-align:.45em}
.ach-end{flex:none;align-self:center;padding:0 clamp(24px,5vw,80px);font-family:var(--font-serif);font-style:italic;font-size:clamp(34px,4vw,60px);color:var(--mute);white-space:nowrap}
@media (max-width: 640px){
  .ach-card{width:min(86vw,360px);height:300px}
  .ach-num{font-size:60px}
  .ach-num.long{font-size:44px}
}
}
`;

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

function format(a: Achievement, v: number) {
  if (a.display) return a.display;
  return v.toLocaleString("en-US", {
    minimumFractionDigits: a.decimals ?? 0,
    maximumFractionDigits: a.decimals ?? 0,
  });
}

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLElement>(null);

  /* pinned horizontal scroll + focus card */
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".ach-card"));
    let travel = 0;
    let raf = 0;
    let focused = -1;

    const measure = () => {
      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `calc(100svh + ${travel}px)`;
    };
    const tick = () => {
      raf = 0;
      const top = section.getBoundingClientRect().top;
      const p = travel > 0 ? Math.min(1, Math.max(0, -top / travel)) : 0;
      track.style.transform = `translate3d(${(-p * travel).toFixed(1)}px,0,0)`;
      if (progRef.current) progRef.current.style.transform = `scaleX(${p})`;
      // card nearest the viewport centre lifts
      const cx = window.innerWidth / 2;
      let best = 0;
      let bestD = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - cx);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      if (best !== focused) {
        cards[focused]?.classList.remove("is-focus");
        cards[best]?.classList.add("is-focus");
        focused = best;
      }
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
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* count up once per card (easeOutQuart, 1.4 s) — the first time it slides into view */
  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    const nums = Array.from(track.querySelectorAll<HTMLElement>("[data-count]"));
    const done = new Set<number>();
    const reduced = prefersReducedMotion();
    const set = (i: number, k: number) => {
      const a = ACHIEVEMENTS[i];
      const out = nums[i]?.querySelector<HTMLElement>(".v");
      if (a && out && a.value !== undefined) out.textContent = format(a, a.value * k);
    };
    const run = (i: number, animate: boolean) => {
      done.add(i);
      if (!animate || reduced) return set(i, 1);
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        set(i, easeOutQuart(k));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    // Values are rendered final on the server so they read without JS/animation;
    // reset to 0 only right before the count-up can run.
    ACHIEVEMENTS.forEach((a, i) => {
      if (a.value === undefined || reduced) done.add(i);
      else set(i, 0);
    });
    let raf = 0;
    const check = () => {
      raf = 0;
      const sr = section.getBoundingClientRect();
      if (sr.top > window.innerHeight * 0.6 || sr.bottom < 0) return;
      nums.forEach((n, i) => {
        if (done.has(i)) return;
        const r = n.getBoundingClientRect();
        if (r.right <= 0) run(i, false); // skipped past without being seen
        else if (r.left < window.innerWidth * 0.92 && r.top < window.innerHeight * 0.9) run(i, true);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const total = String(ACHIEVEMENTS.length).padStart(2, "0");

  return (
    <section id="achievements" ref={sectionRef} className="ach" aria-labelledby="ach-title">
      <style href="achievements" precedence="component">
        {css}
      </style>
      <div className="ach-pin">
        <div className="wrap ach-head">
          <div>
            <p className="tag rv">
              <b>{sectionIndex("achievements")}</b> — Achievements
            </p>
            <h2 className="h2 rv-mask" id="ach-title" style={{ marginTop: 18 }}>
              <span>
                Numbers worth <em>counting.</em>
              </span>
            </h2>
          </div>
          <div className="ach-meta" aria-hidden="true">
            <span>Scroll to browse</span>
            <span className="ach-prog">
              <i ref={progRef} />
            </span>
          </div>
        </div>

        <div className="ach-track" ref={trackRef}>
          {ACHIEVEMENTS.map((a, i) => (
            <article key={a.caption} className="ach-card" aria-label={`${a.label}: ${a.prefix ?? ""}${format(a, a.value ?? 0)}${a.suffix ?? ""} — ${a.caption}. ${a.detail}`}>
              <div className="ach-top" aria-hidden="true">
                <span className="ach-logo">
                  <TechLogo name={a.icon} size={30} stroke={1.3} />
                </span>
                <span className="ach-idx">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
              </div>
              <div className="ach-bottom" aria-hidden="true">
                <div className="ach-text">
                  <p className="ach-label">{a.label}</p>
                  <p className="ach-cap">{a.caption}</p>
                  <p className="ach-detail">{a.detail}</p>
                </div>
                <p className={`ach-num ${format(a, a.value ?? 0).length > 3 ? "long" : ""}`} data-count={i}>
                  {a.prefix && <span className="pre">{a.prefix}</span>}
                  <span className="v">{format(a, a.value ?? 0)}</span>
                  {a.suffix && <small>{a.suffix}</small>}
                </p>
              </div>
            </article>
          ))}
          <p className="ach-end" aria-hidden="true">
            and counting →
          </p>
        </div>
      </div>
    </section>
  );
}
