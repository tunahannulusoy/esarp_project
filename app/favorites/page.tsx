"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart, LayoutGrid, List } from "lucide-react";
import { useFavorites } from "@/app/lib/favorites-context";
import { useCart } from "@/app/lib/cart-context";
import { useUrunler } from "@/app/lib/use-urunler";
import { fiyatFormatla, indirimliFiyatHesapla } from "@/app/lib/utils";

export default function FavoritesPage() {
  const { favoriUrunIdleri, favorilerdenCikar } = useFavorites();
  const { sepeteEkle } = useCart();
  const { urunGetir } = useUrunler();
  const [gorunum, setGorunum] = useState<"grid" | "list">("grid");

  const favoriUrunler = useMemo(
    () => favoriUrunIdleri.map((id) => urunGetir(id)).filter((u): u is NonNullable<typeof u> => Boolean(u)),
    [favoriUrunIdleri, urunGetir]
  );

  const hepsiniSepeteEkle = () => {
    favoriUrunler.forEach((urun) => {
      if (urun.stok === 0) return;
      sepeteEkle({
        urun_id: urun.id,
        adet: 1,
        secili_renk: urun.renkler[0]?.ad ?? "",
        secili_boyut: urun.boyutlar[0] ?? "",
      });
    });
  };

  if (favoriUrunler.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-stone-600">Henüz favori ürününüz yok.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
        >
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-stone-900">Beğendiklerim</h1>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-lg border border-stone-300 text-xs">
            <button
              type="button"
              onClick={() => setGorunum("grid")}
              aria-label="Grid görünümü"
              className={`px-3 py-1.5 ${gorunum === "grid" ? "bg-stone-900 text-white" : "text-stone-600"}`}
            >
              <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setGorunum("list")}
              aria-label="Liste görünümü"
              className={`px-3 py-1.5 ${gorunum === "list" ? "bg-stone-900 text-white" : "text-stone-600"}`}
            >
              <List className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={hepsiniSepeteEkle}
            className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700"
          >
            Hepsini Sepete Ekle
          </button>
        </div>
      </div>

      {gorunum === "grid" ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {favoriUrunler.map((urun) => {
            const fiyat = indirimliFiyatHesapla(urun.fiyat, urun.indirim_orani);
            const resim = urun.resim_linkler[0]?.url;
            return (
              <div key={urun.id} className="relative rounded-xl border border-stone-200 p-3">
                <button
                  type="button"
                  onClick={() => favorilerdenCikar(urun.id)}
                  aria-label="Favoriden kaldır"
                  className="absolute right-5 top-5 z-10 rounded-full bg-white/90 p-1.5 shadow"
                >
                  <Heart className="h-4 w-4 fill-rose-600 text-rose-600" strokeWidth={1.5} />
                </button>
                <Link href={`/products/${urun.id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
                    {resim && <Image src={resim} alt={urun.ad} fill sizes="200px" className="object-cover" />}
                  </div>
                  <h3 className="mt-2 line-clamp-1 text-sm font-medium text-stone-900">{urun.ad}</h3>
                  <p className="mt-1 text-sm font-semibold text-stone-900">{fiyatFormatla(fiyat)}</p>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {favoriUrunler.map((urun) => {
            const fiyat = indirimliFiyatHesapla(urun.fiyat, urun.indirim_orani);
            const resim = urun.resim_linkler[0]?.url;
            return (
              <div key={urun.id} className="flex items-center gap-4 rounded-xl border border-stone-200 p-3">
                <Link href={`/products/${urun.id}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {resim && <Image src={resim} alt={urun.ad} fill sizes="64px" className="object-cover" />}
                </Link>
                <div className="flex-1">
                  <Link href={`/products/${urun.id}`} className="text-sm font-medium text-stone-900 hover:underline">
                    {urun.ad}
                  </Link>
                  <p className="mt-0.5 text-sm text-stone-600">{fiyatFormatla(fiyat)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => favorilerdenCikar(urun.id)}
                  className="text-xs font-medium text-rose-600 hover:underline"
                >
                  Kaldır
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
