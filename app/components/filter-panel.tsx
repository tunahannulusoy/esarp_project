"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp, Package, Palette, Ruler, SlidersHorizontal, Star } from "lucide-react";
import type { Kategori } from "@/app/types";

type FilterPanelProps = {
  kategoriler: Kategori[];
  renkler: { ad: string; hex: string }[];
  boyutlar: string[];
};

export default function FilterPanel({ kategoriler, renkler, boyutlar }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [panelAcik, setPanelAcik] = useState(false);

  const seciliRenkler = searchParams.get("renk")?.split(",").filter(Boolean) ?? [];
  const seciliKategoriler = searchParams.get("kategori")?.split(",").filter(Boolean) ?? [];
  const seciliBoyutlar = searchParams.get("boyut")?.split(",").filter(Boolean) ?? [];
  const minFiyat = searchParams.get("minFiyat") ?? "";
  const maxFiyat = searchParams.get("maxFiyat") ?? "";
  const minPuan = searchParams.get("puan") ?? "";

  const parametreyiGuncelle = (anahtar: string, deger: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (deger === null || deger === "") {
      params.delete(anahtar);
    } else {
      params.set(anahtar, deger);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const listeToggle = (anahtar: string, mevcutListe: string[], deger: string) => {
    const yeniListe = mevcutListe.includes(deger)
      ? mevcutListe.filter((d) => d !== deger)
      : [...mevcutListe, deger];
    parametreyiGuncelle(anahtar, yeniListe.length > 0 ? yeniListe.join(",") : null);
  };

  const filtreleriTemizle = () => {
    router.push("/", { scroll: false });
  };

  const aktifFiltreSayisi =
    seciliRenkler.length +
    seciliKategoriler.length +
    seciliBoyutlar.length +
    (minFiyat ? 1 : 0) +
    (maxFiyat ? 1 : 0) +
    (minPuan ? 1 : 0);

  return (
    <div>
      <button
        type="button"
        onClick={() => setPanelAcik((v) => !v)}
        className="mb-4 flex w-full items-center justify-between rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
          Filtrele{aktifFiltreSayisi > 0 ? ` (${aktifFiltreSayisi})` : ""}
        </span>
        {panelAcik ? (
          <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
        )}
      </button>

      <div className={`${panelAcik ? "block" : "hidden"} space-y-6 lg:block`}>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            Fiyat Aralığı
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={minFiyat}
              onBlur={(e) => parametreyiGuncelle("minFiyat", e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
            />
            <span className="text-stone-400">–</span>
            <input
              type="number"
              placeholder="Max"
              defaultValue={maxFiyat}
              onBlur={(e) => parametreyiGuncelle("maxFiyat", e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <Palette className="h-4 w-4" strokeWidth={1.5} />
            Renk
          </h3>
          <div className="mt-2 space-y-1.5">
            {renkler.map((renk) => (
              <label key={renk.ad} className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={seciliRenkler.includes(renk.ad)}
                  onChange={() => listeToggle("renk", seciliRenkler, renk.ad)}
                  className="rounded border-stone-300"
                />
                <span className="h-3 w-3 rounded-full border border-stone-200" style={{ backgroundColor: renk.hex }} />
                {renk.ad}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <Package className="h-4 w-4" strokeWidth={1.5} />
            Kategori
          </h3>
          <div className="mt-2 space-y-1.5">
            {kategoriler.map((kategori) => (
              <label key={kategori.id} className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={seciliKategoriler.includes(kategori.id)}
                  onChange={() => listeToggle("kategori", seciliKategoriler, kategori.id)}
                  className="rounded border-stone-300"
                />
                {kategori.ad}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <Ruler className="h-4 w-4" strokeWidth={1.5} />
            Boyut
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {boyutlar.map((boyut) => (
              <button
                key={boyut}
                type="button"
                onClick={() => listeToggle("boyut", seciliBoyutlar, boyut)}
                className={`rounded-lg border px-2.5 py-1 text-xs ${
                  seciliBoyutlar.includes(boyut)
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
          <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <Star className="h-4 w-4" strokeWidth={1.5} />
            Puan
          </h3>
          <div className="mt-2 space-y-1.5">
            {[4, 3, 2].map((puan) => (
              <label key={puan} className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={minPuan === String(puan)}
                  onChange={() => parametreyiGuncelle("puan", minPuan === String(puan) ? null : String(puan))}
                  className="rounded border-stone-300"
                />
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < puan ? "fill-amber-400 text-amber-400" : "text-stone-300"}`}
                      strokeWidth={1.5}
                    />
                  ))}
                </span>
                ve üzeri
              </label>
            ))}
          </div>
        </div>

        {aktifFiltreSayisi > 0 && (
          <button type="button" onClick={filtreleriTemizle} className="text-xs font-medium text-stone-500 hover:underline">
            Filtreleri Temizle
          </button>
        )}
      </div>
    </div>
  );
}
