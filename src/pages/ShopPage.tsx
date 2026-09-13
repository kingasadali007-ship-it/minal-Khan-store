import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, X, SlidersHorizontal, Gift } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
  onInstantWhatsApp: (product: Product) => void;
  setCurrentView: (view: string) => void;
  initialCategoryFilter?: string;
  initialOccasionFilter?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  onInstantWhatsApp,
  setCurrentView,
  initialCategoryFilter,
  initialOccasionFilter,
}) => {
  const { products, categories, occasions } = useStore();
  const { isUrdu, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter || 'All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>(initialOccasionFilter || 'All');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active products only for customer view
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.isActive);
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q) || p.nameUrdu?.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q) || p.descriptionUrdu?.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Occasion filter
        if (selectedOccasion !== 'All' && p.occasion?.toLowerCase() !== selectedOccasion.toLowerCase()) {
          return false;
        }

        // Availability filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Price range
        const effPrice = p.salePrice ?? p.price;
        if (priceRange === 'under2000' && effPrice >= 2000) return false;
        if (priceRange === '2000to5000' && (effPrice < 2000 || effPrice > 5000)) return false;
        if (priceRange === '5000to10000' && (effPrice < 5000 || effPrice > 10000)) return false;
        if (priceRange === 'above10000' && effPrice < 10000) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;

        if (sortBy === 'priceLowHigh') return priceA - priceB;
        if (sortBy === 'priceHighLow') return priceB - priceA;
        if (sortBy === 'popular') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        // Default 'newest'
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [activeProducts, searchQuery, selectedCategory, selectedOccasion, priceRange, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedOccasion('All');
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All' ||
    selectedOccasion !== 'All' ||
    priceRange !== 'all' ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#8b7355] font-semibold">
          Luxury Catalog
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
          Shop Premium Gifts in Pakistan
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Discover luxury perfumes, watches, wallets, chocolates, jewellery, personalized gifts, and customized gift boxes across Pakistan.
        </p>
      </div>

      {/* Search & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search perfumes, watches, chocolates, flowers..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e8dfd3] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3022] shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Filter controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e8dfd3] rounded-lg text-xs font-semibold text-stone-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#e8dfd3] rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#1b3022]"
            >
              <option value="newest">Sort: Newest</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="popular">Popular / Signature</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar (Desktop & Mobile Drawer) */}
        <div
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } lg:block bg-white p-6 rounded-2xl border border-[#e8dfd3] space-y-6 shadow-2xs`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#f1ece4]">
            <h3 className="font-bold text-sm text-[#1b3022] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#d4af37]" />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Category
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-[#1b3022] text-[#f7e7ce] font-bold'
                    : 'text-stone-600 hover:bg-[#faf8f5]'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-[#1b3022] text-[#f7e7ce] font-bold'
                      : 'text-stone-600 hover:bg-[#faf8f5]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Occasion
            </label>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedOccasion('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedOccasion === 'All'
                    ? 'bg-[#1b3022] text-[#f7e7ce] font-bold'
                    : 'text-stone-600 hover:bg-[#faf8f5]'
                }`}
              >
                All Occasions
              </button>
              {occasions.map((occ) => (
                <button
                  key={occ.id || occ.slug}
                  onClick={() => setSelectedOccasion(occ.name)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedOccasion.toLowerCase() === occ.name.toLowerCase()
                      ? 'bg-[#1b3022] text-[#f7e7ce] font-bold'
                      : 'text-stone-600 hover:bg-[#faf8f5]'
                  }`}
                >
                  {occ.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Price Range (PKR)
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under2000', label: 'Under Rs. 2,000' },
                { id: '2000to5000', label: 'Rs. 2,000 - Rs. 5,000' },
                { id: '5000to10000', label: 'Rs. 5,000 - Rs. 10,000' },
                { id: 'above10000', label: 'Rs. 10,000+' },
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="priceRange"
                    value={p.id}
                    checked={priceRange === p.id}
                    onChange={() => setPriceRange(p.id)}
                    className="text-[#1b3022] focus:ring-[#1b3022]"
                  />
                  <span className="text-stone-700">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-2 border-t border-[#f1ece4]">
            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded-sm text-[#1b3022] focus:ring-[#1b3022]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400 font-medium">Applied Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#1b3022] text-[#f7e7ce] px-2.5 py-1 rounded-full text-xs font-medium">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedOccasion !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#1b3022] text-[#f7e7ce] px-2.5 py-1 rounded-full text-xs font-medium">
                  {selectedOccasion}
                  <button onClick={() => setSelectedOccasion('All')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {priceRange !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-stone-200 text-stone-800 px-2.5 py-1 rounded-full text-xs font-medium">
                  Price Filter
                  <button onClick={() => setPriceRange('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-medium">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Grid or Empty Results */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onInstantWhatsApp={onInstantWhatsApp}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-dashed border-[#d4af37]/40 text-center space-y-4">
              <Gift className="w-12 h-12 text-[#d4af37] mx-auto opacity-70" />
              <h3 className="font-display text-lg font-bold text-stone-900">
                {activeProducts.length === 0 ? 'No Products in Database Yet' : 'No Gifts Match Filters'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {activeProducts.length === 0
                  ? 'The product catalog starts clean. The store owner can add products from the Admin Panel.'
                  : 'Try clearing your search query or adjusting your category and price range filters.'}
              </p>
              {activeProducts.length === 0 ? (
                <button
                  onClick={() => setCurrentView('admin')}
                  className="px-5 py-2.5 bg-[#1b3022] text-[#f7e7ce] text-xs font-semibold rounded-lg hover:bg-[#25422f]"
                >
                  Go to Admin Panel to Add Products
                </button>
              ) : (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-[#faf8f5] border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-100"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
