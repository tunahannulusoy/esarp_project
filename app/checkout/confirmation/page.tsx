"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import type { Siparis } from "@/app/types";
import { whatsappLinkiOlustur } from "@/app/lib/orders";
import { getOrderById } from "@/app/actions/orders";
import { fiyatFormatla } from "@/app/lib/utils";

function OnaySayfasiIcerik() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [siparis, setSiparis] = useState<Siparis | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setSiparis(null);
      return;
    }
    getOrderById(id).then((veri) => setSiparis(veri));
  }, [id]);

  if (siparis === undefined) return null;

  if (siparis === null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg text-stone-600">Sipariş bulunamadı.</p>
        <Link href="/" className="mt-4 inline-block rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const tahminiTarih = siparis.tahmini_teslimat_tarihi
    ? new Date(siparis.tahmini_teslimat_tarihi).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-stone-200 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" strokeWidth={1.5} />
        <h1 className="mt-4 text-2xl font-semibold text-stone-900">Siparişiniz Alındı!</h1>
        <p className="mt-2 text-sm text-stone-600">Sipariş No: #{siparis.siparis_no}</p>
      </div>

      <div className="mt-6 rounded-xl border border-stone-200 p-6 text-sm">
        <h2 className="font-medium text-stone-900">Sipariş Özeti</h2>
        <dl className="mt-3 space-y-2">
          <div className="flex justify-between">
            <dt className="text-stone-600">Ürünler Toplamı</dt>
            <dd>{fiyatFormatla(siparis.urunler_toplami)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-600">Kargo Ücreti</dt>
            <dd>{fiyatFormatla(siparis.kargo_ucreti)}</dd>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-2 font-semibold text-stone-900">
            <dt>Toplam Tutar</dt>
            <dd>{fiyatFormatla(siparis.toplam_tutar)}</dd>
          </div>
        </dl>

        {tahminiTarih && (
          <p className="mt-4 text-stone-600">
            Tahmini Teslimat Tarihi: <span className="font-medium text-stone-900">{tahminiTarih}</span>
          </p>
        )}
      </div>

      <a
        href={whatsappLinkiOlustur(siparis)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
        WhatsApp Üzerinden Bildirim Al
      </a>

      <Link
        href="/profile/orders"
        className="mt-3 block rounded-lg border border-stone-300 py-2.5 text-center text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        Siparişlerimi Takip Et
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OnaySayfasiIcerik />
    </Suspense>
  );
}
