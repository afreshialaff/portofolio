import type { ReactNode } from "react";

type Props = {
  index: string;
  label: string;
  /** heading text before the italic accent word */
  title: ReactNode;
  /** the single Instrument Serif italic word */
  accent: string;
  id?: string;
  className?: string;
  children?: ReactNode;
};

/** "03 — Selected work" tag + bold heading that ends in one italic serif word. */
export function SectionHead({ index, label, title, accent, id, className = "", children }: Props) {
  return (
    <div className={`sec-head ${className}`}>
      <p className="tag rv">
        <b>{index}</b> — {label}
      </p>
      <h2 className="h2 rv-mask" id={id} style={{ marginTop: 18 }}>
        <span>
          {title} <em>{accent}</em>
        </span>
      </h2>
      {children}
    </div>
  );
}
