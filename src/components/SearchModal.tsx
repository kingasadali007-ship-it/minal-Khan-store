import React, { useState } from 'react';
import { Search, X, Gift, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { products } = useStore();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.isActive &&
          (p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e8dfd3] space-y-4 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2 flex-1 mr-4">
            <Search className="w-5 h-5 text-[#8b7355]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gifts, perfumes, watches, chocolates..."
              className="w-full text-sm font-medium outline-none text-stone-900 placeholder-stone-400"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto space-y-2">
          {query.trim() && results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#faf8f5] cursor-pointer transition-colors border border-transparent hover:border-stone-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <Gift className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-stone-900">{product.name}</h4>
                    <span className="text-[10px] text-[#8b7355] uppercase font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1b3022]">
                    Rs. {(product.salePrice ?? product.price).toLocaleString()}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>
            ))
          ) : query.trim() ? (
            <div className="text-center py-8 text-xs text-stone-500">
              No matching gifts found for "{query}".
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-stone-400">
              Type to search any luxury gift, occasion, or fragrance...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
