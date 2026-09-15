import React from 'react';
import { Phone, Mail, MapPin, Gift, Heart, Shield, Truck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const { isUrdu, t } = useLanguage();
  const { storeSettings } = useStore();

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsApp = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#280a13] text-[#fce7eb]/90 pt-16 pb-12 border-t border-[#3d111e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3d111e]">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="cursor-pointer" onClick={() => handleNav('home')}>
              <span className="font-display text-2xl tracking-[0.2em] font-extrabold text-[#faf6ee]">
                {storeSettings.storeName || 'MINAL KHAN'}
              </span>
              <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mt-1">
                {storeSettings.tagline || 'PREMIUM GIFTS & CUSTOMIZED GIFT BOXES'}
              </p>
            </div>
            <p className="text-sm text-[#fce7eb]/80 leading-relaxed">
              MINAL KHAN is a premium online gift store in Pakistan offering luxury perfumes, watches, leather wallets, artisan chocolates, personalized gifts, and bespoke customized gift boxes nationwide.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#20ba59] transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Concierge Support on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">Shop Collections</h4>
            <ul className="space-y-2 text-sm text-[#fce7eb]/80">
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-white transition-colors cursor-pointer">
                  All Gifts & Hampers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('categories')} className="hover:text-white transition-colors cursor-pointer">
                  Shop by Category
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('occasions')} className="hover:text-white transition-colors cursor-pointer">
                  Shop by Occasion
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('box-builder')}
                  className="hover:text-[#d4af37] font-semibold transition-colors flex items-center gap-1 text-[#faf6ee] cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Build Custom Box</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('track-order')} className="hover:text-[#d4af37] transition-colors font-medium cursor-pointer">
                  Track Your Order
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">Customer Care</h4>
            <ul className="space-y-2 text-sm text-[#fce7eb]/80">
              <li>
                <button onClick={() => handleNav('shipping')} className="hover:text-white transition-colors cursor-pointer">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blogs')} className="hover:text-white transition-colors cursor-pointer">
                  Gifting Journal & Blog
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors cursor-pointer">
                  About MINAL KHAN
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact & Atelier
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Nationwide Delivery */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">Nationwide Pakistan</h4>
            <div className="space-y-2 text-xs text-[#fce7eb]/80">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Fast Courier across Karachi, Lahore, Islamabad, Rawalpindi, and 100+ cities.</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>100% Verified Advance Bank Transfer for prioritized dispatch.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>+{storeSettings.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{storeSettings.contactEmail || 'orders@minalkhan.pk'}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{storeSettings.address || 'Pakistan'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#fce7eb]/60">
          <p>© {new Date().getFullYear()} {storeSettings.storeName || 'MINAL KHAN'}. All Rights Reserved. Crafted with care in Pakistan.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" /> Currency: Pakistani Rupee (PKR - Rs.)
            </span>
            <span>•</span>
            <span>Luxury Packaging Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
