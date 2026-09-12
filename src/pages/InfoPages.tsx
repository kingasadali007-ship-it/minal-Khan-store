import React, { useState } from 'react';
import { Mail, Phone, MapPin, Truck, ShieldCheck, Gift, Clock, Sparkles, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const AboutUsPage: React.FC = () => {
  const { storeSettings } = useStore();
  const { isUrdu } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#8b7355] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Our Heritage & Craft</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#1b3022]">
          About {storeSettings.storeName || 'MINAL KHAN'}
        </h1>
        <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
          {storeSettings.tagline || 'Premium Gifts & Customized Gift Boxes in Pakistan'}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8dfd3] shadow-xs space-y-8 text-sm text-stone-700 leading-relaxed">
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#1b3022]">
            Pakistan's Premier Gifting Atelier
          </h2>
          <p>
            Founded with a passionate conviction that giving a gift is an art of human connection,{' '}
            <strong>MINAL KHAN</strong> is dedicated exclusively to premium gifts, bespoke hampers,
            and customized keepsake boxes. We are strictly a gift atelier — curating the finest
            fragrances, timepieces, leather goods, imported chocolates, and floral arrangements.
          </p>
          <p>
            Whether honoring an Eid celebration, wedding, birthday, anniversary, or corporate milestone,
            every present leaving our studio is wrapped with meticulous attention to detail: imported satin
            ribbons, personalized wax seals, and hand-lettered calligraphy cards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#f1ece4]">
          <div className="space-y-2">
            <Gift className="w-6 h-6 text-[#d4af37]" />
            <h3 className="font-bold text-stone-900">Curated Exclusivity</h3>
            <p className="text-xs text-stone-500">
              Hand-tested items chosen for elegance, quality, and timeless emotional value.
            </p>
          </div>
          <div className="space-y-2">
            <Truck className="w-6 h-6 text-[#d4af37]" />
            <h3 className="font-bold text-stone-900">Nationwide Reach</h3>
            <p className="text-xs text-stone-500">
              Reliable delivery to Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, and all cities.
            </p>
          </div>
          <div className="space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
            <h3 className="font-bold text-stone-900">Impeccable Packaging</h3>
            <p className="text-xs text-stone-500">
              Rigid presentation boxes built to be cherished as keepsakes for years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { storeSettings } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const cleanWhatsApp = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#8b7355] font-semibold">
          We are at your service
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
          Gifting Concierge & Contact
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Reach out for custom corporate orders, wedding hampers, or urgent queries across Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact info card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8dfd3] shadow-xs space-y-6">
          <h2 className="font-display text-xl font-bold text-[#1b3022]">Get in Touch</h2>

          <div className="space-y-4 text-xs text-stone-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block">WhatsApp / Helpline</span>
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-[#1b3022] font-mono"
                >
                  +{storeSettings.whatsappNumber}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#faf8f5] text-[#8b7355] flex items-center justify-center shrink-0 border border-stone-200">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block">Email Address</span>
                <span className="text-stone-600">{storeSettings.contactEmail || 'orders@minalkhan.pk'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#faf8f5] text-[#8b7355] flex items-center justify-center shrink-0 border border-stone-200">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block">Location</span>
                <span className="text-stone-600">{storeSettings.address || 'Lahore / Karachi, Pakistan'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#faf8f5] text-[#8b7355] flex items-center justify-center shrink-0 border border-stone-200">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block">Operating Hours</span>
                <span className="text-stone-600">Monday – Sunday: 10:00 AM – 10:00 PM PKT</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                'Assalam-o-Alaikum MINAL KHAN Concierge! I need assistance.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-[#20ba59] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Chat with Concierge on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8dfd3] shadow-xs space-y-4">
          <h2 className="font-display text-xl font-bold text-[#1b3022]">Send a Message</h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-xs text-emerald-900">Message Received</h3>
              <p className="text-xs text-emerald-700">
                Thank you! Our gifting concierge will contact you within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zainab Malik"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="03001234567"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Message / Event Inquiries</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about the occasion, desired delivery date, or items needed..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-stone-700 leading-relaxed text-xs sm:text-sm">
      <h1 className="font-display text-3xl font-bold text-[#1b3022]">Privacy Policy</h1>
      <p className="text-stone-500">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8dfd3] space-y-4 shadow-2xs">
        <h2 className="font-bold text-base text-stone-900">1. Information We Collect</h2>
        <p>
          At <strong>MINAL KHAN</strong>, we value your privacy. We collect customer names, contact
          phone numbers, delivery addresses, and gift messages solely to fulfill and deliver your
          orders safely within Pakistan.
        </p>

        <h2 className="font-bold text-base text-stone-900">2. WhatsApp Communication</h2>
        <p>
          When you click "Order on WhatsApp", order details are transmitted directly between you and
          our official MINAL KHAN WhatsApp business line. We never share your phone number with
          unaffiliated third parties.
        </p>

        <h2 className="font-bold text-base text-stone-900">3. Confidential Gift Messaging</h2>
        <p>
          All personal notes and calligraphy card messages written inside the Gift Box Builder remain
          strictly confidential and are viewed only by our packing artisans.
        </p>
      </div>
    </div>
  );
};

export const TermsDeliveryPage: React.FC = () => {
  const { storeSettings } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-stone-700 leading-relaxed text-xs sm:text-sm">
      <h1 className="font-display text-3xl font-bold text-[#1b3022]">Terms & Delivery Information</h1>
      <p className="text-stone-500">Official policy for MINAL KHAN customers across Pakistan.</p>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8dfd3] space-y-5 shadow-2xs">
        <div>
          <h2 className="font-bold text-base text-stone-900">Delivery Timelines in Pakistan</h2>
          <p className="mt-1">
            • <strong>Major Cities (Karachi, Lahore, Islamabad, Rawalpindi):</strong> 2 to 3 business days.<br />
            • <strong>Other Cities & Regional Towns:</strong> 3 to 5 business days.<br />
            • <strong>Express Delivery:</strong> Same-day or next-day delivery available upon concierge request on WhatsApp.
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100">
          <h2 className="font-bold text-base text-stone-900">Delivery Charges & Threshold</h2>
          <p className="mt-1">
            Standard delivery across Pakistan is <strong>Rs. {storeSettings.deliveryCharges.toLocaleString()}</strong>.
            {storeSettings.freeDeliveryThreshold > 0 && (
              <span> Orders exceeding <strong>Rs. {storeSettings.freeDeliveryThreshold.toLocaleString()}</strong> qualify for complimentary free delivery!</span>
            )}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100">
          <h2 className="font-bold text-base text-stone-900">Payment Methods</h2>
          <p className="mt-1">
            We offer <strong>Cash on Delivery (COD)</strong> across all serviced areas of Pakistan, as well as Direct Bank Transfer (Meezan Bank, HBL, Alfalah) or Raast.
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100">
          <h2 className="font-bold text-base text-stone-900">Damages & Guarantee</h2>
          <p className="mt-1">
            All gift boxes are packaged with heavy impact cushioning. In the rare event of transit damage, notify us on WhatsApp with photo evidence within 24 hours of delivery for an immediate complimentary replacement.
          </p>
        </div>
      </div>
    </div>
  );
};
