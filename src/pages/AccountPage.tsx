import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  MapPin,
  Phone,
  LogOut,
  ShieldCheck,
  Clock,
  CheckCircle,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

interface AccountPageProps {
  setCurrentView: (view: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ setCurrentView }) => {
  const { user, userProfile, updateProfileData, signOutUser, isAdmin } = useAuth();
  const { orders, storeSettings } = useStore();
  const { isUrdu, t } = useLanguage();

  const [name, setName] = useState(userProfile?.name || user?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState(userProfile?.city || 'Lahore');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setName(userProfile.name);
      if (userProfile.phone) setPhone(userProfile.phone);
      if (userProfile.address) setAddress(userProfile.address);
      if (userProfile.city) setCity(userProfile.city);
    }
  }, [userProfile]);

  // Filter customer's orders
  const myOrders = orders.filter((o) => {
    if (user && o.userId === user.uid) return true;
    if (phone && o.customerPhone === phone) return true;
    if (user?.email && o.customerEmail === user.email) return true;
    return false;
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfileData({ name, phone, address, city });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile information.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>;
      case 'Confirmed':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Confirmed</span>;
      case 'Preparing':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Preparing</span>;
      case 'Ready':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Ready for Dispatch</span>;
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Delivered</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Cancelled</span>;
      default:
        return <span className="bg-stone-100 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  const cleanWhatsApp = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#e8dfd3] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8b7355] font-semibold">
            Customer Dashboard
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1b3022]">
            {t('navAccount')}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Signed in as <span className="font-medium text-stone-800">{user?.email || 'Guest / Verified'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className="px-4 py-2 bg-[#d4af37] text-[#1b3022] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}
          <button
            onClick={() => signOutUser()}
            className="px-4 py-2 bg-white border border-stone-300 text-stone-700 hover:text-rose-600 hover:border-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Details Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8dfd3] shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f1ece4]">
            <User className="w-4 h-4 text-[#d4af37]" />
            <h2 className="font-display text-base font-bold text-[#1b3022]">
              Delivery Profile in Pakistan
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t('formName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('formPhone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Lahore, Karachi..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t('formAddress')}
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Apartment / Sector / Town"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#1b3022] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>{isSaving ? 'Saving...' : 'Update Delivery Details'}</span>
            </button>

            {saveSuccess && (
              <p className="text-xs text-emerald-700 font-medium text-center">
                ✓ Details updated successfully!
              </p>
            )}
          </form>
        </div>

        {/* Orders History (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#e8dfd3] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1ece4]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              <h2 className="font-display text-base font-bold text-[#1b3022]">
                Order History & Live Status
              </h2>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              {myOrders.length} {myOrders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>

          {myOrders.length > 0 ? (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-[#e8dfd3] bg-[#faf8f5] space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-[#1b3022]">
                        #{order.orderNumber}
                      </span>
                      <p className="text-[11px] text-stone-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                    {getStatusBadge(order.orderStatus)}
                  </div>

                  {/* Items list */}
                  <div className="text-xs text-stone-700 space-y-1 bg-white p-3 rounded-lg border border-stone-200">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="font-medium truncate max-w-[70%]">
                          {item.name} <span className="text-stone-400">(x{item.quantity})</span>
                        </span>
                        <span>Rs. {item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-2 mt-1 border-t border-stone-100 flex justify-between font-bold text-xs text-[#1b3022]">
                      <span>Total:</span>
                      <span>Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* WhatsApp follow-up link */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400">
                      Destination: {order.city}
                    </span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                        `Assalam-o-Alaikum MINAL KHAN! Inquiring about my Order #${order.orderNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#128C7E] hover:underline flex items-center gap-1"
                    >
                      <span>Inquire on WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-stone-500 space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <p>You have not placed any orders yet.</p>
              <button
                onClick={() => setCurrentView('shop')}
                className="px-4 py-2 bg-[#1b3022] text-white rounded-lg text-xs font-semibold"
              >
                Browse Gifts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
