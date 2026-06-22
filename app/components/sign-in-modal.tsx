"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { X } from "lucide-react";
import { signIn, type AuthFormState } from "@/app/actions/auth";

const baslangicState: AuthFormState = { success: false };

export default function SignInModal({
  acik,
  onKapat,
  hedefYol = "/checkout",
}: {
  acik: boolean;
  onKapat: () => void;
  hedefYol?: string;
}) {
  const [state, formAction, pending] = useActionState(signIn, baslangicState);

  useEffect(() => {
    if (!acik) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onKapat();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [acik, onKapat]);

  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Kapat"
        className="absolute inset-0 bg-black/40"
        onClick={onKapat}
      />

      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onKapat}
          aria-label="Kapat"
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-700"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <h2 className="text-lg font-semibold text-stone-900">Sipariş Vermek İçin Giriş Yapın</h2>
        <p className="mt-1 text-sm text-stone-600">
          Devam etmek için hesabınıza giriş yapmanız gerekiyor.
        </p>

        {state.message && !state.success && (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">{state.message}</p>
        )}

        <form action={formAction} className="mt-4 space-y-3">
          <input type="hidden" name="next" value={hedefYol} />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Şifre"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-stone-600">
          Hesabınız yok mu?{" "}
          <Link href="/auth/signup" className="font-medium text-stone-900 hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
