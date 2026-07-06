import Image from "next/image";
import { ArrowIcon } from "./icons";

export function Hero() {
  return (
    <section id="inicio" className="noise relative min-h-[92svh] overflow-hidden bg-[#171714] text-white">
      <Image src="/products/necessaire-box-supreme/2.jpg" alt="Necessaire SKAD em destaque" fill priority sizes="100vw" className="object-cover object-center opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-end px-5 pb-16 pt-32 sm:px-8 sm:pb-24 lg:items-center lg:pb-0">
        <div className="max-w-2xl">
          <p className="eyebrow fade-up mb-5 text-[#dec692]">Elegância em cada detalhe</p>
          <h1 className="display fade-up text-[clamp(3.6rem,9vw,8.5rem)] font-medium leading-[.76] tracking-[-.035em]">Essencial.<br/><span className="italic font-normal">Inconfundível.</span></h1>
          <p className="fade-up-delay mt-8 max-w-md text-sm leading-7 text-white/75 sm:text-base">Bolsas que unem elegância, qualidade e estilo para o dia a dia.</p>
          <a href="#catalogo" className="fade-up-delay mt-9 inline-flex items-center gap-5 border-b border-[#c8a45d] pb-2 text-xs font-bold uppercase tracking-[.18em] transition-all hover:gap-7 hover:text-[#dec692]">Ver catálogo <ArrowIcon className="h-5 w-5" /></a>
        </div>
      </div>
      <div className="absolute bottom-7 right-8 z-10 hidden items-center gap-3 text-[.62rem] uppercase tracking-[.22em] text-white/60 md:flex"><span className="h-px w-12 bg-[#c8a45d]"/> Coleção SKAD</div>
    </section>
  );
}
