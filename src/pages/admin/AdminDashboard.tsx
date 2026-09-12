import React, { useState, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  CalendarHeart,
  Gift,
  ShoppingBag,
  Users,
  Warehouse,
  PhoneCall,
  Languages,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  AlertTriangle,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product, Category, Occasion, GiftBox, Order, StoreSettings } from '../../types';
import { processAndCompressImage } from '../../utils/imageUtils';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const {
    products,
    categories,
    occasions,
    giftBoxes,
    orders,
    storeSettings,
    saveProduct,
    deleteProductItem,
    saveCategory,
    deleteCategoryItem,
    saveOccasion,
    deleteOccasionItem,
    saveGiftBox,
    deleteGiftBoxItem,
    updateOrderStatus,
    updateSettings,
  } = useStore();

  const { isAdmin, adminSessionKey, setAdminSessionKey, user, signInWithGoogle } = useAuth();
  const { language, setLanguage } = useLanguage();

  // Active Admin Section Tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'categories'
    | 'occasions'
    | 'giftboxes'
    | 'orders'
    | 'customers'
    | 'inventory'
    | 'whatsapp'
    | 'store'
  >('overview');

  // Key authorization state if not verified
  const [passkeyInput, setPasskeyInput] = useState('');

  // --------------------------------------------------------------------------
  // PRODUCTS STATE & MODAL
  // --------------------------------------------------------------------------
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productImageUploading, setProductImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --------------------------------------------------------------------------
  // CATEGORIES / OCCASIONS / BOXES EDIT STATE
  // --------------------------------------------------------------------------
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingOccasion, setEditingOccasion] = useState<Partial<Occasion> | null>(null);
  const [editingBox, setEditingBox] = useState<Partial<GiftBox> | null>(null);
  const boxImageInputRef = useRef<HTMLInputElement | null>(null);

  // --------------------------------------------------------------------------
  // ORDERS FILTER STATE
  // --------------------------------------------------------------------------
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // --------------------------------------------------------------------------
  // STORE & WHATSAPP SETTINGS LOCAL FORM
  // --------------------------------------------------------------------------
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(storeSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sync store settings if changed externally
  React.useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  // Handle Passkey Authorization Form
  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput.trim()) {
      setAdminSessionKey(passkeyInput.trim());
    }
  };

  // If user is not authorized admin
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-[#e8dfd3] shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-[#d4af37]/20 text-[#8b7355] flex items-center justify-center mx-auto">
          <Settings className="w-7 h-7" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#1b3022]">Admin Security Gate</h2>
        <p className="text-xs text-stone-500">
          Enter your Admin Passkey or sign in with your verified Admin Google account to manage MINAL KHAN store products, orders, inventory, and WhatsApp settings.
        </p>

        <form onSubmit={handleAuthorize} className="space-y-3">
          <input
            type="password"
            required
            value={passkeyInput}
            onChange={(e) => setPasskeyInput(e.target.value)}
            placeholder="Enter Admin Passkey (minalkhan786)"
            className="w-full px-4 py-2.5 border border-stone-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#1b3022] outline-none"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-[#1b3022] text-white rounded-xl text-xs font-bold hover:bg-[#25422f] transition-colors"
          >
            Access with Passkey
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-4 text-[10px] text-stone-400 uppercase tracking-widest">or Google Login</span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        <button
          onClick={() => signInWithGoogle()}
          className="w-full py-2.5 bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-100 flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          Sign in as kingasadali007@gmail.com
        </button>

        <div className="pt-2 border-t border-stone-100">
          <button
            onClick={onExitAdmin}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            ← Return to Customer Store
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATS OVERVIEW COMPUTATIONS
  // --------------------------------------------------------------------------
  const activeProductsCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.isActive && p.stock <= 3).length;
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.totalAmount : sum), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'New' || o.orderStatus === 'Confirmed').length;

  // --------------------------------------------------------------------------
  // IMAGE UPLOAD HANDLER FOR PRODUCTS
  // --------------------------------------------------------------------------
  const handleProductImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProductImageUploading(true);
    try {
      const res = await processAndCompressImage(file, 900, 900, 0.85);
      setEditingProduct((prev) => (prev ? { ...prev, imageUrl: res.dataUrl } : null));
    } catch (err: any) {
      alert(err.message || 'Image upload failed. Please try another image.');
    } finally {
      setProductImageUploading(false);
    }
  };

  const handleBoxImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await processAndCompressImage(file, 800, 800, 0.85);
      setEditingBox((prev) => (prev ? { ...prev, imageUrl: res.dataUrl } : null));
    } catch (err: any) {
      alert(err.message || 'Image processing failed.');
    }
  };

  // --------------------------------------------------------------------------
  // PRODUCT SAVE HANDLER
  // --------------------------------------------------------------------------
  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || editingProduct.price === undefined) {
      alert('Please provide at least product name and price.');
      return;
    }

    try {
      const prodPayload: Omit<Product, 'id'> = {
        name: editingProduct.name,
        nameUrdu: editingProduct.nameUrdu || '',
        price: Number(editingProduct.price) || 0,
        salePrice: editingProduct.salePrice ? Number(editingProduct.salePrice) : undefined,
        description: editingProduct.description || '',
        descriptionUrdu: editingProduct.descriptionUrdu || '',
        category: editingProduct.category || categories[0]?.name || 'Gift Boxes',
        occasion: editingProduct.occasion || occasions[0]?.name || 'Birthday',
        imageUrl: editingProduct.imageUrl || '',
        stock: editingProduct.stock !== undefined ? Number(editingProduct.stock) : 10,
        isActive: editingProduct.isActive !== undefined ? editingProduct.isActive : true,
        isFeatured: editingProduct.isFeatured || false,
        sku: editingProduct.sku || `MK-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      await saveProduct(prodPayload, editingProduct.id);
      setEditingProduct(null);
      alert('Product saved successfully to database!');
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product in database.');
    }
  };

  // --------------------------------------------------------------------------
  // STORE SETTINGS SAVE HANDLER
  // --------------------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(settingsForm);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
      alert('Store settings & WhatsApp number updated live across the entire website!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Could not update store settings.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-800 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-[#1b3022] text-[#f7e7ce] px-4 sm:px-6 py-3 border-b border-[#2d4d38] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-bold tracking-widest text-[#f7e7ce]">
            MINAL KHAN
          </span>
          <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#d4af37] text-[#1b3022]">
            ADMIN CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {user?.email?.toLowerCase() === 'kingasadali007@gmail.com' ? (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/70 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Cloud Synced ({user.email})
            </span>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 rounded-lg text-[11px] text-[#f7e7ce] font-medium transition-colors"
              title="Sign in with kingasadali007@gmail.com to enable direct cloud database updates"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Sign in with Google
            </button>
          )}
          <span className="text-stone-300 hidden sm:inline">
            WhatsApp Live: <strong className="text-emerald-400">+{storeSettings.whatsappNumber}</strong>
          </span>
          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#f7e7ce] rounded-lg font-medium transition-colors"
          >
            ← View Customer Store
          </button>
        </div>
      </header>

      {/* Admin Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white p-3 rounded-2xl border border-[#e8dfd3] shadow-2xs space-y-1">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products Management', icon: Package, badge: products.length },
            { id: 'categories', label: 'Categories', icon: FolderTree, badge: categories.length },
            { id: 'occasions', label: 'Occasions', icon: CalendarHeart, badge: occasions.length },
            { id: 'giftboxes', label: 'Gift Boxes (Builder)', icon: Gift, badge: giftBoxes.length },
            { id: 'orders', label: 'Orders & Dispatch', icon: ShoppingBag, badge: pendingOrdersCount },
            { id: 'inventory', label: 'Inventory & Stock', icon: Warehouse, badge: lowStockCount },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'whatsapp', label: 'WhatsApp Settings', icon: PhoneCall },
            { id: 'store', label: 'Store & Delivery Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedOrder(null);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-[#1b3022] text-[#f7e7ce] shadow-xs'
                    : 'text-stone-700 hover:bg-[#faf8f5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-[#d4af37]' : 'text-stone-500'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                      isCurrent
                        ? 'bg-[#d4af37] text-[#1b3022]'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Panel (9 cols) */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-2xl border border-[#e8dfd3] shadow-2xs min-h-[600px]">
          {/* =========================================================================
              1. OVERVIEW TAB
          ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#f1ece4]">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#1b3022]">
                    Store Overview
                  </h2>
                  <p className="text-xs text-stone-500">
                    Live operational metrics for MINAL KHAN gift store.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setEditingProduct({
                      name: '',
                      price: 1500,
                      stock: 10,
                      isActive: true,
                      category: categories[0]?.name || 'Gift Boxes',
                      occasion: occasions[0]?.name || 'Birthday',
                    });
                  }}
                  className="px-3.5 py-2 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8dfd3] space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase">
                    Total Products
                  </span>
                  <div className="text-2xl font-bold text-[#1b3022]">{products.length}</div>
                  <span className="text-[10px] text-emerald-700">
                    {activeProductsCount} Active in Catalog
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8dfd3] space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase">
                    Total Orders
                  </span>
                  <div className="text-2xl font-bold text-[#1b3022]">{orders.length}</div>
                  <span className="text-[10px] text-blue-700">
                    {pendingOrdersCount} Pending Actions
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8dfd3] space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase">
                    Total Revenue
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-[#1b3022]">
                    Rs. {totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-stone-400">All Confirmed & Delivered</span>
                </div>

                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8dfd3] space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase">
                    Low Stock Alert
                  </span>
                  <div className="text-2xl font-bold text-amber-700">{lowStockCount}</div>
                  <span className="text-[10px] text-amber-700">Under 3 items remaining</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="space-y-3 pt-4 border-t border-[#f1ece4]">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#8b7355] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActiveTab('orders');
                        }}
                        className="p-3 bg-[#faf8f5] hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#1b3022]">
                              #{ord.orderNumber}
                            </span>
                            <span className="font-semibold text-stone-800">
                              {ord.customerName}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500">
                            {ord.city} • {ord.items.length} item(s) • {new Date(ord.createdAt || 0).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-stone-900 block">
                            Rs. {ord.totalAmount.toLocaleString()}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold">
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 py-4 text-center bg-[#faf8f5] rounded-xl">
                    No customer orders yet. They will appear here immediately when customers checkout or order on WhatsApp!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              2. PRODUCTS MANAGEMENT TAB
          ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#f1ece4]">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#1b3022]">
                    Products Catalog
                  </h2>
                  <p className="text-xs text-stone-500">
                    Add product pictures from laptop or mobile, set prices in PKR, and manage categories.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingProduct({
                      name: '',
                      price: 1500,
                      stock: 10,
                      isActive: true,
                      category: categories[0]?.name || 'Gift Boxes',
                      occasion: occasions[0]?.name || 'Birthday',
                    })
                  }
                  className="px-4 py-2 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Modal/Form when editing */}
              {editingProduct && (
                <div className="bg-[#faf8f5] p-6 rounded-2xl border-2 border-[#1b3022] space-y-4 shadow-sm animate-in fade-in-50">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <h3 className="font-bold text-sm text-[#1b3022]">
                      {editingProduct.id ? 'Edit Gift Product' : 'Add New Gift Product to Store'}
                    </h3>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="p-1 rounded-md text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs">
                    {/* Image Upload Row */}
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Product Photo (from Computer or Mobile)
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-xl bg-white border border-stone-300 overflow-hidden flex items-center justify-center shrink-0">
                          {editingProduct.imageUrl ? (
                            <img
                              src={editingProduct.imageUrl}
                              alt="Product preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2 text-stone-400">
                              <Upload className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-[10px]">No Photo</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleProductImageFile}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={productImageUploading}
                            className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{productImageUploading ? 'Processing...' : 'Upload Image from Device'}</span>
                          </button>
                          <input
                            type="url"
                            value={editingProduct.imageUrl || ''}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                            }
                            placeholder="Or paste external image URL"
                            className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Product Name (English) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, name: e.target.value })
                          }
                          placeholder="e.g. Royal Oud Extrait de Parfum"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Product Name (Urdu - Optional)
                        </label>
                        <input
                          type="text"
                          value={editingProduct.nameUrdu || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, nameUrdu: e.target.value })
                          }
                          placeholder="مثال: شاہی عود پرفیوم"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Price (PKR) *
                        </label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                          }
                          placeholder="2500"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Sale Price (PKR)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.salePrice || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              salePrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          placeholder="Optional discount"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Inventory Stock
                        </label>
                        <input
                          type="number"
                          value={editingProduct.stock ?? 10}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                          }
                          placeholder="10"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          SKU Code
                        </label>
                        <input
                          type="text"
                          value={editingProduct.sku || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, sku: e.target.value })
                          }
                          placeholder="MK-102"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Category
                        </label>
                        <select
                          value={editingProduct.category || categories[0]?.name || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, category: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c.id || c.slug} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Occasion
                        </label>
                        <select
                          value={editingProduct.occasion || occasions[0]?.name || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, occasion: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                        >
                          {occasions.map((o) => (
                            <option key={o.id || o.slug} value={o.name}>
                              {o.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Product Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingProduct.description || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        placeholder="Details about craftsmanship, materials, notes, or packaging..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                        <input
                          type="checkbox"
                          checked={editingProduct.isActive ?? true}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, isActive: e.target.checked })
                          }
                          className="rounded text-[#1b3022]"
                        />
                        <span>Active in Store</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                        <input
                          type="checkbox"
                          checked={editingProduct.isFeatured ?? false}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                          }
                          className="rounded text-[#1b3022]"
                        />
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#d4af37]" />
                          <span>Show in Featured Section (Homepage)</span>
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-lg font-bold"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter products by title, category, SKU..."
                  className="w-full pl-9 pr-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1b3022]"
                />
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8f5] text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {products
                      .filter((p) => {
                        if (!productSearch) return true;
                        const q = productSearch.toLowerCase();
                        return (
                          p.name.toLowerCase().includes(q) ||
                          p.category.toLowerCase().includes(q) ||
                          p.sku?.toLowerCase().includes(q)
                        );
                      })
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-stone-50">
                          <td className="p-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                              {prod.imageUrl ? (
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                  <Package className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-stone-900 block">{prod.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {prod.sku || 'No SKU'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-stone-600">{prod.category}</td>
                          <td className="p-3 font-semibold text-stone-900">
                            Rs. {prod.price.toLocaleString()}
                            {prod.salePrice && (
                              <span className="block text-[10px] text-rose-600">
                                Sale: Rs. {prod.salePrice.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`font-semibold ${
                                prod.stock <= 3 ? 'text-amber-700' : 'text-stone-700'
                              }`}
                            >
                              {prod.stock} units
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                prod.isActive
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {prod.isActive ? 'Active' : 'Hidden'}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 text-stone-600 hover:text-[#1b3022] hover:bg-stone-100 rounded-lg"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete "${prod.name}" permanently?`)) {
                                  await deleteProductItem(prod.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              3. CATEGORIES MANAGEMENT TAB
          ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#f1ece4]">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#1b3022]">Categories</h2>
                  <p className="text-xs text-stone-500">
                    Manage store categories (Perfumes, Watches, Chocolates, Flowers, etc.).
                  </p>
                </div>
                <button
                  onClick={() => setEditingCategory({ name: '', slug: '', description: '' })}
                  className="px-3.5 py-2 bg-[#1b3022] text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {editingCategory && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingCategory.name) return;
                    await saveCategory({
                      name: editingCategory.name,
                      slug: editingCategory.name.toLowerCase().replace(/\s+/g, '-'),
                      nameUrdu: editingCategory.nameUrdu || '',
                      description: editingCategory.description || '',
                    }, editingCategory.id);
                    setEditingCategory(null);
                  }}
                  className="p-4 bg-[#faf8f5] rounded-xl border border-stone-300 space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Category Name *</label>
                      <input
                        type="text"
                        required
                        value={editingCategory.name || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Urdu Name (Optional)</label>
                      <input
                        type="text"
                        value={editingCategory.nameUrdu || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, nameUrdu: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Short Description</label>
                    <input
                      type="text"
                      value={editingCategory.description || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-3 py-1.5 bg-stone-200 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#1b3022] text-white rounded-lg font-bold"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id || cat.slug}
                    className="p-4 rounded-xl border border-stone-200 bg-[#faf8f5] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-stone-900">{cat.name}</h4>
                      {cat.nameUrdu && (
                        <span className="text-[11px] text-stone-500 block">{cat.nameUrdu}</span>
                      )}
                      <span className="text-[10px] text-stone-400">{cat.description}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 text-stone-500 hover:text-stone-900"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            await deleteCategoryItem(cat.id || cat.slug);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              4. OCCASIONS MANAGEMENT TAB
          ========================================================================= */}
          {activeTab === 'occasions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#f1ece4]">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#1b3022]">Occasions</h2>
                  <p className="text-xs text-stone-500">
                    Manage milestones (Birthday, Wedding, Anniversary, Eid, etc.).
                  </p>
                </div>
                <button
                  onClick={() => setEditingOccasion({ name: '', slug: '', badge: '✨ Celebration' })}
                  className="px-3.5 py-2 bg-[#1b3022] text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Occasion</span>
                </button>
              </div>

              {editingOccasion && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingOccasion.name) return;
                    await saveOccasion({
                      name: editingOccasion.name,
                      slug: editingOccasion.name.toLowerCase().replace(/\s+/g, '-'),
                      nameUrdu: editingOccasion.nameUrdu || '',
                      badge: editingOccasion.badge || '✨ Occasion',
                      description: editingOccasion.description || '',
                    }, editingOccasion.id);
                    setEditingOccasion(null);
                  }}
                  className="p-4 bg-[#faf8f5] rounded-xl border border-stone-300 space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Occasion Name *</label>
                      <input
                        type="text"
                        required
                        value={editingOccasion.name || ''}
                        onChange={(e) => setEditingOccasion({ ...editingOccasion, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Urdu Name (Optional)</label>
                      <input
                        type="text"
                        value={editingOccasion.nameUrdu || ''}
                        onChange={(e) => setEditingOccasion({ ...editingOccasion, nameUrdu: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingOccasion(null)}
                      className="px-3 py-1.5 bg-stone-200 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#1b3022] text-white rounded-lg font-bold"
                    >
                      Save Occasion
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {occasions.map((occ) => (
                  <div
                    key={occ.id || occ.slug}
                    className="p-4 rounded-xl border border-stone-200 bg-[#faf8f5] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-[#8b7355] font-semibold">{occ.badge}</span>
                      <h4 className="font-bold text-xs text-stone-900">{occ.name}</h4>
                      {occ.nameUrdu && (
                        <span className="text-[11px] text-stone-500 block">{occ.nameUrdu}</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingOccasion(occ)}
                        className="p-1.5 text-stone-500 hover:text-stone-900"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete occasion "${occ.name}"?`)) {
                            await deleteOccasionItem(occ.id || occ.slug);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              5. GIFT BOXES (BUILDER) MANAGEMENT TAB
          ========================================================================= */}
          {activeTab === 'giftboxes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#f1ece4]">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#1b3022]">
                    Gift Boxes (Packaging for Builder)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Base box designs customers choose inside "Build Your Own Gift Box".
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingBox({
                      name: '',
                      price: 1200,
                      isActive: true,
                      dimensions: 'Medium Box',
                    })
                  }
                  className="px-3.5 py-2 bg-[#1b3022] text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gift Box</span>
                </button>
              </div>

              {editingBox && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editingBox.name || editingBox.price === undefined) return;
                    await saveGiftBox({
                      name: editingBox.name,
                      nameUrdu: editingBox.nameUrdu || '',
                      price: Number(editingBox.price) || 0,
                      dimensions: editingBox.dimensions || '',
                      description: editingBox.description || '',
                      imageUrl: editingBox.imageUrl || '',
                      isActive: editingBox.isActive ?? true,
                    }, editingBox.id);
                    setEditingBox(null);
                  }}
                  className="p-4 bg-[#faf8f5] rounded-xl border border-stone-300 space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Box Name *</label>
                      <input
                        type="text"
                        required
                        value={editingBox.name || ''}
                        onChange={(e) => setEditingBox({ ...editingBox, name: e.target.value })}
                        placeholder="e.g. Royal Emerald Velvet Box"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Box Price (PKR) *</label>
                      <input
                        type="number"
                        required
                        value={editingBox.price || ''}
                        onChange={(e) => setEditingBox({ ...editingBox, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Dimensions / Size</label>
                    <input
                      type="text"
                      value={editingBox.dimensions || ''}
                      onChange={(e) => setEditingBox({ ...editingBox, dimensions: e.target.value })}
                      placeholder="e.g. 10 x 8 x 4 inches"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Upload Box Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={boxImageInputRef}
                      onChange={handleBoxImageFile}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => boxImageInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-semibold"
                      >
                        Choose Photo
                      </button>
                      <input
                        type="url"
                        value={editingBox.imageUrl || ''}
                        onChange={(e) => setEditingBox({ ...editingBox, imageUrl: e.target.value })}
                        placeholder="Or Image URL"
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingBox(null)}
                      className="px-3 py-1.5 bg-stone-200 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#1b3022] text-white rounded-lg font-bold"
                    >
                      Save Box
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {giftBoxes.map((box) => (
                  <div
                    key={box.id}
                    className="p-4 rounded-xl border border-stone-200 bg-[#faf8f5] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-stone-200 shrink-0">
                        {box.imageUrl ? (
                          <img src={box.imageUrl} alt={box.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <Gift className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-stone-900">{box.name}</h4>
                        <span className="text-xs font-semibold text-[#1b3022]">
                          Rs. {box.price.toLocaleString()}
                        </span>
                        {box.dimensions && (
                          <span className="text-[10px] text-stone-400 block">{box.dimensions}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingBox(box)}
                        className="p-1.5 text-stone-500 hover:text-stone-900"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete box "${box.name}"?`)) {
                            await deleteGiftBoxItem(box.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              6. ORDERS MANAGEMENT TAB
          ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#f1ece4]">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#1b3022]">Orders Management</h2>
                  <p className="text-xs text-stone-500">
                    Track customer details, Pakistani addresses, and status dispatch.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-500">Filter:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready for Dispatch</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Detail Modal / Flyout */}
              {selectedOrder && (
                <div className="bg-[#faf8f5] p-5 rounded-2xl border-2 border-[#1b3022] space-y-4 shadow-sm animate-in fade-in-50">
                  <div className="flex justify-between items-start pb-2 border-b border-stone-200">
                    <div>
                      <h3 className="font-display text-base font-bold text-[#1b3022]">
                        Order #{selectedOrder.orderNumber}
                      </h3>
                      <span className="text-[11px] text-stone-500">
                        Placed on {new Date(selectedOrder.createdAt || 0).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-stone-400 hover:text-stone-700 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                        Customer & Contact
                      </span>
                      <p className="font-bold text-stone-900">{selectedOrder.customerName}</p>
                      <p className="font-mono text-stone-600">Phone: {selectedOrder.customerPhone}</p>
                      <p className="font-mono text-stone-600">WhatsApp: {selectedOrder.whatsappNumber}</p>
                      {selectedOrder.customerEmail && (
                        <p className="text-stone-500">{selectedOrder.customerEmail}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                        Shipping Address (Pakistan)
                      </span>
                      <p className="text-stone-800">{selectedOrder.address}</p>
                      <p className="font-bold text-[#1b3022]">{selectedOrder.city}</p>
                      {selectedOrder.deliveryInstructions && (
                        <p className="text-stone-500 italic mt-1">
                          Note: "{selectedOrder.deliveryInstructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px] block">
                      Ordered Products & Gift Boxes
                    </span>
                    <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
                      {selectedOrder.items.map((it, idx) => (
                        <div key={idx} className="p-3 space-y-1">
                          <div className="flex justify-between font-medium text-stone-900">
                            <span>
                              {it.name} (x{it.quantity})
                            </span>
                            <span className="font-bold">Rs. {it.subtotal.toLocaleString()}</span>
                          </div>
                          {it.boxDetails && (
                            <div className="text-[11px] text-stone-500 bg-[#faf8f5] p-2 rounded border border-stone-100 space-y-0.5">
                              <p>Ribbon: {it.boxDetails.ribbonColor}</p>
                              <p>Contents: {it.boxDetails.itemsSummary}</p>
                              {it.boxDetails.message && (
                                <p className="italic">Card Message: "{it.boxDetails.message}"</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Status Control (Stock decrements automatically when Confirmed) */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-stone-700">Update Order Status:</span>
                      <select
                        value={selectedOrder.orderStatus}
                        onChange={async (e) => {
                          const newSt = e.target.value as any;
                          await updateOrderStatus(selectedOrder.id, newSt);
                          setSelectedOrder({ ...selectedOrder, orderStatus: newSt });
                        }}
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                      >
                        <option value="New">New</option>
                        <option value="Confirmed">Confirmed (Auto Decrements Stock)</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready for Dispatch</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <a
                      href={`https://wa.me/${selectedOrder.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Assalam-o-Alaikum ${selectedOrder.customerName}! This is MINAL KHAN regarding your gift order #${selectedOrder.orderNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 bg-[#25D366] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Message Customer on WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Orders List */}
              <div className="space-y-3">
                {orders
                  .filter((o) => (orderStatusFilter === 'All' ? true : o.orderStatus === orderStatusFilter))
                  .map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className="p-4 bg-[#faf8f5] hover:bg-stone-100 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#1b3022]">
                            #{ord.orderNumber}
                          </span>
                          <span className="font-semibold text-xs text-stone-900">
                            {ord.customerName}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            ({ord.customerPhone})
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {ord.city} • {ord.items.length} item(s) • Total: Rs. {ord.totalAmount.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            ord.orderStatus === 'New'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.orderStatus === 'Confirmed'
                              ? 'bg-purple-100 text-purple-800'
                              : ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              7. INVENTORY MANAGEMENT TAB
          ========================================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#f1ece4]">
                <h2 className="font-display text-xl font-bold text-[#1b3022]">Inventory & Stock</h2>
                <p className="text-xs text-stone-500">
                  Real-time stock ledger. Items with stock &le; 3 are flagged for urgent restock.
                </p>
              </div>

              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8f5] text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {products.map((prod) => {
                      const isLow = prod.stock <= 3;
                      return (
                        <tr key={prod.id} className={isLow ? 'bg-amber-50/50' : ''}>
                          <td className="p-3 font-semibold text-stone-900">{prod.name}</td>
                          <td className="p-3 font-mono text-stone-500">{prod.sku || 'MK-AUTO'}</td>
                          <td className="p-3 font-bold text-stone-900">{prod.stock} units</td>
                          <td className="p-3">
                            {prod.stock <= 0 ? (
                              <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-max">
                                <AlertTriangle className="w-3 h-3" />
                                Low Stock
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Sufficient
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={async () => {
                                const newQty = Math.max(0, prod.stock - 1);
                                await saveProduct({ ...prod, stock: newQty }, prod.id);
                              }}
                              className="px-2 py-1 bg-stone-200 hover:bg-stone-300 rounded font-bold"
                            >
                              -1
                            </button>
                            <button
                              onClick={async () => {
                                const newQty = prod.stock + 5;
                                await saveProduct({ ...prod, stock: newQty }, prod.id);
                              }}
                              className="px-2 py-1 bg-[#1b3022] hover:bg-[#25422f] text-white rounded font-bold"
                            >
                              +5
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              8. CUSTOMERS TAB
          ========================================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#f1ece4]">
                <h2 className="font-display text-xl font-bold text-[#1b3022]">Customer Directory</h2>
                <p className="text-xs text-stone-500">
                  Customers who have placed orders or registered on MINAL KHAN.
                </p>
              </div>

              {orders.length > 0 ? (
                <div className="overflow-x-auto border border-stone-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#faf8f5] text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Customer Name</th>
                        <th className="p-3">Phone / WhatsApp</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Total Orders</th>
                        <th className="p-3 text-right">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {Array.from(new Set(orders.map((o) => o.customerPhone))).map((phone) => {
                        const custOrders = orders.filter((o) => o.customerPhone === phone);
                        const firstOrd = custOrders[0];
                        const spent = custOrders.reduce((sum, o) => sum + o.totalAmount, 0);

                        return (
                          <tr key={phone} className="hover:bg-stone-50">
                            <td className="p-3 font-bold text-stone-900">{firstOrd.customerName}</td>
                            <td className="p-3 font-mono text-stone-600">{phone}</td>
                            <td className="p-3 text-stone-700">{firstOrd.city}</td>
                            <td className="p-3 font-semibold text-stone-800">{custOrders.length}</td>
                            <td className="p-3 text-right font-bold text-[#1b3022]">
                              Rs. {spent.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-stone-400 py-8 text-center bg-[#faf8f5] rounded-xl">
                  No registered customer records yet.
                </p>
              )}
            </div>
          )}

          {/* =========================================================================
              9. WHATSAPP SETTINGS TAB
          ========================================================================= */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6 max-w-xl">
              <div className="pb-4 border-b border-[#f1ece4]">
                <h2 className="font-display text-xl font-bold text-[#1b3022]">
                  WhatsApp Ordering Settings
                </h2>
                <p className="text-xs text-stone-500">
                  When you update your WhatsApp number here, the entire customer store, headers,
                  buttons, and order summaries update immediately!
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Store WhatsApp Number (with country code, no + or spaces) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                    }
                    placeholder="923001234567"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#1b3022] outline-none"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Format: 923001234567 (Pakistan code 92 followed by 10-digit mobile).
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <PhoneCall className="w-4 h-4 text-[#25D366]" />
                    <span>Test WhatsApp Connection</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Verify that your phone or computer can open WhatsApp with your configured number.
                  </p>
                  <a
                    href={`https://wa.me/${settingsForm.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      'Assalam-o-Alaikum MINAL KHAN! WhatsApp configuration test from Admin Console.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white rounded-lg font-bold text-xs"
                  >
                    <span>Test Send Message</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-xl font-bold"
                >
                  Save WhatsApp Number Live
                </button>

                {settingsSaved && (
                  <p className="text-xs text-emerald-700 font-medium">
                    ✓ WhatsApp number saved live to Firestore!
                  </p>
                )}
              </form>
            </div>
          )}

          {/* =========================================================================
              10. STORE & DELIVERY SETTINGS TAB
          ========================================================================= */}
          {activeTab === 'store' && (
            <div className="space-y-6 max-w-xl">
              <div className="pb-4 border-b border-[#f1ece4]">
                <h2 className="font-display text-xl font-bold text-[#1b3022]">
                  Store & Delivery Settings
                </h2>
                <p className="text-xs text-stone-500">
                  Configure store name, delivery charges across Pakistan, and free delivery thresholds.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, storeName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Store Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Standard Delivery Fee (PKR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.deliveryCharges}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, deliveryCharges: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-xl outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Free Delivery Over (PKR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryThreshold}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          freeDeliveryThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-xl outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcement || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcement: e.target.value })
                    }
                    placeholder="✨ Free delivery nationwide on orders above Rs. 5,000"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-xl outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-xl font-bold"
                  >
                    Save Store Configuration
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
