"use client";

import { useState } from "react";
import { IL_LISTESI, ilceleriGetir } from "@/app/lib/turkiye-iller";
import { addressSchema } from "@/app/lib/validation";
import type { Adres } from "@/app/types";

type AdresFormVerisi = Omit<Adres, "id" | "kullanici_id" | "silinmis" | "olusturulma_tarihi">;

export default function AddressForm({
  baslangicDeger,
  onKaydet,
  onVazgec,
  varsayilanOner,
}: {
  baslangicDeger?: Partial<AdresFormVerisi>;
  onKaydet: (veri: AdresFormVerisi) => void;
  onVazgec?: () => void;
  varsayilanOner: boolean;
}) {
  const [hata, setHata] = useState<string | null>(null);
  const [il, setIl] = useState(baslangicDeger?.il ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata(null);

    const fd = new FormData(e.currentTarget);
    const adresVerisi = {
      il: fd.get("il") as string,
      ilce: fd.get("ilce") as string,
      mahalle: fd.get("mahalle") as string,
      acik_adres: fd.get("acik_adres") as string,
      adres_basligi: fd.get("adres_basligi") as string,
      telefon: fd.get("telefon") as string,
      varsayilan: fd.get("varsayilan") === "on",
    };

    const parsed = addressSchema.safeParse(adresVerisi);
    if (!parsed.success) {
      setHata(parsed.error.issues[0]?.message ?? "Adres bilgileri geçersiz");
      return;
    }

    onKaydet({ ...parsed.data, varsayilan: adresVerisi.varsayilan });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-stone-200 p-4">
      {hata && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{hata}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="il" className="block text-sm font-medium text-stone-700">
            İl
          </label>
          <select
            id="il"
            name="il"
            required
            value={il}
            onChange={(e) => setIl(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            <option value="">Seçin</option>
            {IL_LISTESI.map((ilAdi) => (
              <option key={ilAdi} value={ilAdi}>
                {ilAdi}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ilce" className="block text-sm font-medium text-stone-700">
            İlçe
          </label>
          <select
            id="ilce"
            name="ilce"
            required
            disabled={!il}
            defaultValue={baslangicDeger?.ilce ?? ""}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm disabled:bg-stone-100"
          >
            <option value="">Seçin</option>
            {ilceleriGetir(il).map((ilceAdi) => (
              <option key={ilceAdi} value={ilceAdi}>
                {ilceAdi}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mahalle" className="block text-sm font-medium text-stone-700">
          Mahalle
        </label>
        <input
          id="mahalle"
          name="mahalle"
          required
          defaultValue={baslangicDeger?.mahalle}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="acik_adres" className="block text-sm font-medium text-stone-700">
          Açık Adres
        </label>
        <textarea
          id="acik_adres"
          name="acik_adres"
          required
          rows={3}
          defaultValue={baslangicDeger?.acik_adres}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="adres_basligi" className="block text-sm font-medium text-stone-700">
            Adres Başlığı
          </label>
          <input
            id="adres_basligi"
            name="adres_basligi"
            required
            placeholder="Ev, İş vb."
            defaultValue={baslangicDeger?.adres_basligi}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="telefon" className="block text-sm font-medium text-stone-700">
            Telefon
          </label>
          <input
            id="telefon"
            name="telefon"
            required
            placeholder="05XX XXX XX XX"
            defaultValue={baslangicDeger?.telefon}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {varsayilanOner && (
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            name="varsayilan"
            defaultChecked={baslangicDeger?.varsayilan}
            className="rounded border-stone-300"
          />
          Varsayılan adres yap
        </label>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Adresi Kaydet
        </button>
        {onVazgec && (
          <button
            type="button"
            onClick={onVazgec}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
          >
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
