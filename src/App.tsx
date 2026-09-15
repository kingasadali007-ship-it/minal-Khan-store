import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AnnouncementBar } from './components/AnnouncementBar';
import { SplashScreen } from './components/SplashScreen';
import { FloatingWhatsAppHelp } from './components/FloatingWhatsAppHelp';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OccasionsPage } from './pages/OccasionsPage';
import { GiftBoxBuilderPage } from './pages/GiftBoxBuilderPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { BlogsPage } from './pages/BlogsPage';
import { FAQPage } from './pages/FAQPage';
import { ShippingPage } from './pages/ShippingPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AuthPage } from './pages/AuthPage';
import { AboutUsPage, ContactPage, PrivacyPolicyPage, TermsDeliveryPage } from './pages/InfoPages';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { OrderWhatsAppModal } from './components/OrderWhatsAppModal';
import { SearchModal } from './components/SearchModal';
import { SEOHead } from './components/SEOHead';
import { Product, CustomGiftBox } from './types';

function AppContent() {
  const { storeSettings, cart, cartTotal, products } = useStore();
  const [showSplash, setShowSplash] = useState(true);

  const getPathToView = (path: string): string => {
    const p = path.toLowerCase();
    if (p === '/admin' || p.startsWith('/admin/')) return 'admin';
    if (p === '/shop' || p.startsWith('/shop/')) return 'shop';
    if (p === '/categories' || p.startsWith('/categories/')) return 'categories';
    if (p === '/occasions' || p.startsWith('/occasions/')) return 'occasions';
    if (p === '/gift-box' || p === '/build-a-box' || p.startsWith('/gift-box/')) return 'box-builder';
    if (p === '/checkout' || p.startsWith('/checkout/')) return 'checkout';
    if (p === '/track-order' || p.startsWith('/track-order/')) return 'track-order';
    if (p === '/blogs' || p === '/blog' || p.startsWith('/blogs/')) return 'blogs';
    if (p === '/faq' || p === '/faqs' || p.startsWith('/faq/')) return 'faq';
    if (p === '/shipping' || p.startsWith('/shipping/')) return 'shipping';
    if (p === '/about' || p.startsWith('/about/')) return 'about';
    if (p === '/contact' || p.startsWith('/contact/')) return 'contact';
    if (p === '/privacy' || p.startsWith('/privacy/')) return 'privacy';
    if (p === '/terms' || p.startsWith('/terms/')) return 'terms';
    if (p === '/cart') return 'cart';
    if (p === '/wishlist') return 'wishlist';
    if (p === '/account') return 'account';
    return 'home';
  };

  // Initialize view: check URL for path vs normal customer storefront
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') return 'admin';
      const search = new URLSearchParams(window.location.search);
      if (search.get('product')) return 'product-detail';
      return getPathToView(window.location.pathname);
    }
    return 'home';
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [occasionFilter, setOccasionFilter] = useState<string>('All');

  // WhatsApp Order Modal State
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [modalSingleProduct, setModalSingleProduct] = useState<{ product: Product; quantity: number } | undefined>(undefined);
  const [modalSingleBox, setModalSingleBox] = useState<CustomGiftBox | undefined>(undefined);
  const [isCartMode, setIsCartMode] = useState(false);

  // Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Synchronize initial product from URL if ?product=ID is present
  useEffect(() => {
    if (typeof window !== 'undefined' && products.length > 0 && !selectedProduct) {
      const search = new URLSearchParams(window.location.search);
      const prodId = search.get('product');
      if (prodId) {
        const found = products.find((p) => p.id === prodId || p.sku === prodId);
        if (found) {
          setSelectedProduct(found);
          setCurrentView('product-detail');
        }
      }
    }
  }, [products, selectedProduct]);

  // Synchronize browser history / URL with view state
  const navigateToView = (view: string) => {
    if (typeof window !== 'undefined') {
      const viewToPathMap: Record<string, string> = {
        home: '/',
        shop: '/shop',
        categories: '/categories',
        occasions: '/occasions',
        'box-builder': '/gift-box',
        checkout: '/checkout',
        'track-order': '/track-order',
        blogs: '/blogs',
        faq: '/faq',
        shipping: '/shipping',
        about: '/about',
        contact: '/contact',
        privacy: '/privacy',
        terms: '/terms',
        cart: '/cart',
        wishlist: '/wishlist',
        account: '/account',
        admin: '/admin',
      };
      const targetPath = viewToPathMap[view] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, '', targetPath);
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser back/forward button popstate handler
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (typeof window !== 'undefined') {
        const search = new URLSearchParams(window.location.search);
        const prodId = search.get('product');
        if (prodId && products.length > 0) {
          const found = products.find((p) => p.id === prodId || p.sku === prodId);
          if (found) {
            setSelectedProduct(found);
            setCurrentView('product-detail');
            return;
          }
        }
        const mappedView = getPathToView(window.location.pathname);
        setCurrentView(mappedView);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'product-detail', productId: product.id }, '', `/shop?product=${product.id}`);
    }
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInstantWhatsAppProduct = (product: Product, quantity = 1) => {
    setModalSingleProduct({ product, quantity });
    setModalSingleBox(undefined);
    setIsCartMode(false);
    setIsWhatsAppModalOpen(true);
  };

  const handleInstantWhatsAppBox = (box: CustomGiftBox) => {
    setModalSingleProduct(undefined);
    setModalSingleBox(box);
    setIsCartMode(false);
    setIsWhatsAppModalOpen(true);
  };

  const handleOpenCartWhatsApp = () => {
    setModalSingleProduct(undefined);
    setModalSingleBox(undefined);
    setIsCartMode(true);
    setIsWhatsAppModalOpen(true);
  };

  const handleSelectCategoryFilter = (catName: string) => {
    setCategoryFilter(catName);
    setOccasionFilter('All');
    navigateToView('shop');
  };

  const handleSelectOccasionFilter = (occName: string) => {
    setOccasionFilter(occName);
    setCategoryFilter('All');
    navigateToView('shop');
  };

  // If Admin view is active, render full-screen Admin Dashboard with noindex SEO protection
  if (currentView === 'admin') {
    return (
      <>
        <SEOHead currentView="admin" />
        <AdminDashboard onExitAdmin={() => navigateToView('home')} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 font-sans selection:bg-[#d4af37] selection:text-[#1b3022] overflow-x-hidden w-full max-w-full">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Dynamic SEO, Canonical & Structured Data */}
      <SEOHead
        currentView={currentView}
        selectedProduct={selectedProduct}
        categoryFilter={categoryFilter}
        occasionFilter={occasionFilter}
      />

      {/* Announcement Bar */}
      <AnnouncementBar
        announcements={storeSettings.announcements}
        onCtaClick={(cta) => {
          if (cta === 'box-builder' || cta === 'shop' || cta === 'shipping') {
            navigateToView(cta);
          }
        }}
      />

      {/* Global Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={navigateToView}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main App Body */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {currentView === 'home' && (
          <HomePage
            setCurrentView={navigateToView}
            onSelectProduct={handleSelectProduct}
            onInstantWhatsApp={(p) => handleInstantWhatsAppProduct(p, 1)}
            onSelectCategoryFilter={handleSelectCategoryFilter}
            onSelectOccasionFilter={handleSelectOccasionFilter}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            setCurrentView={navigateToView}
            onSelectProduct={handleSelectProduct}
            onInstantWhatsApp={(p) => handleInstantWhatsAppProduct(p, 1)}
            initialCategoryFilter={categoryFilter}
            initialOccasionFilter={occasionFilter}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage onSelectCategory={handleSelectCategoryFilter} />
        )}

        {currentView === 'occasions' && (
          <OccasionsPage onSelectOccasion={handleSelectOccasionFilter} />
        )}

        {currentView === 'box-builder' && (
          <GiftBoxBuilderPage
            setCurrentView={navigateToView}
            onOpenWhatsAppBoxOrder={handleInstantWhatsAppBox}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => navigateToView('shop')}
            onInstantWhatsApp={handleInstantWhatsAppProduct}
            setCurrentView={navigateToView}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            setCurrentView={navigateToView}
            onOpenWhatsAppCartOrder={handleOpenCartWhatsApp}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            setCurrentView={navigateToView}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'track-order' && (
          <TrackOrderPage setCurrentView={navigateToView} />
        )}

        {currentView === 'blogs' && (
          <BlogsPage
            setCurrentView={navigateToView}
            onSelectCategory={handleSelectCategoryFilter}
          />
        )}

        {currentView === 'faq' && (
          <FAQPage setCurrentView={navigateToView} />
        )}

        {currentView === 'shipping' && (
          <ShippingPage setCurrentView={navigateToView} />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            setCurrentView={navigateToView}
            onSelectProduct={handleSelectProduct}
            onInstantWhatsApp={(p) => handleInstantWhatsAppProduct(p, 1)}
          />
        )}

        {currentView === 'account' && (
          <AccountPage setCurrentView={navigateToView} />
        )}

        {currentView === 'auth' && (
          <AuthPage setCurrentView={navigateToView} />
        )}

        {currentView === 'about' && <AboutUsPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'privacy' && <PrivacyPolicyPage />}
        {currentView === 'terms' && <TermsDeliveryPage />}
      </main>

      {/* Global Footer */}
      <Footer setCurrentView={navigateToView} />

      {/* Floating WhatsApp Help & Concierge */}
      <FloatingWhatsAppHelp whatsappNumber={storeSettings.whatsappNumber} />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* WhatsApp Order Modal */}
      <OrderWhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        singleProduct={modalSingleProduct}
        singleBox={modalSingleBox}
        cartItems={isCartMode ? cart : undefined}
        customTotal={isCartMode ? cartTotal : undefined}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
