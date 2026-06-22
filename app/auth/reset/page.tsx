"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword, type AuthFormState } from "@/app/actions/auth";

const baslangicState: AuthFormState = { success: false };

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, baslangicState);

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-stone-900">Şifremi Unuttum</h1>
      <p className="mt-2 text-sm text-stone-600">
        Email adresinizi girin, şifre sıfırlama linki gönderelim. Link 24 saat geçerlidir.
      </p>

      {state.message && (
        <p
          className={`mt-4 rounded-lg px-4 py-2 text-sm ${
            state.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {pending ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        <Link href="/auth/login" className="font-medium text-stone-900 hover:underline">
          Giriş sayfasına dön
        </Link>
      </p>
    </div>
  );
}
