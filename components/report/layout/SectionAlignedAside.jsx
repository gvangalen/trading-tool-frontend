export default function SectionAlignedAside({ children }) {
  return (
    <div className="flex flex-col">
      {/* Offset gelijk aan ReportSection titel */}
      <div className="h-[32px] mb-2" />
      {children}
    </div>
  );
}
