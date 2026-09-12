import React, { useState, useEffect } from 'react';
import { X, Phone, MapPin, User, FileText, CheckCircle, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Product, CustomGiftBox, CartItem, OrderItemSummary } from '../types';

interface OrderWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  singleProduct?: { product: Product; quantity: number };
  singleBox?: CustomGiftBox;
  cartItems?: CartItem[];
  customTotal?: number;
}

export const OrderWhatsAppModal: React.FC<OrderWhatsAppModalProps> = ({
  isOpen,
  onClose,
  singleProduct,
  singleBox,
  cartItems,
  customTotal,
}) => {
  const { user, userProfile } = useAuth();
  const { storeSettings, generateWhatsAppOrderUrl, submitOrder, cartDeliveryFee } = useStore();
  const { isUrdu, t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleteNumber, setOrderCompleteNumber] = useState<string | null>(null);

  // Auto-fill from user profile if signed in
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setCustomerName(userProfile.name);
      if (userProfile.phone) {
        setCustomerPhone(userProfile.phone);
        setWhatsappNumber(userProfile.phone);
      }
      if (userProfile.address) setAddress(userProfile.address);
      if (userProfile.city) setCity(userProfile.city);
    }
  }, [userProfile]);

  if (!isOpen) return null;

  // Calculate Subtotal & Delivery
  let subtotal = 0;
  if (singleProduct) {
    const p = singleProduct.product;
    subtotal = (p.salePrice ?? p.price) * singleProduct.quantity;
  } else if (singleBox) {
    subtotal = singleBox.boxTotal;
  } else if (cartItems) {
    subtotal = customTotal ?? 0;
  }

  const isFreeDelivery =
    storeSettings.freeDeliveryThreshold > 0 && subtotal >= storeSettings.freeDeliveryThreshold;
  const deliveryCharges = subtotal === 0 ? 0 : isFreeDelivery ? 0 : storeSettings.deliveryCharges;
  const grandTotal = subtotal + deliveryCharges;

  const handleConfirmAndOpenWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      alert(t('msgFillRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Build order items summary
      const itemsSummary: OrderItemSummary[] = [];

      if (singleProduct) {
        const p = singleProduct.product;
        itemsSummary.push({
          productId: p.id,
          name: p.name,
          price: p.salePrice ?? p.price,
          quantity: singleProduct.quantity,
          subtotal: (p.salePrice ?? p.price) * singleProduct.quantity,
          type: 'product',
        });
      } else if (singleBox) {
        itemsSummary.push({
          name: `Custom Box: ${singleBox.box.name}`,
          price: singleBox.boxTotal,
          quantity: 1,
          subtotal: singleBox.boxTotal,
          type: 'custom_box',
          boxDetails: {
            boxName: singleBox.box.name,
            ribbonColor: singleBox.ribbonColor,
            message: singleBox.giftMessage.message,
            to: singleBox.giftMessage.recipient,
            from: singleBox.giftMessage.sender,
            itemsSummary: singleBox.items
              .map((i) => `${i.product.name} (x${i.quantity})`)
              .join(', '),
          },
        });
      } else if (cartItems) {
        cartItems.forEach((c) => {
          if (c.type === 'product') {
            const pr = c.product;
            itemsSummary.push({
              productId: pr.id,
              name: pr.name,
              price: pr.salePrice ?? pr.price,
              quantity: c.quantity,
              subtotal: (pr.salePrice ?? pr.price) * c.quantity,
              type: 'product',
            });
          } else {
            const b = c.customBox;
            itemsSummary.push({
              name: `Custom Box: ${b.box.name}`,
              price: b.boxTotal,
              quantity: c.quantity,
              subtotal: b.boxTotal * c.quantity,
              type: 'custom_box',
              boxDetails: {
                boxName: b.box.name,
                ribbonColor: b.ribbonColor,
                message: b.giftMessage.message,
                to: b.giftMessage.recipient,
                from: b.giftMessage.sender,
                itemsSummary: b.items
                  .map((i) => `${i.product.name} (x${i.quantity})`)
                  .join(', '),
              },
            });
          }
        });
      }

      // Persist order in Firestore
      const orderNum = await submitOrder({
        customerName,
        customerPhone,
        whatsappNumber: whatsappNumber || customerPhone,
        customerEmail: user?.email || '',
        address,
        city,
        deliveryInstructions: instructions,
        items: itemsSummary,
        subtotal,
        deliveryCharges,
        totalAmount: grandTotal,
        orderStatus: 'New',
        userId: user?.uid,
        paymentMethod: 'Cash on Delivery (COD) / WhatsApp',
      });

      setOrderCompleteNumber(orderNum);

      // Generate WhatsApp URL with latest admin WhatsApp number
      const waUrl = generateWhatsAppOrderUrl({
        customerName,
        customerPhone,
        customerAddress: address,
        city,
        instructions,
        singleProduct,
        singleBox,
        cartItems,
      });

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Could not save order record, but WhatsApp will open now.');
      const waUrl = generateWhatsAppOrderUrl({
        customerName,
        customerPhone,
        customerAddress: address,
        city,
        instructions,
        singleProduct,
        singleBox,
        cartItems,
      });
      window.open(waUrl, '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e8dfd3] my-8 animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {orderCompleteNumber ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-display">
              Order Recorded Successfully!
            </h3>
            <p className="text-sm text-stone-600">
              Reference #{' '}
              <span className="font-mono font-bold text-[#1b3022]">{orderCompleteNumber}</span>
            </p>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Your details have been registered. The official MINAL KHAN WhatsApp chat has been
              opened for instant confirmation.
            </p>
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  setOrderCompleteNumber(null);
                  onClose();
                }}
                className="w-full py-2.5 bg-[#1b3022] text-white rounded-xl text-sm font-semibold hover:bg-[#25422f]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                <Phone className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold font-display text-[#1b3022]">
                {t('btnOrderWhatsApp')}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Enter your delivery details in Pakistan. We will connect you to our WhatsApp concierge
              with your order pre-filled.
            </p>

            {/* Order Price Summary Card */}
            <div className="bg-[#faf8f5] rounded-xl p-3.5 mb-5 border border-[#e8dfd3] space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{t('cartSubtotal')}:</span>
                <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{t('cartDeliveryFee')}:</span>
                <span className="font-semibold">
                  {deliveryCharges === 0 ? 'FREE' : `Rs. ${deliveryCharges.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1b3022] pt-1.5 border-t border-[#e8dfd3]">
                <span>{t('cartTotal')}:</span>
                <span>Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmAndOpenWhatsApp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('formName')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Asad Ali / Ayesha Khan"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('formPhone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City (Pakistan) *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore, Karachi, Islamabad..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('formAddress')} *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Street / Sector / Town"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Gift Note / Delivery Instructions (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Please deliver by Saturday / write 'Happy Birthday' on card"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-whatsapp-order-modal"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98"
                >
                  <Phone className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Recording Order...' : 'Confirm & Open WhatsApp (Rs. ' + grandTotal.toLocaleString() + ')'}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                Cash on Delivery (COD) & Online Bank Transfer supported across Pakistan.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
