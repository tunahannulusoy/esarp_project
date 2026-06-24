"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminProducts } from "@/app/actions/products";
import { getAllOrdersAdmin } from "@/app/actions/orders";
import type { Siparis, SiparisDurum, Urun } from "@/app/types";
import { fiyatFormatla } from "@/app/lib/utils";
import AdminSpinner from "@/app/admin/components/admin-spinner";

const DURUM_RENK: Record<SiparisDurum, string> = {
  "Ödeme Bekleme": "bg-amber-100 text-amber-700",
  "Hazırlanıyor": "bg-blue-100 text-blue-700",
  "Gönderildi": "bg-indigo-100 text-indigo-700",
  "Teslim Edildi": "bg-emerald-100 text-emerald-700",
  "İptal Edildi": "bg-rose-100 text-rose-700",
};

const DURUM_SIRA: SiparisDurum[] = [
  "Ödeme Bekleme",
  "Hazırlanıyor",
  "Gönderildi",
  "Teslim Edildi",
  "İptal Edildi",
];

function gunEtiket(tarih: Date) {
  return ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"][tarih.getDay()];
}

function gunAnahtari(tarih: Date) {
  return tarih.toISOString().slice(0, 10);
}

export default function AdminDashboardPage() {
  const [siparisler, setSiparisler] = useState<Siparis[]>([]);
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    Promise.all([getAdminProducts(), getAllOrdersAdmin()]).then(([u, s]) => {
      setUrunler(u as Urun[]);
      setSiparisler(s as Siparis[]);
      setYukleniyor(false);
    });
  }, []);

  if (yukleniyor) return <AdminSpinner />;

  // KPI hesapları
  const aktifSiparisler = siparisler.filter((s) => s.durum !== "İptal Edildi");
  const toplamGelir = aktifSiparisler.reduce((acc, s) => acc + s.toplam_tutar, 0);
  const tahsilEdilen = siparisler
    .filter((s) => s.odeme_durumu === "Ödendi")
    .reduce((acc, s) => acc + s.toplam_tutar, 0);
  const bekleyenOdeme = siparisler.filter((s) => s.durum === "Ödeme Bekleme").length;
  const iptalEdilen = siparisler.filter((s) => s.durum === "İptal Edildi").length;

  // Durum dağılımı
  const durumDagilim = DURUM_SIRA.map((d) => ({
    durum: d,
    adet: siparisler.filter((s) => s.durum === d).length,
    tutar: siparisler.filter((s) => s.durum === d).reduce((acc, s) => acc + s.toplam_tutar, 0),
  }));

  // En çok satan ürünler
  const satisMap: Record<string, { ad: string; adet: number; gelir: number }> = {};
  for (const s of siparisler) {
    if (s.durum === "İptal Edildi") continue;
    for (const o of s.urunler) {
      const urun = urunler.find((u) => u.id === o.urun_id);
      if (!satisMap[o.urun_id]) {
        satisMap[o.urun_id] = { ad: urun?.ad ?? o.urun_id, adet: 0, gelir: 0 };
      }
      satisMap[o.urun_id].adet += o.adet;
      satisMap[o.urun_id].gelir += o.fiyat * o.adet;
    }
  }
  const enCokSatan = Object.values(satisMap)
    .sort((a, b) => b.adet - a.adet)
    .slice(0, 5);

  // Son 7 gün verileri
  const bugun = new Date();
  const son7gun = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(bugun);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const gunlukVeri = son7gun.map((gun) => {
    const anahtar = gunAnahtari(gun);
    const gunSiparisleri = siparisler.filter((s) => s.olusturulma_tarihi?.slice(0, 10) === anahtar);
    return {
      etiket: gunEtiket(gun),
      adet: gunSiparisleri.length,
      tutar: gunSiparisleri.reduce((acc, s) => acc + s.toplam_tutar, 0),
    };
  });
  const maxAdet = Math.max(...gunlukVeri.map((g) => g.adet), 1);

  // Son siparişler
  const sonSiparisler = [...siparisler]
    .sort((a, b) => new Date(b.olusturulma_tarihi).getTime() - new Date(a.olusturulma_tarihi).getTime())
    .slice(0, 6);

  const kpiKartlar = [
    { etiket: "Toplam Sipariş", deger: siparisler.length, renk: "text-stone-900" },
    { etiket: "Toplam Gelir", deger: fiyatFormatla(toplamGelir), renk: "text-stone-900" },
    { etiket: "Tahsil Edilen", deger: fiyatFormatla(tahsilEdilen), renk: "text-emerald-600" },
    { etiket: "Ödeme Bekleyen", deger: bekleyenOdeme, renk: "text-amber-600" },
    { etiket: "İptal Edilen", deger: iptalEdilen, renk: "text-rose-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>

      {/* KPI Kartlar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpiKartlar.map((k) => (
          <div key={k.etiket} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-stone-500">{k.etiket}</p>
            <p className={`mt-1.5 text-xl font-semibold ${k.renk}`}>{k.deger}</p>
          </div>
        ))}
      </div>

      {/* Orta bölüm */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Durum dağılımı */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-stone-700">Sipariş Durumları</h2>
          <div className="space-y-2">
            {durumDagilim.map(({ durum, adet, tutar }) => (
              <div key={durum} className="flex items-center justify-between rounded-lg px-3 py-2.5 bg-stone-50">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DURUM_RENK[durum]}`}>
                    {durum}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-stone-500">{fiyatFormatla(tutar)}</span>
                  <span className="w-6 text-right font-medium text-stone-900">{adet}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* En çok satan */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-stone-700">En Çok Satan Ürünler</h2>
          {enCokSatan.length === 0 ? (
            <p className="text-sm text-stone-400">Henüz sipariş yok.</p>
          ) : (
            <div className="space-y-2">
              {enCokSatan.map((u, i) => (
                <div key={u.ad} className="flex items-center gap-3 rounded-lg bg-stone-50 px-3 py-2.5">
                  <span className="w-5 text-center text-xs font-bold text-stone-400">{i + 1}</span>
                  <span className="flex-1 truncate text-sm text-stone-800">{u.ad}</span>
                  <span className="text-xs text-stone-500">{fiyatFormatla(u.gelir)}</span>
                  <span className="w-10 text-right text-sm font-semibold text-stone-900">{u.adet} ad.</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Son 7 gün bar chart */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold text-stone-700">Son 7 Gün — Sipariş Sayısı</h2>
        <div className="flex h-32 items-end gap-2">
          {gunlukVeri.map((g) => (
            <div key={g.etiket} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs text-stone-500">{g.adet > 0 ? g.adet : ""}</span>
              <div
                className="w-full rounded-t-md bg-stone-800 transition-all"
                style={{ height: `${Math.max((g.adet / maxAdet) * 100, g.adet > 0 ? 8 : 2)}%` }}
              />
              <span className="text-xs text-stone-400">{g.etiket}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Son siparişler */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold text-stone-700">Son Siparişler</h2>
          <Link href="/admin/orders" className="text-xs text-stone-500 hover:text-stone-900 hover:underline">
            Tümünü gör →
          </Link>
        </div>
        {sonSiparisler.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-stone-400">Henüz sipariş yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-stone-100 bg-stone-50 text-xs text-stone-500">
                  <th className="px-5 py-2.5 text-left font-medium">Sipariş No</th>
                  <th className="px-5 py-2.5 text-left font-medium">Müşteri</th>
                  <th className="px-5 py-2.5 text-left font-medium">Tarih</th>
                  <th className="px-5 py-2.5 text-right font-medium">Tutar</th>
                  <th className="px-5 py-2.5 text-left font-medium">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sonSiparisler.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50">
                    <td className="px-5 py-3 font-mono text-xs text-stone-600">{s.siparis_no}</td>
                    <td className="px-5 py-3 text-stone-800">{s.musteri_adi}</td>
                    <td className="px-5 py-3 text-stone-500">
                      {new Date(s.olusturulma_tarihi).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-stone-900">
                      {fiyatFormatla(s.toplam_tutar)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DURUM_RENK[s.durum]}`}>
                        {s.durum}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
