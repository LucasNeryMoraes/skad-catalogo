export type Product = {
  id: string;
  name: string;
  category: "Estojos" | "Necessaires" | "Lancheiras" | "Acessórios" | "Bolsas";
  subcategory?: "Shoulder Bag";
  description?: string;
  price: number;
  pixPrice: number;
  images: string[];
};

const imageList = (folder: string, count: number, extension = "jpg") =>
  Array.from({ length: count }, (_, index) => `/products/${folder}/${index + 1}.${extension}`);

export const products: Product[] = [
  { id: "estojo-palito", name: "Estojo Palito", category: "Estojos", price: 45, pixPrice: 40, images: imageList("estojo-palito", 2) },
  { id: "necessaire-basic", name: "Necessaire Basic", category: "Necessaires", price: 55, pixPrice: 50, images: imageList("necessaire-basic", 2) },
  { id: "necessaire-boca-de-lobo", name: "Necessaire Boca de Lobo", category: "Necessaires", price: 78.4, pixPrice: 70, images: imageList("necessaire-boca-de-lobo", 3) },
  { id: "necessaire-boss", name: "Necessaire Boss", category: "Necessaires", price: 90, pixPrice: 80, images: imageList("necessaire-boss", 2) },
  { id: "necessaire-box-supreme", name: "Necessaire Box Suprême", category: "Necessaires", price: 187, pixPrice: 170, images: imageList("necessaire-box-supreme", 6) },
  { id: "necessaire-carnauba-1", name: "Necessaire Carnaúba", category: "Necessaires", price: 132, pixPrice: 120, images: imageList("necessaire-carnauba-1", 3) },
  { id: "necessaire-carnauba-2", name: "Necessaire Carnaúba", category: "Necessaires", price: 132, pixPrice: 120, images: imageList("necessaire-carnauba-2", 3) },
  { id: "necessaire-classica", name: "Necessaire Clássica", category: "Necessaires", price: 110, pixPrice: 100, images: imageList("necessaire-classica", 2) },
  { id: "necessaire-cursiva", name: "Necessaire Cursiva", category: "Necessaires", price: 85, pixPrice: 75, images: imageList("necessaire-cursiva", 2) },
  { id: "necessaire-estetoscopio", name: "Necessaire Estetoscópio", category: "Necessaires", price: 195, pixPrice: 180, images: imageList("necessaire-estetoscopio", 4) },
  { id: "necessaire-man", name: "Necessaire Man", category: "Necessaires", price: 125, pixPrice: 110, images: imageList("necessaire-man", 2) },
  { id: "necessaire-mom-bag", name: "Necessaire Mom Bag", category: "Necessaires", price: 135, pixPrice: 120, images: imageList("necessaire-mom-bag", 4) },
  { id: "necessaire-puff", name: "Necessaire Puff", category: "Necessaires", price: 65, pixPrice: 60, images: imageList("necessaire-puff", 2) },
  { id: "necessaire-urbana", name: "Necessaire Urbana", category: "Necessaires", price: 125, pixPrice: 115, images: imageList("necessaire-urbana", 4, "jpeg") },
  { id: "lancheira-termica-2-compartimentos", name: "Lancheira Térmica com 2 Compartimentos", category: "Lancheiras", price: 195, pixPrice: 180, images: imageList("lancheira-termica-2-compartimentos", 5) },
  { id: "porta-garrafa-12l", name: "Porta-Garrafa para Garrafas de até 1,2 L", category: "Acessórios", description: "Pintado à mão.", price: 130, pixPrice: 125, images: imageList("porta-garrafa-12l", 15) },
  { id: "shoulder-bag-bordada-pedrarias", name: "Shoulder Bag Bordada com Pedrarias", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 135, pixPrice: 125, images: imageList("shoulder-bag-bordada-pedrarias", 3) },
  { id: "shoulder-bag-bordada-micangas", name: "Shoulder Bag Bordada com Miçangas", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 135, pixPrice: 125, images: imageList("shoulder-bag-bordada-micangas", 4) },
  { id: "shoulder-bag-piauiense-serra-da-capivara-1", name: "Shoulder Bag com Estampas Piauienses - Serra da Capivara", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-serra-da-capivara-1", 3) },
  { id: "shoulder-bag-piauiense-caju-1", name: "Shoulder Bag com Estampas Piauienses - Caju", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-caju-1", 2) },
  { id: "shoulder-bag-piauiense-caju-2", name: "Shoulder Bag com Estampas Piauienses - Caju", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-caju-2", 3) },
  { id: "shoulder-bag-piauiense-serra-da-capivara-2", name: "Shoulder Bag com Estampas Piauienses - Serra da Capivara", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-serra-da-capivara-2", 3) },
  { id: "shoulder-bag-piauiense-caju-3", name: "Shoulder Bag com Estampas Piauienses - Caju", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-caju-3", 4) },
  { id: "shoulder-bag-piauiense-caju-4", name: "Shoulder Bag com Estampas Piauienses - Caju", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-caju-4", 4) },
  { id: "shoulder-bag-piauiense-caju-5", name: "Shoulder Bag com Estampas Piauienses - Caju", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-caju-5", 4) },
  { id: "shoulder-bag-piauiense-caju-6", name: "Shoulder Bag com Estampas Piauienses - Caju", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-caju-6", 3) },
  { id: "shoulder-bag-piauiense-guara", name: "Shoulder Bag com Estampas Piauienses - Guará", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-guara", 3) },
  { id: "shoulder-bag-piauiense-guara-2", name: "Shoulder Bag com Estampas Piauienses - Guará", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-guara-2", 3) },
  { id: "shoulder-bag-piauiense-revoada-guaras-delta-parnaiba", name: "Shoulder Bag com Estampas Piauienses - Revoada dos Guarás no Delta do Parnaíba", category: "Bolsas", subcategory: "Shoulder Bag", description: "Tamanho: C- 15cm, A- 19,5cm e L- 5,5cm.", price: 125, pixPrice: 115, images: imageList("shoulder-bag-piauiense-revoada-guaras-delta-parnaiba", 3) },
];
