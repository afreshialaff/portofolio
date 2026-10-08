"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, onAnchorClick } from "@/lib/scroll";
import { BriefcaseButton, openBriefcase } from "@/components/briefcase/BriefcaseButton";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.nav-progress{position:fixed;inset:0 0 auto 0;height:2px;z-index:60;pointer-events:none}
.nav-progress i{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0);will-change:transform}
.nav{position:fixed;inset:0 0 auto 0;z-index:50;pointer-events:none}
.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;height:84px}
.nav-inner > *{pointer-events:auto}
.nav-brand{display:flex;align-items:center;gap:12px;min-width:0}
.nav-mark{position:relative;flex:none;display:grid;place-items:center;width:42px;height:42px;border-radius:50%;
  box-shadow:inset 0 0 0 1.5px var(--ink);font-weight:700;font-size:14px;letter-spacing:-.04em;
  transition:background-color .6s var(--ease),color .6s var(--ease),transform .9s var(--ease)}
.nav-brand:hover .nav-mark{transform:rotate(360deg)}
.nav.is-scrolled .nav-mark{background:var(--ink);color:#fff}
.nav-name{font-weight:600;font-size:15px;letter-spacing:-.02em;white-space:nowrap;
  transition:opacity .5s var(--ease),transform .6s var(--ease)}
.nav-name small{display:block;font-family:var(--font-mono);font-weight:400;font-size:11px;letter-spacing:0;color:var(--mute);text-transform:uppercase}
.nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}

.nav-pill{position:relative;display:flex;align-items:center;padding:5px;border-radius:999px;
  transition:background-color .6s var(--ease),box-shadow .6s var(--ease),backdrop-filter .6s var(--ease)}
.nav.is-scrolled .nav-pill{background:rgba(255,255,255,.72);box-shadow:inset 0 0 0 1px var(--line),0 12px 30px -18px rgba(13,13,13,.35);
  -webkit-backdrop-filter:blur(12px) saturate(1.4);backdrop-filter:blur(12px) saturate(1.4)}
.nav-pill ul{position:relative;z-index:1;display:flex;list-style:none;margin:0;padding:0}
.nav-ind{position:absolute;top:5px;left:5px;height:calc(100% - 10px);border-radius:999px;background:var(--ink);
  transform:translateX(var(--x,0));width:var(--w,0);opacity:var(--o,0);
  transition:transform .6s var(--ease),width .6s var(--ease),opacity .4s var(--ease)}
.nav-link{position:relative;z-index:1;display:block;padding:10px 16px;border-radius:999px;font-size:14px;font-weight:500;letter-spacing:-.01em;color:var(--ink-2);
  transition:color .45s var(--ease)}
.nav-link:hover{color:var(--ink)}
.nav-link[aria-current="true"]{color:#fff}
.nav-bc{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 16px;border-radius:999px;font-size:14px;font-weight:500;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 10px 24px -18px rgba(13,13,13,.4);transition:background-color .4s var(--ease),color .4s var(--ease)}
.nav-bc:hover{background:var(--ink);color:#fff}
.nav-right{display:flex;align-items:center;gap:8px}
.menu-bc{align-self:flex-start;margin:8px 0 18px;height:44px;padding:0 18px;border-radius:999px;background:var(--ink);color:#fff;font-size:14px;font-weight:500}
.nav-menu-btn{display:none;height:44px;padding:0 18px;border-radius:999px;background:var(--ink);color:#fff;font-size:14px;font-weight:500;align-items:center;gap:10px}
.nav-menu-btn i{display:grid;gap:4px}
.nav-menu-btn i::before,.nav-menu-btn i::after{content:"";display:block;width:14px;height:1.5px;background:currentColor}

.menu{position:fixed;inset:0;z-index:70;background:var(--paper);display:flex;flex-direction:column;
  clip-path:circle(0px at calc(100% - 52px) 42px);visibility:hidden;
  transition:clip-path .9s var(--ease),visibility 0s linear .9s}
.menu.is-open{clip-path:circle(150% at calc(100% - 52px) 42px);visibility:visible;transition:clip-path .9s var(--ease),visibility 0s}
.menu-top{display:flex;align-items:center;justify-content:space-between;height:84px}
.menu-close{height:44px;padding:0 18px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);font-size:14px;font-weight:500}
.menu ol{list-style:none;margin:auto 0;padding:0;display:grid;gap:4px}
.menu li{overflow:hidden}
.menu a{display:flex;align-items:baseline;gap:16px;padding:6px 0;font-weight:700;font-size:clamp(40px,12vw,72px);letter-spacing:-.05em;line-height:1.02;
  transform:translateY(110%);transition:transform .8s var(--ease);transition-delay:calc(.08s + var(--i)*.06s)}
.menu a span{font-family:var(--font-mono);font-size:12px;font-weight:400;letter-spacing:0;color:var(--mute)}
.menu.is-open a{transform:none}
.menu-foot{display:flex;flex-wrap:wrap;gap:8px 20px;padding-bottom:28px;font-size:14px;color:var(--mute)}
.menu-foot a{all:unset;cursor:pointer;color:var(--ink);text-decoration:underline;text-underline-offset:4px}

@media (max-width: 1200px){
  .nav-pill{display:none}
  .nav-menu-btn{display:inline-flex}
  .nav-inner{height:72px}
  .menu-top{height:72px}
}
@media (max-width: 700px){ .nav-bc{display:none} }
@media (max-width: 420px){ .nav-name small{display:none} }
}
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  /* scrolled state + progress bar (rAF, no re-render for the bar) */
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      setScrolled(y > 40);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* active section */
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const extra = ["top", "credentials", "gallery"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = (e.target as HTMLElement).id;
          setActive(NAV.some((n) => n.id === id) ? id : null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    extra.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* slide the ink indicator under the active link */
  const placeIndicator = useCallback(() => {
    const ind = indRef.current;
    const list = listRef.current;
    if (!ind || !list) return;
    const link = active ? list.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`) : null;
    if (!link) {
      ind.style.setProperty("--o", "0");
      return;
    }
    ind.style.setProperty("--x", `${link.offsetLeft}px`);
    ind.style.setProperty("--w", `${link.offsetWidth}px`);
    ind.style.setProperty("--o", "1");
  }, [active]);

  useIsoLayoutEffect(() => {
    placeIndicator();
  }, [placeIndicator]);
  useEffect(() => {
    window.addEventListener("resize", placeIndicator);
    document.fonts?.ready.then(placeIndicator).catch(() => {});
    return () => window.removeEventListener("resize", placeIndicator);
  }, [placeIndicator]);

  /* mobile menu: lock scroll, Esc to close, focus management */
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeMenu = (focusButton = true) => {
    setOpen(false);
    if (focusButton) menuBtnRef.current?.focus();
  };

  return (
    <>
      <style href="nav" precedence="component">
        {css}
      </style>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="nav-progress" aria-hidden="true">
        <i ref={barRef} />
      </div>
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="wrap nav-inner">
          <a href="#top" className="nav-brand" onClick={onAnchorClick} aria-label={`${PROFILE.name} — back to top`}>
            <span className="nav-mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className="nav-name" aria-hidden="true">
              {PROFILE.name}
              <small>{PROFILE.roleShort}</small>
            </span>
          </a>

          <div className="nav-right">
          <nav className="nav-pill" aria-label="Primary">
            <span ref={indRef} className="nav-ind" aria-hidden="true" />
            <ul ref={listRef}>
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="nav-link"
                    aria-current={active === n.id ? "true" : undefined}
                    onClick={onAnchorClick}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <BriefcaseButton className="nav-bc" label="Briefcase" />
          <button
            ref={menuBtnRef}
            type="button"
            className="nav-menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menu <i aria-hidden="true" />
          </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`menu ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="wrap menu-top">
          <span className="nav-brand">
            <span className="nav-mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
          </span>
          <button type="button" className="menu-close" onClick={() => closeMenu()}>
            Close
          </button>
        </div>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${n.id}`}
                  style={{ ["--i" as string]: i }}
                  onClick={(e) => {
                    closeMenu(false);
                    // wait one frame so the scroll lock is released first
                    const anchor = e.currentTarget;
                    e.preventDefault();
                    requestAnimationFrame(() =>
                      onAnchorClick({
                        currentTarget: anchor,
                        preventDefault() {},
                        metaKey: false,
                        ctrlKey: false,
                        shiftKey: false,
                        button: 0,
                      } as unknown as React.MouseEvent<HTMLAnchorElement>),
                    );
                  }}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="menu-bc"
            onClick={() => {
              closeMenu(false);
              window.setTimeout(openBriefcase, 300);
            }}
          >
            Open Portfolio Briefcase
          </button>
          <div className="menu-foot">
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <span>{PROFILE.location}</span>
          </div>
        </div>
      </div>
    </>
  );
}
