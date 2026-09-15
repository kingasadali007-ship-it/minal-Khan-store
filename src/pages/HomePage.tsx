import React, { useState } from 'react';
import {
  Gift,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Star,
  Phone,
  HelpCircle,
  BookOpen,
  Search,
  CheckCircle2,
  ChevronDown,
  Clock,
  Heart,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { HeroSlider } from '../components/HeroSlider';
import { TrustMarquee } from '../components/TrustMarquee';
import { Product, HomepageSectionConfig } from '../types';
import { DEFAULT_HOMEPAGE_SECTIONS } from '../utils/seedData';

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
  const {
    products,
    categories,
    occasions,
    giftBoxes,
    storeSettings,
    reviews,
    blogs,
    faqs,
  } = useStore();

  const [trackInput, setTrackInput] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Active products & collections
  const activeProducts = products.filter((p) => p.isActive);
  const featuredProducts = activeProducts.filter((p) => p.isFeatured);
  const bestSellers = activeProducts.filter((p) => p.isBestSeller).length > 0
    ? activeProducts.filter((p) => p.isBestSeller)
    : activeProducts.slice(0, 4);
  const saleProducts = activeProducts.filter((p) => p.isOnSale || (p.salePrice && p.salePrice < p.price));
  const personalizedProducts = activeProducts.filter((p) => p.isPersonalized);

  const activeCategories = categories.filter((c) => c.isActive !== false);
  const activeOccasions = occasions.filter((o) => o.isActive !== false);
  const activeBoxes = giftBoxes.filter((b) => b.isActive !== false);
  const approvedReviews = reviews.filter((r) => r.isApproved !== false);
  const displayFaqs = faqs.length > 0 ? faqs : [];

  const cleanWhatsApp = storeSettings.whatsappNumber.replace(/[^0-9]/g, '') || '923001234567';

  // Sort and filter homepage sections
  const rawSections = storeSettings.homepageSections?.length
    ? storeSettings.homepageSections
    : DEFAULT_HOMEPAGE_SECTIONS;

  const sortedSections = [...rawSections]
    .filter((sec) => sec.isEnabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const isDarkSection = (sec: HomepageSectionConfig) => {
    if (sec.textColor === 'light') return true;
    if (sec.textColor === 'dark') return false;
    return ['premium_collection', 'featured', 'why_us', 'concierge'].includes(sec.id);
  };

  // Dynamic admin section background handler
  const getSectionStyle = (sec: HomepageSectionConfig) => {
    if (sec.backgroundImageUrl) {
      const opacity = (sec.backgroundOverlayOpacity ?? 50) / 100;
      let overlay = sec.backgroundOverlayColor;
      if (!overlay) {
        overlay = isDarkSection(sec) ? '#280a13' : '#ffffff';
      }
      let rgbaOverlay = `rgba(40, 10, 19, ${opacity})`;
      if (overlay.startsWith('#')) {
        const hex = overlay.replace('#', '');
        if (hex.length === 6) {
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          rgbaOverlay = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        } else if (hex.length === 3) {
          const r = parseInt(hex[0] + hex[0], 16);
          const g = parseInt(hex[1] + hex[1], 16);
          const b = parseInt(hex[2] + hex[2], 16);
          rgbaOverlay = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
      } else if (overlay.startsWith('rgb')) {
        rgbaOverlay = overlay;
      }
      return {
        backgroundImage: `linear-gradient(${rgbaOverlay}, ${rgbaOverlay}), url('${sec.backgroundImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: sec.backgroundPosition || 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    if (sec.backgroundColor) {
      return { backgroundColor: sec.backgroundColor };
    }
    return undefined;
  };

  const renderSection = (section: HomepageSectionConfig) => {
    const isDark = isDarkSection(section);

    switch (section.id) {
      // 1. HERO SLIDER
      case 'hero':
        return (
          <div key={section.id} id="section-hero" className="w-full">
            <HeroSlider onNavigate={setCurrentView} />
          </div>
        );

      // 2. TRUST & CONFIDENCE STRIP
      case 'trust':
        return (
          <div key={section.id} id="section-trust" className="w-full">
            <TrustMarquee />
          </div>
        );

      // 3. SHOP BY CATEGORY (LARGE VISUAL IMAGE CARDS)
      case 'categories':
        return (
          <section
            key={section.id}
            id="section-categories"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-20 transition-all ${
              isDark ? 'text-[#fce7eb] bg-[#280a13]' : 'bg-[#faf8f5] text-[#1f181b]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${
                    isDark
                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb]'
                      : 'bg-[#fce7eb] border border-[#d4af37]/40 text-[#4a1525]'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{section.badge || 'Curated Gift Categories'}</span>
                  </div>
                  <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold ${
                    isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                  }`}>
                    {section.title || 'Shop by Category'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed ${
                    isDark ? 'text-[#fce7eb]/80' : 'text-stone-600'
                  }`}>
                    {section.subtitle ||
                      'Explore our signature collections crafted with precision for life’s most cherished celebrations.'}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('categories')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer ${
                    isDark
                      ? 'bg-white/10 hover:bg-[#fce7eb]/20 text-[#fce7eb] border border-[#fce7eb]/30'
                      : 'bg-white border border-[#f4d5dc] hover:border-[#d4af37] text-[#4a1525] hover:text-[#c96f86]'
                  }`}
                >
                  <span>View All Categories</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Visual Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {activeCategories.slice(0, 8).map((cat) => {
                  const count = activeProducts.filter(
                    (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                  ).length;

                  return (
                    <div
                      key={cat.id || cat.slug}
                      onClick={() => onSelectCategoryFilter(cat.name)}
                      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-stone-900 border border-[#f4d5dc]/80 hover:border-[#d4af37] flex flex-col aspect-4/3 sm:aspect-square"
                    >
                      {/* Background Image */}
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={`MINAL KHAN - ${cat.name}`}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#4a1525] to-[#280a13] flex items-center justify-center">
                          <Gift className="w-12 h-12 text-[#d4af37] opacity-60" />
                        </div>
                      )}

                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors" />

                      {/* Product Count Pill */}
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#fce7eb] backdrop-blur-xs text-[10px] font-bold text-[#4a1525] shadow-xs border border-[#d4af37]/30">
                        {count} {count === 1 ? 'Gift' : 'Gifts'}
                      </span>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end">
                        <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider mb-1">
                          Collection
                        </span>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-[#fce7eb] transition-colors leading-snug">
                          {cat.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#fce7eb] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <span>Explore Gifts</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      // 4. SIGNATURE PREMIUM COLLECTION (DEEP BERRY & DUSTY ROSE BACKGROUND)
      case 'premium_collection':
      case 'featured':
        return (
          <section
            key={section.id}
            id="section-featured"
            style={getSectionStyle(section)}
            className="py-16 sm:py-24 bg-gradient-to-b from-[#280a13] via-[#360f1b] to-[#280a13] text-[#fce7eb] relative overflow-hidden"
          >
            {/* Subtle luxury ambient pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb] text-xs font-bold uppercase tracking-[0.2em]">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{section.badge || 'Signature Atelier'}</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#faf7f2] mt-3">
                    {section.title || 'The Royal Gifting Collection'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#fce7eb]/85 mt-2 max-w-xl font-light leading-relaxed">
                    {section.subtitle ||
                      'Hand-inspected oud extractions, couple chronographs, and heirloom keepsakes curated to make a lasting impression.'}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#280a13] text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-[#d4af37]/30 self-start sm:self-auto cursor-pointer"
                >
                  <span>Explore Full Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {(featuredProducts.length > 0 ? featuredProducts : activeProducts).slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                    onInstantWhatsApp={onInstantWhatsApp}
                  />
                ))}
              </div>
            </div>
          </section>
        );

      // 5. SHOP BY OCCASION (SOFT BLUSH / WARM IVORY ACCENTS)
      case 'occasions':
        return (
          <section
            key={section.id}
            id="section-occasions"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-20 border-y border-[#fae4e8] transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-[#fff9fa] text-[#1f181b]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${
                    isDark
                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb]'
                      : 'bg-[#fce7eb] border border-[#d4af37]/40 text-[#4a1525]'
                  }`}>
                    <Heart className="w-3.5 h-3.5 text-[#c96f86]" />
                    <span>{section.badge || 'Milestones & Memories'}</span>
                  </div>
                  <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold ${
                    isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                  }`}>
                    {section.title || 'Shop by Occasion'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed ${
                    isDark ? 'text-[#fce7eb]/80' : 'text-stone-600'
                  }`}>
                    {section.subtitle ||
                      'Whether celebrating Shadi, Eid, milestone birthdays, or anniversaries, we present heartfelt pairings ready to dispatch.'}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('occasions')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer ${
                    isDark
                      ? 'bg-white/10 hover:bg-[#fce7eb]/20 text-[#fce7eb] border border-[#fce7eb]/30'
                      : 'bg-white border border-[#f4d5dc] hover:border-[#d4af37] text-[#4a1525] hover:text-[#c96f86]'
                  }`}
                >
                  <span>All Occasions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Occasions Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {activeOccasions.slice(0, 8).map((occ) => {
                  const occCount = activeProducts.filter(
                    (p) => p.occasion?.toLowerCase() === occ.name.toLowerCase()
                  ).length;

                  return (
                    <div
                      key={occ.id || occ.slug}
                      onClick={() => onSelectOccasionFilter(occ.name)}
                      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-stone-900 border border-[#fae4e8] hover:border-[#d4af37] flex flex-col aspect-4/3 sm:aspect-square"
                    >
                      {occ.imageUrl ? (
                        <img
                          src={occ.imageUrl}
                          alt={`MINAL KHAN - ${occ.name}`}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#4a1525] to-[#280a13] flex items-center justify-center">
                          <Heart className="w-12 h-12 text-[#fce7eb] opacity-60" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#fce7eb] backdrop-blur-xs text-[10px] font-bold text-[#4a1525] shadow-xs border border-[#d4af37]/30">
                        {occ.badge || 'Occasion'}
                      </span>

                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[10px] font-bold text-white border border-white/20">
                        {occCount} {occCount === 1 ? 'Gift' : 'Gifts'}
                      </span>

                      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-[#fce7eb] transition-colors leading-snug">
                          {occ.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#fce7eb] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <span>Browse Occasion Gifts</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      // 6. READY-TO-SHIP LUXURY GIFT BOXES
      case 'gift_boxes':
        return activeBoxes.length > 0 ? (
          <section
            key={section.id}
            id="section-gift-boxes"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-24 transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-[#faf8f5] text-[#1f181b]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${
                    isDark
                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb]'
                      : 'bg-[#fce7eb] border border-[#d4af37]/40 text-[#4a1525]'
                  }`}>
                    <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{section.badge || 'Keepsake Packaging'}</span>
                  </div>
                  <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold ${
                    isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                  }`}>
                    {section.title || 'Luxury Keepsake Gift Boxes'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed ${
                    isDark ? 'text-[#fce7eb]/80' : 'text-stone-600'
                  }`}>
                    {section.subtitle ||
                      'Hard velvet boxes with magnetic seals and handcrafted pine wood chests designed to be preserved for a lifetime.'}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('box-builder')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4a1525] hover:bg-[#360f1b] text-[#fce7eb] text-xs font-bold uppercase tracking-wider transition-all shadow-md self-start sm:self-auto cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-[#d4af37]" />
                  <span>Build Custom Hamper</span>
                </button>
              </div>

              {/* Gift Boxes Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeBoxes.map((box) => (
                  <div
                    key={box.id}
                    className="group bg-white rounded-2xl border border-[#f4d5dc] hover:border-[#d4af37] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                      <img
                        src={box.imageUrl}
                        alt={box.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {box.dimensions && (
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#fce7eb] backdrop-blur-xs text-[10px] font-bold text-[#4a1525] shadow-xs border border-[#d4af37]/30">
                          {box.dimensions}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {box.color && (
                          <span className="text-[10px] uppercase font-bold text-[#c96f86] tracking-wider">
                            {box.color}
                          </span>
                        )}
                        <h3 className="font-display text-base font-bold text-stone-900 leading-snug mt-1 group-hover:text-[#4a1525] transition-colors">
                          {box.name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed font-light">
                          {box.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-semibold">Box Price</span>
                          <p className="text-sm sm:text-base font-bold text-[#4a1525]">
                            Rs. {box.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => setCurrentView('box-builder')}
                          className="px-4 py-2 rounded-xl bg-[#4a1525] hover:bg-[#360f1b] text-[#fce7eb] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                        >
                          Select Box
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 7. PERSONALIZED & MONOGRAMMED GIFTS
      case 'personalized':
        return personalizedProducts.length > 0 ? (
          <section
            key={section.id}
            id="section-personalized"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-24 border-y border-[#fae4e8] transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-gradient-to-r from-[#fff9fa] via-[#faedf1] to-[#fff9fa] text-[#1f181b]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${
                    isDark
                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb]'
                      : 'bg-[#fce7eb] border border-[#d4af37]/40 text-[#4a1525]'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{section.badge || 'Bespoke Customization'}</span>
                  </div>
                  <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold ${
                    isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                  }`}>
                    {section.title || 'Personalized & Bespoke Keepsakes'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed ${
                    isDark ? 'text-[#fce7eb]/80' : 'text-stone-600'
                  }`}>
                    {section.subtitle ||
                      'Custom laser-engraved pens, monogrammed wallets, and hand-written calligraphy note cards crafted with pure 24K gold foil accents.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectCategoryFilter('Personalized Gifts');
                  }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer ${
                    isDark
                      ? 'bg-white/10 hover:bg-[#fce7eb]/20 text-[#fce7eb] border border-[#fce7eb]/30'
                      : 'bg-white border border-[#f4d5dc] hover:border-[#d4af37] text-[#4a1525] hover:text-[#c96f86]'
                  }`}
                >
                  <span>View All Personalized</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {personalizedProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                    onInstantWhatsApp={onInstantWhatsApp}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 8. BUILD YOUR OWN GIFT BOX (INTERACTIVE HERO CALLOUT BANNER)
      case 'box_builder':
        return (
          <section
            key={section.id}
            id="section-box-builder"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
          >
            <div className="relative rounded-3xl overflow-hidden bg-radial from-[#4a1525] via-[#360f1b] to-[#210710] text-[#fce7eb] p-8 sm:p-14 lg:p-16 shadow-2xl border border-[#d4af37]/40">
              <div className="relative z-10 max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb] text-xs font-bold uppercase tracking-[0.2em]">
                  <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{section.badge || 'MINAL KHAN Atelier'}</span>
                </div>

                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#faf7f2] leading-tight">
                  {section.title || 'Build Your Own Custom Gift Box'}
                </h2>

                <p className="text-sm sm:text-base text-[#fce7eb]/90 leading-relaxed font-light">
                  {section.subtitle ||
                    'Curate an unforgettable bespoke present in 3 easy steps. Select your keepsake velvet or pine wood box, handpick luxury products, and compose a personalized calligraphy message with satin ribbon.'}
                </p>

                {/* 3 Step Flow Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                    <span className="text-[10px] font-bold uppercase text-[#d4af37] tracking-wider">Step 1</span>
                    <p className="font-semibold text-xs text-white mt-0.5">Pick Base Box</p>
                    <p className="text-[11px] text-[#fce7eb]/80 font-light mt-0.5">Velvet or Pine Wood</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                    <span className="text-[10px] font-bold uppercase text-[#d4af37] tracking-wider">Step 2</span>
                    <p className="font-semibold text-xs text-white mt-0.5">Choose Gifts</p>
                    <p className="text-[11px] text-[#fce7eb]/80 font-light mt-0.5">Perfumes, Watches, Treats</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                    <span className="text-[10px] font-bold uppercase text-[#d4af37] tracking-wider">Step 3</span>
                    <p className="font-semibold text-xs text-white mt-0.5">Calligraphy Card</p>
                    <p className="text-[11px] text-[#fce7eb]/80 font-light mt-0.5">Handwritten with Du'as</p>
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setCurrentView('box-builder')}
                    className="px-8 py-4 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#280a13] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-[#d4af37]/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{section.ctaText || 'Start Building Your Box'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('faq')}
                    className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#fce7eb] font-semibold text-xs sm:text-sm uppercase tracking-wider border border-white/25 flex items-center justify-center gap-2 transition-colors backdrop-blur-xs cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-[#d4af37]" />
                    <span>How Custom Gifting Works</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        );

      // 9. BEST SELLERS
      case 'best_sellers':
        return bestSellers.length > 0 ? (
          <section
            key={section.id}
            id="section-best-sellers"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-20 transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-white text-[#1f181b]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${
                    isDark
                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb]'
                      : 'bg-[#fce7eb] border border-[#d4af37]/40 text-[#4a1525]'
                  }`}>
                    <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                    <span>{section.badge || 'Pakistan Loved'}</span>
                  </div>
                  <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold ${
                    isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                  }`}>
                    {section.title || 'Most Loved Gifts'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed ${
                    isDark ? 'text-[#fce7eb]/80' : 'text-stone-600'
                  }`}>
                    {section.subtitle ||
                      'Our highest-rated client selections celebrating romance, milestones, and heartfelt appreciation.'}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('shop')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer ${
                    isDark
                      ? 'bg-white/10 hover:bg-[#fce7eb]/20 text-[#fce7eb] border border-[#fce7eb]/30'
                      : 'bg-[#faf8f5] border border-[#f4d5dc] hover:border-[#d4af37] text-[#4a1525] hover:text-[#c96f86]'
                  }`}
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {bestSellers.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                    onInstantWhatsApp={onInstantWhatsApp}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 10. SPECIAL OFFERS / SALE COLLECTION
      case 'sale':
        return saleProducts.length > 0 ? (
          <section
            key={section.id}
            id="section-sale"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-20 border-y border-[#fae4e8] transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-[#faf8f5] text-[#1f181b]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${
                    isDark
                      ? 'bg-rose-900/40 border border-rose-500/50 text-[#fce7eb]'
                      : 'bg-rose-100 border border-rose-200 text-[#4a1525]'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    <span>{section.badge || 'Limited Time Deals'}</span>
                  </div>
                  <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold ${
                    isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                  }`}>
                    {section.title || 'Special Celebration Offers'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed ${
                    isDark ? 'text-[#fce7eb]/80' : 'text-stone-600'
                  }`}>
                    {section.subtitle ||
                      'Exclusive seasonal savings on curated luxury perfumes, jewelry, timepieces, and gift sets.'}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('shop')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer ${
                    isDark
                      ? 'bg-white/10 hover:bg-[#fce7eb]/20 text-[#fce7eb] border border-[#fce7eb]/30'
                      : 'bg-white border border-[#f4d5dc] hover:border-[#d4af37] text-[#4a1525] hover:text-[#c96f86]'
                  }`}
                >
                  <span>View All Offers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {saleProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                    onInstantWhatsApp={onInstantWhatsApp}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 11. EXPLORE COMPLETE COLLECTION
      case 'explore':
        return (
          <section
            key={section.id}
            id="section-explore"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-20 transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-white text-[#1f181b]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                  isDark
                    ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb]'
                    : 'bg-[#fce7eb] border border-[#d4af37]/40 text-[#4a1525]'
                }`}>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>The Complete Atelier Portfolio</span>
                </div>
                <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold ${
                  isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                }`}>
                  {section.title || 'Curated Gifting Portfolio'}
                </h2>
                <p className={`text-xs sm:text-sm font-light leading-relaxed ${
                  isDark ? 'text-[#fce7eb]/80' : 'text-stone-600'
                }`}>
                  {section.subtitle ||
                    'Browse through our complete collection of bespoke gift items ready for prompt dispatch across Pakistan.'}
                </p>
              </div>

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

              <div className="text-center pt-6">
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-8 py-4 rounded-xl bg-[#4a1525] hover:bg-[#360f1b] text-[#fce7eb] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>Browse All Products in Shop ({activeProducts.length})</span>
                </button>
              </div>
            </div>
          </section>
        );

      // 12. WHY CHOOSE MINAL KHAN
      case 'why_us':
        return (
          <section
            key={section.id}
            id="section-why-us"
            style={getSectionStyle(section)}
            className="py-16 sm:py-24 bg-gradient-to-b from-[#280a13] via-[#360f1b] to-[#280a13] text-[#fce7eb] relative overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">
                  {section.badge || 'Pakistani Craftsmanship & Trust'}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#faf7f2]">
                  {section.title || 'The MINAL KHAN Distinction'}
                </h2>
                <p className="text-xs sm:text-sm text-[#fce7eb]/80 leading-relaxed font-light">
                  {section.subtitle ||
                    'MINAL KHAN was created on the philosophy that giving a gift is a sacred art of emotional expression. We obsess over the finest details so your recipient receives pure excellence.'}
                </p>
              </div>

              {/* 4 Pillars of Excellence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/60 transition-all space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    100% Advance Bank Verification
                  </h3>
                  <p className="text-xs text-[#fce7eb]/70 leading-relaxed font-light">
                    Every luxury order is verified against official bank transaction receipts. No fake orders or transit returns.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/60 transition-all space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    Pristine Keepsake Boxes
                  </h3>
                  <p className="text-xs text-[#fce7eb]/70 leading-relaxed font-light">
                    Rigid velvet cases, custom laser-engraved pine wood crates, and crushed satin bows designed to impress.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/60 transition-all space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    Hand-Written Calligraphy
                  </h3>
                  <p className="text-xs text-[#fce7eb]/70 leading-relaxed font-light">
                    Every gift box includes a complimentary gold-embossed message card scripted with your personal du'as and sentiments.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/60 transition-all space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    Nationwide Safe Dispatch
                  </h3>
                  <p className="text-xs text-[#fce7eb]/70 leading-relaxed font-light">
                    Dispatched safely across 100+ cities in Pakistan with premier couriers, complete with live order tracking.
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      // 13. QUICK ORDER TRACKING
      case 'track_order':
        return (
          <section
            key={section.id}
            id="section-track-order"
            style={getSectionStyle(section)}
            className={`py-14 sm:py-20 transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-[#fff9fa] text-[#1f181b]'
            }`}
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#fae4e8] hover:border-[#d4af37] shadow-xl text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#4a1525] text-[#fce7eb] flex items-center justify-center mx-auto shadow-md">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#4a1525]">
                  {section.title || 'Track Your Gift Delivery'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-light leading-relaxed">
                  {section.subtitle ||
                    'Enter your 6-digit Order Number (e.g. MK-123456) to check courier dispatch and verification status.'}
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (trackInput.trim()) {
                      setCurrentView('track-order');
                    }
                  }}
                  className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2"
                >
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder="Enter Order # (e.g. MK-123456)"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#4a1525]"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-[#4a1525] text-[#fce7eb] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#360f1b] shrink-0 shadow-md transition-colors cursor-pointer"
                  >
                    Track Order
                  </button>
                </form>
              </div>
            </div>
          </section>
        );

      // 14. CUSTOMER APPRECIATION & REVIEWS
      case 'reviews':
        return (
          <section
            key={section.id}
            id="section-reviews"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-24 transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-white text-[#1f181b]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-semibold text-[#c96f86] uppercase tracking-widest">
                  {section.badge || 'Real Client Testimonials'}
                </span>
                <h2 className={`font-display text-3xl sm:text-4xl font-bold ${
                  isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                }`}>
                  {section.title || 'Customer Appreciation'}
                </h2>
                <p className={`text-xs sm:text-sm font-light ${
                  isDark ? 'text-[#fce7eb]/80' : 'text-stone-500'
                }`}>
                  {section.subtitle ||
                    'Discerning gift-givers across Lahore, Karachi, Islamabad, and beyond share their MINAL KHAN experience.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {approvedReviews.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="bg-[#faf8f5] p-6 sm:p-7 rounded-2xl border border-[#fae4e8] space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex text-[#d4af37]">
                        {[...Array(r.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-light">
                        "{r.comment}"
                      </p>
                    </div>
                    <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{r.customerName}</h4>
                        <span className="text-[11px] text-stone-500">{r.city}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4a1525] bg-[#fce7eb] px-2.5 py-0.5 rounded-full border border-[#f4d5dc]">
                        <CheckCircle2 className="w-3 h-3 text-[#c96f86]" />
                        Verified Order
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      // 15. BLOGS & JOURNAL
      case 'blogs':
        return blogs.length > 0 ? (
          <section
            key={section.id}
            id="section-blogs"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-20 border-t border-[#fae4e8] transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-[#fff9fa] text-[#1f181b]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${
                    isDark
                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb]'
                      : 'bg-[#fce7eb] border border-[#d4af37]/40 text-[#4a1525]'
                  }`}>
                    <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{section.badge || 'Stories & Etiquette'}</span>
                  </div>
                  <h2 className={`font-display text-3xl sm:text-4xl font-bold ${
                    isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                  }`}>
                    {section.title || 'The Gifting Journal'}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 max-w-xl font-light ${
                    isDark ? 'text-[#fce7eb]/80' : 'text-stone-600'
                  }`}>
                    {section.subtitle || 'Curated advice and inspirational guides on memorable Pakistani gifting.'}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('blogs')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer ${
                    isDark
                      ? 'bg-white/10 hover:bg-[#fce7eb]/20 text-[#fce7eb] border border-[#fce7eb]/30'
                      : 'bg-white border border-[#f4d5dc] hover:border-[#d4af37] text-[#4a1525] hover:text-[#c96f86]'
                  }`}
                >
                  <span>Read All Articles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {blogs.slice(0, 2).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setCurrentView('blogs')}
                    className="group cursor-pointer bg-white rounded-2xl border border-[#fae4e8] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
                  >
                    <div className="sm:w-2/5 aspect-16/10 sm:aspect-auto overflow-hidden bg-stone-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 sm:w-3/5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c96f86]">
                          {post.category} • {post.readTime}
                        </span>
                        <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#4a1525] transition-colors leading-snug mt-1">
                          {post.title}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 font-light leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center text-xs font-bold text-[#4a1525] group-hover:text-[#c96f86] transition-colors gap-1.5 pt-2">
                        <span>Read Full Story</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 16. NATIONWIDE SHIPPING
      case 'shipping':
        return (
          <section
            key={section.id}
            id="section-shipping"
            style={getSectionStyle(section)}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
          >
            <div className="bg-gradient-to-r from-[#fce7eb] via-[#faedf1] to-[#faf8f5] border border-[#f4d5dc] rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c96f86] uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-[#d4af37]" />
                  <span>{section.badge || 'Delivery Across Pakistan'}</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#4a1525]">
                  {section.title || 'Safe & Prompt Delivery to 100+ Cities'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-xl font-light leading-relaxed">
                  {section.subtitle ||
                    'Dispatched with premier courier partners in protective shockproof packaging. Enjoy Free Nationwide Delivery on all orders over Rs. 4,500.'}
                </p>
              </div>
              <button
                onClick={() => setCurrentView('shipping')}
                className="px-7 py-3.5 bg-[#4a1525] text-[#fce7eb] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#360f1b] shrink-0 shadow-md transition-colors cursor-pointer"
              >
                Delivery Policies
              </button>
            </div>
          </section>
        );

      // 17. FREQUENTLY ASKED QUESTIONS (INTERACTIVE ACCORDION)
      case 'faq':
        return (
          <section
            key={section.id}
            id="section-faq"
            style={getSectionStyle(section)}
            className={`py-16 sm:py-24 border-t border-[#fae4e8] transition-all ${
              isDark ? 'bg-[#280a13] text-[#fce7eb]' : 'bg-white text-[#1f181b]'
            }`}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-1 ${
                  isDark
                    ? 'bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#fce7eb]'
                    : 'bg-[#fce7eb] border border-[#d4af37]/40 text-[#4a1525]'
                }`}>
                  <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Frequently Asked Questions</span>
                </div>
                <h2 className={`font-display text-3xl sm:text-4xl font-bold ${
                  isDark ? 'text-[#faf7f2]' : 'text-[#4a1525]'
                }`}>
                  {section.title || 'Gifting Questions Answered'}
                </h2>
                <p className={`text-xs sm:text-sm font-light ${
                  isDark ? 'text-[#fce7eb]/80' : 'text-stone-500'
                }`}>
                  {section.subtitle ||
                    'Everything you need to know regarding Advance Bank Transfer verification, delivery timelines, and direct surprise gifting.'}
                </p>
              </div>

              <div className="space-y-3">
                {displayFaqs.slice(0, 5).map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-[#fae4e8] bg-[#faf8f5] overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-display text-base font-bold text-[#4a1525] hover:text-[#c96f86] transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-[#d4af37]' : 'text-stone-400'
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed font-light border-t border-[#fae4e8]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setCurrentView('faq')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4a1525] hover:text-[#c96f86] transition-colors cursor-pointer"
                >
                  <span>Browse Full Help & FAQ Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        );

      // 18. VIP CONCIERGE WHATSAPP SUPPORT
      case 'concierge':
        return (
          <section
            key={section.id}
            id="section-concierge"
            style={getSectionStyle(section)}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
          >
            <div className="bg-gradient-to-br from-[#4a1525] via-[#360f1b] to-[#210710] text-[#fce7eb] rounded-3xl p-8 sm:p-14 text-center space-y-5 shadow-2xl border border-[#d4af37]/40 relative overflow-hidden">
              <div className="w-14 h-14 bg-[#25D366]/20 text-[#25D366] rounded-2xl flex items-center justify-center mx-auto border border-[#25D366]/40 shadow-lg">
                <Phone className="w-7 h-7" />
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                {section.title || 'VIP Gift Concierge & Support'}
              </h2>
              <p className="text-xs sm:text-base text-[#fce7eb]/80 max-w-xl mx-auto leading-relaxed font-light">
                {section.subtitle ||
                  'Need customized hamper recommendations, corporate wedding gifting, or prompt delivery advice across Pakistan? Connect directly with our atelier team on WhatsApp.'}
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    'Assalam-o-Alaikum MINAL KHAN! I would like personal concierge assistance with luxury gift curation.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-4 rounded-xl text-xs uppercase font-bold tracking-wider transition-all shadow-xl hover:shadow-[#25D366]/30 transform hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>Connect on WhatsApp (+{storeSettings.whatsappNumber})</span>
                </a>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#faf8f5] text-[#1c2421]">
      {sortedSections.map((sec) => renderSection(sec))}
    </div>
  );
};
