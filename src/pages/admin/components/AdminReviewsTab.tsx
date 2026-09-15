import React, { useState } from 'react';
import {
  Star,
  Check,
  X,
  Trash2,
  Plus,
  Sparkles,
  ShieldCheck,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CustomerReview } from '../../../types';

export const AdminReviewsTab: React.FC = () => {
  const {
    reviews,
    addCustomerReview,
    updateReviewStatus,
    toggleFeatureReview,
    deleteCustomerReview,
  } = useStore();

  const [filter, setFilter] = useState<'All' | 'Approved' | 'Pending' | 'Featured'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReview, setNewReview] = useState<Partial<CustomerReview>>({
    customerName: '',
    city: 'Lahore',
    rating: 5,
    comment: '',
    productName: '',
    isApproved: true,
    isFeatured: true,
  });

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.customerName || !newReview.comment) {
      alert('Please provide customer name and review comment');
      return;
    }

    try {
      await addCustomerReview({
        customerName: newReview.customerName,
        city: newReview.city || 'Pakistan',
        rating: Number(newReview.rating) || 5,
        comment: newReview.comment,
        productName: newReview.productName || 'Signature Gift Set',
      });
      setShowAddModal(false);
      setNewReview({
        customerName: '',
        city: 'Lahore',
        rating: 5,
        comment: '',
        productName: '',
        isApproved: true,
        isFeatured: true,
      });
      alert('Review published successfully!');
    } catch (err: any) {
      alert('Failed to add review: ' + err.message);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'Approved') return r.isApproved === true;
    if (filter === 'Pending') return r.isApproved === false;
    if (filter === 'Featured') return r.isFeatured === true;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1ece4]">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1b3022]">
            Customer Reviews & Testimonials ({reviews.length})
          </h2>
          <p className="text-xs text-stone-500">
            Moderate, approve, and feature customer feedback displayed on the homepage and products.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#1b3022] text-[#f7e7ce] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#25422f] shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Verified Review</span>
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(['All', 'Approved', 'Pending', 'Featured'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors ${
              filter === tab
                ? 'bg-[#1b3022] text-[#f7e7ce]'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ADD REVIEW MODAL */}
      {showAddModal && (
        <form
          onSubmit={handleAddReviewSubmit}
          className="p-5 bg-[#faf8f5] rounded-2xl border border-[#d4af37]/40 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h4 className="font-bold text-xs text-[#1b3022] uppercase tracking-wider">
              Add Verified Customer Review
            </h4>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={newReview.customerName || ''}
                onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                placeholder="e.g. Dr. Areeba Malik"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">City (Pakistan) *</label>
              <input
                type="text"
                required
                value={newReview.city || ''}
                onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                placeholder="e.g. DHA, Karachi"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Rating (1 to 5 Stars)</label>
              <select
                value={newReview.rating || 5}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
                <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                <option value={2}>⭐⭐ (2 Stars)</option>
                <option value={1}>⭐ (1 Star)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Product Purchased</label>
              <input
                type="text"
                value={newReview.productName || ''}
                onChange={(e) => setNewReview({ ...newReview, productName: e.target.value })}
                placeholder="e.g. Royal Emerald Velvet Keepsake Box"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Customer Review Comment *</label>
              <textarea
                rows={3}
                required
                value={newReview.comment || ''}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="The packaging and delivery was exquisite..."
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1b3022] text-[#f7e7ce] rounded-xl text-xs font-bold hover:bg-[#25422f]"
            >
              Publish Review
            </button>
          </div>
        </form>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
            No reviews found matching "{filter}".
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1b3022] text-[#d4af37] flex items-center justify-center font-bold text-xs">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <span>{rev.customerName}</span>
                      {rev.isApproved && (
                        <span className="inline-flex items-center text-[10px] text-emerald-700 font-bold px-1.5 py-0.2 bg-emerald-50 rounded">
                          Verified
                        </span>
                      )}
                      {rev.isFeatured && (
                        <span className="inline-flex items-center text-[10px] text-amber-700 font-bold px-1.5 py-0.2 bg-amber-50 rounded">
                          Featured
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {rev.city}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {rev.date}
                      </span>
                      {rev.productName && (
                        <>
                          <span>•</span>
                          <span className="text-stone-600 font-medium">{rev.productName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#d4af37]">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-stone-700 italic bg-[#faf8f5] p-3 rounded-xl border border-stone-100 leading-relaxed">
                "{rev.comment}"
              </p>

              {/* Action Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await updateReviewStatus(rev.id, !rev.isApproved);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                      rev.isApproved
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{rev.isApproved ? 'Approved' : 'Approve Review'}</span>
                  </button>

                  <button
                    onClick={async () => {
                      await toggleFeatureReview(rev.id, !rev.isFeatured);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                      rev.isFeatured
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{rev.isFeatured ? 'Featured on Home' : 'Feature'}</span>
                  </button>
                </div>

                <button
                  onClick={async () => {
                    if (confirm(`Delete review from ${rev.customerName}?`)) {
                      await deleteCustomerReview(rev.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
