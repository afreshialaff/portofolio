"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CASES } from "@/lib/data";
import { formatBytes, type PublicItem } from "@/lib/briefcase/config";
import { STATIC_ITEMS, type StaticItem } from "@/lib/briefcase/static";
import { lockScroll, scrollToCase } from "@/lib/scroll";
import { BriefcaseIcon } from "./BriefcaseIcon";
import { OPEN_EVENT } from "./BriefcaseButton";

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.bc-veil{position:fixed;inset:0;z-index:80;background:rgba(13,13,13,.28);opacity:0;pointer-events:none;transition:opacity .5s var(--ease)}
.bc-veil.is-open{opacity:1;pointer-events:auto}
.bc{position:fixed;top:0;right:0;bottom:0;z-index:81;width:min(980px,100vw);background:var(--paper);display:flex;flex-direction:column;
  box-shadow:-30px 0 80px -30px rgba(13,13,13,.4);transform:translateX(102%);visibility:hidden;
  transition:transform .8s var(--ease),visibility 0s linear .8s}
.bc.is-open{transform:none;visibility:visible;transition:transform .8s var(--ease),visibility 0s}
.bc-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px clamp(18px,3vw,36px);border-bottom:1px solid var(--line)}
.bc-title{display:flex;align-items:center;gap:12px}
.bc-title span.ic{width:44px;height:44px;border-radius:14px;background:var(--ink);color:#fff;display:grid;place-items:center}
.bc-title h2{font-weight:700;font-size:24px;letter-spacing:-.04em;line-height:1}
.bc-title p{margin-top:4px;font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--mute)}
.bc-close{height:42px;padding:0 16px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);font-size:14px;font-weight:500}
.bc-tools{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:16px clamp(18px,3vw,36px) 0}
.bc-search{flex:1 1 220px;height:40px;border-radius:999px;border:0;box-shadow:inset 0 0 0 1px rgba(13,13,13,.16);background:#fff;padding:0 16px;font:inherit;font-size:14px}
.bc-search:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.bc-chip{height:34px;padding:0 13px;border-radius:999px;font-size:13px;font-weight:500;color:var(--ink-2);box-shadow:inset 0 0 0 1px rgba(13,13,13,.14)}
.bc-chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.bc-body{flex:1;overflow:auto;padding:18px clamp(18px,3vw,36px) 36px}
.bc-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.bc-card{display:flex;flex-direction:column;height:100%;border-radius:22px;background:var(--card);box-shadow:var(--hair);overflow:hidden}
.bc-prev{position:relative;aspect-ratio:16/10;background:var(--soft);display:grid;place-items:center;overflow:hidden}
.bc-prev img,.bc-prev video{width:100%;height:100%;object-fit:cover;background:#fff}
.bc-file{display:grid;place-items:center;gap:6px;text-align:center;color:var(--ink-2)}
.bc-file b{font-family:var(--font-mono);font-size:22px;font-weight:600;letter-spacing:.04em}
.bc-file small{font-size:12px;color:var(--mute)}
.bc-lab{position:absolute;left:10px;top:10px;padding:4px 9px;border-radius:999px;background:rgba(255,255,255,.92);box-shadow:inset 0 0 0 1px var(--line);
  font-family:var(--font-mono);font-size:10px;text-transform:uppercase}
.bc-info{display:flex;flex-direction:column;gap:8px;padding:16px 18px 18px;flex:1}
.bc-cat{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--mute)}
.bc-info h3{font-weight:700;font-size:18px;letter-spacing:-.035em;line-height:1.15}
.bc-info dl{margin:0;display:grid;gap:6px}
.bc-info dt{font-family:var(--font-mono);font-size:10px;text-transform:uppercase;color:var(--mute)}
.bc-info dd{margin:0;font-size:13.5px;line-height:1.45;color:var(--ink-2)}
.bc-act{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:8px}
.bc-act .btn{height:38px;padding:0 15px;font-size:13px}
.bc-empty{display:grid;place-items:center;text-align:center;gap:12px;padding:80px 20px;color:var(--mute)}
.bc-empty span{width:64px;height:64px;border-radius:20px;display:grid;place-items:center;background:var(--card);box-shadow:var(--hair);color:var(--ink)}
.bc-empty p{font-size:16px;color:var(--ink-2)}
@media (max-width: 720px){ .bc-grid{grid-template-columns:minmax(0,1fr)} .bc-title h2{font-size:20px} }
}
`;

type Load = "idle" | "loading" | "ready" | "error";
type Item = PublicItem & Partial<Pick<StaticItem, "href" | "preview" | "pdf">>;

const EXT: Record<string, string> = { spreadsheet: "XLSX / CSV", document: "DOCX", pdf: "PDF" };

export default function BriefcaseDrawer() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<Load>("idle");
  const [items, setItems] = useState<Item[]>(STATIC_ITEMS);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const load = useCallback(async () => {
    setState("loading");
    try {
      const res = await fetch("/api/briefcase/items", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { items: PublicItem[] };
      setItems([...STATIC_ITEMS, ...(Array.isArray(data.items) ? data.items : [])]);
      setState("ready");
    } catch {
      // No backend reachable (e.g. not configured) — show the tidy empty state, never an error wall.
      setItems(STATIC_ITEMS);
      setState("ready");
    }
  }, []);

  useEffect(() => {
    const onOpen = () => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setState("idle"); // always show the latest published items
      setOpen(true);
    };
    const onHash = () => window.location.hash === "#briefcase" && onOpen();
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    if (open && state === "idle") load();
  }, [open, state, load]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const t = window.setTimeout(() => closeRef.current?.focus(), 200);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open]);

  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))], [items]);
  const shown = items.filter((i) => {
    if (cat !== "All" && i.category !== cat) return false;
    if (!q.trim()) return true;
    const hay = `${i.title} ${i.category} ${i.contribution} ${i.result}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <>
      <style href="briefcase" precedence="component">
        {css}
      </style>
      <div className={`bc-veil ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside
        className={`bc ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bc-title"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
      >
        <div className="bc-head">
          <div className="bc-title">
            <span className="ic">
              <BriefcaseIcon size={22} />
            </span>
            <div>
              <h2 id="bc-title">Portfolio Briefcase</h2>
              <p>Published work samples</p>
            </div>
          </div>
          <button ref={closeRef} type="button" className="bc-close" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>

        {items.length > 0 && (
          <div className="bc-tools">
            <input
              className="bc-search"
              type="search"
              placeholder="Search work samples"
              aria-label="Search work samples"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div role="group" aria-label="Filter by category" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cats.map((c) => (
                <button key={c} type="button" className="bc-chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bc-body">
          {state === "loading" && <p className="bc-empty">Loading…</p>}
          {state === "ready" && items.length === 0 && (
            <div className="bc-empty">
              <span>
                <BriefcaseIcon size={28} />
              </span>
              <p>Work samples will be added here.</p>
            </div>
          )}
          {state === "ready" && items.length > 0 && shown.length === 0 && (
            <div className="bc-empty">
              <p>No samples match this search.</p>
            </div>
          )}
          {shown.length > 0 && (
            <ul className="bc-grid">
              {shown.map((it) => {
                const file = it.href ?? `/api/briefcase/file/${it.id}`;
                const related = it.case_id ? CASES.find((c) => c.id === it.case_id) : undefined;
                return (
                  <li key={it.id}>
                    <article className="bc-card">
                      <div className="bc-prev">
                        {it.preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={it.preview} alt={`Preview of ${it.title} — ${it.label}`} loading="lazy" decoding="async" />
                        ) : it.file_kind === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={file} alt={`${it.title} — ${it.label}`} loading="lazy" decoding="async" />
                        ) : it.file_kind === "video" ? (
                          <video src={file} controls preload="metadata" playsInline aria-label={it.title} />
                        ) : (
                          <div className="bc-file">
                            <b>{EXT[it.file_kind] ?? it.file_kind.toUpperCase()}</b>
                            <small>
                              {it.file_kind === "pdf" ? "Opens in a new tab" : "No preview — download to view"} · {formatBytes(it.file_size)}
                            </small>
                          </div>
                        )}
                        <span className="bc-lab">{it.label}</span>
                      </div>
                      <div className="bc-info">
                        <p className="bc-cat">{it.category}</p>
                        <h3>{it.title}</h3>
                        <dl>
                          {it.contribution && (
                            <div>
                              <dt>Contribution</dt>
                              <dd>{it.contribution}</dd>
                            </div>
                          )}
                          {it.result && (
                            <div>
                              <dt>Result</dt>
                              <dd>{it.result}</dd>
                            </div>
                          )}
                        </dl>
                        <div className="bc-act">
                          {it.pdf && (
                            <a className="btn btn-primary" href={it.pdf} target="_blank" rel="noopener noreferrer">
                              View statements (PDF) <span className="arr" aria-hidden="true">↗</span>
                            </a>
                          )}
                          {it.href && (it.file_kind === "spreadsheet" || it.file_kind === "document") ? (
                            <a className={`btn ${it.pdf ? "btn-ghost" : "btn-primary"}`} href={it.href} download>
                              Download {it.file_name.split(".").pop()?.toUpperCase()} · {formatBytes(it.file_size)}
                            </a>
                          ) : it.file_kind === "spreadsheet" || it.file_kind === "document" ? (
                            <a className="btn btn-primary" href={`${file}?download=1`}>
                              Download {it.file_name.split(".").pop()?.toUpperCase()}
                            </a>
                          ) : (
                            <a className="btn btn-primary" href={file} target="_blank" rel="noopener noreferrer">
                              Open file <span className="arr" aria-hidden="true">↗</span>
                            </a>
                          )}
                          {related && (
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => {
                                setOpen(false);
                                window.setTimeout(() => scrollToCase(related.id), 350);
                              }}
                            >
                              Related case
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
