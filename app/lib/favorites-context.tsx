"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useSession } from "@/app/lib/use-session";
import { addServerFavorite, removeServerFavorite } from "@/app/actions/favorites";

type FavoritesContextValue = {
  favoriUrunIdleri: string[];
  yuklendi: boolean;
  favoriMi: (urunId: string) => boolean;
  favoriEkleCikar: (urunId: string) => void;
  favorilerdenCikar: (urunId: string) => void;
  favorileriTemizle: () => void;
  setFavoriler: (idler: string[]) => void;
  setYuklendi: (v: boolean) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriUrunIdleri, setFavoriUrunIdleri] = useState<string[]>([]);
  const [yuklendi, setYuklendi] = useState(false);
  const { girisYapilmis } = useSession();

  const favoriMi = useCallback((urunId: string) => favoriUrunIdleri.includes(urunId), [favoriUrunIdleri]);

  const favoriEkleCikar = useCallback(
    (urunId: string) => {
      setFavoriUrunIdleri((mevcut) => {
        const eklenecek = !mevcut.includes(urunId);
        if (girisYapilmis) {
          if (eklenecek) addServerFavorite(urunId);
          else removeServerFavorite(urunId);
        }
        return eklenecek ? [...mevcut, urunId] : mevcut.filter((id) => id !== urunId);
      });
    },
    [girisYapilmis]
  );

  const favorilerdenCikar = useCallback(
    (urunId: string) => {
      if (girisYapilmis) removeServerFavorite(urunId);
      setFavoriUrunIdleri((mevcut) => mevcut.filter((id) => id !== urunId));
    },
    [girisYapilmis]
  );

  const favorileriTemizle = useCallback(() => setFavoriUrunIdleri([]), []);

  const setFavoriler = useCallback((idler: string[]) => setFavoriUrunIdleri(idler), []);

  const value = useMemo(
    () => ({
      favoriUrunIdleri,
      yuklendi,
      favoriMi,
      favoriEkleCikar,
      favorilerdenCikar,
      favorileriTemizle,
      setFavoriler,
      setYuklendi,
    }),
    [favoriUrunIdleri, yuklendi, favoriMi, favoriEkleCikar, favorilerdenCikar, favorileriTemizle, setFavoriler]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites, FavoritesProvider içinde kullanılmalı");
  return ctx;
}
