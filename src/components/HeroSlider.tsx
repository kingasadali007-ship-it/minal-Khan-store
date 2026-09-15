import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_HERO_BANNERS } from '../utils/seedData';
import { HeroBanner } from '../types';

interface HeroSliderProps {
  onNavigate: (view: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const { storeSettings } = useStore();

  const banners: HeroBanner[] = (storeSettings.heroBanners && storeSettings.heroBanners.length > 0)
    ? storeSettings.heroBanners.filter((b) => b.isActive)
    : INITIAL_HERO_BANNERS.filter((b) => b.isActive);

  const activeBanners = banners.length > 0 ? banners : INITIAL_HERO_BANNERS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused, nextSlide]);

  const handleCtaClick = (link: string) => {
    const cleanPath = link.replace(/^\//, '') || 'shop';
    onNavigate(cleanPath);
  };

  return (
    <div
      id="hero-banner-slider"
      className="relative w-full overflow-hidden bg-[#280a13] min-h-[460px] sm:min-h-[560px] lg:min-h-[620px] flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      {activeBanners.map((banner, index) => {
        const isCurrent = index === currentIndex;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Romantic Vignette Gradient */}
            <div className="absolute inset-0">
              <img
                src={banner.imageUrl}
                alt={`MINAL KHAN - ${banner.title}`}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#280a13]/95 via-[#360f1b]/80 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#280a13] via-transparent to-black/40" />
            </div>

            {/* Slide Content */}
            <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="max-w-2xl space-y-5 sm:space-y-6">
                {banner.badge && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb] text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{banner.badge}</span>
                  </div>
                )}

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#faf7f2] leading-[1.12]">
                  {banner.title}
                </h1>

                <p className="text-sm sm:text-lg text-[#fce7eb]/90 font-light leading-relaxed max-w-xl">
                  {banner.subtitle}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    onClick={() => handleCtaClick(banner.ctaLink)}
                    className="px-8 py-4 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#280a13] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl hover:shadow-[#d4af37]/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate('box-builder')}
                    className="px-7 py-4 rounded-xl bg-white/10 hover:bg-[#fce7eb]/20 text-[#fce7eb] font-bold text-xs sm:text-sm tracking-wider uppercase border border-[#fce7eb]/30 backdrop-blur-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Build Your Own Box</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#4a1525] text-[#fce7eb] border border-white/20 flex items-center justify-center backdrop-blur-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#4a1525] text-[#fce7eb] border border-white/20 flex items-center justify-center backdrop-blur-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-[#d4af37]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
