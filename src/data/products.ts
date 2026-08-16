export type Product = {
  id: string;
  name: string;
  category: "Estojos" | "Necessaires" | "Lancheiras" | "Acessórios" | "Bolsas";
  subcategory?: "Shoulder Bag" | "Max Bag" | "Bag Bella";
  description?: string;
  collection?: string;
  details?: string[];
  features?: string[];
  material?: string;
  dimensions?: string;
  price: number;
  pixPrice: number;
  images: string[];
};

const imageList = (folder: string, count: number, extension = "jpg") =>
  Array.from({ length: count }, (_, index) => `/products/${folder}/${index + 1}.${extension}`);

const imageRange = (folder: string, start: number, end: number, extension = "jpg") =>
  Array.from({ length: end - start + 1 }, (_, index) => `/products/${folder}/${start + index}.${extension}`);

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
  { id: "necessaire-sara-cafe", name: "Necessaire Sara - Café", category: "Necessaires", description: "Dimensões: 20cm x 12cm x 9cm.", price: 75, pixPrice: 69, images: imageList("necessaire-sara-cor-1", 2) },
  { id: "necessaire-sara-preta", name: "Necessaire Sara - Preta", category: "Necessaires", description: "Dimensões: 20cm x 12cm x 9cm.", price: 75, pixPrice: 69, images: imageList("necessaire-sara-cor-2", 2) },
  { id: "necessaire-sara-cafe-matelasse", name: "Necessaire Sara - Café Matelassê", category: "Necessaires", description: "Dimensões: 20cm x 12cm x 9cm.", price: 75, pixPrice: 69, images: imageList("necessaire-sara-cor-3", 2) },
  { id: "necessaire-sara-nude-com-cafe", name: "Necessaire Sara - Nude com Café", category: "Necessaires", description: "Dimensões: 20cm x 12cm x 9cm.", price: 75, pixPrice: 69, images: imageList("necessaire-sara-cor-4", 2) },
  { id: "necessaire-sara-listrada-caramelo", name: "Necessaire Sara - Listrada Caramelo", category: "Necessaires", description: "Dimensões: 20cm x 12cm x 9cm.", price: 75, pixPrice: 69, images: imageList("necessaire-sara-cor-5", 2) },
  { id: "necessaire-sara-listrada-preta", name: "Necessaire Sara - Listrada Preta", category: "Necessaires", description: "Dimensões: 20cm x 12cm x 9cm.", price: 75, pixPrice: 69, images: imageList("necessaire-sara-cor-6", 2) },
  { id: "necessaire-sara-caramelo-matelasse", name: "Necessaire Sara - Caramelo Matelassê", category: "Necessaires", description: "Dimensões: 20cm x 12cm x 9cm.", price: 75, pixPrice: 69, images: imageList("necessaire-sara-cor-7", 1) },
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
  {
    id: "max-bag-caju",
    name: "MAX BAG - Cajú",
    category: "Bolsas",
    subcategory: "Max Bag",
    collection: "Coleção Raízes",
    description: "Coleção Raízes • Veludo • 28 x 40 x 12 cm.",
    details: [
      "Raízes que carregam histórias.",
      "Uma bolsa que traduz o Piauí em cada detalhe.",
      "Confeccionada em tecido veludo, com estampa exclusiva SKAD, inspirada no caju, fruto símbolo da nossa terra, e detalhes bordados à mão, que tornam cada peça ainda mais especial.",
      "Uma peça autoral, feita para quem valoriza elegância, artesanato e orgulho de suas raízes.",
      "SKAD — regionalidade é raiz, o artesanato é memória.",
    ],
    features: [
      "Bolso externo com zíper",
      "1 bolso interno com zíper",
      "2 bolsos internos de acesso rápido",
      "Porta-chaves interno",
      "Acabamento cuidadoso em cada detalhe",
    ],
    material: "Veludo",
    dimensions: "Altura x Largura x Profundidade: 28 x 40 x 12 cm.",
    price: 308,
    pixPrice: 280,
    images: imageList("max-bag-caju", 5, "jpeg"),
  },
  {
    id: "max-bag-revoada-dos-guaras",
    name: "MAX BAG - Revoada dos Guarás",
    category: "Bolsas",
    subcategory: "Max Bag",
    collection: "Coleção Raízes",
    description: "Coleção Raízes • Veludo • 28 x 40 x 12 cm.",
    details: [
      "Há lugares que a gente carrega no coração. E há histórias que escolhemos carregar no corpo.",
      "A nova bolsa da SKAD traz uma estampa exclusiva, inspirada na revoada dos guarás do Delta do Parnaíba, um espetáculo de cores, natureza e identidade piauiense.",
      "Cada detalhe dessa peça foi pensado para celebrar nossas raízes. A estampa ganha ainda mais personalidade com o bordado artesanal, feito para valorizar o trabalho manual e tornar cada bolsa especial.",
    ],
    features: [
      "Fechamento com zíper",
      "Bolso externo com zíper",
      "1 bolso interno com zíper",
      "2 bolsos internos de acesso rápido",
      "Porta-chaves interno",
    ],
    material: "Veludo",
    dimensions: "Tamanho: A 28 x L 40 x P 12 cm.",
    price: 308,
    pixPrice: 280,
    images: imageList("max-bag-revoada-dos-guaras", 5, "jpeg"),
  },
  {
    id: "bag-bella-clara-flor-preta",
    name: "Bag Bella - Clara com Flor Preta",
    category: "Bolsas",
    subcategory: "Bag Bella",
    collection: "Bag Bella",
    description: "Bolsa artesanal • Flor em crochê • PVC sintético • 23 x 33 x 10 cm.",
    details: [
      "Um encontro entre delicadeza, funcionalidade e o fazer artesanal.",
      "A Bag Bella é confeccionada artesanalmente em material sintético à base de PVC. Seu grande destaque é a flor em crochê, feita à mão e aplicada cuidadosamente à bolsa, trazendo textura, personalidade e aquele toque especial que transforma cada peça em única.",
      "Pensada para acompanhar a rotina com praticidade e estilo, ela valoriza o detalhe, o artesanal e uma bolsa que carrega muito mais do que objetos: carrega identidade.",
      "SKAD — regionalidade é raiz, o artesanato é memória.",
    ],
    features: [
      "Alça regulável com fivela",
      "Bolso externo com zíper",
      "Parte interna com 1 bolso com zíper + 2 bolsos de acesso rápido",
      "Fechamento principal com zíper",
      "Flor em crochê feita artesanalmente",
    ],
    material: "Material sintético à base de PVC",
    dimensions: "Tamanho: A 23 cm | L 33 cm | P 10 cm.",
    price: 245,
    pixPrice: 230,
    images: imageRange("bag-bella", 1, 6),
  },
  {
    id: "bag-bella-natural-flor-vinho",
    name: "Bag Bella - Natural com Flor Vinho",
    category: "Bolsas",
    subcategory: "Bag Bella",
    collection: "Bag Bella",
    description: "Bolsa artesanal • Flor em crochê • PVC sintético • 23 x 33 x 10 cm.",
    details: [
      "Um encontro entre delicadeza, funcionalidade e o fazer artesanal.",
      "A Bag Bella é confeccionada artesanalmente em material sintético à base de PVC. Seu grande destaque é a flor em crochê, feita à mão e aplicada cuidadosamente à bolsa, trazendo textura, personalidade e aquele toque especial que transforma cada peça em única.",
      "Pensada para acompanhar a rotina com praticidade e estilo, ela valoriza o detalhe, o artesanal e uma bolsa que carrega muito mais do que objetos: carrega identidade.",
      "SKAD — regionalidade é raiz, o artesanato é memória.",
    ],
    features: [
      "Alça regulável com fivela",
      "Bolso externo com zíper",
      "Parte interna com 1 bolso com zíper + 2 bolsos de acesso rápido",
      "Fechamento principal com zíper",
      "Flor em crochê feita artesanalmente",
    ],
    material: "Material sintético à base de PVC",
    dimensions: "Tamanho: A 23 cm | L 33 cm | P 10 cm.",
    price: 245,
    pixPrice: 230,
    images: imageRange("bag-bella", 7, 12),
  },
];
