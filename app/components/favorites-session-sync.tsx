"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/app/lib/use-session";
import { useFavorites } from "@/app/lib/favorites-context";
import { getServerFavorites, syncFavorites } from "@/app/actions/favorites";

const STORAGE_KEY = "esarp_favoriler";
const BIRLESTIRME_ANAHTARI = "esarp_favoriler_birlestirildi";

function yerelFavorileriOku(): string[] {
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    return ham ? (JSON.parse(ham) as string[]) : [];
  } catch {
    return [];
  }
}

export default function FavoritesSessionSync() {
  const { user } = useSession();
  const { favoriUrunIdleri, setFavoriler, setYuklendi } = useFavorites();

  const [mod, setMod] = useState<"yerel" | "sunucu" | null>(null);
  const [kayitHazir, setKayitHazir] = useState(false);
  const prevUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const userId = user?.id ?? null;
    if (userId === prevUserId.current) return;
    prevUserId.current = userId;

    setKayitHazir(false);
    setYuklendi(false);

    if (!user) {
      // Misafir: localStorage'dan yükle
      setFavoriler(yerelFavorileriOku());
      setMod("yerel");
      setYuklendi(true);
      setKayitHazir(true);
      return;
    }

    const zatenBirlesti = sessionStorage.getItem(BIRLESTIRME_ANAHTARI) === user.id;

    (async () => {
      const sunucuFavorileri = await getServerFavorites();

      if (!zatenBirlesti) {
        // İlk giriş: misafir favorilerini DB ile birleştir
        const yerel = yerelFavorileriOku();
        const birlesik = await syncFavorites(yerel);
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.setItem(BIRLESTIRME_ANAHTARI, user.id);
        setFavoriler(birlesik);
      } else {
        // Sayfa yenilemesi: DB'den yükle
        setFavoriler(sunucuFavorileri);
      }

      setMod("sunucu");
      setYuklendi(true);
      setKayitHazir(true);
    })();
  }, [user, setFavoriler, setYuklendi]);

  // Misafir: favori listesi değişince localStorage'a yaz
  useEffect(() => {
    if (!kayitHazir || mod !== "yerel") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriUrunIdleri));
  }, [favoriUrunIdleri, kayitHazir, mod]);

  return null;
}
