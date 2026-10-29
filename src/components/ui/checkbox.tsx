"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      id,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      title,
      description,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

    const toggle = () => {
      if (disabled) return;
      const next = !isChecked;
      if (controlledChecked === undefined) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
    };

    return (
      <div
        className={cn(
          "flex items-start gap-3 select-none",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer group",
          className
        )}
        onClick={toggle}
      >
        <button
          id={id}
          ref={ref}
          type="button"
          role="checkbox"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          className={cn(
            "w-6 h-6 shrink-0 rounded-[4px] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#1C3A66]/30",
            isChecked
              ? "bg-[#1C3A66] text-white"
              : "bg-white border-[1.5px] border-[#7F8CA0] group-hover:border-[#1C3A66]"
          )}
        >
          {isChecked && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path
                d="M13.3334 4L6.00008 11.3333L2.66675 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {(title || description) && (
          <div className="flex flex-col text-left">
            {title && (
              <span className="font-sans font-bold text-[14px] leading-5 text-[#0F2340]">
                {title}
              </span>
            )}
            {description && (
              <span className="font-sans font-medium text-[12px] leading-4 text-[#7F8CA0]">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

