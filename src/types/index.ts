export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  price: number;
  salePrice?: number;
  description: string;
  descriptionUrdu?: string;
  category: string;
  occasion?: string;
  stock: number;
  sku?: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameUrdu?: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Occasion {
  id: string;
  name: string;
  nameUrdu?: string;
  slug: string;
  description?: string;
  badge?: string;
}

export interface GiftBox {
  id: string;
  name: string;
  nameUrdu?: string;
  price: number;
  description?: string;
  color?: string;
  dimensions?: string;
  imageUrl?: string;
  isActive: boolean;
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

export type OrderStatus = 'New' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

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
  userId?: string;
  createdAt: string;
  paymentMethod?: string;
}

export interface StoreSettings {
  id?: string;
  whatsappNumber: string; // E.g. "923001234567" or "+92 300 1234567"
  storeName: string;
  tagline: string;
  taglineUrdu?: string;
  defaultLanguage: 'en' | 'ur';
  deliveryCharges: number; // PKR
  freeDeliveryThreshold: number; // PKR
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  announcement?: string;
  announcementUrdu?: string;
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
