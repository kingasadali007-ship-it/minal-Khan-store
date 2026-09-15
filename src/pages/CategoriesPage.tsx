import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CategoriesPageProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const { categories, products } = useStore();

  return (
    <div className="bg-[#faf8f5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b3022]/10 border border-[#d4af37]/40 text-[#1b3022] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Curated Gift Collections</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#1b3022]">
            Shop by Category
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Discover our curated departments including luxury perfumes, chronographs, leather accessories, artisan chocolates, personalized mugs, fresh floral hatboxes, fine jewellery, and bespoke gift boxes across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => {
            const productCount = products.filter(
              (p) => p.isActive && p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <div
                key={cat.id || cat.slug}
                onClick={() => onSelectCategory(cat.name)}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-white border border-[#e8dfd3] hover:border-[#d4af37] flex flex-col"
              >
                {/* Visual Image Header */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-200">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1b3022] text-[#d4af37]">
                      <Sparkles className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-[#1b3022]">
                    {productCount} {productCount === 1 ? 'Gift' : 'Gifts'}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow-xs">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-light">
                    {cat.description || 'Artisan gifts carefully curated for memorable gestures.'}
                  </p>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1b3022] group-hover:text-[#d4af37] flex items-center gap-1.5 transition-colors">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                      MINAL KHAN
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
