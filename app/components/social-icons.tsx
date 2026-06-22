type IconProps = { className?: string };

const ORTAK_OZELLIKLER = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg {...ORTAK_OZELLIKLER} className={className} aria-hidden>
      <path d="M14 9h2.5V6H14c-1.93 0-3.5 1.57-3.5 3.5V11H8v3h2.5v6H13v-6h2.5l.5-3H13V9.5c0-.28.22-.5.5-.5H14Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...ORTAK_OZELLIKLER} className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
