"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

type MaterialRow = {
  id?: string;
  localId: string;
  name: string;
  unit: string;
  quantity: string;
  unitPrice: string;
};

type CostResponse = {
  productId: string;
  marginPercent: number;
  materials: Array<{
    id: string;
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const saleCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const newLocalId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const emptyRow = (): MaterialRow => ({
  localId: newLocalId(),
  name: "",
  unit: "",
  quantity: "",
  unitPrice: "",
});

const toNumber = (value: string) => {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const fromNumber = (value: number) =>
  Number.isInteger(value) ? String(value) : String(value).replace(".", ",");

export function CostDashboard({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [marginPercent, setMarginPercent] = useState("0");
  const [materials, setMaterials] = useState<MaterialRow[]>([emptyRow()]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];
  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => product.name.toLowerCase().includes(term));
  }, [products, query]);

  const rowsWithSubtotal = useMemo(
    () =>
      materials.map((material) => ({
        ...material,
        subtotal: toNumber(material.quantity) * toNumber(material.unitPrice),
      })),
    [materials],
  );

  const materialTotal = rowsWithSubtotal.reduce((total, row) => total + row.subtotal, 0);
  const profitValue = materialTotal * (toNumber(marginPercent) / 100);
  const suggestedPrice = materialTotal + profitValue;

  useEffect(() => {
    if (!selectedProductId) return;

    let isCurrent = true;
    async function loadCost() {
      setIsLoading(true);
      setMessage("");

      try {
        const response = await fetch(`/api/admin/costs/${selectedProductId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar os custos.");
        }

        const data = (await response.json()) as CostResponse;

        if (!isCurrent) return;

        setMarginPercent(fromNumber(data.marginPercent));
        setMaterials(
          data.materials.length
            ? data.materials.map((material) => ({
                id: material.id,
                localId: material.id,
                name: material.name,
                unit: material.unit,
                quantity: fromNumber(material.quantity),
                unitPrice: fromNumber(material.unitPrice),
              }))
            : [emptyRow()],
        );
      } catch {
        if (isCurrent) {
          setMessage("Erro ao carregar os custos deste produto.");
          setMaterials([emptyRow()]);
          setMarginPercent("0");
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadCost();

    return () => {
      isCurrent = false;
    };
  }, [selectedProductId]);

  function updateMaterial(localId: string, field: keyof Omit<MaterialRow, "localId" | "id">, value: string) {
    setMaterials((current) =>
      current.map((material) =>
        material.localId === localId ? { ...material, [field]: value } : material,
      ),
    );
  }

  function addMaterial() {
    setMaterials((current) => [...current, emptyRow()]);
  }

  function removeMaterial(localId: string) {
    setMaterials((current) =>
      current.length > 1 ? current.filter((material) => material.localId !== localId) : [emptyRow()],
    );
  }

  async function saveCost() {
    if (!selectedProductId) return;

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/costs/${selectedProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marginPercent: toNumber(marginPercent),
          materials: materials
            .map((material) => ({
              name: material.name.trim(),
              unit: material.unit.trim(),
              quantity: toNumber(material.quantity),
              unitPrice: toNumber(material.unitPrice),
            }))
            .filter((material) => material.name || material.unit || material.quantity || material.unitPrice),
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível salvar.");
      }

      const data = (await response.json()) as CostResponse;
      setMarginPercent(fromNumber(data.marginPercent));
      setMaterials(
        data.materials.length
          ? data.materials.map((material) => ({
              id: material.id,
              localId: material.id,
              name: material.name,
              unit: material.unit,
              quantity: fromNumber(material.quantity),
              unitPrice: fromNumber(material.unitPrice),
            }))
          : [emptyRow()],
      );
      setMessage("Custos salvos com sucesso.");
    } catch {
      setMessage("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-8 grid min-w-0 gap-5 sm:mt-10 lg:grid-cols-[20rem_1fr] lg:gap-6">
      <aside className="rounded-[1.75rem] border border-black/10 bg-white p-4 shadow-xl shadow-black/5">
        <div className="sticky top-24">
          <label className="block">
            <span className="eyebrow text-neutral-500">Produtos</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar produto"
              className="mt-3 h-12 w-full rounded-full border border-black/10 px-4 text-sm outline-none focus:border-gold focus:ring-4 focus:ring-gold/10"
            />
          </label>

          <div className="mt-4 max-h-[64vh] space-y-2 overflow-y-auto pr-1">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedProductId(product.id)}
                className={`flex min-h-20 w-full items-center gap-3 rounded-2xl border p-2 text-left transition ${
                  product.id === selectedProductId
                    ? "border-gold bg-gold/10"
                    : "border-black/10 hover:border-gold/60"
                }`}
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <span>
                  <span className="block text-sm font-semibold leading-snug">{product.name}</span>
                  <span className="mt-1 block text-[.65rem] uppercase tracking-[.16em] text-neutral-400">
                    {product.category}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="min-w-0 rounded-[1.5rem] border border-black/10 bg-white p-3 shadow-xl shadow-black/5 sm:rounded-[1.75rem] sm:p-6">
        <div className="flex flex-col gap-5 border-b border-black/10 pb-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex gap-4">
            {selectedProduct ? (
              <span className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream sm:block">
                <Image
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </span>
            ) : null}
            <div>
              <p className="eyebrow text-gold">Custos de produção</p>
              <h1 className="display mt-2 text-4xl leading-none">{selectedProduct?.name}</h1>
              <p className="mt-3 text-sm text-neutral-500">
                Edite materiais, quantidades, preços unitários e margem deste produto.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
            <SummaryCard label="Material" value={currency.format(materialTotal)} />
            <SummaryCard label={`Lucro ${percent.format(toNumber(marginPercent))}%`} value={currency.format(profitValue)} />
            <SummaryCard label="Sugerido" value={saleCurrency.format(suggestedPrice)} highlight />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="block w-full max-w-xs">
            <span className="eyebrow text-neutral-500">Margem de lucro (%)</span>
            <input
              value={marginPercent}
              onChange={(event) => setMarginPercent(event.target.value)}
              inputMode="decimal"
              className="mt-2 h-12 w-full rounded-full border border-black/10 px-4 text-base font-semibold outline-none focus:border-gold focus:ring-4 focus:ring-gold/10"
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={addMaterial}
              className="min-h-12 rounded-full border border-black/10 px-5 text-sm font-bold transition hover:border-gold hover:text-gold"
            >
              + adicionar material
            </button>
            <button
              type="button"
              onClick={saveCost}
              disabled={isSaving || isLoading}
              className="min-h-12 rounded-full bg-ink px-7 text-sm font-bold text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>

        {message ? (
          <p className="mt-4 rounded-2xl border border-black/10 bg-cream px-4 py-3 text-sm text-neutral-700">
            {message}
          </p>
        ) : null}

        <div className="mt-5 space-y-4 md:hidden">
          {rowsWithSubtotal.map((material, index) => (
            <article key={material.localId} className="rounded-2xl border border-black/10 bg-cream p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-500">
                  Material {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeMaterial(material.localId)}
                  aria-label={`Excluir material ${material.name || "sem nome"}`}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-lg transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                <label className="block">
                  <span className="text-[.65rem] font-bold uppercase tracking-[.16em] text-neutral-500">
                    Nome do material
                  </span>
                  <input
                    value={material.name}
                    onChange={(event) => updateMaterial(material.localId, "name", event.target.value)}
                    placeholder="Ex: Couro, zíper, linha..."
                    className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-base outline-none focus:border-gold"
                  />
                </label>

                <label className="block">
                  <span className="text-[.65rem] font-bold uppercase tracking-[.16em] text-neutral-500">
                    Unidade de medida
                  </span>
                  <input
                    value={material.unit}
                    onChange={(event) => updateMaterial(material.localId, "unit", event.target.value)}
                    placeholder="metro, cm, unidade..."
                    className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-base outline-none focus:border-gold"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[.65rem] font-bold uppercase tracking-[.16em] text-neutral-500">
                      Quantidade
                    </span>
                    <input
                      value={material.quantity}
                      onChange={(event) => updateMaterial(material.localId, "quantity", event.target.value)}
                      inputMode="decimal"
                      className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-base outline-none focus:border-gold"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[.65rem] font-bold uppercase tracking-[.16em] text-neutral-500">
                      Preço unit.
                    </span>
                    <input
                      value={material.unitPrice}
                      onChange={(event) => updateMaterial(material.localId, "unitPrice", event.target.value)}
                      inputMode="decimal"
                      className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-base outline-none focus:border-gold"
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-gold/30 bg-white px-4 py-3">
                  <span className="text-[.65rem] font-bold uppercase tracking-[.16em] text-neutral-500">
                    Subtotal
                  </span>
                  <p className="mt-1 text-lg font-bold text-ink">{currency.format(material.subtotal)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-black/10 md:block">
          <table className="min-w-[820px] w-full border-collapse text-sm">
            <thead className="bg-cream text-left text-[.65rem] uppercase tracking-[.16em] text-neutral-500">
              <tr>
                <th className="px-3 py-3">Material</th>
                <th className="px-3 py-3">Unidade</th>
                <th className="px-3 py-3">Quantidade</th>
                <th className="px-3 py-3">Preço unitário</th>
                <th className="px-3 py-3">Subtotal</th>
                <th className="px-3 py-3 text-center">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {rowsWithSubtotal.map((material) => (
                <tr key={material.localId} className="border-t border-black/10">
                  <td className="p-2">
                    <input
                      value={material.name}
                      onChange={(event) => updateMaterial(material.localId, "name", event.target.value)}
                      placeholder="Ex: Couro, zíper, linha..."
                      className="h-11 w-full rounded-xl border border-black/10 px-3 outline-none focus:border-gold"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={material.unit}
                      onChange={(event) => updateMaterial(material.localId, "unit", event.target.value)}
                      placeholder="metro, unidade..."
                      className="h-11 w-full rounded-xl border border-black/10 px-3 outline-none focus:border-gold"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={material.quantity}
                      onChange={(event) => updateMaterial(material.localId, "quantity", event.target.value)}
                      inputMode="decimal"
                      className="h-11 w-full rounded-xl border border-black/10 px-3 outline-none focus:border-gold"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={material.unitPrice}
                      onChange={(event) => updateMaterial(material.localId, "unitPrice", event.target.value)}
                      inputMode="decimal"
                      className="h-11 w-full rounded-xl border border-black/10 px-3 outline-none focus:border-gold"
                    />
                  </td>
                  <td className="p-2 font-semibold">{currency.format(material.subtotal)}</td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeMaterial(material.localId)}
                      aria-label={`Excluir material ${material.name || "sem nome"}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <article className={`rounded-2xl border p-4 ${highlight ? "border-gold bg-ink text-white" : "border-black/10 bg-cream"}`}>
      <p className={`text-[.62rem] font-bold uppercase tracking-[.16em] ${highlight ? "text-gold" : "text-neutral-500"}`}>
        {label}
      </p>
      <p className="mt-2 text-lg font-bold">{value}</p>
    </article>
  );
}
