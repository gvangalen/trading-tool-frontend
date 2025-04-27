'use client';

export default function SkeletonBlock({ height = "1rem", width = "100%" }) {
  return (
    <div
      className="bg-gray-300 rounded animate-pulse"
      style={{ height, width }}
    ></div>
  );
}
