import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Copy,
  Check,
  Upload,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { OrderItemSummary, PaymentStatus, OrderStatus } from '../types';
import { processAndCompressImage } from '../utils/imageUtils';

interface CheckoutPageProps {
  setCurrentView: (view: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ setCurrentView }) => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    storeSettings,
    submitOrder,
  } = useStore();
  const { user, userProfile } = useAuth();

  // Multi-step: 1 = Review Order, 2 = Customer Details, 3 = Advance Bank Transfer & Receipt, 4 = Order Placed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(userProfile?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || userProfile?.email || '');
  const [city, setCity] = useState(userProfile?.city || 'Lahore');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [instructions, setInstructions] = useState('');

  // Payment receipt
  const [receiptDataUrl, setReceiptDataUrl] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [receiptError, setReceiptError] = useState<string>('');
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Copy feedback states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{
    orderNumber: string;
    totalAmount: number;
  } | null>(null);

  const bankDetails = storeSettings.bankDetails || {
    bankName: 'Meezan Bank Ltd',
    accountTitle: 'MINAL KHAN GIFT STORE',
    accountNumber: '0102030405060708',
    iban: 'PK00MEZN0001020304050607',
    branch: 'Gulberg Main Boulevard Branch, Lahore',
    instructions: 'Please transfer the exact total amount to our bank account. Take a screenshot or photo of the payment confirmation and upload it below.',
    qrImageUrl: '',
    receiptRequired: true,
    isActive: true,
  };

  const handleCopy = (text: string, fieldName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setReceiptError('Please upload a valid JPG, JPEG, PNG, or WEBP image of your receipt.');
      return;
    }

    setReceiptError('');
    setIsProcessingReceipt(true);
    try {
      // Compress to 900x900, 0.8 quality for crisp legible receipt text & small payload
      const result = await processAndCompressImage(file, 900, 900, 0.8);
      setReceiptDataUrl(result.dataUrl);
      setReceiptFileName(file.name);
    } catch (err: any) {
      setReceiptError(err.message || 'Failed to process receipt image. Please try another file.');
    } finally {
      setIsProcessingReceipt(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (bankDetails.receiptRequired && !receiptDataUrl) {
      setReceiptError('Payment receipt upload is required to verify your order.');
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
        customerEmail,
        address,
        city,
        deliveryInstructions: instructions,
        items: itemsSummary,
        subtotal: cartSubtotal,
        deliveryCharges: cartDeliveryFee,
        totalAmount: cartTotal,
        paymentMethod: 'Advance Bank Transfer',
        paymentStatus: 'Payment Pending',
        orderStatus: 'Payment Pending',
        paymentReceiptUrl: receiptDataUrl,
        userId: user?.uid,
      });

      setPlacedOrder({ orderNumber, totalAmount: cartTotal });
      clearCart();
      setStep(4);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Could not submit order. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty and not on step 4 (confirmation)
  if (cart.length === 0 && step !== 4) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
        <ShoppingBag className="w-16 h-16 text-[#d4af37] mx-auto opacity-70" />
        <h2 className="font-display text-2xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-sm text-stone-500">
          Discover our curated collection of luxury perfumes, fine watches, chocolates, and customized gift boxes.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 bg-[#1b3022] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#25422f]"
        >
          Explore Gifts
        </button>
      </div>
    );
  }

  // STEP 4: ORDER CONFIRMATION
  if (step === 4 && placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8b7355]">
            Order Received & Queued for Verification
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
            Thank You, {customerName || 'Valued Customer'}!
          </h1>
          <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            Your gift order reference is{' '}
            <span className="font-mono font-bold text-base text-[#1b3022] bg-[#f1ece4] px-2 py-0.5 rounded-sm">
              {placedOrder.orderNumber}
            </span>
            . Your Advance Bank Transfer receipt has been successfully submitted to our accounts team.
          </p>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white rounded-2xl border border-[#e8dfd3] p-6 text-left shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500">Payment Status</span>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Payment Pending Verification</span>
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500">Order Total</span>
            <span className="text-base font-bold text-[#1b3022]">
              Rs. {placedOrder.totalAmount.toLocaleString()} (Advance Paid)
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500">Delivery To</span>
            <span className="text-xs font-medium text-stone-800 text-right">
              {city}, {address}
            </span>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed pt-1">
            <strong>What happens next?</strong> Our finance department verifies the bank receipt within 15–30 minutes during business hours. Once verified, you will receive an SMS/WhatsApp dispatch confirmation and tracking details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentView('track-order')}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#1b3022] text-[#f7e7ce] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#25422f] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Track Order Progress</span>
          </button>
          <button
            onClick={() => setCurrentView('shop')}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#faf8f5] border border-stone-300 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors"
          >
            <span>Continue Gifting</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Header & Steps Indicator */}
      <div className="space-y-4">
        <button
          onClick={() => setCurrentView('cart')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#1b3022] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1b3022]">
            Secure Checkout
          </h1>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8b7355] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>100% Encrypted</span>
          </span>
        </div>

        {/* Progress Tabs */}
        <div className="grid grid-cols-3 gap-2 border-b border-[#e8dfd3] pb-4 text-xs font-bold">
          <div
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg ${
              step === 1 ? 'bg-[#1b3022] text-[#f7e7ce]' : 'bg-[#f1ece4] text-stone-600'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Review Order</span>
          </div>
          <div
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg ${
              step === 2 ? 'bg-[#1b3022] text-[#f7e7ce]' : 'bg-[#f1ece4] text-stone-600'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Your Details</span>
          </div>
          <div
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg ${
              step === 3 ? 'bg-[#1b3022] text-[#f7e7ce]' : 'bg-[#f1ece4] text-stone-600'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Bank Transfer</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Step Workspace (Left 7-8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: REVIEW ORDER */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-[#e8dfd3] p-6 space-y-6 shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#1b3022]">
                1. Review Items in Your Gift Order
              </h2>

              <div className="divide-y divide-stone-100">
                {cart.map((item) => {
                  if (item.type === 'product') {
                    const pr = item.product;
                    const price = pr.salePrice ?? pr.price;
                    return (
                      <div key={item.id} className="py-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          {pr.imageUrl ? (
                            <img src={pr.imageUrl} alt={pr.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-stone-900 truncate">{pr.name}</h4>
                          <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#1b3022]">
                            Rs. {(price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    const b = item.customBox;
                    return (
                      <div key={item.id} className="py-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#1b3022] text-[#d4af37] flex items-center justify-center shrink-0 border border-[#d4af37]/30">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-stone-900 truncate">
                            Custom Gift Box: {b.box.name}
                          </h4>
                          <p className="text-xs text-stone-500 truncate">
                            Ribbon: {b.ribbonColor} • {b.items.length} gifts
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#1b3022]">
                            Rs. {(b.boxTotal * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 bg-[#1b3022] text-[#f7e7ce] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#25422f] transition-all flex items-center gap-2 shadow-md"
                >
                  <span>Continue to Customer Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CUSTOMER DETAILS */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-[#e8dfd3] p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[#1b3022]">
                  2. Delivery & Recipient Details
                </h2>
                <span className="text-[11px] text-stone-500 font-medium">Pakistan Nationwide Delivery</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Fatima Zahra"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-[#1b3022] focus:ring-1 focus:ring-[#1b3022] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Phone Number (for Courier Call) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-[#1b3022] focus:ring-1 focus:ring-[#1b3022] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    WhatsApp Number (for Receipt Verification)
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-[#1b3022] focus:ring-1 focus:ring-[#1b3022] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. orders@domain.com"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-[#1b3022] focus:ring-1 focus:ring-[#1b3022] transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore, Karachi, Islamabad, Faisalabad, Rawalpindi"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-[#1b3022] focus:ring-1 focus:ring-[#1b3022] transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Plot number, Street, Block, Phase, Area, Landmark"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-[#1b3022] focus:ring-1 focus:ring-[#1b3022] transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Delivery Instructions / Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Surprise gift for sister, please do not disclose price tag"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs outline-none focus:border-[#1b3022] focus:ring-1 focus:ring-[#1b3022] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-stone-600 hover:text-[#1b3022]"
                >
                  ← Back to Items
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!customerName.trim() || !customerPhone.trim() || !address.trim() || !city.trim()) {
                      alert('Please fill in all required customer details (*)');
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-8 py-3.5 bg-[#1b3022] text-[#f7e7ce] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#25422f] transition-all flex items-center gap-2 shadow-md"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ADVANCE BANK TRANSFER & RECEIPT UPLOAD */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-[#e8dfd3] p-6 space-y-6 shadow-xs">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#8b7355] text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Advance Payment Only</span>
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#1b3022]">
                  3. Official Bank Transfer Details
                </h2>
                <p className="text-xs text-stone-500">
                  Please transfer the total amount of <strong className="text-[#1b3022]">Rs. {cartTotal.toLocaleString()}</strong> to the official MINAL KHAN bank account below.
                </p>
              </div>

              {/* Official Bank Card */}
              <div className="bg-[#fcfaf7] rounded-2xl border-2 border-[#d4af37]/40 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#e8dfd3]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#1b3022] text-[#d4af37] flex items-center justify-center shadow-xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#1b3022]">
                        {bankDetails.bankName}
                      </h4>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {bankDetails.branch}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                    Official Business Account
                  </span>
                </div>

                {/* Account details copy fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Account Title */}
                  <div className="bg-white p-3 rounded-xl border border-[#e8dfd3] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Account Title
                      </span>
                      <span className="font-bold text-stone-900">{bankDetails.accountTitle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.accountTitle, 'title')}
                      className="p-1.5 text-stone-500 hover:text-[#1b3022] rounded-md hover:bg-stone-100 transition-colors"
                      title="Copy Account Title"
                    >
                      {copiedField === 'title' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Account Number */}
                  <div className="bg-white p-3 rounded-xl border border-[#e8dfd3] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Account Number
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        {bankDetails.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.accountNumber, 'acc')}
                      className="p-1.5 text-stone-500 hover:text-[#1b3022] rounded-md hover:bg-stone-100 transition-colors"
                      title="Copy Account Number"
                    >
                      {copiedField === 'acc' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* IBAN */}
                  <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-[#e8dfd3] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        IBAN (for Raast & Interbank Transfers)
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                        {bankDetails.iban}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.iban, 'iban')}
                      className="p-1.5 text-stone-500 hover:text-[#1b3022] rounded-md hover:bg-stone-100 transition-colors"
                      title="Copy IBAN"
                    >
                      {copiedField === 'iban' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Instructions text */}
                {bankDetails.instructions && (
                  <div className="bg-white/80 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                    <p className="font-bold text-stone-800">Transfer Instructions:</p>
                    <p className="whitespace-pre-line leading-relaxed">{bankDetails.instructions}</p>
                  </div>
                )}
              </div>

              {/* Upload Payment Receipt Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
                    Upload Payment Receipt / Screenshot *
                  </label>
                  <span className="text-[10px] text-stone-500">Formats: JPG, JPEG, PNG, WEBP</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />

                {receiptError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{receiptError}</span>
                  </div>
                )}

                {receiptDataUrl ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-300 bg-white shrink-0">
                        <img src={receiptDataUrl} alt="Receipt preview" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block truncate max-w-[200px] sm:max-w-xs">
                          {receiptFileName || 'payment_receipt.jpg'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Receipt attached & ready</span>
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#d4af37]/60 hover:border-[#1b3022] bg-[#faf8f5] hover:bg-[#f1ece4] rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1b3022]/10 text-[#1b3022] flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-stone-800">
                        Click to select payment screenshot or photo
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Capture your online banking success screen or ATM slip
                      </p>
                    </div>
                    {isProcessingReceipt && (
                      <p className="text-xs text-amber-700 font-semibold">Processing image...</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-stone-600 hover:text-[#1b3022]"
                >
                  ← Back to Details
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || isProcessingReceipt}
                  className="px-8 py-4 bg-[#1b3022] hover:bg-[#25422f] disabled:opacity-50 text-[#f7e7ce] rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Order Summary (Sticky 4-5 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#e8dfd3] p-5 sm:p-6 space-y-5 shadow-xs sticky top-24">
          <h3 className="font-display text-base font-bold text-[#1b3022] pb-3 border-b border-stone-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-stone-900">Rs. {cartSubtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Nationwide Delivery</span>
              <span className="font-bold text-stone-900">
                {cartDeliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  `Rs. ${cartDeliveryFee.toLocaleString()}`
                )}
              </span>
            </div>

            {storeSettings.freeDeliveryThreshold > 0 && cartSubtotal >= storeSettings.freeDeliveryThreshold && (
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-semibold text-center">
                ✨ Free Nationwide Delivery Unlocked!
              </div>
            )}

            <div className="pt-3 border-t border-[#f1ece4] flex justify-between items-baseline text-stone-900">
              <span className="font-display text-base font-bold">Total Amount</span>
              <div className="text-right">
                <span className="font-display text-xl font-black text-[#1b3022] block">
                  Rs. {cartTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-400 font-normal">PKR • All Taxes Included</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8dfd3] space-y-2 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Transit Time: {storeSettings.estimatedDeliveryDays || '1–3 business days'}</span>
            </div>
            <p className="text-stone-500 leading-tight">
              All gifts packed with luxury protective tissue, ribbons, and branded MINAL KHAN seal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
