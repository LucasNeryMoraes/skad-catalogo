import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/logout-button";
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
    <main className="min-h-screen bg-cream px-5 py-8 text-ink">
      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-3xl font-semibold tracking-[.35em]">SKAD</p>
            <p className="eyebrow mt-4 text-gold">Área administrativa</p>
          </div>
          <LogoutButton />
        </header>

        <div className="mt-10 rounded-[2rem] border border-black/10 bg-white p-7 shadow-xl shadow-black/5 sm:p-10">
          <p className="eyebrow text-neutral-500">Bem-vinda</p>
          <h1 className="display mt-3 text-4xl leading-tight sm:text-6xl">
            Painel administrativo
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600">
            Login ativo como{" "}
            <span className="font-semibold text-ink">
              {session.user?.username || session.user?.name}
            </span>
            . A estrutura segura do admin já está pronta para receber as próximas
            telas, incluindo custos, produtos e futuros usuários administradores.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Usuários", "Banco preparado para múltiplos administradores."],
              ["Custos", "Pronto para criarmos a próxima área de dados."],
              ["Catálogo", "Base pronta para futuras ferramentas internas."],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-3xl border border-black/10 bg-cream p-6"
              >
                <h2 className="display text-3xl">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
