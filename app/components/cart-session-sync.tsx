"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/app/lib/use-session";
import { useCart } from "@/app/lib/cart-context";
import { sepetleriBirlestir } from "@/app/lib/cart-context";
import { getServerCart, saveServerCart } from "@/app/actions/cart";

export default function CartSessionSync() {
  const { user } = useSession();
  const { items, sepetiDisaridanBirlestir } = useCart();
  const birlestirilenKullaniciId = useRef<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    if (!user || birlestirilenKullaniciId.current === user.id) return;
    birlestirilenKullaniciId.current = user.id;

    (async () => {
      const sunucuSepeti = await getServerCart();
      if (sunucuSepeti.length === 0) return;

      const birlesik = sepetleriBirlestir(itemsRef.current, sunucuSepeti);
      sepetiDisaridanBirlestir(sunucuSepeti);
      await saveServerCart(birlesik);
    })();
  }, [user, sepetiDisaridanBirlestir]);

  useEffect(() => {
    if (!user || birlestirilenKullaniciId.current !== user.id) return;
    saveServerCart(items);
  }, [items, user]);

  return null;
}
