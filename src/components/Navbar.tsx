import React, { useState } from 'react';
import {
  Gift,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  Globe,
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
  const { language, setLanguage, isUrdu, t } = useLanguage();
  const { cartItemsCount, wishlist, storeSettings } = useStore();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  const navItems = [
    { id: 'home', label: t('navHome') },
    { id: 'shop', label: t('navShop') },
    { id: 'categories', label: t('navCategories') },
    { id: 'occasions', label: t('navOccasions') },
    { id: 'box-builder', label: t('navGiftBoxBuilder'), highlight: true },
    { id: 'about', label: t('navAboutUs') },
    { id: 'contact', label: t('navContact') },
  ];

  const handleNav = (id: string) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8dfd3] transition-all">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-[#1b3022] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Tagline */}
          <div className="flex flex-col items-center sm:items-start cursor-pointer" onClick={() => handleNav('home')}>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-[#1b3022]">
                {storeSettings.storeName || 'MINAL KHAN'}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8b7355] font-semibold">
              {isUrdu && storeSettings.taglineUrdu ? storeSettings.taglineUrdu : storeSettings.tagline}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-all ${
                  item.highlight
                    ? 'bg-[#1b3022] text-[#f7e7ce] hover:bg-[#25422f] shadow-sm flex items-center gap-1.5'
                    : currentView === item.id
                    ? 'text-[#1b3022] font-semibold border-b-2 border-[#d4af37]'
                    : 'text-stone-700 hover:text-[#1b3022] hover:bg-[#f1ece4]'
                }`}
              >
                {item.highlight && <Gift className="w-4 h-4 text-[#d4af37]" />}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Action Icons (Search, Wishlist, Cart, Account, Admin) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={toggleLanguage}
              className="p-2 text-stone-700 hover:text-[#1b3022] hover:bg-[#f1ece4] rounded-full transition-colors flex items-center gap-1 text-xs font-semibold"
              title={language === 'en' ? 'اردو (Urdu)' : 'English'}
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-[#8b7355]" />
              <span className="hidden sm:inline font-sans">{language === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Search trigger */}
            {onOpenSearch && (
              <button
                id="search-open-btn"
                onClick={onOpenSearch}
                className="p-2 text-stone-700 hover:text-[#1b3022] hover:bg-[#f1ece4] rounded-full transition-colors"
                title="Search Gifts"
                aria-label="Search Gifts"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Wishlist Button */}
            <button
              id="nav-wishlist-btn"
              onClick={() => handleNav('wishlist')}
              className="relative p-2 text-stone-700 hover:text-[#1b3022] hover:bg-[#f1ece4] rounded-full transition-colors"
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-600 fill-rose-600' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => handleNav('cart')}
              className="relative p-2 text-stone-700 hover:text-[#1b3022] hover:bg-[#f1ece4] rounded-full transition-colors"
              title="Gift Cart"
              aria-label="View Gift Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#1b3022]" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-[#1b3022] font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Account / Login Button */}
            <button
              id="nav-account-btn"
              onClick={() => handleNav(user ? 'account' : 'auth')}
              className="p-2 text-stone-700 hover:text-[#1b3022] hover:bg-[#f1ece4] rounded-full transition-colors"
              title={user ? user.displayName || 'Customer Account' : 'Sign In'}
              aria-label="Customer Account"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {/* Admin Badge/Access */}
            <button
              id="nav-admin-btn"
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold ${
                isAdmin
                  ? 'bg-[#d4af37]/20 text-[#8b7355] hover:bg-[#d4af37]/30 border border-[#d4af37]'
                  : 'text-stone-400 hover:text-stone-700 hover:bg-[#f1ece4]'
              }`}
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-[#8b7355]" />
              <span className="hidden md:inline">{t('navAdmin')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#faf8f5] border-b border-[#e8dfd3] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between ${
                item.highlight
                  ? 'bg-[#1b3022] text-[#f7e7ce]'
                  : currentView === item.id
                  ? 'bg-[#f1ece4] text-[#1b3022] font-semibold'
                  : 'text-stone-700 hover:bg-[#f1ece4]'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && <Gift className="w-5 h-5 text-[#d4af37]" />}
            </button>
          ))}

          <div className="pt-3 border-t border-[#e8dfd3] flex items-center justify-between">
            <button
              onClick={() => handleNav(user ? 'account' : 'auth')}
              className="flex items-center gap-2 text-stone-700 font-medium py-2"
            >
              <UserIcon className="w-5 h-5" />
              <span>{user ? user.displayName || user.email : t('btnSignIn')}</span>
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 bg-[#f1ece4] text-stone-800 rounded-md text-xs font-bold"
            >
              {language === 'en' ? 'اردو' : 'English'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
