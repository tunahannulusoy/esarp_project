"use client";

import { useEffect, useState } from "react";
import { getAdminProducts } from "@/app/actions/products";
import { getAllOrdersAdmin } from "@/app/actions/orders";
import type { Siparis } from "@/app/types";
import { fiyatFormatla } from "@/app/lib/utils";

export default function AdminDashboardPage() {
  const [urunSayisi, setUrunSayisi] = useState(0);
  const [siparisSayisi, setSiparisSayisi] = useState(0);
  const [toplamGelir, setToplamGelir] = useState(0);
  const [bekleyenSiparis, setBekleyenSiparis] = useState(0);

  useEffect(() => {
    getAdminProducts().then((urunler) => setUrunSayisi(urunler.length));

    getAllOrdersAdmin().then((siparisler: Siparis[]) => {
      setSiparisSayisi(siparisler.length);
      setToplamGelir(siparisler.reduce((acc, s) => acc + s.toplam_tutar, 0));
      setBekleyenSiparis(siparisler.filter((s) => s.durum === "Ödeme Bekleme").length);
    });
  }, []);

  const kartlar = [
    { etiket: "Toplam Ürün", deger: urunSayisi },
    { etiket: "Toplam Sipariş", deger: siparisSayisi },
    { etiket: "Toplam Gelir", deger: fiyatFormatla(toplamGelir) },
    { etiket: "Ödeme Bekleyen", deger: bekleyenSiparis },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kartlar.map((kart) => (
          <div key={kart.etiket} className="overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">{kart.etiket}</p>
            <p className="mt-2 truncate text-2xl font-semibold text-stone-900">{kart.deger}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
