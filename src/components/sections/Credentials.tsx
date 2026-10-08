import { CREDENTIALS, sectionIndex } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.certs{background:var(--card);border-block:1px solid var(--line)}
.certs-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,6vw,96px);align-items:start}
.certs-left{position:sticky;top:120px}
.certs-count{margin-top:22px;font-family:var(--font-mono);font-size:12.5px;color:var(--mute);text-transform:uppercase;line-height:1.8}
.certs-count b{color:var(--ink);font-weight:500}
.certs-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.cert{position:relative;display:grid;grid-template-columns:52px minmax(0,1fr) auto;align-items:center;gap:18px;padding:18px 18px;border-bottom:1px solid var(--line);
  isolation:isolate;overflow:hidden;outline:none;
  transition:color .5s var(--ease),opacity .9s var(--ease) calc(var(--i,0)*70ms),transform 1.1s var(--ease) calc(var(--i,0)*70ms)}
.cert::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease)}
.cert:hover::before,.cert:focus-visible::before{transform:scaleX(1)}
.cert:hover,.cert:focus-visible{color:#fff}
.cert-n{font-family:var(--font-mono);font-size:12px;color:var(--mute);transition:color .5s var(--ease)}
.certs-groups{display:grid;gap:40px}
.certs-h{font-family:var(--font-mono);font-weight:500;font-size:12px;text-transform:uppercase;color:var(--mute);margin-bottom:10px}
.cert-t{font-weight:600;font-size:clamp(16px,1.4vw,20px);letter-spacing:-.03em;line-height:1.15}
.cert-i{display:block;margin-top:5px;font-family:var(--font-mono);font-size:11.5px;color:var(--mute);text-transform:uppercase;transition:color .5s var(--ease)}
.cert:hover .cert-n,.cert:hover .cert-i,.cert:focus-visible .cert-n,.cert:focus-visible .cert-i{color:rgba(255,255,255,.6)}
.cert-arr{font-size:20px;transform:translateX(-14px);opacity:0;transition:transform .6s var(--ease),opacity .5s var(--ease)}
.cert:hover .cert-arr,.cert:focus-visible .cert-arr{transform:none;opacity:1}
@media (max-width: 860px){
  .certs-grid{grid-template-columns:minmax(0,1fr)}
  .certs-left{position:relative;top:0}
  .cert{grid-template-columns:40px minmax(0,1fr) auto;padding:20px 8px;gap:12px}
}
}
`;

export default function Credentials() {
  const count = (id: string) => CREDENTIALS.find((g) => g.id === id)?.items.length ?? 0;
  let n = 0;
  return (
    <section id="credentials" className="section certs" aria-labelledby="certs-title">
      <style href="certs" precedence="component">
        {css}
      </style>
      <div className="wrap certs-grid">
        <div className="certs-left">
          <SectionHead index={sectionIndex("credentials")} label="Credentials" title="Always" accent="learning." id="certs-title" />
          <p className="certs-count rv" style={{ ["--i" as string]: 2 }}>
            <b>{String(count("qualifications")).padStart(2, "0")}</b> professional qualifications
            <br />
            <b>{String(count("training")).padStart(2, "0")}</b> training programmes, incl. ongoing learning
            <br />
            <b>{String(count("publications")).padStart(2, "0")}</b> publications &amp; teaching works
            <br />
            <b>{String(count("awards")).padStart(2, "0")}</b> awards and honours
          </p>
        </div>
        <div className="certs-groups">
          {CREDENTIALS.map((g) => (
            <div key={g.id} className="certs-group">
              <h3 className="certs-h rv">{g.title}</h3>
              <ol className="certs-list">
                {g.items.map((c) => {
                  n += 1;
                  const meta = [c.issuer, c.year].filter(Boolean).join(" · ");
                  return (
                    <li key={c.title} className="cert rv" tabIndex={0} style={{ ["--i" as string]: n % 6 }}>
                      <span className="cert-n" aria-hidden="true">
                        {String(n).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="cert-t">{c.title}</span>
                        {(meta || c.note) && (
                          <span className="cert-i">
                            {meta}
                            {meta && c.note ? " · " : ""}
                            {c.note}
                          </span>
                        )}
                      </span>
                      <span className="cert-arr" aria-hidden="true">
                        →
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
