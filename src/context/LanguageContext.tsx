import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

export interface Translations {
  [key: string]: {
    en: string;
    ur: string;
  };
}

export const dictionary: Translations = {
  // Brand
  brandName: { en: 'MINAL KHAN', ur: 'مینل خان' },
  tagline: { en: 'Premium Gifts & Customized Gift Boxes', ur: 'پریمیئم تحائف اور کسٹمائزڈ گفٹ باکسز' },
  
  // Navigation
  navHome: { en: 'Home', ur: 'ہوم' },
  navShop: { en: 'Shop All Gifts', ur: 'تمام تحائف' },
  navCategories: { en: 'Categories', ur: 'کیٹیگریز' },
  navOccasions: { en: 'Occasions', ur: 'مواقع' },
  navGiftBoxBuilder: { en: 'Build Your Own Box', ur: 'اپنا گفٹ باکس بنائیں' },
  navCart: { en: 'Gift Cart', ur: 'کارٹ' },
  navWishlist: { en: 'Wishlist', ur: 'پسندیدہ' },
  navAccount: { en: 'My Account', ur: 'میرا اکاؤنٹ' },
  navAdmin: { en: 'Admin Panel', ur: 'ایڈمن پینل' },
  navAboutUs: { en: 'About Us', ur: 'ہمارے بارے میں' },
  navContact: { en: 'Contact & Concierge', ur: 'رابطہ و رہنمائی' },
  navPrivacy: { en: 'Privacy Policy', ur: 'پرائیویسی پالیسی' },
  navTerms: { en: 'Terms & Delivery', ur: 'شرائط و ترسیل' },

  // Hero
  heroTitle: { en: 'Create the Perfect Gift', ur: 'مکمل اور دلکش تحفہ تیار کریں' },
  heroSubtitle: { en: 'Thoughtfully selected gifts for every special moment.', ur: 'ہر خاص لمحے کے لیے نفاست اور محبت سے منتخب کردہ تحائف۔' },
  heroShopBtn: { en: 'Shop Gifts', ur: 'تحائف دیکھیں' },
  heroBuildBtn: { en: 'Build Your Own Gift Box', ur: 'اپنا گفٹ باکس تیار کریں' },
  heroExploreBoxTitle: { en: 'Signature Custom Gift Box', ur: 'خصوصی کسٹم گفٹ باکس' },
  heroExploreBoxDesc: { en: 'Handpick items, choose luxury packaging, and add a personalized calligraphy card note.', ur: 'اپنی مرضی کے تحائف چنیں، شاہانہ پیکنگ کا انتخاب کریں اور خوبصورت پیغام شامل کریں۔' },

  // Section Titles
  secFeatured: { en: 'Featured Gifts', ur: 'نمایاں تحائف' },
  secCategories: { en: 'Shop by Category', ur: 'کیٹیگری کے لحاظ سے دیکھیں' },
  secOccasions: { en: 'Shop by Occasion', ur: 'مواقع کے مطابق تحائف' },
  secBoxBuilderPromo: { en: 'Craft Your Custom Box', ur: 'اپنا ذاتی گفٹ باکس تیار کریں' },
  secBestSellers: { en: 'Best Sellers', ur: 'سب سے زیادہ پسندیدہ' },
  secNewArrivals: { en: 'New Arrivals', ur: 'نئی آمد' },
  secWhyChoose: { en: 'Why Choose MINAL KHAN', ur: 'مینل خان کا انتخاب کیوں؟' },
  secReviews: { en: 'Words of Appreciation', ur: 'ہمارے معزز صارفین کی رائے' },
  secConcierge: { en: 'VIP WhatsApp Concierge', ur: 'وی آئی پی واٹس ایپ رہنمائی' },

  // Actions & Buttons
  btnAddToCart: { en: 'Add to Cart', ur: 'کارٹ میں شامل کریں' },
  btnBuyNow: { en: 'Buy Now', ur: 'ابھی خریدیں' },
  btnOrderWhatsApp: { en: 'ORDER ON WHATSAPP', ur: 'واٹس ایپ پر آرڈر کریں' },
  btnViewDetails: { en: 'View Details', ur: 'تفصیلات دیکھیں' },
  btnCustomizeNow: { en: 'Start Building Box', ur: 'باکس بنانا شروع کریں' },
  btnProceedCheckout: { en: 'Proceed to Checkout', ur: 'چیک آؤٹ کی طرف بڑھیں' },
  btnApply: { en: 'Apply', ur: 'لاگو کریں' },
  btnSave: { en: 'Save Changes', ur: 'تبدیلیاں محفوظ کریں' },
  btnCancel: { en: 'Cancel', ur: 'منسوخ' },
  btnDelete: { en: 'Delete', ur: 'حذف کریں' },
  btnEdit: { en: 'Edit', ur: 'ترمیم کریں' },
  btnSearch: { en: 'Search', ur: 'تلاش کریں' },
  btnFilter: { en: 'Filter', ur: 'فلٹر کریں' },
  btnClearFilter: { en: 'Clear Filters', ur: 'تمام فلٹرز ختم کریں' },
  btnContinueShopping: { en: 'Continue Shopping', ur: 'خریداری جاری رکھیں' },
  btnEmptyCart: { en: 'Empty Cart', ur: 'کارٹ خالی کریں' },
  btnSignIn: { en: 'Sign In', ur: 'لاگ ان کریں' },
  btnSignUp: { en: 'Create Account', ur: 'نیا اکاؤنٹ بنائیں' },
  btnLogout: { en: 'Log Out', ur: 'لاگ آؤٹ' },
  btnTrackOrder: { en: 'Track Order', ur: 'آرڈر ٹریک کریں' },

  // Gift Box Builder
  boxStep1Title: { en: '1. Choose Your Box', ur: '۱۔ اپنا گفٹ باکس منتخب کریں' },
  boxStep2Title: { en: '2. Select Gifts to Include', ur: '۲۔ تحائف کا انتخاب کریں' },
  boxStep3Title: { en: '3. Personalize & Note', ur: '۳۔ ذاتی پیغام اور ربن' },
  boxStep4Title: { en: '4. Review & Complete', ur: '۴۔ جائزہ لیں اور آرڈر کریں' },
  boxBasePrice: { en: 'Box Packaging Price', ur: 'باکس کی قیمت' },
  boxProductsCount: { en: 'Items Inside Box', ur: 'باکس میں موجود اشیاء' },
  boxProductsTotal: { en: 'Products Total', ur: 'اشیاء کی کل قیمت' },
  boxTotalCalc: { en: 'Total Custom Box Price', ur: 'کسٹم باکس کی مجموعی قیمت' },
  boxSelectNotice: { en: 'Select your preferred luxury box packaging to get started', ur: 'شروع کرنے کے لیے اپنی پسند کا شاہانہ گفٹ باکس منتخب کریں' },
  boxAddProductBtn: { en: 'Add to Box', ur: 'باکس میں ڈالیں' },
  boxRemoveProductBtn: { en: 'Remove', ur: 'نکالیں' },
  boxRecipientName: { en: 'Recipient Name (To)', ur: 'وصول کنندہ کا نام (بنام)' },
  boxSenderName: { en: 'Your Name (From)', ur: 'آپ کا نام (منجانب)' },
  boxMessageLabel: { en: 'Personal Handwritten Card Message', ur: 'ہاتھ سے لکھا ہوا گفٹ کارڈ کا پیغام' },
  boxMessagePlaceholder: { en: 'Write a warm and heartfelt message to be included on a luxury gold-embossed card...', ur: 'گفٹ کارڈ کے لیے اپنا محبت بھرا پیغام یہاں تحریر کریں...' },
  boxRibbonLabel: { en: 'Satin Ribbon Color', ur: 'ساٹن ربن کا رنگ' },
  boxRibbonGold: { en: 'Royal Champagne Gold', ur: 'شاہی شیمپین گولڈ' },
  boxRibbonEmerald: { en: 'Deep Emerald Velvet', ur: 'گہرا زمردی سبز' },
  boxRibbonBlush: { en: 'Blush Rose Pink', ur: 'گلابی روز ساٹن' },
  boxRibbonBlack: { en: 'Midnight Black Satin', ur: 'مڈ نائٹ بلیک' },
  boxAddSuccess: { en: 'Custom Gift Box added to your cart!', ur: 'کسٹم گفٹ باکس کارٹ میں شامل کر دیا گیا!' },

  // Cart & Checkout
  cartTitle: { en: 'Your Gift Cart', ur: 'آپ کی گفٹ کارٹ' },
  cartEmpty: { en: 'Your gift cart is empty.', ur: 'آپ کی گفٹ کارٹ خالی ہے۔' },
  cartSubtotal: { en: 'Subtotal', ur: 'ذیلی کل' },
  cartDeliveryFee: { en: 'Delivery Charges (Pakistan)', ur: 'ترسیل کے اخراجات (پورے پاکستان میں)' },
  cartFreeDeliveryQualified: { en: 'Free Nationwide Delivery Applied!', ur: 'مفت ملک گیر ترسیل لاگو ہو چکی ہے!' },
  cartFreeDeliveryPrompt: { en: 'Add Rs. {amount} more for FREE delivery across Pakistan', ur: 'مفت ترسیل کے لیے مزید {amount} روپے کا سامان شامل کریں' },
  cartTotal: { en: 'Final Total', ur: 'مکمل ٹوٹل' },
  cartCustomBoxBadge: { en: 'Custom Crafted Gift Box', ur: 'کسٹم تیار کردہ گفٹ باکس' },

  // Delivery & Customer Form
  formName: { en: 'Full Name', ur: 'مکمل نام' },
  formPhone: { en: 'Contact Phone Number', ur: 'فون نمبر' },
  formWhatsApp: { en: 'WhatsApp Number (for order confirmation)', ur: 'واٹس ایپ نمبر (آرڈر کی تصدیق کے لیے)' },
  formEmail: { en: 'Email Address (optional)', ur: 'ای میل ایڈریس (اختیاری)' },
  formCity: { en: 'City (e.g. Lahore, Karachi, Islamabad, Peshawar...)', ur: 'شہر (مثلاً لاہور، کراچی، اسلام آباد، پشاور...)' },
  formAddress: { en: 'Complete Delivery Address (House/Street/Area)', ur: 'مکمل پتہ (مکان نمبر، گلی، علاقہ)' },
  formInstructions: { en: 'Special Delivery or Packaging Instructions', ur: 'ڈیلیوری یا پیکنگ سے متعلق خاص ہدایات' },
  formPaymentMethod: { en: 'Cash on Delivery (COD) / Direct Bank Transfer', ur: 'کیش آن ڈیلیوری / آن لائن بینک ٹرانسفر' },

  // Status & Badges
  statusInStock: { en: 'In Stock', ur: 'دستیاب ہے' },
  statusOutOfStock: { en: 'Out of Stock', ur: 'ختم ہو چکا ہے' },
  statusLowStock: { en: 'Only {count} left in stock!', ur: 'صرف {count} باقی ہیں!' },
  badgeFeatured: { en: 'Signature Gift', ur: 'خصوصی تحفہ' },
  badgeSale: { en: 'Special Offer', ur: 'رعایتی قیمت' },

  // Orders
  orderStatusNew: { en: 'New Order', ur: 'نیا آرڈر' },
  orderStatusConfirmed: { en: 'Confirmed', ur: 'تصدیق شدہ' },
  orderStatusPreparing: { en: 'Gift Packaging & Preparing', ur: 'پیکنگ و تیاری جاری' },
  orderStatusReady: { en: 'Ready for Dispatch', ur: 'ارسال کے لیے تیار' },
  orderStatusDelivered: { en: 'Delivered', ur: 'پہنچ گیا' },
  orderStatusCancelled: { en: 'Cancelled', ur: 'منسوخ' },

  // Currencies & Numbers
  currency: { en: 'Rs.', ur: 'روپے' },
  pkr: { en: 'PKR', ur: 'روپے' },

  // WhatsApp Messages
  waGreeting: { en: 'Assalam-o-Alaikum MINAL KHAN! I would like to place an order:', ur: 'السلام علیکم مینل خان! میں آرڈر بک کروانا چاہتا/چاہتی ہوں:' },
  waCustomerDetails: { en: 'Customer Details', ur: 'گاہک کی تفصیلات' },
  waOrderSummary: { en: 'Order Details', ur: 'آرڈر کی تفصیلات' },
  waTotalBill: { en: 'Total Bill', ur: 'کل رقم' },
  waQuickInquiry: { en: 'Assalam-o-Alaikum! I have a question about this gift from MINAL KHAN:', ur: 'السلام علیکم! مجھے مینل خان کے اس تحفے کے بارے میں معلومات درکار ہیں:' },

  // Account
  accWelcome: { en: 'Welcome to MINAL KHAN Concierge', ur: 'مینل خان وی آئی پی کلب میں خوش آمدید' },
  accOrdersHistory: { en: 'Order History & Status', ur: 'سابقہ آرڈرز اور کیفیت' },
  accNoOrders: { en: 'You have not placed any orders yet.', ur: 'ابھی تک آپ نے کوئی آرڈر بک نہیں کروایا۔' },
  accProfileInfo: { en: 'Saved Delivery Information', ur: 'محفوظ شدہ ڈیلیوری کی معلومات' },

  // Notifications & Messages
  msgAddedToCart: { en: 'Added to your gift cart', ur: 'کارٹ میں شامل کر دیا گیا' },
  msgAddedToWishlist: { en: 'Added to your wishlist', ur: 'پسندیدہ میں شامل کیا گیا' },
  msgRemovedWishlist: { en: 'Removed from wishlist', ur: 'پسندیدہ سے ہٹا دیا گیا' },
  msgOrderSuccess: { en: 'Order placed successfully! Redirecting to WhatsApp...', ur: 'آرڈر کامیابی سے درج ہو گیا! واٹس ایپ پر منتقل کیا جا رہا ہے...' },
  msgFillRequired: { en: 'Please fill in all required fields.', ur: 'برائے مہربانی تمام ضروری خانے پر کریں۔' },

  // Features
  feat1Title: { en: 'Nationwide Luxury Delivery', ur: 'پورے پاکستان میں تیز ترسیل' },
  feat1Desc: { en: 'Delicate handling and prompt courier delivery to Karachi, Lahore, Islamabad, and across Pakistan.', ur: 'کراچی، لاہور، اسلام آباد سمیت ملک بھر میں محفوظ ترین ترسیل۔' },
  feat2Title: { en: 'Custom Box Calligraphy', ur: 'خوبصورت کسٹم خطاطی' },
  feat2Desc: { en: 'Personalized handwritten cards and bespoke ribbon finishes on every gift hamper.', ur: 'ہر گفٹ باکس پر ہاتھ سے لکھا محبت بھرا کارڈ اور شاہانہ ربن۔' },
  feat3Title: { en: '100% Authentic Quality', ur: 'سو فیصد معیاری اشیاء' },
  feat3Desc: { en: 'Premium perfumes, genuine leather, fine timepieces, and artisan chocolates.', ur: 'عمدہ پرفیومز، خالص چمڑا، برانڈڈ گھڑیاں اور لذیذ چاکلیٹس۔' },
  feat4Title: { en: 'Instant WhatsApp Concierge', ur: 'فوری واٹس ایپ رابطہ' },
  feat4Desc: { en: 'Direct coordination with our gift curators for custom requests and urgent surprises.', ur: 'خصوصی تحائف اور فوری سرپرائزز کے لیے ہمارے نمائندے سے براہِ راست بات کریں۔' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isUrdu: boolean;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('minal_khan_lang');
    return saved === 'ur' ? 'ur' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('minal_khan_lang', lang);
  };

  const isUrdu = language === 'ur';

  useEffect(() => {
    document.documentElement.lang = isUrdu ? 'ur' : 'en';
    document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
    if (isUrdu) {
      document.body.classList.add('font-urdu');
    } else {
      document.body.classList.remove('font-urdu');
    }
  }, [isUrdu]);

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const entry = dictionary[key];
    let text = entry ? (isUrdu ? entry.ur || entry.en : entry.en) : key;

    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isUrdu, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
