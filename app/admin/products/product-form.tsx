"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Urun } from "@/app/types";
import { productSchema } from "@/app/lib/validation";
import { adminKategorileriGetir } from "@/app/lib/admin-categories";

type ProductFormProps = {
  baslangicDeger?: Urun;
  onKaydet: (veri: {
    ad: string;
    aciklama: string;
    fiyat: number;
    indirim_orani: number;
    kategori_id: string;
    renkler: { ad: string; hex: string }[];
    boyutlar: string[];
    stok: number;
  }) => void;
};

const BOYUT_SECENEKLERI = ["XS", "S", "M", "L", "XL", "XXL", "90x90", "70x180", "Standart"];

export default function ProductForm({ baslangicDeger, onKaydet }: ProductFormProps) {
  const router = useRouter();
  const kategoriler = adminKategorileriGetir();
  const [hata, setHata] = useState<string | null>(null);
  const [secilenBoyutlar, setSecilenBoyutlar] = useState<string[]>(baslangicDeger?.boyutlar ?? []);
  const [renkler, setRenkler] = useState(baslangicDeger?.renkler ?? [{ ad: "", hex: "#000000" }]);

  const boyutToggle = (boyut: string) => {
    setSecilenBoyutlar((mevcut) =>
      mevcut.includes(boyut) ? mevcut.filter((b) => b !== boyut) : [...mevcut, boyut]
    );
  };

  const renkEkle = () => setRenkler((mevcut) => [...mevcut, { ad: "", hex: "#000000" }]);
  const renkSil = (index: number) => setRenkler((mevcut) => mevcut.filter((_, i) => i !== index));
  const renkGuncelle = (index: number, alan: "ad" | "hex", deger: string) => {
    setRenkler((mevcut) => mevcut.map((r, i) => (i === index ? { ...r, [alan]: deger } : r)));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata(null);

    const fd = new FormData(e.currentTarget);
    const gecerliRenkler = renkler.filter((r) => r.ad.trim() !== "");
    const veri = {
      ad: fd.get("ad") as string,
      aciklama: fd.get("aciklama") as string,
      fiyat: Number(fd.get("fiyat")),
      indirim_orani: Number(fd.get("indirim_orani") || 0),
      kategori_id: fd.get("kategori_id") as string,
      renkler: gecerliRenkler.map((r) => r.ad),
      boyutlar: secilenBoyutlar,
      stok: Number(fd.get("stok")),
    };

    const parsed = productSchema.safeParse(veri);
    if (!parsed.success) {
      setHata(parsed.error.issues[0]?.message ?? "Form geçersiz");
      return;
    }

    onKaydet({ ...parsed.data, renkler: gecerliRenkler });
    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
      {hata && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{hata}</p>}

      <div>
        <label htmlFor="ad" className="block text-sm font-medium text-stone-700">
          Ürün Adı
        </label>
        <input
          id="ad"
          name="ad"
          required
          defaultValue={baslangicDeger?.ad}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="aciklama" className="block text-sm font-medium text-stone-700">
          Açıklama
        </label>
        <textarea
          id="aciklama"
          name="aciklama"
          required
          rows={3}
          defaultValue={baslangicDeger?.aciklama}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="fiyat" className="block text-sm font-medium text-stone-700">
            Fiyat (₺)
          </label>
          <input
            id="fiyat"
            name="fiyat"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={baslangicDeger?.fiyat}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="indirim_orani" className="block text-sm font-medium text-stone-700">
            İndirim (%)
          </label>
          <input
            id="indirim_orani"
            name="indirim_orani"
            type="number"
            min="0"
            max="100"
            defaultValue={baslangicDeger?.indirim_orani ?? 0}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="stok" className="block text-sm font-medium text-stone-700">
            Stok
          </label>
          <input
            id="stok"
            name="stok"
            type="number"
            min="0"
            required
            defaultValue={baslangicDeger?.stok}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="kategori_id" className="block text-sm font-medium text-stone-700">
          Kategori
        </label>
        <select
          id="kategori_id"
          name="kategori_id"
          required
          defaultValue={baslangicDeger?.kategori_id ?? ""}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="">Seçin</option>
          {kategoriler.map((kategori) => (
            <option key={kategori.id} value={kategori.id}>
              {kategori.ad}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="block text-sm font-medium text-stone-700">Boyutlar</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {BOYUT_SECENEKLERI.map((boyut) => (
            <button
              key={boyut}
              type="button"
              onClick={() => boyutToggle(boyut)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                secilenBoyutlar.includes(boyut)
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 text-stone-700"
              }`}
            >
              {boyut}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-stone-700">Renkler</span>
        <div className="mt-2 space-y-2">
          {renkler.map((renk, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Renk adı"
                value={renk.ad}
                onChange={(e) => renkGuncelle(index, "ad", e.target.value)}
                className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              <input
                type="color"
                value={renk.hex}
                onChange={(e) => renkGuncelle(index, "hex", e.target.value)}
                className="h-9 w-12 rounded border border-stone-300"
              />
              <button type="button" onClick={() => renkSil(index)} className="text-xs text-rose-600 hover:underline">
                Kaldır
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={renkEkle} className="mt-2 text-xs font-medium text-stone-700 hover:underline">
          + Renk Ekle
        </button>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Kaydet
      </button>
    </form>
  );
}
