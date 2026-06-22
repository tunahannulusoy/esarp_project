"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updatePassword, type AuthFormState } from "@/app/actions/auth";

const baslangicState: AuthFormState = { success: false };

export default function ResetPasswordConfirmPage() {
  const [state, formAction, pending] = useActionState(updatePassword, baslangicState);

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-stone-900">Yeni Şifre Belirle</h1>
      <p className="mt-2 text-sm text-stone-600">Hesabınız için yeni bir şifre girin.</p>

      {state.message && (
        <p
          className={`mt-4 rounded-lg px-4 py-2 text-sm ${
            state.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {state.message}
        </p>
      )}

      {state.success ? (
        <Link
          href="/"
          className="mt-6 block w-full rounded-lg bg-stone-900 py-2.5 text-center text-sm font-medium text-white hover:bg-stone-700"
        >
          Ana Sayfaya Dön
        </Link>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Yeni Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="passwordTekrar" className="block text-sm font-medium text-stone-700">
              Yeni Şifre (Tekrar)
            </label>
            <input
              id="passwordTekrar"
              name="passwordTekrar"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            {pending ? "Kaydediliyor..." : "Şifreyi Güncelle"}
          </button>
        </form>
      )}
    </div>
  );
}
