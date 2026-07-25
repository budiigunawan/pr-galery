import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonSharedProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = ButtonSharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsAnchor = ButtonSharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans text-[16px] font-semibold " +
  "px-6 py-2.5 transition-transform duration-100 ease-out active:scale-95 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stamp focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-paper disabled:opacity-50 disabled:pointer-events-none";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-pine text-paper hover:bg-pine-deep",
  secondary: "bg-transparent text-pine border border-pine hover:bg-pine/5",
  ghost: "bg-transparent text-pine hover:bg-pine/10",
};

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Pill-shaped button/link used across the storefront and admin UI.
 * Renders an <a> when `href` is supplied, otherwise a <button>.
 */
export default function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const classes = cx(BASE_CLASSES, VARIANT_CLASSES[variant], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
