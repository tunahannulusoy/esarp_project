"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SepetUrun } from "@/app/types";

const STORAGE_KEY = "esarp_sepet";

type CartContextValue = {
  items: SepetUrun[];
  yuklendi: boolean;
  toplamAdet: number;
  sepeteEkle: (item: SepetUrun) => void;
  sepettenCikar: (urunId: string, renk: string, boyut: string) => void;
  adetGuncelle: (urunId: string, renk: string, boyut: string, adet: number) => void;
  sepetiTemizle: () => void;
  sepetteMi: (urunId: string) => boolean;
  sepetiDisaridanBirlestir: (sunucuOgeleri: SepetUrun[]) => void;
  sepetiAyarla: (items: SepetUrun[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function ayniOge(a: SepetUrun, urunId: string, renk: string, boyut: string) {
  return a.urun_id === urunId && a.secili_renk === renk && a.secili_boyut === boyut;
}

export function sepetleriBirlestir(a: SepetUrun[], b: SepetUrun[]): SepetUrun[] {
  const birlesik = [...a];
  b.forEach((oge) => {
    const index = birlesik.findIndex((o) => ayniOge(o, oge.urun_id, oge.secili_renk, oge.secili_boyut));
    if (index === -1) {
      birlesik.push(oge);
    } else {
      birlesik[index] = { ...birlesik[index], adet: birlesik[index].adet + oge.adet };
    }
  });
  return birlesik;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SepetUrun[]>([]);
  const [yuklendi, setYuklendi] = useState(false);

  useEffect(() => {
    try {
      const ham = localStorage.getItem(STORAGE_KEY);
      if (ham) {
        const parsed: SepetUrun[] = JSON.parse(ham);
        // Eski mock ID'leri (urun-1, urun-2 ...) içeren bozuk veriyi temizle
        const gecerli = parsed.filter((o) => /^[0-9a-f-]{36}$/i.test(o.urun_id));
        setItems(gecerli);
      }
    } catch {
      // localStorage erişilemezse sessizce boş sepetle devam et
    } finally {
      setYuklendi(true);
    }
  }, []);

  useEffect(() => {
    if (!yuklendi) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, yuklendi]);

  const sepeteEkle = useCallback((item: SepetUrun) => {
    setItems((mevcut) => {
      const index = mevcut.findIndex((o) => ayniOge(o, item.urun_id, item.secili_renk, item.secili_boyut));
      if (index === -1) return [...mevcut, item];
      const kopya = [...mevcut];
      kopya[index] = { ...kopya[index], adet: kopya[index].adet + item.adet };
      return kopya;
    });
  }, []);

  const sepettenCikar = useCallback((urunId: string, renk: string, boyut: string) => {
    setItems((mevcut) => mevcut.filter((o) => !ayniOge(o, urunId, renk, boyut)));
  }, []);

  const adetGuncelle = useCallback((urunId: string, renk: string, boyut: string, adet: number) => {
    setItems((mevcut) =>
      mevcut.map((o) => (ayniOge(o, urunId, renk, boyut) ? { ...o, adet: Math.max(1, adet) } : o))
    );
  }, []);

  const sepetiTemizle = useCallback(() => setItems([]), []);

  const sepetteMi = useCallback((urunId: string) => items.some((o) => o.urun_id === urunId), [items]);

  const sepetiDisaridanBirlestir = useCallback((sunucuOgeleri: SepetUrun[]) => {
    setItems((mevcut) => {
      const birlesik = [...mevcut];
      sunucuOgeleri.forEach((sunucuOge) => {
        const index = birlesik.findIndex((o) =>
          ayniOge(o, sunucuOge.urun_id, sunucuOge.secili_renk, sunucuOge.secili_boyut)
        );
        if (index === -1) {
          birlesik.push(sunucuOge);
        } else {
          birlesik[index] = { ...birlesik[index], adet: birlesik[index].adet + sunucuOge.adet };
        }
      });
      return birlesik;
    });
  }, []);

  const sepetiAyarla = useCallback((yeniItems: SepetUrun[]) => setItems(yeniItems), []);

  const toplamAdet = useMemo(() => items.reduce((acc, o) => acc + o.adet, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      yuklendi,
      toplamAdet,
      sepeteEkle,
      sepettenCikar,
      adetGuncelle,
      sepetiTemizle,
      sepetteMi,
      sepetiDisaridanBirlestir,
      sepetiAyarla,
    }),
    [
      items,
      yuklendi,
      toplamAdet,
      sepeteEkle,
      sepettenCikar,
      adetGuncelle,
      sepetiTemizle,
      sepetteMi,
      sepetiDisaridanBirlestir,
      sepetiAyarla,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
