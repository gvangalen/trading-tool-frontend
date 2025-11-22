'use client';

export default function CardWrapper({ title, children }) {
  return (
    <div
      className="
        card
        p-6
        space-y-4
      "
      style={{
        background: "var(--card-bg)",
        borderRadius: "var(--card-radius)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {title && (
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-dark)" }}>
          {title}
        </h3>
      )}

      <div>{children}</div>
    </div>
  );
}
