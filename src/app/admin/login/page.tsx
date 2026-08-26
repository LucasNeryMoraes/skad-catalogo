import { Suspense } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Login Admin | SKAD",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-10 text-ink">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-2xl shadow-black/10 md:grid-cols-[.9fr_1fr]">
          <div className="hidden bg-ink p-10 text-white md:flex md:flex-col md:justify-between">
            <p className="text-4xl font-semibold tracking-[.35em]">SKAD</p>
            <div>
              <p className="eyebrow text-gold">Área administrativa</p>
              <h1 className="display mt-4 text-5xl leading-none">
                Gestão privada do catálogo.
              </h1>
              <p className="mt-5 text-sm leading-7 text-white/65">
                Acesso reservado para administradores autorizados da SKAD.
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-3xl font-semibold tracking-[.35em] md:hidden">SKAD</p>
              <Link
                href="/#catalogo"
                className="ml-auto rounded-full border border-black/10 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-ink transition hover:border-gold hover:bg-gold hover:text-white"
              >
                Voltar ao catálogo
              </Link>
            </div>
            <p className="eyebrow mt-8 text-gold md:mt-0">Login seguro</p>
            <h2 className="display mt-3 text-4xl leading-tight sm:text-5xl">
              Entrar no admin
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
              Use seu login e senha de administrador para continuar.
            </p>
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
