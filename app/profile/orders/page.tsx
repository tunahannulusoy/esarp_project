"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Siparis } from "@/app/types";
import { kullaniciSiparisleriGetir } from "@/app/lib/orders";
import { fiyatFormatla } from "@/app/lib/utils";
import { useCart } from "@/app/lib/cart-context";
import { urunGetir } from "@/app/lib/mock-data";

const DURUM_RENGI: Record<Siparis["durum"], string> = {
  "Ödeme Bekleme": "bg-amber-100 text-amber-700",
  Hazırlanıyor: "bg-blue-100 text-blue-700",
  Gönderildi: "bg-indigo-100 text-indigo-700",
  "Teslim Edildi": "bg-emerald-100 text-emerald-700",
  "İptal Edildi": "bg-rose-100 text-rose-700",
};

export default function OrdersPage() {
  const [siparisler, setSiparisler] = useState<Siparis[]>([]);
  const { sepeteEkle } = useCart();

  useEffect(() => {
    setSiparisler(kullaniciSiparisleriGetir());
  }, []);

  const tekrarSiparisVer = (siparis: Siparis) => {
    siparis.urunler.forEach((urunSatiri) => {
      if (!urunGetir(urunSatiri.urun_id)) return;
      sepeteEkle({
        urun_id: urunSatiri.urun_id,
        adet: urunSatiri.adet,
        secili_renk: urunSatiri.secili_renk,
        secili_boyut: urunSatiri.secili_boyut,
      });
    });
  };

  if (siparisler.length === 0) {
    return <p className="text-sm text-stone-600">Henüz siparişiniz bulunmuyor.</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-900">Siparişlerim</h1>

      <div className="mt-4 space-y-3">
        {siparisler.map((siparis) => (
          <div key={siparis.id} className="rounded-xl border border-stone-200 p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-stone-900">#{siparis.siparis_no}</p>
                <p className="mt-0.5 text-stone-500">
                  {new Date(siparis.olusturulma_tarihi).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${DURUM_RENGI[siparis.durum]}`}>
                {siparis.durum}
              </span>
            </div>

            <p className="mt-3 font-semibold text-stone-900">{fiyatFormatla(siparis.toplam_tutar)}</p>

            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              <Link href={`/orders/${siparis.id}`} className="font-medium text-stone-700 hover:underline">
                Detayları Gör
              </Link>
              <button
                type="button"
                onClick={() => tekrarSiparisVer(siparis)}
                className="font-medium text-stone-700 hover:underline"
              >
                Tekrar Sipariş Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
