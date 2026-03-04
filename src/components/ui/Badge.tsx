import React from "react";

type BadgeVariant =
  | "draft"
  | "sent"
  | "opened"
  | "accepted"
  | "declined"
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  draft: "bg-gray-100 text-gray-600 border border-gray-200",
  sent: "bg-blue-50 text-blue-600 border border-blue-200",
  opened: "bg-amber-50 text-amber-600 border border-amber-200",
  accepted: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  declined: "bg-red-50 text-red-600 border border-red-200",
  default: "bg-gray-100 text-gray-600 border border-gray-200",
  primary: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  success: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  warning: "bg-amber-50 text-amber-600 border border-amber-200",
  danger: "bg-red-50 text-red-600 border border-red-200",
};

const dotColors: Record<BadgeVariant, string> = {
  draft: "bg-gray-400",
  sent: "bg-blue-500",
  opened: "bg-amber-500",
  accepted: "bg-emerald-500",
  declined: "bg-red-500",
  default: "bg-gray-400",
  primary: "bg-indigo-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export function Badge({
  variant = "default",
  children,
  className = "",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
