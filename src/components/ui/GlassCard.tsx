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
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300",
        hoverEffect && "hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/[0.02]",
        className
      )}
      {...props}
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
