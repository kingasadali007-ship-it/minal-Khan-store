import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

interface CategoriesPageProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const { categories, products } = useStore();
  const { isUrdu, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#8b7355] font-semibold">
          Curated Departments
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
          {t('navCategories')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Explore exquisite categories from luxury perfumes and artisanal chocolates to custom
          keepsake hampers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter(
            (p) => p.isActive && p.category.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id || cat.slug}
              onClick={() => onSelectCategory(cat.name)}
              className="bg-white rounded-2xl border border-[#e8dfd3] hover:border-[#d4af37] p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#faf8f5] group-hover:bg-[#1b3022] text-[#8b7355] group-hover:text-[#d4af37] flex items-center justify-center transition-colors">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-[#1b3022] transition-colors">
                    {isUrdu && cat.nameUrdu ? cat.nameUrdu : cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {cat.description || 'Premium gift selection for discerning recipients.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">
                  {productCount} {productCount === 1 ? 'Product' : 'Products'}
                </span>
                <span className="font-bold text-[#1b3022] group-hover:text-[#d4af37] flex items-center gap-1">
                  <span>Explore Gifts</span>
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
