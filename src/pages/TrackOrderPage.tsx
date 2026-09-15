import React, { useState } from 'react';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ShieldCheck,
  AlertCircle,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';

interface TrackOrderPageProps {
  setCurrentView: (view: string) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ setCurrentView }) => {
  const { orders, storeSettings } = useStore();
  const [queryInput, setQueryInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = queryInput.trim().toLowerCase();
    if (!cleanQuery) return;

    setSearched(true);
    // Match by orderNumber (e.g. MK-123456), or customerPhone, or ID
    const match = orders.find((o) => {
      const numMatch = o.orderNumber?.toLowerCase() === cleanQuery;
      const idMatch = o.id?.toLowerCase() === cleanQuery;
      const phoneMatch = o.customerPhone?.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, ''));
      return numMatch || idMatch || (cleanQuery.length >= 7 && phoneMatch);
    });

    setFoundOrder(match || null);
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'Payment Pending',
      label: 'Payment Pending',
      desc: 'Bank receipt submitted, pending accounts review',
    },
    {
      key: 'Payment Verified',
      label: 'Payment Verified',
      desc: 'Transfer verified by finance department',
    },
    {
      key: 'Preparing',
      label: 'Preparing & Wrapping',
      desc: 'Handcrafting packaging, ribbons & personalized card',
    },
    {
      key: 'Out for Delivery',
      label: 'Out for Delivery',
      desc: 'Dispatched with express courier partner',
    },
    {
      key: 'Delivered',
      label: 'Delivered',
      desc: 'Safely handed over to the recipient',
    },
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const sequence: OrderStatus[] = [
      'Payment Pending',
      'Payment Verified',
      'Confirmed',
      'Preparing',
      'Ready',
      'Out for Delivery',
      'Delivered',
    ];

    const targetIdx = sequence.indexOf(stepKey);
    let currentIdx = sequence.indexOf(currentStatus);
    if (currentStatus === 'New') currentIdx = 0;
    if (currentStatus === 'Confirmed') currentIdx = 1;
    if (currentStatus === 'Ready') currentIdx = 3;

    if (currentStatus === 'Cancelled') return 'cancelled';
    if (currentIdx > targetIdx) return 'completed';
    if (currentIdx === targetIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b7355]">
          Live Order Status
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
          Track Your MINAL KHAN Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Enter your Order Reference Number (e.g.{' '}
          <span className="font-mono font-bold text-stone-800">MK-123456</span>) or the phone number used at checkout.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 p-1.5 bg-white border-2 border-[#d4af37]/50 rounded-2xl shadow-sm focus-within:border-[#1b3022] transition-colors">
          <div className="pl-3 text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Enter Order # (e.g. MK-123456) or 03001234567"
            className="flex-1 px-2 py-2 text-xs sm:text-sm outline-none text-stone-800 placeholder-stone-400 font-medium"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#1b3022] hover:bg-[#25422f] text-[#f7e7ce] rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            Track
          </button>
        </div>
      </form>

      {/* Result View */}
      {searched && foundOrder && (
        <div className="bg-white rounded-3xl border border-[#e8dfd3] p-6 sm:p-8 space-y-8 shadow-sm animate-in fade-in">
          {/* Order Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
                Order Reference
              </span>
              <h2 className="font-mono text-2xl font-bold text-[#1b3022]">
                {foundOrder.orderNumber}
              </h2>
              <span className="text-xs text-stone-500">
                Placed on {new Date(foundOrder.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block">
                Current Status
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{foundOrder.orderStatus}</span>
              </span>
            </div>
          </div>

          {/* Progress Milestones */}
          <div className="space-y-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-stone-700">
              Fulfillment Timeline
            </h3>

            <div className="relative border-l-2 border-stone-200 ml-4 pl-6 space-y-6">
              {steps.map((st) => {
                const status = getStepStatus(st.key, foundOrder.orderStatus);
                const isDone = status === 'completed';
                const isActive = status === 'active';

                return (
                  <div key={st.key} className="relative">
                    {/* Circle on line */}
                    <div
                      className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isActive
                          ? 'bg-[#1b3022] border-[#d4af37] text-[#d4af37]'
                          : 'bg-white border-stone-300 text-stone-300'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#d4af37]' : 'bg-transparent'}`} />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          isActive ? 'text-[#1b3022]' : isDone ? 'text-stone-800' : 'text-stone-400'
                        }`}
                      >
                        {st.label}
                      </h4>
                      <p className="text-[11px] text-stone-500">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Dispatch & Tracking Details */}
          {(foundOrder.trackingNumber || foundOrder.courierPartner) && (
            <div className="bg-[#f0fdf4] rounded-2xl border border-emerald-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-700" />
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                    Courier Dispatch & Consignment Tracking
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  Shipped via {foundOrder.courierPartner || 'Express Courier'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    Courier Partner
                  </span>
                  <p className="font-bold text-stone-900 mt-0.5">
                    {foundOrder.courierPartner || 'TCS Express'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">
                    Tracking / CN Number
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-xs">
                      {foundOrder.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (foundOrder.trackingNumber) {
                          navigator.clipboard.writeText(foundOrder.trackingNumber);
                          alert('Tracking number copied to clipboard!');
                        }
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 italic">
                You can track your package directly on the courier company's website or app using your tracking number above.
              </p>
            </div>
          )}

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-800 block">Recipient & Destination</span>
              <p className="text-stone-700 font-medium">{foundOrder.customerName}</p>
              <p className="text-stone-600">{foundOrder.city}, {foundOrder.address}</p>
              <p className="text-stone-500">Contact: {foundOrder.customerPhone}</p>
            </div>

            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-800 block">Payment Details</span>
              <div className="flex justify-between">
                <span className="text-stone-600">Method</span>
                <span className="font-medium text-stone-800">{foundOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Payment Status</span>
                <span className="font-bold text-emerald-800">{foundOrder.paymentStatus}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-200 font-bold text-stone-900">
                <span>Total Amount</span>
                <span>Rs. {foundOrder.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-stone-700">
              Items in this shipment
            </h4>
            <div className="divide-y divide-stone-100 bg-[#fcfaf7] rounded-2xl p-4 border border-stone-200">
              {foundOrder.items.map((item, i) => (
                <div key={i} className="py-2 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{item.name}</span>
                    <span className="text-stone-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-stone-800">
                    Rs. {item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Searched & Not Found */}
      {searched && !foundOrder && (
        <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center max-w-lg mx-auto space-y-4 shadow-sm animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-display text-base font-bold text-stone-900">
            No Order Found for "{queryInput}"
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Please verify your 6-digit Order Reference (e.g. MK-123456) or phone number. If you just submitted your order, allow 1–2 minutes for the network to sync.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                const num = (storeSettings.whatsappNumber || '923001234567').replace(/[^0-9]/g, '');
                window.open(
                  `https://wa.me/${num}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum MINAL KHAN Support, I need help locating my order: ${queryInput}`
                  )}`,
                  '_blank'
                );
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Ask Support on WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Help Card */}
      <div className="p-6 bg-[#faf8f5] rounded-2xl border border-[#e8dfd3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-stone-900">Need urgent dispatch updates?</h4>
          <p className="text-stone-500">
            Our gifting concierge is available to verify bank receipts or arrange priority delivery.
          </p>
        </div>
        <button
          onClick={() => {
            const num = (storeSettings.whatsappNumber || '923001234567').replace(/[^0-9]/g, '');
            window.open(`https://wa.me/${num}`, '_blank');
          }}
          className="px-5 py-2.5 bg-[#1b3022] text-[#f7e7ce] rounded-xl font-bold uppercase tracking-wider hover:bg-[#25422f] shrink-0"
        >
          Contact Concierge
        </button>
      </div>
    </div>
  );
};
