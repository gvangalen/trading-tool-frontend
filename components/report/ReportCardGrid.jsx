"use client";

export default function ReportCardGrid({ children }) {
  return (
    <div
      className="
        grid 
        grid-cols-1 
        md:grid-cols-2
        gap-6
        w-full

        /* Premium smooth fade */
        animate-[fadeIn_0.4s_ease]

        /* Zorgt dat cards perfect alignen */
        auto-rows-max
      "
      style={{
        // Subtiele spacing matching CardWrapper 2.5
        paddingBottom: "0.5rem",
      }}
    >
      {children}
    </div>
  );
}

/*  
  Voeg deze keyframe toe in globals.css of tailwind config 
  als fadeIn nog niet bestaat: 
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
*/
