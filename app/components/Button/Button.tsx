"use client";

import React, { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { playSound } from "@/lib/sound";
import "./Button.scss";

export type ButtonVariant = "primary" | "secondary";
export type ButtonIconPosition = "before" | "after";

type ButtonElement = HTMLAnchorElement | HTMLButtonElement;

interface CommonProps {
  children: ReactNode;
  /** Visual weight. `primary` is the one main action in an area. */
  variant?: ButtonVariant;
  /** Optional leading or trailing icon. Rendered aria-hidden. */
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  className?: string;
  onClick?: MouseEventHandler<ButtonElement>;
  onMouseEnter?: MouseEventHandler<ButtonElement>;
  /** Link variants only: opens in a new tab with `noopener noreferrer`. */
  external?: boolean;
  "aria-label"?: string;
  title?: string;
}

interface LinkProps extends CommonProps {
  href: string;
  type?: never;
  disabled?: never;
}

interface NativeButtonProps extends CommonProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export type ButtonProps = LinkProps | NativeButtonProps;

/**
 * Shared labeled action button. Renders a Next `<Link>` for internal paths,
 * an `<a>` for external/mailto/anchor destinations, and a native `<button>`
 * otherwise. All CTAs share one surface, type scale, icon spacing, hover lift,
 * focus ring, and hover sound so the site stays visually consistent.
 *
 * Icon-only controls continue to use `CircleButton`; dots and carousel arrows
 * are specialized control primitives, not CTAs.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  icon,
  iconPosition = "before",
  className,
  onClick,
  onMouseEnter,
  href,
  external,
  type,
  disabled,
  "aria-label": ariaLabel,
  title,
}) => {
  const classes = clsx(
    "button",
    `button--${variant}`,
    `button--icon-${iconPosition}`,
    className,
  );

  const handleMouseEnter: MouseEventHandler<ButtonElement> = (event) => {
    playSound("hover");
    onMouseEnter?.(event);
  };

  const content = (
    <>
      {icon && iconPosition === "before" && (
        <span className="button__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="button__label">{children}</span>
      {icon && iconPosition === "after" && (
        <span className="button__icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  const sharedProps = {
    className: classes,
    onClick,
    onMouseEnter: handleMouseEnter,
    "aria-label": ariaLabel,
    title,
  };

  if (href) {
    // Internal app routes use the client router. Everything else — external
    // URLs, mailto:, and in-page anchors — is a plain anchor.
    if (href.startsWith("/") && !href.startsWith("//")) {
      return (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          {...sharedProps}
        >
          {content}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...sharedProps}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type ?? "button"} disabled={disabled} {...sharedProps}>
      {content}
    </button>
  );
};

export default Button;
