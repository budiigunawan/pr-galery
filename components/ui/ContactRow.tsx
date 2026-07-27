import type { AnchorHTMLAttributes, ReactNode } from "react";

export type ContactIconName = "whatsapp" | "email" | "instagram" | "shopee";

interface ContactRowProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: ContactIconName;
  label: string;
  href: string;
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
  "aria-hidden": true,
};

const ICONS: Record<ContactIconName, ReactNode> = {
  whatsapp: (
    <svg {...ICON_PROPS}>
      <path d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.6-1.21A9 9 0 1 0 12 3Z" />
      <path d="M8.5 9.7c0-.7.4-1.2 1-1.2h.6l.7 2-1 .9c.5 1 1.4 1.9 2.4 2.4l.9-1 2 .7v.6c0 .6-.5 1-1.2 1-3 0-5.4-2.4-5.4-5.4Z" />
    </svg>
  ),
  email: (
    <svg {...ICON_PROPS}>
      <path d="M3.5 6.5h17v11h-17z" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  ),
  instagram: (
    <svg {...ICON_PROPS}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  shopee: (
    <svg {...ICON_PROPS}>
      <path d="M5.5 8.5h13l-1 12h-11z" />
      <path d="M8.5 8.5a3.5 3.5 0 0 1 7 0" />
    </svg>
  ),
};

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Icon + underlined-label contact link row, used in the footer contact card.
 */
export default function ContactRow({ icon, label, href, className, ...anchorProps }: ContactRowProps) {
  return (
    <a
      href={href}
      className={cx("flex items-center gap-4 text-ink transition-colors hover:text-pine", className)}
      {...anchorProps}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/25">
        {ICONS[icon]}
      </span>
      <span className="font-sans text-base font-medium underline decoration-ink/30 underline-offset-4">
        {label}
      </span>
    </a>
  );
}
