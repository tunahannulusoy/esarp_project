"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "esarp_favoriler";

type FavoritesContextValue = {
  favoriUrunIdleri: string[];
  favoriMi: (urunId: string) => boolean;
  favoriEkleCikar: (urunId: string) => void;
  favorilerdenCikar: (urunId: string) => void;
  favorileriTemizle: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriUrunIdleri, setFavoriUrunIdleri] = useState<string[]>([]);
  const [yuklendi, setYuklendi] = useState(false);

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

  const favoriEkleCikar = useCallback((urunId: string) => {
    setFavoriUrunIdleri((mevcut) =>
      mevcut.includes(urunId) ? mevcut.filter((id) => id !== urunId) : [...mevcut, urunId]
    );
  }, []);

  const favorilerdenCikar = useCallback((urunId: string) => {
    setFavoriUrunIdleri((mevcut) => mevcut.filter((id) => id !== urunId));
  }, []);

  const favorileriTemizle = useCallback(() => setFavoriUrunIdleri([]), []);

  const value = useMemo(
    () => ({ favoriUrunIdleri, favoriMi, favoriEkleCikar, favorilerdenCikar, favorileriTemizle }),
    [favoriUrunIdleri, favoriMi, favoriEkleCikar, favorilerdenCikar, favorileriTemizle]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites, FavoritesProvider içinde kullanılmalı");
  return ctx;
}
