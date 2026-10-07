/**
 * Grayscale, pure CSS/JSX sketches that hint at each area of practice.
 * They are labelled "Illustrative UI" on screen and contain no real client data
 * and no figures — only shapes and generic labels.
 */
import type { Project } from "@/lib/data";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.mui{position:relative;height:100%;min-height:260px;border-radius:18px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;
  display:flex;flex-direction:column;font-size:11px;color:var(--ink-2)}
.mui-bar{display:flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-bottom:1px solid var(--line);background:rgba(255,255,255,.6)}
.mui-bar i{width:8px;height:8px;border-radius:50%;background:var(--soft);box-shadow:inset 0 0 0 1px rgba(13,13,13,.12)}
.mui-bar span{margin-left:8px;font-family:var(--font-mono);font-size:10px;color:var(--mute);text-transform:uppercase}
.mui-body{flex:1;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:0}
.sk{display:block;height:7px;border-radius:4px;background:#dcd9d3}
.sk.d{background:#bdbab4}
.sk.k{background:var(--ink)}
.mui-row{display:flex;align-items:center;gap:10px}
.mui-row .sk{flex:1}
.mui-card{background:#fff;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line);padding:12px}
.mui-label{font-family:var(--font-mono);font-size:9.5px;text-transform:uppercase;color:var(--mute)}
.mui-bars{display:flex;align-items:flex-end;gap:6px;height:84px}
.mui-bars span{flex:1;border-radius:5px 5px 2px 2px;background:#cfccc6;transform-origin:bottom;animation:grow 1.2s var(--ease) both;animation-delay:calc(var(--k)*70ms + .35s)}
.mui-bars span:nth-child(3n){background:var(--ink)}
@keyframes grow{from{transform:scaleY(0)}}
.mui-tick{width:16px;height:16px;border-radius:50%;background:var(--ink);display:grid;place-items:center;flex:none}
.mui-tick::after{content:"";width:6px;height:3px;border-left:1.5px solid #fff;border-bottom:1.5px solid #fff;transform:rotate(-45deg) translate(1px,-1px)}
.mui-tick.o{background:transparent;box-shadow:inset 0 0 0 1.5px var(--faint)}
.mui-tick.o::after{display:none}
.mui-pill{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;font-family:var(--font-mono);font-size:9px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.mui-pill.k{background:var(--ink);color:#fff;box-shadow:none}
.mui-cal{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;flex:1}
.mui-cal div{border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);padding:8px;display:flex;flex-direction:column;gap:5px;justify-content:space-between}
.mui-cal b{font-family:var(--font-mono);font-weight:500;font-size:9.5px;color:var(--mute)}
.mui-cal .is-done{background:var(--ink);color:#fff}
.mui-cal .is-done b{color:rgba(255,255,255,.6)}
.mui-recon{display:grid;grid-template-columns:1fr 46px 1fr;gap:0;flex:1;align-items:start}
.mui-recon .col{display:grid;gap:7px}
.mui-recon .ln{position:relative;height:100%;}
.mui-recon .ln svg{width:100%;height:100%}
.mui-recon .ln path{stroke:var(--ink);stroke-width:1.2;fill:none;stroke-dasharray:60;stroke-dashoffset:60;animation:draw 1.4s var(--ease) forwards;animation-delay:calc(var(--k)*120ms + .4s)}
@keyframes draw{to{stroke-dashoffset:0}}
.mui-recon .cell{height:24px;border-radius:7px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);display:flex;align-items:center;padding:0 8px;gap:6px}
.mui-recon .cell .sk{flex:1}
.mui-flow{position:relative;flex:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:1fr 1fr;gap:18px 26px;align-items:center}
.mui-node{position:relative;z-index:1;border-radius:12px;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 8px 18px -12px rgba(13,13,13,.4);padding:10px;display:grid;gap:6px}
.mui-node.k{background:var(--ink);color:#fff}
.mui-node.k .mui-label{color:rgba(255,255,255,.6)}
.mui-flow svg{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.mui-flow svg path{fill:none;stroke:var(--faint);stroke-width:1.2;stroke-dasharray:4 5;animation:dash 1.4s linear infinite}
@keyframes dash{to{stroke-dashoffset:-18}}
.mui-apps{display:grid;grid-template-columns:110px minmax(0,1fr);flex:1;min-height:0}
.mui-side{border-right:1px solid var(--line);padding:12px 10px;display:grid;align-content:start;gap:4px;background:rgba(255,255,255,.5)}
.mui-side span{padding:7px 9px;border-radius:8px;font-size:10.5px;font-weight:500}
.mui-side span.on{background:var(--ink);color:#fff}
.mui-book{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:0;padding:18px;perspective:900px}
.mui-page{background:#fff;box-shadow:inset 0 0 0 1px var(--line);padding:16px 14px;display:flex;flex-direction:column;gap:8px}
.mui-page:first-child{border-radius:12px 2px 2px 12px;transform:rotateY(8deg);transform-origin:right}
.mui-page:last-child{border-radius:2px 12px 12px 2px;transform:rotateY(-8deg);transform-origin:left}
.mui-att{display:grid;grid-template-columns:70px repeat(7,minmax(0,1fr));gap:4px;font-family:var(--font-mono);font-size:9px;color:var(--mute)}
.mui-att i{height:18px;border-radius:4px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);animation:cellin .5s var(--ease) both;animation-delay:calc(var(--k)*28ms + .3s)}
.mui-att i.on{background:var(--ink);box-shadow:none}
.mui-att i.half{background:#bdbab4;box-shadow:none}
@keyframes cellin{from{opacity:0;transform:scale(.6)}}
.mui-stack{display:flex;height:16px;border-radius:5px;overflow:hidden;flex:1}
.mui-stack span{height:100%;transform-origin:left;animation:growx 1.1s var(--ease) both;animation-delay:calc(var(--k)*120ms + .6s)}
@keyframes growx{from{transform:scaleX(0)}}
.mui-erp{position:relative;flex:1;display:grid;place-items:center;min-height:200px}
.mui-erp svg{position:absolute;inset:0;width:100%;height:100%}
.mui-erp svg path{fill:none;stroke:var(--faint);stroke-width:1.2;stroke-dasharray:4 5;animation:dash 1.6s linear infinite}
.mui-erp .hub{position:relative;z-index:1;width:74px;height:74px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-weight:700;letter-spacing:-.03em;font-size:15px;box-shadow:0 0 0 10px rgba(13,13,13,.06)}
.mui-erp .mod{position:absolute;z-index:1;padding:6px 10px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 6px 14px -10px rgba(13,13,13,.5);font-size:10.5px;font-weight:600;color:var(--ink)}
.mui-erp .co{position:absolute;z-index:1;bottom:10px;padding:5px 9px;border-radius:8px;background:var(--soft);font-family:var(--font-mono);font-size:9px;color:var(--ink-2)}
.mui-pages{position:relative;flex:1;min-height:200px}
.mui-pages .pg{position:absolute;width:44%;height:72%;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1px var(--line),0 10px 20px -14px rgba(13,13,13,.45);padding:10px;display:flex;flex-direction:column;gap:6px;animation:pgin .8s var(--ease) both}
.mui-pages .pg b{font-family:var(--font-mono);font-weight:500;font-size:9px;text-transform:uppercase;color:var(--mute)}
@keyframes pgin{from{opacity:0;transform:translateY(16px) rotate(-3deg)}}
.mui-page h5{font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:18px;line-height:1.05;color:var(--ink)}
}
`;

function Bar({ title }: { title: string }) {
  return (
    <div className="mui-bar" aria-hidden="true">
      <i />
      <i />
      <i />
      <span>{title}</span>
    </div>
  );
}

function Row({ r }: { r: number }) {
  const pattern = ["on", "on", "on", "on", "on", "half", ""];
  return (
    <>
      <span>Worker {r + 1}</span>
      {pattern.map((c, i) => (
        <i key={i} className={(r + i) % 6 === 5 ? "half" : c} style={{ ["--k" as string]: r * 7 + i }} />
      ))}
    </>
  );
}

const sk = (w: string, cls = "") => <span className={`sk ${cls}`} style={{ width: w }} />;

export function MiniUI({ kind, title }: { kind: Project["ui"]; title: string }) {
  let body: React.ReactNode = null;
  switch (kind) {
    case "ledger":
      body = (
        <>
          <Bar title="Monthly close" />
          <div className="mui-body">
            <div className="mui-card">
              <p className="mui-label">Statement</p>
              <div className="mui-bars" style={{ marginTop: 10 }}>
                {[46, 62, 38, 70, 55, 82, 64, 74, 58, 88].map((h, k) => (
                  <span key={k} style={{ height: `${h}%`, ["--k" as string]: k }} />
                ))}
              </div>
            </div>
            {["Revenue", "Cost of sales", "Operating expenses", "Tax"].map((l, i) => (
              <div className="mui-row" key={l}>
                <span className="mui-label" style={{ width: 120 }}>
                  {l}
                </span>
                {sk("100%")}
                {sk(`${30 + i * 8}px`, "d")}
              </div>
            ))}
          </div>
        </>
      );
      break;
    case "recon":
      body = (
        <>
          <Bar title="Reconciliation" />
          <div className="mui-body">
            <div className="mui-row" style={{ justifyContent: "space-between" }}>
              <span className="mui-label">Bank statement</span>
              <span className="mui-pill k">Matched</span>
              <span className="mui-label">General ledger</span>
            </div>
            <div className="mui-recon">
              <div className="col">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div className="cell" key={i}>
                    {sk("100%")}
                    {sk("26px", "d")}
                  </div>
                ))}
              </div>
              <div className="ln" aria-hidden="true">
                <svg viewBox="0 0 46 186" preserveAspectRatio="none">
                  {[[12, 12], [43, 74], [74, 43], [105, 105], [136, 167], [167, 136]].map(([a, b], k) => (
                    <path key={k} d={`M0 ${a} C 23 ${a}, 23 ${b}, 46 ${b}`} style={{ ["--k" as string]: k }} />
                  ))}
                </svg>
              </div>
              <div className="col">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div className="cell" key={i}>
                    <span className={`mui-tick ${i === 4 ? "o" : ""}`} />
                    {sk("100%")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );
      break;
    case "tax":
      body = (
        <>
          <Bar title="Tax calendar" />
          <div className="mui-body">
            <div className="mui-row" style={{ gap: 6 }}>
              <span className="mui-pill k">PPN</span>
              <span className="mui-pill">PPh</span>
              <span className="mui-pill">PPh Badan</span>
              <span className="mui-pill">SPT Tahunan</span>
            </div>
            <div className="mui-cal">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                <div key={m} className={i < 7 ? "is-done" : ""}>
                  <b>{m}</b>
                  {sk(i < 7 ? "70%" : "50%", i < 7 ? "d" : "")}
                </div>
              ))}
            </div>
          </div>
        </>
      );
      break;
    case "audit":
      body = (
        <>
          <Bar title="Review checklist" />
          <div className="mui-body">
            {["SOP walkthrough", "Internal controls", "Supporting documents", "Accounting risk", "Tax risk", "Staff work reviewed"].map(
              (l, i) => (
                <div className="mui-card mui-row" key={l} style={{ padding: "9px 12px" }}>
                  <span className={`mui-tick ${i > 3 ? "o" : ""}`} />
                  <span style={{ fontWeight: 500, fontSize: 11.5, flex: "none" }}>{l}</span>
                  {sk("100%")}
                </div>
              ),
            )}
          </div>
        </>
      );
      break;
    case "flow":
      body = (
        <>
          <Bar title="Automation workflow" />
          <div className="mui-body">
            <div className="mui-flow">
              <svg viewBox="0 0 300 160" preserveAspectRatio="none" aria-hidden="true">
                <path d="M60 40 H150 M150 40 H250 M250 40 C 280 80, 280 90, 250 120 M250 120 H150 M150 120 H60" />
              </svg>
              {[
                ["Input", "Documents"],
                ["AI", "Draft"],
                ["Check", "Quality control"],
                ["SOP", "Knowledge base"],
                ["Review", "Accountant"],
                ["Output", "Report"],
              ].map(([a, b], i) => (
                <div key={a} className={`mui-node ${i === 1 || i === 4 ? "k" : ""}`}>
                  <span className="mui-label">{a}</span>
                  <span style={{ fontWeight: 600, fontSize: 11.5 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      );
      break;
    case "apps":
      body = (
        <>
          <Bar title="Cloud accounting" />
          <div className="mui-apps">
            <div className="mui-side">
              {["Accurate", "Mekari Jurnal", "MYOB", "Zahir"].map((a, i) => (
                <span key={a} className={i === 0 ? "on" : ""}>
                  {a}
                </span>
              ))}
            </div>
            <div className="mui-body">
              <div className="mui-row">
                <span className="mui-pill k">Transactions</span>
                <span className="mui-pill">Reports</span>
                <span className="mui-pill">Documents</span>
              </div>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div className="mui-row" key={i}>
                  <span className={`mui-tick ${i % 3 === 2 ? "o" : ""}`} />
                  {sk("100%")}
                  {sk("40px", "d")}
                </div>
              ))}
            </div>
          </div>
        </>
      );
      break;
    case "payroll":
      body = (
        <>
          <Bar title="Weekly attendance" />
          <div className="mui-body">
            <div className="mui-att">
              <span />
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} style={{ textAlign: "center" }}>
                  {d}
                </span>
              ))}
              {[0, 1, 2, 3, 4].map((r) => (
                <Row key={r} r={r} />
              ))}
            </div>
            <p className="mui-label" style={{ marginTop: 6 }}>
              Labour cost → projects
            </p>
            {["Week A", "Week B", "Week C"].map((w, i) => (
              <div className="mui-row" key={w}>
                <span className="mui-label" style={{ width: 56 }}>
                  {w}
                </span>
                <span className="mui-stack">
                  {[[45, "#0d0d0d"], [30, "#8f8c86"], [25, "#cfccc6"]].map(([pc, c], k) => (
                    <span key={k} style={{ width: `${(pc as number) - i * 3 + k * 3}%`, background: c as string, ["--k" as string]: k + i }} />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </>
      );
      break;
    case "erp":
      body = (
        <>
          <Bar title="ERP modules" />
          <div className="mui-body">
            <div className="mui-erp">
              <svg viewBox="0 0 300 220" preserveAspectRatio="none" aria-hidden="true">
                <path d="M150 110 L60 40 M150 110 L240 40 M150 110 L50 120 M150 110 L250 120 M150 110 L60 200 M150 110 L150 200 M150 110 L240 200" />
              </svg>
              <span className="hub">ERP</span>
              <span className="mod" style={{ left: "6%", top: "10%" }}>Accounting</span>
              <span className="mod" style={{ right: "6%", top: "10%" }}>Finance</span>
              <span className="mod" style={{ left: "2%", top: "46%" }}>Invoicing</span>
              <span className="mod" style={{ right: "4%", top: "46%" }}>HRD</span>
              <span className="co" style={{ left: "10%" }}>Company 1</span>
              <span className="co" style={{ left: "50%", transform: "translateX(-50%)" }}>Company 2</span>
              <span className="co" style={{ right: "10%" }}>Company 3</span>
            </div>
          </div>
        </>
      );
      break;
    case "amazon":
      body = (
        <>
          <Bar title="Marketplace → statements" />
          <div className="mui-body">
            <div className="mui-pages">
              {["Report data", "Financial position", "Profit or loss", "Notes"].map((t, i) => (
                <div
                  key={t}
                  className="pg"
                  style={{ left: `${4 + i * 17}%`, top: `${4 + i * 7}%`, animationDelay: `${0.3 + i * 0.18}s`, zIndex: i }}
                >
                  <b>{t}</b>
                  {sk("90%", i === 0 ? "d" : "")}
                  {sk("70%")}
                  {sk("80%")}
                  {sk("55%", i === 3 ? "k" : "")}
                </div>
              ))}
            </div>
          </div>
        </>
      );
      break;
    case "book":
      body = (
        <>
          <Bar title="Module book" />
          <div className="mui-book">
            <div className="mui-page">
              <span className="mui-label">Taxation</span>
              <h5>Pembelajaran Pajak Terapan</h5>
              {sk("90%")}
              {sk("70%")}
              {sk("80%")}
            </div>
            <div className="mui-page">
              <span className="mui-label">Studi kasus</span>
              {sk("100%")}
              {sk("88%")}
              {sk("94%")}
              {sk("60%", "d")}
              {sk("85%")}
              {sk("72%")}
            </div>
          </div>
        </>
      );
      break;
  }
  return (
    <div className="mui" role="img" aria-label={`Illustrative sketch for ${title}; not a real screenshot.`}>
      <style href="mini-ui" precedence="component">
        {css}
      </style>
      {body}
    </div>
  );
}
