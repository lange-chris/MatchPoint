import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const GlassCard = ({
  children,
  className,
  hoverEffect = true,
  ...props
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/30 bg-white/20 p-6 backdrop-blur-xl shadow-lg shadow-black/10 transition-all duration-300",
        hoverEffect && "hover:border-white/50 hover:bg-white/30 hover:shadow-xl hover:shadow-black/20",
        className
      )}
      {...props}
    >
      {/* Subtle inner highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
