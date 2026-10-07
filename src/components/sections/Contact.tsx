"use client";

import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { onAnchorClick } from "@/lib/scroll";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.contact{padding-bottom:0;overflow:hidden}
.ct-title{font-weight:700;font-size:clamp(46px,10vw,168px);line-height:.9;letter-spacing:-.06em;margin-top:22px}
.ct-title .ln{display:block;white-space:nowrap}
.ct-title .ln + .ln{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.03em;color:var(--mute)}
.ct-l{display:inline-block;will-change:transform}
.ct-l.hop{animation:hop .62s var(--ease)}
@keyframes hop{0%{transform:none}35%{transform:translateY(-.16em)}65%{transform:translateY(.03em)}100%{transform:none}}
.ct-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;margin-top:clamp(40px,7vw,90px)}
.ct-email{display:flex;align-items:center;flex-wrap:wrap;gap:14px 18px}
.ct-email a{font-weight:600;font-size:clamp(24px,4vw,56px);letter-spacing:-.045em;line-height:1.05;
  background:linear-gradient(var(--ink),var(--ink)) 0 100%/100% 2px no-repeat;padding-bottom:6px;overflow-wrap:anywhere;
  transition:background-size .7s var(--ease)}
.ct-email a:hover{background-size:0 2px;background-position:100% 100%}
.ct-copy{height:36px;padding:0 14px;border-radius:999px;font-family:var(--font-mono);font-size:12px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);
  transition:background-color .4s var(--ease),color .4s var(--ease)}
.ct-copy:hover,.ct-copy.is-done{background:var(--ink);color:#fff}
.ct-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.ct-badge{position:relative;width:150px;height:150px;flex:none;display:grid;place-items:center;border-radius:50%}
.ct-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 22s linear infinite}
.ct-badge text{font-family:var(--font-mono);font-size:10.4px;letter-spacing:.2em;text-transform:uppercase;fill:var(--ink)}
.ct-badge span{width:58px;height:58px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:22px;
  transition:transform .6s var(--ease)}
.ct-badge:hover span{transform:rotate(-45deg) scale(1.08)}
@keyframes spin{to{transform:rotate(360deg)}}
.foot{margin-top:clamp(80px,12vw,140px);border-top:1px solid var(--line)}
.foot-in{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px 24px;padding-block:28px;font-size:13.5px;color:var(--mute)}
.foot a{color:var(--ink);border-bottom:1px solid var(--line);transition:border-color .4s var(--ease)}
.foot a:hover{border-color:var(--ink)}
@media (max-width: 720px){
  .ct-row{grid-template-columns:minmax(0,1fr)}
  .ct-badge{width:120px;height:120px}
}
}
`;

function HopLine({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`ln ${className ?? ""}`} aria-hidden="true">
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          " "
        ) : (
          <span
            key={i}
            className="ct-l"
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (el.classList.contains("hop")) return;
              el.classList.add("hop");
            }}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("hop")}
          >
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <style href="contact" precedence="component">
        {css}
      </style>
      <div className="wrap">
        <p className="tag rv">
          <b>08</b> — Contact
        </p>
        <h2 className="ct-title" id="contact-title" aria-label="Let's build something together.">
          <HopLine text="Let’s build" />
          <HopLine text="something together." />
        </h2>

        <div className="ct-row">
          <div>
            <div className="ct-email rv">
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <button type="button" className={`ct-copy ${copied ? "is-done" : ""}`} onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <div className="ct-links rv" style={{ ["--i" as string]: 1 }}>
              <a href={PROFILE.phoneHref} className="btn btn-ghost">
                {PROFILE.phone}
              </a>
              {PROFILE.github && (
                <a href={PROFILE.github} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                  GitHub <span className="arr" aria-hidden="true">↗</span>
                </a>
              )}
              <a href={PROFILE.linkedin} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                LinkedIn <span className="arr" aria-hidden="true">↗</span>
              </a>
              <a href={PROFILE.resume} className="btn btn-primary" download>
                Résumé <span className="arr arr-down" aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <a href={`mailto:${PROFILE.email}`} className="ct-badge rv" aria-label={`Say hello — email ${PROFILE.email}`}>
            <svg viewBox="0 0 150 150" aria-hidden="true">
              <defs>
                <path id="ct-circle" d="M75,75 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
              </defs>
              <text>
                <textPath href="#ct-circle" textLength="362" lengthAdjust="spacing">say hello · say hello · say hello · </textPath>
              </text>
            </svg>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <span>
          © {year} {PROFILE.name}
        </span>
        <a href="#top" onClick={onAnchorClick}>
          Back to top ↑
        </a>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
