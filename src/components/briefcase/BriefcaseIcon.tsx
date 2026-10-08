/** Document-case icon: a slim briefcase with a ledger line. */
export function BriefcaseIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5" />
      <rect x="3" y="6.5" width="18" height="13.5" rx="2.2" />
      <path d="M3 11.5h7.5M13.5 11.5H21" />
      <rect x="10.5" y="10" width="3" height="3.2" rx=".7" />
    </svg>
  );
}
