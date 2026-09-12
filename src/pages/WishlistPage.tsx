import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface WishlistPageProps {
  setCurrentView: (view: string) => void;
  onSelectProduct: (product: Product) => void;
  onInstantWhatsApp: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  setCurrentView,
  onSelectProduct,
  onInstantWhatsApp,
}) => {
  const { wishlist, products } = useStore();
  const { t } = useLanguage();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#8b7355] font-semibold">
          Saved Keepsakes
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
          {t('wishlistTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Items you love and want to reserve for upcoming celebrations.
        </p>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onInstantWhatsApp={onInstantWhatsApp}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-[#e8dfd3] text-center max-w-md mx-auto space-y-4">
          <Heart className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-display text-lg font-bold text-stone-900">{t('wishlistEmpty')}</h3>
          <p className="text-xs text-stone-500">
            Browse our gift catalog and click the heart icon on any item to save it here.
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="px-6 py-2.5 bg-[#1b3022] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#25422f]"
          >
            {t('heroShopBtn')}
          </button>
        </div>
      )}
    </div>
  );
};
