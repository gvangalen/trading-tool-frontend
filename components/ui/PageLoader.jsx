'use client';

export default function PageLoader({ text = "Bezig met laden…" }) {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/70 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      
      {/* Hybrid Glow Loader */}
      <div className="relative">
        
        {/* Outer Glow Ring */}
        <div className="
          absolute inset-0 rounded-full 
          bg-[var(--primary)] opacity-20 blur-xl 
          animate-pulse
        "></div>

        {/* Rotating Ring */}
        <div
          className="
            h-14 w-14 sm:h-16 sm:w-16 
            rounded-full border-4 
            border-[var(--primary)] 
            border-t-transparent 
            animate-spin
          "
        ></div>
      </div>

      {/* TEXT */}
      {text && (
        <p className="mt-4 text-sm text-[var(--text-light)] dark:text-[var(--text-muted)] animate-fade-slide">
          {text}
        </p>
      )}
    </div>
  );
}
