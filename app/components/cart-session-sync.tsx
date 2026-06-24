"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/lib/use-session";
import { useCart } from "@/app/lib/cart-context";
import { getServerCart, mergeServerCart, saveServerCart } from "@/app/actions/cart";

export const SEPET_BIRLESTIRME_ANAHTARI = "esarp_sepet_birlestirildi";

export default function CartSessionSync() {
  const { user } = useSession();
  const { items, sepetiAyarla } = useCart();
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Yalnızca kullanıcı sepeti değiştirince (load/merge'den sonra) DB'ye kaydet.
  const [kayitHazir, setKayitHazir] = useState(false);

  useEffect(() => {
    if (!user) {
      setKayitHazir(false);
      return;
    }

    const zatenBirlesti = sessionStorage.getItem(SEPET_BIRLESTIRME_ANAHTARI) === user.id;

    if (zatenBirlesti) {
      // Sayfa yenilemesi: localStorage boş olabilir, DB'den yükle.
      (async () => {
        const sunucuSepet = await getServerCart();
        sepetiAyarla(sunucuSepet, true); // localStorage'a yazma
        setKayitHazir(true);
      })();
    } else {
      // İlk giriş: misafir sepetiyle DB'yi birleştir.
      setKayitHazir(false);
      (async () => {
        const birlesik = await mergeServerCart(itemsRef.current);
        sepetiAyarla(birlesik, true); // localStorage'a yazma
        sessionStorage.setItem(SEPET_BIRLESTIRME_ANAHTARI, user.id);
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
