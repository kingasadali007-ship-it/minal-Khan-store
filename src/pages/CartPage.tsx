import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Gift,
  ArrowRight,
  Phone,
  Truck,
  CheckCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { OrderItemSummary } from '../types';

interface CartPageProps {
  setCurrentView: (view: string) => void;
  onOpenWhatsAppCartOrder: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  setCurrentView,
  onOpenWhatsAppCartOrder,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    storeSettings,
    submitOrder,
    generateWhatsAppOrderUrl,
  } = useStore();
  const { isUrdu, t } = useLanguage();
  const { user, userProfile } = useAuth();

  // Delivery details form state
  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState(userProfile?.city || 'Lahore');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

  const isFreeDelivery =
    storeSettings.freeDeliveryThreshold > 0 &&
    cartSubtotal >= storeSettings.freeDeliveryThreshold;

  const freeDeliveryDiff =
    storeSettings.freeDeliveryThreshold > 0
      ? Math.max(0, storeSettings.freeDeliveryThreshold - cartSubtotal)
      : 0;

  // Handle Standard Web Checkout + Auto-sync to WhatsApp
  const handleStandardCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !address.trim() || !city.trim()) {
      alert(t('msgFillRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsSummary: OrderItemSummary[] = cart.map((item) => {
        if (item.type === 'product') {
          const pr = item.product;
          return {
            productId: pr.id,
            name: pr.name,
            price: pr.salePrice ?? pr.price,
            quantity: item.quantity,
            subtotal: (pr.salePrice ?? pr.price) * item.quantity,
            type: 'product',
          };
        } else {
          const b = item.customBox;
          return {
            name: `Custom Gift Box: ${b.box.name}`,
            price: b.boxTotal,
            quantity: item.quantity,
            subtotal: b.boxTotal * item.quantity,
            type: 'custom_box',
            boxDetails: {
              boxName: b.box.name,
              ribbonColor: b.ribbonColor,
              message: b.giftMessage.message,
              to: b.giftMessage.recipient,
              from: b.giftMessage.sender,
              itemsSummary: b.items
                .map((it) => `${it.product.name} (x${it.quantity})`)
                .join(', '),
            },
          };
        }
      });

      const orderNumber = await submitOrder({
        customerName,
        customerPhone,
        whatsappNumber: whatsappNumber || customerPhone,
        customerEmail: user?.email || '',
        address,
        city,
        deliveryInstructions: instructions,
        items: itemsSummary,
        subtotal: cartSubtotal,
        deliveryCharges: cartDeliveryFee,
        totalAmount: cartTotal,
        orderStatus: 'New',
        userId: user?.uid,
        paymentMethod: 'Cash on Delivery (COD)',
      });

      setPlacedOrderNumber(orderNumber);
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Error recording order in database. Please order via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrderNumber) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="font-display text-3xl font-bold text-[#1b3022]">
          Shukriya! Your Gift Order is Placed.
        </h1>
        <p className="text-sm text-stone-600">
          Your order reference is{' '}
          <span className="font-mono font-bold text-[#1b3022]">{placedOrderNumber}</span>. We will
          call or message you on WhatsApp to confirm delivery time across Pakistan.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setPlacedOrderNumber(null);
              setCurrentView('shop');
            }}
            className="px-6 py-3 bg-[#1b3022] text-white rounded-xl text-xs font-semibold hover:bg-[#25422f]"
          >
            {t('btnContinueShopping')}
          </button>
          <button
            onClick={() => {
              setPlacedOrderNumber(null);
              setCurrentView('account');
            }}
            className="px-6 py-3 bg-[#faf8f5] border border-stone-300 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-100"
          >
            View in My Orders
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
        <ShoppingBag className="w-16 h-16 text-[#d4af37] mx-auto opacity-70" />
        <h2 className="font-display text-2xl font-bold text-stone-900">{t('cartEmpty')}</h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Discover our curated collection of luxury perfumes, fine watches, chocolates, and
          customized gift boxes.
        </p>
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setCurrentView('shop')}
            className="px-6 py-3 bg-[#1b3022] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#25422f]"
          >
            {t('heroShopBtn')}
          </button>
          <button
            onClick={() => setCurrentView('box-builder')}
            className="px-6 py-3 bg-[#d4af37] text-[#1b3022] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#c49f2b]"
          >
            {t('heroBuildBtn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Free Delivery Bar */}
      {storeSettings.freeDeliveryThreshold > 0 && (
        <div className="bg-[#faf8f5] border border-[#d4af37]/40 rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-700 font-medium">
            <Truck className="w-4 h-4 text-[#d4af37]" />
            {isFreeDelivery ? (
              <span className="text-emerald-800 font-bold">
                {t('cartFreeDeliveryQualified')}
              </span>
            ) : (
              <span>
                {t('cartFreeDeliveryPrompt', { amount: freeDeliveryDiff.toLocaleString() })}
              </span>
            )}
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-[#1b3022] font-bold hover:underline"
          >
            Add Gifts
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CART ITEMS LIST (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e8dfd3]">
            <h1 className="font-display text-2xl font-bold text-[#1b3022]">{t('cartTitle')}</h1>
            <button
              onClick={clearCart}
              className="text-xs text-stone-400 hover:text-rose-600 font-medium"
            >
              {t('btnEmptyCart')}
            </button>
          </div>

          <div className="space-y-4">
            {cart.map((item) => {
              if (item.type === 'product') {
                const p = item.product;
                const unitPrice = p.salePrice ?? p.price;
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-xl border border-[#e8dfd3] flex gap-4 items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Gift className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-[#8b7355] font-semibold uppercase">
                          {p.category}
                        </span>
                        <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                          {p.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#1b3022]">
                          Rs. {unitPrice.toLocaleString()} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Qty Controls */}
                      <div className="flex items-center gap-1.5 bg-[#faf8f5] border border-stone-200 px-2 py-1 rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="text-stone-500 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-900 px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= p.stock}
                          className="text-stone-500 hover:text-stone-900 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[75px]">
                        <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                          Rs. {lineTotal.toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 ml-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Custom Gift Box Item
                const b = item.customBox;
                const lineTotal = b.boxTotal * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-xl border-2 border-[#1b3022]/40 bg-gradient-to-br from-white to-[#faf8f5] space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[#1b3022] text-[#f7e7ce]">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] bg-[#1b3022] px-2 py-0.5 rounded-full">
                            Custom Gift Box
                          </span>
                          <h3 className="font-display text-sm font-bold text-[#1b3022] mt-1">
                            {b.box.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-stone-900">
                          Rs. {lineTotal.toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Box Items Summary */}
                    <div className="text-xs bg-[#faf8f5] p-3 rounded-lg border border-stone-200 space-y-1">
                      <div className="text-stone-600 flex justify-between text-[11px]">
                        <span>Satin Ribbon Color:</span>
                        <span className="font-semibold text-stone-900">{b.ribbonColor}</span>
                      </div>
                      <div className="text-stone-600 text-[11px]">
                        <span className="font-medium">Items included ({b.items.reduce((s, i) => s + i.quantity, 0)}): </span>
                        <span className="text-stone-800">
                          {b.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                        </span>
                      </div>
                      {b.giftMessage.message && (
                        <div className="text-[11px] text-stone-600 italic pt-1 border-t border-stone-200">
                          Card Message: "{b.giftMessage.message}"
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-semibold text-[#1b3022] hover:text-[#d4af37] flex items-center gap-1"
            >
              <span>← {t('btnContinueShopping')}</span>
            </button>
          </div>
        </div>

        {/* CHECKOUT & DELIVERY FORM (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-md p-6 space-y-5">
            <h2 className="font-display text-lg font-bold text-[#1b3022] pb-2 border-b border-[#f1ece4]">
              Order Summary & Delivery
            </h2>

            {/* Financial Totals */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{t('cartSubtotal')}:</span>
                <span className="font-semibold">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{t('cartDeliveryFee')}:</span>
                <span className="font-semibold">
                  {cartDeliveryFee === 0 ? 'FREE' : `Rs. ${cartDeliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1b3022] pt-2 border-t border-[#e8dfd3]">
                <span>{t('cartTotal')}:</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Proceed to Checkout Action */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => setCurrentView('checkout')}
                id="cart-proceed-checkout-btn"
                className="w-full py-4 bg-[#1b3022] hover:bg-[#25422f] text-[#f7e7ce] rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8dfd3] space-y-1.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Advance Bank Transfer Only</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  100% verified online bank transfer with instant payment receipt upload. No Cash on Delivery.
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setCurrentView('shop')}
                className="text-xs font-medium text-stone-500 hover:text-stone-800"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
