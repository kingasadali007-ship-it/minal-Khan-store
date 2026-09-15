import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';
import {
  Product,
  Category,
  Occasion,
  GiftBox,
  CartItem,
  CustomGiftBox,
  Order,
  OrderStatus,
  StoreSettings,
  HeroBanner,
  HomepageSectionConfig,
  CustomerReview,
  BlogPost,
  FAQItem,
} from '../types';
import {
  DEFAULT_STORE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_OCCASIONS,
  INITIAL_GIFT_BOXES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_BLOGS,
  INITIAL_FAQS,
  DEFAULT_HOMEPAGE_SECTIONS,
} from '../utils/seedData';
import { useAuth } from './AuthContext';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  occasions: Occasion[];
  giftBoxes: GiftBox[];
  orders: Order[];
  storeSettings: StoreSettings;
  reviews: CustomerReview[];
  blogs: BlogPost[];
  faqs: FAQItem[];
  loading: boolean;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  addCustomBoxToCart: (customBox: CustomGiftBox) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;
  cartItemsCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // WhatsApp Order & Support
  generateWhatsAppOrderUrl: (options: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    city?: string;
    instructions?: string;
    cartItems?: CartItem[];
    singleProduct?: { product: Product; quantity: number };
    singleBox?: CustomGiftBox;
  }) => string;
  submitOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Promise<string>;

  // Admin Actions: Products
  addProduct: (product: Omit<Product, 'id'>) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (productId: string, newStock: number) => Promise<void>;
  saveProduct: (product: Omit<Product, 'id'>, id?: string) => Promise<string>;
  deleteProductItem: (id: string) => Promise<void>;
  
  // Admin Actions: Categories
  addCategory: (cat: Omit<Category, 'id'>) => Promise<string>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveCategory: (cat: Omit<Category, 'id'>, id?: string) => Promise<string>;
  deleteCategoryItem: (id: string) => Promise<void>;

  // Admin Actions: Occasions
  addOccasion: (occ: Omit<Occasion, 'id'>) => Promise<string>;
  updateOccasion: (id: string, updates: Partial<Occasion>) => Promise<void>;
  deleteOccasion: (id: string) => Promise<void>;
  saveOccasion: (occ: Omit<Occasion, 'id'>, id?: string) => Promise<string>;
  deleteOccasionItem: (id: string) => Promise<void>;

  // Admin Actions: Gift Boxes
  addGiftBox: (box: Omit<GiftBox, 'id'>) => Promise<string>;
  updateGiftBox: (id: string, updates: Partial<GiftBox>) => Promise<void>;
  deleteGiftBox: (id: string) => Promise<void>;
  saveGiftBox: (box: Omit<GiftBox, 'id'>, id?: string) => Promise<string>;
  deleteGiftBoxItem: (id: string) => Promise<void>;

  // Admin Actions: Hero Banners
  addHeroBanner: (banner: Omit<HeroBanner, 'id'>) => Promise<void>;
  updateHeroBanner: (id: string, updates: Partial<HeroBanner>) => Promise<void>;
  deleteHeroBanner: (id: string) => Promise<void>;

  // Admin Actions: Homepage Sections
  updateHomepageSections: (sections: HomepageSectionConfig[]) => Promise<void>;
  toggleHomepageSection: (id: string, isEnabled: boolean) => Promise<void>;
  updateHomepageSectionConfig: (id: string, updates: Partial<HomepageSectionConfig>) => Promise<void>;

  // Reviews
  addCustomerReview: (review: Omit<CustomerReview, 'id' | 'date' | 'isApproved'>) => Promise<string>;
  updateReviewStatus: (id: string, isApproved: boolean) => Promise<void>;
  toggleFeatureReview: (id: string, isFeatured: boolean) => Promise<void>;
  deleteCustomerReview: (id: string) => Promise<void>;

  // Blog Posts
  addBlogPost: (post: Omit<BlogPost, 'id' | 'date'>) => Promise<string>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  // FAQs
  addFAQItem: (faq: Omit<FAQItem, 'id'>) => Promise<string>;
  updateFAQItem: (id: string, updates: Partial<FAQItem>) => Promise<void>;
  deleteFAQItem: (id: string) => Promise<void>;

  // Order & Settings
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courierPartner?: string, adminNotes?: string) => Promise<void>;
  updateStoreSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  updateSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  seedInitialDataIfEmpty: (forceReset?: boolean) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile, updateCustomerProfile, isAdmin, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(() =>
    INITIAL_CATEGORIES.map((c, i) => ({ ...c, id: `cat_${i + 1}` }))
  );
  const [occasions, setOccasions] = useState<Occasion[]>(() =>
    INITIAL_OCCASIONS.map((o, i) => ({ ...o, id: `occ_${i + 1}` }))
  );
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>(() =>
    INITIAL_GIFT_BOXES.map((b, i) => ({ ...b, id: `box_${i + 1}` }))
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [loading, setLoading] = useState(true);

  // Cart state persisted locally
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('minal_gift_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('minal_gift_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('minal_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (userProfile?.wishlist) {
      setWishlist(userProfile.wishlist);
    }
  }, [userProfile]);

  // Real-time listener: Store Settings
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'store_settings', 'main'),
      (snap) => {
        if (snap.exists()) {
          setStoreSettings({ ...DEFAULT_STORE_SETTINGS, ...snap.data() } as StoreSettings);
        }
      },
      (error) => {
        console.warn('Store settings listener warning:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Real-time listener: Products
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        const prods: Product[] = [];
        snap.forEach((docSnap) => {
          prods.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
        });
        setProducts(prods.length > 0 ? prods : INITIAL_PRODUCTS);
        setLoading(false);
      },
      (error) => {
        console.warn('Products listener notice:', error.message);
        setProducts(INITIAL_PRODUCTS);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Real-time listener: Categories
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'categories'),
      (snap) => {
        const cats: Category[] = [];
        snap.forEach((docSnap) => {
          cats.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
        });
        if (cats.length > 0) {
          setCategories(cats);
        }
      },
      (error) => {
        console.warn('Categories listener notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Real-time listener: Occasions
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'occasions'),
      (snap) => {
        const occs: Occasion[] = [];
        snap.forEach((docSnap) => {
          occs.push({ id: docSnap.id, ...(docSnap.data() as Omit<Occasion, 'id'>) });
        });
        if (occs.length > 0) {
          setOccasions(occs);
        }
      },
      (error) => {
        console.warn('Occasions listener notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Real-time listener: Gift Boxes
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'gift_boxes'),
      (snap) => {
        const boxes: GiftBox[] = [];
        snap.forEach((docSnap) => {
          boxes.push({ id: docSnap.id, ...(docSnap.data() as Omit<GiftBox, 'id'>) });
        });
        if (boxes.length > 0) {
          setGiftBoxes(boxes);
        }
      },
      (error) => {
        console.warn('Gift boxes listener notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Real-time listener: Customer Reviews
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'reviews'),
      (snap) => {
        const revs: CustomerReview[] = [];
        snap.forEach((docSnap) => {
          revs.push({ id: docSnap.id, ...(docSnap.data() as Omit<CustomerReview, 'id'>) });
        });
        if (revs.length > 0) {
          setReviews(revs);
        }
      },
      (error) => {
        console.warn('Reviews listener notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Real-time listener: Blog Posts
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'blogs'),
      (snap) => {
        const blgs: BlogPost[] = [];
        snap.forEach((docSnap) => {
          blgs.push({ id: docSnap.id, ...(docSnap.data() as Omit<BlogPost, 'id'>) });
        });
        if (blgs.length > 0) {
          setBlogs(blgs);
        }
      },
      (error) => {
        console.warn('Blogs listener notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Real-time listener: FAQs
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'faqs'),
      (snap) => {
        const fqs: FAQItem[] = [];
        snap.forEach((docSnap) => {
          fqs.push({ id: docSnap.id, ...(docSnap.data() as Omit<FAQItem, 'id'>) });
        });
        if (fqs.length > 0) {
          fqs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setFaqs(fqs);
        }
      },
      (error) => {
        console.warn('FAQs listener notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Real-time listener: Orders (Admins see all; signed-in users see their own; guests see local)
  useEffect(() => {
    if (authLoading) return;

    if (isAdmin) {
      const unsub = onSnapshot(
        collection(db, 'orders'),
        (snap) => {
          const ords: Order[] = [];
          snap.forEach((docSnap) => {
            ords.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
          });
          ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(ords);
        },
        (error) => {
          console.warn('Admin orders listener notice:', error.message);
        }
      );
      return () => unsub();
    }

    if (user?.uid) {
      const userOrdersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const unsub = onSnapshot(
        userOrdersQuery,
        (snap) => {
          const ords: Order[] = [];
          snap.forEach((docSnap) => {
            ords.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
          });
          ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(ords);
        },
        (error) => {
          console.warn('User orders listener notice:', error.message);
        }
      );
      return () => unsub();
    }

    // Guest fallback from localStorage
    try {
      const guestSaved = localStorage.getItem('minal_guest_orders');
      if (guestSaved) {
        setOrders(JSON.parse(guestSaved));
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  }, [authLoading, isAdmin, user?.uid]);

  // Seed default categories, occasions, base boxes, products, reviews, blogs, faqs if collections are empty or on force reset
  const seedInitialDataIfEmpty = async (forceReset = false) => {
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      if (prodSnap.empty || forceReset) {
        const batch = writeBatch(db);
        INITIAL_PRODUCTS.forEach((p) => {
          const { id, ...rest } = p;
          const docRef = doc(collection(db, 'products'));
          batch.set(docRef, {
            ...rest,
            id: docRef.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        });
        await batch.commit();
      }

      const catSnap = await getDocs(collection(db, 'categories'));
      if (catSnap.empty || forceReset) {
        const batch = writeBatch(db);
        INITIAL_CATEGORIES.forEach((cat) => {
          const docRef = doc(collection(db, 'categories'));
          batch.set(docRef, { ...cat, id: docRef.id });
        });
        await batch.commit();
      }

      const occSnap = await getDocs(collection(db, 'occasions'));
      if (occSnap.empty || forceReset) {
        const batch = writeBatch(db);
        INITIAL_OCCASIONS.forEach((occ) => {
          const docRef = doc(collection(db, 'occasions'));
          batch.set(docRef, { ...occ, id: docRef.id });
        });
        await batch.commit();
      }

      const boxSnap = await getDocs(collection(db, 'gift_boxes'));
      if (boxSnap.empty || forceReset) {
        const batch = writeBatch(db);
        INITIAL_GIFT_BOXES.forEach((b) => {
          const docRef = doc(collection(db, 'gift_boxes'));
          batch.set(docRef, { ...b, id: docRef.id });
        });
        await batch.commit();
      }

      const revSnap = await getDocs(collection(db, 'reviews'));
      if (revSnap.empty || forceReset) {
        const batch = writeBatch(db);
        INITIAL_REVIEWS.forEach((rev) => {
          const docRef = doc(collection(db, 'reviews'));
          batch.set(docRef, { ...rev, id: docRef.id });
        });
        await batch.commit();
      }

      const blogSnap = await getDocs(collection(db, 'blogs'));
      if (blogSnap.empty || forceReset) {
        const batch = writeBatch(db);
        INITIAL_BLOGS.forEach((blog) => {
          const docRef = doc(collection(db, 'blogs'));
          batch.set(docRef, { ...blog, id: docRef.id });
        });
        await batch.commit();
      }

      const faqSnap = await getDocs(collection(db, 'faqs'));
      if (faqSnap.empty || forceReset) {
        const batch = writeBatch(db);
        INITIAL_FAQS.forEach((faq) => {
          const docRef = doc(collection(db, 'faqs'));
          batch.set(docRef, { ...faq, id: docRef.id });
        });
        await batch.commit();
      }

      // Seed store settings document if missing or forced
      const settingRef = doc(db, 'store_settings', 'main');
      if (forceReset) {
        await setDoc(settingRef, {
          ...DEFAULT_STORE_SETTINGS,
          isInitialized: true,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Seed operation notice:', err);
    }
  };

  useEffect(() => {
    seedInitialDataIfEmpty();
  }, []);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.type === 'product' && item.product.id === product.id
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIdx].quantity;
        const newQty = Math.min(product.stock, currentQty + quantity);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
        };
        return updated;
      } else {
        const initialQty = Math.min(product.stock, Math.max(1, quantity));
        return [
          ...prev,
          {
            type: 'product',
            id: `prod_${product.id}_${Date.now()}`,
            product,
            quantity: initialQty,
          },
        ];
      }
    });
  };

  const addCustomBoxToCart = (customBox: CustomGiftBox) => {
    setCart((prev) => [
      ...prev,
      {
        type: 'custom_box',
        id: customBox.id || `custom_box_${Date.now()}`,
        customBox,
        quantity: 1,
      },
    ]);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (item.type === 'product') {
            const capped = Math.min(item.product.stock, quantity);
            return { ...item, quantity: capped };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart financial calculations
  const cartSubtotal = cart.reduce((acc, item) => {
    if (item.type === 'product') {
      const activePrice = item.product.salePrice ?? item.product.price;
      return acc + activePrice * item.quantity;
    } else {
      return acc + item.customBox.boxTotal * item.quantity;
    }
  }, 0);

  const isFreeDelivery =
    storeSettings.freeDeliveryThreshold > 0 &&
    cartSubtotal >= storeSettings.freeDeliveryThreshold;

  const cartDeliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : storeSettings.deliveryCharges;
  const cartTotal = cartSubtotal + cartDeliveryFee;
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      let next: string[];
      if (prev.includes(productId)) {
        next = prev.filter((id) => id !== productId);
      } else {
        next = [...prev, productId];
      }
      localStorage.setItem('minal_wishlist', JSON.stringify(next));
      if (user) {
        updateCustomerProfile({ wishlist: next }).catch(console.error);
      }
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // WhatsApp Order generator - strictly uses dynamic storeSettings.whatsappNumber
  const generateWhatsAppOrderUrl = (options: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    city?: string;
    instructions?: string;
    cartItems?: CartItem[];
    singleProduct?: { product: Product; quantity: number };
    singleBox?: CustomGiftBox;
  }) => {
    const rawNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const targetPhone = rawNumber || '923001234567';

    let message = `*${storeSettings.storeName.toUpperCase()}*\n`;
    message += `_${storeSettings.tagline}_\n\n`;
    message += `🌟 *NEW GIFT ORDER REQUEST*\n`;
    message += `------------------------------\n`;
    message += `👤 *Customer Name:* ${options.customerName || 'Valued Customer'}\n`;
    message += `📞 *Phone:* ${options.customerPhone}\n`;
    message += `📍 *Delivery Address:* ${options.customerAddress}`;
    if (options.city) message += `, ${options.city}`;
    message += `\n`;

    if (options.instructions?.trim()) {
      message += `📝 *Instructions:* ${options.instructions}\n`;
    }

    message += `\n📦 *ORDER DETAILS:*\n`;

    let subtotal = 0;

    // Case 1: Single Product
    if (options.singleProduct) {
      const p = options.singleProduct.product;
      const unitPrice = p.salePrice ?? p.price;
      const lineTotal = unitPrice * options.singleProduct.quantity;
      subtotal += lineTotal;
      message += `• *${p.name}*\n`;
      message += `  Qty: ${options.singleProduct.quantity} x Rs. ${unitPrice.toLocaleString()} = Rs. ${lineTotal.toLocaleString()}\n`;
    }

    // Case 2: Single Custom Gift Box
    else if (options.singleBox) {
      const b = options.singleBox;
      subtotal += b.boxTotal;
      message += `🎁 *CUSTOM GIFT BOX: ${b.box.name}*\n`;
      message += `  • Box Base: Rs. ${b.box.price.toLocaleString()}\n`;
      message += `  • Ribbon: ${b.ribbonColor}\n`;
      if (b.giftMessage.recipient) message += `  • To: ${b.giftMessage.recipient}\n`;
      if (b.giftMessage.sender) message += `  • From: ${b.giftMessage.sender}\n`;
      if (b.giftMessage.message) message += `  • Card Message: "${b.giftMessage.message}"\n`;
      message += `  • *Included Items:*\n`;
      b.items.forEach((item, idx) => {
        const itemPrice = item.product.salePrice ?? item.product.price;
        message += `    ${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - Rs. ${(itemPrice * item.quantity).toLocaleString()}\n`;
      });
      message += `  *Box Total:* Rs. ${b.boxTotal.toLocaleString()}\n`;
    }

    // Case 3: Cart Items
    else if (options.cartItems && options.cartItems.length > 0) {
      options.cartItems.forEach((item, i) => {
        if (item.type === 'product') {
          const unitPrice = item.product.salePrice ?? item.product.price;
          const lineTotal = unitPrice * item.quantity;
          subtotal += lineTotal;
          message += `${i + 1}. *${item.product.name}*\n`;
          message += `   Qty: ${item.quantity} x Rs. ${unitPrice.toLocaleString()} = Rs. ${lineTotal.toLocaleString()}\n`;
        } else {
          const b = item.customBox;
          const lineTotal = b.boxTotal * item.quantity;
          subtotal += lineTotal;
          message += `${i + 1}. 🎁 *Custom Gift Box: ${b.box.name}* (Qty: ${item.quantity})\n`;
          message += `   Ribbon: ${b.ribbonColor}\n`;
          if (b.giftMessage.recipient) message += `   To: ${b.giftMessage.recipient} | From: ${b.giftMessage.sender || 'Anonymous'}\n`;
          if (b.giftMessage.message) message += `   Note: "${b.giftMessage.message}"\n`;
          message += `   Items: ${b.items.map((it) => `${it.product.name} (x${it.quantity})`).join(', ')}\n`;
          message += `   Total: Rs. ${lineTotal.toLocaleString()}\n`;
        }
      });
    }

    const isFree = storeSettings.freeDeliveryThreshold > 0 && subtotal >= storeSettings.freeDeliveryThreshold;
    const deliveryFee = subtotal === 0 ? 0 : isFree ? 0 : storeSettings.deliveryCharges;
    const finalTotal = subtotal + deliveryFee;

    message += `------------------------------\n`;
    message += `💵 *Subtotal:* Rs. ${subtotal.toLocaleString()}\n`;
    message += `🚚 *Delivery Charges:* ${deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}\n`;
    message += `💰 *TOTAL AMOUNT:* Rs. ${finalTotal.toLocaleString()}\n`;
    message += `------------------------------\n`;
    message += `_Please confirm my order and share dispatch timing. Thank you!_`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  // Submit Order to Firestore
  const submitOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<string> => {
    try {
      const orderDocRef = doc(collection(db, 'orders'));
      const orderNumber = `MK-${Math.floor(100000 + Math.random() * 900000)}`;
      const fullOrder: Order = {
        ...orderData,
        id: orderDocRef.id,
        orderNumber,
        userId: user?.uid || orderData.userId || '',
        createdAt: new Date().toISOString(),
      };
      await setDoc(orderDocRef, fullOrder);

      // Local storage backup for guest instant tracking
      try {
        const guestSaved = JSON.parse(localStorage.getItem('minal_guest_orders') || '[]');
        localStorage.setItem('minal_guest_orders', JSON.stringify([fullOrder, ...guestSaved]));
        if (!user && !isAdmin) {
          setOrders((prev) => [fullOrder, ...prev]);
        }
      } catch {
        // ignore
      }

      return orderNumber;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    }
  };

  // Admin Actions
  const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
    try {
      const docRef = doc(collection(db, 'products'));
      const cleanProduct: Record<string, any> = {
        id: docRef.id,
        name: product.name?.trim() || 'Untitled Product',
        nameUrdu: product.nameUrdu?.trim() || '',
        price: Number(product.price) || 0,
        description: product.description?.trim() || '',
        descriptionUrdu: product.descriptionUrdu?.trim() || '',
        category: product.category || 'Gift Boxes',
        occasion: product.occasion || 'General',
        imageUrl: product.imageUrl?.trim() || '',
        stock: Math.max(0, Number(product.stock ?? 10)),
        isActive: product.isActive !== undefined ? Boolean(product.isActive) : true,
        isFeatured: Boolean(product.isFeatured),
        sku: product.sku?.trim() || `MK-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (product.salePrice !== undefined && product.salePrice !== null && Number(product.salePrice) > 0) {
        cleanProduct.salePrice = Number(product.salePrice);
      }
      await setDoc(docRef, cleanProduct);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'products');
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const docRef = doc(db, 'products', id);
      const cleanUpdates: Record<string, any> = {
        updatedAt: new Date().toISOString(),
      };
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          cleanUpdates[key] = value;
        }
      });
      await setDoc(docRef, cleanUpdates, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    const safeStock = Math.max(0, newStock);
    await updateProduct(productId, { stock: safeStock });
  };

  const addCategory = async (cat: Omit<Category, 'id'>): Promise<string> => {
    try {
      const docRef = doc(collection(db, 'categories'));
      await setDoc(docRef, { ...cat, id: docRef.id });
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'categories');
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await updateDoc(doc(db, 'categories', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  };

  const addOccasion = async (occ: Omit<Occasion, 'id'>): Promise<string> => {
    try {
      const docRef = doc(collection(db, 'occasions'));
      await setDoc(docRef, { ...occ, id: docRef.id });
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'occasions');
    }
  };

  const updateOccasion = async (id: string, updates: Partial<Occasion>) => {
    try {
      await updateDoc(doc(db, 'occasions', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `occasions/${id}`);
    }
  };

  const deleteOccasion = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'occasions', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `occasions/${id}`);
    }
  };

  const addGiftBox = async (box: Omit<GiftBox, 'id'>): Promise<string> => {
    try {
      const docRef = doc(collection(db, 'gift_boxes'));
      await setDoc(docRef, { ...box, id: docRef.id });
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'gift_boxes');
    }
  };

  const updateGiftBox = async (id: string, updates: Partial<GiftBox>) => {
    try {
      await updateDoc(doc(db, 'gift_boxes', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `gift_boxes/${id}`);
    }
  };

  const deleteGiftBox = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gift_boxes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gift_boxes/${id}`);
    }
  };

  // Update order status and handle inventory automation & tracking:
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    trackingNumber?: string,
    courierPartner?: string,
    adminNotes?: string
  ) => {
    try {
      const targetOrder = orders.find((o) => o.id === orderId);
      if (!targetOrder) return;

      if (newStatus === 'Confirmed' && targetOrder.orderStatus === 'New') {
        for (const item of targetOrder.items) {
          if (item.productId) {
            const currentProd = products.find((p) => p.id === item.productId);
            if (currentProd) {
              const nextStock = Math.max(0, currentProd.stock - item.quantity);
              await updateProduct(currentProd.id, { stock: nextStock });
            }
          }
        }
      } else if (
        newStatus === 'Cancelled' &&
        (targetOrder.orderStatus === 'Confirmed' ||
          targetOrder.orderStatus === 'Preparing' ||
          targetOrder.orderStatus === 'Ready')
      ) {
        for (const item of targetOrder.items) {
          if (item.productId) {
            const currentProd = products.find((p) => p.id === item.productId);
            if (currentProd) {
              const nextStock = currentProd.stock + item.quantity;
              await updateProduct(currentProd.id, { stock: nextStock });
            }
          }
        }
      }

      const updates: Record<string, any> = { orderStatus: newStatus };
      if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
      if (courierPartner !== undefined) updates.courierPartner = courierPartner;
      if (adminNotes !== undefined) updates.adminNotes = adminNotes;

      await updateDoc(doc(db, 'orders', orderId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateStoreSettings = async (settingsUpdates: Partial<StoreSettings>) => {
    try {
      const ref = doc(db, 'store_settings', 'main');
      await setDoc(ref, settingsUpdates, { merge: true });
      setStoreSettings((prev) => ({ ...prev, ...settingsUpdates }));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'store_settings/main');
    }
  };

  // Hero Banners
  const addHeroBanner = async (banner: Omit<HeroBanner, 'id'>) => {
    const newBanner: HeroBanner = {
      ...banner,
      id: `banner_${Date.now()}`,
      order: (storeSettings.heroBanners?.length ?? 0) + 1,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    };
    const updated = [...(storeSettings.heroBanners || []), newBanner];
    await updateStoreSettings({ heroBanners: updated });
  };

  const updateHeroBanner = async (id: string, updates: Partial<HeroBanner>) => {
    const updated = (storeSettings.heroBanners || []).map((b) =>
      b.id === id ? { ...b, ...updates } : b
    );
    await updateStoreSettings({ heroBanners: updated });
  };

  const deleteHeroBanner = async (id: string) => {
    const updated = (storeSettings.heroBanners || []).filter((b) => b.id !== id);
    await updateStoreSettings({ heroBanners: updated });
  };

  // Homepage Sections
  const updateHomepageSections = async (sections: HomepageSectionConfig[]) => {
    await updateStoreSettings({ homepageSections: sections });
  };

  const toggleHomepageSection = async (id: string, isEnabled: boolean) => {
    const currentSections = storeSettings.homepageSections?.length
      ? storeSettings.homepageSections
      : DEFAULT_HOMEPAGE_SECTIONS;
    const updated = currentSections.map((sec) =>
      sec.id === id ? { ...sec, isEnabled } : sec
    );
    await updateStoreSettings({ homepageSections: updated });
  };

  const updateHomepageSectionConfig = async (id: string, updates: Partial<HomepageSectionConfig>) => {
    const currentSections = storeSettings.homepageSections?.length
      ? storeSettings.homepageSections
      : DEFAULT_HOMEPAGE_SECTIONS;
    const updated = currentSections.map((sec) =>
      sec.id === id ? { ...sec, ...updates } : sec
    );
    await updateStoreSettings({ homepageSections: updated });
  };

  // Reviews
  const addCustomerReview = async (review: Omit<CustomerReview, 'id' | 'date' | 'isApproved'>): Promise<string> => {
    const docRef = doc(collection(db, 'reviews'));
    const newReview: CustomerReview = {
      ...review,
      id: docRef.id,
      date: new Date().toISOString().split('T')[0],
      isApproved: false,
      isFeatured: false,
    };
    await setDoc(docRef, newReview);
    return docRef.id;
  };

  const updateReviewStatus = async (id: string, isApproved: boolean) => {
    await updateDoc(doc(db, 'reviews', id), { isApproved });
  };

  const toggleFeatureReview = async (id: string, isFeatured: boolean) => {
    await updateDoc(doc(db, 'reviews', id), { isFeatured });
  };

  const deleteCustomerReview = async (id: string) => {
    await deleteDoc(doc(db, 'reviews', id));
  };

  // Blog Posts
  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'date'>): Promise<string> => {
    const docRef = doc(collection(db, 'blogs'));
    const newPost: BlogPost = {
      ...post,
      id: docRef.id,
      date: new Date().toISOString().split('T')[0],
    };
    await setDoc(docRef, newPost);
    return docRef.id;
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
    await updateDoc(doc(db, 'blogs', id), updates);
  };

  const deleteBlogPost = async (id: string) => {
    await deleteDoc(doc(db, 'blogs', id));
  };

  // FAQs
  const addFAQItem = async (faq: Omit<FAQItem, 'id'>): Promise<string> => {
    const docRef = doc(collection(db, 'faqs'));
    const newFaq: FAQItem = {
      ...faq,
      id: docRef.id,
      order: faq.order ?? (faqs.length + 1),
    };
    await setDoc(docRef, newFaq);
    return docRef.id;
  };

  const updateFAQItem = async (id: string, updates: Partial<FAQItem>) => {
    await updateDoc(doc(db, 'faqs', id), updates);
  };

  const deleteFAQItem = async (id: string) => {
    await deleteDoc(doc(db, 'faqs', id));
  };

  // Convenience Admin aliases
  const saveProduct = async (product: Omit<Product, 'id'>, id?: string): Promise<string> => {
    if (id) {
      await updateProduct(id, product);
      return id;
    }
    return await addProduct(product);
  };

  const saveCategory = async (cat: Omit<Category, 'id'>, id?: string): Promise<string> => {
    if (id) {
      await updateCategory(id, cat);
      return id;
    }
    return await addCategory(cat);
  };

  const saveOccasion = async (occ: Omit<Occasion, 'id'>, id?: string): Promise<string> => {
    if (id) {
      await updateOccasion(id, occ);
      return id;
    }
    return await addOccasion(occ);
  };

  const saveGiftBox = async (box: Omit<GiftBox, 'id'>, id?: string): Promise<string> => {
    if (id) {
      await updateGiftBox(id, box);
      return id;
    }
    return await addGiftBox(box);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        occasions,
        giftBoxes,
        orders,
        storeSettings,
        reviews,
        blogs,
        faqs,
        loading,
        cart,
        addToCart,
        addCustomBoxToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,
        cartItemsCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        generateWhatsAppOrderUrl,
        submitOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addCategory,
        updateCategory,
        deleteCategory,
        addOccasion,
        updateOccasion,
        deleteOccasion,
        addGiftBox,
        updateGiftBox,
        deleteGiftBox,
        updateOrderStatus,
        updateStoreSettings,
        seedInitialDataIfEmpty,
        saveProduct,
        deleteProductItem: deleteProduct,
        saveCategory,
        deleteCategoryItem: deleteCategory,
        saveOccasion,
        deleteOccasionItem: deleteOccasion,
        saveGiftBox,
        deleteGiftBoxItem: deleteGiftBox,
        updateSettings: updateStoreSettings,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        updateHomepageSections,
        toggleHomepageSection,
        updateHomepageSectionConfig,
        addCustomerReview,
        updateReviewStatus,
        toggleFeatureReview,
        deleteCustomerReview,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addFAQItem,
        updateFAQItem,
        deleteFAQItem,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
