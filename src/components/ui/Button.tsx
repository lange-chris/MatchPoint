import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-white text-fuchsia-700 font-bold hover:bg-white/90 shadow-lg shadow-black/20",
    secondary: "bg-white/20 text-white hover:bg-white/30 border border-white/30 backdrop-blur-sm",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/10",
    outline: "bg-transparent border border-white/40 text-white hover:border-white/70 hover:bg-white/10",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </motion.button>
  );
};
