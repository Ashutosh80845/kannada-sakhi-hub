import React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: "gray" | "blue" | "green" | "gold" | "purple";
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 60,
  strokeWidth = 4,
  className,
  children,
  variant = "blue"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  const colorMap = {
    gray: "stroke-progress-gray",
    blue: "stroke-progress-blue", 
    green: "stroke-progress-green",
    gold: "stroke-progress-gold",
    purple: "stroke-progress-purple"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-500 ease-out progress-ring",
            colorMap[variant]
          )}
          style={{
            strokeDashoffset: 0,
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};