"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { onAnchorClick } from "@/lib/scroll";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.hero{position:relative;background:var(--paper);min-height:100svh;display:flex;align-items:flex-end;overflow:hidden;isolation:isolate;padding-top:84px}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:clamp(20px,3vw,48px);width:100%}
.hero-ghost{position:absolute;right:-1vw;top:46%;z-index:-1;margin:0;transform:translateY(-50%);
  font-weight:800;font-size:clamp(84px,15vw,300px);line-height:.8;letter-spacing:-.06em;white-space:nowrap;
  color:transparent;-webkit-text-stroke:1.2px rgba(13,13,13,.12);user-select:none;pointer-events:none;
  animation:hero-ghost 1.8s var(--ease) both}
@keyframes hero-ghost{from{opacity:0;letter-spacing:.04em}to{opacity:1;letter-spacing:-.06em}}

.hero-stage{position:relative;height:min(calc(100svh - 84px),980px);aspect-ratio:768/960;max-width:calc(100vw - 2*var(--gutter));
  justify-self:end;mix-blend-mode:multiply;animation:hero-rise 1.6s var(--ease) .1s both}
.hero-stage video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 100%}
.hero-stage::after{content:"";position:absolute;left:12%;right:12%;bottom:0;height:1px;background:linear-gradient(90deg,transparent,var(--line),transparent)}
@keyframes hero-rise{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}

.hero-text{padding-bottom:clamp(32px,7vh,80px);animation:hero-rise 1.4s var(--ease) .25s both;max-width:720px}
.hero-eyebrow{font-family:var(--font-mono);font-size:12px;text-transform:uppercase;color:var(--mute);letter-spacing:.02em;line-height:1.6}
.hero-eyebrow b{color:var(--ink);font-weight:500}
.h1{margin-top:16px;font-weight:700;font-size:clamp(42px,4.6vw,80px);line-height:.98;letter-spacing:-.05em}
.h1 > span{display:block}
.hero-sub{margin-top:18px;max-width:54ch;color:var(--ink-2);font-size:clamp(15px,1.1vw,17px);line-height:1.55}
.hero-focus{list-style:none;margin:22px 0 0;padding:0;display:grid;gap:0;border-top:1px solid var(--line)}
.hero-focus li{display:grid;grid-template-columns:34px minmax(0,1fr);gap:4px 10px;padding:11px 0;border-bottom:1px solid var(--line)}
.hero-focus span{grid-row:span 2;font-family:var(--font-mono);font-size:11px;color:var(--mute);padding-top:3px}
.hero-focus b{font-weight:600;font-size:15px;letter-spacing:-.02em}
.hero-focus small{font-size:13px;color:var(--mute);line-height:1.4}
.hero-also{margin-top:10px;font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--mute);letter-spacing:.02em}
.hero-proof{display:flex;flex-wrap:wrap;gap:10px 28px;margin-top:20px}
.hero-proof div{display:flex;align-items:baseline;gap:10px}
.hero-proof b{font-weight:700;font-size:clamp(24px,2.2vw,32px);letter-spacing:-.05em;line-height:1}
.hero-proof small{max-width:22ch;font-size:12.5px;line-height:1.3;color:var(--mute)}
.hero-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}

.sound{position:absolute;right:8%;bottom:12%;z-index:2;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;
  background:var(--ink);color:#fff;box-shadow:0 12px 30px -12px rgba(13,13,13,.6);transition:transform .5s var(--ease),background-color .4s var(--ease)}
.sound:hover{transform:scale(1.06)}
.sound svg{width:16px;height:16px}
.sound::before{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--ink);opacity:0;pointer-events:none}
.sound.is-blocked::before{animation:ping 2.2s var(--ease) infinite}
@keyframes ping{0%{transform:scale(1);opacity:.55}80%,100%{transform:scale(1.9);opacity:0}}

@media (max-width: 1100px){
  .hero-stage{height:auto;width:min(44vw,calc(86svh * .8),600px)}
  .hero-focus small{display:none}
}
@media (max-width: 760px){
  .hero{align-items:flex-start;padding-top:72px}
  .hero-grid{grid-template-columns:minmax(0,1fr);gap:0}
  .hero-stage{grid-row:1;justify-self:center;width:auto;height:58svh;min-height:360px}
  .hero-text{grid-row:2;padding-top:18px;padding-bottom:56px}
  .hero-ghost{top:29svh;right:auto;left:50%;transform:translate(-50%,-50%);font-size:27vw}
  .hero-focus small{display:block}
  .sound{right:4%;bottom:8%}
}
}
`;

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.5 2.8v10.4L13 8z" fill="currentColor" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3.5" y="2.8" width="3" height="10.4" rx=".8" fill="currentColor" />
      <rect x="9.5" y="2.8" width="3" height="10.4" rx=".8" fill="currentColor" />
    </svg>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundBtnRef = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const userMuted = useRef(false); // visitor explicitly turned sound off
  const visible = useRef(true);
  const autoplay = useRef(true); // false under reduced motion until the visitor presses play

  useEffect(() => {
    const v = videoRef.current;
    const section = sectionRef.current;
    if (!v || !section) return;
    let alive = true;

    const play = async (withSound: boolean): Promise<boolean> => {
      v.muted = !withSound;
      try {
        await v.play();
        return true;
      } catch {
        return false;
      }
    };

    /* 1. try with sound, fall back to muted */
    const start = async () => {
      if (prefersReducedMotion()) {
        autoplay.current = false;
        setBlocked(false);
        return;
      }
      if (await play(true)) {
        if (alive) setSoundOn(true);
        return;
      }
      await play(false);
      if (alive) {
        setSoundOn(false);
        setBlocked(true);
      }
    };
    start();

    /* 2. unlock sound on the first real interaction */
    const unlock = (e: Event) => {
      if (e.target instanceof Node && soundBtnRef.current?.contains(e.target)) return removeUnlock();
      if (e instanceof KeyboardEvent && ["Tab", "Shift", "Alt", "Control", "Meta", "Escape"].includes(e.key)) return;
      removeUnlock();
      if (userMuted.current || !autoplay.current) return;
      v.muted = false;
      setSoundOn(true);
      setBlocked(false);
      if (visible.current) v.play().catch(() => {});
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    const removeUnlock = () => evs.forEach((ev) => window.removeEventListener(ev, unlock, true));
    evs.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));

    /* 3. pause when < 35 % of the hero is visible, resume on return */
    const io = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.intersectionRatio >= 0.35;
        visible.current = isVisible;
        if (!isVisible) {
          v.pause();
        } else if (autoplay.current) {
          v.play().catch(() => {
            // sound no longer allowed (e.g. tab restored) → keep the picture moving muted
            v.muted = true;
            setSoundOn(false);
            v.play().catch(() => {});
          });
        }
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(section);

    return () => {
      alive = false;
      removeUnlock();
      io.disconnect();
    };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (soundOn) {
      v.muted = true;
      userMuted.current = true;
      setSoundOn(false);
      return;
    }
    userMuted.current = false;
    autoplay.current = true;
    v.muted = false;
    setSoundOn(true);
    setBlocked(false);
    v.play().catch(() => {
      v.muted = true;
      setSoundOn(false);
      setBlocked(true);
    });
  };

  return (
    <section ref={sectionRef} id="top" className="hero" aria-labelledby="hero-title">
      <style href="hero" precedence="component">
        {css}
      </style>

      <p className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </p>

      <div className="wrap hero-grid">
        <div className="hero-text">
          <p className="hero-eyebrow">
            <b>{PROFILE.name}</b> · {PROFILE.credential}
            <br />
            {PROFILE.roleShort} — {PROFILE.company}
          </p>
          <h1 className="h1" id="hero-title">
            <span className="sr-only">{PROFILE.name}: </span>
            <span>{PROFILE.hero.lines[0]}</span>
            <span>
              {PROFILE.hero.lines[1]} <em>{PROFILE.hero.accent}</em>
            </span>
          </h1>
          <p className="hero-sub">{PROFILE.hero.sub}</p>
          <ol className="hero-focus" aria-label="Focus areas">
            {PROFILE.hero.focus.map((f, i) => (
              <li key={f.title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <b>{f.title}</b>
                <small>{f.text}</small>
              </li>
            ))}
          </ol>
          <p className="hero-also">{PROFILE.hero.also}</p>
          <div className="hero-proof">
            {PROFILE.hero.proof.map((p) => (
              <div key={p.label}>
                <b>{p.value}</b>
                <small>{p.label}</small>
              </div>
            ))}
          </div>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-primary" onClick={onAnchorClick}>
              Discuss your accounting or ERP needs
            </a>
            <a href="#cases" className="btn btn-ghost" onClick={onAnchorClick}>
              Selected cases <span className="arr arr-down" aria-hidden="true">↓</span>
            </a>
            <a href={PROFILE.resume} className="btn btn-ghost" download>
              Résumé <span className="arr arr-down" aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-stage">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero/poster.webp"
            aria-label={`Video: ${PROFILE.name} introducing herself`}
            disablePictureInPicture
          >
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
          <button
            ref={soundBtnRef}
            type="button"
            className={`sound ${blocked ? "is-blocked" : ""}`}
            onClick={toggleSound}
            aria-label={soundOn ? "Mute the introduction" : "Play the introduction with sound"}
            aria-pressed={soundOn}
          >
            {soundOn ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>

    </section>
  );
}
