"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Login ou senha inválidos.");
      return;
    }

    router.replace(result?.url || callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block">
        <span className="eyebrow text-neutral-500">Login</span>
        <input
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          autoComplete="username"
          className="mt-2 h-14 w-full rounded-full border border-black/10 bg-white px-5 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
          placeholder="Digite seu login"
          required
        />
      </label>

      <label className="block">
        <span className="eyebrow text-neutral-500">Senha</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          className="mt-2 h-14 w-full rounded-full border border-black/10 bg-white px-5 text-base text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
          placeholder="Digite sua senha"
          required
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="h-14 w-full rounded-full bg-ink px-6 text-sm font-bold uppercase tracking-[.22em] text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
