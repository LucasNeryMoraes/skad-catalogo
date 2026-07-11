import { siteConfig } from "@/config/site";
import { InstagramIcon } from "./icons";

export function Footer() {
  return (
    <footer id="contato" className="bg-[#171714] px-4 py-14 text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:pb-12">
          <div>
            <p className="display text-5xl font-semibold tracking-[.18em]">SKAD</p>
            <p className="mt-3 max-w-sm text-base leading-7 text-white/50 sm:text-sm sm:leading-6">Elegância, qualidade e estilo pensados para acompanhar a sua rotina.</p>
          </div>
          <div className="flex gap-3">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition hover:border-[#c8a45d] hover:text-[#c8a45d] sm:h-11 sm:w-11"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-[.62rem] uppercase tracking-[.18em] text-white/35 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} SKAD. Todos os direitos reservados.</span>
          <span>Feito com cuidado, detalhe por detalhe.</span>
        </div>
      </div>
    </footer>
  );
}
