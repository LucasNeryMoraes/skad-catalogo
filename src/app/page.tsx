import { Catalog } from "@/components/catalog";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getCatalogProducts } from "@/lib/catalog-pricing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getCatalogProducts();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog products={products} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
