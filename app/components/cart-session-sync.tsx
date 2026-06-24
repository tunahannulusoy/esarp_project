"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/lib/use-session";
import { useCart } from "@/app/lib/cart-context";
import { getServerCart, mergeServerCart, saveServerCart } from "@/app/actions/cart";
import type { SepetUrun } from "@/app/types";

const STORAGE_KEY = "esarp_sepet";
export const SEPET_BIRLESTIRME_ANAHTARI = "esarp_sepet_birlestirildi";

function yerelSepetOku(): SepetUrun[] {
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    if (!ham) return [];
    const parsed: SepetUrun[] = JSON.parse(ham);
    return parsed.filter((o) => /^[0-9a-f-]{36}$/i.test(o.urun_id));
  } catch {
    return [];
  }
}

export default function CartSessionSync() {
  const { user } = useSession();
  const { items, setItems, setSunucuYuklendi } = useCart();
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // kayitHazir: ilk yükleme/merge bitti, bundan sonraki değişiklikler persist edilmeli
  const [kayitHazir, setKayitHazir] = useState(false);
  // hangi moda kayıt yapıyoruz
  const [mod, setMod] = useState<"yerel" | "sunucu" | null>(null);
  const prevUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const userId = user?.id ?? null;
    if (userId === prevUserId.current) return;
    prevUserId.current = userId;

    setKayitHazir(false);
    setSunucuYuklendi(false);

    if (!user) {
      // Misafir: localStorage'dan yükle
      const yerel = yerelSepetOku();
      setItems(yerel);
      setMod("yerel");
      setSunucuYuklendi(true);
      setKayitHazir(true);
      return;
    }

    // Giriş yapmış kullanıcı
    const zatenBirlesti = sessionStorage.getItem(SEPET_BIRLESTIRME_ANAHTARI) === user.id;

    (async () => {
      if (zatenBirlesti) {
        // Sayfa yenilemesi: DB'den yükle
        const sunucuSepet = await getServerCart();
        setItems(sunucuSepet);
      } else {
        // İlk giriş: misafir sepetini DB ile birleştir
        const yerel = yerelSepetOku();
        const birlesik = await mergeServerCart(yerel);
        setItems(birlesik);
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.setItem(SEPET_BIRLESTIRME_ANAHTARI, user.id);
      }
      setMod("sunucu");
      setSunucuYuklendi(true);
      setKayitHazir(true);
    })();
  }, [user, setItems, setSunucuYuklendi]);

  // İlk yüklemeden sonraki tüm değişiklikleri persist et
  useEffect(() => {
    if (!kayitHazir) return;
    if (mod === "yerel") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } else if (mod === "sunucu") {
      saveServerCart(items);
    }
  }, [items, kayitHazir, mod]);

  return null;
}
