'use client';

export default function ButtonDanger({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
    >
      {children}
    </button>
  );
}
