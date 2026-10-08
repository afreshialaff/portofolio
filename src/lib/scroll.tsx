"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

/** Mounts Lenis once for the whole page. Skipped entirely for reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    document.documentElement.classList.remove("no-js");
    if (prefersReducedMotion()) return;
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Smoothly scroll to "#id", an element, or a y-offset. Falls back to native scrolling. */
export function scrollToTarget(target: string | HTMLElement | number, offset = 0): void {
  const reduced = prefersReducedMotion();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: reduced ? "auto" : "smooth" });
    return;
  }
  const el =
    typeof target === "string"
      ? target === "#top"
        ? document.body
        : document.getElementById(target.replace(/^#/, ""))
      : target;
  if (!el) return;
  const top = el === document.body ? 0 : el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

/** Lock / unlock page scrolling (mobile menu). */
export function lockScroll(locked: boolean): void {
  if (locked) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    lenis?.start();
    document.documentElement.style.overflow = "";
  }
}

/** onClick handler for in-page anchors: <a href="#work" onClick={onAnchorClick}>. */
export function onAnchorClick(e: React.MouseEvent<HTMLAnchorElement>): void {
  const href = e.currentTarget.getAttribute("href");
  if (!href || !href.startsWith("#")) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  scrollToTarget(href);
  const id = href.slice(1);
  if (id && id !== "top") {
    history.replaceState(null, "", href);
    // move focus for keyboard / screen-reader users without jumping the scroll
    const el = document.getElementById(id);
    if (el) {
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }
  } else {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

/** Scroll to one case-study card. Cards are position:sticky, so measure their natural position. */
export function scrollToCase(id: string): void {
  const li = document.querySelector<HTMLElement>(`[data-case="${id}"]`);
  if (!li) {
    scrollToTarget("#cases");
    return;
  }
  const prev = li.style.position;
  li.style.position = "relative";
  const y = li.getBoundingClientRect().top + window.scrollY;
  li.style.position = prev;
  const i = Number(li.dataset.index ?? 0);
  const sticky = getComputedStyle(li).position === "sticky";
  scrollToTarget(Math.max(0, y - (sticky ? 96 + i * 14 : 90)));
}
