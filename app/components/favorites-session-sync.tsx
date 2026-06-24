"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/app/lib/use-session";
import { useFavorites } from "@/app/lib/favorites-context";
import { getServerFavorites, syncFavorites } from "@/app/actions/favorites";

export default function FavoritesSessionSync() {
  const { user } = useSession();
  const { favoriUrunIdleri, favoriDisaridanBirlestir } = useFavorites();
  const favorilerRef = useRef(favoriUrunIdleri);
  favorilerRef.current = favoriUrunIdleri;

  // Sepetin aksine burada "zaten birleştirdim mi" kilidi yok: bu birleştirme
  // tamamen idempotent (Set tabanlı birleşim + ignoreDuplicates upsert),
  // yani birden çok kez çalışması veriyi bozmaz. Bir kilit kullanmak (önceki
  // sürümde olduğu gibi) tam tersi bir riski doğuruyordu — giriş sonrası ilk
  // deneme cookie'lerin tam oturmadığı bir anda boş sonuç dönerse, kilit yine
  // de kalıcı olarak "tamamlandı" sayılıp gerçek favoriler bir daha hiç
  // çekilmiyordu (sayfa yenilenene kadar). user değiştikçe yeniden denenmesi
  // güvenli ve gerekli.
  useEffect(() => {
    if (!user) return;

    (async () => {
      const sunucuFavorileri = await getServerFavorites();
      const yereldeOlupSunucudaOlmayanlar = favorilerRef.current.filter((id) => !sunucuFavorileri.includes(id));

      if (sunucuFavorileri.length > 0) {
        favoriDisaridanBirlestir(sunucuFavorileri);
      }
      if (yereldeOlupSunucudaOlmayanlar.length > 0) {
        await syncFavorites(yereldeOlupSunucudaOlmayanlar);
      }
      localStorage.removeItem("esarp_favoriler");
    })();
  }, [user, favoriDisaridanBirlestir]);

  return null;
}
