"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const SECENEKLER: { deger: string; etiket: string }[] = [
  { deger: "en_yeni", etiket: "En Yeni Ürünler" },
  { deger: "en_cok_satan", etiket: "En Çok Satanlar" },
  { deger: "fiyat_artan", etiket: "Fiyat: Düşükten Yükseğe" },
  { deger: "fiyat_azalan", etiket: "Fiyat: Yüksekten Düşüğe" },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siralama = searchParams.get("siralama") ?? "en_yeni";
  const [acik, setAcik] = useState(false);

  const aktifEtiket = SECENEKLER.find((s) => s.deger === siralama)?.etiket ?? "En Yeni Ürünler";

  const handleSec = (deger: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("siralama", deger);
    params.delete("page");
    router.push(`/?${params.toString()}`, { scroll: false });
    setAcik(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAcik((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 hover:border-stone-400"
      >
        {aktifEtiket}
        <ChevronDown className={`h-4 w-4 transition-transform ${acik ? "rotate-180" : ""}`} strokeWidth={1.5} />
      </button>

      {acik && (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setAcik(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
            {SECENEKLER.map((secenek) => (
              <button
                key={secenek.deger}
                type="button"
                onClick={() => handleSec(secenek.deger)}
                className={`w-full px-4 py-2 text-left text-sm transition hover:bg-stone-50 ${
                  siralama === secenek.deger ? "font-medium text-stone-900" : "text-stone-600"
                }`}
              >
                {secenek.etiket}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
