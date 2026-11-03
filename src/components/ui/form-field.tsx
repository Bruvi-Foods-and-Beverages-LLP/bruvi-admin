import * as React from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Shared control chrome: 40px, 12px radius, 1px border -> 2px navy on focus (matches Stores forms). */
export function formControlClass(invalid?: boolean) {
  return cn(
    "w-full h-10 px-3 rounded-[12px] bg-white text-body-s text-text placeholder:text-gray-400 transition-all outline-none",
    "disabled:cursor-not-allowed disabled:bg-background-subtle disabled:text-gray-400",
    invalid
      ? "border-2 border-error shadow-[0px_0px_0px_3px_rgba(252,232,230,1)]"
      : "border border-border-input hover:border-border-strong focus:border-2 focus:border-primary"
  );
}

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  /** Always-visible helper copy under the control. Replaced by `error` when present. */
  hint?: React.ReactNode;
  error?: string;
  /** Right-aligned label adornment, e.g. a character counter. */
  counter?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, required, hint, error, counter, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-label text-text">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
        {counter && <span className="text-caption text-text-muted tnum">{counter}</span>}
      </div>
      {children}
      {error ? (
        <p role="alert" className="flex items-center gap-1 text-caption text-error">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        hint && <p className="text-caption text-text-muted">{hint}</p>
      )}
    </div>
  );
}

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Static text before the value, e.g. ₹ */
  prefix?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, invalid, prefix, ...props }, ref) => {
    if (!prefix) {
      return <input ref={ref} aria-invalid={invalid} className={cn(formControlClass(invalid), className)} {...props} />;
    }
    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body-s font-bold text-text-muted">
          {prefix}
        </span>
        <input ref={ref} aria-invalid={invalid} className={cn(formControlClass(invalid), "pl-7", className)} {...props} />
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  /** Small coloured dot shown before the selected value. */
  dotColor?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, invalid, dotColor, children, ...props }, ref) => (
    <div className="relative">
      {dotColor && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      )}
      <select
        ref={ref}
        aria-invalid={invalid}
        className={cn(formControlClass(invalid), "appearance-none pr-9 cursor-pointer", dotColor && "pl-7", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  )
);
FormSelect.displayName = "FormSelect";

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid}
      className={cn(formControlClass(invalid), "h-auto min-h-24 resize-none py-2.5", className)}
      {...props}
    />
  )
);
FormTextarea.displayName = "FormTextarea";
