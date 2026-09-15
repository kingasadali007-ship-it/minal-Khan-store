import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_ANNOUNCEMENTS } from '../utils/seedData';

interface AnnouncementBarProps {
  onNavigate?: (view: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  const { storeSettings } = useStore();
  
  const announcements = (storeSettings.announcements && storeSettings.announcements.length > 0)
    ? storeSettings.announcements.filter((a) => a.isActive)
    : INITIAL_ANNOUNCEMENTS.filter((a) => a.isActive);

  // Fallback if announcements empty but single announcement string exists
  const items = announcements.length > 0
    ? announcements
    : storeSettings.announcement
    ? [{ id: 'single', text: storeSettings.announcement, link: '/shop', isActive: true }]
    : INITIAL_ANNOUNCEMENTS;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  const handleClick = () => {
    if (!currentItem.link) return;
    if (onNavigate) {
      const cleanPath = currentItem.link.replace(/^\//, '') || 'home';
      onNavigate(cleanPath);
    }
  };

  return (
    <div
      id="top-announcement-bar"
      className="bg-[#280a13] text-[#fce7eb] border-b border-[#d4af37]/30 text-[11px] sm:text-xs font-medium py-2 px-3 sm:px-6 relative z-40 select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Previous Button (if multiple) */}
        {items.length > 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
            className="p-1 text-[#fce7eb]/70 hover:text-[#d4af37] transition-colors shrink-0"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Center Text with subtle animation */}
        <div
          onClick={handleClick}
          className={`flex-1 text-center truncate px-2 cursor-pointer transition-opacity duration-300 hover:text-[#faf6ee] flex items-center justify-center gap-1.5`}
        >
          <Sparkles className="w-3 h-3 text-[#d4af37] shrink-0" />
          <span className="truncate tracking-wide">{currentItem.text}</span>
        </div>

        {/* Next Button (if multiple) */}
        {items.length > 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
            className="p-1 text-[#fce7eb]/70 hover:text-[#d4af37] transition-colors shrink-0"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="w-4" />
        )}
      </div>
    </div>
  );
};
