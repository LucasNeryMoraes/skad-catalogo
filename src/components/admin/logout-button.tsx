"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-full border border-black/10 px-5 py-3 text-xs font-bold uppercase tracking-[.2em] text-ink transition hover:border-gold hover:text-gold"
    >
      Sair
    </button>
  );
}
