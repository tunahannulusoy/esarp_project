"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/lib/use-session";
import { useCart } from "@/app/lib/cart-context";
import { mergeServerCart, saveServerCart } from "@/app/actions/cart";

export default function CartSessionSync() {
  const { user } = useSession();
  const { items, sepetiAyarla } = useCart();
  const birlestirilenKullaniciId = useRef<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Giriş yapılınca yerel sepet sunucuyla tek atomik istekte birleştirilene
  // kadar otomatik kaydetme effect'i devre dışı kalır. Aksi halde, sunucu
  // henüz cevap vermeden tetiklenen bir kaydetme, eski/yarım sepeti
  // sunucuya geri yazıp asıl veriyi ezebilir.
  const [birlestirmeHazir, setBirlestirmeHazir] = useState(false);

  useEffect(() => {
    if (!user || birlestirilenKullaniciId.current === user.id) return;
    birlestirilenKullaniciId.current = user.id;
    setBirlestirmeHazir(false);

    (async () => {
      const birlesik = await mergeServerCart(itemsRef.current);
      sepetiAyarla(birlesik);
      setBirlestirmeHazir(true);
    })();
  }, [user, sepetiAyarla]);

  useEffect(() => {
    if (!user || !birlestirmeHazir) return;
    saveServerCart(items);
  }, [items, user, birlestirmeHazir]);

  return null;
}
