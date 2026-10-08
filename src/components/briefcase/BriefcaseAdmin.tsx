"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CASES, PROFILE } from "@/lib/data";
import {
  ACCEPT_ATTR,
  ACCEPTED_HUMAN,
  BRIEFCASE_CATEGORIES,
  EVIDENCE_LABELS,
  MAX_FILE_BYTES,
  MAX_FILE_MB,
  formatBytes,
  kindOf,
  type OwnerItem,
} from "@/lib/briefcase/config";
import { BriefcaseIcon } from "./BriefcaseIcon";

/**
 * Owner-only management page for the Portfolio Briefcase.
 * Every write is checked again on the server (session cookie + same-origin);
 * this UI only decides what to show.
 */

const css = `
/* declare the cascade order first so this sheet can never reorder Tailwind's layers */
@layer theme, base, components, utilities;
@layer components {
.ad{min-height:100svh;padding:28px 0 80px}
.ad-top{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.ad-brand{display:flex;align-items:center;gap:12px}
.ad-brand span{width:46px;height:46px;border-radius:14px;background:var(--ink);color:#fff;display:grid;place-items:center}
.ad-brand h1{font-weight:700;font-size:26px;letter-spacing:-.04em;line-height:1}
.ad-brand p{margin-top:4px;font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--mute)}
.ad-top nav{display:flex;gap:8px;flex-wrap:wrap}
.ad-card{margin-top:24px;padding:24px;border-radius:24px;background:var(--card);box-shadow:var(--hair)}
.ad-card h2{font-weight:700;font-size:20px;letter-spacing:-.035em}
.ad-note{margin-top:6px;font-size:13.5px;color:var(--mute);line-height:1.5}
.ad-field{display:grid;gap:6px;margin-top:14px}
.ad-field span{font-family:var(--font-mono);font-size:10.5px;text-transform:uppercase;color:var(--mute)}
.ad-field input,.ad-field select,.ad-field textarea{font:inherit;font-size:14px;padding:10px 12px;border-radius:12px;border:0;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);color:var(--ink);width:100%}
.ad-field textarea{min-height:76px;resize:vertical}
.ad-field input:focus-visible,.ad-field select:focus-visible,.ad-field textarea:focus-visible{outline:2px solid var(--ink);outline-offset:1px}
.ad-err{margin-top:10px;font-size:13.5px;color:#7a1d1d}
.ad-ok{margin-top:10px;font-size:13.5px;color:var(--ink-2)}
.drop{margin-top:16px;display:grid;place-items:center;gap:10px;text-align:center;padding:36px 20px;border-radius:20px;border:1.5px dashed rgba(13,13,13,.28);
  background:var(--paper);transition:background-color .3s var(--ease),border-color .3s var(--ease)}
.drop.is-over{background:#fff;border-color:var(--ink)}
.drop b{font-size:17px;letter-spacing:-.02em}
.drop small{font-size:12.5px;color:var(--mute);max-width:56ch}
.q{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:8px}
.q li{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 12px;border-radius:14px;background:var(--paper)}
.q .th{width:48px;height:48px;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;display:grid;place-items:center;font-family:var(--font-mono);font-size:10px;color:var(--mute)}
.q .th img{width:100%;height:100%;object-fit:cover}
.q .nm{font-size:14px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.q .mt{font-size:12px;color:var(--mute)}
.bar{height:5px;border-radius:3px;background:#dcd9d3;margin-top:6px;overflow:hidden}
.bar i{display:block;height:100%;background:var(--ink);transition:width .2s linear}
.st{font-family:var(--font-mono);font-size:11px;text-transform:uppercase}
.st.ok{color:var(--ink)}
.st.bad{color:#7a1d1d}
.sm{height:34px;padding:0 13px;font-size:13px}
.tabs{display:flex;gap:6px;margin-top:14px;flex-wrap:wrap}
.tab{height:34px;padding:0 13px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.14)}
.tab[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.items{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:14px}
.it{display:grid;grid-template-columns:200px minmax(0,1fr);gap:20px;padding:18px;border-radius:20px;background:var(--paper)}
.it-prev{border-radius:14px;overflow:hidden;background:#fff;box-shadow:inset 0 0 0 1px var(--line);aspect-ratio:4/3;display:grid;place-items:center;text-align:center;padding:8px}
.it-prev img,.it-prev video{width:100%;height:100%;object-fit:cover;border-radius:10px}
.it-prev b{font-family:var(--font-mono);font-size:16px}
.it-prev small{display:block;font-size:11.5px;color:var(--mute);margin-top:4px}
.it-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}
.it-grid .full{grid-column:1 / -1}
.pill{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;font-family:var(--font-mono);font-size:10.5px;text-transform:uppercase}
.pill.draft{box-shadow:inset 0 0 0 1px var(--ink)}
.pill.published{background:var(--ink);color:#fff}
.pill.archived{background:var(--soft);color:var(--mute)}
.pill.warn{background:#f3e3e3;color:#7a1d1d}
.it-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;align-items:center}
.confirm{display:flex;gap:8px;align-items:flex-start;margin-top:12px;font-size:13px;color:var(--ink-2)}
.confirm input{margin-top:3px}
@media (max-width: 760px){ .it{grid-template-columns:minmax(0,1fr)} .it-grid{grid-template-columns:minmax(0,1fr)} }
}
`;

type Session = { configured: boolean; owner: boolean };
type QItem = {
  key: string;
  file: File;
  thumb?: string;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
  itemId?: string;
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init?.headers || {}) }, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data as T;
}

/** PUT the file to the signed storage URL with real progress events. */
function putFile(url: string, file: File, contentType: string | undefined, onProgress: (p: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("content-type", contentType || file.type || "application/octet-stream");
    xhr.setRequestHeader("x-upsert", "true");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

export default function BriefcaseAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [items, setItems] = useState<OwnerItem[]>([]);
  const [queue, setQueue] = useState<QItem[]>([]);
  const [tab, setTab] = useState<"draft" | "published" | "archived">("draft");
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const data = await api<{ items: OwnerItem[] }>("/api/briefcase/items?scope=owner");
    setItems(data.items);
  }, []);

  useEffect(() => {
    api<Session>("/api/briefcase/session")
      .then((s) => {
        setSession(s);
        if (s.owner) refresh().catch(() => {});
      })
      .catch(() => setSession({ configured: false, owner: false }));
  }, [refresh]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr("");
    try {
      await api("/api/briefcase/session", { method: "POST", body: JSON.stringify({ password }) });
      setPassword("");
      setSession({ configured: true, owner: true });
      await refresh();
    } catch (er) {
      setLoginErr((er as Error).message);
    }
  };

  const logout = async () => {
    await api("/api/briefcase/session", { method: "DELETE" }).catch(() => {});
    setSession({ configured: true, owner: false });
    setItems([]);
  };

  /* ---------------- uploads */
  const patchQ = (key: string, p: Partial<QItem>) => setQueue((q) => q.map((x) => (x.key === key ? { ...x, ...p } : x)));

  const runUpload = useCallback(
    async (q: QItem) => {
      patchQ(q.key, { status: "uploading", error: undefined, progress: 0 });
      try {
        let itemId = q.itemId;
        let uploadUrl: string;
        let contentType: string | undefined;
        if (itemId) {
          const r = await api<{ uploadUrl: string; contentType?: string }>(`/api/briefcase/items/${itemId}/upload`, { method: "POST", body: "{}" });
          uploadUrl = r.uploadUrl;
          contentType = r.contentType;
        } else {
          const r = await api<{ item: OwnerItem; uploadUrl: string; contentType?: string }>("/api/briefcase/items", {
            method: "POST",
            body: JSON.stringify({ fileName: q.file.name, fileSize: q.file.size }),
          });
          itemId = r.item.id;
          uploadUrl = r.uploadUrl;
          contentType = r.contentType;
          patchQ(q.key, { itemId });
        }
        await putFile(uploadUrl, q.file, contentType, (p) => patchQ(q.key, { progress: p }));
        await api(`/api/briefcase/items/${itemId}`, { method: "PATCH", body: JSON.stringify({ uploaded: true }) });
        patchQ(q.key, { status: "done", progress: 1 });
        await refresh();
      } catch (er) {
        patchQ(q.key, { status: "error", error: (er as Error).message });
        refresh().catch(() => {});
      }
    },
    [refresh],
  );

  const addFiles = (list: FileList | File[]) => {
    const next: QItem[] = [];
    for (const file of Array.from(list)) {
      const key = `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`;
      const kind = kindOf(file.name);
      const base: QItem = { key, file, progress: 0, status: "queued" };
      if (!kind) next.push({ ...base, status: "error", error: "This file type is not supported." });
      else if (file.size > MAX_FILE_BYTES) next.push({ ...base, status: "error", error: `Files must be under ${MAX_FILE_MB} MB.` });
      else next.push({ ...base, thumb: kind === "image" ? URL.createObjectURL(file) : undefined });
    }
    setQueue((q) => [...next, ...q]);
    next.filter((q) => q.status === "queued").forEach((q) => runUpload(q));
  };

  /* ---------------- item actions */
  const visible = useMemo(() => items.filter((i) => i.status === tab), [items, tab]);
  const counts = useMemo(
    () => ({
      draft: items.filter((i) => i.status === "draft").length,
      published: items.filter((i) => i.status === "published").length,
      archived: items.filter((i) => i.status === "archived").length,
    }),
    [items],
  );

  const move = async (it: OwnerItem, dir: -1 | 1) => {
    const list = [...visible];
    const i = list.findIndex((x) => x.id === it.id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const a = list[i];
    const b = list[j];
    const sa = a.sort === b.sort ? a.sort + dir : b.sort;
    const sb = a.sort === b.sort ? b.sort : a.sort;
    await api(`/api/briefcase/items/${a.id}`, { method: "PATCH", body: JSON.stringify({ sort: sa }) });
    await api(`/api/briefcase/items/${b.id}`, { method: "PATCH", body: JSON.stringify({ sort: sb }) });
    await refresh();
  };

  if (!session) {
    return (
      <main className="ad wrap">
        <style href="bc-admin" precedence="component">
          {css}
        </style>
        <p className="ad-note">Loading…</p>
      </main>
    );
  }

  return (
    <main className="ad wrap">
      <style href="bc-admin" precedence="component">
        {css}
      </style>
      <div className="ad-top">
        <div className="ad-brand">
          <span>
            <BriefcaseIcon size={22} />
          </span>
          <div>
            <h1>Portfolio Briefcase</h1>
            <p>Owner area · {PROFILE.name}</p>
          </div>
        </div>
        <nav aria-label="Owner">
          <Link className="btn btn-ghost sm" href="/#cases">
            View public site
          </Link>
          {session.owner && (
            <button type="button" className="btn btn-ghost sm" onClick={logout}>
              Log out
            </button>
          )}
        </nav>
      </div>

      {!session.configured && (
        <section className="ad-card">
          <h2>Storage is not configured yet</h2>
          <p className="ad-note">
            Uploads need a Supabase project (private bucket + table) and four environment variables in Vercel:
            SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BRIEFCASE_OWNER_PASSWORD and BRIEFCASE_SESSION_SECRET. The setup steps
            are in README.md → “Portfolio Briefcase”. Until then the public briefcase shows its empty state.
          </p>
        </section>
      )}

      {session.configured && !session.owner && (
        <section className="ad-card" style={{ maxWidth: 440 }}>
          <h2>Owner login</h2>
          <p className="ad-note">Only the site owner can upload, edit or publish.</p>
          <form onSubmit={login}>
            <label className="ad-field">
              <span>Password</span>
              <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            {loginErr && <p className="ad-err" role="alert">{loginErr}</p>}
            <button className="btn btn-primary" type="submit" style={{ marginTop: 16 }}>
              Log in
            </button>
          </form>
        </section>
      )}

      {session.owner && (
        <>
          <section className="ad-card">
            <h2>Add files</h2>
            <p className="ad-note">
              New uploads are saved as private drafts. Publish only anonymised copies or demos you are happy to show.
            </p>
            <div
              className={`drop ${over ? "is-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
              }}
            >
              <BriefcaseIcon size={30} />
              <b>Drag and drop files here</b>
              <small>
                {ACCEPTED_HUMAN}. Up to {MAX_FILE_MB} MB per file. Several files at once are fine.
              </small>
              <button type="button" className="btn btn-primary sm" onClick={() => fileRef.current?.click()}>
                Choose files
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept={ACCEPT_ATTR}
                hidden
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
            {queue.length > 0 && (
              <ul className="q" aria-label="Uploads" aria-live="polite">
                {queue.map((q) => (
                  <li key={q.key}>
                    <span className="th">{q.thumb ? <img src={q.thumb} alt="" /> : (q.file.name.split(".").pop() || "").toUpperCase()}</span>
                    <div style={{ minWidth: 0 }}>
                      <p className="nm">{q.file.name}</p>
                      <p className="mt">
                        {kindOf(q.file.name) ?? "unsupported"} · {formatBytes(q.file.size)}
                        {q.error ? ` · ${q.error}` : ""}
                      </p>
                      {(q.status === "uploading" || q.status === "done") && (
                        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(q.progress * 100)}>
                          <i style={{ width: `${Math.round(q.progress * 100)}%` }} />
                        </div>
                      )}
                    </div>
                    <div>
                      {q.status === "uploading" && <span className="st">{Math.round(q.progress * 100)}%</span>}
                      {q.status === "done" && <span className="st ok">Saved as draft</span>}
                      {q.status === "error" &&
                        (kindOf(q.file.name) && q.file.size <= MAX_FILE_BYTES ? (
                          <button type="button" className="btn btn-ghost sm" onClick={() => runUpload(q)}>
                            Retry
                          </button>
                        ) : (
                          <span className="st bad">Not uploaded</span>
                        ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="ad-card">
            <h2>Items</h2>
            <div className="tabs" role="group" aria-label="Filter by status">
              {(["draft", "published", "archived"] as const).map((t) => (
                <button key={t} type="button" className="tab" aria-pressed={tab === t} onClick={() => setTab(t)}>
                  {t === "draft" ? "Drafts" : t === "published" ? "Published" : "Archived"} ({counts[t]})
                </button>
              ))}
            </div>
            {visible.length === 0 ? (
              <p className="ad-note" style={{ marginTop: 16 }}>
                Nothing here yet.
              </p>
            ) : (
              <ul className="items">
                {visible.map((it, i) => (
                  <ItemEditor
                    key={it.id}
                    item={it}
                    first={i === 0}
                    last={i === visible.length - 1}
                    onMove={(d) => move(it, d)}
                    onChanged={refresh}
                  />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function ItemEditor({
  item,
  first,
  last,
  onMove,
  onChanged,
}: {
  item: OwnerItem;
  first: boolean;
  last: boolean;
  onMove: (d: -1 | 1) => void;
  onChanged: () => Promise<void>;
}) {
  const [f, setF] = useState({
    title: item.title,
    category: item.category,
    contribution: item.contribution,
    result: item.result,
    label: item.label as string,
    case_id: item.case_id ?? "",
  });
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const file = `/api/briefcase/file/${item.id}`;
  const dirty =
    f.title !== item.title ||
    f.category !== item.category ||
    f.contribution !== item.contribution ||
    f.result !== item.result ||
    f.label !== item.label ||
    (f.case_id || null) !== item.case_id;

  const send = async (body: Record<string, unknown>, okText: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await api(`/api/briefcase/items/${item.id}`, { method: "PATCH", body: JSON.stringify(body) });
      setMsg({ ok: true, text: okText });
      await onChanged();
    } catch (er) {
      setMsg({ ok: false, text: (er as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const meta = () => ({ ...f, case_id: f.case_id || null });

  const replace = async (fileObj: File) => {
    if (!kindOf(fileObj.name)) return setMsg({ ok: false, text: "This file type is not supported." });
    if (fileObj.size > MAX_FILE_BYTES) return setMsg({ ok: false, text: `Files must be under ${MAX_FILE_MB} MB.` });
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ uploadUrl: string; contentType?: string }>(`/api/briefcase/items/${item.id}/upload`, {
        method: "POST",
        body: JSON.stringify({ fileName: fileObj.name, fileSize: fileObj.size }),
      });
      setProgress(0);
      await putFile(r.uploadUrl, fileObj, r.contentType, setProgress);
      await api(`/api/briefcase/items/${item.id}`, { method: "PATCH", body: JSON.stringify({ uploaded: true }) });
      setMsg({ ok: true, text: "File replaced. Review it before publishing again." });
      await onChanged();
    } catch (er) {
      setMsg({ ok: false, text: `${(er as Error).message} — use Replace file to try again.` });
      await onChanged();
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const del = async () => {
    if (!window.confirm(`Delete “${item.title}” and its file permanently?`)) return;
    setBusy(true);
    try {
      await api(`/api/briefcase/items/${item.id}`, { method: "DELETE" });
      await onChanged();
    } catch (er) {
      setMsg({ ok: false, text: (er as Error).message });
      setBusy(false);
    }
  };

  return (
    <li className="it" data-item={item.id}>
      <div>
        <div className="it-prev">
          {!item.uploaded ? (
            <div>
              <b>…</b>
              <small>Upload incomplete</small>
            </div>
          ) : item.file_kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file} alt="" />
          ) : item.file_kind === "video" ? (
            <video src={file} preload="metadata" controls />
          ) : (
            <div>
              <b>{item.file_name.split(".").pop()?.toUpperCase()}</b>
              <small>{item.file_kind === "pdf" ? "PDF — open to view" : "No preview — download to view"}</small>
            </div>
          )}
        </div>
        <p className="ad-note" style={{ wordBreak: "break-all" }}>
          {item.file_name} · {formatBytes(item.file_size)}
        </p>
        <p style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span className={`pill ${item.status}`}>{item.status}</span>
          {!item.uploaded && <span className="pill warn">upload incomplete</span>}
        </p>
        {progress !== null && (
          <div className="bar">
            <i style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}
      </div>

      <div>
        <div className="it-grid">
          <label className="ad-field full">
            <span>Title</span>
            <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          </label>
          <label className="ad-field">
            <span>Category</span>
            <input list={`cats-${item.id}`} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} placeholder="Choose or type a new one" />
            <datalist id={`cats-${item.id}`}>
              {BRIEFCASE_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="ad-field">
            <span>Evidence label</span>
            <select value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })}>
              {EVIDENCE_LABELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label className="ad-field full">
            <span>My contribution / role</span>
            <textarea value={f.contribution} onChange={(e) => setF({ ...f, contribution: e.target.value })} />
          </label>
          <label className="ad-field full">
            <span>Result</span>
            <textarea value={f.result} onChange={(e) => setF({ ...f, result: e.target.value })} />
          </label>
          <label className="ad-field">
            <span>Related case</span>
            <select value={f.case_id} onChange={(e) => setF({ ...f, case_id: e.target.value })}>
              <option value="">None</option>
              {CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {item.status !== "published" && item.uploaded && (
          <label className="confirm">
            <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
            This file contains only what I allow to be public (client details removed or synthetic).
          </label>
        )}

        <div className="it-acts">
          <button type="button" className="btn btn-primary sm" disabled={busy || !dirty} onClick={() => send(meta(), "Saved.")}>
            Save
          </button>
          {item.status === "draft" && (
            <button
              type="button"
              className="btn btn-ghost sm"
              disabled={busy || !confirm}
              onClick={() => send({ ...meta(), status: "published", confirmPublic: true }, "Published.")}
            >
              Publish
            </button>
          )}
          {item.status === "published" && (
            <button type="button" className="btn btn-ghost sm" disabled={busy} onClick={() => send({ status: "draft" }, "Moved back to drafts.")}>
              Unpublish
            </button>
          )}
          {item.status !== "archived" ? (
            <button type="button" className="btn btn-ghost sm" disabled={busy} onClick={() => send({ status: "archived" }, "Archived.")}>
              Archive
            </button>
          ) : (
            <button type="button" className="btn btn-ghost sm" disabled={busy} onClick={() => send({ status: "draft" }, "Restored to drafts.")}>
              Restore
            </button>
          )}
          <button type="button" className="btn btn-ghost sm" disabled={busy} onClick={() => replaceRef.current?.click()}>
            {item.uploaded ? "Replace file" : "Upload file again"}
          </button>
          <input
            ref={replaceRef}
            type="file"
            accept={ACCEPT_ATTR}
            hidden
            onChange={(e) => {
              const fl = e.target.files?.[0];
              e.target.value = "";
              if (fl) replace(fl);
            }}
          />
          <button type="button" className="btn btn-ghost sm" disabled={busy || first} onClick={() => onMove(-1)} aria-label="Move up">
            ↑
          </button>
          <button type="button" className="btn btn-ghost sm" disabled={busy || last} onClick={() => onMove(1)} aria-label="Move down">
            ↓
          </button>
          {item.status !== "published" && (
            <button type="button" className="btn btn-ghost sm" disabled={busy} onClick={del}>
              Delete
            </button>
          )}
          {item.uploaded && (
            <a className="btn btn-ghost sm" href={file} target="_blank" rel="noopener noreferrer">
              Open file ↗
            </a>
          )}
        </div>
        {msg && <p className={msg.ok ? "ad-ok" : "ad-err"} role="status">{msg.text}</p>}
      </div>
    </li>
  );
}
