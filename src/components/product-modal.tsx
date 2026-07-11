"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { ChevronIcon, CloseIcon } from "./icons";

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const move = useCallback(
    (direction: number) => setIndex((current) => (current + direction + product.images.length) % product.images.length),
    [product.images.length],
  );

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };

    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", keydown);
    };
  }, [move, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 backdrop-blur-sm sm:p-6"
    >
      <div className="modal-in relative grid h-[calc(100svh-1rem)] w-full max-w-6xl grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-white sm:h-[min(92vh,900px)] lg:grid-cols-[1fr_320px] lg:grid-rows-none">
        <div className="relative min-h-0 bg-[#eeeae3]">
          <Image
            src={product.images[index]}
            alt={`${product.name}, foto ${index + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-contain"
            priority
          />
        </div>

        <aside className="flex min-h-[172px] flex-col justify-between p-4 sm:min-h-[150px] sm:p-8">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md lg:static lg:h-10 lg:w-10 lg:self-end lg:shadow-none"
            aria-label="Fechar"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <div className="pr-12 lg:pr-0">
            <p className="eyebrow mb-2 text-[#9a7739] sm:mb-3">{product.category}</p>
            <h2 className="display text-3xl font-medium leading-[1.02] sm:text-4xl">{product.name}</h2>
            {product.description && (
              <p className="mt-3 inline-flex rounded-full border border-[#C8A45D]/40 px-3 py-2 text-[.64rem] font-bold uppercase tracking-[.14em] text-[#9a7739] sm:mt-4 sm:px-4 sm:text-xs sm:tracking-[.16em]">
                {product.description}
              </p>
            )}
            <p className="mt-4 hidden text-sm leading-6 text-black/55 lg:block">Conheça cada detalhe desta peça SKAD. Fale conosco para consultar cores e disponibilidade.</p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 sm:mt-5 sm:pt-5">
            <span className="text-xs tracking-[.2em] text-black/50">
              {String(index + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}
            </span>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                <button onClick={() => move(-1)} className="flex h-12 w-12 items-center justify-center border border-black/15 transition hover:bg-black hover:text-white sm:h-10 sm:w-10" aria-label="Foto anterior">
                  <ChevronIcon className="h-5 w-5 rotate-180" />
                </button>
                <button onClick={() => move(1)} className="flex h-12 w-12 items-center justify-center border border-black/15 transition hover:bg-black hover:text-white sm:h-10 sm:w-10" aria-label="Próxima foto">
                  <ChevronIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
