"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Heart } from "lucide-react";
import type { Urun } from "@/app/types";
import { fiyatFormatla } from "@/app/lib/utils";
import { indirimliFiyatHesapla } from "@/app/lib/utils";
import { useCart } from "@/app/lib/cart-context";
import { useFavorites } from "@/app/lib/favorites-context";

export default function ProductDetailClient({ urun }: { urun: Urun }) {
  const resimler = [...urun.resim_linkler].sort((a, b) => a.sira - b.sira);
  const [aktifResim, setAktifResim] = useState(resimler[0]?.url);
  const [secilenRenk, setSecilenRenk] = useState(urun.renkler[0]?.ad ?? "");
  const [secilenBoyut, setSecilenBoyut] = useState(urun.boyutlar[0] ?? "");
  const [adet, setAdet] = useState(1);
  const [eklendi, setEklendi] = useState(false);

  const { sepeteEkle } = useCart();
  const { favoriMi, favoriEkleCikar } = useFavorites();
  const begenildi = favoriMi(urun.id);
  const indirimliFiyat = indirimliFiyatHesapla(urun.fiyat, urun.indirim_orani);
  const indirimVar = urun.indirim_orani > 0;
  const stokYok = urun.stok === 0;

  const handleSepeteEkle = () => {
    sepeteEkle({ urun_id: urun.id, adet, secili_renk: secilenRenk, secili_boyut: secilenBoyut });
    setEklendi(true);
    setTimeout(() => setEklendi(false), 1500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="overflow-hidden rounded-xl bg-white">
          {aktifResim && (
            <Image src={aktifResim} alt={urun.ad} width={900} height={900} sizes="50vw" className="h-auto w-full" priority />
          )}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {resimler.map((resim) => (
            <button
              key={resim.sira}
              type="button"
              onClick={() => setAktifResim(resim.url)}
              className={`overflow-hidden rounded-lg border-2 ${
                aktifResim === resim.url ? "border-stone-900" : "border-transparent"
              }`}
            >
              <Image src={resim.url} alt={`${urun.ad} ${resim.sira}`} width={200} height={200} sizes="100px" className="h-auto w-full" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-stone-900">{urun.ad}</h1>
          <button
            type="button"
            onClick={() => favoriEkleCikar(urun.id)}
            aria-label={begenildi ? "Beğenmekten vazgeç" : "Beğen"}
            aria-pressed={begenildi}
            className="shrink-0 rounded-full border border-stone-200 p-2"
          >
            <Heart
              className={begenildi ? "h-5 w-5 fill-rose-600 text-rose-600" : "h-5 w-5 text-stone-700"}
              strokeWidth={1.5}
            />
          </button>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          {indirimVar && <span className="text-stone-400 line-through">{fiyatFormatla(urun.fiyat)}</span>}
          <span className="text-2xl font-semibold text-stone-900">{fiyatFormatla(indirimliFiyat)}</span>
          {indirimVar && (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
              %{urun.indirim_orani} indirim
            </span>
          )}
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-600">{urun.aciklama}</p>

        <div className="mt-6">
          <span className={`text-sm ${stokYok ? "text-rose-600" : "text-emerald-600"}`}>
            {stokYok ? "Stokta Yok" : `Stokta ${urun.stok} adet`}
          </span>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-stone-900">Renk</h3>
          <div className="mt-2 flex gap-2">
            {urun.renkler.map((renk) => (
              <button
                key={renk.ad}
                type="button"
                onClick={() => setSecilenRenk(renk.ad)}
                title={renk.ad}
                aria-pressed={secilenRenk === renk.ad}
                className={`h-9 w-9 rounded-full border-2 ${
                  secilenRenk === renk.ad ? "border-stone-900" : "border-stone-200"
                }`}
                style={{ backgroundColor: renk.hex }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-stone-900">Boyut</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {urun.boyutlar.map((boyut) => (
              <button
                key={boyut}
                type="button"
                onClick={() => setSecilenBoyut(boyut)}
                aria-pressed={secilenBoyut === boyut}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700"
              >
                {boyut}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-stone-300">
            <button
              type="button"
              onClick={() => setAdet((a) => Math.max(1, a - 1))}
              className="px-3 py-2 text-sm"
              aria-label="Adeti azalt"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{adet}</span>
            <button
              type="button"
              onClick={() => setAdet((a) => Math.min(urun.stok || 99, a + 1))}
              className="px-3 py-2 text-sm"
              aria-label="Adeti artır"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={stokYok}
            onClick={handleSepeteEkle}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {eklendi && <Check className="h-4 w-4" strokeWidth={1.5} />}
            {stokYok ? "Stokta Yok" : eklendi ? "Sepete Eklendi" : "Sepete Ekle"}
          </button>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6">
          <h3 className="text-sm font-medium text-stone-900">Ürün Özellikleri</h3>
          <ul className="mt-2 space-y-1 text-sm text-stone-600">
            <li>Mevcut renkler: {urun.renkler.map((r) => r.ad).join(", ")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
