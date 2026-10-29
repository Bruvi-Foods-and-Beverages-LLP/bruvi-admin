import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-sans font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3A66]/30 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#1C3A66] text-white hover:bg-[#0F2340] active:bg-[#0A172A] shadow-sm",
        workspace:
          "bg-white border-[1.5px] border-[#BCC6D3] hover:bg-[#F5F7FA] active:bg-[#EBEFF4] text-[#0F2340]",
        destructive:
          "bg-[#C0352B] text-white hover:bg-[#A32920] active:bg-[#852019] shadow-sm",
        outline:
          "border-[1.5px] border-[#7F8CA0] bg-white hover:bg-[#F5F7FA] text-[#0F2340]",
        secondary:
          "bg-[#F5F7FA] text-[#0F2340] hover:bg-[#EBEFF4]",
        ghost:
          "hover:bg-[#F5F7FA] text-[#0F2340]",
        link:
          "text-[#1C3A66] underline underline-offset-2 hover:text-[#2F5690] p-0 h-auto font-bold text-[14px]",
      },
      size: {
        default: "h-[48px] px-5 text-[16px] leading-5 rounded-[12px]",
        input: "h-[52px] px-5 text-[16px] leading-6 rounded-[12px]",
        sm: "h-[36px] px-3.5 text-[13px] leading-4 rounded-[8px]",
        lg: "h-[56px] px-6 text-[16px] leading-6 rounded-[14px]",
        icon: "h-[40px] w-[40px] rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size, className }), child.props.className),
        ...props,
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
