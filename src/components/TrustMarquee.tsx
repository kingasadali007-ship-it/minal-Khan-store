import React from 'react';
import { Sparkles, ShieldCheck, Gift, Truck, Phone, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_TRUST_ITEMS } from '../utils/seedData';
import { TrustItem } from '../types';

export const TrustMarquee: React.FC = () => {
  const { storeSettings } = useStore();

  const trustItems: TrustItem[] = (storeSettings.trustItems && storeSettings.trustItems.length > 0)
    ? storeSettings.trustItems.filter((t) => t.isActive)
    : INITIAL_TRUST_ITEMS.filter((t) => t.isActive);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-[#d4af37]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-[#d4af37]" />;
      case 'Gift':
        return <Gift className="w-4 h-4 text-[#d4af37]" />;
      case 'Truck':
        return <Truck className="w-4 h-4 text-[#d4af37]" />;
      case 'Phone':
        return <Phone className="w-4 h-4 text-[#d4af37]" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  return (
    <div
      id="trust-offer-marquee"
      className="bg-[#360f1b] text-[#fce7eb] py-3.5 border-y border-[#d4af37]/35 overflow-hidden select-none shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-5 gap-4 divide-x divide-white/10 text-center">
          {trustItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center justify-center px-2 space-y-1">
              <div className="flex items-center gap-1.5">
                {getIcon(item.icon)}
                <span className="font-bold text-xs tracking-wider uppercase text-[#faf6ee]">
                  {item.title}
                </span>
              </div>
              {item.subtitle && (
                <span className="text-[11px] text-[#fce7eb]/80 font-light leading-tight">
                  {item.subtitle}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Horizontal Scrolling Strip */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto no-scrollbar gap-6 px-1">
          {trustItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2 shrink-0">
              {getIcon(item.icon)}
              <div className="text-left">
                <p className="font-bold text-[11px] tracking-wider uppercase text-[#faf6ee] whitespace-nowrap">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-[10px] text-[#fce7eb]/80 font-light whitespace-nowrap">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
