"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/lib/use-session";
import { useCart } from "@/app/lib/cart-context";
import { getServerCart, mergeServerCart, saveServerCart } from "@/app/actions/cart";

export const SEPET_BIRLESTIRME_ANAHTARI = "esarp_sepet_birlestirildi";

export default function CartSessionSync() {
  const { user } = useSession();
  const { items, sepetiAyarla, setSunucuYuklendi } = useCart();
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Yalnızca kullanıcı sepeti değiştirince (load/merge'den sonra) DB'ye kaydet.
  const [kayitHazir, setKayitHazir] = useState(false);

  useEffect(() => {
    if (!user) {
      setKayitHazir(false);
      setSunucuYuklendi(true); // misafir: localStorage zaten hazır
      return;
    }

    const zatenBirlesti = sessionStorage.getItem(SEPET_BIRLESTIRME_ANAHTARI) === user.id;

    if (zatenBirlesti) {
      // Sayfa yenilemesi: localStorage boş olabilir, DB'den yükle.
      (async () => {
        const sunucuSepet = await getServerCart();
        sepetiAyarla(sunucuSepet, true);
        setSunucuYuklendi(true);
        setKayitHazir(true);
      })();
    } else {
      // İlk giriş: misafir sepetiyle DB'yi birleştir.
      setKayitHazir(false);
      (async () => {
        const birlesik = await mergeServerCart(itemsRef.current);
        sepetiAyarla(birlesik, true);
        sessionStorage.setItem(SEPET_BIRLESTIRME_ANAHTARI, user.id);
        setSunucuYuklendi(true);
        setKayitHazir(true);
      })();
    }
  }, [user, sepetiAyarla]);

  // Yalnızca yükleme/merge tamamlandıktan sonra yapılan değişiklikleri kaydet.
  useEffect(() => {
    if (!user || !kayitHazir) return;
    saveServerCart(items);
  }, [items, user, kayitHazir]);

  return null;
}
