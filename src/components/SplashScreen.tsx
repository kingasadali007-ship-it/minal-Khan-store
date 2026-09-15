import React, { useEffect, useState } from 'react';
import { Sparkles, Gift } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, minDurationMs = 1400 }) => {
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Smooth progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 98;
        }
        return prev + Math.floor(Math.random() * 18 + 12);
      });
    }, 180);

    // Fade out and finish callback
    const timer = setTimeout(() => {
      setProgress(100);
      setFading(true);
      setTimeout(() => {
        onFinish();
      }, 400); // 400ms fade duration
    }, minDurationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [minDurationMs, onFinish]);

  return (
    <div
      id="minal-splash-screen"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#280a13] text-[#fce7eb] transition-opacity duration-400 ease-out select-none px-4 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4a1525] via-[#280a13] to-[#16050b] pointer-events-none" />
      
      {/* Subtle gold grid pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto space-y-6">
        {/* Emblem / Monogram Icon */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#4a1525] to-[#280a13] border-2 border-[#d4af37]/70 shadow-[0_0_35px_rgba(212,175,55,0.3)] flex items-center justify-center transition-transform transform">
            <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-[#d4af37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]" />
          </div>
          <Sparkles className="w-5 h-5 text-[#d4af37] absolute -top-1.5 -right-1.5 animate-pulse" />
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#d4af37] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
            <span>Pakistan’s Premier Gift Atelier</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[0.18em] text-[#faf6ee] drop-shadow-sm">
            MINAL KHAN
          </h1>
          <p className="text-[11px] sm:text-xs text-[#d4af37]/90 font-medium tracking-[0.22em] uppercase">
            Premium Gifts & Customized Gift Boxes
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 sm:w-56 space-y-2 pt-2">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#b38f2b] via-[#d4af37] to-[#f5d77f] rounded-full transition-all duration-200 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <span className="text-[10px] text-[#fce7eb]/70 font-mono tracking-widest block">
            PREPARING STORE...
          </span>
        </div>
      </div>
    </div>
  );
};
