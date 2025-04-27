'use client';

export default function LoadingSpinner({ size = 24 }) {
  return (
    <div className="flex justify-center items-center">
      <div
        className="border-4 border-blue-400 border-t-transparent rounded-full animate-spin"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}
