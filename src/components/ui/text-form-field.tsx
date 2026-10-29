"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { AlertCircle } from "lucide-react";
import { Input, type InputProps } from "./input";

export interface TextFormFieldProps
  extends Omit<InputProps, "variant"> {
  label?: string;
  labelRight?: React.ReactNode;
  helperText?: string;
  error?: string;
  isPassword?: boolean;
  variant?: "default" | "error" | "success";
}

export const TextFormField = React.forwardRef<
  HTMLInputElement,
  TextFormFieldProps
>(
  (
    {
      id,
      label,
      labelRight,
      helperText,
      error,
      isPassword = false,
      variant = "default",
      inputSize = "default",
      className,
      disabled,
      required,
      type = "text",
      leadingIcon,
      trailingIcon,
      ...props
    },
    ref
  ) => {
    // Generate fallback unique id for accessibility pairing
    const reactId = React.useId();
    const inputId = id || reactId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Password visibility toggle state
    const [showPassword, setShowPassword] = React.useState(false);

    // Auto-resolve error variant
    const resolvedVariant = error ? "error" : variant;
    const computedType = isPassword ? (showPassword ? "text" : "password") : type;

    // Render password visibility action button if isPassword is true
    const passwordToggleButton = isPassword ? (
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="text-[#7F8CA0] hover:text-[#0F2340] active:text-[#0F2340] transition-colors focus:outline-none cursor-pointer flex items-center justify-center p-0.5 rounded"
      >
        {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
      </button>
    ) : null;

    const resolvedTrailingIcon = trailingIcon || passwordToggleButton;

    return (
      <div className={cn("w-full flex flex-col gap-2", className)}>
        {/* Label & Optional Top-Right Action Header */}
        {(label || labelRight) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={inputId}
                className="font-sans font-bold text-[14px] leading-5 text-[#0F2340] select-none flex items-center gap-1"
              >
                <span>{label}</span>
                {required && <span className="text-[#C0352B]">*</span>}
              </label>
            )}
            {labelRight && (
              <div className="text-[14px] font-sans font-bold leading-5">
                {labelRight}
              </div>
            )}
          </div>
        )}

        {/* Input Control */}
        <Input
          id={inputId}
          ref={ref}
          type={computedType}
          disabled={disabled}
          inputSize={inputSize}
          variant={resolvedVariant}
          leadingIcon={leadingIcon}
          trailingIcon={resolvedTrailingIcon}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        />

        {/* Error Feedback Message */}
        {error && (
          <div
            id={errorId}
            className="flex items-center gap-1.5 text-[12px] font-sans font-medium leading-4 text-[#C0352B] animate-in fade-in duration-150"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Informational Helper Text (when no error) */}
        {!error && helperText && (
          <p
            id={helperId}
            className="text-[12px] font-sans font-medium leading-4 text-[#7F8CA0]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextFormField.displayName = "TextFormField";

