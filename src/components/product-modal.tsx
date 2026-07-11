"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { ChevronIcon, CloseIcon } from "./icons";

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const move = (direction: number) => setIndex((current) => (current + direction + product.images.length) % product.images.length);
  useEffect(() => {
    const previous = document.body.style.overflow; document.body.style.overflow = "hidden";
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); };
    window.addEventListener("keydown", keydown); return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", keydown); };
  });
  return (
    <div role="dialog" aria-modal="true" aria-label={product.name} onMouseDown={(e) => e.target === e.currentTarget && onClose()} className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6">
      <div className="modal-in relative grid h-[min(92vh,900px)] w-full max-w-6xl overflow-hidden bg-white lg:grid-cols-[1fr_320px]">
        <div className="relative min-h-0 bg-[#eeeae3]"><Image src={product.images[index]} alt={`${product.name}, foto ${index + 1}`} fill sizes="(max-width: 1024px) 100vw, 70vw" className="object-contain" priority /></div>
        <aside className="flex min-h-[150px] flex-col justify-between p-5 sm:p-8">
          <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md lg:static lg:self-end lg:shadow-none" aria-label="Fechar"><CloseIcon className="h-5 w-5" /></button>
          <div><p className="eyebrow mb-3 text-[#9a7739]">{product.category}</p><h2 className="display text-3xl font-medium sm:text-4xl">{product.name}</h2>{product.description && <p className="mt-4 rounded-full border border-[#C8A45D]/40 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-[#9a7739]">{product.description}</p>}<p className="mt-4 hidden text-sm leading-6 text-black/55 lg:block">Conheça cada detalhe desta peça SKAD. Fale conosco para consultar cores e disponibilidade.</p></div>
          <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-5"><span className="text-xs tracking-[.2em] text-black/50">{String(index + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}</span>{product.images.length > 1 && <div className="flex gap-2"><button onClick={() => move(-1)} className="flex h-10 w-10 items-center justify-center border border-black/15 transition hover:bg-black hover:text-white" aria-label="Foto anterior"><ChevronIcon className="h-5 w-5 rotate-180" /></button><button onClick={() => move(1)} className="flex h-10 w-10 items-center justify-center border border-black/15 transition hover:bg-black hover:text-white" aria-label="Próxima foto"><ChevronIcon className="h-5 w-5" /></button></div>}</div>
        </aside>
      </div>
    </div>
  );
}
