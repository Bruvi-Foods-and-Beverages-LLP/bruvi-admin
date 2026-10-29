import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const inputVariants = cva(
  "w-full flex items-center bg-white text-[#0F2340] placeholder:text-[#7F8CA0] font-sans font-normal transition-all outline-none disabled:cursor-not-allowed disabled:bg-[#F5F7FA] disabled:border-[#DCE2EA] disabled:text-[#7F8CA0]",
  {
    variants: {
      inputSize: {
        sm: "h-[40px] px-3.5 text-[14px] leading-5 rounded-[10px]",
        default: "h-[52px] px-[18px] text-[16px] leading-6 rounded-[12px]",
        lg: "h-[56px] px-5 text-[16px] leading-6 rounded-[14px]",
      },
      variant: {
        default:
          "border-[1.5px] border-[#7F8CA0] focus:border-[2px] focus:border-[#2F5690] focus:shadow-[0px_0px_0px_4px_rgba(205,233,249,1)] hover:border-[#55647A]",
        error:
          "border-[2px] border-[#C0352B] shadow-[0px_0px_0px_4px_rgba(252,232,230,1)] text-[#0F2340] focus:border-[#C0352B] focus:shadow-[0px_0px_0px_4px_rgba(252,232,230,1)]",
        success:
          "border-[1.5px] border-[#1F7A4D] focus:border-[2px] focus:border-[#1F7A4D] focus:shadow-[0px_0px_0px_4px_rgba(227,244,234,1)]",
      },
    },
    defaultVariants: {
      inputSize: "default",
      variant: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      inputSize,
      variant,
      leadingIcon,
      trailingIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    // If no icons, render direct styled input
    if (!leadingIcon && !trailingIcon) {
      return (
        <input
          type={type}
          disabled={disabled}
          className={cn(
            inputVariants({ inputSize, variant }),
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }

    // With leading/trailing icons, wrap in a container matching the exact input styling
    return (
      <div
        className={cn(
          inputVariants({ inputSize, variant }),
          "relative overflow-hidden cursor-text",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        {leadingIcon && (
          <span className="shrink-0 mr-3 text-[#7F8CA0] flex items-center justify-center">
            {leadingIcon}
          </span>
        )}
        <input
          type={type}
          disabled={disabled}
          className="w-full h-full bg-transparent outline-none border-none p-0 text-[#0F2340] placeholder:text-[#7F8CA0] font-sans font-normal text-inherit disabled:cursor-not-allowed"
          ref={ref}
          {...props}
        />
        {trailingIcon && (
          <span className="shrink-0 ml-3 text-[#7F8CA0] flex items-center justify-center">
            {trailingIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
