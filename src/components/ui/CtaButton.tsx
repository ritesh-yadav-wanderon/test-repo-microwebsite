import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * The brand's primary filled CTA. `.wo-cta` in global.css owns the gradient,
 * the pressed state and the greyed-out disabled state; per-screen sizing and
 * placement come from the class passed in.
 */
export interface CtaButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  className?: string;
  children: ReactNode;
}

export default function CtaButton({ className, type = "button", children, ...rest }: CtaButtonProps) {
  return (
    <button className={`wo-cta${className ? ` ${className}` : ""}`} type={type} {...rest}>
      {children}
    </button>
  );
}
