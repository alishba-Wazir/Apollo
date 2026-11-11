"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  rounded = "rounded-xl",
}) => {
  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      className={`skeleton-shimmer ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`glass-kpi-card p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton width="45%" height={16} />
        <Skeleton width={28} height={28} rounded="rounded-xl" />
      </div>
      <Skeleton width="65%" height={32} />
      <div className="flex items-center justify-between pt-2">
        <Skeleton width="30%" height={12} />
        <Skeleton width="20%" height={12} />
      </div>
    </div>
  );
};

export const SkeletonChart: React.FC<{
  title?: string;
  height?: number;
  className?: string;
}> = ({ title = "Loading Telemetry", height = 240, className = "" }) => {
  return (
    <div className={`glass-panel p-5 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton width={180} height={18} />
          <Skeleton width={120} height={12} />
        </div>
        <Skeleton width={80} height={26} rounded="rounded-full" />
      </div>

      <div
        style={{ height: `${height}px` }}
        className="w-full flex items-end justify-between gap-3 pt-6 px-2"
      >
        {[40, 65, 30, 85, 55, 90, 45, 70, 60, 95, 75, 50].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton
              className="w-full"
              height={`${h}%`}
              rounded="rounded-t-lg"
            />
            <Skeleton width="80%" height={10} rounded="rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = "" }) => {
  return (
    <div className={`glass-panel p-4 space-y-3 ${className}`}>
      {/* Table Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width={`${90 / columns}%`} height={16} />
        ))}
      </div>

      {/* Table Rows */}
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="flex items-center justify-between py-2 border-b border-border/30"
          >
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={c}
                width={`${85 / columns}%`}
                height={14}
                rounded="rounded-md"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
