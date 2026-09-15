export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  price: number;
  salePrice?: number;
  description: string;
  descriptionUrdu?: string;
  category: string;
  subcategory?: string;
  occasion?: string;
  stock: number;
  lowStockThreshold?: number;
  sku?: string;
  imageUrl: string;
  images?: string[];
  thumbnail?: string;
  isActive: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isPersonalized?: boolean;
  isGiftBoxEligible?: boolean;
  isOnSale?: boolean;
  badge?: string;
  tags?: string[];
  keywords?: string[];
  rating?: number;
  reviewCount?: number;
  includedItems?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface Occasion {
  id: string;
  name: string;
  slug: string;
  description?: string;
  badge?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface GiftBox {
  id: string;
  name: string;
  price: number;
  description?: string;
  color?: string;
  dimensions?: string;
  imageUrl?: string;
  isActive: boolean;
  order?: number;
}

export interface CustomGiftBoxItem {
  product: Product;
  quantity: number;
}

export interface CustomGiftBox {
  id: string;
  box: GiftBox;
  items: CustomGiftBoxItem[];
  ribbonColor: string;
  giftMessage: {
    recipient: string;
    sender: string;
    message: string;
  };
  boxTotal: number;
}

export interface CartStandardItem {
  type: 'product';
  id: string;
  product: Product;
  quantity: number;
}

export interface CartCustomBoxItem {
  type: 'custom_box';
  id: string;
  customBox: CustomGiftBox;
  quantity: number;
}

export type CartItem = CartStandardItem | CartCustomBoxItem;

export type OrderStatus =
  | 'Payment Pending'
  | 'Payment Verified'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'New';

export type PaymentStatus = 'Payment Pending' | 'Payment Verified' | 'Payment Rejected';

export interface OrderItemSummary {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  type: 'product' | 'custom_box';
  boxDetails?: {
    boxName: string;
    itemsSummary: string;
    ribbonColor?: string;
    message?: string;
    to?: string;
    from?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  deliveryInstructions?: string;
  items: OrderItemSummary[];
  subtotal: number;
  deliveryCharges: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentReceiptUrl?: string;
  adminNotes?: string;
  trackingNumber?: string;
  courierPartner?: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BankPaymentDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branch: string;
  instructions: string;
  qrImageUrl?: string;
  receiptRequired: boolean;
  isActive: boolean;
}

export interface AnnouncementItem {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
  order?: number;
}

export interface TrustItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  isActive: boolean;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  mobileImageUrl?: string;
  badge?: string;
  isActive: boolean;
  order?: number;
}

export interface HomepageSectionConfig {
  id: string; // e.g. 'trust' | 'hero' | 'categories' | 'premium_collection' | 'occasions' | 'gift_boxes' | 'personalized' | 'box_builder' | 'best_sellers' | 'featured' | 'sale' | 'explore' | 'why_us' | 'track_order' | 'reviews' | 'blogs' | 'shipping' | 'faq' | 'concierge'
  name: string;
  isEnabled: boolean;
  order: number;
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImageUrl?: string;
  mobileBackgroundImageUrl?: string;
  backgroundOverlayOpacity?: number; // 0 to 100
  backgroundOverlayColor?: string; // e.g. '#280a13' or '#4a1525' or '#faf8f5'
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  backgroundColor?: string;
  textColor?: 'dark' | 'light';
}

export interface CustomerReview {
  id: string;
  customerName: string;
  city: string;
  rating: number; // 1 to 5
  comment: string;
  productName?: string;
  date: string;
  isApproved: boolean;
  isFeatured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  published: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export interface ThemeSettings {
  primaryColor: string; // deep berry / contrast pink: '#4a1525'
  secondaryColor: string; // dusty rose: '#c96f86'
  blushColor: string; // luxury blush pink: '#fce7eb'
  accentColor: string; // elegant gold: '#d4af37'
  creamBg: string; // warm cream: '#faf8f5'
  charcoalText: string; // charcoal text: '#1f181b'
  // Backward compatibility fields
  primaryGreen?: string;
  goldAccent?: string;
  blushPinkAccent?: string;
}

export interface StoreSettings {
  id?: string;
  whatsappNumber: string;
  storeName: string;
  tagline: string;
  defaultLanguage: 'en';
  deliveryCharges: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryDays?: string;
  shippingNotes?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  announcement?: string;
  announcements?: AnnouncementItem[];
  trustItems?: TrustItem[];
  heroBanners?: HeroBanner[];
  heroAutoSlideDuration?: number; // in seconds, default 5
  homepageSections?: HomepageSectionConfig[];
  themeSettings?: ThemeSettings;
  whatsappHelpButtonText?: string;
  whatsappHelpMessage?: string;
  whatsappHelpEnabled?: boolean;
  bankDetails?: BankPaymentDetails;
  isInitialized?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  role?: 'admin' | 'customer';
  wishlist?: string[];
  createdAt?: string;
}
