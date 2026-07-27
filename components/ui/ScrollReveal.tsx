"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Fades/slides children in the first time they enter the viewport. The
 * `prefers-reduced-motion` fallback is handled in CSS (`scroll-reveal`
 * utility), so this only needs to skip the observer in that case.
 */
export default function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // The reduced-motion fallback is handled entirely by the `scroll-reveal`
    // CSS utility (forces opacity: 1 regardless of `visible`), so there's
    // nothing for the observer to do here.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cx("scroll-reveal", visible ? "scroll-reveal-visible" : undefined, className)}>
      {children}
    </div>
  );
}
