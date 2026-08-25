"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { CloseIcon, SearchIcon } from "./icons";
import { ProductModal } from "./product-modal";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const preferredSubcategoryOrder = [
  "Porta-Garrafa de até 1,2L com Bordado",
  "Porta-Garrafa de até 1,2L Pintado à Mão",
  "Porta-Garrafa de até 1,2L",
];

export function Catalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [subcategory, setSubcategory] = useState("Todos");
  const [selected, setSelected] = useState<Product | null>(null);
  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];
  const subcategories = useMemo(
    () =>
      category !== "Todos"
        ? Array.from(new Set(products.filter((p) => p.category === category && p.subcategory).map((p) => p.subcategory!))).sort(
            (a, b) => {
              const orderA = preferredSubcategoryOrder.indexOf(a);
              const orderB = preferredSubcategoryOrder.indexOf(b);
              if (orderA !== -1 || orderB !== -1) {
                return (orderA === -1 ? Number.MAX_SAFE_INTEGER : orderA) - (orderB === -1 ? Number.MAX_SAFE_INTEGER : orderB);
              }
              return a.localeCompare(b, "pt-BR");
            },
          )
        : [],
    [products, category],
  );
  const visible = useMemo(
    () =>
      products.filter(
          (p) =>
          (category === "Todos" || p.category === category) &&
          (subcategories.length === 0 || subcategory === "Todos" || p.subcategory === subcategory) &&
          p.name.toLocaleLowerCase("pt-BR").includes(query.trim().toLocaleLowerCase("pt-BR")),
      ),
    [products, category, subcategory, subcategories.length, query],
  );
  const selectCategory = (item: string) => {
    setCategory(item);
    setSubcategory("Todos");
  };

  return (
    <section id="catalogo" className="scroll-mt-20 bg-[#f7f5f1] px-2 py-16 sm:px-4 sm:py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 border-b border-black/10 pb-8 sm:gap-8 sm:pb-10 md:pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow mb-4 text-[#9a7739]">Nossa seleção</p>
            <h2 className="display text-[2.65rem] font-medium leading-[.95] tracking-tight sm:text-5xl md:text-7xl">
              O seu estilo, <span className="italic font-normal">todos os dias.</span>
            </h2>
          </div>

          <label className="flex h-14 w-full items-center gap-3 border-b border-black/30 transition-colors focus-within:border-[#9a7739] md:h-12 lg:w-80">
            <SearchIcon className="h-5 w-5 text-black/50" />
            <span className="sr-only">Buscar produto</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-black/40 md:text-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Limpar busca" className="flex min-h-11 min-w-11 items-center justify-center">
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>

        <div className="no-scrollbar my-6 -mx-2 flex gap-2 overflow-x-auto px-2 pb-2 sm:-mx-4 sm:px-4 md:mx-0 md:my-8 md:px-0" aria-label="Categorias">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => selectCategory(item)}
              className={`min-h-11 whitespace-nowrap rounded-full border px-5 py-3 text-[.67rem] font-bold uppercase tracking-[.16em] transition-all md:min-h-0 md:py-2 ${
                category === item ? "border-[#171714] bg-[#171714] text-white" : "border-black/15 hover:border-black/60"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {subcategories.length > 0 && (
          <div
            className="no-scrollbar -mt-3 mb-6 -mx-2 flex gap-2 overflow-x-auto px-2 pb-2 sm:-mx-4 sm:px-4 md:mx-0 md:mb-8 md:px-0"
            aria-label="Tipos de produtos"
          >
            {["Todos", ...subcategories].map((item) => (
              <button
                key={item}
                onClick={() => setSubcategory(item)}
                className={`min-h-11 whitespace-nowrap rounded-full border px-5 py-3 text-[.64rem] font-bold uppercase tracking-[.16em] transition-all md:min-h-0 md:py-2 ${
                  subcategory === item ? "border-[#9a7739] bg-[#9a7739] text-white" : "border-black/15 bg-white/45 hover:border-[#9a7739]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {visible.length} produtos encontrados
        </p>

        {visible.length ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-2 md:gap-y-12 lg:grid-cols-3">
            {visible.map((product, index) => (
              <button key={product.id} onClick={() => setSelected(product)} className="group w-full text-left" aria-label={`Ver fotos de ${product.name}`}>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e8e4dd] sm:aspect-[3/4] md:aspect-[4/5]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 767px) 96vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.035] md:object-cover md:object-center ${
                      product.id.startsWith("shoulder-bag-piauiense-serra-da-capivara") ? "md:translate-y-5 md:scale-[1.10] md:group-hover:scale-[1.14]" : ""
                    }`}
                    priority={index < 3}
                  />
                  <span className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xl shadow-sm backdrop-blur transition-transform group-hover:rotate-45 md:h-10 md:w-10 md:text-lg">
                    +
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-black/10 py-5">
                  <div className="min-w-0 flex-1">
                    <h3 className="display text-[2rem] font-medium leading-[1.02] sm:text-[2.25rem] md:text-3xl">{product.name}</h3>
                    {product.description && <p className="mt-3 text-base leading-6 text-black/55 md:text-sm md:leading-5">{product.description}</p>}
                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      <span className="rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-sm font-semibold text-[#171714] shadow-sm md:text-xs">
                        Cartão {formatCurrency(product.price)}
                      </span>
                      <span className="rounded-full bg-[#171714] px-3.5 py-2 text-sm font-bold text-[#fff7e7] shadow-sm md:text-xs">
                        Pix {formatCurrency(product.pixPrice)}
                      </span>
                    </div>
                  </div>
                  <span className="mt-1 text-sm text-[#9a7739] md:text-xs">0{product.images.length}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="display text-3xl">Nenhum produto encontrado.</p>
            <button onClick={() => { setQuery(""); selectCategory("Todos"); }} className="mt-4 min-h-11 px-4 text-xs font-bold uppercase tracking-widest text-[#9a7739]">
              Limpar filtros
            </button>
          </div>
        )}
      </div>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
