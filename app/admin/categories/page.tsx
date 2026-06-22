"use client";

import { useEffect, useState } from "react";
import type { Kategori } from "@/app/types";
import { adminKategorileriGetir, adminKategoriOlustur, adminKategoriSil } from "@/app/lib/admin-categories";

export default function AdminCategoriesPage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [ad, setAd] = useState("");
  const [aciklama, setAciklama] = useState("");

  useEffect(() => {
    setKategoriler(adminKategorileriGetir());
  }, []);

  const handleEkle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ad.trim()) return;
    adminKategoriOlustur({ ad, aciklama });
    setKategoriler(adminKategorileriGetir());
    setAd("");
    setAciklama("");
  };

  const handleSil = (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    adminKategoriSil(id);
    setKategoriler(adminKategorileriGetir());
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Kategoriler</h1>

      <form onSubmit={handleEkle} className="mt-6 flex max-w-xl gap-3 rounded-xl bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Kategori adı"
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          required
          className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Açıklama"
          value={aciklama}
          onChange={(e) => setAciklama(e.target.value)}
          className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Ekle
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Açıklama</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {kategoriler.map((kategori) => (
              <tr key={kategori.id} className="border-t border-stone-100">
                <td className="px-4 py-3 font-medium text-stone-900">{kategori.ad}</td>
                <td className="px-4 py-3 text-stone-600">{kategori.aciklama}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => handleSil(kategori.id)} className="font-medium text-rose-600 hover:underline">
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {kategoriler.length === 0 && <p className="px-4 py-8 text-center text-stone-500">Henüz kategori yok.</p>}
      </div>
    </div>
  );
}
