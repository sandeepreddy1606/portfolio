import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 ease-[var(--ease-out-expo)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-canvas shadow-[0_1px_2px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_28px_-8px_var(--accent)] hover:brightness-110 active:scale-[0.98]",
        accent:
          "bg-accent text-accent-ink shadow-[0_8px_30px_-12px_var(--accent)] hover:shadow-[0_12px_40px_-10px_var(--accent)] hover:brightness-110 active:scale-[0.98]",
        outline:
          "border border-line-strong bg-surface/40 backdrop-blur-md hover:border-accent/60 hover:bg-surface active:scale-[0.98]",
        ghost: "hover:bg-surface-2 text-ink-muted hover:text-ink active:scale-[0.98]",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-[13px] [&_svg]:size-4",
        md: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-13 px-7 text-[15px] [&_svg]:size-[18px]",
        icon: "size-10 [&_svg]:size-[18px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
