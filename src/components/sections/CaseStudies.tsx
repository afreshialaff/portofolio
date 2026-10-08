"use client";

import { useEffect, useRef } from "react";
import { CASES, sectionIndex, type CaseStudy } from "@/lib/data";
import { prefersReducedMotion, useScrollProgress } from "@/lib/hooks";
import { BriefcaseButton } from "@/components/briefcase/BriefcaseButton";

/**
 * Case studies — sticky stacked cards. Each card carries its own grayscale,
 * pure CSS/SVG finance animation (ERP, statements, P&L waterfall, reconciliation,
 * labour-cost allocation, PPh 21 reconciliation). Animations are paused until the
 * card scrolls into view. The section opens with an "Assets = Liabilities + Equity"
 * balance that levels out as you scroll. All visuals are illustrative: no figures.
 */

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.cs-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,420px);gap:40px;align-items:end}
.cs-lede{margin-top:22px;max-width:52ch;color:var(--mute);font-size:15px}
.cs-actions{margin-top:22px}

/* ---- balance equation */
.bal{position:relative;border-radius:26px;background:var(--card);box-shadow:var(--hair);padding:18px 18px 14px}
.bal svg{width:100%;height:auto;overflow:visible}
.bal text{font-family:var(--font-sans);font-weight:600;font-size:13px;fill:var(--ink);letter-spacing:-.02em}
.bal .mono{font-family:var(--font-mono);font-weight:400;font-size:10px;fill:var(--mute);letter-spacing:.04em}
.bal-cap{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-family:var(--font-mono);font-size:11px;color:var(--mute);text-transform:uppercase}
.bal-ok{padding:4px 9px;border-radius:999px;background:var(--ink);color:#fff;opacity:0;transform:scale(.8);transition:opacity .5s var(--ease),transform .6s var(--ease)}
.bal.is-ok .bal-ok{opacity:1;transform:none}

/* ---- stacked cards */
.cs-list{list-style:none;margin:56px 0 0;padding:0;display:grid;gap:26px}
.case{position:sticky;top:calc(96px + var(--i) * 14px);transform-origin:50% 0;will-change:transform}
.case-in{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(20px,3vw,40px);height:min(660px,calc(100svh - 130px));min-height:520px;
  padding:clamp(20px,2.4vw,32px);border-radius:28px;background:var(--card);box-shadow:var(--hair),0 30px 70px -40px rgba(13,13,13,.35);overflow:hidden}
.case-txt{display:flex;flex-direction:column;min-width:0;overflow:auto;scrollbar-width:none;transition:opacity .4s linear;opacity:calc(1 - var(--cover,0) * .55)}
.case-top{display:flex;justify-content:space-between;gap:12px;font-family:var(--font-mono);font-size:11.5px;text-transform:uppercase;color:var(--mute)}
.case-top b{color:var(--ink);font-weight:500}
.case h3{margin-top:12px;font-weight:700;font-size:clamp(22px,2.2vw,34px);line-height:1.04;letter-spacing:-.045em}
.flag{margin-left:10px;padding:2px 8px;border-radius:999px;background:var(--ink);color:#fff;font-style:normal;font-size:10px}
.case-meta{margin:14px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.case-meta div{padding:9px 11px;border-radius:12px;background:var(--paper)}
.case-meta dt{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;color:var(--mute)}
.case-meta dd{margin:3px 0 0;font-size:13px;line-height:1.35;color:var(--ink);font-weight:500}
.case .status{display:grid;gap:4px}
.case .status span{display:flex;gap:8px;align-items:baseline}
.dot{flex:none;width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink);transform:translateY(-1px)}
.dot.on{background:var(--ink)}
.case-body{margin:16px 0 0;padding-top:0;display:grid;gap:0}
.case-body div{display:grid;grid-template-columns:100px minmax(0,1fr);gap:12px;padding:8px 0;border-top:1px solid var(--line)}
.case-body dt{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;color:var(--mute);padding-top:3px}
.case-body dd{margin:0;font-size:13.5px;line-height:1.45;color:var(--ink-2)}
.case-body strong{color:var(--ink);font-weight:600}

.ca-stage{position:relative;min-width:0;border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;display:grid;place-items:center;padding:18px}
.ca-stage *{animation-play-state:paused!important}
.case.is-play .ca-stage *{animation-play-state:running!important}
.ca-tag{position:absolute;right:12px;bottom:12px;z-index:3;font-family:var(--font-mono);font-size:10px;text-transform:uppercase;padding:5px 9px;border-radius:999px;
  background:rgba(255,255,255,.85);box-shadow:inset 0 0 0 1px var(--line);color:var(--mute)}
.ca-svg{width:100%;height:100%;max-height:380px;overflow:visible}
.ca-svg text{font-family:var(--font-sans);font-size:11px;font-weight:600;fill:var(--ink);letter-spacing:-.01em}
.ca-svg .lbl{font-family:var(--font-mono);font-weight:400;font-size:9.5px;fill:var(--mute);letter-spacing:.03em}
.ca-svg .inv{fill:#fff}

/* shared keyframes */
@keyframes ca-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes ca-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes ca-draw{from{stroke-dashoffset:var(--len,300)}to{stroke-dashoffset:0}}
@keyframes ca-pulse{from{stroke-dashoffset:0}to{stroke-dashoffset:-214}}
@keyframes ca-growy{from{transform:scaleY(0)}to{transform:none}}
@keyframes ca-growx{from{transform:scaleX(0)}to{transform:none}}
@keyframes ca-blink{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes ca-fill{from{fill:#fff}to{fill:var(--to)}}
@keyframes ca-slide{0%{opacity:0;transform:translateX(-30px)}15%,70%{opacity:1;transform:none}100%{opacity:0;transform:translateX(60px)}}

.pop{transform-box:fill-box;transform-origin:center;animation:ca-pop .7s var(--ease) both;animation-delay:var(--d,0s)}
.up{animation:ca-up .8s var(--ease) both;animation-delay:var(--d,0s)}
.draw{stroke-dasharray:var(--len,300);animation:ca-draw 1.1s var(--ease) both;animation-delay:var(--d,0s)}
.pulse{stroke-dasharray:6 208;stroke-linecap:round;animation:ca-pulse 2.6s linear infinite;animation-delay:var(--d,0s)}
.gy{transform-box:fill-box;transform-origin:50% 100%;animation:ca-growy 1s var(--ease) both;animation-delay:var(--d,0s)}
.gyt{transform-box:fill-box;transform-origin:50% 0;animation:ca-growy 1s var(--ease) both;animation-delay:var(--d,0s)}
.gx{transform-box:fill-box;transform-origin:0 50%;animation:ca-growx 1s var(--ease) both;animation-delay:var(--d,0s)}
.blink{animation:ca-blink 1.6s ease-in-out infinite;animation-delay:var(--d,0s)}
.cell{animation:ca-fill .5s var(--ease) both;animation-delay:var(--d,0s)}

/* statements (HTML) */
.st{position:relative;width:100%;height:100%;max-height:380px;display:grid;grid-template-columns:minmax(0,.8fr) 40px minmax(0,1.2fr);align-items:center}
.st-feed{display:grid;gap:7px}
.st-feed span{display:flex;align-items:center;gap:6px;height:24px;padding:0 8px;border-radius:7px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);
  animation:ca-slide 3.2s var(--ease) infinite;animation-delay:calc(var(--k) * .42s)}
.st-feed i{flex:1;height:6px;border-radius:3px;background:#dcd9d3}
.st-feed b{width:22px;height:6px;border-radius:3px;background:#bdbab4}
.st-arrow{justify-self:center;font-size:20px;color:var(--faint)}
.st-pages{position:relative;height:100%;min-height:240px}
.st-pg{position:absolute;left:calc(var(--k) * 9%);top:calc(var(--k) * 11%);width:62%;height:56%;border-radius:12px;background:#fff;
  box-shadow:inset 0 0 0 1px var(--line),0 14px 26px -18px rgba(13,13,13,.5);padding:12px;display:flex;flex-direction:column;gap:7px;
  animation:ca-up .8s var(--ease) both;animation-delay:calc(.4s + var(--k) * .45s)}
.st-pg b{font-family:var(--font-mono);font-weight:500;font-size:9.5px;text-transform:uppercase;color:var(--mute);line-height:1.3}
.st-pg i{display:block;height:6px;border-radius:3px;background:#dcd9d3}
.st-pg i.k{background:var(--ink)}
.st-done{position:absolute;right:0;bottom:4%;padding:6px 11px;border-radius:999px;background:var(--ink);color:#fff;font-family:var(--font-mono);font-size:10px;text-transform:uppercase;
  animation:ca-pop .6s var(--ease) both;animation-delay:2.4s}

@media (max-width: 900px){
  .cs-head{grid-template-columns:minmax(0,1fr)}
  .case{position:relative;top:0}
  .case-in{grid-template-columns:minmax(0,1fr);height:auto;min-height:0}
  .ca-stage{height:300px}
  .case-body div{grid-template-columns:minmax(0,1fr);gap:3px}
  .case-meta{grid-template-columns:minmax(0,1fr)}
}
}
`;

/* ------------------------------------------------------------------ animations */
const d = (s: number) => ({ ["--d" as string]: `${s}s` });

function ErpAnim() {
  const mods: [string, number, number][] = [
    ["Accounting", 72, 62],
    ["Finance", 328, 62],
    ["Invoicing", 62, 158],
    ["HRD", 338, 158],
  ];
  const cos: [string, number, number][] = [
    ["Client business flow", 200, 272],
    ["Optimisation", 76, 262],
    ["New requests", 324, 262],
  ];
  return (
    <svg className="ca-svg" viewBox="0 0 400 300" aria-hidden="true">
      {[...mods, ...cos].map(([, x, y], i) => (
        <g key={i}>
          <path d={`M200 140 L${x} ${y}`} stroke="var(--faint)" strokeWidth="1.2" className="draw" style={{ ...d(0.2 + i * 0.12), ["--len" as string]: 220 }} />
          <path d={`M200 140 L${x} ${y}`} stroke="var(--ink)" strokeWidth="2.4" className="pulse" style={d(1.4 + i * 0.35)} />
        </g>
      ))}
      <circle cx="200" cy="140" r="52" fill="none" stroke="var(--line)" strokeWidth="1" className="pop" style={d(0)} />
      <circle cx="200" cy="140" r="36" fill="var(--ink)" className="pop" style={d(0.1)} />
      <text x="200" y="145" textAnchor="middle" className="inv" style={{ fontSize: 15, fontWeight: 700 }}>
        ERP
      </text>
      {mods.map(([t, x, y], i) => (
        <g key={t} className="pop" style={d(0.5 + i * 0.15)}>
          <rect x={x - 42} y={y - 14} width="84" height="28" rx="14" fill="#fff" stroke="var(--line)" />
          <text x={x} y={y + 4} textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      {cos.map(([t, x, y], i) => (
        <g key={t} className="pop" style={d(1.1 + i * 0.15)}>
          <rect x={x - (i === 0 ? 62 : 46)} y={y - 13} width={i === 0 ? 124 : 92} height="26" rx="8" fill={i === 0 ? "var(--ink)" : "var(--soft)"} strokeDasharray={i === 0 ? undefined : "3 3"} stroke={i === 0 ? undefined : "var(--faint)"} />
          <text x={x} y={y + 4} textAnchor="middle" className={i === 0 ? "lbl inv" : "lbl"} style={i === 0 ? { fill: "#fff" } : undefined}>
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}

function JurisdictionAnim() {
  const steps = ["Books & trial balance", "Financial statements", "Notes to the FS", "IRAS report preparation"];
  return (
    <svg className="ca-svg" viewBox="0 0 400 300" aria-hidden="true">
      <text x="20" y="22" className="lbl">
        SINGAPORE · APPLICABLE FRAMEWORK
      </text>
      {steps.map((t, i) => (
        <g key={t} className="up" style={d(0.3 + i * 0.4)}>
          <rect x={20 + i * 14} y={40 + i * 46} width="230" height="36" rx="10" fill={i === 3 ? "var(--ink)" : "#fff"} stroke="var(--line)" />
          <text x={38 + i * 14} y={63 + i * 46} className={i === 3 ? "inv" : undefined}>
            {t}
          </text>
          {i < 3 && (
            <path d={`M${60 + i * 14} ${76 + i * 46} v10 h14`} fill="none" stroke="var(--faint)" strokeWidth="1.2" className="draw" style={{ ...d(0.6 + i * 0.4), ["--len" as string]: 40 }} />
          )}
        </g>
      ))}
      {/* globe of jurisdictions */}
      <g className="pop" style={d(1.9)}>
        <circle cx="338" cy="96" r="40" fill="none" stroke="var(--ink)" strokeWidth="1.3" />
        <ellipse cx="338" cy="96" rx="18" ry="40" fill="none" stroke="var(--faint)" />
        <path d="M298 96h80M304 76h68M304 116h68" stroke="var(--faint)" fill="none" />
      </g>
      {[
        ["ID", 318, 160, true],
        ["SG", 360, 160, true],
        ["AU", 339, 198, false],
      ].map(([t, x, y, on], i) => (
        <g key={t as string} className="pop" style={d(2.3 + i * 0.2)}>
          <rect x={(x as number) - 18} y={(y as number) - 13} width="36" height="26" rx="13" fill={on ? "var(--ink)" : "#fff"} stroke="var(--ink)" strokeDasharray={on ? undefined : "3 3"} />
          <text x={x as number} y={(y as number) + 4} textAnchor="middle" className={on ? "inv" : undefined} style={{ fontSize: 10 }}>
            {t as string}
          </text>
        </g>
      ))}
      <text x="339" y="232" textAnchor="middle" className="lbl">
        AU · learning
      </text>
    </svg>
  );
}

function ProjectsAnim() {
  const rows: [string, string, number][] = [
    ["Project A", "Settled", 1],
    ["Project B", "Partial", 0.55],
    ["Project C", "Down payment", 0.25],
    ["Project D", "Outstanding", 0],
  ];
  return (
    <svg className="ca-svg" viewBox="0 0 400 300" aria-hidden="true">
      <text x="20" y="22" className="lbl">
        INVOICE ↔ BANK RECEIPT ↔ SALES RECORD
      </text>
      {rows.map(([p, st, k], i) => (
        <g key={p} className="up" style={d(0.2 + i * 0.2)}>
          <text x="20" y={64 + i * 50} className="lbl">
            {p}
          </text>
          <rect x="96" y={50 + i * 50} width="190" height="20" rx="6" fill="#fff" stroke="var(--line)" />
          {k > 0 && <rect x="96" y={50 + i * 50} width={190 * k} height="20" rx="6" fill="var(--ink)" className="gx" style={d(0.9 + i * 0.3)} />}
          <g className="pop" style={d(1.4 + i * 0.3)}>
            <rect x="296" y={48 + i * 50} width="86" height="24" rx="12" fill={k === 1 ? "var(--ink)" : "#fff"} stroke="var(--ink)" strokeDasharray={k === 0 ? "3 3" : undefined} />
            <text x="339" y={64 + i * 50} textAnchor="middle" className={k === 1 ? "inv" : undefined} style={{ fontSize: 10 }}>
              {st}
            </text>
          </g>
        </g>
      ))}
      <text x="20" y="262" className="lbl">
        Status only from matched transactions
      </text>
      <g className="pop" style={d(2.8)}>
        <rect x="20" y="272" width="150" height="20" rx="10" fill="var(--soft)" />
        <text x="95" y="286" textAnchor="middle" className="lbl">
          tagged by company & project
        </text>
      </g>
    </svg>
  );
}

function StatementsAnim() {
  const pages = ["Financial position", "Profit or loss", "Cash flows", "Notes to the FS"];
  return (
    <div className="st" aria-hidden="true">
      <div className="st-feed">
        <p className="mono" style={{ fontSize: 10, color: "var(--mute)", textTransform: "uppercase", marginBottom: 2 }}>
          Amazon reports
        </p>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <span key={k} style={{ ["--k" as string]: k }}>
            <i />
            <b />
          </span>
        ))}
      </div>
      <span className="st-arrow">→</span>
      <div className="st-pages">
        {pages.map((p, k) => (
          <div key={p} className="st-pg" style={{ ["--k" as string]: k, zIndex: k }}>
            <b>{p}</b>
            <i style={{ width: "90%" }} />
            <i style={{ width: "72%" }} />
            <i style={{ width: "84%" }} />
            <i className={k === 3 ? "" : "k"} style={{ width: "46%" }} />
          </div>
        ))}
        <span className="st-done">Complete · with notes</span>
      </div>
    </div>
  );
}

function WaterfallAnim() {
  // shapes only — heights are illustrative, no figures
  const bars: { l: string; y: number; h: number; end: number; dark?: boolean }[] = [
    { l: "Revenue", y: 40, h: 180, end: 40, dark: true },
    { l: "Cost of|sales", y: 40, h: 70, end: 110 },
    { l: "Gross|profit", y: 110, h: 110, end: 110, dark: true },
    { l: "G&A", y: 110, h: 38, end: 148 },
    { l: "Fin. &|tax", y: 148, h: 22, end: 170 },
    { l: "Net|result", y: 170, h: 50, end: 170, dark: true },
  ];
  const w = 44;
  const gap = 18;
  return (
    <svg className="ca-svg" viewBox="0 0 400 300" aria-hidden="true">
      <line x1="18" y1="220" x2="388" y2="220" stroke="var(--line)" />
      {bars.map((b, i) => {
        const x = 26 + i * (w + gap);
        return (
          <g key={b.l}>
            {i > 0 && (
              <line
                x1={x - gap}
                x2={x}
                y1={bars[i - 1].end}
                y2={bars[i - 1].end}
                stroke="var(--faint)"
                strokeDasharray="3 3"
                className="up"
                style={d(0.3 + i * 0.32)}
              />
            )}
            <rect
              x={x}
              y={b.y}
              width={w}
              height={b.h}
              rx="5"
              fill={b.dark ? "var(--ink)" : "#cfccc6"}
              className={b.dark ? "gy" : "gyt"}
              style={d(0.3 + i * 0.32)}
            />
            <text x={x + w / 2} y="238" textAnchor="middle" className="lbl">
              {b.l.split("|").map((t, k) => (
                <tspan key={t} x={x + w / 2} dy={k === 0 ? 0 : 12}>
                  {t}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
      <g className="pop" style={d(2.4)}>
        <rect x="262" y="18" width="126" height="26" rx="13" fill="#fff" stroke="var(--line)" />
        <text x="325" y="35" textAnchor="middle">
          ✓ traced to GL
        </text>
      </g>
      <text x="18" y="285" className="lbl">
        Working paper · AP · accruals · expenses
      </text>
    </svg>
  );
}

function ReconAnim() {
  const left = [32, 72, 112, 152, 192];
  const order = [1, 0, 3, 2, 4]; // ledger row each bank row matches
  return (
    <svg className="ca-svg" viewBox="0 0 400 300" aria-hidden="true">
      <text x="20" y="18" className="lbl">
        BANK STATEMENT
      </text>
      <text x="380" y="18" textAnchor="end" className="lbl">
        GENERAL LEDGER
      </text>
      {left.map((y, i) => (
        <g key={`b${i}`} className="up" style={d(0.1 + i * 0.08)}>
          <rect x="20" y={y} width="130" height="28" rx="7" fill="#fff" stroke="var(--line)" />
          <rect x="32" y={y + 11} width="70" height="6" rx="3" fill="#dcd9d3" />
          <rect x="112" y={y + 11} width="26" height="6" rx="3" fill="#bdbab4" />
        </g>
      ))}
      {left.map((y, i) => (
        <g key={`l${i}`} className="up" style={d(0.3 + i * 0.08)}>
          <rect x="250" y={y} width="130" height="28" rx="7" fill="#fff" stroke={i === 4 ? "var(--ink)" : "var(--line)"} strokeDasharray={i === 4 ? "4 3" : undefined} />
          <rect x="262" y={y + 11} width="26" height="6" rx="3" fill="#bdbab4" />
          <rect x="296" y={y + 11} width="56" height="6" rx="3" fill="#dcd9d3" />
        </g>
      ))}
      {order.map((j, i) =>
        i === 4 ? null : (
          <g key={`m${i}`}>
            <path
              d={`M150 ${left[i] + 14} C 200 ${left[i] + 14}, 200 ${left[j] + 14}, 250 ${left[j] + 14}`}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.3"
              className="draw"
              style={{ ...d(1 + i * 0.35), ["--len" as string]: 140 }}
            />
            <g className="pop" style={d(1.3 + i * 0.35)}>
              <circle cx="368" cy={left[j] + 14} r="8" fill="var(--ink)" />
              <path d={`M364.5 ${left[j] + 14} l2.5 2.5 l4.5 -5`} stroke="#fff" strokeWidth="1.6" fill="none" />
            </g>
          </g>
        ),
      )}
      <g className="pop" style={d(2.8)}>
        <rect x="20" y="238" width="104" height="26" rx="13" fill="var(--ink)" />
        <text x="72" y="255" textAnchor="middle" className="inv">
          Matched
        </text>
      </g>
      <g className="pop" style={d(3)}>
        <g className="blink" style={d(3.2)}>
          <rect x="132" y="238" width="118" height="26" rx="13" fill="#fff" stroke="var(--ink)" strokeDasharray="4 3" />
          <text x="191" y="255" textAnchor="middle">
            Follow-up
          </text>
        </g>
      </g>
      <text x="20" y="290" className="lbl">
        internal transfer · owner · expense
      </text>
    </svg>
  );
}

function AllocationAnim() {
  const rows = 5;
  const cols = 7;
  const projects: [string, number[]][] = [
    ["Project A", [0.46, 0.3, 0.24]],
    ["Project B", [0.38, 0.4, 0.22]],
    ["Project C", [0.52, 0.2, 0.28]],
  ];
  const shades = ["#0d0d0d", "#8f8c86", "#cfccc6"];
  return (
    <svg className="ca-svg" viewBox="0 0 400 300" aria-hidden="true">
      <text x="20" y="18" className="lbl">
        WEEKLY ATTENDANCE
      </text>
      {["M", "T", "W", "T", "F", "S", "S"].map((t, c) => (
        <text key={c} x={92 + c * 32 + 12} y="38" textAnchor="middle" className="lbl">
          {t}
        </text>
      ))}
      {Array.from({ length: rows }).map((_, r) => (
        <g key={r}>
          <text x="20" y={60 + r * 26} className="lbl">
            Worker {r + 1}
          </text>
          {Array.from({ length: cols }).map((__, c) => {
            const off = (r + c) % 6 === 5;
            const ot = r === 2 && c === 5;
            return (
              <rect
                key={c}
                x={92 + c * 32}
                y={46 + r * 26}
                width="24"
                height="20"
                rx="4"
                stroke="var(--line)"
                className="cell"
                style={{ ...d(0.2 + (r + c) * 0.06), ["--to" as string]: off ? "#fff" : ot ? "#8f8c86" : "#0d0d0d" }}
              />
            );
          })}
        </g>
      ))}
      <g className="pop" style={d(1.3)}>
        <rect x="318" y="96" width="70" height="22" rx="11" fill="#fff" stroke="var(--line)" />
        <text x="353" y="111" textAnchor="middle" className="lbl">
          + overtime
        </text>
      </g>
      <text x="20" y="200" className="lbl">
        LABOUR COST → PROJECTS
      </text>
      {projects.map(([p, parts], i) => {
        let x = 92;
        return (
          <g key={p}>
            <text x="20" y={222 + i * 24} className="lbl">
              {p}
            </text>
            {parts.map((f, k) => {
              const w = f * 290;
              const el = (
                <rect key={k} x={x} y={210 + i * 24} width={w - 2} height="16" rx="4" fill={shades[k]} className="gx" style={d(1.6 + i * 0.25 + k * 0.12)} />
              );
              x += w;
              return el;
            })}
          </g>
        );
      })}
    </svg>
  );
}

function Pph21Anim() {
  const bars: [string, number][] = [
    ["Payroll", 150],
    ["Coretax", 150],
    ["P&L expense", 128],
  ];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  return (
    <svg className="ca-svg" viewBox="0 0 400 300" aria-hidden="true">
      <line x1="20" y1="200" x2="230" y2="200" stroke="var(--line)" />
      {bars.map(([l, h], i) => (
        <g key={l}>
          <rect x={30 + i * 66} y={200 - h} width="46" height={h} rx="6" fill={i === 1 ? "var(--ink)" : "#cfccc6"} className="gy" style={d(0.3 + i * 0.25)} />
          <text x={53 + i * 66} y="216" textAnchor="middle" className="lbl">
            {l}
          </text>
        </g>
      ))}
      {/* difference bracket between Coretax and P&L */}
      <g className="up" style={d(1.4)}>
        <path d="M188 50 h12 v22 h-12" fill="none" stroke="var(--ink)" strokeWidth="1.4" />
        <text x="206" y="66" style={{ fontSize: 12 }}>
          Δ
        </text>
      </g>
      {["Component", "Difference", "Cause", "Follow-up"].map((t, i) => (
        <g key={t} className="up" style={d(1.7 + i * 0.22)}>
          <rect x="246" y={52 + i * 34} width="138" height="26" rx="8" fill="#fff" stroke="var(--line)" />
          <circle cx="262" cy={65 + i * 34} r="5" fill={i === 3 ? "#fff" : "var(--ink)"} stroke="var(--ink)" />
          <text x="276" y={69 + i * 34}>
            {t}
          </text>
        </g>
      ))}
      <text x="246" y="40" className="lbl">
        REVIEW, NOT UNDERPAYMENT
      </text>
      {months.map((m, i) => (
        <g key={m} className="pop" style={d(2.6 + i * 0.12)}>
          <rect x={22 + i * 46} y="246" width="38" height="24" rx="7" fill="var(--ink)" />
          <text x={41 + i * 46} y="262" textAnchor="middle" className="inv" style={{ fontSize: 10 }}>
            {m}
          </text>
        </g>
      ))}
      <text x="20" y="238" className="lbl">
        COMPARED PER PERIOD · 2026
      </text>
    </svg>
  );
}

const ANIMS: Record<CaseStudy["anim"], () => React.JSX.Element> = {
  erp: ErpAnim,
  statements: StatementsAnim,
  jurisdiction: JurisdictionAnim,
  projects: ProjectsAnim,
  waterfall: WaterfallAnim,
  recon: ReconAnim,
  allocation: AllocationAnim,
  pph21: Pph21Anim,
};

/* ------------------------------------------------------------------ balance equation */
function Balance() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<SVGGElement>(null);
  const leftRef = useRef<SVGGElement>(null);
  const rightRef = useRef<SVGGElement>(null);

  useScrollProgress(
    wrapRef,
    (p) => {
      const k = prefersReducedMotion() ? 1 : Math.min(1, p * 1.6);
      const a = -10 * (1 - k); // degrees; left (Assets) starts heavier
      const dy = Math.sin((a * Math.PI) / 180) * 120;
      beamRef.current?.setAttribute("transform", `rotate(${a.toFixed(2)} 180 46)`);
      leftRef.current?.setAttribute("transform", `translate(0 ${(-dy).toFixed(2)})`);
      rightRef.current?.setAttribute("transform", `translate(0 ${dy.toFixed(2)})`);
      wrapRef.current?.classList.toggle("is-ok", k > 0.97);
    },
    0.95,
  );

  return (
    <div className="bal rv" ref={wrapRef} style={{ ["--i" as string]: 2 }}>
      <svg viewBox="0 0 360 200" role="img" aria-label="A balance: Assets on one side, Liabilities plus Equity on the other, levelling out.">
        <path d="M180 46 V176 M140 186 H220 M152 176 H208" stroke="var(--ink)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="180" cy="46" r="6" fill="var(--ink)" />
        <g ref={beamRef}>
          <line x1="60" y1="46" x2="300" y2="46" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g ref={leftRef}>
          <path d="M60 46 L28 112 M60 46 L92 112" stroke="var(--faint)" strokeWidth="1" />
          <path d="M20 112 H100 Q60 138 20 112 Z" fill="var(--ink)" />
          <text x="60" y="160" textAnchor="middle">
            Assets
          </text>
        </g>
        <g ref={rightRef}>
          <path d="M300 46 L268 112 M300 46 L332 112" stroke="var(--faint)" strokeWidth="1" />
          <path d="M260 112 H340 Q300 138 260 112 Z" fill="#bdbab4" />
          <text x="300" y="160" textAnchor="middle">
            Liabilities + Equity
          </text>
        </g>
        <text x="180" y="30" textAnchor="middle" className="mono">
          A = L + E
        </text>
      </svg>
      <div className="bal-cap">
        <span>Scroll to balance</span>
        <span className="bal-ok">Balanced ✓</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ section */
export default function CaseStudies() {
  const listRef = useRef<HTMLOListElement>(null);

  /* play each animation once its card is in view */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>(".case"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-play");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 },
    );
    cards.forEach((c) => io.observe(c));

    /* stacked-card depth: a card shrinks slightly as the next one slides over it */
    let raf = 0;
    const tick = () => {
      raf = 0;
      const sticky = getComputedStyle(cards[0]).position === "sticky";
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!sticky || !next) {
          c.style.transform = "";
          c.style.setProperty("--cover", "0");
          return;
        }
        const r = c.getBoundingClientRect();
        const n = next.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, 1 - (n.top - r.top) / Math.max(1, r.height)));
        c.style.transform = `scale(${(1 - p * 0.05).toFixed(4)})`;
        c.style.setProperty("--cover", p.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="cases" className="section" aria-labelledby="cases-title">
      <style href="cases" precedence="component">
        {css}
      </style>
      <div className="wrap">
        <div className="cs-head">
          <div>
            <p className="tag rv">
              <b>{sectionIndex("cases")}</b> — Case studies
            </p>
            <h2 className="h2 rv-mask" id="cases-title" style={{ marginTop: 18 }}>
              <span>
                Every number, traced to its <em>source.</em>
              </span>
            </h2>
            <p className="cs-lede rv" style={{ ["--i" as string]: 1 }}>
              Four challenging cases — custom ERP, Amazon seller accounting, Singapore reporting and construction project
              finance — then everyday engagements. They show depth, not the limits of what I take on. Animations
              illustrate the process only.
            </p>
            <div className="cs-actions rv" style={{ ["--i" as string]: 2 }}>
              <BriefcaseButton className="btn btn-primary" />
            </div>
          </div>
          <Balance />
        </div>

        <ol className="cs-list" ref={listRef}>
          {CASES.map((c, i) => {
            const Anim = ANIMS[c.anim];
            return (
              <li
                key={c.id}
                className="case"
                data-case={c.id}
                data-index={i}
                style={{ ["--i" as string]: i }}
                aria-labelledby={`case-${c.id}`}
              >
                <div className="case-in">
                  <div className="case-txt">
                    <p className="case-top">
                      <span>
                        <b>{String(i + 1).padStart(2, "0")}</b> / {String(CASES.length).padStart(2, "0")}
                        {c.flagship && <em className="flag">Selected challenging case</em>}
                      </span>
                      <span>{c.industry}</span>
                    </p>
                    <h3 id={`case-${c.id}`}>{c.title}</h3>
                    <dl className="case-meta">
                      <div>
                        <dt>Scope</dt>
                        <dd>{c.scope}</dd>
                      </div>
                      <div>
                        <dt>My role</dt>
                        <dd>{c.role}</dd>
                      </div>
                    </dl>
                    <dl className="case-body">
                      <div>
                        <dt>Challenge</dt>
                        <dd>{c.challenge}</dd>
                      </div>
                      <div>
                        <dt>Contribution</dt>
                        <dd>{c.contribution}</dd>
                      </div>
                      <div>
                        <dt>Deliverables</dt>
                        <dd>{c.deliverables}</dd>
                      </div>
                      <div>
                        <dt>Result</dt>
                        <dd>{c.result}</dd>
                      </div>
                      {c.status && (
                        <div>
                          <dt>Status</dt>
                          <dd className="status">
                            <span>
                              <i className="dot on" /> Live — {c.status.live}
                            </span>
                            <span>
                              <i className="dot" /> In progress — {c.status.next}
                            </span>
                          </dd>
                        </div>
                      )}
                      {c.beforeAfter && (
                        <div>
                          <dt>Before → after</dt>
                          <dd>
                            {c.beforeAfter.before} → <strong>{c.beforeAfter.after}</strong>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <div className="ca-stage">
                    <Anim />
                    <span className="ca-tag">Illustrative animation</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
