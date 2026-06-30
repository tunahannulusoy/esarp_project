"use client";

import { useEffect, useState } from "react";
import type { Kategori } from "@/app/types";
import { createCategory, deleteCategory, getAdminCategories } from "@/app/actions/categories";
import AdminSpinner from "@/app/admin/components/admin-spinner";
import ConfirmModal from "@/app/admin/components/confirm-modal";

export default function AdminCategoriesPage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [ad, setAd] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [silinecekId, setSilinecekId] = useState<string | null>(null);

  useEffect(() => {
    getAdminCategories().then((data) => { setKategoriler(data); setYukleniyor(false); });
  }, []);

  const handleEkle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata(null);
    if (!ad.trim()) return;

    const sonuc = await createCategory(ad);
    if (!sonuc.success) {
      setHata(sonuc.message ?? "Kategori eklenemedi");
      return;
    }

    getAdminCategories().then(setKategoriler);
    setAd("");
  };

  const handleSil = async () => {
    if (!silinecekId) return;
    await deleteCategory(silinecekId);
    setSilinecekId(null);
    getAdminCategories().then(setKategoriler);
  };

  if (yukleniyor) return <AdminSpinner />;

  return (
    <div>
      <ConfirmModal
        acik={!!silinecekId}
        baslik="Kategoriyi sil"
        mesaj="Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onayMetni="Evet, sil"
        tehlikeli
        onOnayla={handleSil}
        onIptal={() => setSilinecekId(null)}
      />
      <h1 className="text-2xl font-semibold text-stone-900">Kategoriler</h1>

      {hata && <p className="mt-4 max-w-xl rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{hata}</p>}

      <form onSubmit={handleEkle} className="mt-6 flex max-w-xl gap-3 rounded-xl bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Kategori adı"
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          required
          className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ekle
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {kategoriler.map((kategori) => (
              <tr key={kategori.id} className="border-t border-stone-100">
                <td className="px-4 py-3 font-medium text-stone-900">{kategori.ad}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button type="button" onClick={() => setSilinecekId(kategori.id)} className="font-medium text-rose-600 hover:underline">
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
