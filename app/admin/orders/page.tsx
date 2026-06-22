"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Siparis } from "@/app/types";
import { getAllOrdersAdmin } from "@/app/actions/orders";
import { fiyatFormatla } from "@/app/lib/utils";

const DURUM_RENGI: Record<Siparis["durum"], string> = {
  "Ödeme Bekleme": "bg-amber-100 text-amber-700",
  Hazırlanıyor: "bg-blue-100 text-blue-700",
  Gönderildi: "bg-indigo-100 text-indigo-700",
  "Teslim Edildi": "bg-emerald-100 text-emerald-700",
  "İptal Edildi": "bg-rose-100 text-rose-700",
};

export default function AdminOrdersPage() {
  const [siparisler, setSiparisler] = useState<Siparis[]>([]);

  useEffect(() => {
    getAllOrdersAdmin().then(setSiparisler);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Siparişler</h1>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
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

        {siparisler.length === 0 && <p className="px-4 py-8 text-center text-stone-500">Henüz sipariş yok.</p>}
      </div>
    </div>
  );
}
