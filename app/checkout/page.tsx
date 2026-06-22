"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/lib/cart-context";
import { useAddresses } from "@/app/lib/address-context";
import { indirimliFiyatHesapla, urunGetir } from "@/app/lib/mock-data";
import { fiyatFormatla } from "@/app/lib/utils";
import { kargoUcretiHesapla, tahminiTeslimatGunSayisiHesapla } from "@/app/lib/turkiye-iller";
import { siparisOlustur } from "@/app/lib/orders";
import { siparisOlusturulduBildirimGonder } from "@/app/actions/orders";
import AddressForm from "@/app/components/address-form";
import { useSession } from "@/app/lib/use-session";
import SignInModal from "@/app/components/sign-in-modal";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, sepetiTemizle } = useCart();
  const { adresler, adresEkle } = useAddresses();
  const { girisYapilmis, yukleniyor, user } = useSession();

  const [seciliAdresId, setSeciliAdresId] = useState<string | null>(
    adresler.find((a) => a.varsayilan)?.id ?? adresler[0]?.id ?? null
  );
  const [formAcik, setFormAcik] = useState(adresler.length === 0);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const sepetOgeleri = useMemo(
    () =>
      items
        .map((item) => {
          const urun = urunGetir(item.urun_id);
          return urun ? { ...item, urun } : null;
        })
        .filter((o): o is NonNullable<typeof o> => o !== null),
    [items]
  );

  const seciliAdres = adresler.find((a) => a.id === seciliAdresId) ?? null;

  const urunlerToplami = sepetOgeleri.reduce((acc, oge) => {
    const fiyat = indirimliFiyatHesapla(oge.urun.fiyat, oge.urun.indirim_orani);
    return acc + fiyat * oge.adet;
  }, 0);

  const kargoUcreti = seciliAdres ? kargoUcretiHesapla(seciliAdres.il) : null;
  const toplamTutar = urunlerToplami + (kargoUcreti ?? 0);

  const handleSiparisOlustur = () => {
    if (!seciliAdres || sepetOgeleri.length === 0) return;
    setGonderiliyor(true);
    const siparis = siparisOlustur(sepetOgeleri, seciliAdres, user?.email ?? null);
    sepetiTemizle();

    const adresMetni = `${seciliAdres.acik_adres}, ${seciliAdres.mahalle}, ${seciliAdres.ilce}/${seciliAdres.il}`;
    siparisOlusturulduBildirimGonder(siparis, adresMetni);

    router.push(`/checkout/confirmation?id=${siparis.id}`);
  };

  if (sepetOgeleri.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-stone-600">Sepetiniz boş, sipariş oluşturamazsınız.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    );
  }

  if (!yukleniyor && !girisYapilmis) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-stone-600">Sipariş oluşturmak için giriş yapmalısınız.</p>
        <SignInModal acik onKapat={() => router.push("/cart")} hedefYol="/checkout" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">Adres &amp; Teslimat Bilgileri</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section>
            <h2 className="text-lg font-medium text-stone-900">Teslimat Adresi</h2>

            {adresler.length > 0 && (
              <div className="mt-3 space-y-3">
                {adresler.map((adres) => (
                  <label
                    key={adres.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                      seciliAdresId === adres.id ? "border-stone-900" : "border-stone-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="adres"
                      checked={seciliAdresId === adres.id}
                      onChange={() => setSeciliAdresId(adres.id)}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-stone-900">
                        {adres.adres_basligi} {adres.varsayilan && "· Varsayılan"}
                      </p>
                      <p className="mt-1 text-stone-600">
                        {adres.acik_adres}, {adres.mahalle}, {adres.ilce}/{adres.il}
                      </p>
                      <p className="mt-1 text-stone-500">{adres.telefon}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {!formAcik && (
              <button
                type="button"
                onClick={() => setFormAcik(true)}
                className="mt-3 text-sm font-medium text-stone-900 hover:underline"
              >
                + Yeni Adres Ekle
              </button>
            )}

            {formAcik && (
              <div className="mt-4">
                <AddressForm
                  varsayilanOner={adresler.length > 0}
                  onVazgec={adresler.length > 0 ? () => setFormAcik(false) : undefined}
                  onKaydet={(veri) => {
                    const yeniAdres = adresEkle({ ...veri, varsayilan: veri.varsayilan || adresler.length === 0 });
                    setSeciliAdresId(yeniAdres.id);
                    setFormAcik(false);
                  }}
                />
              </div>
            )}
          </section>

          {seciliAdres && (
            <section className="rounded-xl border border-stone-200 p-4">
              <h2 className="text-lg font-medium text-stone-900">Kargo Bilgileri</h2>
              <dl className="mt-2 space-y-1 text-sm text-stone-600">
                <div className="flex justify-between">
                  <dt>Kargo Ücreti</dt>
                  <dd>{fiyatFormatla(kargoUcreti ?? 0)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Tahmini Teslimat Süresi</dt>
                  <dd>{tahminiTeslimatGunSayisiHesapla(seciliAdres.il)} iş günü</dd>
                </div>
              </dl>
            </section>
          )}

          <section className="rounded-xl border border-stone-200 p-4">
            <h2 className="text-lg font-medium text-stone-900">Ödeme Yöntemi</h2>
            <label className="mt-3 flex items-center gap-3 rounded-lg border border-stone-900 p-3 text-sm">
              <input type="radio" name="odeme" checked readOnly />
              Banka Transferi / Havale
            </label>
            <p className="mt-2 text-xs text-stone-500">
              Siparişiniz onaylandıktan sonra WhatsApp üzerinden havale bilgileri iletilecektir.
            </p>
          </section>
        </div>

        <div className="h-fit rounded-xl border border-stone-200 p-6">
          <h2 className="text-lg font-medium text-stone-900">Sipariş Özeti</h2>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            {sepetOgeleri.map((oge) => (
              <li key={`${oge.urun_id}-${oge.secili_renk}-${oge.secili_boyut}`} className="flex justify-between">
                <span className="line-clamp-1">
                  {oge.urun.ad} x{oge.adet}
                </span>
                <span>
                  {fiyatFormatla(indirimliFiyatHesapla(oge.urun.fiyat, oge.urun.indirim_orani) * oge.adet)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-600">Ürünler Toplamı</dt>
              <dd>{fiyatFormatla(urunlerToplami)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-600">Kargo Ücreti</dt>
              <dd>{kargoUcreti !== null ? fiyatFormatla(kargoUcreti) : "Adres seçin"}</dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-semibold text-stone-900">
              <dt>Toplam Tutar</dt>
              <dd>{fiyatFormatla(toplamTutar)}</dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={!seciliAdres || gonderiliyor}
            onClick={handleSiparisOlustur}
            className="mt-6 w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {gonderiliyor ? "Sipariş oluşturuluyor..." : "Siparişi Onayla"}
          </button>
        </div>
      </div>
    </div>
  );
}
