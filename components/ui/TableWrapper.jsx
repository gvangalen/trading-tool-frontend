'use client';

export default function TableWrapper({ children }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  );
}
