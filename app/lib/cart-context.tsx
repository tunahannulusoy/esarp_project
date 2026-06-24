"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { SepetUrun } from "@/app/types";

type CartContextValue = {
  items: SepetUrun[];
  sunucuYuklendi: boolean;
  toplamAdet: number;
  sepeteEkle: (item: SepetUrun) => void;
  sepettenCikar: (urunId: string, renk: string, boyut: string) => void;
  adetGuncelle: (urunId: string, renk: string, boyut: string, adet: number) => void;
  sepetiTemizle: () => void;
  sepetteMi: (urunId: string) => boolean;
  setItems: (items: SepetUrun[]) => void;
  setSunucuYuklendi: (v: boolean) => void;
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
  const [sunucuYuklendi, setSunucuYuklendi] = useState(false);

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

  const toplamAdet = useMemo(() => items.reduce((acc, o) => acc + o.adet, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      sunucuYuklendi,
      toplamAdet,
      sepeteEkle,
      sepettenCikar,
      adetGuncelle,
      sepetiTemizle,
      sepetteMi,
      setItems,
      setSunucuYuklendi,
    }),
    [items, sunucuYuklendi, toplamAdet, sepeteEkle, sepettenCikar, adetGuncelle, sepetiTemizle, sepetteMi]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
