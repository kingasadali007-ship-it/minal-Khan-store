import React, { useState, useMemo } from 'react';
import {
  Gift,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ShoppingBag,
  Phone,
  CheckCircle2,
  Layers,
  ArrowRight,
  HeartHandshake,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { GiftBox, Product, CustomGiftBoxItem, CustomGiftBox } from '../types';

interface GiftBoxBuilderPageProps {
  setCurrentView: (view: string) => void;
  onOpenWhatsAppBoxOrder: (box: CustomGiftBox) => void;
}

export const GiftBoxBuilderPage: React.FC<GiftBoxBuilderPageProps> = ({
  setCurrentView,
  onOpenWhatsAppBoxOrder,
}) => {
  const { giftBoxes, products, addCustomBoxToCart } = useStore();
  const { isUrdu, t } = useLanguage();

  // Step 1: Base box selection
  const activeBoxes = useMemo(() => giftBoxes.filter((b) => b.isActive), [giftBoxes]);
  const [selectedBox, setSelectedBox] = useState<GiftBox | null>(() => activeBoxes[0] || null);

  // Step 2: Selected items inside box
  const [boxItems, setBoxItems] = useState<CustomGiftBoxItem[]>([]);

  // Step 3: Personalization & Ribbon
  const [ribbonColor, setRibbonColor] = useState('Royal Champagne Gold');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  // Filtering products to add into box
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active products in stock for box
  const availableProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive || p.stock <= 0) return false;
      if (categoryFilter !== 'All' && p.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, categoryFilter, searchQuery]);

  // Categories present in products
  const productCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.isActive && p.stock > 0) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products]);

  // Items manipulation
  const handleAddProductToBox = (prod: Product) => {
    setBoxItems((prev) => {
      const idx = prev.findIndex((item) => item.product.id === prod.id);
      if (idx > -1) {
        const updated = [...prev];
        const currentQty = updated[idx].quantity;
        if (currentQty < prod.stock) {
          updated[idx] = { ...updated[idx], quantity: currentQty + 1 };
        }
        return updated;
      } else {
        return [...prev, { product: prod, quantity: 1 }];
      }
    });
  };

  const handleUpdateItemQty = (prodId: string, delta: number) => {
    setBoxItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === prodId) {
            const nextQty = item.quantity + delta;
            const capped = Math.min(item.product.stock, nextQty);
            return { ...item, quantity: capped };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (prodId: string) => {
    setBoxItems((prev) => prev.filter((item) => item.product.id !== prodId));
  };

  // Pricing calculations
  const boxPrice = selectedBox ? selectedBox.price : 0;
  const productsTotal = boxItems.reduce((sum, item) => {
    const unitPrice = item.product.salePrice ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);
  const totalBoxPrice = boxPrice + productsTotal;

  // Build the completed custom gift box object
  const buildCurrentBoxObject = (): CustomGiftBox | null => {
    if (!selectedBox) return null;
    return {
      id: `custom_box_${Date.now()}`,
      box: selectedBox,
      items: boxItems,
      ribbonColor,
      giftMessage: {
        recipient: recipientName,
        sender: senderName,
        message: giftMessage,
      },
      boxTotal: totalBoxPrice,
    };
  };

  const handleAddToCart = () => {
    if (!selectedBox) {
      alert('Please select a luxury gift box packaging first.');
      return;
    }
    if (boxItems.length === 0) {
      alert('Please select at least 1 gift product to place inside the box.');
      return;
    }

    const customBox = buildCurrentBoxObject();
    if (customBox) {
      addCustomBoxToCart(customBox);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#1b3022', '#f7e7ce', '#e11d48'],
      });
      alert(t('boxAddSuccess'));
      setCurrentView('cart');
    }
  };

  const handleOrderOnWhatsApp = () => {
    if (!selectedBox) {
      alert('Please select a luxury gift box packaging first.');
      return;
    }
    if (boxItems.length === 0) {
      alert('Please select at least 1 gift product to place inside the box.');
      return;
    }

    const customBox = buildCurrentBoxObject();
    if (customBox) {
      onOpenWhatsAppBoxOrder(customBox);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#8b7355] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>MINAL KHAN Atelier</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#1b3022]">
          Build Your Own Customized Gift Box
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
          Design your bespoke gift hamper in Pakistan: select premium keepsake packaging, handpick items from our luxury catalog, customize satin ribbon styling, and write your personalized card message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (8 cols): Step 1 (Box) + Step 2 (Catalog) + Step 3 (Card) */}
        <div className="lg:col-span-8 space-y-10">
          {/* STEP 1: SELECT BASE PACKAGING BOX */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8dfd3] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f1ece4]">
              <div className="w-7 h-7 rounded-full bg-[#1b3022] text-[#f7e7ce] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#1b3022]">
                {t('boxStep1Title')}
              </h2>
            </div>

            <p className="text-xs text-stone-500">
              {t('boxSelectNotice')}
            </p>

            {activeBoxes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {activeBoxes.map((box) => {
                  const isSelected = selectedBox?.id === box.id;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBox(box)}
                      id={`select-giftbox-${box.id}`}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#1b3022] bg-[#faf8f5] shadow-md ring-2 ring-[#d4af37]/50'
                          : 'border-[#e8dfd3] hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          {box.imageUrl ? (
                            <img
                              src={box.imageUrl}
                              alt={box.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <Gift className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                              {box.name}
                            </h3>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#1b3022] fill-[#d4af37] shrink-0 ml-1" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-[#1b3022] block">
                            Rs. {box.price.toLocaleString()}
                          </span>
                          {box.dimensions && (
                            <span className="text-[10px] text-stone-500 block">
                              Size: {box.dimensions}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-2 pt-2 border-t border-stone-100">
                        {box.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-[#faf8f5] rounded-xl text-center text-xs text-stone-500">
                Loading luxury boxes...
              </div>
            )}
          </section>

          {/* STEP 2: SELECT PRODUCTS TO INCLUDE */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8dfd3] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#f1ece4] gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1b3022] text-[#f7e7ce] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#1b3022]">
                  {t('boxStep2Title')}
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#8b7355]">
                {boxItems.reduce((acc, i) => acc + i.quantity, 0)} Items Added
              </span>
            </div>

            {/* Category Filter Chips & Search */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products to add..."
                className="px-3 py-1.5 text-xs bg-[#faf8f5] border border-[#e8dfd3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1b3022] w-full sm:w-56"
              />
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setCategoryFilter('All')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    categoryFilter === 'All'
                      ? 'bg-[#1b3022] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All
                </button>
                {productCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                      categoryFilter.toLowerCase() === cat.toLowerCase()
                        ? 'bg-[#1b3022] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Products Grid */}
            {availableProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 max-h-[480px] overflow-y-auto pr-1">
                {availableProducts.map((prod) => {
                  const existing = boxItems.find((i) => i.product.id === prod.id);
                  const effectivePrice = prod.salePrice ?? prod.price;

                  return (
                    <div
                      key={prod.id}
                      className="bg-[#faf8f5] p-3 rounded-xl border border-[#e8dfd3] flex flex-col justify-between hover:border-[#d4af37] transition-all"
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white mb-2 border border-stone-200">
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Gift className="w-6 h-6" />
                          </div>
                        )}
                        {existing && (
                          <span className="absolute top-1 right-1 bg-[#1b3022] text-[#f7e7ce] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            x{existing.quantity}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-[#8b7355] uppercase font-semibold block">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900 line-clamp-1">
                          {isUrdu && prod.nameUrdu ? prod.nameUrdu : prod.name}
                        </h4>
                        <span className="text-xs font-bold text-[#1b3022] block">
                          Rs. {effectivePrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="pt-2 mt-2 border-t border-stone-200 flex items-center justify-between">
                        {existing ? (
                          <div className="flex items-center gap-1.5 w-full justify-between">
                            <button
                              onClick={() => handleUpdateItemQty(prod.id, -1)}
                              className="p-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-700"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-stone-900">{existing.quantity}</span>
                            <button
                              onClick={() => handleUpdateItemQty(prod.id, 1)}
                              disabled={existing.quantity >= prod.stock}
                              className="p-1 rounded bg-[#1b3022] hover:bg-[#25422f] text-white disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddProductToBox(prod)}
                            id={`add-to-box-${prod.id}`}
                            className="w-full py-1.5 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{t('boxAddProductBtn')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#faf8f5] rounded-xl border border-dashed border-[#e8dfd3] space-y-2">
                <Gift className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs text-stone-500">
                  {products.length === 0
                    ? 'No products have been added yet in the database. Add products in the Admin Panel to populate the Gift Box Builder!'
                    : 'No products match your search.'}
                </p>
                {products.length === 0 && (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className="px-3 py-1.5 bg-[#1b3022] text-white rounded text-xs"
                  >
                    Add Products as Admin
                  </button>
                )}
              </div>
            )}
          </section>

          {/* STEP 3: PERSONALIZATION & CARD MESSAGE */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8dfd3] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f1ece4]">
              <div className="w-7 h-7 rounded-full bg-[#1b3022] text-[#f7e7ce] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#1b3022]">
                {t('boxStep3Title')}
              </h2>
            </div>

            {/* Ribbon Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {t('boxRibbonLabel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { name: 'Royal Champagne Gold', colorBg: 'bg-[#d4af37]' },
                  { name: 'Deep Emerald Velvet', colorBg: 'bg-[#1b3022]' },
                  { name: 'Blush Rose Pink', colorBg: 'bg-rose-400' },
                  { name: 'Midnight Black Satin', colorBg: 'bg-stone-900' },
                ].map((ribbon) => (
                  <button
                    key={ribbon.name}
                    type="button"
                    onClick={() => setRibbonColor(ribbon.name)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                      ribbonColor === ribbon.name
                        ? 'border-[#1b3022] bg-[#faf8f5] font-bold ring-1 ring-[#1b3022]'
                        : 'border-stone-200 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${ribbon.colorBg} shrink-0 border border-black/10`} />
                    <span className="truncate text-stone-800">{ribbon.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Names & Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('boxRecipientName')}
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. My Dear Ammi / Fahad"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('boxSenderName')}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Asad & Family"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
                <span>{t('boxMessageLabel')}</span>
                <span className="text-[11px] text-[#d4af37] font-medium">Free Luxury Calligraphy Card</span>
              </label>
              <textarea
                rows={3}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder={t('boxMessagePlaceholder')}
                className="w-full p-3 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none leading-relaxed"
              />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (4 cols): LIVE BOX PREVIEW & PRICING SUMMARY */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-md p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1ece4]">
              <h3 className="font-display text-base font-bold text-[#1b3022] flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#d4af37]" />
                <span>Your Custom Gift Box</span>
              </h3>
              <span className="text-xs font-bold text-[#d4af37] bg-[#faf8f5] px-2 py-0.5 rounded border border-[#e8dfd3]">
                {ribbonColor}
              </span>
            </div>

            {/* Visual Box Rendering */}
            <div className="bg-[#faf8f5] p-4 rounded-xl border border-[#e8dfd3] space-y-3">
              {selectedBox ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0">
                      <img
                        src={selectedBox.imageUrl || ''}
                        alt={selectedBox.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 leading-tight">
                        {selectedBox.name}
                      </h4>
                      <span className="text-xs font-semibold text-[#1b3022]">
                        Packaging: Rs. {selectedBox.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Items Inside Box */}
                  <div className="pt-2 border-t border-stone-200">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-2">
                      Contents Inside Box ({boxItems.reduce((a, b) => a + b.quantity, 0)}):
                    </span>

                    {boxItems.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {boxItems.map((item) => {
                          const unit = item.product.salePrice ?? item.product.price;
                          return (
                            <div
                              key={item.product.id}
                              className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-stone-200"
                            >
                              <div className="space-y-0.5 max-w-[65%]">
                                <p className="font-medium text-stone-800 truncate">
                                  {item.product.name}
                                </p>
                                <span className="text-[10px] text-stone-500">
                                  {item.quantity} x Rs. {unit.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-900 text-xs">
                                  Rs. {(unit * item.quantity).toLocaleString()}
                                </span>
                                <button
                                  onClick={() => handleRemoveItem(item.product.id)}
                                  className="text-stone-400 hover:text-rose-600 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic py-2 text-center">
                        Box is currently empty. Click "Add to Box" on products to fill it!
                      </p>
                    )}
                  </div>

                  {/* Message Preview Note */}
                  {(recipientName || giftMessage) && (
                    <div className="p-2.5 bg-[#fefbf6] rounded-lg border border-[#d4af37]/30 text-xs space-y-1">
                      <div className="flex items-center gap-1 text-[#8b7355] font-semibold text-[10px] uppercase">
                        <FileText className="w-3 h-3" />
                        <span>Calligraphy Card Attached</span>
                      </div>
                      {recipientName && (
                        <p className="text-stone-700 font-medium">To: {recipientName}</p>
                      )}
                      {giftMessage && (
                        <p className="text-stone-600 italic text-[11px] line-clamp-2">
                          "{giftMessage}"
                        </p>
                      )}
                      {senderName && (
                        <p className="text-stone-700 text-right text-[11px] font-medium">
                          From: {senderName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-stone-500 text-center py-4">
                  Please select a gift box from Step 1.
                </p>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2 pt-2 border-t border-[#e8dfd3] text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{t('boxBasePrice')}:</span>
                <span className="font-semibold">Rs. {boxPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{t('boxProductsTotal')}:</span>
                <span className="font-semibold">Rs. {productsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Satin Ribbon & Note Card:</span>
                <span className="font-bold text-emerald-700">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1b3022] pt-2 border-t border-[#e8dfd3]">
                <span>{t('boxTotalCalc')}:</span>
                <span>Rs. {totalBoxPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!selectedBox || boxItems.length === 0}
                id="add-custom-box-to-cart-btn"
                className="w-full py-3 bg-[#1b3022] hover:bg-[#25422f] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('btnAddToCart')}</span>
              </button>

              <button
                onClick={handleOrderOnWhatsApp}
                disabled={!selectedBox || boxItems.length === 0}
                id="whatsapp-custom-box-order-btn"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Phone className="w-4 h-4" />
                <span>{t('btnOrderWhatsApp')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
