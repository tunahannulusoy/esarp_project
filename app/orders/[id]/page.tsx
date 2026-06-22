"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import type { Siparis } from "@/app/types";
import { whatsappLinkiOlustur } from "@/app/lib/orders";
import { getOrderById } from "@/app/actions/orders";
import { useUrunler } from "@/app/lib/use-urunler";
import { fiyatFormatla } from "@/app/lib/utils";

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [siparis, setSiparis] = useState<Siparis | null | undefined>(undefined);
  const { urunGetir } = useUrunler();

  useEffect(() => {
    getOrderById(id).then((veri) => setSiparis(veri));
  }, [id]);

  if (siparis === undefined) return null;

  if (siparis === null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg text-stone-600">Sipariş bulunamadı.</p>
        <Link href="/profile/orders" className="mt-4 inline-block rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white">
          Siparişlerime Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/profile/orders" className="flex items-center gap-1 text-sm text-stone-500 hover:underline">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Siparişlerime Dön
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-stone-900">Sipariş #{siparis.siparis_no}</h1>
      <p className="mt-1 text-sm text-stone-600">Durum: {siparis.durum}</p>

      <div className="mt-6 rounded-xl border border-stone-200 p-6">
        <h2 className="font-medium text-stone-900">Ürünler</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {siparis.urunler.map((satir) => {
            const urun = urunGetir(satir.urun_id);
            return (
              <li key={`${satir.urun_id}-${satir.secili_renk}-${satir.secili_boyut}`} className="flex justify-between text-stone-600">
                <span>
                  {urun?.ad ?? "Ürün"} ({satir.secili_renk}, {satir.secili_boyut}) x{satir.adet}
                </span>
                <span>{fiyatFormatla(satir.fiyat * satir.adet)}</span>
              </li>
            );
          })}
        </ul>

        <dl className="mt-4 space-y-1 border-t border-stone-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-600">Ürünler Toplamı</dt>
            <dd>{fiyatFormatla(siparis.urunler_toplami)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-600">Kargo Ücreti</dt>
            <dd>{fiyatFormatla(siparis.kargo_ucreti)}</dd>
          </div>
          <div className="flex justify-between font-semibold text-stone-900">
            <dt>Toplam</dt>
            <dd>{fiyatFormatla(siparis.toplam_tutar)}</dd>
          </div>
        </dl>
      </div>

      {siparis.teslimat_adresi && (
        <div className="mt-4 rounded-xl border border-stone-200 p-6 text-sm">
          <h2 className="font-medium text-stone-900">Teslimat Adresi</h2>
          <p className="mt-2 text-stone-600">{siparis.teslimat_adresi}</p>
        </div>
      )}

      <a
        href={whatsappLinkiOlustur(siparis)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
        WhatsApp Üzerinden Takip Et
      </a>
    </div>
  );
}
