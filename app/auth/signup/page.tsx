"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signUp, type AuthFormState } from "@/app/actions/auth";
import { dogrulamaKoduGonder, dogrulamaKoduKontrolEt } from "@/app/actions/email-verification";
import { signUpSchema } from "@/app/lib/validation";

type Adim = "email" | "kod" | "sifre";

export default function SignUpPage() {
  const router = useRouter();
  const [adim, setAdim] = useState<Adim>("email");
  const [email, setEmail] = useState("");
  const [kod, setKod] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [basari, setBasari] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const emailGonder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata(null);
    if (!email.includes("@")) {
      setHata("Geçerli bir email girin");
      return;
    }
    startTransition(async () => {
      const sonuc = await dogrulamaKoduGonder(email);
      if (sonuc.success) {
        setAdim("kod");
      } else {
        setHata(sonuc.message);
      }
    });
  };

  const koduDogrula = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata(null);
    startTransition(async () => {
      const sonuc = await dogrulamaKoduKontrolEt(email, kod);
      if (sonuc.success) {
        setAdim("sifre");
      } else {
        setHata(sonuc.message ?? "Doğrulama başarısız");
      }
    });
  };

  const sifreBelirle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const passwordTekrar = formData.get("passwordTekrar");

    if (password !== passwordTekrar) {
      setHata("Şifreler eşleşmiyor");
      return;
    }

    const parsed = signUpSchema.safeParse({ email, password });
    if (!parsed.success) {
      setHata(parsed.error.issues[0]?.message ?? "Şifre geçersiz");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.set("email", email);
      fd.set("password", password as string);
      const state: AuthFormState = await signUp({ success: false }, fd);
      if (state.success) {
        setBasari(state.message ?? "Kayıt başarılı");
        setTimeout(() => router.push("/auth/login"), 1500);
      } else {
        setHata(state.message ?? "Kayıt başarısız");
      }
    });
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-stone-900">Kayıt Ol</h1>

      <div className="mt-2 flex gap-1 text-xs text-stone-500">
        <span className={adim === "email" ? "font-medium text-stone-900" : ""}>1. Email</span>
        <span>→</span>
        <span className={adim === "kod" ? "font-medium text-stone-900" : ""}>2. Doğrulama</span>
        <span>→</span>
        <span className={adim === "sifre" ? "font-medium text-stone-900" : ""}>3. Şifre</span>
      </div>

      {hata && <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">{hata}</p>}
      {basari && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{basari}</p>}

      {adim === "email" && (
        <form onSubmit={emailGonder} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            {pending ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
          </button>
        </form>
      )}

      {adim === "kod" && (
        <form onSubmit={koduDogrula} className="mt-6 space-y-4">
          <p className="text-sm text-stone-600">{email} adresine 6 haneli kod gönderildi.</p>
          <div>
            <label htmlFor="kod" className="block text-sm font-medium text-stone-700">
              Doğrulama Kodu
            </label>
            <input
              id="kod"
              type="text"
              required
              maxLength={6}
              value={kod}
              onChange={(e) => setKod(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-center text-lg tracking-[0.5em] focus:border-stone-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            {pending ? "Doğrulanıyor..." : "Kodu Doğrula"}
          </button>
        </form>
      )}

      {adim === "sifre" && (
        <form onSubmit={sifreBelirle} className="mt-6 space-y-4">
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
            <p className="mt-1 text-xs text-stone-500">
              En az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermeli.
            </p>
          </div>
          <div>
            <label htmlFor="passwordTekrar" className="block text-sm font-medium text-stone-700">
              Şifre Tekrar
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
            {pending ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-stone-600">
        Zaten hesabınız var mı?{" "}
        <Link href="/auth/login" className="font-medium text-stone-900 hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
