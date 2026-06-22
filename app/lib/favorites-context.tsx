"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "@/app/lib/use-session";
import { addServerFavorite, removeServerFavorite } from "@/app/actions/favorites";

const STORAGE_KEY = "esarp_favoriler";

type FavoritesContextValue = {
  favoriUrunIdleri: string[];
  favoriMi: (urunId: string) => boolean;
  favoriEkleCikar: (urunId: string) => void;
  favorilerdenCikar: (urunId: string) => void;
  favorileriTemizle: () => void;
  favoriDisaridanBirlestir: (sunucuUrunIdleri: string[]) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriUrunIdleri, setFavoriUrunIdleri] = useState<string[]>([]);
  const [yuklendi, setYuklendi] = useState(false);
  const { girisYapilmis } = useSession();

  useEffect(() => {
    try {
      const ham = localStorage.getItem(STORAGE_KEY);
      if (ham) setFavoriUrunIdleri(JSON.parse(ham));
    } catch {
      // localStorage erişilemezse boş listeyle devam et
    } finally {
      setYuklendi(true);
    }
  }, []);

  useEffect(() => {
    if (!yuklendi) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriUrunIdleri));
  }, [favoriUrunIdleri, yuklendi]);

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

  const favoriDisaridanBirlestir = useCallback((sunucuUrunIdleri: string[]) => {
    setFavoriUrunIdleri((mevcut) => Array.from(new Set([...mevcut, ...sunucuUrunIdleri])));
  }, []);

  const value = useMemo(
    () => ({
      favoriUrunIdleri,
      favoriMi,
      favoriEkleCikar,
      favorilerdenCikar,
      favorileriTemizle,
      favoriDisaridanBirlestir,
    }),
    [favoriUrunIdleri, favoriMi, favoriEkleCikar, favorilerdenCikar, favorileriTemizle, favoriDisaridanBirlestir]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites, FavoritesProvider içinde kullanılmalı");
  return ctx;
}
