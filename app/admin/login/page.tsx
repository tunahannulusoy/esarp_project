"use client";

import { useActionState } from "react";
import { adminSignIn, type AuthFormState } from "@/app/actions/auth";

const baslangicState: AuthFormState = { success: false };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminSignIn, baslangicState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-center text-2xl font-bold text-stone-900">Eşarp Admin</h1>

        {state.message && (
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
              placeholder="ornek@email.com"
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
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
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "Giriş yapılıyor..." : "Admin Paneline Giriş Yap"}
          </button>
        </form>


      </div>
    </div>
  );
}
