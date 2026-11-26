"use client";

import * as React from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils/cn";

export function BruviSparkline({
  points,
  positive = true,
}: {
  points: number[];
  positive?: boolean;
}) {
  const data = React.useMemo(
    () => points.map((v, idx) => ({ idx, v })),
    [points],
  );
  return (
    <div className="h-6 w-16 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={positive ? "#0f2340" : "#c0352b"}
            strokeWidth={1.75}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BruviChartTooltipCard({
  title,
  items,
}: {
  title?: string;
  items: Array<{ label: string; value: string; dotColor?: string }>;
}) {
  return (
    <div className="rounded-xl bg-surface-inverse text-white px-3 py-2 shadow-floating text-[12px] font-sans">
      {title && <p className="font-bold text-text-inverse-secondary mb-1">{title}</p>}
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 tnum"
          >
            <span className="inline-flex items-center gap-1.5 text-text-inverse-muted">
              {item.dotColor && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.dotColor }}
                />
              )}
              {item.label}
            </span>
            <span className="font-extrabold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StackedPercentageBar({
  segments,
  heightClass = "h-5",
}: {
  segments: Array<{ label: string; pct: number; colorClass: string }>;
  heightClass?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-md overflow-hidden flex gap-0.5",
        heightClass,
      )}
    >
      {segments.map((seg, i) => (
        <div
          key={`${seg.label}-${i}`}
          className={cn(
            "h-full flex items-center px-2 text-[11px] font-bold text-white truncate transition-all",
            seg.colorClass,
            seg.colorClass === "bg-accent" && "text-text",
          )}
          style={{ width: `${seg.pct}%` }}
          title={seg.label || `${seg.pct}%`}
        >
          {seg.pct >= 18 ? seg.label : ""}
        </div>
      ))}
    </div>
  );
}
