"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthFormState } from "@/app/actions/auth";

const baslangicState: AuthFormState = { success: false };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, baslangicState);

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-stone-900">Giriş Yap</h1>

      {state.message && !state.success && (
        <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">{state.message}</p>
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
          {state.errors?.email && (
            <p className="mt-1 text-xs text-rose-600">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
          {state.errors?.password && (
            <p className="mt-1 text-xs text-rose-600">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-stone-600">
            <input type="checkbox" name="remember" className="rounded border-stone-300" />
            Beni Hatırla
          </label>
          <Link href="/auth/reset" className="text-stone-600 hover:underline">
            Şifremi Unuttum
          </Link>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        Hesabınız yok mu?{" "}
        <Link href="/auth/signup" className="font-medium text-stone-900 hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}
