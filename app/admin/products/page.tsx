"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Urun } from "@/app/types";
import { deleteProduct, getAdminProducts } from "@/app/actions/products";
import { fiyatFormatla } from "@/app/lib/utils";

export default function AdminProductsPage() {
  const [urunler, setUrunler] = useState<Urun[]>([]);

  useEffect(() => {
    getAdminProducts().then(setUrunler);
  }, []);

  const handleSil = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    await deleteProduct(id);
    getAdminProducts().then(setUrunler);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">Ürünler</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
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
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-stone-100">
                      <Image src={urun.resim_linkler[0].url} alt={urun.ad} fill sizes="48px" className="object-cover" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-stone-900">{urun.ad}</td>
                <td className="px-4 py-3">{fiyatFormatla(urun.fiyat)}</td>
                <td className="px-4 py-3">{urun.stok}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      urun.aktif ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {urun.aktif ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link href={`/admin/products/${urun.id}`} className="mr-3 font-medium text-blue-600 hover:underline">
                    Düzenle
                  </Link>
                  <button type="button" onClick={() => handleSil(urun.id)} className="font-medium text-rose-600 hover:underline">
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {urunler.length === 0 && <p className="px-4 py-8 text-center text-stone-500">Henüz ürün eklenmedi.</p>}
      </div>
    </div>
  );
}
