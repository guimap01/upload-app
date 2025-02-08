import { ComponentProps } from "react";
import { tv, VariantProps } from "tailwind-variants";

const buttonVariantes = tv({
  base: "text-zinc-400 rouded-lg hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-50 disabled:pointer-events-none",
  variants: {
    size: {
      default: "px-3 py-2",
      icon: "p-2",
      "icon-sm": "p-1",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export function Button({
  size,
  className,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariantes>) {
  return <button className={buttonVariantes({ size, className })} {...props} />;
}
