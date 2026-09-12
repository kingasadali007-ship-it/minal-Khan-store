import React from 'react';
import {
  Gift,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Star,
  Clock,
  Phone,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface HomePageProps {
  setCurrentView: (view: string) => void;
  onSelectProduct: (product: Product) => void;
  onInstantWhatsApp: (product: Product) => void;
  onSelectCategoryFilter: (categoryName: string) => void;
  onSelectOccasionFilter: (occasionName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentView,
  onSelectProduct,
  onInstantWhatsApp,
  onSelectCategoryFilter,
  onSelectOccasionFilter,
}) => {
  const { products, categories, occasions, storeSettings } = useStore();
  const { isUrdu, t } = useLanguage();

  const activeProducts = products.filter((p) => p.isActive);
  const featuredProducts = activeProducts.filter((p) => p.isFeatured);
  const bestSellers = activeProducts.slice(0, 4);
  const newArrivals = [...activeProducts]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 4);

  const cleanWhatsApp = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-radial from-[#25432f] via-[#1b3022] to-[#111e15] text-[#f7e7ce] py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7e7ce] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>MINAL KHAN • PAKISTAN</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#fcf8f2] leading-[1.15]">
            {t('heroTitle')}
          </h1>

          <p className="text-base sm:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentView('shop')}
              id="hero-shop-gifts-btn"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#1b3022] font-bold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-[#d4af37]/20 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('heroShopBtn')}</span>
            </button>

            <button
              onClick={() => setCurrentView('box-builder')}
              id="hero-build-box-btn"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#f7e7ce] font-bold text-sm tracking-wider uppercase border border-white/20 backdrop-blur-xs transition-all flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4 text-[#d4af37]" />
              <span>{t('heroBuildBtn')}</span>
            </button>
          </div>

          {/* Luxury Highlights Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 max-w-4xl mx-auto text-xs text-stone-300">
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              <span>Pakistan-wide Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-4 h-4 text-[#d4af37]" />
              <span>Custom Box Builder</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Ordering</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>100% Quality Inspected</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED GIFTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#8b7355] text-xs uppercase tracking-widest font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b3022]">
              {t('secFeatured')}
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs font-bold uppercase tracking-wider text-[#1b3022] hover:text-[#d4af37] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>{t('btnContinueShopping')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onInstantWhatsApp={onInstantWhatsApp}
              />
            ))}
          </div>
        ) : activeProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onInstantWhatsApp={onInstantWhatsApp}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-[#d4af37]/40 max-w-xl mx-auto space-y-4">
            <Gift className="w-12 h-12 text-[#d4af37] mx-auto opacity-70" />
            <h3 className="text-lg font-bold text-stone-800 font-display">
              Ready for Your Products
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              No products have been added yet. As the admin, open the Admin Panel to add your product
              photos, prices, categories, and stock.
            </p>
            <button
              onClick={() => setCurrentView('admin')}
              className="px-5 py-2.5 bg-[#1b3022] text-[#f7e7ce] text-xs font-semibold rounded-lg hover:bg-[#25422f]"
            >
              Open Admin Dashboard
            </button>
          </div>
        )}
      </section>

      {/* 3. SIGNATURE "BUILD YOUR OWN GIFT BOX" CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1b3022] to-[#2b4c37] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-[#d4af37]/30">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7e7ce] text-xs font-semibold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Personalized Experience</span>
            </span>

            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#faf7f2] leading-tight">
              Build Your Own Gift Box
            </h2>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-light">
              Create a truly unforgettable gift. Select your luxury base box, handpick products from our
              curated collection, choose your satin ribbon color, and write a personalized gift card message.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setCurrentView('box-builder')}
                id="cta-box-builder-btn"
                className="px-7 py-3.5 rounded-xl bg-[#d4af37] text-[#1b3022] font-bold text-xs uppercase tracking-wider hover:bg-[#c49f2b] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Gift className="w-4 h-4" />
                <span>{t('btnCustomizeNow')}</span>
              </button>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum MINAL KHAN! I need guidance building a custom gift box.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#25D366]" />
                <span>Ask Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-semibold text-[#8b7355] uppercase tracking-widest mb-1">
              Explore Collections
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b3022]">
              {t('secCategories')}
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('categories')}
            className="text-xs font-bold uppercase tracking-wider text-[#1b3022] hover:text-[#d4af37] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 12).map((cat) => (
            <div
              key={cat.id || cat.slug}
              onClick={() => onSelectCategoryFilter(cat.name)}
              className="group bg-white p-4 rounded-xl border border-[#e8dfd3] hover:border-[#d4af37] hover:shadow-md transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[110px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#faf8f5] group-hover:bg-[#1b3022] text-[#8b7355] group-hover:text-[#d4af37] flex items-center justify-center transition-colors">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-[#1b3022] transition-colors">
                  {isUrdu && cat.nameUrdu ? cat.nameUrdu : cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SHOP BY OCCASION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-semibold text-[#8b7355] uppercase tracking-widest mb-1">
              Special Moments
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b3022]">
              {t('secOccasions')}
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('occasions')}
            className="text-xs font-bold uppercase tracking-wider text-[#1b3022] hover:text-[#d4af37] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {occasions.slice(0, 8).map((occ) => (
            <div
              key={occ.id || occ.slug}
              onClick={() => onSelectOccasionFilter(occ.name)}
              className="bg-white p-5 rounded-xl border border-[#e8dfd3] hover:border-[#d4af37] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-medium text-[#8b7355]">{occ.badge || '✨ Occasion'}</span>
                <h3 className="font-display text-base font-bold text-stone-900 group-hover:text-[#1b3022] mt-1">
                  {isUrdu && occ.nameUrdu ? occ.nameUrdu : occ.name}
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#d4af37] group-hover:translate-x-1 transition-transform">
                <span>Explore Gifts</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BEST SELLERS & NEW ARRIVALS */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-semibold text-[#8b7355] uppercase tracking-widest">
              Top Loved
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b3022]">
              {t('secBestSellers')}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onInstantWhatsApp={onInstantWhatsApp}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. WHY CHOOSE MINAL KHAN */}
      <section className="bg-white py-16 border-y border-[#e8dfd3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#8b7355] uppercase tracking-widest">
              The MINAL KHAN Standard
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b3022] mt-1">
              {t('secWhyChoose')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-[#faf8f5] border border-[#e8dfd3]">
              <div className="w-10 h-10 rounded-lg bg-[#1b3022] text-[#d4af37] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">{t('feat1Title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('feat1Desc')}</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#faf8f5] border border-[#e8dfd3]">
              <div className="w-10 h-10 rounded-lg bg-[#1b3022] text-[#d4af37] flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">{t('feat2Title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('feat2Desc')}</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#faf8f5] border border-[#e8dfd3]">
              <div className="w-10 h-10 rounded-lg bg-[#1b3022] text-[#d4af37] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">{t('feat3Title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('feat3Desc')}</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#faf8f5] border border-[#e8dfd3]">
              <div className="w-10 h-10 rounded-lg bg-[#1b3022] text-[#25D366] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">{t('feat4Title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('feat4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#8b7355] uppercase tracking-widest">
            Loved Across Pakistan
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b3022] mt-1">
            {t('secReviews')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd3] space-y-4 shadow-xs">
            <div className="flex text-[#d4af37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "The customized gift box was simply breathtaking. The handwritten note card and emerald
              velvet finish made my mother's birthday unforgettable in Karachi. Seamless WhatsApp ordering!"
            </p>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Dr. Areeba Malik</h4>
              <span className="text-[10px] text-stone-400">DHA, Karachi</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd3] space-y-4 shadow-xs">
            <div className="flex text-[#d4af37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "Ordered an executive leather wallet and luxury timepiece for an anniversary surprise in
              Lahore. The packaging quality exceeds international standards. Highly recommended!"
            </p>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Hamza Siddiqui</h4>
              <span className="text-[10px] text-stone-400">Gulberg, Lahore</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e8dfd3] space-y-4 shadow-xs">
            <div className="flex text-[#d4af37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              "The 'Build Your Own Gift Box' feature made it so fun to curate perfumes, chocolates, and
              calligraphy mugs for our corporate Eid hampers in Islamabad. Truly premium!"
            </p>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Zahra Shah</h4>
              <span className="text-[10px] text-stone-400">F-7, Islamabad</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHATSAPP CONCIERGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#faf8f5] border border-[#d4af37]/40 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b3022]">
            {t('secConcierge')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            Need customized gift curation, bulk event hampers, or urgent same-day delivery across Pakistan?
            Chat directly with our luxury gift concierge on WhatsApp.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                'Assalam-o-Alaikum MINAL KHAN! I would like personal concierge assistance with gift selection.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-full text-xs uppercase font-bold tracking-wider transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>Connect on WhatsApp (+{storeSettings.whatsappNumber})</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
