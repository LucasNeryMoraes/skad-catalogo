import type { SVGProps } from "react";

const Icon = ({ children, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>
);
export const SearchIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></Icon>;
export const ArrowIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="m6 6 12 12M18 6 6 18"/></Icon>;
export const ChevronIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="m9 18 6-6-6-6"/></Icon>;
export const InstagramIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></Icon>;
export const WhatsAppIcon = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z"/><path d="M8.5 8.5c.6 3 2 4.5 5 5.5l1.2-1.2 2 .8c-.3 1.5-1.4 2.4-3 2.4-3.6-.3-6.8-3.4-7.2-7 0-1.4.8-2.5 2-2.8l1 2-1 1.3Z"/></Icon>;
