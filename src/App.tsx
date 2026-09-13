import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OccasionsPage } from './pages/OccasionsPage';
import { GiftBoxBuilderPage } from './pages/GiftBoxBuilderPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AuthPage } from './pages/AuthPage';
import { AboutUsPage, ContactPage, PrivacyPolicyPage, TermsDeliveryPage } from './pages/InfoPages';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { OrderWhatsAppModal } from './components/OrderWhatsAppModal';
import { SearchModal } from './components/SearchModal';
import { SEOHead } from './components/SEOHead';
import { Product, CustomGiftBox } from './types';
import { Phone, MessageCircle } from 'lucide-react';

function AppContent() {
  const { storeSettings, cart, cartTotal } = useStore();

  // Initialize view: check URL for /admin vs normal customer storefront
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        return 'admin';
      }
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

  const cleanWhatsApp = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');

  // Synchronize browser history / URL with view state
  const navigateToView = (view: string) => {
    if (typeof window !== 'undefined') {
      if (view === 'admin') {
        if (window.location.pathname !== '/admin') {
          window.history.pushState({ view: 'admin' }, '', '/admin');
        }
      } else {
        if (window.location.pathname === '/admin') {
          window.history.pushState({ view: 'home' }, '', '/');
        }
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser back/forward button popstate handler
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
          setCurrentView('admin');
        } else {
          setCurrentView((prev) => (prev === 'admin' ? 'home' : prev));
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateToView('product-detail');
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
      {/* Dynamic SEO, Canonical & Structured Data */}
      <SEOHead
        currentView={currentView}
        selectedProduct={selectedProduct}
        categoryFilter={categoryFilter}
        occasionFilter={occasionFilter}
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
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            setCurrentView={navigateToView}
            onOpenWhatsAppCartOrder={handleOpenCartWhatsApp}
          />
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

      {/* Floating WhatsApp Concierge Button */}
      <a
        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
          'Assalam-o-Alaikum MINAL KHAN! I would like personal assistance with gifts and delivery in Pakistan.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all hover:scale-105 active:scale-95"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <Phone className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs pr-1">
          WhatsApp Concierge
        </span>
      </a>

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
