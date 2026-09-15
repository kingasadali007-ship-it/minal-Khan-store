import React from 'react';
import { Truck, ShieldCheck, Clock, PackageCheck, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ShippingPageProps {
  setCurrentView: (view: string) => void;
}

export const ShippingPage: React.FC<ShippingPageProps> = ({ setCurrentView }) => {
  const { storeSettings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b7355]">
          Logistics & Fulfillment
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Reliable, tracked, and protective delivery across 100+ cities in Pakistan.
        </p>
      </div>

      {/* Key Shipping Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#e8dfd3] p-5 text-center space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-[#1b3022]/10 text-[#1b3022] flex items-center justify-center mx-auto">
            <Truck className="w-5 h-5 text-[#d4af37]" />
          </div>
          <h4 className="font-display text-sm font-bold text-[#1b3022]">Delivery Charges</h4>
          <p className="text-xs text-stone-600">
            Flat <strong>Rs. {storeSettings.deliveryCharges}</strong> across Pakistan.
            <br />
            <span className="text-emerald-700 font-semibold">
              FREE for orders above Rs. {storeSettings.freeDeliveryThreshold.toLocaleString()}
            </span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8dfd3] p-5 text-center space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-[#1b3022]/10 text-[#1b3022] flex items-center justify-center mx-auto">
            <Clock className="w-5 h-5 text-[#d4af37]" />
          </div>
          <h4 className="font-display text-sm font-bold text-[#1b3022]">Transit Time</h4>
          <p className="text-xs text-stone-600">
            <strong>1–3 business days</strong> in Lahore, Karachi, Islamabad & Rawalpindi.
            <br />
            2–4 business days nationwide.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8dfd3] p-5 text-center space-y-2 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-[#1b3022]/10 text-[#1b3022] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <h4 className="font-display text-sm font-bold text-[#1b3022]">Fragile Care</h4>
          <p className="text-xs text-stone-600">
            Multi-layer shock-absorbent cushioning & signature tamper-proof MINAL KHAN wax seals.
          </p>
        </div>
      </div>

      {/* Main Narrative Blocks */}
      <div className="bg-white rounded-3xl border border-[#e8dfd3] p-6 sm:p-8 space-y-6 shadow-xs text-xs sm:text-sm text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-display text-base font-bold text-[#1b3022] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#8b7355]" />
            <span>1. Delivery Coverage Across Pakistan</span>
          </h3>
          <p>
            MINAL KHAN partners with Pakistan's leading express courier networks (TCS, Leopard, Call Courier, Trax) to deliver to all major metropolitan centers and surrounding regions including:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium text-stone-800">
            <li>• Lahore & suburbs</li>
            <li>• Karachi & Clifton</li>
            <li>• Islamabad & Rawalpindi</li>
            <li>• Faisalabad</li>
            <li>• Multan</li>
            <li>• Peshawar</li>
            <li>• Gujranwala & Sialkot</li>
            <li>• Quetta & Hyderabad</li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-100">
          <h3 className="font-display text-base font-bold text-[#1b3022] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8b7355]" />
            <span>2. Why We Require Advance Bank Transfer</span>
          </h3>
          <p>
            Unlike mass-produced apparel, every MINAL KHAN parcel contains delicate luxury goods (perfume bottles, timepieces, fine chocolates, hand-poured candles) or bespoke custom gift boxes with personalized calligraphy.
          </p>
          <p>
            Our <strong>Advance Bank Transfer policy</strong> ensures that each gift is carefully crafted and dispatched with dedicated priority. It eliminates return-in-transit risks and guarantees that only genuine orders are processed by our atelier.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-100">
          <h3 className="font-display text-base font-bold text-[#1b3022] flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#8b7355]" />
            <span>3. Packaging & Safe Transit Guarantee</span>
          </h3>
          <p>
            Every parcel is packed inside sturdy corrugated shipping containers with internal bubble-cushioning and void-fill protection to withstand intercity transit. In the rare event of damage during shipment, notify our WhatsApp concierge within 24 hours of delivery with photographic evidence for immediate replacement.
          </p>
        </section>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => setCurrentView('shop')}
          className="px-8 py-3.5 bg-[#1b3022] text-[#f7e7ce] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#25422f] transition-all shadow-md"
        >
          Explore Gift Collection
        </button>
      </div>
    </div>
  );
};
