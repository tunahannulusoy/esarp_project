"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/app/lib/use-session";
import { useFavorites } from "@/app/lib/favorites-context";
import { getServerFavorites, syncFavorites } from "@/app/actions/favorites";

export default function FavoritesSessionSync() {
  const { user } = useSession();
  const { favoriUrunIdleri, favoriDisaridanBirlestir } = useFavorites();
  const birlestirilenKullaniciId = useRef<string | null>(null);
  const favorilerRef = useRef(favoriUrunIdleri);
  favorilerRef.current = favoriUrunIdleri;

  useEffect(() => {
    if (!user || birlestirilenKullaniciId.current === user.id) return;
    birlestirilenKullaniciId.current = user.id;

    (async () => {
      const sunucuFavorileri = await getServerFavorites();
      const yereldeOlupSunucudaOlmayanlar = favorilerRef.current.filter((id) => !sunucuFavorileri.includes(id));

      if (sunucuFavorileri.length > 0) {
        favoriDisaridanBirlestir(sunucuFavorileri);
      }
      if (yereldeOlupSunucudaOlmayanlar.length > 0) {
        await syncFavorites(yereldeOlupSunucudaOlmayanlar);
      }
    })();
  }, [user, favoriDisaridanBirlestir]);

  return null;
}
