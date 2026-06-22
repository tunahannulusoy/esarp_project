"use client";

import { useCallback } from "react";
import { useCart } from "@/app/lib/cart-context";
import { useFavorites } from "@/app/lib/favorites-context";
import { SEPET_BIRLESTIRME_ANAHTARI } from "@/app/components/cart-session-sync";

/**
 * Çıkış yapıldığında, bu tarayıcıda biriken (guest) sepet/favori verilerini
 * temizler ki paylaşılan cihazlarda bir sonraki ziyaretçi önceki kullanıcının
 * verilerini görmesin. Profil/adres/sipariş artık Supabase'de kullanıcıya
 * bağlı olduğu için burada "temizlenmez" — çıkış sonrası ilgili context'ler
 * zaten oturumsuz durumu (boş/varsayılan) kendiliğinden yansıtır.
 */
export function useClearLocalSession() {
  const { sepetiTemizle } = useCart();
  const { favorileriTemizle } = useFavorites();

  return useCallback(() => {
    sepetiTemizle();
    favorileriTemizle();
    sessionStorage.removeItem(SEPET_BIRLESTIRME_ANAHTARI);
  }, [sepetiTemizle, favorileriTemizle]);
}
