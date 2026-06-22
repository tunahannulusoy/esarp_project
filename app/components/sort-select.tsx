"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SECENEKLER: { deger: string; etiket: string }[] = [
  { deger: "fiyat_artan", etiket: "Fiyat: Düşükten Yükseğe" },
  { deger: "fiyat_azalan", etiket: "Fiyat: Yüksekten Düşüğe" },
  { deger: "en_cok_satan", etiket: "En Çok Satanlar" },
  { deger: "en_yeni", etiket: "En Yeni Ürünler" },
  { deger: "en_yuksek_puan", etiket: "En Yüksek Puan" },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siralama = searchParams.get("siralama") ?? "en_yeni";

  const handleChange = (deger: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("siralama", deger);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <select
      aria-label="Sıralama"
      value={siralama}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
    >
      {SECENEKLER.map((secenek) => (
        <option key={secenek.deger} value={secenek.deger}>
          {secenek.etiket}
        </option>
      ))}
    </select>
  );
}
