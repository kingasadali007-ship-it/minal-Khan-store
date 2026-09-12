import React from 'react';
import { Heart, ShoppingBag, Phone, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onInstantWhatsApp?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onInstantWhatsApp,
}) => {
  const { addToCart, isInWishlist, toggleWishlist, generateWhatsAppOrderUrl } = useStore();
  const { isUrdu, t } = useLanguage();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInstantWhatsApp) {
      onInstantWhatsApp(product);
    } else {
      const url = generateWhatsAppOrderUrl({
        customerName: 'Customer',
        customerPhone: '',
        customerAddress: '',
        singleProduct: { product, quantity: 1 },
      });
      window.open(url, '_blank');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group bg-white rounded-xl overflow-hidden border border-[#e8dfd3] hover:border-[#d4af37] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#f6f2eb] overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4 text-center">
            <Sparkles className="w-8 h-8 mb-2 text-[#d4af37]" />
            <span className="text-xs font-medium">MINAL KHAN Luxury Gift</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-rose-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              SALE
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#1b3022] text-[#f7e7ce] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              Signature
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          id={`wishlist-btn-${product.id}`}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-stone-600 hover:text-rose-600 shadow-xs transition-colors z-10"
          title="Save to Wishlist"
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-600 fill-rose-600' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3">
            <span className="bg-stone-900 text-white text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-sm border border-stone-600">
              {t('statusOutOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Occasion */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8b7355] uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            {product.occasion && (
              <>
                <span>•</span>
                <span>{product.occasion}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-stone-900 text-base line-clamp-1 group-hover:text-[#1b3022] transition-colors">
            {isUrdu && product.nameUrdu ? product.nameUrdu : product.name}
          </h3>

          {/* Low Stock Warning */}
          {isLowStock && (
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              {t('statusLowStock', { count: product.stock })}
            </p>
          )}

          {/* Description snippet */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
            {isUrdu && product.descriptionUrdu ? product.descriptionUrdu : product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-[#f1ece4]">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-[#1b3022]">
              Rs. {(product.salePrice ?? product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              id={`add-to-cart-${product.id}`}
              className={`w-full py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-[#1b3022] hover:bg-[#25422f] text-white shadow-xs'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? t('statusOutOfStock') : t('btnAddToCart')}</span>
            </button>

            <button
              onClick={handleQuickWhatsApp}
              id={`quick-whatsapp-${product.id}`}
              className="w-full py-2 px-2 rounded-lg text-xs font-bold bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 transition-all flex items-center justify-center gap-1"
              title="Order this product directly on WhatsApp"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
