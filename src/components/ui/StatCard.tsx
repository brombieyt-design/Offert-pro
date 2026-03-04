import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  iconBg = "bg-indigo-50",
  iconColor = "text-indigo-600",
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium flex items-center gap-0.5 ${
                  change.positive ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {change.positive ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 7l-9.2 9.2M7 7v10h10" />
                  </svg>
                )}
                {change.value}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
