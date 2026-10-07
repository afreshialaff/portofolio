"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { onAnchorClick } from "@/lib/scroll";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.hero{position:relative;background:var(--paper);min-height:100svh;display:flex;align-items:flex-end;overflow:hidden;isolation:isolate}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:end;gap:clamp(16px,2.5vw,40px);width:100%}
.hero-ghost{position:absolute;left:50%;top:50%;z-index:-1;margin:0;transform:translate(-50%,-46%);
  font-weight:800;font-size:clamp(84px,21vw,360px);line-height:.8;letter-spacing:-.06em;white-space:nowrap;
  color:transparent;-webkit-text-stroke:1.2px rgba(13,13,13,.16);user-select:none;pointer-events:none;
  animation:hero-ghost 1.8s var(--ease) both}
@keyframes hero-ghost{from{opacity:0;letter-spacing:.04em}to{opacity:1;letter-spacing:-.06em}}

.hero-stage{position:relative;height:min(96svh,1040px);aspect-ratio:768/960;max-width:calc(100vw - 2*var(--gutter));
  justify-self:center;mix-blend-mode:multiply;animation:hero-rise 1.6s var(--ease) .1s both}
.hero-stage video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 100%}
.hero-stage::after{content:"";position:absolute;left:12%;right:12%;bottom:0;height:1px;background:linear-gradient(90deg,transparent,var(--line),transparent)}
@keyframes hero-rise{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}

.hero-left,.hero-right{padding-bottom:clamp(40px,9vh,96px);animation:hero-rise 1.4s var(--ease) both}
.hero-left{animation-delay:.25s}
.hero-right{animation-delay:.4s;justify-self:end;display:flex;flex-direction:column;align-items:flex-end;gap:22px;text-align:right}
.hero-eyebrow{font-family:var(--font-mono);font-size:12px;text-transform:uppercase;color:var(--mute);letter-spacing:.02em;margin-bottom:18px}
.h1{font-weight:700;font-size:clamp(42px,4.3vw,78px);line-height:.96;letter-spacing:-.05em}
.h1 > span{display:block}
.hero-focus{margin-top:20px;max-width:30ch;color:var(--ink-2);font-size:clamp(15px,1.15vw,17px);line-height:1.5}
.hero-ctas{display:flex;flex-direction:column;align-items:flex-end;gap:10px}
.hero-meta{font-family:var(--font-mono);font-size:12px;color:var(--mute);text-transform:uppercase;line-height:1.7}

.sound{position:absolute;right:6%;bottom:12%;z-index:2;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;
  background:var(--ink);color:#fff;box-shadow:0 12px 30px -12px rgba(13,13,13,.6);transition:transform .5s var(--ease),background-color .4s var(--ease)}
.sound:hover{transform:scale(1.06)}
.sound svg{width:16px;height:16px}
.sound::before{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--ink);opacity:0;pointer-events:none}
.sound.is-blocked::before{animation:ping 2.2s var(--ease) infinite}
@keyframes ping{0%{transform:scale(1);opacity:.55}80%,100%{transform:scale(1.9);opacity:0}}

.hero-scroll{position:absolute;left:var(--gutter);bottom:22px;font-family:var(--font-mono);font-size:11px;color:var(--mute);text-transform:uppercase;display:flex;align-items:center;gap:10px}
.hero-scroll i{width:1px;height:28px;background:var(--line);position:relative;overflow:hidden}
.hero-scroll i::after{content:"";position:absolute;left:0;top:-100%;width:100%;height:100%;background:var(--ink);animation:drip 2.2s var(--ease) infinite}
@keyframes drip{to{top:100%}}

@media (max-width: 1100px){
  .hero-grid{grid-template-columns:minmax(0,1fr) auto}
  .hero-stage{grid-column:2;grid-row:1 / span 2;height:auto;width:min(54vw,calc(86svh * .8),720px)}
  .hero-left{grid-column:1;grid-row:1;padding-bottom:0;align-self:end}
  .hero-right{grid-column:1;grid-row:2;justify-self:start;align-items:flex-start;text-align:left}
  .hero-ctas{flex-direction:row;flex-wrap:wrap;align-items:flex-start}
}
@media (max-width: 760px){
  .hero{align-items:flex-start;padding-top:72px}
  .hero-grid{grid-template-columns:minmax(0,1fr);gap:0}
  .hero-stage{grid-column:1;grid-row:1;height:62svh;min-height:380px}
  .hero-left{grid-row:2;padding-top:20px}
  .hero-right{grid-row:3;padding-top:22px;padding-bottom:56px;gap:18px}
  .hero-ghost{top:31svh;font-size:27vw}
  .hero-scroll{display:none}
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
        <div className="hero-left">
          <p className="hero-eyebrow">
            {PROFILE.role} — {PROFILE.company}
          </p>
          <h1 className="h1" id="hero-title">
            <span className="sr-only">{PROFILE.name}, </span>
            <span>Chartered</span>
            <span>
              <em>Accountant.</em>
            </span>
          </h1>
          <p className="hero-focus">{PROFILE.heroFocus}.</p>
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

        <div className="hero-right">
          <p className="hero-meta">
            {PROFILE.location.split(",").slice(0, 1).join("")}, Indonesia
            <br />
            CAAT · CTT · Brevet A &amp; B
          </p>
          <div className="hero-ctas">
            <a href="#work" className="btn btn-primary" onClick={onAnchorClick}>
              Explore work <span className="arr arr-down" aria-hidden="true">↓</span>
            </a>
            <a href="#contact" className="btn btn-ghost" onClick={onAnchorClick}>
              Let&rsquo;s talk
            </a>
            <a href={PROFILE.resume} className="btn btn-ghost" download>
              Résumé <span className="arr arr-down" aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <i /> Scroll
      </div>
    </section>
  );
}
