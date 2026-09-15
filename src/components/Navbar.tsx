import React, { useState } from 'react';
import {
  Gift,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onOpenSearch }) => {
  const { t } = useLanguage();
  const { cartItemsCount, wishlist, storeSettings } = useStore();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('navHome') },
    { id: 'shop', label: t('navShop') },
    { id: 'categories', label: t('navCategories') },
    { id: 'occasions', label: t('navOccasions') },
    { id: 'box-builder', label: t('navGiftBoxBuilder'), highlight: true },
    { id: 'track-order', label: 'Track Order' },
    { id: 'about', label: t('navAboutUs') },
    { id: 'contact', label: t('navContact') },
  ];

  const handleNav = (id: string) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/98 backdrop-blur-md border-b border-[#f4d5dc] transition-all shadow-[0_2px_12px_rgba(74,21,37,0.04)]">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-2.5 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1 sm:gap-4">
          {/* Mobile Menu Trigger (Left on mobile, hidden on desktop) */}
          <div className="flex items-center lg:hidden shrink-0">
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4a1525] hover:bg-[#fce7eb] rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Brand Logo & Tagline (Centered on mobile, left on desktop) */}
          <div
            className="flex-1 min-w-0 px-1 sm:px-2 flex flex-col items-center justify-center text-center cursor-pointer lg:flex-initial lg:items-start lg:text-left lg:px-0 select-none"
            onClick={() => handleNav('home')}
            id="nav-brand-logo"
          >
            <span className="font-display font-extrabold tracking-[0.14em] xs:tracking-[0.18em] sm:tracking-[0.22em] text-[#4a1525] whitespace-nowrap text-base xs:text-lg sm:text-2xl md:text-3xl leading-none transition-all drop-shadow-xs">
              {storeSettings.storeName || 'MINAL KHAN'}
            </span>
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.1em] xs:tracking-[0.16em] sm:tracking-[0.22em] md:tracking-[0.26em] text-[#b0576e] font-bold whitespace-nowrap overflow-hidden text-ellipsis block max-w-full leading-tight mt-1">
              {storeSettings.tagline || 'PREMIUM GIFTS & CUSTOMIZED GIFT BOXES'}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-r from-[#4a1525] to-[#5c1d30] text-[#fce7eb] hover:from-[#360f1b] hover:to-[#4a1525] shadow-xs flex items-center gap-1.5 border border-[#d4af37]/40'
                    : currentView === item.id
                    ? 'text-[#4a1525] font-bold border-b-2 border-[#d4af37] bg-[#fce7eb]/60'
                    : 'text-[#1f181b] hover:text-[#4a1525] hover:bg-[#fce7eb]/40'
                }`}
              >
                {item.highlight && <Gift className="w-4 h-4 text-[#d4af37]" />}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Action Icons (Search, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 shrink-0">
            {/* Search trigger */}
            {onOpenSearch && (
              <button
                id="search-open-btn"
                onClick={onOpenSearch}
                className="p-2 text-[#4a1525] hover:bg-[#fce7eb] rounded-full transition-colors min-w-[36px] min-h-[36px] xs:min-w-[40px] xs:min-h-[40px] flex items-center justify-center"
                title="Search Gifts"
                aria-label="Search Gifts"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Wishlist Button */}
            <button
              id="nav-wishlist-btn"
              onClick={() => handleNav('wishlist')}
              className="relative p-2 text-[#4a1525] hover:bg-[#fce7eb] rounded-full transition-colors min-w-[36px] min-h-[36px] xs:min-w-[40px] xs:min-h-[40px] flex items-center justify-center"
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlist.length > 0 ? 'text-[#c96f86] fill-[#c96f86]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#c96f86] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => handleNav('cart')}
              className="relative p-2 text-[#4a1525] hover:bg-[#fce7eb] rounded-full transition-colors min-w-[36px] min-h-[36px] xs:min-w-[40px] xs:min-h-[40px] flex items-center justify-center"
              title="Gift Cart"
              aria-label="View Gift Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a1525]" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#d4af37] text-[#280a13] font-black text-[9px] rounded-full w-4 h-4 flex items-center justify-center shadow-sm border border-[#4a1525]/10">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Account / Login Button */}
            <button
              id="nav-account-btn"
              onClick={() => handleNav(user ? 'account' : 'auth')}
              className="p-2 text-[#4a1525] hover:bg-[#fce7eb] rounded-full transition-colors min-w-[36px] min-h-[36px] xs:min-w-[40px] xs:min-h-[40px] flex items-center justify-center"
              title={user ? user.displayName || 'Customer Account' : 'Sign In'}
              aria-label="Customer Account"
            >
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#faf8f5] border-b border-[#f4d5dc] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                item.highlight
                  ? 'bg-gradient-to-r from-[#4a1525] to-[#5c1d30] text-[#fce7eb] shadow-xs'
                  : currentView === item.id
                  ? 'bg-[#fce7eb] text-[#4a1525] font-bold border-l-4 border-[#d4af37]'
                  : 'text-[#1f181b] hover:bg-[#fce7eb]/50'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && <Gift className="w-4 h-4 text-[#d4af37]" />}
            </button>
          ))}

          <div className="pt-4 mt-2 border-t border-[#f4d5dc] flex items-center justify-between">
            <button
              onClick={() => handleNav(user ? 'account' : 'auth')}
              className="flex items-center gap-2.5 text-[#1f181b] font-semibold py-2 px-3 hover:bg-[#fce7eb] rounded-lg transition-colors text-xs"
            >
              <UserIcon className="w-4 h-4 text-[#4a1525]" />
              <span>{user ? user.displayName || user.email : t('btnSignIn')}</span>
            </button>
            <span className="text-[11px] font-bold text-[#b0576e] uppercase tracking-wider">
              Pakistan (PKR)
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
