"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Urun } from "@/app/types";
import { fiyatFormatla } from "@/app/lib/utils";
import { indirimliFiyatHesapla } from "@/app/lib/mock-data";
import { useCart } from "@/app/lib/cart-context";
import { useFavorites } from "@/app/lib/favorites-context";

export default function ProductCard({ urun }: { urun: Urun }) {
  const { favoriMi, favoriEkleCikar } = useFavorites();
  const begenildi = favoriMi(urun.id);
  const { sepeteEkle, sepettenCikar, sepetteMi } = useCart();
  const sepette = sepetteMi(urun.id);
  const varsayilanRenk = urun.renkler[0]?.ad ?? "";
  const varsayilanBoyut = urun.boyutlar[0] ?? "";

  const handleSepetToggle = () => {
    if (sepette) {
      sepettenCikar(urun.id, varsayilanRenk, varsayilanBoyut);
    } else {
      sepeteEkle({
        urun_id: urun.id,
        adet: 1,
        secili_renk: varsayilanRenk,
        secili_boyut: varsayilanBoyut,
      });
    }
  };

  const indirimliFiyat = indirimliFiyatHesapla(urun.fiyat, urun.indirim_orani);
  const indirimVar = urun.indirim_orani > 0;
  const anaResim = urun.resim_linkler[0]?.url;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:shadow-md">
      <button
        type="button"
        onClick={() => favoriEkleCikar(urun.id)}
        aria-label={begenildi ? "Beğenmekten vazgeç" : "Beğen"}
        aria-pressed={begenildi}
        className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow"
      >
        <Heart
          className={begenildi ? "h-4 w-4 fill-rose-600 text-rose-600" : "h-4 w-4 text-stone-700"}
          strokeWidth={1.5}
        />
      </button>

      <Link href={`/products/${urun.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          {anaResim && (
            <Image
              src={anaResim}
              alt={urun.ad}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition group-hover:scale-105"
            />
          )}
          {indirimVar && (
            <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-medium text-white">
              %{urun.indirim_orani} indirim
            </span>
          )}
        </div>

        <div className="px-3 pt-3">
          <h3 className="line-clamp-1 text-sm font-medium text-stone-900">{urun.ad}</h3>

          <div className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
            {urun.puan.toFixed(1)}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
        <div className="flex items-baseline gap-2">
          {indirimVar && (
            <span className="text-xs text-stone-400 line-through">{fiyatFormatla(urun.fiyat)}</span>
          )}
          <span className="text-sm font-semibold text-stone-900">{fiyatFormatla(indirimliFiyat)}</span>
        </div>

        <button
          type="button"
          disabled={urun.stok === 0}
          onClick={handleSepetToggle}
          aria-label={urun.stok === 0 ? "Stokta yok" : sepette ? "Sepetten çıkar" : "Sepete ekle"}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:border disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-300 ${
            sepette
              ? "bg-stone-900 text-white hover:bg-stone-700"
              : "border border-stone-300 text-stone-700 hover:border-stone-900 hover:text-stone-900"
          }`}
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
