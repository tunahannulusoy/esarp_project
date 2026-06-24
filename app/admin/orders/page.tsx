"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Siparis } from "@/app/types";
import { getAllOrdersAdmin } from "@/app/actions/orders";
import { fiyatFormatla } from "@/app/lib/utils";
import AdminSpinner from "@/app/admin/components/admin-spinner";

const DURUM_RENGI: Record<Siparis["durum"], string> = {
  "Ödeme Bekleme": "bg-amber-100 text-amber-700",
  Hazırlanıyor: "bg-blue-100 text-blue-700",
  Gönderildi: "bg-indigo-100 text-indigo-700",
  "Teslim Edildi": "bg-emerald-100 text-emerald-700",
  "İptal Edildi": "bg-rose-100 text-rose-700",
};

export default function AdminOrdersPage() {
  const [siparisler, setSiparisler] = useState<Siparis[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    getAllOrdersAdmin().then((data) => { setSiparisler(data); setYukleniyor(false); });
  }, []);

  if (yukleniyor) return <AdminSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Siparişler</h1>

      {siparisler.length === 0 && (
        <p className="mt-6 rounded-xl bg-white px-4 py-8 text-center text-stone-500 shadow-sm">Henüz sipariş yok.</p>
      )}

      {/* Mobil kart görünümü */}
      <div className="mt-6 space-y-3 sm:hidden">
        {siparisler.map((siparis) => (
          <div key={siparis.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-900">#{siparis.siparis_no}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DURUM_RENGI[siparis.durum]}`}>
                {siparis.durum}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-stone-500">
              <span>{new Date(siparis.olusturulma_tarihi).toLocaleDateString("tr-TR")}</span>
              <span className="font-medium text-stone-900">{fiyatFormatla(siparis.toplam_tutar)}</span>
            </div>
            <Link href={`/admin/orders/${siparis.id}`} className="mt-3 block text-sm font-medium text-blue-600 hover:underline">
              Detayı Gör →
            </Link>
          </div>
        ))}
      </div>

      {/* Masaüstü tablo görünümü */}
      <div className="mt-6 hidden rounded-xl bg-white shadow-sm sm:block">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-3">Sipariş No</th>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Toplam</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {siparisler.map((siparis) => (
              <tr key={siparis.id} className="border-t border-stone-100">
                <td className="px-4 py-3 font-medium text-stone-900">#{siparis.siparis_no}</td>
                <td className="px-4 py-3 text-stone-600">
                  {new Date(siparis.olusturulma_tarihi).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-4 py-3">{fiyatFormatla(siparis.toplam_tutar)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DURUM_RENGI[siparis.durum]}`}>
                    {siparis.durum}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${siparis.id}`} className="font-medium text-blue-600 hover:underline">
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
