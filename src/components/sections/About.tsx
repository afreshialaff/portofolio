"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PROFILE, sectionIndex } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.about{overflow:hidden}
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,3vw,56px);align-items:stretch}
.about-col{display:flex;flex-direction:column;justify-content:space-between;gap:32px;min-width:0}
.about-text p.lede + p.lede{margin-top:16px}
.about-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.about-more{margin-top:18px;font-size:14px;color:var(--mute)}
.about-more summary{cursor:pointer;width:fit-content;font-family:var(--font-mono);font-size:12px;text-transform:uppercase;list-style:none;
  border-bottom:1px solid currentColor;padding-bottom:2px;transition:color .4s var(--ease)}
.about-more summary::-webkit-details-marker{display:none}
.about-more summary:hover{color:var(--ink)}
.about-more[open] summary{margin-bottom:14px}
.about-more p{color:var(--ink-2);font-size:15px;line-height:1.6;max-width:60ch}
.about-more p + p{margin-top:10px}

/* ---- lanyard */
.lanyard{position:relative;display:flex;justify-content:center;min-height:640px;margin-top:calc(-1 * var(--section-y))}
.swing{position:relative;display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;will-change:transform}
.strap{position:relative;width:30px;height:calc(var(--section-y) + 56px);overflow:hidden;
  background:linear-gradient(90deg,#1b1b1b,#2a2a2a 45%,#1b1b1b);box-shadow:inset 0 0 0 1px rgba(255,255,255,.05)}
.strap::before,.strap::after{content:"";position:absolute;top:0;bottom:0;width:1px;background:rgba(255,255,255,.14)}
.strap::before{left:3px}.strap::after{right:3px}
.strap-text{position:absolute;left:0;top:0;width:100%;display:flex;flex-direction:column;align-items:center;animation:strap 18s linear infinite}
.strap-text span{writing-mode:vertical-rl;transform:rotate(180deg);font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(255,255,255,.72);white-space:nowrap;padding:12px 0}
@keyframes strap{to{transform:translateY(-50%)}}
.clip{position:relative;width:46px;height:44px;margin-top:-2px;z-index:2}
.clip .loop{position:absolute;left:50%;top:0;width:26px;height:22px;transform:translateX(-50%);border-radius:6px 6px 3px 3px;
  background:linear-gradient(180deg,#d9d7d2,#9c9a95 55%,#e6e4df);box-shadow:inset 0 1px 0 #fff,0 2px 4px rgba(0,0,0,.25)}
.clip .loop::after{content:"";position:absolute;inset:5px 6px;border-radius:3px;background:#2a2a2a}
.clip .jaw{position:absolute;left:50%;top:18px;width:16px;height:26px;transform:translateX(-50%);border-radius:3px 3px 8px 8px;
  background:linear-gradient(90deg,#8e8c87,#efede8 45%,#a3a19c);box-shadow:0 3px 6px rgba(0,0,0,.25)}

/* ---- card + flip */
.idcard{position:relative;width:300px;height:404px;margin-top:-10px;perspective:1400px;cursor:pointer;border-radius:22px;-webkit-tap-highlight-color:transparent}
.idcard:focus-visible{outline-offset:8px;border-radius:24px}
.idcard-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s var(--ease)}
.idcard.is-flipped .idcard-inner{transform:rotateY(180deg)}
.face{position:absolute;inset:0;border-radius:22px;background:var(--card);overflow:hidden;
  -webkit-backface-visibility:hidden;backface-visibility:hidden;
  box-shadow:inset 0 0 0 1px var(--line),0 2px 4px rgba(13,13,13,.05),0 40px 70px -30px rgba(13,13,13,.4)}
.face-back{transform:rotateY(180deg)}
.slot{position:absolute;left:50%;top:12px;width:44px;height:8px;margin-left:-22px;border-radius:6px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.35);z-index:2}
.band{height:54px;background:var(--ink);color:#fff;display:flex;align-items:flex-end;justify-content:space-between;padding:0 20px 12px;
  font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase}
.band b{font-weight:600}
.band span{color:rgba(255,255,255,.55);letter-spacing:.08em}
.photo{position:relative;width:128px;height:156px;margin:14px auto 0;padding:3px;border-radius:16px;
  background:linear-gradient(145deg,#d6d3cd,#8f8c86 50%,#e8e6e1)}
.photo::before{content:"";position:absolute;inset:-18px;z-index:-1;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.12),transparent);filter:blur(6px)}
.photo-in{position:relative;width:100%;height:100%;border-radius:13px;overflow:hidden;background:#f3f2ef}
.photo-in img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
.idcard:hover .photo-in img,.idcard:focus-visible .photo-in img{transform:scale(1.07)}
.id-name{margin-top:11px;text-align:center;font-weight:700;font-size:18px;letter-spacing:-.035em;line-height:1.1;padding:0 16px}
.id-role{margin-top:3px;text-align:center;font-size:12px;color:var(--mute)}
.id-rows{margin:9px 20px 0;display:grid;gap:3px;font-size:11px}
.id-rows div{display:flex;justify-content:space-between;gap:12px;border-top:1px dashed var(--line);padding-top:4px}
.id-rows dt{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;color:var(--mute);letter-spacing:.06em}
.id-rows dd{margin:0;font-weight:500;text-align:right}
.id-foot{position:absolute;left:20px;right:20px;bottom:14px;display:flex;align-items:flex-end;justify-content:space-between}
.barcode{width:150px;height:20px;background:repeating-linear-gradient(90deg,#0d0d0d 0 2px,transparent 2px 4px,#0d0d0d 4px 5px,transparent 5px 8px,#0d0d0d 8px 11px,transparent 11px 12px,#3a3a3a 12px 13px,transparent 13px 16px)}
.holo{position:relative;width:28px;height:28px;border-radius:50%;overflow:hidden;
  background:conic-gradient(from 0deg,#f4f4f2,#bdbbb6,#ffffff,#9e9c97,#e6e4df,#c9c7c2,#f4f4f2);box-shadow:inset 0 0 0 1px rgba(13,13,13,.12)}
.holo::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.9) 50%,transparent 65%);
  transform:translateX(-100%);animation:holo 3.4s var(--ease) infinite}
@keyframes holo{55%,100%{transform:translateX(100%)}}

.back{padding:22px 22px 18px;height:100%;display:flex;flex-direction:column}
.back h3{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--mute);font-weight:500}
.back ul{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px}
.back li{position:relative;padding-left:16px;font-size:13px;line-height:1.4;color:var(--ink-2)}
.back li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:6px;border-radius:50%;background:var(--ink)}
.sig{margin-top:auto;padding-top:14px}
.sig .line{font-family:var(--font-serif);font-style:italic;font-size:30px;line-height:1;letter-spacing:-.01em;border-bottom:1px solid var(--ink);padding-bottom:6px}
.sig small{display:block;margin-top:8px;font-family:var(--font-mono);font-size:10px;color:var(--mute);letter-spacing:.02em}
.flip-hint{margin-top:22px;text-align:center;font-family:var(--font-mono);font-size:11px;color:var(--mute);text-transform:uppercase}

/* ---- facts */
.facts h3{font-family:var(--font-mono);font-size:12px;font-weight:500;text-transform:uppercase;color:var(--mute);margin-bottom:6px}
.facts dl{margin:0}
.facts dl > div{display:grid;grid-template-columns:110px minmax(0,1fr);gap:16px;padding:16px 0;border-bottom:1px solid var(--line)}
.facts dt{font-family:var(--font-mono);font-size:11.5px;text-transform:uppercase;color:var(--mute);padding-top:2px}
.facts dd{margin:0;font-size:15px;font-weight:500;letter-spacing:-.01em;overflow-wrap:anywhere}
.facts dd span{display:block;font-weight:400;color:var(--mute);font-size:13.5px}
.facts dd .role{color:var(--ink);font-size:15px;margin-bottom:8px}
.facts dd .role b{font-weight:500}
.facts a{border-bottom:1px solid var(--line);transition:border-color .4s var(--ease)}
.facts a:hover{border-color:var(--ink)}
.quote{margin:0;font-family:var(--font-serif);font-style:italic;font-size:clamp(26px,2.3vw,36px);line-height:1.12;letter-spacing:-.01em}
.quote::before{content:"“";display:block;font-size:2.2em;line-height:.6;color:var(--faint)}

@media (max-width: 1080px){
  .about-grid{grid-template-columns:minmax(0,1fr) 320px}
  .about-text{grid-column:1}
  .lanyard{grid-column:2;grid-row:1 / span 2}
  .facts{grid-column:1}
}
@media (max-width: 720px){
  .about-grid{grid-template-columns:minmax(0,1fr)}
  .about-text,.facts,.lanyard{grid-column:1;grid-row:auto}
  .lanyard{margin-top:0;min-height:540px}
  .strap{height:72px}
}
}
`;

export default function About() {
  const swingRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastPointer = useRef<string>("mouse");

  /* damped pendulum: pointer velocity → angular impulse, spring back, idle sway */
  useEffect(() => {
    const swing = swingRef.current;
    const zone = zoneRef.current;
    if (!swing || !zone || prefersReducedMotion()) return;

    let angle = 0; // deg
    let vel = 0; // deg / frame
    let lastX: number | null = null;
    let lastT = 0;
    let lastInput = performance.now();
    let raf = 0;
    let running = false;
    const K = 0.045; // spring
    const DAMP = 0.94; // damping per frame
    const MAX = 14;

    const frame = (t: number) => {
      const idle = t - lastInput > 1400;
      const target = idle ? Math.sin(t / 1300) * 1.6 : 0;
      vel += (target - angle) * K;
      vel *= DAMP;
      angle = Math.max(-MAX, Math.min(MAX, angle + vel));
      swing.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      raf = running ? requestAnimationFrame(frame) : 0;
    };
    const startLoop = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null) {
        const dt = Math.max(8, now - lastT);
        const vx = (e.clientX - lastX) / dt; // px per ms
        vel += Math.max(-2.4, Math.min(2.4, vx * 0.9));
      }
      lastX = e.clientX;
      lastT = now;
      lastInput = now;
    };
    const onLeave = () => {
      lastX = null;
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()), {
      threshold: 0,
    });
    io.observe(zone);
    zone.addEventListener("pointermove", onMove);
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      stopLoop();
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const strapText = `${PROFILE.name} · ${PROFILE.credential} · ${PROFILE.roleShort} · `;
  const [firstPara, secondPara] = [PROFILE.resumeSummary[0], PROFILE.aboutPractice];

  return (
    <section id="about" className="section about" aria-labelledby="about-title" ref={zoneRef}>
      <style href="about" precedence="component">
        {css}
      </style>
      <div className="wrap about-grid">
        {/* left */}
        <div className="about-col about-text">
          <div>
            <p className="tag rv">
              <b>{sectionIndex("about")}</b> — About
            </p>
            <h2 className="h2 rv-mask" id="about-title" style={{ marginTop: 18 }}>
              <span>
                Hi, I&rsquo;m <em>{PROFILE.firstName}.</em>
              </span>
            </h2>
            <p className="lede rv" style={{ marginTop: 28, ["--i" as string]: 1 }}>
              {firstPara}
            </p>
            <p className="lede rv" style={{ ["--i" as string]: 2, marginTop: 16 }}>
              {secondPara}
            </p>
            <details className="about-more rv" style={{ ["--i" as string]: 3 }}>
              <summary>Read the full summary</summary>
              {PROFILE.resumeSummary.slice(1).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </details>
          </div>
          <div className="about-btns rv" style={{ ["--i" as string]: 4 }}>
            <a href={PROFILE.resume} className="btn btn-primary" download>
              Résumé <span className="arr arr-down" aria-hidden="true">↓</span>
            </a>
            {PROFILE.github && (
              <a href={PROFILE.github} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                GitHub <span className="arr" aria-hidden="true">↗</span>
              </a>
            )}
            <a href={PROFILE.linkedin} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
              LinkedIn <span className="arr" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* centre — lanyard ID card */}
        <div className="lanyard">
          <div className="swing" ref={swingRef}>
            <div className="strap" aria-hidden="true">
              <div className="strap-text">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i}>{strapText}</span>
                ))}
              </div>
            </div>
            <div className="clip" aria-hidden="true">
              <span className="loop" />
              <span className="jaw" />
            </div>
            <div
              className={`idcard ${flipped ? "is-flipped" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={`ID card for ${PROFILE.name}. Press to flip and read the back.`}
              onPointerDown={(e) => {
                lastPointer.current = e.pointerType;
              }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
              onClick={() => {
                // touch / pen: tap toggles (mouse already flips on hover)
                if (lastPointer.current !== "mouse") setFlipped((f) => !f);
                lastPointer.current = "mouse";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
            >
              <div className="idcard-inner">
                {/* front */}
                <div className="face face-front" aria-hidden={flipped}>
                  <span className="slot" aria-hidden="true" />
                  <div className="band">
                    <b>Accountant ID</b>
                    <span>{PROFILE.initials}</span>
                  </div>
                  <div className="photo">
                    <div className="photo-in">
                      <Image
                        src="/portrait-bust.webp"
                        alt={`Portrait of ${PROFILE.name}`}
                        width={240}
                        height={300}
                        sizes="128px"
                      />
                    </div>
                  </div>
                  <p className="id-name">{PROFILE.name}</p>
                  <p className="id-role">
                    {PROFILE.company}
                  </p>
                  <dl className="id-rows">
                    <div>
                      <dt>Cert.</dt>
                      <dd>Chartered Accountant (IAI)</dd>
                    </div>
                    <div>
                      <dt>Roles</dt>
                      <dd>Sr. Associate · Asst. Manager</dd>
                    </div>
                    <div>
                      <dt>Class of</dt>
                      <dd>{PROFILE.graduationYear}</dd>
                    </div>
                  </dl>
                  <div className="id-foot" aria-hidden="true">
                    <span className="barcode" />
                    <span className="holo" />
                  </div>
                </div>
                {/* back */}
                <div className="face face-back" aria-hidden={!flipped}>
                  <div className="back">
                    <span className="slot" aria-hidden="true" />
                    <h3 style={{ marginTop: 18 }}>What I am</h3>
                    <ul>
                      {PROFILE.idCardFacts.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <div className="sig">
                      <p className="line">{PROFILE.name.split(" ").slice(0, 2).join(" ")}</p>
                      <small>If found, say hello · {PROFILE.email}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="flip-hint" aria-hidden="true">
              Hover or tap to flip
            </p>
          </div>
        </div>

        {/* right — quick facts */}
        <div className="about-col facts">
          <div className="rv" style={{ ["--i" as string]: 1 }}>
            <h3>Quick facts</h3>
            <dl>
              <div>
                <dt>Location</dt>
                <dd>{PROFILE.location}</dd>
              </div>
              <div>
                <dt>Education</dt>
                <dd>
                  {PROFILE.degree}
                  <span>
                    {PROFILE.school} · GPA {PROFILE.gpa}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Roles</dt>
                <dd>
                  {PROFILE.roles.map((r) => (
                    <span key={r.title} className="role">
                      <b>{r.title}</b>
                      <span>
                        {r.division} · since {r.since}
                      </span>
                    </span>
                  ))}
                  <span>{PROFILE.company} · held concurrently, in two divisions</span>
                </dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>{PROFILE.focus}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                </dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>
                  {PROFILE.languages.map((l) => l.name).join(" · ")}
                  <span>{PROFILE.languages.map((l) => l.level).join(" · ")}</span>
                </dd>
              </div>
            </dl>
          </div>
          <figure className="quote rv" style={{ ["--i" as string]: 2 }}>
            <blockquote style={{ margin: 0 }}>{PROFILE.quote}</blockquote>
          </figure>
        </div>
      </div>
    </section>
  );
}
