"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
import { signIn, signUp, type AuthFormState } from "@/app/actions/auth";
import { dogrulamaKoduGonder, dogrulamaKoduKontrolEt } from "@/app/actions/email-verification";
import { signUpSchema } from "@/app/lib/validation";

const baslangic: AuthFormState = { success: false };

const INPUT =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none transition";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-medium text-stone-500">{children}</label>;
}

function Hata({ mesaj }: { mesaj: string }) {
  return <p className="mb-4 rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-700">{mesaj}</p>;
}

function SubmitBtn({ pending, label, loadingLabel }: { pending: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition"
    >
      {pending ? loadingLabel : label}
    </button>
  );
}

function GirisFormu({ hedefYol }: { hedefYol: string }) {
  const [state, action, pending] = useActionState(signIn, baslangic);
  return (
    <>
      {state.message && !state.success && <Hata mesaj={state.message} />}
      <form action={action} className="space-y-3">
        <input type="hidden" name="next" value={hedefYol} />
        <div>
          <Label>Email</Label>
          <input type="email" name="email" required placeholder="ornek@email.com" className={INPUT} />
        </div>
        <div>
          <Label>Şifre</Label>
          <input type="password" name="password" required placeholder="••••••••" className={INPUT} />
        </div>
        <SubmitBtn pending={pending} label="Giriş Yap" loadingLabel="Giriş yapılıyor..." />
      </form>
    </>
  );
}

type KayitAdim = "email" | "kod" | "sifre" | "tamam";

function KayitFormu() {
  const [adim, setAdim] = useState<KayitAdim>("email");
  const [email, setEmail] = useState("");
  const [kod, setKod] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const emailGonder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata(null);
    start(async () => {
      const sonuc = await dogrulamaKoduGonder(email);
      if (sonuc.success) setAdim("kod");
      else setHata(sonuc.message);
    });
  };

  const koduDogrula = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata(null);
    start(async () => {
      const sonuc = await dogrulamaKoduKontrolEt(email, kod);
      if (sonuc.success) setAdim("sifre");
      else setHata(sonuc.message ?? "Doğrulama başarısız");
    });
  };

  const sifreBelirle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata(null);
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const tekrar = fd.get("passwordTekrar") as string;
    if (password !== tekrar) { setHata("Şifreler eşleşmiyor"); return; }
    const parsed = signUpSchema.safeParse({ email, password });
    if (!parsed.success) { setHata(parsed.error.issues[0]?.message ?? "Şifre geçersiz"); return; }
    start(async () => {
      const sfd = new FormData();
      sfd.set("email", email);
      sfd.set("password", password);
      const state: AuthFormState = await signUp({ success: false }, sfd);
      if (state.success) setAdim("tamam");
      else setHata(state.message ?? "Kayıt başarısız");
    });
  };

  // step indicator
  const adimlar: KayitAdim[] = ["email", "kod", "sifre"];
  const adimIndex = adimlar.indexOf(adim === "tamam" ? "sifre" : adim);

  return (
    <>
      {hata && <Hata mesaj={hata} />}

      {adim === "email" && (
        <form onSubmit={emailGonder} className="space-y-3">
          <div>
            <Label>Email</Label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className={INPUT}
            />
          </div>
          <SubmitBtn pending={pending} label="Doğrulama Kodu Gönder" loadingLabel="Gönderiliyor..." />
        </form>
      )}

      {adim === "kod" && (
        <form onSubmit={koduDogrula} className="space-y-3">
          <p className="text-sm text-stone-500">{email} adresine 6 haneli kod gönderildi.</p>
          <div>
            <Label>Doğrulama Kodu</Label>
            <input
              type="text"
              required
              maxLength={6}
              value={kod}
              onChange={(e) => setKod(e.target.value)}
              placeholder="000000"
              className={`${INPUT} text-center tracking-widest text-lg`}
            />
          </div>
          <SubmitBtn pending={pending} label="Kodu Doğrula" loadingLabel="Doğrulanıyor..." />
        </form>
      )}

      {adim === "sifre" && (
        <form onSubmit={sifreBelirle} className="space-y-3">
          <div>
            <Label>Şifre</Label>
            <input type="password" name="password" required placeholder="••••••••" className={INPUT} />
            <p className="mt-1 text-xs text-stone-400">En az 8 karakter, büyük/küçük harf, rakam ve özel karakter.</p>
          </div>
          <div>
            <Label>Şifre Tekrar</Label>
            <input type="password" name="passwordTekrar" required placeholder="••••••••" className={INPUT} />
          </div>
          <SubmitBtn pending={pending} label="Hesap Oluştur" loadingLabel="Kaydediliyor..." />
        </form>
      )}

      {adim === "tamam" && (
        <div className="py-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-3 font-semibold text-stone-900">Kayıt başarılı!</p>
          <p className="mt-1 text-sm text-stone-500">Giriş Yap sekmesinden devam edebilirsiniz.</p>
        </div>
      )}
    </>
  );
}

export default function AuthModal({
  acik,
  onKapat,
  hedefYol = "/",
  baslangicTab = "giris",
}: {
  acik: boolean;
  onKapat: () => void;
  hedefYol?: string;
  baslangicTab?: "giris" | "kayit";
}) {
  const [tab, setTab] = useState<"giris" | "kayit">(baslangicTab);

  useEffect(() => {
    if (acik) setTab(baslangicTab);
  }, [acik, baslangicTab]);

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

      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-stone-900 px-6 py-5 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-stone-400">Hoş Geldiniz</p>
          <p className="mt-1 text-lg font-semibold text-white">Eşarp</p>
        </div>

        <button
          type="button"
          onClick={onKapat}
          aria-label="Kapat"
          className="absolute right-4 top-4 text-stone-400 hover:text-white transition"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="px-6 pb-6 pt-5">
          {/* Tabs */}
          <div className="mb-5 flex gap-4 border-b border-stone-100">
            <button
              type="button"
              onClick={() => setTab("giris")}
              className={`pb-3 text-sm font-medium transition ${
                tab === "giris" ? "border-b-2 border-stone-900 text-stone-900" : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => setTab("kayit")}
              className={`pb-3 text-sm font-medium transition ${
                tab === "kayit" ? "border-b-2 border-stone-900 text-stone-900" : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {tab === "giris" ? <GirisFormu hedefYol={hedefYol} /> : <KayitFormu key={acik ? "open" : "closed"} />}
        </div>
      </div>
    </div>
  );
}
