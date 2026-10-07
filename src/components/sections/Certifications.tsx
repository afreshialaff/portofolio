import { CERTIFICATIONS } from "@/lib/data";
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
.cert{position:relative;display:grid;grid-template-columns:52px minmax(0,1fr) auto;align-items:center;gap:18px;padding:24px 18px;border-bottom:1px solid var(--line);
  isolation:isolate;overflow:hidden;outline:none;
  transition:color .5s var(--ease),opacity .9s var(--ease) calc(var(--i,0)*70ms),transform 1.1s var(--ease) calc(var(--i,0)*70ms)}
.cert::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease)}
.cert:hover::before,.cert:focus-visible::before{transform:scaleX(1)}
.cert:hover,.cert:focus-visible{color:#fff}
.cert-n{font-family:var(--font-mono);font-size:12px;color:var(--mute);transition:color .5s var(--ease)}
.cert-t{font-weight:600;font-size:clamp(18px,1.7vw,24px);letter-spacing:-.03em;line-height:1.15}
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

export default function Certifications() {
  const certs = CERTIFICATIONS.filter((c) => c.kind === "Certification").length;
  const trainings = CERTIFICATIONS.length - certs;
  return (
    <section id="certifications" className="section certs" aria-labelledby="certs-title">
      <style href="certs" precedence="component">
        {css}
      </style>
      <div className="wrap certs-grid">
        <div className="certs-left">
          <SectionHead index="04" label="Certifications" title="Always" accent="learning." id="certs-title" />
          <p className="certs-count rv" style={{ ["--i" as string]: 2 }}>
            <b>{String(certs).padStart(2, "0")}</b> professional certifications
            <br />
            <b>{String(trainings).padStart(2, "0")}</b> training programmes through ACCA
          </p>
        </div>
        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} className="cert rv" tabIndex={0} style={{ ["--i" as string]: i }}>
              <span className="cert-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="cert-t">{c.title}</span>
                <span className="cert-i">
                  {c.kind}
                  {c.issuer ? ` · ${c.issuer}` : ""}
                </span>
              </span>
              <span className="cert-arr" aria-hidden="true">
                →
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
