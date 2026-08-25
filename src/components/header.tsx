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
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-black/8 bg-white/90 py-2 shadow-[0_8px_30px_rgb(0_0_0/0.04)] backdrop-blur-xl sm:py-3" : "py-3 text-white sm:py-5"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        <a href="#inicio" className="display flex min-h-11 items-center text-3xl font-semibold tracking-[.2em]">SKAD</a>
        <nav aria-label="Navegação principal" className="flex items-center gap-1 text-[.64rem] font-bold uppercase tracking-[.16em] sm:gap-6 sm:text-[.68rem] sm:tracking-[.18em] md:gap-10">
          <a href="/admin" className="flex min-h-11 items-center rounded-full px-3 transition-opacity hover:opacity-55 sm:px-0">Acesso</a>
          <a href="#catalogo" className="flex min-h-11 items-center rounded-full px-3 transition-opacity hover:opacity-55 sm:px-0">Catálogo</a>
          <a href="#contato" className="flex min-h-11 items-center rounded-full px-3 transition-opacity hover:opacity-55 sm:px-0">Contato</a>
        </nav>
      </div>
    </header>
  );
}
