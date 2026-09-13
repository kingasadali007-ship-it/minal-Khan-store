import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

interface OccasionsPageProps {
  onSelectOccasion: (occasionName: string) => void;
}

export const OccasionsPage: React.FC<OccasionsPageProps> = ({ onSelectOccasion }) => {
  const { occasions, products } = useStore();
  const { isUrdu, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#8b7355] font-semibold">
          Celebrations & Milestones
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
          Gifts by Occasion
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Find the perfect presents for every milestone: birthdays, anniversaries, weddings, Eid, Valentine's Day, and corporate celebrations across Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {occasions.map((occ) => {
          const productCount = products.filter(
            (p) => p.isActive && p.occasion?.toLowerCase() === occ.name.toLowerCase()
          ).length;

          return (
            <div
              key={occ.id || occ.slug}
              onClick={() => onSelectOccasion(occ.name)}
              className="bg-white rounded-2xl border border-[#e8dfd3] hover:border-[#d4af37] p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-bold text-[#8b7355] bg-[#faf8f5] px-2.5 py-1 rounded-full border border-[#e8dfd3]">
                  {occ.badge || '✨ Celebration'}
                </span>
                <h3 className="font-display text-xl font-bold text-stone-900 group-hover:text-[#1b3022] transition-colors">
                  {occ.name}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {occ.description || 'Thoughtful gift pairings designed to delight.'}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">
                  {productCount} {productCount === 1 ? 'Gift' : 'Gifts'} Available
                </span>
                <span className="font-bold text-[#1b3022] group-hover:text-[#d4af37] flex items-center gap-1">
                  <span>Browse Occasion</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
