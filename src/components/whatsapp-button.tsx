import { siteConfig } from "@/config/site";
import { WhatsAppIcon } from "./icons";

export function WhatsAppButton() {
  const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
  return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Conversar pelo WhatsApp" className="fixed bottom-4 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#171714] text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-[#9a7739] sm:bottom-7 sm:right-7 sm:h-14 sm:w-14"><WhatsAppIcon className="h-8 w-8 sm:h-7 sm:w-7" /></a>;
}
