"use client";

import { useState } from "react";
import { useAddresses } from "@/app/lib/address-context";
import AddressForm from "@/app/components/address-form";

export default function AddressesPage() {
  const { adresler, adresEkle, adresGuncelle, adresSil, varsayilanYap } = useAddresses();
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenenId, setDuzenlenenId] = useState<string | null>(null);

  const duzenlenenAdres = adresler.find((a) => a.id === duzenlenenId);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">Adreslerim</h1>
        {!formAcik && !duzenlenenId && (
          <button
            type="button"
            onClick={() => setFormAcik(true)}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            + Yeni Adres Ekle
          </button>
        )}
      </div>

      {adresler.length === 0 && !formAcik && (
        <p className="mt-4 text-sm text-stone-600">Henüz kayıtlı adresiniz yok.</p>
      )}

      <div className="mt-4 space-y-3">
        {adresler.map((adres) =>
          duzenlenenId === adres.id ? (
            <AddressForm
              key={adres.id}
              varsayilanOner
              baslangicDeger={adres}
              onVazgec={() => setDuzenlenenId(null)}
              onKaydet={async (veri) => {
                await adresGuncelle(adres.id, veri);
                setDuzenlenenId(null);
              }}
            />
          ) : (
            <div key={adres.id} className="rounded-xl border border-stone-200 p-4 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-stone-900">
                    {adres.adres_basligi} {adres.varsayilan && "· Varsayılan"}
                  </p>
                  <p className="mt-1 text-stone-600">
                    {adres.acik_adres}, {adres.mahalle}, {adres.ilce}/{adres.il}
                  </p>
                  <p className="mt-1 text-stone-500">{adres.telefon}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setDuzenlenenId(adres.id)}
                  className="font-medium text-stone-700 hover:underline"
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => adresSil(adres.id)}
                  className="font-medium text-rose-600 hover:underline"
                >
                  Sil
                </button>
                {!adres.varsayilan && (
                  <button
                    type="button"
                    onClick={() => varsayilanYap(adres.id)}
                    className="font-medium text-stone-700 hover:underline"
                  >
                    Varsayılan Yap
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {formAcik && (
        <div className="mt-4">
          <AddressForm
            varsayilanOner={adresler.length > 0}
            onVazgec={() => setFormAcik(false)}
            onKaydet={async (veri) => {
              await adresEkle({ ...veri, varsayilan: veri.varsayilan || adresler.length === 0 });
              setFormAcik(false);
            }}
          />
        </div>
      )}

      {duzenlenenAdres === undefined && duzenlenenId && (
        <p className="mt-4 text-sm text-rose-600">Adres bulunamadı.</p>
      )}
    </div>
  );
}
