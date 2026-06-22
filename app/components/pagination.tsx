"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ aktifSayfa, toplamSayfa }: { aktifSayfa: number; toplamSayfa: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (toplamSayfa <= 1) return null;

  const sayfayaGit = (sayfa: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sayfa <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(sayfa));
    }
    router.push(`/?${params.toString()}`, { scroll: true });
  };

  const sayfaNumaralari = Array.from({ length: toplamSayfa }, (_, i) => i + 1).filter(
    (sayfa) => sayfa === 1 || sayfa === toplamSayfa || Math.abs(sayfa - aktifSayfa) <= 1
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Sayfalama">
      <button
        type="button"
        onClick={() => sayfayaGit(aktifSayfa - 1)}
        disabled={aktifSayfa === 1}
        aria-label="Önceki sayfa"
        className="rounded-lg border border-stone-300 p-2 text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {sayfaNumaralari.map((sayfa, index) => {
        const oncekiSayfa = sayfaNumaralari[index - 1];
        const bosluk = oncekiSayfa !== undefined && sayfa - oncekiSayfa > 1;
        return (
          <span key={sayfa} className="flex items-center gap-1">
            {bosluk && <span className="px-1 text-stone-400">…</span>}
            <button
              type="button"
              onClick={() => sayfayaGit(sayfa)}
              aria-current={sayfa === aktifSayfa ? "page" : undefined}
              className={`h-9 w-9 rounded-lg text-sm ${
                sayfa === aktifSayfa ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {sayfa}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={() => sayfayaGit(aktifSayfa + 1)}
        disabled={aktifSayfa === toplamSayfa}
        aria-label="Sonraki sayfa"
        className="rounded-lg border border-stone-300 p-2 text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </nav>
  );
}
