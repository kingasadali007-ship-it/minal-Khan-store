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
    <footer className="bg-[#142319] text-[#e2d8cd] pt-16 pb-12 border-t border-[#253f2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#253f2c]">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="cursor-pointer" onClick={() => handleNav('home')}>
              <span className="font-display text-2xl tracking-[0.2em] font-extrabold text-[#f7e7ce]">
                {storeSettings.storeName || 'MINAL KHAN'}
              </span>
              <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mt-1">
                {storeSettings.tagline || 'PREMIUM GIFTS & CUSTOMIZED GIFT BOXES'}
              </p>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              Pakistan's premier destination for thoughtfully curated luxury gifts, bespoke gift hampers, and custom keepsake boxes.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#20ba59] transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>{t('btnOrderWhatsApp')}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">{t('navShop')}</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-white transition-colors">
                  {t('navShop')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('categories')} className="hover:text-white transition-colors">
                  {t('navCategories')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('occasions')} className="hover:text-white transition-colors">
                  {t('navOccasions')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('box-builder')}
                  className="hover:text-[#d4af37] font-semibold transition-colors flex items-center gap-1 text-[#f7e7ce]"
                >
                  <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{t('navGiftBoxBuilder')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('cart')} className="hover:text-white transition-colors">
                  {t('navCart')}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">Customer Care</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  {t('navAboutUs')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
                  {t('navContact')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors">
                  {t('navPrivacy')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors">
                  {t('navTerms')}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('account')} className="hover:text-white transition-colors">
                  {t('navAccount')}
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Nationwide Delivery */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">Pakistani Concierge</h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Express Courier across Karachi, Lahore, Islamabad, Rawalpindi, and all cities.</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Cash on Delivery (COD) & Direct Bank Transfer available.</span>
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {storeSettings.storeName || 'MINAL KHAN'}. All Rights Reserved. Crafted with care in Pakistan.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" /> Currency: Pakistani Rupee (PKR - Rs.)
            </span>
            <span>•</span>
            <span>Gift Packaging Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
