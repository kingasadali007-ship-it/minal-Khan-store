import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, Phone, ShieldCheck } from 'lucide-react';
import { INITIAL_FAQS } from '../utils/seedData';
import { useStore } from '../context/StoreContext';

interface FAQPageProps {
  setCurrentView: (view: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ setCurrentView }) => {
  const { storeSettings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = INITIAL_FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b7355]">
          Help & Support
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b3022]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Everything you need to know about placing gift orders, advance bank transfer, custom packaging, and Pakistan nationwide delivery.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. Bank transfer, delivery, tracking)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e8dfd3] rounded-xl text-xs sm:text-sm outline-none focus:border-[#1b3022] transition-colors"
        />
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-[#e8dfd3] overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1b3022]/10 text-[#1b3022] font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-display text-sm sm:text-base font-bold text-[#1b3022]">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#8b7355]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#faf8f5]/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-stone-500 text-xs">
            No matching questions found. Try searching a different keyword or contact our concierge below.
          </div>
        )}
      </div>

      {/* Concierge Box */}
      <div className="p-6 sm:p-8 bg-[#1b3022] text-[#f7e7ce] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-display text-lg font-bold text-[#faf6ee]">
            Have a custom requirement or need assistance?
          </h3>
          <p className="text-xs text-stone-300 font-light max-w-md">
            Our gifting specialists are available to answer your questions and assist with special packaging requests.
          </p>
        </div>

        <button
          onClick={() => {
            const num = (storeSettings.whatsappNumber || '923001234567').replace(/[^0-9]/g, '');
            window.open(`https://wa.me/${num}`, '_blank');
          }}
          className="px-6 py-3.5 bg-[#d4af37] hover:bg-[#c49f2b] text-[#1b3022] font-bold text-xs rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-lg"
        >
          <Phone className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
