"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-black/8 bg-white/90 py-3 shadow-[0_8px_30px_rgb(0_0_0/0.04)] backdrop-blur-xl" : "py-5 text-white"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#inicio" className="display text-3xl font-semibold tracking-[.2em]">SKAD</a>
        <nav aria-label="Navegação principal" className="flex items-center gap-7 text-[.68rem] font-bold uppercase tracking-[.18em] sm:gap-10">
          <a href="#catalogo" className="transition-opacity hover:opacity-55">Catálogo</a>
          <a href="#contato" className="hidden transition-opacity hover:opacity-55 sm:block">Contato</a>
        </nav>
      </div>
    </header>
  );
}
