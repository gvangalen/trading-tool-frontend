'use client';

export default function ButtonSmall({ children, onClick, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
