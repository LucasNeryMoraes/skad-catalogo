import { Catalog } from "@/components/catalog";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { products } from "@/data/products";

export default function Home() {
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
