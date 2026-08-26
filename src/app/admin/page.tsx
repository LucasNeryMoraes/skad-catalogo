import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CostDashboard } from "@/components/admin/cost-dashboard";
import { LogoutButton } from "@/components/admin/logout-button";
import { products } from "@/data/products";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Admin | SKAD",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-cream px-3 py-6 text-ink sm:px-5 sm:py-8">
      <section className="mx-auto max-w-6xl min-w-0">
        <header className="flex flex-col gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-semibold tracking-[.35em]">SKAD</p>
            <p className="eyebrow mt-4 text-gold">Área administrativa</p>
          </div>
          <LogoutButton />
        </header>

        <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-xl shadow-black/5 sm:mt-10 sm:rounded-[2rem] sm:p-10">
          <p className="eyebrow text-neutral-500">Bem-vinda</p>
          <h1 className="display mt-3 text-4xl leading-tight sm:text-6xl">
            Custos de produção
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600">
            Login ativo como{" "}
            <span className="font-semibold text-ink">
              {session.user?.username || session.user?.name}
            </span>
            . Selecione um produto, edite os materiais usados e salve os custos
            de produção no banco.
          </p>
        </div>

        <CostDashboard products={products} />
      </section>
    </main>
  );
}
