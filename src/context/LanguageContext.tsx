import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en';

export const dictionary: Record<string, string> = {
  // Brand
  brandName: 'MINAL KHAN',
  tagline: 'Premium Gifts & Customized Gift Boxes',
  
  // Navigation
  navHome: 'Home',
  navShop: 'Shop All Gifts',
  navCategories: 'Categories',
  navOccasions: 'Occasions',
  navGiftBoxBuilder: 'Build Your Own Box',
  navCart: 'Gift Cart',
  navWishlist: 'Wishlist',
  navAccount: 'My Account',
  navAdmin: 'Admin Panel',
  navAboutUs: 'About Us',
  navContact: 'Contact & Support',
  navPrivacy: 'Privacy Policy',
  navTerms: 'Terms & Delivery',

  // Hero
  heroTitle: 'MINAL KHAN — Premium Gifts & Customized Gift Boxes in Pakistan',
  heroSubtitle: 'MINAL KHAN is a premium online gift store in Pakistan offering thoughtfully curated gifts for birthdays, anniversaries, weddings, Eid, celebrations and special moments. Shop perfumes, watches, wallets, chocolates, jewellery, personalized gifts and customized gift boxes.',
  heroShopBtn: 'Shop Gifts',
  heroBuildBtn: 'Build Your Own Gift Box',
  heroExploreBoxTitle: 'Signature Custom Gift Box',
  heroExploreBoxDesc: 'Handpick items, choose luxury packaging, and add a personalized calligraphy card note.',

  // Section Titles
  secFeatured: 'Featured Gifts',
  secCategories: 'Shop by Category',
  secOccasions: 'Shop by Occasion',
  secBoxBuilderPromo: 'Craft Your Custom Box',
  secBestSellers: 'Best Sellers',
  secNewArrivals: 'New Arrivals',
  secWhyChoose: 'Why Choose MINAL KHAN',
  secReviews: 'Words of Appreciation',
  secConcierge: 'Customer Support',

  // Actions & Buttons
  btnAddToCart: 'Add to Cart',
  btnBuyNow: 'Buy Now',
  btnOrderWhatsApp: 'Order Now',
  btnViewDetails: 'View Details',
  btnCustomizeNow: 'Start Building Box',
  btnProceedCheckout: 'Proceed to Checkout',
  btnApply: 'Apply',
  btnSave: 'Save Changes',
  btnCancel: 'Cancel',
  btnDelete: 'Delete',
  btnEdit: 'Edit',
  btnSearch: 'Search',
  btnFilter: 'Filter',
  btnClearFilter: 'Clear Filters',
  btnContinueShopping: 'Continue Shopping',
  btnEmptyCart: 'Empty Cart',
  btnSignIn: 'Sign In',
  btnSignUp: 'Create Account',
  btnLogout: 'Log Out',
  btnTrackOrder: 'Track Order',

  // Gift Box Builder
  boxStep1Title: '1. Choose Your Box',
  boxStep2Title: '2. Select Gifts to Include',
  boxStep3Title: '3. Personalize & Note',
  boxStep4Title: '4. Review & Complete',
  boxBasePrice: 'Box Packaging Price',
  boxProductsCount: 'Items Inside Box',
  boxProductsTotal: 'Products Total',
  boxTotalCalc: 'Total Custom Box Price',
  boxSelectNotice: 'Select your preferred luxury box packaging to get started',
  boxAddProductBtn: 'Add to Box',
  boxRemoveProductBtn: 'Remove',
  boxRecipientName: 'Recipient Name (To)',
  boxSenderName: 'Your Name (From)',
  boxMessageLabel: 'Personal Handwritten Card Message',
  boxMessagePlaceholder: 'Write a warm and heartfelt message to be included on a luxury gold-embossed card...',
  boxRibbonLabel: 'Satin Ribbon Color',
  boxRibbonGold: 'Royal Champagne Gold',
  boxRibbonEmerald: 'Deep Emerald Velvet',
  boxRibbonBlush: 'Blush Rose Pink',
  boxRibbonBlack: 'Midnight Black Satin',
  boxAddSuccess: 'Custom Gift Box added to your cart!',

  // Cart & Checkout
  cartTitle: 'Your Gift Cart',
  cartEmpty: 'Your gift cart is empty.',
  cartSubtotal: 'Subtotal',
  cartDeliveryFee: 'Delivery Charges (Pakistan)',
  cartFreeDeliveryQualified: 'Free Nationwide Delivery Applied!',
  cartFreeDeliveryPrompt: 'Add Rs. {amount} more for FREE delivery across Pakistan',
  cartTotal: 'Final Total',
  cartCustomBoxBadge: 'Custom Crafted Gift Box',

  // Delivery & Customer Form
  formName: 'Full Name',
  formPhone: 'Contact Phone Number',
  formWhatsApp: 'WhatsApp Number (for order confirmation)',
  formEmail: 'Email Address (optional)',
  formCity: 'City (e.g. Lahore, Karachi, Islamabad, Peshawar...)',
  formAddress: 'Complete Delivery Address (House/Street/Area)',
  formInstructions: 'Special Delivery or Packaging Instructions',
  formPaymentMethod: 'Advance Bank Transfer',

  // Status & Badges
  statusInStock: 'In Stock',
  statusOutOfStock: 'Out of Stock',
  statusLowStock: 'Only {count} left in stock!',
  badgeFeatured: 'Signature Gift',
  badgeSale: 'Special Offer',

  // Orders
  orderStatusNew: 'New Order',
  orderStatusConfirmed: 'Confirmed',
  orderStatusPreparing: 'Gift Packaging & Preparing',
  orderStatusReady: 'Ready for Dispatch',
  orderStatusDelivered: 'Delivered',
  orderStatusCancelled: 'Cancelled',

  // Currencies & Numbers
  currency: 'Rs.',
  pkr: 'PKR',

  // Notifications & Messages
  msgAddedToCart: 'Added to your gift cart',
  msgAddedToWishlist: 'Added to your wishlist',
  msgRemovedWishlist: 'Removed from wishlist',
  msgOrderSuccess: 'Order placed successfully!',
  msgFillRequired: 'Please fill in all required fields.',

  // Features
  feat1Title: 'Nationwide Luxury Delivery',
  feat1Desc: 'Delicate handling and prompt courier delivery to Karachi, Lahore, Islamabad, and across Pakistan.',
  feat2Title: 'Custom Box Calligraphy',
  feat2Desc: 'Personalized handwritten cards and bespoke ribbon finishes on every gift hamper.',
  feat3Title: '100% Authentic Quality',
  feat3Desc: 'Premium perfumes, genuine leather, fine timepieces, and artisan chocolates.',
  feat4Title: 'Dedicated Customer Support',
  feat4Desc: 'Direct assistance from our gift curators for custom requests and urgent surprises.',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isUrdu: boolean;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language: Language = 'en';
  const isUrdu = false;

  const setLanguage = (_lang: Language) => {
    // English only
  };

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.body.classList.remove('font-urdu');
  }, []);

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let text = dictionary[key] || key;

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
