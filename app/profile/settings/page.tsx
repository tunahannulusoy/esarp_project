"use client";

import { useActionState, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { deleteAccount, logout, updateEmail, updatePassword, bildirimTercihiGetir, bildirimTercihiGuncelle, type AuthFormState } from "@/app/actions/auth";
import { istemciTarafindaCikisYap } from "@/app/lib/use-session";
import { useClearLocalSession } from "@/app/lib/use-clear-local-session";

const baslangicState: AuthFormState = { success: false };

export default function SettingsPage() {
  const [emailState, emailAction, emailPending] = useActionState(updateEmail, baslangicState);
  const [passwordState, passwordAction, passwordPending] = useActionState(updatePassword, baslangicState);
  const temizleYerelOturum = useClearLocalSession();

  const handleCikisYap = async () => {
    await istemciTarafindaCikisYap();
    temizleYerelOturum();
    await logout();
  };

  const [bildirimAcik, setBildirimAcik] = useState(true);
  const [silOnay, setSilOnay] = useState(false);
  const [silHata, setSilHata] = useState<string | null>(null);

  useEffect(() => {
    bildirimTercihiGetir().then(setBildirimAcik);
  }, []);

  const bildirimDegistir = (deger: boolean) => {
    setBildirimAcik(deger);
    bildirimTercihiGuncelle(deger);
  };

  const handleHesabiSil = async () => {
    setSilHata(null);
    // deleteAccount başarılı olursa içeride redirect() çağırır ve bu satırdan
    // sonraki kod hiç çalışmaz; bu yüzden yerel veriyi önceden temizliyoruz.
    temizleYerelOturum();
    const sonuc = await deleteAccount();
    if (sonuc && !sonuc.success) {
      setSilHata(sonuc.message ?? "Hesap silinemedi");
    }
  };

  return (
    <div className="max-w-md space-y-8">
      <section>
        <h2 className="text-lg font-medium text-stone-900">Email Değiştir</h2>
        {emailState.message && (
          <p
            className={`mt-2 rounded-lg px-3 py-2 text-sm ${
              emailState.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {emailState.message}
          </p>
        )}
        <form action={emailAction} className="mt-3 flex gap-2">
          <input
            type="email"
            name="email"
            required
            placeholder="yeni@email.com"
            className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={emailPending}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            Güncelle
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-medium text-stone-900">Şifre Değiştir</h2>
        {passwordState.message && (
          <p
            className={`mt-2 rounded-lg px-3 py-2 text-sm ${
              passwordState.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {passwordState.message}
          </p>
        )}
        <form action={passwordAction} className="mt-3 space-y-2">
          <input
            type="password"
            name="password"
            required
            placeholder="Yeni şifre"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <input
            type="password"
            name="passwordTekrar"
            required
            placeholder="Yeni şifre tekrar"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={passwordPending}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            Şifreyi Güncelle
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-medium text-stone-900">Bildirim Tercihleri</h2>
        <label className="mt-3 flex items-center gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={bildirimAcik}
            onChange={(e) => bildirimDegistir(e.target.checked)}
            className="rounded border-stone-300"
          />
          Sipariş ve kampanya bildirimleri al
        </label>
      </section>

      <section className="border-t border-stone-200 pt-6">
        <h2 className="text-lg font-medium text-rose-600">Hesabı Sil</h2>
        <p className="mt-1 text-sm text-stone-600">
          Bu işlem geri alınamaz. Hesabınız ve ilişkili verileriniz silinecektir.
        </p>

        {silHata && <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{silHata}</p>}

        {!silOnay ? (
          <button
            type="button"
            onClick={() => setSilOnay(true)}
            className="mt-3 rounded-lg border border-rose-600 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            Hesabı Sil
          </button>
        ) : (
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={handleHesabiSil}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
            >
              Onaylıyorum, Hesabımı Sil
            </button>
            <button
              type="button"
              onClick={() => setSilOnay(false)}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
            >
              Vazgeç
            </button>
          </div>
        )}
      </section>

      <section className="border-t border-stone-200 pt-6">
        <button
          type="button"
          onClick={handleCikisYap}
          className="flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Çıkış Yap
        </button>
      </section>
    </div>
  );
}
