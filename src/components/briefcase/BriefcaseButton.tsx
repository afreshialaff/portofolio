"use client";

import { BriefcaseIcon } from "./BriefcaseIcon";

export const OPEN_EVENT = "briefcase:open";

export function openBriefcase() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/** Opens the Portfolio Briefcase drawer. Icon + text label, never icon-only. */
export function BriefcaseButton({ className = "btn btn-ghost", label = "Open Portfolio Briefcase" }: { className?: string; label?: string }) {
  return (
    <button type="button" className={className} onClick={openBriefcase} aria-haspopup="dialog">
      <BriefcaseIcon size={17} />
      {label}
    </button>
  );
}
