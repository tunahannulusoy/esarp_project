"use client";

import { use, useEffect, useState } from "react";
import type { Siparis } from "@/app/types";
import { getOrderById, siparisDurumBildirimGonder, updateOrderStatus } from "@/app/actions/orders";
import { useUrunler } from "@/app/lib/use-urunler";
import { fiyatFormatla } from "@/app/lib/utils";
import ConfirmModal from "@/app/admin/components/confirm-modal";

const DURUMLAR: Siparis["durum"][] = [
  "Ödeme Bekleme",
  "Hazırlanıyor",
  "Gönderildi",
  "Teslim Edildi",
  "İptal Edildi",
];

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [siparis, setSiparis] = useState<Siparis | null | undefined>(undefined);
  const [bekleyenDurum, setBekleyenDurum] = useState<Siparis["durum"] | null>(null);
  const { urunGetir } = useUrunler();

  useEffect(() => {
    getOrderById(id).then((veri) => setSiparis(veri));
  }, [id]);

  const handleDurumDegistir = (durum: Siparis["durum"]) => {
    if (durum === siparis?.durum) return;
    setBekleyenDurum(durum);
  };

  const handleOnay = async () => {
    if (!bekleyenDurum) return;
    const sonuc = await updateOrderStatus(id, bekleyenDurum);
    if (sonuc.success && sonuc.siparis) {
      setSiparis(sonuc.siparis);
      siparisDurumBildirimGonder(sonuc.siparis.musteri_email, sonuc.siparis.siparis_no, bekleyenDurum);
    }
    setBekleyenDurum(null);
  };

  if (siparis === undefined) return null;
  if (siparis === null) return <p className="text-stone-600">Sipariş bulunamadı.</p>;

  return (
    <div className="max-w-2xl">
      <ConfirmModal
        acik={!!bekleyenDurum}
        baslik="Sipariş durumunu değiştir"
        mesaj={`"${siparis?.durum}" → "${bekleyenDurum}" olarak değiştirmek istediğinize emin misiniz?`}
        onayMetni="Evet, değiştir"
        tehlikeli={bekleyenDurum === "İptal Edildi"}
        onOnayla={handleOnay}
        onIptal={() => setBekleyenDurum(null)}
      />
      <h1 className="text-2xl font-semibold text-stone-900">Sipariş #{siparis.siparis_no}</h1>
      <p className="mt-1 text-sm text-stone-600">
        {siparis.musteri_adi}
        {siparis.musteri_email && ` · ${siparis.musteri_email}`}
      </p>

      <div className="mt-4">
        <label htmlFor="durum" className="block text-sm font-medium text-stone-700">
          Durum
        </label>
        <select
          id="durum"
          value={siparis.durum}
          onChange={(e) => handleDurumDegistir(e.target.value as Siparis["durum"])}
          className="mt-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          {DURUMLAR.map((durum) => (
            <option key={durum} value={durum}>
              {durum}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-medium text-stone-900">Ürünler</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {siparis.urunler.map((satir) => {
            const urun = urunGetir(satir.urun_id);
            return (
              <li
                key={`${satir.urun_id}-${satir.secili_renk}-${satir.secili_boyut}`}
                className="flex justify-between text-stone-600"
              >
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
    </div>
  );
}
