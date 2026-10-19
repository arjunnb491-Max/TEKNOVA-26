"use client";

import { useEffect, useState } from "react";

export function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500); // Wait a bit after 100% before hiding
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-nexus-bg-1 text-white">
      <div className="relative flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold font-space-grotesk tracking-widest glow-text animate-pulse">
          NEXUS
        </h1>
        <p className="mt-4 text-sm md:text-base tracking-[0.3em] text-nexus-text-3 uppercase">
          Department of MCA
        </p>

        {/* Progress Bar */}
        <div className="mt-12 w-64 h-1 bg-white/10 rounded overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full bg-nexus-accent-4 shadow-[0_0_10px_#22D3EE] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="mt-4 text-xs font-mono text-nexus-accent-4">
          SYSTEM_BOOT_SEQUENCE: {progress}%
        </div>
      </div>
    </div>
  );
}
