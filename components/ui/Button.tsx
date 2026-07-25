import Link from "next/link";
import type { ReactNode } from "react";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-full font-sans font-semibold active:scale-95 transition-transform duration-100";

const SIZE_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-base",
};

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-pine text-paper hover:bg-pine-deep",
  secondary: "bg-transparent border border-pine text-pine hover:bg-kraft",
  ghost: "bg-transparent text-pine hover:bg-kraft/60",
};

const DISABLED_CLASSES = "opacity-50 pointer-events-none cursor-not-allowed";

function buildClassName({
  variant = "primary",
  size = "md",
  disabled,
  className,
}: Pick<ButtonProps, "variant" | "size" | "disabled" | "className">): string {
  return [
    BASE_CLASSES,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    disabled ? DISABLED_CLASSES : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  className,
  children,
  onClick,
  disabled,
}: ButtonProps) {
  const computedClassName = buildClassName({ variant, size, disabled, className });

  if (href) {
    return (
      <Link
        href={href}
        className={computedClassName}
        onClick={onClick}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={computedClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
