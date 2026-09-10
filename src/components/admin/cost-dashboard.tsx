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
  machinePercent: number;
  materials: Array<{
    id: string;
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
};

type ProductForm = {
  id?: string;
  name: string;
  category: string;
  subcategory: string;
  collection: string;
  description: string;
  details: string;
  features: string;
  material: string;
  dimensions: string;
  price: string;
  pixPrice: string;
  keepImages: string[];
  newImages: string[];
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

const categoryOptions = [
  "Bolsas",
  "Necessaires",
  "Porta-Garrafa de até 1,2L",
  "Lancheiras",
  "Estojos",
];

const subcategoryOptions = [
  "Shoulder Bag",
  "Max Bag",
  "Bag Bella",
  "Bag Easy",
  "Bag Boho",
  "Bag Hexa",
  "Bolsa Baguete",
  "Crossbody",
  "Bordado",
  "Pintado à Mão",
  "Lisos",
];

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

const emptyProductForm = (): ProductForm => ({
  name: "",
  category: "Bolsas",
  subcategory: "",
  collection: "",
  description: "",
  details: "",
  features: "",
  material: "",
  dimensions: "",
  price: "",
  pixPrice: "",
  keepImages: [],
  newImages: [],
});

const toNumber = (value: string) => {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const fromNumber = (value: number) =>
  Number.isInteger(value) ? String(value) : String(value).replace(".", ",");

const textFromList = (items?: string[]) => items?.join("\n") ?? "";
const imageIdFromUrl = (url: string) => url.split("/").filter(Boolean).at(-1) ?? url;

function productToForm(product: Product): ProductForm {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory ?? "",
    collection: product.collection ?? "",
    description: product.description ?? "",
    details: textFromList(product.details),
    features: textFromList(product.features),
    material: product.material ?? "",
    dimensions: product.dimensions ?? "",
    price: typeof product.price === "number" ? fromNumber(product.price) : "",
    pixPrice: typeof product.pixPrice === "number" ? fromNumber(product.pixPrice) : "",
    keepImages: product.images,
    newImages: [],
  };
}

async function fileToCompressedDataUrl(file: File) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = document.createElement("img");
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = URL.createObjectURL(file);
  });

  const maxSide = 1400;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Não foi possível preparar a foto.");

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(image.src);

  return canvas.toDataURL("image/jpeg", 0.82);
}

export function CostDashboard({ products }: { products: Product[] }) {
  const [catalogProducts, setCatalogProducts] = useState(products);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"costs" | "product">("costs");
  const [marginPercent, setMarginPercent] = useState("0");
  const [machinePercent, setMachinePercent] = useState("0");
  const [materials, setMaterials] = useState<MaterialRow[]>([emptyRow()]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm());
  const [productMessage, setProductMessage] = useState("");
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const selectedProduct =
    catalogProducts.find((product) => product.id === selectedProductId) ?? catalogProducts[0];
  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return catalogProducts;
    return catalogProducts.filter((product) => product.name.toLowerCase().includes(term));
  }, [catalogProducts, query]);

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
  const pixPrice = materialTotal + profitValue;
  const cardFeeValue = pixPrice * (toNumber(machinePercent) / 100);
  const cardPrice = pixPrice + cardFeeValue;

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
        setMachinePercent(fromNumber(data.machinePercent));
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
          setMachinePercent("0");
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

  function selectProduct(productId: string) {
    setSelectedProductId(productId);
    if (tab === "product") {
      const product = catalogProducts.find((item) => item.id === productId);
      setProductForm(product?.editable ? productToForm(product) : emptyProductForm());
      setProductMessage(
        product?.editable
          ? ""
          : "Este produto antigo é editado pelo código. Use esta aba para cadastrar novos produtos.",
      );
    }
  }

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
          machinePercent: toNumber(machinePercent),
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
      setMachinePercent(fromNumber(data.machinePercent));
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

  function updateProductForm(field: keyof ProductForm, value: string) {
    setProductForm((current) => ({ ...current, [field]: value }));
  }

  async function addProductImages(files: FileList | null) {
    if (!files?.length) return;
    setProductMessage("Preparando fotos...");

    try {
      const compressed = await Promise.all(Array.from(files).map(fileToCompressedDataUrl));
      setProductForm((current) => ({
        ...current,
        newImages: [...current.newImages, ...compressed].slice(0, 12),
      }));
      setProductMessage("Fotos preparadas. Clique em salvar para publicar.");
    } catch {
      setProductMessage("Erro ao preparar uma das fotos. Tente outra imagem.");
    }
  }

  function removeProductImage(url: string, type: "kept" | "new") {
    setProductForm((current) =>
      type === "kept"
        ? { ...current, keepImages: current.keepImages.filter((image) => image !== url) }
        : { ...current, newImages: current.newImages.filter((image) => image !== url) },
    );
  }

  function startNewProduct() {
    setTab("product");
    setProductForm(emptyProductForm());
    setProductMessage("Preencha os dados e envie pelo menos uma foto.");
  }

  function openProductTab() {
    setTab("product");
    if (selectedProduct?.editable) {
      setProductForm(productToForm(selectedProduct));
      setProductMessage("");
    } else {
      setProductForm(emptyProductForm());
      setProductMessage("Preencha os dados e envie pelo menos uma foto.");
    }
  }

  async function saveProduct() {
    setIsSavingProduct(true);
    setProductMessage("");

    try {
      const isEditing = Boolean(productForm.id && selectedProduct?.editable);
      const endpoint = isEditing ? `/api/admin/products/${productForm.id}` : "/api/admin/products";
      const payload = {
        name: productForm.name,
        category: productForm.category,
        subcategory: productForm.subcategory,
        collection: productForm.collection,
        description: productForm.description,
        details: productForm.details,
        features: productForm.features,
        material: productForm.material,
        dimensions: productForm.dimensions,
        price: productForm.price.trim() ? toNumber(productForm.price) : null,
        pixPrice: productForm.pixPrice.trim() ? toNumber(productForm.pixPrice) : null,
        keepImageIds: productForm.keepImages.map(imageIdFromUrl),
        images: productForm.newImages,
      };

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { product?: Product; error?: string };

      if (!response.ok || !data.product) {
        throw new Error(data.error || "Não foi possível salvar o produto.");
      }

      setCatalogProducts((current) => {
        const nextProduct = data.product!;
        const exists = current.some((product) => product.id === nextProduct.id);
        return exists
          ? current.map((product) => (product.id === nextProduct.id ? nextProduct : product))
          : [...current, nextProduct];
      });
      setSelectedProductId(data.product.id);
      setProductForm(productToForm(data.product));
      setProductMessage(isEditing ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
    } catch (error) {
      setProductMessage(error instanceof Error ? error.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setIsSavingProduct(false);
    }
  }

  return (
    <div className="mt-8 grid min-w-0 gap-5 sm:mt-10 lg:grid-cols-[20rem_1fr] lg:gap-6">
      <aside className="rounded-[1.75rem] border border-black/10 bg-white p-4 shadow-xl shadow-black/5">
        <div className="sticky top-24">
          <button
            type="button"
            onClick={startNewProduct}
            className="mb-4 min-h-12 w-full rounded-full bg-ink px-4 text-sm font-bold text-white transition hover:bg-gold"
          >
            + cadastrar produto
          </button>

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
                onClick={() => selectProduct(product.id)}
                className={`flex min-h-20 w-full items-center gap-3 rounded-2xl border p-2 text-left transition ${
                  product.id === selectedProductId
                    ? "border-gold bg-gold/10"
                    : "border-black/10 hover:border-gold/60"
                }`}
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                </span>
                <span>
                  <span className="block text-sm font-semibold leading-snug">{product.name}</span>
                  <span className="mt-1 block text-[.65rem] uppercase tracking-[.16em] text-neutral-400">
                    {product.subcategory || product.category}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="min-w-0 rounded-[1.5rem] border border-black/10 bg-white p-3 shadow-xl shadow-black/5 sm:rounded-[1.75rem] sm:p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("costs")}
            className={`min-h-11 rounded-full border px-5 text-xs font-bold uppercase tracking-[.16em] ${
              tab === "costs" ? "border-ink bg-ink text-white" : "border-black/10"
            }`}
          >
            Custos
          </button>
          <button
            type="button"
            onClick={openProductTab}
            className={`min-h-11 rounded-full border px-5 text-xs font-bold uppercase tracking-[.16em] ${
              tab === "product" ? "border-gold bg-gold text-white" : "border-black/10"
            }`}
          >
            Cadastrar produto
          </button>
        </div>

        {tab === "product" ? (
          <ProductEditor
            form={productForm}
            selectedProduct={selectedProduct}
            isSaving={isSavingProduct}
            message={productMessage}
            onChange={updateProductForm}
            onAddImages={addProductImages}
            onRemoveImage={removeProductImage}
            onNew={startNewProduct}
            onSave={saveProduct}
          />
        ) : (
          <CostEditor
            selectedProduct={selectedProduct}
            isLoading={isLoading}
            isSaving={isSaving}
            message={message}
            marginPercent={marginPercent}
            machinePercent={machinePercent}
            rowsWithSubtotal={rowsWithSubtotal}
            materialTotal={materialTotal}
            profitValue={profitValue}
            pixPrice={pixPrice}
            cardPrice={cardPrice}
            onMarginChange={setMarginPercent}
            onMachineChange={setMachinePercent}
            onAddMaterial={addMaterial}
            onRemoveMaterial={removeMaterial}
            onUpdateMaterial={updateMaterial}
            onSave={saveCost}
          />
        )}
      </section>
    </div>
  );
}

function ProductEditor({
  form,
  selectedProduct,
  isSaving,
  message,
  onChange,
  onAddImages,
  onRemoveImage,
  onNew,
  onSave,
}: {
  form: ProductForm;
  selectedProduct?: Product;
  isSaving: boolean;
  message: string;
  onChange: (field: keyof ProductForm, value: string) => void;
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (url: string, type: "kept" | "new") => void;
  onNew: () => void;
  onSave: () => void;
}) {
  const isEditing = Boolean(form.id && selectedProduct?.editable);

  return (
    <div>
      <div className="border-b border-black/10 pb-5">
        <p className="eyebrow text-gold">{isEditing ? "Editar produto cadastrado" : "Novo produto"}</p>
        <h1 className="display mt-2 text-3xl leading-tight sm:text-4xl">
          {isEditing ? form.name || "Editar produto" : "Cadastrar produto no catálogo"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
          Preencha nome, categoria, descrição, valores e fotos. Ao salvar, o produto aparece no catálogo público.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <TextInput label="Nome do produto" value={form.name} onChange={(value) => onChange("name", value)} placeholder="Ex: Max Bag P" />
        <SelectInput label="Categoria" value={form.category} options={categoryOptions} onChange={(value) => onChange("category", value)} />
        <SelectInput label="Subcategoria" value={form.subcategory} options={subcategoryOptions} onChange={(value) => onChange("subcategory", value)} allowEmpty />
        <TextInput label="Coleção" value={form.collection} onChange={(value) => onChange("collection", value)} placeholder="Ex: Coleção Raízes" />
        <TextInput label="Material" value={form.material} onChange={(value) => onChange("material", value)} placeholder="Ex: Tecido" />
        <TextInput label="Medidas" value={form.dimensions} onChange={(value) => onChange("dimensions", value)} placeholder="Ex: Tamanho: 39cm x 21cm x 7cm." />
        <TextInput label="Preço cartão" value={form.price} onChange={(value) => onChange("price", value)} placeholder="177" inputMode="decimal" />
        <TextInput label="Preço Pix" value={form.pixPrice} onChange={(value) => onChange("pixPrice", value)} placeholder="161" inputMode="decimal" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <TextArea label="Subtítulo do card" value={form.description} onChange={(value) => onChange("description", value)} placeholder="Tecido • 39 x 21 x 7 cm." />
        <TextArea label="Descrição completa" value={form.details} onChange={(value) => onChange("details", value)} placeholder="Uma frase por linha. Aparece quando abre a foto do produto." />
        <TextArea label="Características" value={form.features} onChange={(value) => onChange("features", value)} placeholder={"1 bolso externo com zíper\n2 bolsos internos de acesso rápido"} />
      </div>

      <div className="mt-5 rounded-2xl border border-black/10 bg-cream p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow text-neutral-500">Fotos</p>
            <p className="mt-2 text-sm text-neutral-500">A primeira foto será a capa. Use até 12 fotos.</p>
          </div>
          <label className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-bold transition hover:border-gold hover:text-gold">
            Subir fotos
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => onAddImages(event.target.files)} />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {form.keepImages.map((image, index) => (
            <ImagePreview key={image} image={image} index={index} onRemove={() => onRemoveImage(image, "kept")} />
          ))}
          {form.newImages.map((image, index) => (
            <ImagePreview
              key={image}
              image={image}
              index={form.keepImages.length + index}
              onRemove={() => onRemoveImage(image, "new")}
            />
          ))}
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-2xl border border-black/10 bg-cream px-4 py-3 text-sm text-neutral-700">
          {message}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onNew}
          className="min-h-12 rounded-full border border-black/10 px-5 text-sm font-bold transition hover:border-gold hover:text-gold"
        >
          Limpar / novo
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="min-h-12 rounded-full bg-ink px-7 text-sm font-bold text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar produto"}
        </button>
      </div>
    </div>
  );
}

function CostEditor({
  selectedProduct,
  isLoading,
  isSaving,
  message,
  marginPercent,
  machinePercent,
  rowsWithSubtotal,
  materialTotal,
  profitValue,
  pixPrice,
  cardPrice,
  onMarginChange,
  onMachineChange,
  onAddMaterial,
  onRemoveMaterial,
  onUpdateMaterial,
  onSave,
}: {
  selectedProduct?: Product;
  isLoading: boolean;
  isSaving: boolean;
  message: string;
  marginPercent: string;
  machinePercent: string;
  rowsWithSubtotal: Array<MaterialRow & { subtotal: number }>;
  materialTotal: number;
  profitValue: number;
  pixPrice: number;
  cardPrice: number;
  onMarginChange: (value: string) => void;
  onMachineChange: (value: string) => void;
  onAddMaterial: () => void;
  onRemoveMaterial: (localId: string) => void;
  onUpdateMaterial: (localId: string, field: keyof Omit<MaterialRow, "localId" | "id">, value: string) => void;
  onSave: () => void;
}) {
  return (
    <div>
      <div className="grid min-w-0 gap-5 border-b border-black/10 pb-5">
        <div className="flex min-w-0 gap-4">
          {selectedProduct ? (
            <span className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream sm:block">
              <Image src={selectedProduct.images[0]} alt={selectedProduct.name} fill sizes="96px" className="object-cover" />
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="eyebrow text-gold">Custos de produção</p>
            <h1 className="display mt-2 text-3xl leading-tight sm:text-4xl">{selectedProduct?.name}</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
              Edite materiais, quantidades, preços unitários e margem deste produto.
            </p>
          </div>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Custo" value={currency.format(materialTotal)} />
          <SummaryCard label={`Lucro ${percent.format(toNumber(marginPercent))}%`} value={currency.format(profitValue)} />
          <SummaryCard label="Preço Pix" value={saleCurrency.format(pixPrice)} highlight />
          <SummaryCard label="Preço Cartão" value={saleCurrency.format(cardPrice)} note={`${percent.format(toNumber(machinePercent))}% maquininha`} highlight />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <TextInput label="Margem de lucro (%)" value={marginPercent} onChange={onMarginChange} inputMode="decimal" />
          <TextInput label="% maquininha" value={machinePercent} onChange={onMachineChange} inputMode="decimal" />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={onAddMaterial} className="min-h-12 rounded-full border border-black/10 px-5 text-sm font-bold transition hover:border-gold hover:text-gold">
            + adicionar material
          </button>
          <button type="button" onClick={onSave} disabled={isSaving || isLoading} className="min-h-12 rounded-full bg-ink px-7 text-sm font-bold text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {message ? <p className="mt-4 rounded-2xl border border-black/10 bg-cream px-4 py-3 text-sm text-neutral-700">{message}</p> : null}

      <div className="mt-5 space-y-4 md:hidden">
        {rowsWithSubtotal.map((material, index) => (
          <article key={material.localId} className="rounded-2xl border border-black/10 bg-cream p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-500">Material {index + 1}</p>
              <button type="button" onClick={() => onRemoveMaterial(material.localId)} aria-label={`Excluir material ${material.name || "sem nome"}`} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-lg transition hover:border-red-300 hover:bg-red-50 hover:text-red-600">
                ×
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <TextInput label="Nome do material" value={material.name} onChange={(value) => onUpdateMaterial(material.localId, "name", value)} placeholder="Ex: Couro, zíper, linha..." />
              <TextInput label="Unidade de medida" value={material.unit} onChange={(value) => onUpdateMaterial(material.localId, "unit", value)} placeholder="metro, cm, unidade..." />
              <div className="grid grid-cols-2 gap-3">
                <TextInput label="Quantidade" value={material.quantity} onChange={(value) => onUpdateMaterial(material.localId, "quantity", value)} inputMode="decimal" />
                <TextInput label="Preço unit." value={material.unitPrice} onChange={(value) => onUpdateMaterial(material.localId, "unitPrice", value)} inputMode="decimal" />
              </div>
              <div className="rounded-xl border border-gold/30 bg-white px-4 py-3">
                <span className="text-[.65rem] font-bold uppercase tracking-[.16em] text-neutral-500">Subtotal</span>
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
                <td className="p-2"><TableInput value={material.name} onChange={(value) => onUpdateMaterial(material.localId, "name", value)} placeholder="Ex: Couro, zíper, linha..." /></td>
                <td className="p-2"><TableInput value={material.unit} onChange={(value) => onUpdateMaterial(material.localId, "unit", value)} placeholder="metro, unidade..." /></td>
                <td className="p-2"><TableInput value={material.quantity} onChange={(value) => onUpdateMaterial(material.localId, "quantity", value)} inputMode="decimal" /></td>
                <td className="p-2"><TableInput value={material.unitPrice} onChange={(value) => onUpdateMaterial(material.localId, "unitPrice", value)} inputMode="decimal" /></td>
                <td className="p-2 font-semibold">{currency.format(material.subtotal)}</td>
                <td className="p-2 text-center">
                  <button type="button" onClick={() => onRemoveMaterial(material.localId)} aria-label={`Excluir material ${material.name || "sem nome"}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg transition hover:border-red-300 hover:bg-red-50 hover:text-red-600">
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "decimal" | "text";
}) {
  return (
    <label className="block">
      <span className="text-[.65rem] font-bold uppercase tracking-[.16em] text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-base outline-none focus:border-gold"
      />
    </label>
  );
}

function TableInput({
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "decimal" | "text";
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      className="h-11 w-full rounded-xl border border-black/10 px-3 outline-none focus:border-gold"
    />
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
  allowEmpty = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  allowEmpty?: boolean;
}) {
  const listId = `${label.toLowerCase().replace(/\s+/g, "-")}-options`;

  return (
    <label className="block">
      <span className="text-[.65rem] font-bold uppercase tracking-[.16em] text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        list={listId}
        placeholder={allowEmpty ? "Opcional" : undefined}
        className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-base outline-none focus:border-gold"
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[.65rem] font-bold uppercase tracking-[.16em] text-neutral-500">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-base leading-6 outline-none focus:border-gold"
      />
    </label>
  );
}

function ImagePreview({
  image,
  index,
  onRemove,
}: {
  image: string;
  index: number;
  onRemove: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={`Foto ${index + 1}`} className="aspect-square w-full object-cover" />
      <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-1 text-[.65rem] font-bold text-white">
        {index === 0 ? "Capa" : `Foto ${index + 1}`}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow"
        aria-label={`Remover foto ${index + 1}`}
      >
        ×
      </button>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  note,
  highlight = false,
}: {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <article className={`min-w-0 rounded-2xl border p-4 shadow-sm ${highlight ? "border-gold bg-ink text-white" : "border-black/10 bg-cream"}`}>
      <p className={`truncate text-[.62rem] font-bold uppercase tracking-[.14em] ${highlight ? "text-gold" : "text-neutral-500"}`}>
        {label}
      </p>
      {note ? (
        <p className={`mt-1 truncate text-[.6rem] font-bold uppercase tracking-[.12em] ${highlight ? "text-white/55" : "text-neutral-400"}`}>
          {note}
        </p>
      ) : null}
      <p className="mt-2 whitespace-nowrap text-lg font-bold">{value}</p>
    </article>
  );
}
