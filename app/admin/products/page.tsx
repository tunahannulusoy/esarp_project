"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Urun } from "@/app/types";
import { deleteProduct, getAdminProducts } from "@/app/actions/products";
import { fiyatFormatla } from "@/app/lib/utils";
import AdminSpinner from "@/app/admin/components/admin-spinner";
import ConfirmModal from "@/app/admin/components/confirm-modal";

export default function AdminProductsPage() {
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [silinecekId, setSilinecekId] = useState<string | null>(null);

  useEffect(() => {
    getAdminProducts().then((data) => { setUrunler(data); setYukleniyor(false); });
  }, []);

  const handleSil = async () => {
    if (!silinecekId) return;
    await deleteProduct(silinecekId);
    setSilinecekId(null);
    getAdminProducts().then(setUrunler);
  };

  if (yukleniyor) return <AdminSpinner />;

  return (
    <div>
      <ConfirmModal
        acik={!!silinecekId}
        baslik="Ürünü sil"
        mesaj="Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onayMetni="Evet, sil"
        tehlikeli
        onOnayla={handleSil}
        onIptal={() => setSilinecekId(null)}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">Ürünler</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Yeni Ürün
        </Link>
      </div>

      {urunler.length === 0 && (
        <p className="mt-6 rounded-xl bg-white px-4 py-8 text-center text-stone-500 shadow-sm">Henüz ürün eklenmedi.</p>
      )}

      {/* Mobil kart görünümü */}
      <div className="mt-6 space-y-3 sm:hidden">
        {urunler.map((urun) => (
          <div key={urun.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
            <div className="w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
              {urun.resim_linkler[0] ? (
                <Image src={urun.resim_linkler[0].url} alt={urun.ad} width={56} height={56} className="h-auto w-full" />
              ) : (
                <div className="h-14 w-14 bg-stone-100" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-stone-900">{urun.ad}</p>
              <div className="mt-0.5 flex items-center gap-2 text-sm text-stone-500">
                <span>{fiyatFormatla(urun.fiyat)}</span>
                <span>·</span>
                <span>Stok: {urun.stok}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${urun.aktif ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                  {urun.aktif ? "Aktif" : "Pasif"}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 text-sm">
              <Link href={`/admin/products/${urun.id}`} className="font-medium text-blue-600 hover:underline">
                Düzenle
              </Link>
              <button type="button" onClick={() => setSilinecekId(urun.id)} className="font-medium text-rose-600 hover:underline">
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Masaüstü tablo görünümü */}
      <div className="mt-6 hidden rounded-xl bg-white shadow-sm sm:block">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-3">Görsel</th>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Fiyat</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {urunler.map((urun) => (
              <tr key={urun.id} className="border-t border-stone-100">
                <td className="px-4 py-3">
                  {urun.resim_linkler[0] && (
                    <div className="w-12 overflow-hidden rounded-lg bg-stone-100">
                      <Image src={urun.resim_linkler[0].url} alt={urun.ad} width={48} height={48} sizes="48px" className="h-auto w-full" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-stone-900">{urun.ad}</td>
                <td className="px-4 py-3">{fiyatFormatla(urun.fiyat)}</td>
                <td className="px-4 py-3">{urun.stok}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${urun.aktif ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                    {urun.aktif ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${urun.id}`} className="mr-3 font-medium text-blue-600 hover:underline">
                    Düzenle
                  </Link>
                  <button type="button" onClick={() => setSilinecekId(urun.id)} className="font-medium text-rose-600 hover:underline">
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
