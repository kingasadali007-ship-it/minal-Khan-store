import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FloatingWhatsAppHelp: React.FC = () => {
  const { storeSettings } = useStore();

  // Check if enabled (defaults to true)
  const isEnabled = storeSettings.whatsappHelpEnabled !== false;
  if (!isEnabled) return null;

  const rawNumber = (storeSettings.whatsappNumber || '923001234567').replace(/[^0-9]/g, '');
  const buttonText = storeSettings.whatsappHelpButtonText || 'Need Help? Chat with Us';
  const defaultMsg =
    storeSettings.whatsappHelpMessage ||
    'Assalam-o-Alaikum MINAL KHAN! I would like personal assistance with gifts and delivery across Pakistan.';

  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      id="floating-whatsapp-help-btn"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] flex items-center gap-2.5 group transition-all duration-300 hover:scale-105 active:scale-95 select-none"
      title="Chat with Customer Support on WhatsApp"
      aria-label="Customer Support on WhatsApp"
    >
      <Phone className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs pr-1">
        {buttonText}
      </span>
    </a>
  );
};
