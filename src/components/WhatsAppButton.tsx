
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919876543210"; // Replace with your real number
const WHATSAPP_MESSAGE =
  "Hi DICS Global, I would like to know more about your industrial automation products and services.";

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with DICS Global on WhatsApp"
      className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#20BA5A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300"
    >
      <MessageCircle size={24} aria-hidden="true" />
      <span className="text-sm font-semibold">Chat with us</span>
    </a>
  );
}
