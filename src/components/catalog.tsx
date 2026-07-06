"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { CloseIcon, SearchIcon } from "./icons";
import { ProductModal } from "./product-modal";

export function Catalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<Product | null>(null);
  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];
  const visible = useMemo(() => products.filter((p) =>
    (category === "Todos" || p.category === category) &&
    p.name.toLocaleLowerCase("pt-BR").includes(query.trim().toLocaleLowerCase("pt-BR"))
  ), [products, category, query]);

  return (
    <section id="catalogo" className="scroll-mt-20 bg-[#f7f5f1] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-black/10 pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="eyebrow mb-4 text-[#9a7739]">Nossa seleção</p><h2 className="display text-5xl font-medium tracking-tight sm:text-7xl">O seu estilo, <span className="italic font-normal">todos os dias.</span></h2></div>
          <label className="flex h-12 w-full items-center gap-3 border-b border-black/30 transition-colors focus-within:border-[#9a7739] lg:w-80">
            <SearchIcon className="h-5 w-5 text-black/50"/><span className="sr-only">Buscar produto</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/40" />
            {query && <button onClick={() => setQuery("")} aria-label="Limpar busca"><CloseIcon className="h-4 w-4" /></button>}
          </label>
        </div>
        <div className="my-8 flex gap-2 overflow-x-auto pb-2" aria-label="Categorias">
          {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full border px-5 py-2 text-[.65rem] font-bold uppercase tracking-[.16em] transition-all ${category === item ? "border-[#171714] bg-[#171714] text-white" : "border-black/15 hover:border-black/60"}`}>{item}</button>)}
        </div>
        {visible.length ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product, index) => (
              <button key={product.id} onClick={() => setSelected(product)} className="group text-left" aria-label={`Ver fotos de ${product.name}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e8e4dd]">
                  <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" priority={index < 3} />
                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur transition-transform group-hover:rotate-45">+</span>
                </div>
                <div className="flex items-start justify-between border-b border-black/10 py-5"><div><p className="eyebrow mb-2 text-black/40">{product.category}</p><h3 className="display text-2xl font-medium sm:text-3xl">{product.name}</h3></div><span className="mt-1 text-xs text-[#9a7739]">0{product.images.length}</span></div>
              </button>
            ))}
          </div>
        ) : <div className="py-24 text-center"><p className="display text-3xl">Nenhum produto encontrado.</p><button onClick={() => { setQuery(""); setCategory("Todos"); }} className="mt-4 text-xs font-bold uppercase tracking-widest text-[#9a7739]">Limpar filtros</button></div>}
      </div>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
