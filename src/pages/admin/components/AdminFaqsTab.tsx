import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  X,
  ChevronDown,
  ChevronUp,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { FAQItem } from '../../../types';

export const AdminFaqsTab: React.FC = () => {
  const { faqs, addFAQItem, updateFAQItem, deleteFAQItem } = useStore();

  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedFaqs = [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq?.question || !editingFaq?.answer) {
      alert('Please provide question and answer');
      return;
    }

    try {
      if (editingFaq.id) {
        await updateFAQItem(editingFaq.id, editingFaq);
      } else {
        await addFAQItem({
          question: editingFaq.question,
          answer: editingFaq.answer,
          category: editingFaq.category || 'General',
          order: editingFaq.order || faqs.length + 1,
        });
      }
      setEditingFaq(null);
    } catch (err: any) {
      alert('Failed to save FAQ: ' + err.message);
    }
  };

  const moveFaq = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedFaqs.length) return;

    const currentFaq = sortedFaqs[index];
    const targetFaq = sortedFaqs[targetIndex];

    const currentOrder = currentFaq.order ?? index + 1;
    const targetOrder = targetFaq.order ?? targetIndex + 1;

    await updateFAQItem(currentFaq.id, { order: targetOrder });
    await updateFAQItem(targetFaq.id, { order: currentOrder });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1ece4]">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1b3022]">
            Frequently Asked Questions ({faqs.length})
          </h2>
          <p className="text-xs text-stone-500">
            Manage customer help questions covering advance payment policy, delivery timelines across Pakistan, custom gift box curation, and tracking.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingFaq({
              question: '',
              answer: '',
              category: 'General',
              order: faqs.length + 1,
            })
          }
          className="px-3.5 py-2 bg-[#1b3022] text-[#f7e7ce] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#25422f] shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* MODAL / EDITOR */}
      {editingFaq && (
        <form
          onSubmit={handleSaveFaq}
          className="p-5 bg-[#faf8f5] rounded-2xl border border-[#d4af37]/40 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h4 className="font-bold text-xs text-[#1b3022] uppercase tracking-wider">
              {editingFaq.id ? 'Edit FAQ Item' : 'New FAQ Item'}
            </h4>
            <button
              type="button"
              onClick={() => setEditingFaq(null)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Question *</label>
              <input
                type="text"
                required
                value={editingFaq.question || ''}
                onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                placeholder="e.g. Why does MINAL KHAN operate strictly on advance payment?"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1b3022]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category</label>
              <input
                type="text"
                value={editingFaq.category || ''}
                onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                placeholder="e.g. Payments & Ordering, Delivery, Customization"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Display Order</label>
              <input
                type="number"
                value={editingFaq.order || 1}
                onChange={(e) => setEditingFaq({ ...editingFaq, order: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Answer Content *</label>
              <textarea
                rows={4}
                required
                value={editingFaq.answer || ''}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                placeholder="Explain the answer in clear, reassuring terms..."
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl outline-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setEditingFaq(null)}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1b3022] text-[#f7e7ce] rounded-xl text-xs font-bold hover:bg-[#25422f]"
            >
              Save FAQ Item
            </button>
          </div>
        </form>
      )}

      {/* FAQS LIST */}
      <div className="space-y-3">
        {sortedFaqs.map((faq, idx) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs"
            >
              <div className="p-4 flex items-center justify-between gap-3">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-[11px] font-mono font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900 leading-snug">
                      {faq.question}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-500 font-medium inline-block mt-1">
                      {faq.category || 'General'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => moveFaq(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <MoveUp className="w-3.5 h-3.5 text-stone-700" />
                  </button>
                  <button
                    onClick={() => moveFaq(idx, 'down')}
                    disabled={idx === sortedFaqs.length - 1}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <MoveDown className="w-3.5 h-3.5 text-stone-700" />
                  </button>
                  <button
                    onClick={() => setEditingFaq(faq)}
                    className="p-1.5 text-stone-600 hover:text-[#1b3022] rounded-lg hover:bg-stone-100"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete FAQ "${faq.question}"?`)) {
                        await deleteFAQItem(faq.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-4 pt-1 border-t border-stone-100 bg-[#faf8f5] text-xs text-stone-700 leading-relaxed">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
