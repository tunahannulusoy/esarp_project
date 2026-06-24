"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/lib/use-session";
import { useCart } from "@/app/lib/cart-context";
import { mergeServerCart, saveServerCart } from "@/app/actions/cart";

export const SEPET_BIRLESTIRME_ANAHTARI = "esarp_sepet_birlestirildi";

export default function CartSessionSync() {
  const { user } = useSession();
  const { items, sepetiAyarla } = useCart();
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Giriş yapılınca yerel sepet sunucuyla tek atomik istekte birleştirilene
  // kadar otomatik kaydetme effect'i devre dışı kalır. Aksi halde, sunucu
  // henüz cevap vermeden tetiklenen bir kaydetme, eski/yarım sepeti
  // sunucuya geri yazıp asıl veriyi ezebilir.
  const [birlestirmeHazir, setBirlestirmeHazir] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Bu bayrak sessionStorage'da tutuluyor (useRef değil) çünkü bir
    // useRef, sayfa her yenilendiğinde sıfırlanır — bu da zaten birleşmiş
    // sepeti her refresh'te yeniden "birleştirip" adetleri tekrar tekrar
    // toplamaya (her yenilemede ürün sayısının artmasına) yol açıyordu.
    // sessionStorage aynı sekme/oturum boyunca kalıcı, gerçek çıkışta
    // (useClearLocalSession) temizleniyor.
    if (sessionStorage.getItem(SEPET_BIRLESTIRME_ANAHTARI) === user.id) {
      setBirlestirmeHazir(true);
      return;
    }

    setBirlestirmeHazir(false);

    (async () => {
      const birlesik = await mergeServerCart(itemsRef.current);
      sepetiAyarla(birlesik);
      localStorage.removeItem("esarp_sepet");
      sessionStorage.setItem(SEPET_BIRLESTIRME_ANAHTARI, user.id);
      setBirlestirmeHazir(true);
    })();
  }, [user, sepetiAyarla]);

  useEffect(() => {
    if (!user || !birlestirmeHazir) return;
    saveServerCart(items);
  }, [items, user, birlestirmeHazir]);

  return null;
}
