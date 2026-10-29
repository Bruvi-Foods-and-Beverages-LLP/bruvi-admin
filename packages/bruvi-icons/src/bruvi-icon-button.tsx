import React from "react";
import { BruviIcon } from "./bruvi-icon";
import { BruviIconName, BruviIconSize } from "./types";

export interface BruviIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: BruviIconName;
  semanticLabel: string; // Required for VoiceOver & screen readers
  size?: BruviIconSize;
  filled?: boolean;
  categoryColor?: boolean;
}

/**
 * Accessible Icon-Only Button from Foundations — Iconography.
 * Enforces a 48px hit target covering iOS 44 and Android/Web 48 guidelines.
 */
export const BruviIconButton = React.forwardRef<
  HTMLButtonElement,
  BruviIconButtonProps
>(
  (
    {
      icon,
      semanticLabel,
      size = "button",
      filled = false,
      categoryColor = false,
      className,
      disabled,
      ...buttonProps
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={semanticLabel}
        disabled={disabled}
        className={`inline-flex items-center justify-center min-w-[48px] min-h-[48px] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:pointer-events-none disabled:opacity-40 cursor-pointer ${className || ""}`}
        {...buttonProps}
      >
        <BruviIcon
          name={icon}
          size={size}
          filled={filled}
          categoryColor={categoryColor}
        />
      </button>
    );
  }
);

BruviIconButton.displayName = "BruviIconButton";

