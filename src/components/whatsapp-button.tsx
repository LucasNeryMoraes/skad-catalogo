import { siteConfig } from "@/config/site";
import { WhatsAppIcon } from "./icons";

export function WhatsAppButton() {
  const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
  return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Conversar pelo WhatsApp" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#171714] text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-[#9a7739] sm:bottom-7 sm:right-7"><WhatsAppIcon className="h-7 w-7" /></a>;
}
