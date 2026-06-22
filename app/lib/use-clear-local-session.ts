"use client";

import { useCallback } from "react";
import { useCart } from "@/app/lib/cart-context";
import { useFavorites } from "@/app/lib/favorites-context";
import { useAddresses } from "@/app/lib/address-context";
import { useProfile, VARSAYILAN_PROFIL } from "@/app/lib/profile-context";

/**
 * Çıkış yapıldığında, bu tarayıcıda biriken sepet/favori/adres/profil
 * verilerini temizler. Paylaşılan cihazlarda bir önceki kullanıcının
 * verilerinin görünmesini önler.
 */
export function useClearLocalSession() {
  const { sepetiTemizle } = useCart();
  const { favorileriTemizle } = useFavorites();
  const { adresleriTemizle } = useAddresses();
  const { profilGuncelle } = useProfile();

  return useCallback(() => {
    sepetiTemizle();
    favorileriTemizle();
    adresleriTemizle();
    profilGuncelle(VARSAYILAN_PROFIL);
  }, [sepetiTemizle, favorileriTemizle, adresleriTemizle, profilGuncelle]);
}
