"use client";

import { useState } from "react";
import { useProfile } from "@/app/lib/profile-context";

export default function ProfilePage() {
  const { profil, profilGuncelle, yukleniyor } = useProfile();
  const [duzenleniyor, setDuzenleniyor] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setKaydediliyor(true);
    const fd = new FormData(e.currentTarget);
    await profilGuncelle({
      ad: fd.get("ad") as string,
      soyad: fd.get("soyad") as string,
      email: profil.email,
      telefon: fd.get("telefon") as string,
    });
    setKaydediliyor(false);
    setDuzenleniyor(false);
  };

  if (yukleniyor) return null;

  if (duzenleniyor) {
    return (
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ad" className="block text-sm font-medium text-stone-700">
              Ad
            </label>
            <input
              id="ad"
              name="ad"
              defaultValue={profil.ad}
              required
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="soyad" className="block text-sm font-medium text-stone-700">
              Soyad
            </label>
            <input
              id="soyad"
              name="soyad"
              defaultValue={profil.soyad}
              required
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            value={profil.email}
            disabled
            className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500"
          />
          <p className="mt-1 text-xs text-stone-500">Email değiştirmek için Hesap Ayarları sayfasını kullanın.</p>
        </div>

        <div>
          <label htmlFor="telefon" className="block text-sm font-medium text-stone-700">
            Telefon
          </label>
          <input
            id="telefon"
            name="telefon"
            defaultValue={profil.telefon}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={kaydediliyor}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={() => setDuzenleniyor(false)}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
          >
            Vazgeç
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold text-stone-900">Hesap Bilgileri</h1>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-stone-500">Ad Soyad</dt>
          <dd className="mt-0.5 text-stone-900">
            {profil.ad || profil.soyad ? `${profil.ad} ${profil.soyad}`.trim() : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Email</dt>
          <dd className="mt-0.5 text-stone-900">{profil.email || "—"}</dd>
        </div>
        <div>
          <dt className="text-stone-500">Telefon</dt>
          <dd className="mt-0.5 text-stone-900">{profil.telefon || "—"}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => setDuzenleniyor(true)}
        className="mt-6 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
      >
        Düzenle
      </button>
    </div>
  );
}
