import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Phone,
  Truck,
  ShieldCheck,
  Gift,
  ArrowLeft,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onInstantWhatsApp: (product: Product, quantity: number) => void;
  setCurrentView: (view: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onInstantWhatsApp,
  setCurrentView,
  onSelectProduct,
}) => {
  const { products, addToCart, isInWishlist, toggleWishlist, storeSettings } = useStore();
  const { isUrdu, t } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const effectivePrice = product.salePrice ?? product.price;

  const relatedProducts = products
    .filter(
      (p) =>
        p.isActive &&
        p.id !== product.id &&
        (p.category === product.category || (product.occasion && p.occasion === product.occasion))
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      alert(`${product.name} added to your cart!`);
    }
  };

  const handleQuickWhatsApp = () => {
    onInstantWhatsApp(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1b3022] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Product Image Stage */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#faf8f5] border border-[#e8dfd3] shadow-xs">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={`MINAL KHAN - ${product.name}${product.category ? ` (${product.category})` : ''}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-8 text-center">
              <Gift className="w-16 h-16 mb-4 text-[#d4af37]" />
              <span className="font-display text-lg font-bold text-stone-600">
                MINAL KHAN Luxury Gift
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {hasDiscount && (
              <span className="bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                SALE
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-[#1b3022] text-[#f7e7ce] text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                Signature Gift
              </span>
            )}
          </div>

          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-rose-600 shadow-md transition-colors"
            title="Add to Wishlist"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'text-rose-600 fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8b7355] uppercase tracking-widest">
              <span>{product.category}</span>
              {product.occasion && (
                <>
                  <span>•</span>
                  <span>{product.occasion}</span>
                </>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#1b3022]">
              {product.name}
            </h1>

            {product.sku && (
              <span className="text-[11px] font-mono text-stone-400 block">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-[#f1ece4]">
            <span className="text-2xl sm:text-3xl font-bold text-[#1b3022]">
              Rs. {effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-base text-stone-400 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-stone-500 font-medium">PKR (Taxes included)</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Description & Craftsmanship
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="text-xs">
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold bg-rose-50 px-3 py-1 rounded-md border border-rose-200 inline-block">
                {t('statusOutOfStock')}
              </span>
            ) : product.stock <= 3 ? (
              <span className="text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-md border border-amber-200 inline-block">
                {t('statusLowStock', { count: product.stock })}
              </span>
            ) : (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 inline-block">
                {t('statusInStock')} ({product.stock} units available)
              </span>
            )}
          </div>

          {/* Quantity selector */}
          {!isOutOfStock && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:bg-stone-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-stone-600 hover:bg-stone-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-stone-500">
                  Subtotal: Rs. {(effectivePrice * quantity).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                id="pdp-add-to-cart-btn"
                className="w-full py-3.5 bg-[#1b3022] hover:bg-[#25422f] disabled:opacity-50 text-[#f7e7ce] rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => {
                  if (!isOutOfStock) {
                    addToCart(product, quantity);
                    setCurrentView('checkout');
                  }
                }}
                disabled={isOutOfStock}
                id="pdp-buy-now-btn"
                className="w-full py-3.5 bg-[#d4af37] hover:bg-[#c49f2b] disabled:opacity-50 text-[#1b3022] rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <span>Buy Now & Checkout</span>
              </button>
            </div>

            {/* Custom box callout */}
            <button
              onClick={() => setCurrentView('box-builder')}
              className="w-full py-2.5 bg-[#faf8f5] hover:bg-[#f1ece4] border border-[#d4af37]/50 rounded-xl text-xs font-bold text-[#8b7355] flex items-center justify-center gap-2 transition-colors"
            >
              <Gift className="w-4 h-4 text-[#d4af37]" />
              <span>Add this item into a Customized Gift Box</span>
            </button>
          </div>

          {/* Pakistani Delivery Guarantees */}
          <div className="bg-[#faf8f5] rounded-xl p-4 border border-[#e8dfd3] space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2 font-semibold text-stone-800">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              <span>Nationwide Express Courier across Pakistan</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Safe packing in bubble protection & branded MINAL KHAN gift wrap. 100% verified Advance Bank Transfer.
              Standard transit 1–3 business days.
            </p>
          </div>
        </div>
      </div>

      {/* Related Gifts from MINAL KHAN */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#e8dfd3] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8b7355] font-semibold">
                You May Also Like
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1b3022]">
                Related Gifts from MINAL KHAN
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-[#8b7355] hover:text-[#1b3022] transition-colors"
            >
              View Full Catalog →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard
                key={relProd.id}
                product={relProd}
                onSelectProduct={(p) => {
                  if (onSelectProduct) {
                    onSelectProduct(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onInstantWhatsApp={(p) => onInstantWhatsApp(p, 1)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
