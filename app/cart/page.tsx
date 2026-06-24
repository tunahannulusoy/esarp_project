"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/lib/cart-context";
import { fiyatFormatla } from "@/app/lib/utils";
import { indirimliFiyatHesapla } from "@/app/lib/utils";
import { useUrunler } from "@/app/lib/use-urunler";
import { useSession } from "@/app/lib/use-session";
import AuthModal from "@/app/components/auth-modal";

const KARGO_UCRETI = 49.9;
const UCRETSIZ_KARGO_ESIGI = 500;

export default function CartPage() {
  const { items, sepettenCikar, adetGuncelle } = useCart();
  const { girisYapilmis } = useSession();
  const { urunGetir } = useUrunler();
  const router = useRouter();
  const [modalAcik, setModalAcik] = useState(false);

  const handleSiparisOlustur = () => {
    if (girisYapilmis) {
      router.push("/checkout");
    } else {
      setModalAcik(true);
    }
  };

  const sepetOgeleri = useMemo(
    () =>
      items
        .map((item) => {
          const urun = urunGetir(item.urun_id);
          if (!urun) return null;
          return { ...item, urun };
        })
        .filter((o): o is NonNullable<typeof o> => o !== null),
    [items, urunGetir]
  );

  const urunlerToplami = sepetOgeleri.reduce((acc, oge) => {
    const fiyat = indirimliFiyatHesapla(oge.urun.fiyat, oge.urun.indirim_orani);
    return acc + fiyat * oge.adet;
  }, 0);

  const kargoUcreti = sepetOgeleri.length === 0 || urunlerToplami >= UCRETSIZ_KARGO_ESIGI ? 0 : KARGO_UCRETI;
  const toplamTutar = urunlerToplami + kargoUcreti;

  if (sepetOgeleri.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-stone-600">Sepetiniz boş.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">Sepetim</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {sepetOgeleri.map((oge) => {
            const fiyat = indirimliFiyatHesapla(oge.urun.fiyat, oge.urun.indirim_orani);
            const resim = oge.urun.resim_linkler[0]?.url;
            return (
              <div
                key={`${oge.urun_id}-${oge.secili_renk}-${oge.secili_boyut}`}
                className="flex gap-4 rounded-xl border border-stone-200 p-4"
              >
                <Link href={`/products/${oge.urun.id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {resim && <Image src={resim} alt={oge.urun.ad} fill sizes="96px" className="object-cover" />}
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/products/${oge.urun.id}`} className="font-medium text-stone-900 hover:underline">
                        {oge.urun.ad}
                      </Link>
                      <p className="mt-1 text-xs text-stone-500">
                        Renk: {oge.secili_renk} · Boyut: {oge.secili_boyut}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => sepettenCikar(oge.urun_id, oge.secili_renk, oge.secili_boyut)}
                      className="text-xs text-stone-500 hover:text-rose-600"
                    >
                      Kaldır
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-stone-300">
                      <button
                        type="button"
                        onClick={() =>
                          adetGuncelle(oge.urun_id, oge.secili_renk, oge.secili_boyut, oge.adet - 1)
                        }
                        className="px-2.5 py-1 text-sm"
                        aria-label="Adeti azalt"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{oge.adet}</span>
                      <button
                        type="button"
                        onClick={() =>
                          adetGuncelle(oge.urun_id, oge.secili_renk, oge.secili_boyut, oge.adet + 1)
                        }
                        className="px-2.5 py-1 text-sm"
                        aria-label="Adeti artır"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-medium text-stone-900">{fiyatFormatla(fiyat * oge.adet)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-fit rounded-xl border border-stone-200 p-6">
          <h2 className="text-lg font-medium text-stone-900">Sipariş Özeti</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-600">Ürünler Toplamı</dt>
              <dd>{fiyatFormatla(urunlerToplami)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-600">Kargo Ücreti</dt>
              <dd>{kargoUcreti === 0 ? "Ücretsiz" : fiyatFormatla(kargoUcreti)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-semibold text-stone-900">
              <dt>Toplam Tutar</dt>
              <dd>{fiyatFormatla(toplamTutar)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleSiparisOlustur}
            className="mt-6 w-full rounded-lg bg-stone-900 py-2.5 text-center text-sm font-medium text-white hover:bg-stone-700"
          >
            Sipariş Oluştur
          </button>
          <Link
            href="/"
            className="mt-2 block rounded-lg border border-stone-300 py-2.5 text-center text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>

      <AuthModal acik={modalAcik} onKapat={() => setModalAcik(false)} hedefYol="/checkout" />
    </div>
  );
}
